-- Phase A — Order Admin foundation (CEO plan 2026-05-13).
--
-- Adds the columns the ops UI needs to fulfill, ship, and refund orders,
-- plus an `is_test` flag on every customer-data table so we can seed fake
-- orders into the same Supabase project without polluting production data.
--
-- Per D18 (user picked single-project staging) and the three guardrails:
--   1. is_test default false at the column level (this migration)
--   2. productionOnly() query helper (lib/db/scoped.ts — next commit)
--   3. email kill-switch routing is_test=true emails to ORDER_TEST_INBOX
--      (lib/email/order-emails.ts — commit 4)
--
-- This migration is purely additive (no enum changes, no drops) so it is
-- safe to apply to a database with existing orders. All new columns are
-- nullable or have non-breaking defaults.

-- ---------------------------------------------------------------------------
-- 1. SHIPPING + REFUND COLUMNS ON `orders`
-- ---------------------------------------------------------------------------

alter table orders
  add column if not exists tracking_number text,
  add column if not exists shippo_transaction_id text,
  add column if not exists shipped_carrier text,
  add column if not exists refund_reason text,
  add column if not exists refund_amount_cents integer;

alter table orders
  drop constraint if exists orders_shipped_carrier_check;

alter table orders
  add constraint orders_shipped_carrier_check
  check (
    shipped_carrier is null
    or shipped_carrier in ('usps', 'ups', 'fedex', 'dhl', 'other')
  );

alter table orders
  drop constraint if exists orders_refund_amount_check;

alter table orders
  add constraint orders_refund_amount_check
  check (
    refund_amount_cents is null
    or (refund_amount_cents >= 0 and refund_amount_cents <= total_cents)
  );

-- Shippo transaction ids are globally unique per Shippo account; enforce so
-- a duplicate webhook can't double-attach a label to two orders.
create unique index if not exists orders_shippo_transaction_id_unique
  on orders(shippo_transaction_id)
  where shippo_transaction_id is not null;

-- Webhook ingestion looks up orders by tracking number; partial index keeps
-- the index tight (most rows have no tracking until shipped).
create index if not exists orders_tracking_number_idx
  on orders(tracking_number)
  where tracking_number is not null;

-- ---------------------------------------------------------------------------
-- 2. is_test FLAG ON CUSTOMER-DATA TABLES (D18 staging strategy)
-- ---------------------------------------------------------------------------
--
-- Every table that holds order/payment/qualification data gets an is_test
-- column. Default `false` means production-safe by default — code has to
-- *explicitly* opt in to writing test data.

alter table orders
  add column if not exists is_test boolean not null default false;

alter table order_items
  add column if not exists is_test boolean not null default false;

alter table order_status_history
  add column if not exists is_test boolean not null default false;

alter table payments
  add column if not exists is_test boolean not null default false;

alter table audit_log
  add column if not exists is_test boolean not null default false;

alter table customer_qualifications
  add column if not exists is_test boolean not null default false;

alter table email_subscriptions
  add column if not exists is_test boolean not null default false;

-- ---------------------------------------------------------------------------
-- 3. INDEXES FOR THE OPS UI
-- ---------------------------------------------------------------------------
--
-- Ops list view filters by (is_test, status, placed_at desc). Composite
-- index covers the default query "show production orders, newest first,
-- optionally filtered by status."

create index if not exists orders_ops_list_idx
  on orders(is_test, status, placed_at desc);

create index if not exists orders_ops_email_idx
  on orders(is_test, email);

-- ---------------------------------------------------------------------------
-- 4. RLS POLICY UPDATES — TEST ROWS INVISIBLE TO CUSTOMERS
-- ---------------------------------------------------------------------------
--
-- Existing RLS lets customers see their own orders. We extend each
-- customer-facing read policy so test rows are NEVER returned to a logged-in
-- customer, even if the email/customer_id matches. Service role bypasses
-- RLS so ops admin still sees everything.

drop policy if exists orders_self on orders;
create policy orders_self on orders
  for select using (
    (customer_id = auth.uid() or email = auth.jwt() ->> 'email')
    and is_test = false
  );

drop policy if exists order_items_self on order_items;
create policy order_items_self on order_items
  for select using (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id
      and (o.customer_id = auth.uid() or o.email = auth.jwt() ->> 'email')
      and o.is_test = false
    )
  );

drop policy if exists order_status_history_self on order_status_history;
create policy order_status_history_self on order_status_history
  for select using (
    exists (
      select 1 from orders o
      where o.id = order_status_history.order_id
      and (o.customer_id = auth.uid() or o.email = auth.jwt() ->> 'email')
      and o.is_test = false
    )
  );

drop policy if exists payments_self_read on payments;
create policy payments_self_read on payments
  for select using (
    exists (
      select 1 from orders o
      where o.id = payments.order_id
      and (o.customer_id = auth.uid() or o.email = auth.jwt() ->> 'email')
      and o.is_test = false
    )
  );

drop policy if exists qualifications_self_select on customer_qualifications;
create policy qualifications_self_select on customer_qualifications
  for select using (
    (customer_id = auth.uid() or email = auth.jwt() ->> 'email')
    and is_test = false
  );

drop policy if exists email_subscriptions_self_read on email_subscriptions;
create policy email_subscriptions_self_read on email_subscriptions
  for select using (
    (customer_id = auth.uid() or email = auth.jwt() ->> 'email')
    and is_test = false
  );

-- audit_log has no client-facing policies (service-role only) so test rows
-- there are already inaccessible to customers — no policy change needed.

-- ---------------------------------------------------------------------------
-- 5. INHERITANCE TRIGGERS — child rows mirror parent order's is_test flag
-- ---------------------------------------------------------------------------

create or replace function order_status_history_inherit_test_flag()
returns trigger
language plpgsql
as $$
declare
  v_is_test boolean;
begin
  if new.is_test is null or new.is_test = false then
    select is_test into v_is_test from orders where id = new.order_id;
    if v_is_test is true then
      new.is_test := true;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists order_status_history_test_inherit on order_status_history;
create trigger order_status_history_test_inherit
  before insert on order_status_history
  for each row
  execute function order_status_history_inherit_test_flag();

create or replace function order_items_inherit_test_flag()
returns trigger
language plpgsql
as $$
declare
  v_is_test boolean;
begin
  if new.is_test is null or new.is_test = false then
    select is_test into v_is_test from orders where id = new.order_id;
    if v_is_test is true then
      new.is_test := true;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists order_items_test_inherit on order_items;
create trigger order_items_test_inherit
  before insert on order_items
  for each row
  execute function order_items_inherit_test_flag();

create or replace function payments_inherit_test_flag()
returns trigger
language plpgsql
as $$
declare
  v_is_test boolean;
begin
  if new.is_test is null or new.is_test = false then
    select is_test into v_is_test from orders where id = new.order_id;
    if v_is_test is true then
      new.is_test := true;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists payments_test_inherit on payments;
create trigger payments_test_inherit
  before insert on payments
  for each row
  execute function payments_inherit_test_flag();

create or replace function audit_log_inherit_test_flag()
returns trigger
language plpgsql
as $$
declare
  v_is_test boolean;
begin
  if new.is_test is null or new.is_test = false then
    if new.order_id is not null then
      select is_test into v_is_test from orders where id = new.order_id;
      if v_is_test is true then
        new.is_test := true;
      end if;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists audit_log_test_inherit on audit_log;
create trigger audit_log_test_inherit
  before insert on audit_log
  for each row
  execute function audit_log_inherit_test_flag();

-- ---------------------------------------------------------------------------
-- 6. COMMENTS
-- ---------------------------------------------------------------------------

comment on column orders.tracking_number is
  'Carrier tracking number assigned at ship time (Shippo or manual paste).';
comment on column orders.shippo_transaction_id is
  'Shippo transaction id when label was bought via Shippo API. Unique.';
comment on column orders.shipped_carrier is
  'usps | ups | fedex | dhl | other. Required when tracking_number is set.';
comment on column orders.refund_reason is
  'Free-text reason or category captured by ops at refund time.';
comment on column orders.refund_amount_cents is
  'Refund amount in cents; <= total_cents. Partial refunds allowed (D17).';
comment on column orders.is_test is
  'Test/staging flag. Default false. Set true only by test data seeder.';
