/**
 * POST /api/auth/forgot-password — request a password-reset link.
 *
 * Spec §3.4 — uniform 200 response (anti-enumeration). Same body
 * whether the email matches an account, doesn't, is rate-limited,
 * or the underlying lookup/send fails.
 *
 * Pipeline:
 *   1. IP rate-gate (10/hr) pre-parse
 *   2. zod parse against forgotPasswordSchema
 *   3. Email rate-gate (3/hr)
 *   4. Lookup customer_profiles for status='active' OR 'pending' —
 *      magic-link customers may not have a password yet, but reset
 *      is still valid because it'll set one.
 *   5. Generate 1-hour HMAC token + send email
 *   6. Always return uniform body
 */
import { NextResponse, type NextRequest } from "next/server";
import { isRateLimited } from "@/lib/rate-limit";
import { serviceSupabase } from "@/lib/supabase";
import { captureException } from "@/lib/sentry";
import { forgotPasswordSchema } from "@/lib/validation/customer";
import {
  forgotPasswordUniformResponse,
  buildPasswordResetUrl,
} from "@/lib/auth/account-server";
import { sendPasswordResetEmail } from "@/lib/email/account-password-reset";

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
      route: "forgotPassword",
      ip,
      gates: ["ip"],
    });
    if (ipGate.limited) return forgotPasswordUniformResponse();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return forgotPasswordUniformResponse();
    }

    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) return forgotPasswordUniformResponse();
    const { email } = parsed.data;

    const emailGate = await isRateLimited({
      route: "forgotPassword",
      ip,
      email,
      gates: ["email"],
    });
    if (emailGate.limited) return forgotPasswordUniformResponse();

    const supabase = serviceSupabase();
    if (!supabase) return forgotPasswordUniformResponse();

    const lookup = await supabase
      .from("customer_profiles")
      .select("auth_user_id, full_name, status")
      .eq("email", email)
      .maybeSingle();
    if (lookup.error) {
      captureException(lookup.error, {
        tags: { route: "auth/forgot-password", phase: "lookup" },
      });
      return forgotPasswordUniformResponse();
    }
    // Only send for active or pending accounts. Suspended/archived
    // get uniform silence.
    const status = String(lookup.data?.status ?? "");
    if (
      !lookup.data ||
      (status !== "active" && status !== "pending_email_verification")
    ) {
      return forgotPasswordUniformResponse();
    }

    try {
      const resetUrl = buildPasswordResetUrl(
        String(lookup.data.auth_user_id),
        email,
      );
      await sendPasswordResetEmail({
        email,
        fullName: String(lookup.data.full_name ?? ""),
        resetUrl,
      });
    } catch (err) {
      captureException(err, {
        tags: { route: "auth/forgot-password", phase: "send" },
      });
    }

    return forgotPasswordUniformResponse();
  } catch (err) {
    captureException(err, {
      tags: { route: "auth/forgot-password", phase: "outer" },
    });
    return forgotPasswordUniformResponse();
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: true, message: "method_not_allowed" },
    { status: 405 },
  );
}
