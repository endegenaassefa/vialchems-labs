/**
 * Phase 10.2 (v4) + Phase 7 G4 (v5) — welcome-sequence dispatcher.
 *
 * Schedules the 4-email Appendix K sequence via Resend. Day-1 path
 * (REQUIRE_RESEND=false / REQUIRE_SUPABASE=false) returns synthetic
 * stub ids so the wiring exercises end-to-end without real keys.
 *
 * Email 1 fires immediately on subscribe. Emails 2/3/4 are scheduled
 * for delivery via Resend's `scheduledAt` parameter — the provider holds
 * them until the ISO timestamp. If a single send fails the dispatcher
 * captures the error to Sentry (Iron Law 2.32), continues with the
 * remaining templates, and returns partial-success ids.
 *
 * Idempotency: each successful send persists `welcome_email_X_sent_at`
 * on the corresponding email_subscriptions row. A second dispatch for
 * the same subscriptionId is a no-op for already-sent slots.
 *
 * Audit H8 closure (v5 Phase 7 G4): previously the dispatcher pushed
 * placeholder strings to ids[] without actually calling Resend for
 * emails 2/3/4. Now every template fires via sendEmail() with
 * scheduledAt; the welcome_email_X_sent_at columns record the moment
 * the dispatcher accepted the message (Resend retains delivery state).
 */
import { emailWelcomeSequence } from "@/lib/content/email-templates";
import { sendEmail } from "./resend";
import { captureException } from "@/lib/sentry";
import { serviceSupabase } from "@/lib/supabase";

export interface WelcomeDispatchOptions {
  email: string;
  /** Optional supabase row id for the email_subscriptions record. */
  subscriptionId?: string;
  /** Override "now" for deterministic tests; defaults to new Date(). */
  now?: Date;
}

export interface WelcomeDispatchResult {
  /** Number of emails actually queued / sent in this invocation. */
  dispatched: number;
  /** Provider message IDs (or stub:* identifiers) for successful sends only. */
  ids: string[];
}

const SENT_AT_COLUMNS = [
  "welcome_email_1_sent_at",
  "welcome_email_2_sent_at",
  "welcome_email_3_sent_at",
  "welcome_email_4_sent_at",
] as const;

const TAGS = ["welcome-1", "welcome-2", "welcome-3", "welcome-4"] as const;
type WelcomeTag = (typeof TAGS)[number];

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function dispatchWelcomeSequence(
  opts: WelcomeDispatchOptions,
): Promise<WelcomeDispatchResult> {
  const ids: string[] = [];
  const sb = serviceSupabase();
  const now = opts.now ?? new Date();

  // Idempotency pre-read: if a row exists with welcome_email_X_sent_at
  // already populated, skip that template. Misses (no row, no Supabase
  // client, or no subscriptionId) fall through to dispatch.
  let alreadySent: Record<string, string | null> = {};
  if (sb && opts.subscriptionId) {
    try {
      const { data } = await sb
        .from("email_subscriptions")
        .select(SENT_AT_COLUMNS.join(", "))
        .eq("id", opts.subscriptionId)
        .maybeSingle();
      if (data) {
        alreadySent = data as unknown as Record<string, string | null>;
      }
    } catch (err) {
      // Idempotency check failure is non-fatal — log and proceed with dispatch.
      captureException(err, {
        tags: { route: "welcome_sequence", phase: "idempotency_read" },
      });
    }
  }

  for (let i = 0; i < emailWelcomeSequence.length; i++) {
    const tpl = emailWelcomeSequence[i];
    const sentAtColumn = SENT_AT_COLUMNS[i];
    const tag: WelcomeTag = TAGS[Math.min(i, TAGS.length - 1)];

    // Idempotency: skip if this slot has already been dispatched.
    if (alreadySent[sentAtColumn]) {
      continue;
    }

    // Email 1 (delayDays=0) fires immediately; 2/3/4 carry scheduledAt.
    const scheduledAt =
      tpl.delayDays > 0
        ? new Date(now.getTime() + tpl.delayDays * ONE_DAY_MS).toISOString()
        : undefined;

    try {
      const result = await sendEmail({
        to: opts.email,
        subject: tpl.subject,
        text: tpl.body,
        tag,
        scheduledAt,
      });
      ids.push(result.id);

      // Persist sent-at on the subscription row so the next invocation
      // for the same subscriptionId treats this slot as already dispatched.
      if (sb && opts.subscriptionId) {
        try {
          await sb
            .from("email_subscriptions")
            .update({ [sentAtColumn]: now.toISOString() })
            .eq("id", opts.subscriptionId);
        } catch (err) {
          // Persistence failure is non-fatal — the email is already accepted
          // by Resend; the worst case is a re-send on next dispatch.
          captureException(err, {
            tags: {
              route: "welcome_sequence",
              phase: "persist_sent_at",
              template: tag,
            },
          });
        }
      }
    } catch (err) {
      // Per-email Resend failure: capture + continue with remaining templates.
      captureException(err, {
        tags: { route: "welcome_sequence", template: tag },
      });
    }
  }

  return { dispatched: ids.length, ids };
}
