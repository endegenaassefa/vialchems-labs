create table if not exists public.customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  full_name text,
  organization text,
  age_verified boolean not null default false,
  ruo_acknowledged boolean not null default false,
  blacklisted boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists customer_profiles_touch_updated_at on public.customer_profiles;
create trigger customer_profiles_touch_updated_at
before update on public.customer_profiles
for each row execute function public.touch_updated_at();

alter table public.customer_profiles enable row level security;

create or replace function public.is_verified_qualified_customer()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from auth.users as users
    join public.customer_profiles as profiles
      on profiles.id = users.id
    where users.id = auth.uid()
      and users.email_confirmed_at is not null
      and profiles.age_verified = true
      and profiles.ruo_acknowledged = true
      and profiles.blacklisted = false
  );
$$;

grant execute on function public.is_verified_qualified_customer() to anon, authenticated, service_role;

drop policy if exists "Customers can read own profile" on public.customer_profiles;
create policy "Customers can read own profile"
on public.customer_profiles
for select
using (auth.uid() = id);

drop policy if exists "Customers can update own profile" on public.customer_profiles;
create policy "Customers can update own profile"
on public.customer_profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_account_type text := coalesce(new.raw_user_meta_data ->> 'account_type', 'customer');
begin
  if v_account_type = 'staff' then
    insert into public.profiles (
      id,
      email,
      full_name,
      organization,
      role,
      staff_active,
      age_verified,
      blacklisted
    )
    values (
      new.id,
      coalesce(new.email, ''),
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(new.raw_user_meta_data ->> 'organization', ''),
      'staff',
      false,
      false,
      false
    )
    on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.profiles.full_name, excluded.full_name),
        organization = coalesce(public.profiles.organization, excluded.organization);
  else
    insert into public.customer_profiles (
      id,
      email,
      full_name,
      organization
    )
    values (
      new.id,
      coalesce(new.email, ''),
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(new.raw_user_meta_data ->> 'organization', '')
    )
    on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.customer_profiles.full_name, excluded.full_name),
        organization = coalesce(public.customer_profiles.organization, excluded.organization);
  end if;

  return new;
end;
$$;

insert into public.customer_profiles (
  id,
  email,
  full_name,
  organization
)
select
  users.id,
  coalesce(users.email, ''),
  nullif(users.raw_user_meta_data ->> 'full_name', ''),
  nullif(users.raw_user_meta_data ->> 'organization', '')
from auth.users as users
left join public.profiles as profiles
  on profiles.id = users.id
left join public.customer_profiles as customer_profiles
  on customer_profiles.id = users.id
where profiles.id is null
  and customer_profiles.id is null
  and coalesce(users.raw_user_meta_data ->> 'account_type', 'customer') <> 'staff';

drop policy if exists "Public can read active products" on public.products;
create policy "Verified qualified customers can read active products"
on public.products
for select
using (active = true and research_use_only = true and public.is_verified_qualified_customer());

drop policy if exists "Public can read product images" on public.product_images;
create policy "Verified qualified customers can read product images"
on public.product_images
for select
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
      and products.active = true
      and products.research_use_only = true
      and public.is_verified_qualified_customer()
  )
);

update storage.buckets
set public = false
where id = 'product-images';

drop policy if exists "Public can read product image objects" on storage.objects;
create policy "Verified qualified customers can read product image objects"
on storage.objects
for select
using (bucket_id = 'product-images' and public.is_verified_qualified_customer());
