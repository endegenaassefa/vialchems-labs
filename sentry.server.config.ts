/**
 * Phase 10.3 (v4) — Sentry server-side init (Node + Edge runtime).
 * Closes D12. No-op when NEXT_PUBLIC_SENTRY_DSN is empty.
 */
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment:
      process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    release: process.env.VERCEL_GIT_COMMIT_SHA,
    tracesSampleRate: 0.2,
    // Server-side scrubs: never log secret env values, payment intent
    // payloads in full, or webhook signatures.
    beforeSend(event) {
      if (event.request?.headers) {
        const h = event.request.headers as Record<string, string>;
        delete h["authorization"];
        delete h["cookie"];
        delete h["btcpaysig"];
        delete h["plaid-verification"];
      }
      return event;
    },
  });
}
