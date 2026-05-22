import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { captureException } from "@/lib/sentry";
import packageJson from "../../../package.json";

/**
 * Health check endpoint per SUPER_PROMPT_v3 Phase 3 + Phase 14.
 *
 * Used by Vercel canary, /api/health monitor, and /land-and-deploy verification.
 * Returns minimal information; does NOT expose internals.
 *
 * Phase 3.3 (v5) — Sentry instrumentation per Iron Law 2.32.
 * Phase 9 (v5) — added `version` + `gitSha` fields per audit L13 for canary
 * + deploy-verification dashboards.
 * Phase 14 follow-up — `package.json` is the version source-of-truth: every
 * release bump propagates to `/api/health` automatically without needing a
 * `NEXT_PUBLIC_PACKAGE_VERSION` env update in Vercel. Env still wins if set.
 */
export const dynamic = "force-dynamic";

// Build-time env injected by Vercel (or operator) takes precedence so the
// operator can pin or override at deploy time. When unset, fall back to
// `v${package.json version}` — guarantees the reported version always
// matches what's actually shipped without manual env upkeep.
const VERSION =
  process.env.NEXT_PUBLIC_PACKAGE_VERSION ??
  process.env.PACKAGE_VERSION ??
  `v${packageJson.version}`;

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
