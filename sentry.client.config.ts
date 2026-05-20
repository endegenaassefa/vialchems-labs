/**
 * Phase 10.3 (v4) + Phase 3.4 (v5) — Sentry browser-side init.
 *
 * Closes deferral D12 (instrumentation activation) and audit H9 + M12
 * (PII scrubber). Alert thresholds documented in lib/sentry.ts and the
 * Phase 10 checkpoint; alert provisioning at Sentry side is an operator
 * action via the dashboard.
 *
 * The `beforeSend` PII scrubber is imported from `lib/sentry.ts` so the
 * same rules apply across all 3 runtimes (client / server / edge).
 * Iron Law 2.32 + Appendix K.
 *
 * No-op when NEXT_PUBLIC_SENTRY_DSN is empty — Day-1 default.
 */
import * as Sentry from "@sentry/nextjs";
import { beforeSend } from "@/lib/sentry";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment:
      process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    tracesSampleRate: 0.2,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    integrations: [Sentry.browserTracingIntegration()],
    // Iron Law 2.22 + 2.32: scrub anything that could leak credentials,
    // PII, or webhook signatures in captured contexts. The helper lives
    // in lib/sentry.ts so all 3 runtimes share one implementation.
    beforeSend,
  });
}
