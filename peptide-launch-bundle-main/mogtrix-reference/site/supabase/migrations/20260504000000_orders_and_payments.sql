do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type public.order_status as enum (
      'draft',
      'pending_payment',
      'paid',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type public.payment_status as enum (
      'pending',
      'processing',
      'succeeded',
      'failed',
      'cancelled',
      'refunded'
    );
  end if;
end $$;

create table if not exists public.orders (
  id text primary key,
  customer_id uuid not null references public.customer_profiles(id) on delete restrict,
  status public.order_status not null default 'draft',
  payment_status public.payment_status not null default 'pending',
  payment_provider text,
  payment_intent_id text,
  payment_method_summary text,
  subtotal_cents integer not null check (subtotal_cents >= 0),
  tax_cents integer not null default 0 check (tax_cents >= 0),
  shipping_cents integer not null default 0 check (shipping_cents >= 0),
  total_cents integer not null check (total_cents > 0),
  shipping_name text not null,
  shipping_address_line1 text not null,
  shipping_address_line2 text,
  shipping_city text not null,
  shipping_state text not null,
  shipping_postal_code text not null,
  shipping_country text not null default 'US',
  billing_same_as_shipping boolean not null default true,
  notes text,
  idempotency_key uuid not null unique,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  paid_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  cancelled_at timestamptz
);

create table if not exists public.order_items (
  id bigserial primary key,
  order_id text not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id),
  product_sku text not null,
  product_name text not null,
  price_cents integer not null check (price_cents > 0),
  quantity integer not null check (quantity > 0 and quantity <= 50),
  created_at timestamptz not null default timezone('utc', now()),
  unique (order_id, product_id)
);

create table if not exists public.order_status_history (
  id bigserial primary key,
  order_id text not null references public.orders(id) on delete cascade,
  previous_status public.order_status,
  next_status public.order_status not null,
  actor_type text not null default 'system',
  actor_id text,
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_orders_customer_id on public.orders(customer_id);
create index if not exists idx_orders_status_created on public.orders(status, created_at desc);
create index if not exists idx_orders_payment_intent on public.orders(payment_intent_id) where payment_intent_id is not null;
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_status_history_order_id on public.order_status_history(order_id, created_at desc);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;

drop policy if exists "customers_read_own_orders" on public.orders;
create policy "customers_read_own_orders"
  on public.orders for select
  using (auth.uid() = customer_id);

drop policy if exists "customers_create_orders" on public.orders;
create policy "customers_create_orders"
  on public.orders for insert
  with check (auth.uid() = customer_id);

drop policy if exists "customers_update_own_orders" on public.orders;
create policy "customers_update_own_orders"
  on public.orders for update
  using (auth.uid() = customer_id)
  with check (auth.uid() = customer_id);

drop policy if exists "staff_manage_orders" on public.orders;
create policy "staff_manage_orders"
  on public.orders for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "customers_read_own_order_items" on public.order_items;
create policy "customers_read_own_order_items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.customer_id = auth.uid()
    )
  );

drop policy if exists "customers_insert_order_items" on public.order_items;
create policy "customers_insert_order_items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.customer_id = auth.uid()
    )
  );

drop policy if exists "staff_manage_order_items" on public.order_items;
create policy "staff_manage_order_items"
  on public.order_items for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "customers_read_own_order_history" on public.order_status_history;
create policy "customers_read_own_order_history"
  on public.order_status_history for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_status_history.order_id
        and orders.customer_id = auth.uid()
    )
  );

drop policy if exists "customers_insert_own_order_history" on public.order_status_history;
create policy "customers_insert_own_order_history"
  on public.order_status_history for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_status_history.order_id
        and orders.customer_id = auth.uid()
    )
  );

drop policy if exists "staff_manage_order_history" on public.order_status_history;
create policy "staff_manage_order_history"
  on public.order_status_history for all
  using (public.is_staff())
  with check (public.is_staff());

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();
