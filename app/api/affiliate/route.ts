/**
 * P2B — POST /api/affiliate
 *
 * Closes super-prompt §7.2: the affiliate signup form was a 250ms
 * setTimeout stub. This handler validates the payload, rate-limits per
 * IP + per email (Iron Law 2.34), persists to affiliate_applications
 * via the service-role Supabase client, and emails both the operator
 * (notification) + the applicant (ack) via Resend.
 *
 * Stays stub-safe when REQUIRE_SUPABASE=false (persist no-ops with a
 * Sentry breadcrumb) or when REQUIRE_RESEND=false (sendEmail returns a
 * synthetic ID). Returns 200 on email success even if Supabase persist
 * fails — operator still receives the notification email so the
 * application doesn't drop on the floor.
 */
import { NextResponse, type NextRequest } from "next/server";
import * as Sentry from "@sentry/nextjs";

import { findMarketingCopyViolation } from "@/lib/compliance";
import {
  sendAffiliateApplicantAck,
  sendAffiliateOperatorNotification,
} from "@/lib/email/affiliate-application";
import { isRateLimited } from "@/lib/rate-limit";
import { isProductionRuntime } from "@/lib/runtime-env";
import { captureException } from "@/lib/sentry";
import { serviceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface AffiliatePayload {
  name?: unknown;
  email?: unknown;
  audience?: unknown;
  views?: unknown;
  handles?: unknown;
  focus?: unknown;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  Sentry.addBreadcrumb({
    category: "api",
    level: "info",
    message: "affiliate_application_entry",
    data: { route: "affiliate" },
  });

  let payload: AffiliatePayload;
  try {
    payload = (await req.json()) as AffiliatePayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const name = asTrimmedString(payload.name);
  const email = asTrimmedString(payload.email);
  const audience = asTrimmedString(payload.audience);
  const views = asTrimmedString(payload.views);
  const handles = asTrimmedString(payload.handles);
  const focus = asTrimmedString(payload.focus);

  if (!name || !email) {
    return NextResponse.json(
      { ok: false, error: "missing_fields" },
      { status: 400 },
    );
  }

  // Light email-shape check (full RFC validation lives downstream in
  // Resend; this short-circuits obvious typos before the rate-limit
  // burn).
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 400 },
    );
  }

  // Iron Law 2.34: per-IP + per-email rate limiting.
  const ip = getClientIp(req);
  const gate = await isRateLimited({
    route: "affiliate",
    ip,
    email,
    gates: ["ip", "email"],
  });
  if (gate.limited) {
    return NextResponse.json(
      {
        ok: false,
        error: "rate_limited",
        retryAfterSeconds: gate.retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(gate.retryAfterSeconds),
          "X-RateLimit-Limit": String(gate.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(gate.reset),
        },
      },
    );
  }

  // Iron Law 2.13: scan free-text fields against marketing-copy filter.
  for (const [field, value] of [
    ["focus", focus],
    ["handles", handles],
  ] as const) {
    if (value && findMarketingCopyViolation(value) !== null) {
      return NextResponse.json(
        { ok: false, error: "marketing_copy_violation", field },
        { status: 400 },
      );
    }
  }

  // Best-effort persist (Supabase may be null in stub mode).
  const supabase = serviceSupabase();
  if (supabase) {
    try {
      const { error: insertError } = await supabase
        .from("affiliate_applications")
        .insert({
          name,
          email,
          audience: audience || null,
          views: views || null,
          handles: handles || null,
          focus: focus || null,
          ip_address: ip === "unknown" ? null : ip,
          user_agent: req.headers.get("user-agent"),
        });
      if (insertError) {
        captureException(insertError, {
          tags: { route: "affiliate", phase: "persist" },
        });
      }
    } catch (error) {
      captureException(error, {
        tags: { route: "affiliate", phase: "persist" },
      });
    }
  }

  // Operator notification (the load-bearing send — fails → 502 in prod).
  try {
    await sendAffiliateOperatorNotification({
      name,
      email,
      audience: audience || undefined,
      views: views || undefined,
      handles: handles || undefined,
      focus: focus || undefined,
    });
  } catch (error) {
    captureException(error, {
      tags: { route: "affiliate", phase: "operator-notify" },
    });
    if (isProductionRuntime()) {
      return NextResponse.json(
        {
          ok: false,
          error: "affiliate_dispatch_failed",
          message: (error as Error).message,
        },
        { status: 502 },
      );
    }
  }

  // Applicant ack (best-effort).
  try {
    await sendAffiliateApplicantAck({ name, email });
  } catch (error) {
    captureException(error, {
      tags: { route: "affiliate", phase: "applicant-ack" },
    });
  }

  return NextResponse.json({ ok: true });
}
