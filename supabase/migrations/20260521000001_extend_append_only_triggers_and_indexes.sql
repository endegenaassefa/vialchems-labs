-- v5 Phase 7 follow-up: extend append-only triggers and launch indexes.
--
-- 20260520000001 was already applied to production before the full v5
-- closure branch was rebased. This additive migration keeps that applied
-- migration immutable and applies the missing H15/H16/M11/M12 hardening.

set search_path = public;

-- Iron Law 2.33: one trigger function for append-only audit tables.
create or replace function reject_audit_mutation() returns trigger
  language plpgsql
  set search_path = public
as $$
begin
  raise exception 'Iron Law 2.33: cannot mutate %', tg_table_name
    using errcode = 'P0001';
end
$$;

comment on function reject_audit_mutation() is
  'Iron Law 2.33: raises P0001 on any UPDATE/DELETE against audit tables. Append-only is enforced at DB level, not just by convention.';

-- attestations_audit (H15): documented append-only but missing DB trigger.
drop trigger if exists no_mutate_attestations_audit on attestations_audit;
create trigger no_mutate_attestations_audit
  before update or delete on attestations_audit
  for each row execute function reject_audit_mutation();

-- audit_log was hardened by 20260520000001 under trigger name
-- reject_audit_mutation. Normalize to the v5 trigger naming convention so
-- introspection has one no_mutate_* pattern across audit tables.
drop trigger if exists reject_audit_mutation on audit_log;
drop trigger if exists no_mutate_audit_log on audit_log;
create trigger no_mutate_audit_log
  before update or delete on audit_log
  for each row execute function reject_audit_mutation();

-- order_status_history (H16): forensic-critical status transition log.
drop trigger if exists no_mutate_order_status_history on order_status_history;
create trigger no_mutate_order_status_history
  before update or delete on order_status_history
  for each row execute function reject_audit_mutation();

-- Iron Law 2.36: missing datetime and FK indexes (M11).
create index if not exists idx_orders_placed_at
  on orders(placed_at);

create index if not exists idx_email_subscriptions_unsubscribed_at
  on email_subscriptions(unsubscribed_at)
  where unsubscribed_at is not null;

create index if not exists idx_audit_log_recorded_at
  on audit_log(recorded_at);

create index if not exists idx_order_status_history_changed_at
  on order_status_history(changed_at);

create index if not exists idx_attestations_audit_qualification_id
  on attestations_audit(qualification_id);

create index if not exists idx_attestations_audit_recorded_at
  on attestations_audit(recorded_at);

-- H23 / M12: RLS policy clarification comments.
comment on policy magic_links_anon_insert on magic_links is
  'Unlimited anon insert BY DESIGN. Anti-abuse: API-layer rate-limit (lib/rate-limit.ts; app/api/access/route.ts). Iron Law 2.34.';

comment on policy qualifications_anon_insert on customer_qualifications is
  'Unlimited anon insert BY DESIGN. Anti-abuse: API-layer rate-limit (lib/rate-limit.ts). Iron Law 2.34.';

comment on policy sessions_self on sessions is
  'SELECT-only by session owner. INSERT/UPDATE/DELETE service-role only (implicit by absence of policies; Postgres RLS default-deny). Iron Law 2.23.';

-- H24: keep the brand lab-agnostic. This was also set in 20260520000001;
-- retain it here so the additive migration is idempotent and self-describing.
update lab_partners
  set default_for_brand = false
  where slug = 'janoshik';
