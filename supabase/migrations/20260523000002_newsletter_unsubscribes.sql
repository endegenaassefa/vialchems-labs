-- ============================================================
-- E3 — Newsletter unsubscribe table (CAN-SPAM / GDPR compliance)
-- Section 6 super-prompt 2026-05-22.
--
-- CAN-SPAM (US) and GDPR (EU) require one-click unsubscribe in
-- every marketing email. This table records who opted out and
-- when, so the email send path can short-circuit before invoking
-- the Resend API. Transactional emails (order-confirmation,
-- shipped) are CAN-SPAM-exempt and continue to send regardless.
--
-- Iron Law 2.14 / 2.33 compliance:
--   - The table is INSERT-ONLY in normal operation; the email
--     gate reads (`select` only) and the unsubscribe route
--     inserts. There's no business reason to delete a row —
--     once opted-out, the user stays opted-out unless they
--     explicitly re-subscribe (which is a NEW insert with a
--     later timestamp on a separate `email_subscriptions` row).
--   - No trigger guard is added because this is a marketing
--     compliance log, not an audit trail. A DBA can clean test
--     data via Supabase Studio without firing a guard.
-- ============================================================

create table if not exists newsletter_unsubscribes (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  unsubscribed_at timestamptz not null default now(),
  -- The reason field is optional metadata captured from the
  -- unsubscribe confirmation page (e.g. "too frequent",
  -- "no longer interested"). NULL when the user clicks
  -- through without providing a reason.
  reason text,
  -- Source ties the unsubscribe back to the email template that
  -- carried the link (e.g. "welcome-1", "monthly-digest"). Helps
  -- spot a misbehaving template.
  source text,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_newsletter_unsubscribes_email
  on newsletter_unsubscribes(lower(email));

create index if not exists idx_newsletter_unsubscribes_unsubscribed_at
  on newsletter_unsubscribes(unsubscribed_at desc);
