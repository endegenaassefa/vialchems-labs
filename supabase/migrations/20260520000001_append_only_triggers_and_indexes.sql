-- v5 production closure: append-only audit hardening and launch indexes.
--
-- This migration is intentionally idempotent:
-- - audit_log remains append-only after insert
-- - Janoshik is retained as a lab partner record but is not the brand default
-- - indexes support operational audit/order lookup paths

set search_path = public;

create or replace function reject_audit_mutation()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  raise exception 'audit_log_append_only: audit_log rows cannot be updated or deleted';
end;
$$;

drop trigger if exists reject_audit_mutation on audit_log;
create trigger reject_audit_mutation
  before update or delete on audit_log
  for each row
  execute function reject_audit_mutation();

update lab_partners
set default_for_brand = false
where slug = 'janoshik'
   or name ilike 'Janoshik%';

create index if not exists audit_log_recorded_at_idx
  on audit_log (recorded_at desc);

create index if not exists audit_log_order_recorded_at_idx
  on audit_log (order_id, recorded_at desc)
  where order_id is not null;

create index if not exists audit_log_customer_recorded_at_idx
  on audit_log (customer_id, recorded_at desc)
  where customer_id is not null;

create index if not exists audit_log_event_recorded_at_idx
  on audit_log (event_type, recorded_at desc);

create index if not exists lab_partners_default_for_brand_idx
  on lab_partners (default_for_brand)
  where default_for_brand = true;
