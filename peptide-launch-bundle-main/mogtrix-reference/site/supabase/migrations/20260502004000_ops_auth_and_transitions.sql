create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
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

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

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
select
  users.id,
  coalesce(users.email, ''),
  nullif(users.raw_user_meta_data ->> 'full_name', ''),
  nullif(users.raw_user_meta_data ->> 'organization', ''),
  'staff',
  false,
  false,
  false
from auth.users as users
left join public.profiles as profiles
  on profiles.id = users.id
where profiles.id is null;

create or replace function public.transition_research_request_status(
  p_request_id text,
  p_next_status public.research_request_status,
  p_note text default null
)
returns table (
  id text,
  status public.research_request_status,
  last_status_changed_at timestamptz
)
language plpgsql
set search_path = public
as $$
declare
  v_current_status public.research_request_status;
  v_changed_at timestamptz := timezone('utc', now());
begin
  if not public.is_staff() then
    raise exception 'STAFF_REQUIRED';
  end if;

  if p_request_id is null or btrim(p_request_id) = '' then
    raise exception 'REQUEST_NOT_FOUND';
  end if;

  if p_next_status is null then
    raise exception 'INVALID_STATUS';
  end if;

  if p_note is not null and char_length(btrim(p_note)) > 1000 then
    raise exception 'NOTE_TOO_LONG';
  end if;

  select request.status
  into v_current_status
  from public.research_order_requests as request
  where request.id = btrim(p_request_id)
  for update;

  if v_current_status is null then
    raise exception 'REQUEST_NOT_FOUND';
  end if;

  if v_current_status = p_next_status then
    raise exception 'NO_OP_STATUS';
  end if;

  update public.research_order_requests
  set status = p_next_status,
      last_status_changed_at = v_changed_at
  where research_order_requests.id = btrim(p_request_id);

  insert into public.request_status_history (
    request_id,
    previous_status,
    next_status,
    actor_type,
    actor_profile_id,
    note,
    created_at
  )
  values (
    btrim(p_request_id),
    v_current_status,
    p_next_status,
    'staff',
    auth.uid(),
    nullif(btrim(p_note), ''),
    v_changed_at
  );

  return query
  select
    request.id,
    request.status,
    request.last_status_changed_at
  from public.research_order_requests as request
  where request.id = btrim(p_request_id);
end;
$$;

revoke all on function public.transition_research_request_status(
  text,
  public.research_request_status,
  text
) from public, anon;

grant execute on function public.transition_research_request_status(
  text,
  public.research_request_status,
  text
) to authenticated, service_role;
