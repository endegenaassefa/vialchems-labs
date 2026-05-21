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
 * Phase 9 (v5) — added `version` + `gitSha` fields per audit L13 for canary
 * + deploy-verification dashboards.
 */
export const dynamic = "force-dynamic";

// Build-time env injected by Vercel (or operator); fall back to env-driven
// defaults when run outside Vercel. Version is read from package.json via
// build-time env propagation (NEXT_PUBLIC_PACKAGE_VERSION) when available,
// else falls back to the production v5.0.0 tag.
const VERSION =
  process.env.NEXT_PUBLIC_PACKAGE_VERSION ??
  process.env.PACKAGE_VERSION ??
  "v5.0.0";

const GIT_SHA =
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.GIT_COMMIT_SHA ??
  process.env.COMMIT_SHA ??
  "unknown";

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
      version: VERSION,
      gitSha: GIT_SHA.slice(0, 12),
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
