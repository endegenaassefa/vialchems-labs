import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { checkBitcoinCheckoutStatus } from "@/lib/payments/bitcoin-status";
import { captureException } from "@/lib/sentry";

/**
 * Phase 3.3 (v5) — Sentry instrumentation per Iron Law 2.32. Read-only
 * status endpoint; no Layer 3 needed. Emits breadcrumb at entry +
 * captureException tagged { route: 'bitcoin_status' } on any throw.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  Sentry.addBreadcrumb({
    category: "webhook",
    level: "info",
    message: "bitcoin_status_entry",
    data: { route: "bitcoin_status" },
  });

  try {
    const status = await checkBitcoinCheckoutStatus();
    return NextResponse.json(status, {
      status: status.ok ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    captureException(err, {
      tags: { route: "bitcoin_status", provider: "bitcoin-direct" },
    });
    return NextResponse.json(
      { ok: false, reason: "internal_error", reachable: false },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
