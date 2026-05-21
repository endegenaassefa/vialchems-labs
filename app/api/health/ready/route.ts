import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import {
  getMissingBtcpayCredentials,
  getMissingZelleCredentials,
} from "@/lib/checkout/direct-payment";
import { captureException } from "@/lib/sentry";

/**
 * Phase 3.3 (v5) — readiness probe + Sentry instrumentation per Iron Law
 * 2.32. Returns 200 when all required env vars are present, 503 otherwise.
 */
export const dynamic = "force-dynamic";

function has(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

export async function GET(): Promise<Response> {
  Sentry.addBreadcrumb({
    category: "webhook",
    level: "info",
    message: "health_ready_entry",
    data: { route: "health_ready" },
  });

  try {
    const paymentProvider = process.env.PAYMENT_PROVIDER;
    const missing: string[] = [];

    for (const key of [
      "AGE_GATE_SECRET",
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
      "RESEND_API_KEY",
      "ORDER_EMAIL_FROM",
      "ORDER_STAFF_EMAILS",
    ]) {
      if (!has(key)) missing.push(key);
    }

    if (!paymentProvider || paymentProvider === "stub") {
      missing.push("PAYMENT_PROVIDER=zelle|btcpay|plaid");
    }

    if (paymentProvider === "btcpay") {
      missing.push(...getMissingBtcpayCredentials());
    }

    for (const key of getMissingZelleCredentials()) {
      missing.push(key);
    }

    const ready = missing.length === 0;
    return NextResponse.json(
      {
        status: ready ? "ready" : "not_ready",
        service: "vialchemlabs",
        checks: {
          node: process.versions.node,
          paymentProvider: paymentProvider ?? null,
          missing,
        },
        time: new Date().toISOString(),
      },
      { status: ready ? 200 : 503 },
    );
  } catch (err) {
    captureException(err, { tags: { route: "health_ready" } });
    return NextResponse.json(
      { status: "error", service: "vialchemlabs" },
      { status: 500 },
    );
  }
}
