-- vialchemlabs — initial schema (Phase 10.1 v4).
--
-- Closes deferrals D2 / D3 / D4 / D5 / D6 / D7 from the v3.0 → v4.0 ledger.
-- Tables shipped here:
--
--   customers, addresses, magic_links, sessions, customer_qualifications,
--   attestations_audit, lab_partners, products_catalog, promo_codes,
--   email_subscriptions, orders, order_items, order_status_history,
--   payments, audit_log
--
-- RLS is enforced on every table that holds buyer-identifiable data. The
-- service_role key (only present in server-side env) bypasses RLS for
-- webhook reconciliation + scheduled jobs; anon key gets only what the
-- caller's auth.uid() permits.
--
-- Iron Law 2.5 / 2.19: this migration joins the protected paths list as
-- soon as it lands. Future edits require // SCANNER_OK annotations.
-- Iron Law 2.10: no review tables. Day-1 build has no on-site reviews;
-- Phase 11+ may add them via a separate migration after operator review.

set search_path = public;

create extension if not exists pgcrypto;
create extension if not exists citext;

-- ---------------------------------------------------------------------------
-- IDENTITIES
-- ---------------------------------------------------------------------------

create table customers (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Soft delete for GDPR + CCPA right-to-erasure.
  deleted_at timestamptz
);
comment on table customers is 'One row per qualified researcher account.';

create table addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  -- Free-text label set by the customer ("home", "lab", etc.)
  label text,
  recipient_name text not null,
  street text not null,
  street2 text,
  city text not null,
  state_code text not null,
  zip text not null,
  country_code text not null default 'US',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index addresses_customer_idx on addresses(customer_id);

-- D2 — passwordless auth via single-use magic links (1h expiry per spec).
create table magic_links (
  id uuid primary key default gen_random_uuid(),
  email citext not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now(),
  ip_address inet,
  user_agent text
);
create index magic_links_email_idx on magic_links(email);
create index magic_links_expiry_idx on magic_links(expires_at);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  ip_address inet,
  user_agent text
);
create index sessions_customer_idx on sessions(customer_id);
create index sessions_expiry_idx on sessions(expires_at);

-- D4 — qualification submission persistence with verbatim attestation hash.
create table customer_qualifications (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  email citext not null,
  -- Verbatim Appendix A.5 7-attestation block + role + research purpose.
  -- Stored as jsonb so future audits can replay the exact submission text.
  payload jsonb not null,
  -- Hash of the verbatim attestation copy at submission time. Lets us
  -- detect retroactively whether the operator silently weakened the copy.
  attestation_text_sha256 text not null,
  ip_address inet,
  user_agent text,
  submitted_at timestamptz not null default now()
);
create index customer_qualifications_email_idx on customer_qualifications(email);
create index customer_qualifications_customer_idx on customer_qualifications(customer_id);

-- D6 — append-only audit log of attestation acceptances.
create table attestations_audit (
  id bigserial primary key,
  qualification_id uuid references customer_qualifications(id) on delete set null,
  email citext not null,
  -- e.g. {"age_21_plus": true, "ruo_acknowledged": true, ...}
  attestations jsonb not null,
  legal_text_sha256 text not null,
  ip_address inet,
  user_agent text,
  recorded_at timestamptz not null default now()
);
create index attestations_audit_email_idx on attestations_audit(email);

-- ---------------------------------------------------------------------------
-- CATALOG (Phase 10 server-side mirror — Phase 11+ wires real stock)
-- ---------------------------------------------------------------------------

create table lab_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  contact_email citext,
  website_url text,
  default_for_brand boolean not null default false,
  created_at timestamptz not null default now()
);
comment on table lab_partners is 'Janoshik default; operator may add alternates.';

-- D-OPS-2 (KPV expansion) lives in lib/content/products.ts code today;
-- this mirror is the persistence target once stock + per-batch tracking
-- starts. Day-1 the code reads from lib/content/products.ts; webhooks
-- reconcile against this table. This is a forward-compatible scaffold.
create table products_catalog (
  sku text primary key,
  slug text not null unique,
  short_name text not null,
  full_name text not null,
  dose_label text not null,
  format text not null check (format in ('vial', 'bundle')),
  list_price_cents integer not null check (list_price_cents > 0),
  in_stock boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table promo_codes (
  code text primary key,
  description text,
  discount_pct numeric(5, 2) check (
    discount_pct is null or (discount_pct >= 0 and discount_pct <= 100)
  ),
  -- Cap on per-account usage; null = unlimited per account.
  max_uses_per_account integer,
  -- Cap on total code uses; null = unlimited.
  max_uses_total integer,
  current_uses integer not null default 0,
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- D5 — newsletter / email-marketing subscriptions linked to optional promo.
create table email_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  customer_id uuid references customers(id) on delete set null,
  promo_code text references promo_codes(code) on delete set null,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  -- Welcome-sequence delivery timestamps so we never double-send.
  welcome_email_1_sent_at timestamptz,
  welcome_email_2_sent_at timestamptz,
  welcome_email_3_sent_at timestamptz,
  welcome_email_4_sent_at timestamptz
);
create index email_subscriptions_customer_idx on email_subscriptions(customer_id);

-- ---------------------------------------------------------------------------
-- ORDERS (D3)
-- ---------------------------------------------------------------------------

create type order_status as enum (
  'pending',
  'awaiting_payment',
  'paid',
  'fulfilled',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
  'jurisdictional_rejected'
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  -- Public-facing order id (e.g. "VC-AB12CD34") — generateOrderId in
  -- ReviewPanel.tsx; persisted here at credit time.
  display_id text not null unique,
  customer_id uuid references customers(id) on delete set null,
  email citext not null,
  shipping_address_id uuid references addresses(id) on delete set null,
  -- Snapshot of the shipping address at order time. Iron Law 2.8 + D15:
  -- this is the address validated by Layer 3 jurisdictional guard.
  shipping_address_snapshot jsonb not null,
  status order_status not null default 'pending',
  payment_provider text not null check (
    payment_provider in ('stub', 'btcpay', 'plaid')
  ),
  promo_code text references promo_codes(code) on delete set null,
  subtotal_cents integer not null check (subtotal_cents >= 0),
  discount_cents integer not null default 0 check (discount_cents >= 0),
  shipping_cents integer not null default 0 check (shipping_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  placed_at timestamptz not null default now(),
  fulfilled_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  cancelled_at timestamptz,
  refunded_at timestamptz,
  jurisdictional_rejected_at timestamptz
);
create index orders_customer_idx on orders(customer_id);
create index orders_email_idx on orders(email);
create index orders_status_idx on orders(status);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  sku text not null,
  slug text not null,
  name_snapshot text not null,
  unit_price_cents integer not null check (unit_price_cents > 0),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);
create index order_items_order_idx on order_items(order_id);

create table order_status_history (
  id bigserial primary key,
  order_id uuid not null references orders(id) on delete cascade,
  from_status order_status,
  to_status order_status not null,
  reason text,
  changed_at timestamptz not null default now()
);
create index order_status_history_order_idx on order_status_history(order_id);

-- ---------------------------------------------------------------------------
-- PAYMENTS
-- ---------------------------------------------------------------------------

create type payment_status as enum (
  'pending',
  'authorized',
  'paid',
  'failed',
  'refunded'
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  provider text not null check (provider in ('stub', 'btcpay', 'plaid')),
  -- The provider's intent / invoice / transfer id. Indexed unique per
  -- provider so reconciliation idempotency holds across webhook retries.
  provider_intent_id text not null,
  status payment_status not null,
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'USD',
  method_details jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_intent_id)
);
create index payments_order_idx on payments(order_id);

-- ---------------------------------------------------------------------------
-- AUDIT LOG (D6)
-- ---------------------------------------------------------------------------

create table audit_log (
  id bigserial primary key,
  -- e.g. 'order.placed', 'payment.reconciled', 'qualification.submitted',
  -- 'jurisdictional_rejection.layer_3', 'consent.changed'
  event_type text not null,
  customer_id uuid references customers(id) on delete set null,
  order_id uuid references orders(id) on delete set null,
  -- Free-form details. Always include enough context to replay the event
  -- forensically.
  details jsonb not null,
  ip_address inet,
  user_agent text,
  recorded_at timestamptz not null default now()
);
create index audit_log_event_idx on audit_log(event_type);
create index audit_log_customer_idx on audit_log(customer_id);
create index audit_log_order_idx on audit_log(order_id);

-- ---------------------------------------------------------------------------
-- RLS POLICIES
-- ---------------------------------------------------------------------------

-- Service role bypasses RLS automatically (Supabase default). The policies
-- below govern the anon + authenticated roles.

alter table customers enable row level security;
alter table addresses enable row level security;
alter table magic_links enable row level security;
alter table sessions enable row level security;
alter table customer_qualifications enable row level security;
alter table attestations_audit enable row level security;
alter table products_catalog enable row level security;
alter table promo_codes enable row level security;
alter table email_subscriptions enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_status_history enable row level security;
alter table payments enable row level security;
alter table audit_log enable row level security;
alter table lab_partners enable row level security;

-- customers: read own row only.
create policy customers_self_select on customers
  for select using (auth.uid() = id);
create policy customers_self_update on customers
  for update using (auth.uid() = id);

-- addresses: own rows only.
create policy addresses_self on addresses
  for all using (customer_id = auth.uid())
  with check (customer_id = auth.uid());

-- magic_links: anon can insert (request a link); only service role reads.
create policy magic_links_anon_insert on magic_links
  for insert to anon, authenticated with check (true);

-- sessions: own rows only.
create policy sessions_self on sessions
  for select using (customer_id = auth.uid());

-- customer_qualifications: anon can insert (initial submission), buyer can
-- read their own subsequent records.
create policy qualifications_anon_insert on customer_qualifications
  for insert to anon, authenticated with check (true);
create policy qualifications_self_select on customer_qualifications
  for select using (
    customer_id = auth.uid() or email = auth.jwt() ->> 'email'
  );

-- attestations_audit: append-only for service role; readable by self-buyer.
create policy attestations_audit_self on attestations_audit
  for select using (email = auth.jwt() ->> 'email');

-- products_catalog: world-readable (mirrors public site catalog).
create policy products_catalog_public_read on products_catalog
  for select using (true);

-- promo_codes: world-readable for active codes only (price-display + signup).
create policy promo_codes_active_read on promo_codes
  for select using (active = true);

-- email_subscriptions: anon can insert (newsletter signup); buyer reads own.
create policy email_subscriptions_anon_insert on email_subscriptions
  for insert to anon, authenticated with check (true);
create policy email_subscriptions_self_read on email_subscriptions
  for select using (
    customer_id = auth.uid() or email = auth.jwt() ->> 'email'
  );

-- orders + order_items + order_status_history: own orders only.
create policy orders_self on orders
  for select using (
    customer_id = auth.uid() or email = auth.jwt() ->> 'email'
  );
create policy order_items_self on order_items
  for select using (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id
      and (o.customer_id = auth.uid() or o.email = auth.jwt() ->> 'email')
    )
  );
create policy order_status_history_self on order_status_history
  for select using (
    exists (
      select 1 from orders o
      where o.id = order_status_history.order_id
      and (o.customer_id = auth.uid() or o.email = auth.jwt() ->> 'email')
    )
  );

-- payments: own orders only (read-only — service role writes via webhook).
create policy payments_self_read on payments
  for select using (
    exists (
      select 1 from orders o
      where o.id = payments.order_id
      and (o.customer_id = auth.uid() or o.email = auth.jwt() ->> 'email')
    )
  );

-- audit_log: service role only (no client access). No policies = locked.

-- lab_partners: world-readable for footer attribution.
create policy lab_partners_public_read on lab_partners
  for select using (true);

-- ---------------------------------------------------------------------------
-- SEED DATA (Day-1)
-- ---------------------------------------------------------------------------

insert into lab_partners (name, slug, default_for_brand)
  values ('Janoshik Analytical', 'janoshik', true)
  on conflict (slug) do nothing;

insert into promo_codes (code, description, discount_pct, max_uses_per_account, active)
  values (
    'WELCOME15',
    '15% off first order — newsletter signup default code (Phase 7)',
    15.00,
    1,
    true
  )
  on conflict (code) do nothing;
