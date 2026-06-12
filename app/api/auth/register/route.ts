/**
 * POST /api/auth/register — customer-account registration.
 *
 * Spec §3.1 + §3.7 — full registration submission. Always returns
 * the SAME uniform 200 body (anti-enumeration) regardless of
 * whether:
 *   - the email is already on an active account
 *   - the email is on a pending account (waiting on confirmation)
 *   - the email is archived (so the registration actually succeeds)
 *   - the body was malformed
 *   - the request was rate-limited
 *   - Supabase / Resend failed mid-flight
 *
 * Any status differentiation would let an attacker enumerate which
 * emails have accounts. Failures are logged to Sentry internally
 * but never reach the caller.
 *
 * The registration pipeline:
 *   1. IP rate-gate (pre-parse, so a body-flood is bounded)
 *   2. Parse + validate against `registrationSchema`
 *   3. Email rate-gate
 *   4. Uniqueness lookup → if active/pending, return uniform
 *      (DO NOT create a duplicate auth user)
 *   5. supabase.auth.admin.createUser (email_confirm=false)
 *   6. insertProfileWithAddresses
 *      • on failure: rollback the auth user we just created
 *   7. sendAccountConfirmEmail with a 24h HMAC token
 *      • on failure: still return uniform; customer can request
 *        a resend
 *
 * Iron Laws: force-dynamic + runtime=nodejs; service-role client
 * only inside the route; never echo back PII.
 */
import { NextResponse, type NextRequest } from "next/server";
import { isRateLimited } from "@/lib/rate-limit";
import { serviceSupabase } from "@/lib/supabase";
import { captureException } from "@/lib/sentry";
import { registrationSchema } from "@/lib/validation/customer";
import {
  registerUniformResponse,
  findAccountByEmail,
  createAuthUser,
  deleteAuthUser,
  insertProfileWithAddresses,
  buildConfirmEmailUrl,
} from "@/lib/auth/account-server";
import { sendAccountConfirmEmail } from "@/lib/email/account-email-confirm";

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

export async function POST(request: NextRequest) {
  // TEMPORARY INSTRUMENTATION (remove after diagnosis).
  // Logs the bail phase to Vercel runtime logs. PII-safe: no email,
  // no password, no full body. Just phase name + error class name.
  console.log("[DBG-REG] phase=enter");
  try {
    const ip = clientIp(request);
    const ipGate = await isRateLimited({
      route: "register",
      ip,
      gates: ["ip"],
    });
    if (ipGate.limited) {
      console.log("[DBG-REG] phase=ip_rate_limited bail=true");
      return registerUniformResponse();
    }
    console.log("[DBG-REG] phase=after_ip_gate ok=true");

    let body: unknown;
    try {
      body = await request.json();
    } catch (parseErr) {
      console.log(
        "[DBG-REG] phase=json_parse_fail bail=true err=" +
          (parseErr as Error)?.constructor?.name,
      );
      return registerUniformResponse();
    }
    console.log("[DBG-REG] phase=after_parse ok=true");

    const parsed = registrationSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      console.log(
        "[DBG-REG] phase=schema_fail bail=true issues=" +
          parsed.error.issues.length +
          " first_path=" +
          (firstIssue?.path?.join(".") || "?") +
          " first_code=" +
          (firstIssue?.code || "?"),
      );
      return registerUniformResponse();
    }
    const input = parsed.data;
    console.log("[DBG-REG] phase=after_schema ok=true");

    const emailGate = await isRateLimited({
      route: "register",
      ip,
      email: input.email,
      gates: ["email"],
    });
    if (emailGate.limited) {
      console.log("[DBG-REG] phase=email_rate_limited bail=true");
      return registerUniformResponse();
    }
    console.log("[DBG-REG] phase=after_email_gate ok=true");

    const supabase = serviceSupabase();
    if (!supabase) {
      console.log("[DBG-REG] phase=service_supabase_null bail=true");
      return registerUniformResponse();
    }
    console.log("[DBG-REG] phase=after_supabase_init ok=true");

    let existing;
    try {
      existing = await findAccountByEmail(supabase, input.email);
    } catch (lookupErr) {
      console.log(
        "[DBG-REG] phase=find_account_threw bail=true err=" +
          (lookupErr as Error)?.constructor?.name +
          " msg=" +
          String((lookupErr as Error)?.message ?? "").slice(0, 200),
      );
      return registerUniformResponse();
    }
    console.log(
      "[DBG-REG] phase=after_find_account kind=" + existing.kind,
    );
    if (existing.kind === "active" || existing.kind === "pending") {
      console.log("[DBG-REG] phase=existing_account bail=true kind=" + existing.kind);
      return registerUniformResponse();
    }

    // Create the auth user FIRST (it owns the email-uniqueness
    // constraint on Supabase's side). On failure (e.g. they have
    // a Supabase-auth-only legacy account with the same email)
    // we still return uniform so the response shape stays flat.
    let authUserId: string;
    try {
      const created = await createAuthUser(
        supabase,
        input.email,
        input.password,
      );
      authUserId = created.id;
      console.log("[DBG-REG] phase=auth_user_created ok=true");
    } catch (err) {
      console.log(
        "[DBG-REG] phase=auth_user_create_fail bail=true err=" +
          (err as Error)?.constructor?.name +
          " msg=" +
          String((err as Error)?.message ?? "").slice(0, 200),
      );
      captureException(err, {
        tags: { route: "auth/register", phase: "auth_user_create" },
      });
      return registerUniformResponse();
    }

    try {
      await insertProfileWithAddresses(supabase, {
        authUserId,
        input,
      });
      console.log("[DBG-REG] phase=profile_inserted ok=true");
    } catch (err) {
      console.log(
        "[DBG-REG] phase=profile_insert_fail bail=true err=" +
          (err as Error)?.constructor?.name +
          " msg=" +
          String((err as Error)?.message ?? "").slice(0, 200),
      );
      captureException(err, {
        tags: { route: "auth/register", phase: "profile_insert" },
        extra: { authUserId },
      });
      // Roll the auth row back so the customer can retry without
      // hitting "email already used" on Supabase's side.
      await deleteAuthUser(supabase, authUserId);
      return registerUniformResponse();
    }

    // Send confirmation email. On send failure we DO NOT roll back —
    // the account exists, the customer can ask for a fresh link from
    // the sign-in page.
    try {
      const confirmUrl = buildConfirmEmailUrl(authUserId, input.email);
      await sendAccountConfirmEmail({
        email: input.email,
        fullName: input.full_name,
        confirmUrl,
      });
    } catch (err) {
      captureException(err, {
        tags: { route: "auth/register", phase: "send_confirmation" },
        extra: { authUserId },
      });
    }

    console.log("[DBG-REG] phase=complete ok=true");
    return registerUniformResponse();
  } catch (err) {
    console.log(
      "[DBG-REG] phase=outer_catch bail=true err=" +
        (err as Error)?.constructor?.name +
        " msg=" +
        String((err as Error)?.message ?? "").slice(0, 200),
    );
    captureException(err, { tags: { route: "auth/register", phase: "outer" } });
    return registerUniformResponse();
  }
}

// Block every other method explicitly — also via the uniform body so a
// scanner probing `OPTIONS /api/auth/register` learns nothing extra.
export async function GET() {
  return NextResponse.json(
    { ok: true, message: "method_not_allowed" },
    { status: 405 },
  );
}
