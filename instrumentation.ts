/**
 * Next.js v15 / @sentry/nextjs v8+ instrumentation hook.
 *
 * This file is required to actually wire up the existing
 * sentry.server.config.ts + sentry.edge.config.ts at runtime. Without
 * it, `Sentry.init()` in those files is never called — `captureException`
 * becomes a silent no-op, no events ever reach the Sentry dashboard,
 * and the Iron Law 2.32 PII scrubber `beforeSend` never executes
 * because Sentry itself never initializes.
 *
 * Discovery: the D2 verification flow surfaced this gap. The
 * `/api/test-error?token=vc-sentry-probe` route fired and returned
 * 500 with `sentry_probe_fired` — proving the route handler called
 * `captureException` — but the Sentry "Issues" view stayed empty,
 * because `@sentry/nextjs` v10's runtime architecture only loads the
 * server / edge config when this file's `register()` runs on startup.
 *
 * Per Sentry's Next.js v8+ migration guide:
 *   https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
 *
 * `onRequestError` is the Next.js v15 hook for capturing exceptions
 * thrown during React Server Component rendering / route handlers.
 * Re-exported from `@sentry/nextjs` per their wiring instructions.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Next.js v15 looks up `onRequestError` from this file by name; Sentry v10
// exports its implementation as `captureRequestError`. Alias on export.
export { captureRequestError as onRequestError } from "@sentry/nextjs";
