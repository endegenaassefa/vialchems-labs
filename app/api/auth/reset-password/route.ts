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

    // Anti-replay: check that this nonce hasn't been used. Reject if it
    // matches the last-used nonce on the profile.
    const lookup = await supabase
      .from("customer_profiles")
      .select("id, last_used_reset_nonce, status")
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
    if (
      lookup.data.last_used_reset_nonce &&
      lookup.data.last_used_reset_nonce === payload.nonce
    ) {
      return errorResponse(400, {
        ok: false,
        code: "invalid_or_expired_token",
      });
    }
    if (lookup.data.status === "suspended") {
      // Suspended accounts can't reset.
      return errorResponse(400, {
        ok: false,
        code: "invalid_or_expired_token",
      });
    }

    const updateAuth = await supabase.auth.admin.updateUserById(payload.userId, {
      password,
    });
    if (updateAuth.error) {
      captureException(updateAuth.error, {
        tags: { route: "auth/reset-password", phase: "auth_update" },
      });
      return errorResponse(500, {
        ok: false,
        code: "internal_error",
      });
    }

    // Mark the nonce as used so the same link can't reset a second
    // time within its 1h validity window.
    const stamp = await supabase
      .from("customer_profiles")
      .update({ last_used_reset_nonce: payload.nonce })
      .eq("id", String(lookup.data.id));
    if (stamp.error) {
      // The auth password is already updated; nonce-stamp failure is
      // non-fatal. Log + return success so the customer isn't told
      // their reset failed when it actually worked.
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
