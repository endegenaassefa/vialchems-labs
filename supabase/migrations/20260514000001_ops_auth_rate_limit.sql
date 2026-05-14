-- Ops auth rate limiting (CSO interim hardening, 2026-05-14).
--
-- Records every ops sign-in attempt so /api/ops/session can lock out
-- brute-force attempts against the shared OPS_API_TOKEN. Purely additive —
-- one new table, no enum changes, no drops — safe to apply to a database
-- with existing data.
--
-- Two-layer limit (enforced in lib/ops/rate-limit.ts):
--   - per-IP: catches a casual attacker hammering from one address
--   - global: catches an attacker rotating the spoofable X-Forwarded-For
--     header, at the cost of briefly locking sign-in for everyone — an
--     acceptable trade vs. a compromised ops token.
--
-- RLS is enabled with no policies, matching every other table in init.sql:
-- only the service-role client (which bypasses RLS) ever touches this table.

create table if not exists ops_auth_attempts (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  succeeded boolean not null,
  attempted_at timestamptz not null default now()
);

-- Per-IP failure lookups over a recent window.
create index if not exists ops_auth_attempts_ip_time_idx
  on ops_auth_attempts (ip_hash, attempted_at);

-- Global failure lookups + the best-effort age-out purge.
create index if not exists ops_auth_attempts_time_idx
  on ops_auth_attempts (attempted_at);

alter table ops_auth_attempts enable row level security;
