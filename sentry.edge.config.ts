/**
 * Phase 10.3 (v4) + Phase 3.4 (v5) — Sentry Edge runtime init.
 * Closes D12 + audit H9 + M12 (PII scrubber). No-op when
 * NEXT_PUBLIC_SENTRY_DSN is empty.
 *
 * Same `beforeSend` PII scrubber as client + server runtimes — imported
 * from lib/sentry.ts so a single rule set applies everywhere. Iron Law
 * 2.32 + Appendix K.
 */
import * as Sentry from "@sentry/nextjs";
import { beforeSend } from "@/lib/sentry";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment:
      process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    release: process.env.VERCEL_GIT_COMMIT_SHA,
    tracesSampleRate: 0.1,
    beforeSend,
  });
}
