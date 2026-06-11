-- ============================================================
-- Customer Accounts — add last_used_reset_nonce so the password-
-- reset endpoint can refuse to consume the same link twice
-- within its 1h validity window.
--
-- Spec: docs/superpowers/specs/2026-05-25-customer-accounts-mega-spec.md §3.4.
--
-- Purely additive; no alters on existing rows. Rollback = drop
-- the column.
-- ============================================================

alter table public.customer_profiles
  add column if not exists last_used_reset_nonce text;

-- No index — the column is read by exact equality against the
-- token's nonce, but only inside an UPDATE on a row already
-- located by its primary key. Index would burn write bandwidth
-- without query benefit.

-- Allow the trigger that blocks protected-column writes (from
-- 20260525000001_customer_accounts.sql) to keep `last_used_reset_nonce`
-- writable by the service-role. The trigger only blocks columns it
-- explicitly lists; if a downstream change adds a deny-list, this
-- column must NOT be on it.

comment on column public.customer_profiles.last_used_reset_nonce is
  'Most recent password-reset token nonce consumed for this profile. ' ||
  'The reset endpoint refuses a second POST that supplies the same nonce ' ||
  'so a stolen link can only be used once within its 1h validity window.';
