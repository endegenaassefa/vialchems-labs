-- ============================================================
-- P2B — Affiliate program applications table
-- (Super-prompt §7.2 closure).
--
-- Operator reports affiliate signups are "not working" because the
-- form at app/affiliate/page.tsx was a 250ms setTimeout stub with no
-- API route. This migration backs the new /api/affiliate route handler
-- that persists each application + emails both the operator and the
-- applicant.
--
-- Iron Law 2.33 — audit lineage:
--   - status transitions (pending → approved/rejected) write
--     audit_log rows via the operator dashboard handler (out of
--     scope for this migration).
--   - the table itself stays INSERT-mostly; rare status updates by
--     the operator are not append-only-guarded because affiliate
--     applications are a CRM-style workflow, not a financial audit
--     trail.
--
-- Iron Law 2.36 — indexes on email + created_at for the operator
-- dashboard "review queue" list.
-- ============================================================

create table if not exists affiliate_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  audience text,
  views text,
  handles text,
  focus text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by text,
  notes text
);

-- Soft uniqueness: one open application per email at a time. Rejected
-- applications can be re-applied after the operator clears the status.
create index if not exists idx_affiliate_applications_email
  on affiliate_applications(lower(email));

create index if not exists idx_affiliate_applications_created_at
  on affiliate_applications(created_at desc);

create index if not exists idx_affiliate_applications_status
  on affiliate_applications(status, created_at desc);

-- RLS: writeable by service role (the /api/affiliate route uses
-- service-role key); not readable from client (operator dashboard
-- uses service-role for the review list).
alter table affiliate_applications enable row level security;

-- No public-facing RLS policy. The route handler reads/writes via
-- the service-role client; the operator dashboard ditto. Clients
-- never read this table directly.
