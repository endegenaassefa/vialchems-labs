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
  try {
    const ip = clientIp(request);
    const ipGate = await isRateLimited({
      route: "register",
      ip,
      gates: ["ip"],
    });
    if (ipGate.limited) return registerUniformResponse();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return registerUniformResponse();
    }

    const parsed = registrationSchema.safeParse(body);
    if (!parsed.success) return registerUniformResponse();
    const input = parsed.data;

    const emailGate = await isRateLimited({
      route: "register",
      ip,
      email: input.email,
      gates: ["email"],
    });
    if (emailGate.limited) return registerUniformResponse();

    const supabase = serviceSupabase();
    if (!supabase) {
      // Supabase not configured — pretend success so the response
      // doesn't differentiate from real environments. The Sentry
      // alarm fires from elsewhere when REQUIRE_SUPABASE is on but
      // the keys are missing.
      return registerUniformResponse();
    }

    const existing = await findAccountByEmail(supabase, input.email);
    if (existing.kind === "active" || existing.kind === "pending") {
      // Uniform response — we DO NOT create a duplicate auth row.
      return registerUniformResponse();
    }

    // Create the auth user FIRST (it owns the email-uniqueness
    // constraint on Supabase's side). On failure (e.g. they have
    // a Supabase-auth-only legacy account with the same email)
    // we still return uniform so the response shape stays flat.
    let authUserId: string;
    try {
      const created = await createAuthUser(supabase, input.email, input.password);
      authUserId = created.id;
    } catch (err) {
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
    } catch (err) {
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

    return registerUniformResponse();
  } catch (err) {
    captureException(err, { tags: { route: "auth/register", phase: "outer" } });
    return registerUniformResponse();
  }
}

// Block every other method explicitly — also via the uniform body so a
// scanner probing `OPTIONS /api/auth/register` learns nothing extra.
export async function GET() {
  return NextResponse.json({ ok: true, message: "method_not_allowed" }, { status: 405 });
}
