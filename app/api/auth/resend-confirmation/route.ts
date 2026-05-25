/**
 * POST /api/auth/resend-confirmation — send a fresh confirmation
 * link to a pending account.
 *
 * Uniform 200 response regardless of:
 *   - whether a profile exists with that email
 *   - whether it's already active (no resend; uniform)
 *   - whether it's pending (resend; uniform)
 *   - rate-limit denial
 *   - body malformed
 *   - Supabase or Resend errors
 *
 * Codex P2 (2026-05-25) wiring fix: the /auth/confirm-email failure
 * card directs customers to "Resend confirmation", and the rebuilt
 * /login page exposes the same action — both need a working
 * endpoint, not a phantom link.
 */
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { isRateLimited } from "@/lib/rate-limit";
import { serviceSupabase } from "@/lib/supabase";
import { captureException } from "@/lib/sentry";
import { emailSchema } from "@/lib/validation/customer";
import {
  resendConfirmationUniformResponse,
  buildConfirmEmailUrl,
} from "@/lib/auth/account-server";
import { sendAccountConfirmEmail } from "@/lib/email/account-email-confirm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const inputSchema = z.object({ email: emailSchema });

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
      route: "resendConfirmation",
      ip,
      gates: ["ip"],
    });
    if (ipGate.limited) return resendConfirmationUniformResponse();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return resendConfirmationUniformResponse();
    }

    const parsed = inputSchema.safeParse(body);
    if (!parsed.success) return resendConfirmationUniformResponse();
    const { email } = parsed.data;

    const emailGate = await isRateLimited({
      route: "resendConfirmation",
      ip,
      email,
      gates: ["email"],
    });
    if (emailGate.limited) return resendConfirmationUniformResponse();

    const supabase = serviceSupabase();
    if (!supabase) return resendConfirmationUniformResponse();

    // Only resend to PENDING accounts. Active accounts get the
    // uniform response (would be confusing + wasteful to send).
    const lookup = await supabase
      .from("customer_profiles")
      .select("auth_user_id, full_name, status")
      .eq("email", email)
      .maybeSingle();
    if (lookup.error) {
      captureException(lookup.error, {
        tags: { route: "auth/resend-confirmation", phase: "lookup" },
      });
      return resendConfirmationUniformResponse();
    }
    if (
      !lookup.data ||
      String(lookup.data.status ?? "") !== "pending_email_verification"
    ) {
      return resendConfirmationUniformResponse();
    }

    try {
      const confirmUrl = buildConfirmEmailUrl(
        String(lookup.data.auth_user_id),
        email,
      );
      await sendAccountConfirmEmail({
        email,
        fullName: String(lookup.data.full_name ?? "researcher"),
        confirmUrl,
      });
    } catch (err) {
      captureException(err, {
        tags: { route: "auth/resend-confirmation", phase: "send" },
      });
    }

    return resendConfirmationUniformResponse();
  } catch (err) {
    captureException(err, {
      tags: { route: "auth/resend-confirmation", phase: "outer" },
    });
    return resendConfirmationUniformResponse();
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: true, message: "method_not_allowed" },
    { status: 405 },
  );
}
