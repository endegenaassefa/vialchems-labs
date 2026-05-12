create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'app_role'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.app_role as enum ('staff', 'admin');
  end if;

  if not exists (
    select 1
    from pg_type
    where typname = 'research_request_status'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.research_request_status as enum (
      'pending_review',
      'approved',
      'rejected',
      'needs_more_info'
    );
  end if;

  if not exists (
    select 1
    from pg_type
    where typname = 'request_actor_type'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.request_actor_type as enum ('system', 'staff');
  end if;
end
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  organization text,
  role public.app_role not null default 'staff',
  staff_active boolean not null default false,
  age_verified boolean not null default false,
  blacklisted boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and staff_active = true
      and role = 'admin'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and staff_active = true
      and role in ('staff', 'admin')
  );
$$;

create table if not exists public.products (
  id text primary key,
  slug text not null unique,
  sku text not null unique,
  name text not null,
  summary text not null,
  category text not null,
  format text not null,
  storage text not null,
  price_cents integer not null check (price_cents > 0),
  research_use_only boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  storage_bucket text not null default 'product-images',
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0 check (sort_order >= 0),
  is_primary boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (product_id, storage_path)
);

create table if not exists public.research_order_requests (
  id text primary key,
  idempotency_key uuid not null unique,
  contact_name text not null,
  organization text not null,
  email text not null,
  normalized_email text not null,
  project_summary text not null,
  status public.research_request_status not null default 'pending_review',
  request_origin text,
  origin_ip_hash text,
  user_agent text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  last_status_changed_at timestamptz not null default timezone('utc', now()),
  check (char_length(trim(contact_name)) > 0),
  check (char_length(trim(organization)) > 0),
  check (char_length(trim(email)) > 0),
  check (char_length(trim(project_summary)) >= 12)
);

create table if not exists public.research_order_items (
  id bigserial primary key,
  request_id text not null references public.research_order_requests(id) on delete cascade,
  product_id text not null references public.products(id),
  product_sku text not null,
  product_name text not null,
  product_price_cents integer not null check (product_price_cents > 0),
  quantity integer not null check (quantity > 0 and quantity <= 50),
  created_at timestamptz not null default timezone('utc', now()),
  unique (request_id, product_id)
);

create table if not exists public.consent_logs (
  id bigserial primary key,
  request_id text not null references public.research_order_requests(id) on delete cascade,
  attestation_id text not null,
  clause text not null,
  accepted boolean not null,
  accepted_at timestamptz not null,
  source text not null,
  request_origin text,
  user_agent text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (request_id, attestation_id)
);

create table if not exists public.request_status_history (
  id bigserial primary key,
  request_id text not null references public.research_order_requests(id) on delete cascade,
  previous_status public.research_request_status,
  next_status public.research_request_status not null,
  actor_type public.request_actor_type not null default 'system',
  actor_profile_id uuid references public.profiles(id) on delete set null,
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.staff_notes (
  id bigserial primary key,
  request_id text not null references public.research_order_requests(id) on delete cascade,
  author_profile_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (char_length(trim(body)) > 0)
);

create index if not exists idx_profiles_role_active
  on public.profiles (role, staff_active);

create index if not exists idx_products_active_slug
  on public.products (active, slug);

create index if not exists idx_product_images_product_sort
  on public.product_images (product_id, sort_order);

create unique index if not exists idx_product_images_primary
  on public.product_images (product_id)
  where is_primary = true;

create index if not exists idx_requests_status_created
  on public.research_order_requests (status, created_at desc);

create index if not exists idx_requests_normalized_email
  on public.research_order_requests (normalized_email);

create index if not exists idx_requests_origin_ip_hash
  on public.research_order_requests (origin_ip_hash, created_at desc);

create index if not exists idx_items_request_id
  on public.research_order_items (request_id);

create index if not exists idx_consent_logs_request_id
  on public.consent_logs (request_id);

create index if not exists idx_request_status_history_request_id
  on public.request_status_history (request_id, created_at desc);

create index if not exists idx_staff_notes_request_id
  on public.staff_notes (request_id, created_at desc);

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
before update on public.products
for each row execute function public.touch_updated_at();

drop trigger if exists product_images_touch_updated_at on public.product_images;
create trigger product_images_touch_updated_at
before update on public.product_images
for each row execute function public.touch_updated_at();

drop trigger if exists requests_touch_updated_at on public.research_order_requests;
create trigger requests_touch_updated_at
before update on public.research_order_requests
for each row execute function public.touch_updated_at();

drop trigger if exists staff_notes_touch_updated_at on public.staff_notes;
create trigger staff_notes_touch_updated_at
before update on public.staff_notes
for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.research_order_requests enable row level security;
alter table public.research_order_items enable row level security;
alter table public.consent_logs enable row level security;
alter table public.request_status_history enable row level security;
alter table public.staff_notes enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
using (active = true and research_use_only = true);

drop policy if exists "Staff can manage products" on public.products;
create policy "Staff can manage products"
on public.products
for all
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "Public can read product images" on public.product_images;
create policy "Public can read product images"
on public.product_images
for select
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
      and products.active = true
      and products.research_use_only = true
  )
);

drop policy if exists "Staff can manage product images" on public.product_images;
create policy "Staff can manage product images"
on public.product_images
for all
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "Staff can read staff profiles" on public.profiles;
create policy "Staff can read staff profiles"
on public.profiles
for select
using (public.is_staff());

drop policy if exists "Staff can update own profile" on public.profiles;
create policy "Staff can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Admins can manage profiles"
on public.profiles
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Staff can read requests" on public.research_order_requests;
create policy "Staff can read requests"
on public.research_order_requests
for select
using (public.is_staff());

drop policy if exists "Staff can update requests" on public.research_order_requests;
create policy "Staff can update requests"
on public.research_order_requests
for update
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "Staff can read request items" on public.research_order_items;
create policy "Staff can read request items"
on public.research_order_items
for select
using (public.is_staff());

drop policy if exists "Staff can read consent logs" on public.consent_logs;
create policy "Staff can read consent logs"
on public.consent_logs
for select
using (public.is_staff());

drop policy if exists "Staff can read request status history" on public.request_status_history;
create policy "Staff can read request status history"
on public.request_status_history
for select
using (public.is_staff());

drop policy if exists "Staff can insert request status history" on public.request_status_history;
create policy "Staff can insert request status history"
on public.request_status_history
for insert
with check (public.is_staff());

drop policy if exists "Staff can read notes" on public.staff_notes;
create policy "Staff can read notes"
on public.staff_notes
for select
using (public.is_staff());

drop policy if exists "Staff can write notes" on public.staff_notes;
create policy "Staff can write notes"
on public.staff_notes
for insert
with check (public.is_staff());

drop policy if exists "Staff can update notes" on public.staff_notes;
create policy "Staff can update notes"
on public.staff_notes
for update
using (public.is_staff())
with check (public.is_staff());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read product image objects" on storage.objects;
create policy "Public can read product image objects"
on storage.objects
for select
using (bucket_id = 'product-images');

drop policy if exists "Staff can manage product image objects" on storage.objects;
create policy "Staff can manage product image objects"
on storage.objects
for all
using (bucket_id = 'product-images' and public.is_staff())
with check (bucket_id = 'product-images' and public.is_staff());

create or replace function public.create_research_order_request(
  p_contact_name text,
  p_organization text,
  p_email text,
  p_project_summary text,
  p_items jsonb,
  p_consent_logs jsonb,
  p_idempotency_key uuid,
  p_request_origin text default null,
  p_origin_ip_hash text default null,
  p_user_agent text default null
)
returns table (
  id text,
  status public.research_request_status,
  duplicate boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing_id text;
  v_existing_status public.research_request_status;
  v_request_id text;
  v_status public.research_request_status := 'pending_review';
begin
  if p_idempotency_key is null then
    raise exception 'IDEMPOTENCY_KEY_REQUIRED';
  end if;

  if coalesce(jsonb_array_length(p_items), 0) = 0 then
    raise exception 'REQUEST_ITEMS_REQUIRED';
  end if;

  if coalesce(jsonb_array_length(p_consent_logs), 0) = 0 then
    raise exception 'CONSENT_LOGS_REQUIRED';
  end if;

  if p_origin_ip_hash is not null and (
    select count(*)
    from public.research_order_requests
    where origin_ip_hash = p_origin_ip_hash
      and created_at >= timezone('utc', now()) - interval '15 minutes'
  ) >= 5 then
    raise exception 'RATE_LIMITED';
  end if;

  select request.id, request.status
  into v_existing_id, v_existing_status
  from public.research_order_requests as request
  where request.idempotency_key = p_idempotency_key;

  if v_existing_id is not null then
    return query
    select v_existing_id, v_existing_status, true;
    return;
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(p_items) as item(product_id text, quantity integer)
    where product_id is null
      or btrim(product_id) = ''
      or quantity is null
      or quantity < 1
      or quantity > 50
  ) then
    raise exception 'INVALID_REQUEST_ITEMS';
  end if;

  if exists (
    select 1
    from (
      select distinct btrim(item.product_id) as product_id
      from jsonb_to_recordset(p_items) as item(product_id text, quantity integer)
    ) as requested
    left join public.products
      on products.id = requested.product_id
     and products.active = true
     and products.research_use_only = true
    where products.id is null
  ) then
    raise exception 'INVALID_PRODUCT_IDS';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(
      p_consent_logs
    ) as consent(
      attestation_id text,
      clause text,
      accepted boolean,
      accepted_at timestamptz,
      source text
    )
    where attestation_id is null
      or btrim(attestation_id) = ''
      or clause is null
      or btrim(clause) = ''
      or accepted is distinct from true
      or accepted_at is null
      or source is null
      or btrim(source) = ''
  ) then
    raise exception 'INVALID_CONSENT_LOGS';
  end if;

  v_request_id := 'req_' || replace(gen_random_uuid()::text, '-', '');

  insert into public.research_order_requests (
    id,
    idempotency_key,
    contact_name,
    organization,
    email,
    normalized_email,
    project_summary,
    status,
    request_origin,
    origin_ip_hash,
    user_agent
  )
  values (
    v_request_id,
    p_idempotency_key,
    btrim(p_contact_name),
    btrim(p_organization),
    btrim(lower(p_email)),
    btrim(lower(p_email)),
    btrim(p_project_summary),
    v_status,
    nullif(left(p_request_origin, 200), ''),
    nullif(left(p_origin_ip_hash, 128), ''),
    nullif(left(p_user_agent, 512), '')
  );

  insert into public.research_order_items (
    request_id,
    product_id,
    product_sku,
    product_name,
    product_price_cents,
    quantity
  )
  select
    v_request_id,
    products.id,
    products.sku,
    products.name,
    products.price_cents,
    item.quantity
  from jsonb_to_recordset(p_items) as item(product_id text, quantity integer)
  join public.products
    on products.id = btrim(item.product_id);

  insert into public.consent_logs (
    request_id,
    attestation_id,
    clause,
    accepted,
    accepted_at,
    source,
    request_origin,
    user_agent
  )
  select
    v_request_id,
    btrim(consent.attestation_id),
    consent.clause,
    consent.accepted,
    consent.accepted_at,
    btrim(consent.source),
    nullif(left(p_request_origin, 200), ''),
    nullif(left(p_user_agent, 512), '')
  from jsonb_to_recordset(
    p_consent_logs
  ) as consent(
    attestation_id text,
    clause text,
    accepted boolean,
    accepted_at timestamptz,
    source text
  );

  insert into public.request_status_history (
    request_id,
    previous_status,
    next_status,
    actor_type,
    note
  )
  values (
    v_request_id,
    null,
    v_status,
    'system',
    'Initial request submitted through the request intake route.'
  );

  return query
  select v_request_id, v_status, false;
exception
  when unique_violation then
    select request.id, request.status
    into v_existing_id, v_existing_status
    from public.research_order_requests as request
    where request.idempotency_key = p_idempotency_key;

    if v_existing_id is not null then
      return query
      select v_existing_id, v_existing_status, true;
      return;
    end if;

    raise;
end;
$$;

revoke all on function public.create_research_order_request(
  text,
  text,
  text,
  text,
  jsonb,
  jsonb,
  uuid,
  text,
  text,
  text
) from public, anon, authenticated;

grant execute on function public.create_research_order_request(
  text,
  text,
  text,
  text,
  jsonb,
  jsonb,
  uuid,
  text,
  text,
  text
) to service_role;

insert into public.products (
  id,
  slug,
  sku,
  name,
  summary,
  category,
  format,
  storage,
  price_cents,
  research_use_only,
  active
)
values
  (
    'mtrx-reference-a',
    'mtrx-reference-a',
    'MTRX-RF-A01',
    'MTRX Reference A',
    'Neutral lyophilized reference material for qualified laboratory documentation workflows.',
    'reference',
    'Sealed vial',
    'Store according to laboratory SOPs.',
    11800,
    true,
    true
  ),
  (
    'mtrx-analytical-b',
    'mtrx-analytical-b',
    'MTRX-AN-B02',
    'MTRX Analytical B',
    'Catalog placeholder for analytical bench research, chain-of-custody intake, and record review.',
    'analytical',
    'Sealed vial',
    'Keep sealed until qualified lab intake.',
    14200,
    true,
    true
  ),
  (
    'mtrx-handling-c',
    'mtrx-handling-c',
    'MTRX-HD-C03',
    'MTRX Handling C',
    'Reference listing for controlled handling requests and research material procurement review.',
    'handling',
    'Sealed vial',
    'Maintain controlled storage records.',
    9600,
    true,
    true
  )
on conflict (id) do update
set slug = excluded.slug,
    sku = excluded.sku,
    name = excluded.name,
    summary = excluded.summary,
    category = excluded.category,
    format = excluded.format,
    storage = excluded.storage,
    price_cents = excluded.price_cents,
    research_use_only = excluded.research_use_only,
    active = excluded.active,
    updated_at = timezone('utc', now());
