import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { captureException } from "@/lib/sentry";

/**
 * Health check endpoint per SUPER_PROMPT_v3 Phase 3 + Phase 14.
 *
 * Used by Vercel canary, /api/health monitor, and /land-and-deploy verification.
 * Returns minimal information; does NOT expose internals.
 *
 * Phase 3.3 (v5) — Sentry instrumentation per Iron Law 2.32.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  Sentry.addBreadcrumb({
    category: "webhook",
    level: "info",
    message: "health_entry",
    data: { route: "health" },
  });
  try {
    return NextResponse.json({
      status: "ok",
      service: "vialchemlabs",
      time: new Date().toISOString(),
    });
  } catch (err) {
    captureException(err, { tags: { route: "health" } });
    return NextResponse.json(
      { status: "error", service: "vialchemlabs" },
      { status: 500 },
    );
  }
}
