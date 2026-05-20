import { NextResponse, type NextRequest } from "next/server";
import { sendEmail } from "@/lib/email/resend";
import { rateLimitByIp } from "@/lib/rate-limit";
import { isProductionRuntime } from "@/lib/runtime-env";

/**
 * Contact-form stub. Phase 5 returns a JSON ok response without persisting
 * the submission. Phase 7 will wire this to Resend + Supabase via the same
 * pattern used for buyer qualification.
 *
 * The endpoint validates payload shape and rejects empty fields; that is
 * enough for the contact page to test its happy + error paths today and for
 * the Phase-7 wiring to slot in without a contract change.
 *
 * Iron Law 2.34: anti-abuse gate at the head of the handler (3 req / 1h per IP).
 */
export const dynamic = "force-dynamic";

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimitByIp("contact", ip);
  if (!limit.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "rate_limited",
        retryAfter: limit.retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(limit.retryAfterSeconds),
          "X-RateLimit-Limit": String(limit.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(limit.reset),
        },
      },
    );
  }

  let payload: ContactPayload;
  try {
    payload = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "missing_fields" },
      { status: 400 },
    );
  }

  try {
    await sendEmail({
      to: process.env.ORDER_STAFF_EMAILS?.split(",").map((value) =>
        value.trim(),
      ) ?? [`ops@${process.env.BRAND_DOMAIN ?? "vialchemlabs.net"}`],
      from: process.env.ORDER_EMAIL_FROM,
      replyTo: email,
      subject: `Contact form: ${name}`,
      text: [`Name: ${name}`, `Email: ${email}`, "", message].join("\n"),
    });
  } catch (error) {
    if (isProductionRuntime()) {
      return NextResponse.json(
        {
          ok: false,
          error: "contact_dispatch_failed",
          message: (error as Error).message,
        },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
