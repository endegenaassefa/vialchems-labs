alter table public.customer_profiles
  add column if not exists qualified boolean not null default false,
  add column if not exists qualified_at timestamptz;

create table if not exists public.customer_qualifications (
  id bigserial primary key,
  customer_id uuid not null references public.customer_profiles(id) on delete cascade,
  attestation_ruo boolean not null default false,
  attestation_age boolean not null default false,
  attestation_no_human_use boolean not null default false,
  institution_name text not null,
  institution_type text not null,
  role_title text not null,
  credential_details text not null,
  research_environment text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (customer_id)
);

drop trigger if exists customer_qualifications_touch_updated_at on public.customer_qualifications;
create trigger customer_qualifications_touch_updated_at
before update on public.customer_qualifications
for each row execute function public.touch_updated_at();

alter table public.customer_qualifications enable row level security;

drop policy if exists "customers_read_own_qualification" on public.customer_qualifications;
create policy "customers_read_own_qualification"
on public.customer_qualifications
for select
using (auth.uid() = customer_id);

drop policy if exists "customers_insert_own_qualification" on public.customer_qualifications;
create policy "customers_insert_own_qualification"
on public.customer_qualifications
for insert
with check (auth.uid() = customer_id);

drop policy if exists "customers_update_own_qualification" on public.customer_qualifications;
create policy "customers_update_own_qualification"
on public.customer_qualifications
for update
using (auth.uid() = customer_id)
with check (auth.uid() = customer_id);

drop policy if exists "staff_read_all_qualifications" on public.customer_qualifications;
create policy "staff_read_all_qualifications"
on public.customer_qualifications
for select
using (public.is_staff());

update public.customer_profiles
set qualified = true,
    qualified_at = coalesce(qualified_at, timezone('utc', now()))
where qualified = false
  and age_verified = true
  and ruo_acknowledged = true
  and blacklisted = false;

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
      organization,
      qualified
    )
    values (
      new.id,
      coalesce(new.email, ''),
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(new.raw_user_meta_data ->> 'organization', ''),
      false
    )
    on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.customer_profiles.full_name, excluded.full_name),
        organization = coalesce(public.customer_profiles.organization, excluded.organization);
  end if;

  return new;
end;
$$;

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
      and profiles.blacklisted = false
      and (
        profiles.qualified = true
        or (
          profiles.age_verified = true
          and profiles.ruo_acknowledged = true
        )
      )
  );
$$;

grant execute on function public.is_verified_qualified_customer() to anon, authenticated, service_role;

create or replace function public.is_qualified_customer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.customer_profiles
    where id = auth.uid()
      and blacklisted = false
      and (
        qualified = true
        or (age_verified = true and ruo_acknowledged = true)
      )
  );
$$;

grant execute on function public.is_qualified_customer() to anon, authenticated, service_role;
