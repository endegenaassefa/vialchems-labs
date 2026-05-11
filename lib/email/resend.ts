/**
 * Phase 10.2 (v4) — Resend client wrapper.
 *
 * REQUIRE_RESEND=false (Day-1 default): sendEmail() returns a synthetic
 * { id: 'stub:...' } and writes nothing. Lets the newsletter / order
 * confirmation paths exercise the wiring end-to-end without real API
 * keys.
 *
 * When REQUIRE_RESEND=true, the Resend SDK is initialized lazily with
 * RESEND_API_KEY (.env.local only — Iron Law 2.22). Failures bubble up
 * as thrown errors; callers decide whether to retry / surface to user.
 *
 * Closes deferral D1 (real Resend wire + 4-email welcome sequence).
 */
import { Resend } from 'resend';

let cachedClient: Resend | null | undefined;

function isRequired(): boolean {
  return process.env.REQUIRE_RESEND === 'true';
}

function getClient(): Resend | null {
  if (cachedClient !== undefined) return cachedClient;
  if (!isRequired()) {
    cachedClient = null;
    return null;
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error(
      'Phase 10.2: REQUIRE_RESEND=true but RESEND_API_KEY is empty. Provide a real value in .env.local before deploying.',
    );
  }
  cachedClient = new Resend(key);
  return cachedClient;
}

export interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
  /** Override the default From; falls back to ORDER_EMAIL_FROM env var. */
  from?: string;
  /** Optional reply-to override. */
  replyTo?: string;
  /** Tag the email so Resend dashboard groups deliverability metrics. */
  tag?:
    | 'welcome-1'
    | 'welcome-2'
    | 'welcome-3'
    | 'welcome-4'
    | 'order-confirmation'
    | 'order-shipped'
    | 'cancel-confirmation'
    | 'refund-confirmation'
    | 'qualification-receipt'
    | 'magic-link';
}

export interface SendEmailResult {
  ok: boolean;
  id: string;
  stub?: boolean;
}

export async function sendEmail(
  input: SendEmailInput,
): Promise<SendEmailResult> {
  const client = getClient();
  const from =
    input.from ??
    process.env.ORDER_EMAIL_FROM ??
    `research@${process.env.BRAND_DOMAIN ?? 'vialchemlabs.com'}`;

  if (!client) {
    return {
      ok: true,
      id: `stub:${input.tag ?? 'untagged'}:${Date.now()}`,
      stub: true,
    };
  }

  const result = await client.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
    replyTo: input.replyTo,
    tags: input.tag ? [{ name: 'category', value: input.tag }] : undefined,
  });

  if (result.error) {
    throw new Error(`Resend send failed: ${result.error.message}`);
  }
  return { ok: true, id: result.data?.id ?? 'unknown' };
}

/** Test-only — clear the cached client between cases. */
export function _resetResendClientForTests(): void {
  cachedClient = undefined;
}
