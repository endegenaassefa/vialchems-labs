/**
 * Phase 10.3 (v4) + Phase 3.4 (v5) — Sentry helper façade.
 *
 * Wraps the @sentry/nextjs API so call sites depend on this file rather
 * than directly on the SDK. Lets us:
 *   - swap providers later without churn
 *   - tag webhook reconciliation events consistently
 *   - apply a single PII scrubber across all 3 runtimes (client / server /
 *     edge) via the exported `beforeSend` hook
 *
 * Iron Law 2.32 (Sentry PII scrubbing): `beforeSend(event, hint)` strips
 * sensitive headers (Authorization, Cookie, set-cookie, btcpay-sig,
 * plaid-verification, x-forwarded-for, x-real-ip, cf-connecting-ip),
 * raw request body, query string, email addresses in messages /
 * exception values / breadcrumb messages, breadcrumb data PII keys
 * (email, phone, ssn, dob, name, address), and event.user.email /
 * ip_address. Non-PII (event.tags, event.contexts, environment) is
 * preserved. Spec: SUPER_PROMPT_v5 §2.32 + Appendix K. Wired into
 * `sentry.{client,server,edge}.config.ts` via `Sentry.init({ beforeSend })`.
 *
 * Closes audit H9 + M12 (Sentry beforeSend PII scrubber unimplemented).
 *
 * Iron Law 2.5 / 2.19: this file is on the protected paths list — alert
 * thresholds + scrubber are operational SLOs. Alert thresholds documented
 * in docs/checkpoints/v4_phase_10_services.md.
 */
import * as Sentry from "@sentry/nextjs";
import type { ErrorEvent, EventHint } from "@sentry/core";

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
  level: "info" | "warning" | "error" = "info",
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
  const span = Sentry.startInactiveSpan({ name, op: "webhook" });
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

// ---------------------------------------------------------------------------
// PII scrubber (Iron Law 2.32) — exported for sentry.{client,server,edge}.config.ts
// ---------------------------------------------------------------------------

/**
 * Email regex covers typical RFC-5322-ish addresses (alice@example.com,
 * bob.smith+test@example.co.uk, user_name@domain.com) while rejecting
 * obvious non-email substrings like "not-an-email" or "@nothing".
 *
 * The character classes here mean: at least one word/dot/+/- char, then
 * "@", then at least one word/dash char, then a literal ".", then at
 * least one trailing word/dot/dash char — so a bare "@nothing" with no
 * dot in the domain is NOT matched.
 */
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/g;

/** Headers whose values may carry credentials, signatures, or IPs. */
const SENSITIVE_HEADERS = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "btcpay-sig",
  "plaid-verification",
  "x-forwarded-for",
  "x-real-ip",
  "cf-connecting-ip",
]);

/** Breadcrumb data keys that almost always contain PII. */
const SENSITIVE_DATA_PATHS = new Set([
  "email",
  "phone",
  "ssn",
  "dob",
  "name",
  "address",
]);

/**
 * Sentry `beforeSend` hook. Scrubs PII per Iron Law 2.32 + Appendix K.
 *
 * Mutates the event in place and returns it. Returns null only if a
 * future caller needs to suppress an event entirely (currently never).
 */
export function beforeSend(
  event: ErrorEvent,
  _hint?: EventHint,
): ErrorEvent | null {
  void _hint;

  // Scrub request headers.
  if (event.request?.headers) {
    const headers = event.request.headers;
    for (const key of Object.keys(headers)) {
      if (SENSITIVE_HEADERS.has(key.toLowerCase())) {
        headers[key] = "[scrubbed]";
      }
    }
  }

  // Scrub request body (raw payment payloads etc.).
  if (event.request && event.request.data !== undefined) {
    event.request.data = "[scrubbed]";
  }

  // Scrub query parameters.
  if (event.request && event.request.query_string !== undefined) {
    event.request.query_string = "[scrubbed]";
  }

  // Scrub message body (email addresses).
  if (event.message) {
    event.message = event.message.replace(EMAIL_RE, "[email]");
  }

  // Scrub exception messages.
  if (event.exception?.values) {
    for (const ex of event.exception.values) {
      if (ex.value) {
        ex.value = ex.value.replace(EMAIL_RE, "[email]");
      }
    }
  }

  // Scrub breadcrumbs (messages + data PII).
  if (event.breadcrumbs) {
    for (const bc of event.breadcrumbs) {
      if (bc.message) {
        bc.message = bc.message.replace(EMAIL_RE, "[email]");
      }
      if (bc.data) {
        const data = bc.data as Record<string, unknown>;
        for (const key of SENSITIVE_DATA_PATHS) {
          if (key in data) {
            data[key] = "[scrubbed]";
          }
        }
      }
    }
  }

  // Scrub user PII.
  if (event.user) {
    if (event.user.email) {
      event.user.email = "[scrubbed]";
    }
    if (event.user.ip_address) {
      event.user.ip_address = "[scrubbed]";
    }
  }

  return event;
}
