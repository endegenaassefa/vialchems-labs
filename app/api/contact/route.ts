import { NextResponse, type NextRequest } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { findMarketingCopyViolation } from "@/lib/compliance";
import { sendEmail } from "@/lib/email/resend";
import { rateLimitByIp } from "@/lib/rate-limit";
import { isProductionRuntime } from "@/lib/runtime-env";
import { captureException } from "@/lib/sentry";

/**
 * Contact-form route. Validates payload shape, rejects empty fields, runs
 * the message body through `findMarketingCopyViolation` (Iron Law 2.4 /
 * 2.13), then dispatches via Resend.
 *
 * Iron Law 2.34: anti-abuse gate at the head of the handler (3 req / 1h per IP).
 * Iron Law 2.13: every user-submitted free-text field that may surface on
 * an operator-visible surface (inbox, ticket queue) goes through the
 * marketing-copy filter before being persisted or forwarded. M7 closure
 * (Phase 8) extended this from buyer qualification to the contact form.
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
  Sentry.addBreadcrumb({
    category: "webhook",
    level: "info",
    message: "contact_entry",
    data: { route: "contact" },
  });

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

  // Iron Law 2.13: scan the free-text body against the marketing-copy
  // filter before forwarding to operator inbox. Stays at 400 so the
  // shape matches missing_fields; the explicit error code lets the
  // client UI surface a guided rephrase.
  if (findMarketingCopyViolation(message) !== null) {
    return NextResponse.json(
      { ok: false, errors: ["marketing_copy_violation"] },
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
    captureException(error, {
      tags: { route: "contact", provider: "resend" },
    });
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
