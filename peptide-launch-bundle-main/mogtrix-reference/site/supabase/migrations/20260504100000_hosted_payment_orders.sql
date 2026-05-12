alter type public.order_status add value if not exists 'payment_requested';
alter type public.order_status add value if not exists 'payment_pending';
alter type public.order_status add value if not exists 'completed';
alter type public.order_status add value if not exists 'issue';

alter table public.orders
  add column if not exists external_payment_url text,
  add column if not exists external_payment_reference text,
  add column if not exists payment_last_event_id text,
  add column if not exists customer_next_step text,
  add column if not exists payment_requested_at timestamptz,
  add column if not exists completed_at timestamptz,
  add column if not exists shipment_tracking_reference text,
  add column if not exists shipment_tracking_url text,
  add column if not exists shipment_note text;

create table if not exists public.order_payment_events (
  id bigserial primary key,
  order_id text not null references public.orders(id) on delete cascade,
  provider text not null,
  external_reference text not null,
  provider_event_id text not null unique,
  event_type text not null,
  provider_status public.payment_status not null,
  payload jsonb not null,
  applied boolean not null default false,
  outcome_reason text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_staff_notes (
  id bigserial primary key,
  order_id text not null references public.orders(id) on delete cascade,
  author_profile_id uuid not null references public.profiles(id) on delete restrict,
  body text not null check (char_length(trim(body)) > 0 and char_length(body) <= 2000),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_orders_external_payment_reference
  on public.orders(external_payment_reference)
  where external_payment_reference is not null;

create index if not exists idx_orders_payment_last_event
  on public.orders(payment_last_event_id)
  where payment_last_event_id is not null;

create index if not exists idx_order_payment_events_order_id
  on public.order_payment_events(order_id, created_at desc);

create index if not exists idx_order_staff_notes_order_id
  on public.order_staff_notes(order_id, created_at desc);

alter table public.order_payment_events enable row level security;
alter table public.order_staff_notes enable row level security;

drop policy if exists "staff_manage_order_payment_events" on public.order_payment_events;
create policy "staff_manage_order_payment_events"
  on public.order_payment_events for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "staff_manage_order_staff_notes" on public.order_staff_notes;
create policy "staff_manage_order_staff_notes"
  on public.order_staff_notes for all
  using (public.is_staff())
  with check (public.is_staff());

drop trigger if exists order_staff_notes_updated_at on public.order_staff_notes;
create trigger order_staff_notes_updated_at
  before update on public.order_staff_notes
  for each row execute function public.touch_updated_at();
