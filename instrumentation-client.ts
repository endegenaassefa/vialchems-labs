/**
 * Next.js v15 / @sentry/nextjs v8+ client instrumentation hook.
 *
 * Companion to instrumentation.ts. In Next.js v15+, client-side
 * Sentry init also requires explicit instrumentation rather than
 * relying on the legacy webpack plugin auto-injection. Without this
 * file, browser errors (React render errors, client-component throws,
 * unhandled promise rejections in client islands) never reach Sentry
 * even with a valid DSN.
 *
 * Pulls the existing sentry.client.config.ts to keep the Iron Law
 * 2.32 PII scrubber + tracesSampleRate config in one canonical place.
 */
import "./sentry.client.config";
