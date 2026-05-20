import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { checkBtcpayHealth } from "@/lib/payments/btcpay-health";
import { captureException } from "@/lib/sentry";

/**
 * Phase 3.3 (v5) — Sentry instrumentation per Iron Law 2.32. Status
 * endpoints are read-only + non-credit-bearing, so no Layer 3 needed; we
 * still emit a breadcrumb at entry and capture any thrown error with a
 * route tag for dashboard grouping.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  Sentry.addBreadcrumb({
    category: "webhook",
    level: "info",
    message: "btcpay_status_entry",
    data: { route: "btcpay_status" },
  });

  try {
    const health = await checkBtcpayHealth();
    if (!health.ok) {
      // The probe returned a non-ok state (configured but unreachable, etc).
      // Emit captureException with a synthetic Error so Sentry dashboards
      // can group transient outages without losing the underlying reason.
      captureException(
        new Error(`btcpay_status_unhealthy: ${health.reason ?? "unknown"}`),
        {
          tags: { route: "btcpay_status", provider: "btcpay" },
        },
      );
    }
    return NextResponse.json(health, {
      status: health.ok ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    captureException(err, {
      tags: { route: "btcpay_status", provider: "btcpay" },
    });
    return NextResponse.json(
      { ok: false, reason: "internal_error", reachable: false },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
