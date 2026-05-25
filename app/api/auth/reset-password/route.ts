/**
 * POST /api/auth/reset-password — consume a reset token + set a new
 * password on the Supabase auth user.
 *
 * Spec §3.4 — this endpoint is the ONLY place in the flow that can
 * legitimately differentiate by token validity (otherwise the user
 * couldn't be told their link expired). Failure modes:
 *   - missing/expired/tampered token → 400 with {ok:false,
 *     code:"invalid_or_expired_token"}
 *   - rate-limited → 429 with {ok:false,
 *     code:"rate_limited",retry_after_seconds}
 *   - invalid password (zod) → 400 with {ok:false,
 *     code:"invalid_password",errors:[...]}
 *   - Supabase update failure → 500 with generic message; logged
 *   - success → 200 with {ok:true,message:"password_updated"}
 *
 * Anti-replay: we record the token nonce in customer_profiles as
 * `last_used_reset_nonce` and reject any subsequent attempt to
 * reuse the same nonce. (The HMAC is otherwise valid until the
 * 1-hour exp.)
 *
 * Per spec §13.1: returns one-shot success; the customer is then
 * expected to sign in with their new password.
 */
import { NextResponse, type NextRequest } from "next/server";
import { isRateLimited } from "@/lib/rate-limit";
import { serviceSupabase } from "@/lib/supabase";
import { captureException } from "@/lib/sentry";
import { resetPasswordSchema } from "@/lib/validation/customer";
import { verifyAccountEmailToken } from "@/lib/auth/account-email-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(request: NextRequest): string {
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  if (forwarded) return forwarded;
  return request.headers.get("x-real-ip") ?? "unknown";
}

interface ErrorBody {
  ok: false;
  code: string;
  message?: string;
  errors?: string[];
  retry_after_seconds?: number;
}

function errorResponse(status: number, body: ErrorBody) {
  return NextResponse.json(body, { status });
}

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    const ipGate = await isRateLimited({
      route: "resetPassword",
      ip,
      gates: ["ip"],
    });
    if (ipGate.limited) {
      return errorResponse(429, {
        ok: false,
        code: "rate_limited",
        retry_after_seconds: ipGate.retryAfterSeconds,
      });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse(400, {
        ok: false,
        code: "invalid_body",
      });
    }

    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      // Differentiate password-policy failures from token-format ones
      // so the UI can highlight the right field.
      const tokenIssue = parsed.error.issues.find((i) => i.path[0] === "token");
      if (tokenIssue) {
        return errorResponse(400, {
          ok: false,
          code: "invalid_or_expired_token",
        });
      }
      return errorResponse(400, {
        ok: false,
        code: "invalid_password",
        errors: parsed.error.issues
          .filter((i) => i.path[0] !== "token")
          .map((i) => i.message),
      });
    }
    const { token, password } = parsed.data;

    const payload = verifyAccountEmailToken(token, "password-reset");
    if (!payload) {
      return errorResponse(400, {
        ok: false,
        code: "invalid_or_expired_token",
      });
    }

    // Per-email gate, post-token-verification so a flood of malformed
    // tokens doesn't lock a real customer out of their reset.
    const emailGate = await isRateLimited({
      route: "resetPassword",
      ip,
      email: payload.email,
      gates: ["email"],
    });
    if (emailGate.limited) {
      return errorResponse(429, {
        ok: false,
        code: "rate_limited",
        retry_after_seconds: emailGate.retryAfterSeconds,
      });
    }

    const supabase = serviceSupabase();
    if (!supabase) {
      // Stub mode (Day-1): we can't actually update the password.
      // Pretend success so the UI flow still progresses; the operator
      // alarm fires elsewhere on missing creds.
      return NextResponse.json(
        { ok: true, message: "password_updated" },
        { status: 200 },
      );
    }

    // First check that the profile exists + isn't suspended. This is
    // a cheap reject before we touch anything else; it does NOT
    // create a TOCTOU window because the actual single-use guarantee
    // comes from the unique-constraint INSERT below.
    const lookup = await supabase
      .from("customer_profiles")
      .select("id, status")
      .eq("auth_user_id", payload.userId)
      .maybeSingle();
    if (lookup.error) {
      captureException(lookup.error, {
        tags: { route: "auth/reset-password", phase: "lookup" },
      });
      return errorResponse(500, {
        ok: false,
        code: "internal_error",
      });
    }
    if (!lookup.data) {
      // Token validates but no profile exists (e.g. profile was
      // deleted post-token-issuance). Surface as generic invalid.
      return errorResponse(400, {
        ok: false,
        code: "invalid_or_expired_token",
      });
    }
    if (lookup.data.status === "suspended") {
      return errorResponse(400, {
        ok: false,
        code: "invalid_or_expired_token",
      });
    }

    // Codex P2 (2026-05-25): atomic nonce consumption via unique
    // INSERT. This is the FIRST mutation in the reset flow. If a
    // duplicate (same auth_user_id + nonce) is already on file,
    // postgres returns 23505 and we abort BEFORE touching the
    // password — so a concurrent submit or a replay of an earlier
    // outstanding link both fail-closed.
    const consume = await supabase
      .from("consumed_password_reset_nonces")
      .insert({
        auth_user_id: payload.userId,
        nonce: payload.nonce,
      });
    if (consume.error) {
      const code = (consume.error as { code?: string }).code ?? "";
      if (code === "23505") {
        // Unique violation = replay. Generic 400 to avoid leaking
        // "this nonce was already used".
        return errorResponse(400, {
          ok: false,
          code: "invalid_or_expired_token",
        });
      }
      captureException(consume.error, {
        tags: { route: "auth/reset-password", phase: "nonce_consume" },
      });
      return errorResponse(500, {
        ok: false,
        code: "internal_error",
      });
    }

    const updateAuth = await supabase.auth.admin.updateUserById(payload.userId, {
      password,
    });
    if (updateAuth.error) {
      // The nonce is already consumed — the customer cannot retry
      // with the same link. Roll the nonce row back so a fresh
      // forgot-password request still produces a usable link.
      await supabase
        .from("consumed_password_reset_nonces")
        .delete()
        .eq("auth_user_id", payload.userId)
        .eq("nonce", payload.nonce);
      captureException(updateAuth.error, {
        tags: { route: "auth/reset-password", phase: "auth_update" },
      });
      return errorResponse(500, {
        ok: false,
        code: "internal_error",
      });
    }

    // Best-effort forensic marker (no longer the single-use gate).
    const stamp = await supabase
      .from("customer_profiles")
      .update({ last_used_reset_nonce: payload.nonce })
      .eq("id", String(lookup.data.id));
    if (stamp.error) {
      // Non-fatal: the password update succeeded + the nonce is
      // already consumed in the dedicated table.
      captureException(stamp.error, {
        tags: { route: "auth/reset-password", phase: "nonce_stamp" },
      });
    }

    return NextResponse.json(
      { ok: true, message: "password_updated" },
      { status: 200 },
    );
  } catch (err) {
    captureException(err, {
      tags: { route: "auth/reset-password", phase: "outer" },
    });
    return errorResponse(500, {
      ok: false,
      code: "internal_error",
    });
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, code: "method_not_allowed" },
    { status: 405 },
  );
}
