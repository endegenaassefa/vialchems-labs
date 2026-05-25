-- ============================================================
-- Customer Accounts — customer_profiles + customer_addresses
-- + archived_accounts (soft-delete destination).
--
-- Spec: docs/superpowers/specs/2026-05-25-customer-accounts-mega-spec.md §7.
--
-- Purpose: back the rebuilt registration / account dashboard
-- with first-class profile + address rows tied to a Supabase
-- auth.users record. Migration is purely additive — no alters
-- on existing tables; rollback = drop these three tables.
--
-- Iron Law 2.36 — indexes on email + phone + auth_user_id +
-- archived_accounts.email so the uniqueness checks and look-ups
-- the registration / sign-in pipeline performs run on indexes.
--
-- RLS:
--   * customer_profiles + customer_addresses: customer sees ONLY
--     their own row (auth.uid() = auth_user_id). Service-role
--     bypasses RLS for the admin registration / deletion flow.
--   * archived_accounts: NO customer access. Service-role only.
-- ============================================================

-- ---------- customer_profiles ----------
create table if not exists public.customer_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  -- Email + phone uniqueness is enforced case/format-insensitively via the
  -- functional unique indexes below (lower(email) + phone). We keep the raw
  -- column nullable-on-the-side-of-NOT-NULL with a basic NOT NULL constraint
  -- and let the indexes own the uniqueness invariant.
  email text not null,
  phone text,
  full_name text not null check (char_length(full_name) between 2 and 120),
  date_of_birth date not null,
  research_org_type text not null check (research_org_type in
    ('university', 'biotech', 'independent_research', 'cro', 'government', 'individual', 'other')),
  research_org_other text,
  research_focus text not null check (char_length(research_focus) between 10 and 500),
  status text not null default 'pending_email_verification' check (status in
    ('pending_email_verification', 'active', 'suspended')),
  email_confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint age_at_least_21 check (date_of_birth <= current_date - interval '21 years')
);

-- Case-insensitive uniqueness for email (the auth identity). Without
-- lower(), Researcher@example.com and researcher@example.com would both
-- be allowed even though they map to the same Supabase auth user.
create unique index if not exists customer_profiles_email_unique_idx
  on public.customer_profiles(lower(email));
-- Phone uniqueness only when phone is set (NULLs allowed for the
-- many customers who don't provide one).
create unique index if not exists customer_profiles_phone_unique_idx
  on public.customer_profiles(phone) where phone is not null;
create index if not exists customer_profiles_auth_user_id_idx
  on public.customer_profiles(auth_user_id);
create index if not exists customer_profiles_status_idx
  on public.customer_profiles(status);

-- updated_at trigger so the column refreshes on every UPDATE.
create or replace function public.set_customer_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists customer_profiles_set_updated_at
  on public.customer_profiles;
create trigger customer_profiles_set_updated_at
  before update on public.customer_profiles
  for each row execute function public.set_customer_profiles_updated_at();

-- ---------- customer_addresses ----------
create table if not exists public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.customer_profiles(id) on delete cascade,
  kind text not null check (kind in ('mailing', 'shipping')),
  street1 text not null check (char_length(street1) between 1 and 200),
  street2 text check (street2 is null or char_length(street2) <= 200),
  city text not null check (char_length(city) between 1 and 100),
  region text not null check (char_length(region) between 1 and 100),
  postal_code text not null check (char_length(postal_code) between 2 and 20),
  country text not null default 'US' check (char_length(country) = 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, kind)
);

create index if not exists customer_addresses_profile_id_idx
  on public.customer_addresses(profile_id);

create or replace function public.set_customer_addresses_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists customer_addresses_set_updated_at
  on public.customer_addresses;
create trigger customer_addresses_set_updated_at
  before update on public.customer_addresses
  for each row execute function public.set_customer_addresses_updated_at();

-- ---------- archived_accounts ----------
-- Receives full snapshot at account-deletion time so the email +
-- phone uniqueness slots are freed for a fresh registration but
-- the operator retains a forensic trail (GDPR-aligned).
create table if not exists public.archived_accounts (
  id uuid primary key default gen_random_uuid(),
  original_profile_id uuid not null,
  email text not null,
  phone text,
  full_name text not null,
  date_of_birth date not null,
  research_org_type text not null,
  research_org_other text,
  research_focus text not null,
  archived_at timestamptz not null default now(),
  archive_reason text,
  raw_snapshot jsonb not null
);

-- Case-insensitive index so re-registration uniqueness check ("does an
-- archived account with this email exist? → allowed; with this email
-- but the profile is still active? → blocked") uses an index regardless
-- of the email-case the caller supplies.
create index if not exists archived_accounts_email_lower_idx
  on public.archived_accounts(lower(email));
create index if not exists archived_accounts_phone_idx
  on public.archived_accounts(phone) where phone is not null;
create index if not exists archived_accounts_original_profile_id_idx
  on public.archived_accounts(original_profile_id);

-- ---------- RLS ----------
alter table public.customer_profiles enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.archived_accounts enable row level security;

-- customer_profiles policies
drop policy if exists "customers read own profile" on public.customer_profiles;
create policy "customers read own profile"
  on public.customer_profiles for select
  using (auth.uid() = auth_user_id);

drop policy if exists "customers update own profile" on public.customer_profiles;
create policy "customers update own profile"
  on public.customer_profiles for update
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

-- IMPORTANT (codex P1, 2026-05-25): An RLS UPDATE policy with check
-- (auth.uid() = auth_user_id) is row-level, not column-level. Without
-- the trigger below, an authenticated customer could PATCH protected
-- fields (email, email_confirmed_at, status, auth_user_id, id,
-- date_of_birth, created_at) directly against the anon Supabase client
-- and bypass the email-change re-verification flow + the
-- pending→active gate.
--
-- This trigger fires for the `authenticated` and `anon` roles only —
-- `service_role` bypasses RLS AND skips this trigger via the role
-- check, so the registration / email-confirm / admin endpoints still
-- mutate these columns freely.
create or replace function public.customer_profiles_block_protected_writes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_role text := current_setting('request.jwt.claims', true)::jsonb ->> 'role';
begin
  -- service_role and the postgres superuser bypass entirely.
  if caller_role = 'service_role' or current_user = 'postgres' then
    return new;
  end if;

  if new.id is distinct from old.id then
    raise exception 'customer_profiles.id is immutable'
      using errcode = '42501';
  end if;
  if new.auth_user_id is distinct from old.auth_user_id then
    raise exception 'customer_profiles.auth_user_id is immutable'
      using errcode = '42501';
  end if;
  if new.email is distinct from old.email then
    raise exception 'email change must go through the verified email-change endpoint'
      using errcode = '42501';
  end if;
  if new.email_confirmed_at is distinct from old.email_confirmed_at then
    raise exception 'email_confirmed_at is set only by the email-confirm endpoint'
      using errcode = '42501';
  end if;
  if new.status is distinct from old.status then
    raise exception 'status transitions are server-managed'
      using errcode = '42501';
  end if;
  if new.date_of_birth is distinct from old.date_of_birth then
    raise exception 'date_of_birth is immutable; contact support to change'
      using errcode = '42501';
  end if;
  if new.created_at is distinct from old.created_at then
    raise exception 'created_at is immutable'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists customer_profiles_block_protected_writes
  on public.customer_profiles;
create trigger customer_profiles_block_protected_writes
  before update on public.customer_profiles
  for each row execute function public.customer_profiles_block_protected_writes();

-- customer_addresses policies (read + write own rows via profile FK).
drop policy if exists "customers read own addresses" on public.customer_addresses;
create policy "customers read own addresses"
  on public.customer_addresses for select
  using (exists (
    select 1 from public.customer_profiles p
    where p.id = profile_id and p.auth_user_id = auth.uid()
  ));

drop policy if exists "customers insert own addresses" on public.customer_addresses;
create policy "customers insert own addresses"
  on public.customer_addresses for insert
  with check (exists (
    select 1 from public.customer_profiles p
    where p.id = profile_id and p.auth_user_id = auth.uid()
  ));

drop policy if exists "customers update own addresses" on public.customer_addresses;
create policy "customers update own addresses"
  on public.customer_addresses for update
  using (exists (
    select 1 from public.customer_profiles p
    where p.id = profile_id and p.auth_user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.customer_profiles p
    where p.id = profile_id and p.auth_user_id = auth.uid()
  ));

drop policy if exists "customers delete own addresses" on public.customer_addresses;
create policy "customers delete own addresses"
  on public.customer_addresses for delete
  using (exists (
    select 1 from public.customer_profiles p
    where p.id = profile_id and p.auth_user_id = auth.uid()
  ));

-- archived_accounts: NO customer-facing policy. Only service-role
-- (which bypasses RLS) reads/writes this table.
