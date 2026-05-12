/**
 * Phase 10.3 (v4) — Sentry browser-side init.
 *
 * Closes deferral D12 (instrumentation activation). Alert thresholds
 * documented in lib/sentry.ts and the Phase 10 checkpoint; alert
 * provisioning at Sentry side is an operator action via the dashboard.
 *
 * No-op when NEXT_PUBLIC_SENTRY_DSN is empty — Day-1 default.
 */
import * as Sentry from "@sentry/nextjs";

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
    // Iron Law 2.22: scrub anything that could leak credentials in
    // captured contexts.
    beforeSend(event) {
      if (event.request?.headers) {
        delete event.request.headers["authorization"];
        delete event.request.headers["cookie"];
      }
      return event;
    },
  });
}
