-- Add the gated Zelle manual-payment rail to existing databases.
-- The app still requires ENABLE_ZELLE + bank/legal approval env before use.

alter table orders
  drop constraint if exists orders_payment_provider_check;

alter table orders
  add constraint orders_payment_provider_check
  check (payment_provider in ('stub', 'btcpay', 'plaid', 'zelle'));

alter table payments
  drop constraint if exists payments_provider_check;

alter table payments
  add constraint payments_provider_check
  check (provider in ('stub', 'btcpay', 'plaid', 'zelle'));

create or replace function confirm_zelle_manual_payment(
  p_display_id text,
  p_actor text,
  p_note text default null,
  p_confirmed_at timestamptz default now()
)
returns table (
  order_id uuid,
  display_id text,
  status order_status,
  already_confirmed boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order orders%rowtype;
  v_payment payments%rowtype;
  v_confirmed_at timestamptz := coalesce(p_confirmed_at, now());
begin
  if nullif(trim(p_display_id), '') is null then
    raise exception 'manual_payment_display_id_required';
  end if;

  if nullif(trim(p_actor), '') is null then
    raise exception 'manual_payment_actor_required';
  end if;

  select *
    into v_order
    from orders
    where orders.display_id = p_display_id
    for update;

  if not found then
    raise exception 'manual_payment_order_not_found';
  end if;

  if v_order.payment_provider <> 'zelle' then
    raise exception 'manual_payment_provider_mismatch: order uses %', v_order.payment_provider;
  end if;

  select *
    into v_payment
    from payments
    where payments.order_id = v_order.id
      and payments.provider = 'zelle'
    for update;

  if not found then
    raise exception 'manual_payment_not_found';
  end if;

  if v_payment.amount_cents <> v_order.total_cents then
    raise exception 'manual_payment_amount_mismatch';
  end if;

  if v_order.status = 'paid' and v_payment.status = 'paid' then
    return query select v_order.id, v_order.display_id, 'paid'::order_status, true;
    return;
  end if;

  update payments
    set status = 'paid',
        updated_at = v_confirmed_at
    where id = v_payment.id;

  update orders
    set status = 'paid'
    where id = v_order.id;

  insert into order_status_history (
    order_id,
    from_status,
    to_status,
    reason,
    changed_at
  )
  values (
    v_order.id,
    v_order.status,
    'paid',
    'manual_payment.zelle_confirmed',
    v_confirmed_at
  );

  insert into audit_log (
    event_type,
    order_id,
    details
  )
  values (
    'manual_payment.confirmed',
    v_order.id,
    jsonb_build_object(
      'provider', 'zelle',
      'provider_intent_id', v_payment.provider_intent_id,
      'display_id', v_order.display_id,
      'actor', p_actor,
      'note', p_note,
      'confirmed_at', v_confirmed_at
    )
  );

  return query select v_order.id, v_order.display_id, 'paid'::order_status, false;
end;
$$;

revoke all on function confirm_zelle_manual_payment(text, text, text, timestamptz) from public;
grant execute on function confirm_zelle_manual_payment(text, text, text, timestamptz) to service_role;
