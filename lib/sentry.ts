/**
 * Phase 10.3 (v4) — Sentry helper façade.
 *
 * Wraps the @sentry/nextjs API so call sites depend on this file rather
 * than directly on the SDK. Lets us:
 *   - swap providers later without churn
 *   - tag webhook reconciliation events consistently
 *   - assert reduced-noise scrubbing in unit tests
 *
 * Closes deferrals D12 + D13. The actual alert thresholds live at
 * Sentry side and are documented in docs/checkpoints/v4_phase_10_services.md
 * (alert spec table). Iron Law 2.5 / 2.19: this file joins the
 * protected paths list — alert thresholds are operational SLOs.
 */
import * as Sentry from '@sentry/nextjs';

export type SentryEventContext = Record<string, unknown>;

/** Capture a non-fatal exception with optional structured context. */
export function captureException(
  err: unknown,
  context?: SentryEventContext,
): void {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  Sentry.captureException(err, context ? { extra: context } : undefined);
}

/** Capture a structured message (e.g. "payment.reconciled.applied"). */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: SentryEventContext,
): void {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  Sentry.captureMessage(message, {
    level,
    extra: context,
  });
}

/**
 * Tag webhook handlers so dashboards group reconciliation events. Use:
 *   const txn = startWebhookTransaction('btcpay.invoice');
 *   try { ... } finally { txn.end(); }
 */
export function startWebhookTransaction(name: string): { end: () => void } {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return { end: () => {} };
  }
  // Sentry v10 uses the manual span API. Wrap startInactiveSpan so we
  // get an explicit end() handle the caller can release in a finally.
  const span = Sentry.startInactiveSpan({ name, op: 'webhook' });
  return {
    end: () => {
      try {
        span?.end?.();
      } catch {
        // span end can fail post-flush; swallow
      }
    },
  };
}
