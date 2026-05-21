/**
 * Phase 10.3 (v4) + Phase 3.4 (v5) — Sentry server-side init (Node runtime).
 * Closes D12 + audit H9 + M12 (PII scrubber). No-op when
 * NEXT_PUBLIC_SENTRY_DSN is empty.
 *
 * Server-side scrubs: see lib/sentry.ts beforeSend. Strips Authorization,
 * Cookie, set-cookie, btcpay-sig, plaid-verification, x-forwarded-for,
 * x-real-ip, cf-connecting-ip headers; raw request body; query string;
 * email addresses in messages + breadcrumbs; user PII. Iron Law 2.32
 * + Appendix K.
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
    tracesSampleRate: 0.2,
    beforeSend,
  });
}
