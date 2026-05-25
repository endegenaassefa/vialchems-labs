-- ============================================================
-- Customer Accounts — consumed_password_reset_nonces table.
--
-- Codex P2 (2026-05-25): the previous design stamped the most-
-- recently-used nonce on customer_profiles.last_used_reset_nonce
-- which (a) only blocks the LATEST link from being reused —
-- earlier outstanding links can still be replayed — and (b) is
-- racy: two concurrent submits with the same nonce can both pass
-- the read-before-write check.
--
-- This migration replaces that approach with a dedicated table
-- keyed by (auth_user_id, nonce) with a UNIQUE constraint. The
-- reset endpoint INSERTs the nonce before mutating the password;
-- a duplicate INSERT raises 23505 (unique violation) and the
-- endpoint surfaces invalid_or_expired_token. This is atomic at
-- the row-lock level — concurrent submits with the same nonce
-- are mutually exclusive via the unique constraint.
--
-- The column last_used_reset_nonce on customer_profiles is left
-- in place but no longer enforced — it stays as a forensic
-- "most recent reset" marker that the server endpoint may
-- continue to write (best-effort).
-- ============================================================

create table if not exists public.consumed_password_reset_nonces (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null,
  nonce text not null,
  consumed_at timestamptz not null default now(),
  unique (auth_user_id, nonce)
);

create index if not exists consumed_password_reset_nonces_auth_user_id_idx
  on public.consumed_password_reset_nonces(auth_user_id);

-- RLS: no customer access. Service-role only.
alter table public.consumed_password_reset_nonces enable row level security;
-- (No CREATE POLICY: with RLS enabled and no policies, only
-- service-role-bypass-RLS callers can see/modify rows.)

comment on table public.consumed_password_reset_nonces is
  'One row per password-reset token nonce ever consumed by an account. ' ||
  'The reset endpoint INSERTs the nonce as the FIRST mutation of the ' ||
  'reset flow — a unique-violation (23505) atomically aborts the ' ||
  'password change so a leaked link can only be used once per ' ||
  'account-nonce combination even with concurrent submits.';
