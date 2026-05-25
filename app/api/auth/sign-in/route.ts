/**
 * POST /api/auth/sign-in — pre-flight gate for password sign-in.
 *
 * The actual session establishment runs on the browser via
 * supabase.auth.signInWithPassword(); this route exists so we can:
 *   1. Rate-limit credential-stuffing attempts (per IP + per email)
 *   2. Surface the pending-email-verification message that the
 *      generic "invalid credentials" reply from Supabase couldn't
 *      distinguish.
 *
 * Response shape:
 *   200 { ok: true, status: "active" | "pending" } — proceed to
 *     signInWithPassword on the client.
 *   200 { ok: true, status: "none" } — uniform shape (anti-enum
 *     for non-existent emails). Client still tries signInWithPassword
 *     and surfaces the Supabase reply.
 *   429 { ok: false, code: "rate_limited", retry_after_seconds }
 *   400 { ok: false, code: "invalid_body" }
 *
 * Note: We DO NOT return `invalid_credentials` here — that signal
 * comes from Supabase itself. Returning "user not found" would let
 * an attacker enumerate emails by counting which ones get
 * "rate_limited" responses (because the email-bucket counter only
 * trips on emails that we routed to). The uniform "status:none"
 * + same shape preserves the property.
 */
import { NextResponse, type NextRequest } from "next/server";
import { isRateLimited } from "@/lib/rate-limit";
import { serviceSupabase } from "@/lib/supabase";
import { captureException } from "@/lib/sentry";
import { signInWithPasswordSchema } from "@/lib/validation/customer";

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
      route: "signIn",
      ip,
      gates: ["ip"],
    });
    if (ipGate.limited) {
      return NextResponse.json(
        {
          ok: false,
          code: "rate_limited",
          retry_after_seconds: ipGate.retryAfterSeconds,
        },
        { status: 429 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, code: "invalid_body" },
        { status: 400 },
      );
    }

    const parsed = signInWithPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, code: "invalid_body" },
        { status: 400 },
      );
    }
    const { email } = parsed.data;

    const emailGate = await isRateLimited({
      route: "signIn",
      ip,
      email,
      gates: ["email"],
    });
    if (emailGate.limited) {
      return NextResponse.json(
        {
          ok: false,
          code: "rate_limited",
          retry_after_seconds: emailGate.retryAfterSeconds,
        },
        { status: 429 },
      );
    }

    const supabase = serviceSupabase();
    if (!supabase) {
      // Stub mode — pretend the account exists so the client still
      // proceeds (and supabase.auth.signInWithPassword surfaces the
      // real "Supabase not configured" error).
      return NextResponse.json(
        { ok: true, status: "active" },
        { status: 200 },
      );
    }

    const lookup = await supabase
      .from("customer_profiles")
      .select("status")
      .eq("email", email)
      .maybeSingle();

    if (lookup.error) {
      captureException(lookup.error, {
        tags: { route: "auth/sign-in", phase: "lookup" },
      });
      // On lookup error, return active so the client still tries —
      // failure differentiation here would create an enumeration
      // signal.
      return NextResponse.json(
        { ok: true, status: "active" },
        { status: 200 },
      );
    }

    if (!lookup.data) {
      return NextResponse.json(
        { ok: true, status: "none" },
        { status: 200 },
      );
    }
    const status = String(lookup.data.status ?? "");
    if (status === "pending_email_verification") {
      return NextResponse.json(
        { ok: true, status: "pending" },
        { status: 200 },
      );
    }
    if (status === "suspended") {
      return NextResponse.json(
        { ok: true, status: "suspended" },
        { status: 200 },
      );
    }
    return NextResponse.json(
      { ok: true, status: "active" },
      { status: 200 },
    );
  } catch (err) {
    captureException(err, { tags: { route: "auth/sign-in", phase: "outer" } });
    // Fail safe: let the client proceed with the supabase call.
    return NextResponse.json(
      { ok: true, status: "active" },
      { status: 200 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, code: "method_not_allowed" },
    { status: 405 },
  );
}
