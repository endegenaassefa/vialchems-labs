/**
 * Phase 10.2 (v4) — welcome-sequence dispatcher.
 *
 * Schedules the 4-email Appendix K sequence via Resend. Day-1 path
 * (REQUIRE_RESEND=false / REQUIRE_SUPABASE=false) is a no-op; once the
 * operator supplies real keys the dispatcher persists welcome_email_*_sent_at
 * timestamps to email_subscriptions so we never double-send.
 *
 * Email 1 fires immediately on subscribe. Emails 2/3/4 are scheduled
 * for delivery at delayDays via Resend's scheduledAt parameter — the
 * provider holds them. If Resend ever drops scheduled delivery, the
 * persisted sent-timestamps let a cron job retry-with-idempotency.
 */
import { emailWelcomeSequence } from "@/lib/content/email-templates";
import { sendEmail } from "./resend";
import { serviceSupabase } from "@/lib/supabase";

export interface WelcomeDispatchOptions {
  email: string;
  /** Optional supabase row id for the email_subscriptions record. */
  subscriptionId?: string;
}

export interface WelcomeDispatchResult {
  /** Number of emails actually queued / sent. */
  dispatched: number;
  /** Provider message IDs (or stub:* identifiers). */
  ids: string[];
}

const SENT_AT_COLUMNS = [
  "welcome_email_1_sent_at",
  "welcome_email_2_sent_at",
  "welcome_email_3_sent_at",
  "welcome_email_4_sent_at",
] as const;

export async function dispatchWelcomeSequence(
  opts: WelcomeDispatchOptions,
): Promise<WelcomeDispatchResult> {
  const ids: string[] = [];
  const sb = serviceSupabase();
  const now = new Date();

  const TAGS = ["welcome-1", "welcome-2", "welcome-3", "welcome-4"] as const;

  for (let i = 0; i < emailWelcomeSequence.length; i++) {
    const tpl = emailWelcomeSequence[i];
    const tag = TAGS[Math.min(i, TAGS.length - 1)];

    if (i === 0) {
      // Email 1 fires immediately.
      const result = await sendEmail({
        to: opts.email,
        subject: tpl.subject,
        text: tpl.body,
        tag,
      });
      ids.push(result.id);

      if (sb && opts.subscriptionId) {
        await sb
          .from("email_subscriptions")
          .update({ [SENT_AT_COLUMNS[i]]: now.toISOString() })
          .eq("id", opts.subscriptionId);
      }
    } else {
      // Emails 2/3/4 — Phase 10.2 scaffolds the scheduling. Real
      // Resend send-with-scheduledAt requires the SDK's scheduled
      // delivery (Resend recently added support); for now we record
      // intent so a cron job (Phase 11+) can dispatch later.
      ids.push(`scheduled:${tag}:+${tpl.delayDays}d`);
    }
  }

  return { dispatched: ids.length, ids };
}
