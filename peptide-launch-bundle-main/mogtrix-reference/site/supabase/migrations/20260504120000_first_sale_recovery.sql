alter table public.products
  add column if not exists checkout_enabled boolean not null default false;

update public.products
set checkout_enabled = (availability_status = 'requestable')
where research_use_only = true;

create index if not exists idx_products_checkout_enabled
  on public.products (checkout_enabled)
  where active = true and visible_to_approved = true;

create or replace function public.create_checkout_order_draft(
  p_items jsonb,
  p_shipping jsonb,
  p_idempotency_key uuid
)
returns table (
  id text,
  status public.order_status,
  payment_status public.payment_status,
  total_cents integer,
  duplicate boolean
)
language plpgsql
set search_path = public
as $$
declare
  v_customer_id uuid := auth.uid();
  v_existing_id text;
  v_existing_status public.order_status;
  v_existing_payment_status public.payment_status;
  v_existing_total integer;
  v_order_id text;
  v_subtotal_cents integer;
  v_shipping_name text := nullif(btrim(coalesce(p_shipping->>'shippingName', '')), '');
  v_shipping_address_line1 text := nullif(btrim(coalesce(p_shipping->>'shippingAddressLine1', '')), '');
  v_shipping_address_line2 text := nullif(btrim(coalesce(p_shipping->>'shippingAddressLine2', '')), '');
  v_shipping_city text := nullif(btrim(coalesce(p_shipping->>'shippingCity', '')), '');
  v_shipping_state text := nullif(btrim(coalesce(p_shipping->>'shippingState', '')), '');
  v_shipping_postal_code text := nullif(btrim(coalesce(p_shipping->>'shippingPostalCode', '')), '');
  v_shipping_country text := upper(coalesce(nullif(btrim(coalesce(p_shipping->>'shippingCountry', '')), ''), 'US'));
begin
  if v_customer_id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if p_idempotency_key is null then
    raise exception 'IDEMPOTENCY_KEY_REQUIRED';
  end if;

  if coalesce(jsonb_array_length(p_items), 0) = 0 then
    raise exception 'ORDER_ITEMS_REQUIRED';
  end if;

  if v_shipping_name is null
    or v_shipping_address_line1 is null
    or v_shipping_city is null
    or v_shipping_state is null
    or v_shipping_postal_code is null
  then
    raise exception 'INVALID_SHIPPING_DESTINATION';
  end if;

  if v_shipping_country <> 'US' then
    raise exception 'US_ONLY_CHECKOUT';
  end if;

  select
    orders.id,
    orders.status,
    orders.payment_status,
    orders.total_cents
  into
    v_existing_id,
    v_existing_status,
    v_existing_payment_status,
    v_existing_total
  from public.orders
  where orders.idempotency_key = p_idempotency_key
    and orders.customer_id = v_customer_id;

  if v_existing_id is not null then
    return query
    select
      v_existing_id,
      v_existing_status,
      v_existing_payment_status,
      v_existing_total,
      true;
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
    raise exception 'INVALID_ORDER_ITEMS';
  end if;

  if exists (
    with requested as (
      select
        btrim(item.product_id) as product_id,
        sum(item.quantity)::integer as quantity
      from jsonb_to_recordset(p_items) as item(product_id text, quantity integer)
      group by btrim(item.product_id)
    )
    select 1
    from requested
    left join public.products
      on products.id = requested.product_id
     and products.active = true
     and products.research_use_only = true
     and products.visible_to_approved = true
     and products.checkout_enabled = true
    where products.id is null
  ) then
    raise exception 'INVALID_CHECKOUT_PRODUCT_IDS';
  end if;

  select coalesce(sum(products.price_cents * requested.quantity), 0)
  into v_subtotal_cents
  from (
    select
      btrim(item.product_id) as product_id,
      sum(item.quantity)::integer as quantity
    from jsonb_to_recordset(p_items) as item(product_id text, quantity integer)
    group by btrim(item.product_id)
  ) as requested
  join public.products
    on products.id = requested.product_id
   and products.active = true
   and products.research_use_only = true
   and products.visible_to_approved = true
   and products.checkout_enabled = true;

  if coalesce(v_subtotal_cents, 0) <= 0 then
    raise exception 'INVALID_ORDER_TOTAL';
  end if;

  v_order_id := 'ord_' || replace(gen_random_uuid()::text, '-', '');

  insert into public.orders (
    id,
    customer_id,
    status,
    payment_status,
    subtotal_cents,
    tax_cents,
    shipping_cents,
    total_cents,
    shipping_name,
    shipping_address_line1,
    shipping_address_line2,
    shipping_city,
    shipping_state,
    shipping_postal_code,
    shipping_country,
    billing_same_as_shipping,
    notes,
    idempotency_key,
    customer_next_step
  )
  values (
    v_order_id,
    v_customer_id,
    'draft',
    'pending',
    v_subtotal_cents,
    0,
    0,
    v_subtotal_cents,
    v_shipping_name,
    v_shipping_address_line1,
    v_shipping_address_line2,
    v_shipping_city,
    v_shipping_state,
    v_shipping_postal_code,
    v_shipping_country,
    true,
    null,
    p_idempotency_key,
    'Return to checkout to request your hosted payment link.'
  );

  insert into public.order_items (
    order_id,
    product_id,
    product_sku,
    product_name,
    price_cents,
    quantity
  )
  select
    v_order_id,
    products.id,
    products.sku,
    products.name,
    products.price_cents,
    requested.quantity
  from (
    select
      btrim(item.product_id) as product_id,
      sum(item.quantity)::integer as quantity
    from jsonb_to_recordset(p_items) as item(product_id text, quantity integer)
    group by btrim(item.product_id)
  ) as requested
  join public.products
    on products.id = requested.product_id
   and products.active = true
   and products.research_use_only = true
   and products.visible_to_approved = true
   and products.checkout_enabled = true;

  insert into public.order_status_history (
    order_id,
    previous_status,
    next_status,
    actor_type,
    actor_id,
    note
  )
  values (
    v_order_id,
    null,
    'draft',
    'customer',
    v_customer_id::text,
    'Order created from checkout.'
  );

  return query
  select
    v_order_id,
    'draft'::public.order_status,
    'pending'::public.payment_status,
    v_subtotal_cents,
    false;
end;
$$;

create or replace function public.update_checkout_order_payment_session(
  p_order_id text,
  p_payment_provider text,
  p_payment_intent_id text,
  p_external_payment_reference text,
  p_external_payment_url text,
  p_customer_next_step text,
  p_subtotal_cents integer,
  p_shipping_cents integer,
  p_tax_cents integer,
  p_total_cents integer
)
returns table (
  id text,
  status public.order_status,
  payment_status public.payment_status,
  total_cents integer
)
language plpgsql
set search_path = public
as $$
declare
  v_customer_id uuid := auth.uid();
  v_current_status public.order_status;
  v_current_payment_status public.payment_status;
  v_changed_at timestamptz := timezone('utc', now());
begin
  if v_customer_id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if p_order_id is null or btrim(p_order_id) = '' then
    raise exception 'ORDER_NOT_FOUND';
  end if;

  if p_external_payment_reference is null or btrim(p_external_payment_reference) = '' then
    raise exception 'PAYMENT_REFERENCE_REQUIRED';
  end if;

  if p_external_payment_url is null or btrim(p_external_payment_url) = '' then
    raise exception 'PAYMENT_URL_REQUIRED';
  end if;

  if p_subtotal_cents < 0 or p_shipping_cents < 0 or p_tax_cents < 0 or p_total_cents <= 0 then
    raise exception 'INVALID_CHECKOUT_TOTALS';
  end if;

  select
    orders.status,
    orders.payment_status
  into
    v_current_status,
    v_current_payment_status
  from public.orders
  where orders.id = btrim(p_order_id)
    and orders.customer_id = v_customer_id
  for update;

  if v_current_status is null then
    raise exception 'ORDER_NOT_FOUND';
  end if;

  if v_current_status in ('paid', 'processing', 'shipped', 'completed', 'delivered') then
    raise exception 'ORDER_PAYMENT_LOCKED';
  end if;

  update public.orders
  set status = 'payment_requested',
      payment_status = 'pending',
      payment_provider = nullif(btrim(p_payment_provider), ''),
      payment_intent_id = nullif(btrim(p_payment_intent_id), ''),
      external_payment_reference = btrim(p_external_payment_reference),
      external_payment_url = btrim(p_external_payment_url),
      customer_next_step = nullif(btrim(p_customer_next_step), ''),
      subtotal_cents = p_subtotal_cents,
      shipping_cents = p_shipping_cents,
      tax_cents = p_tax_cents,
      total_cents = p_total_cents,
      payment_requested_at = v_changed_at
  where orders.id = btrim(p_order_id)
    and orders.customer_id = v_customer_id;

  if v_current_status is distinct from 'payment_requested' then
    insert into public.order_status_history (
      order_id,
      previous_status,
      next_status,
      actor_type,
      actor_id,
      note,
      created_at
    )
    values (
      btrim(p_order_id),
      v_current_status,
      'payment_requested',
      'customer',
      v_customer_id::text,
      'Hosted payment requested.',
      v_changed_at
    );
  end if;

  return query
  select
    orders.id,
    orders.status,
    orders.payment_status,
    orders.total_cents
  from public.orders
  where orders.id = btrim(p_order_id)
    and orders.customer_id = v_customer_id;
end;
$$;

create or replace function public.apply_order_payment_webhook_event(
  p_order_id text,
  p_provider text,
  p_external_reference text,
  p_provider_event_id text,
  p_event_type text,
  p_provider_status public.payment_status,
  p_payload jsonb,
  p_apply boolean,
  p_next_status public.order_status default null,
  p_next_payment_status public.payment_status default null,
  p_customer_next_step text default null,
  p_note text default null,
  p_outcome_reason text default null
)
returns table (
  id text,
  status public.order_status,
  payment_status public.payment_status,
  duplicate boolean
)
language plpgsql
set search_path = public
as $$
declare
  v_current_status public.order_status;
  v_current_payment_status public.payment_status;
  v_paid_at timestamptz;
  v_event_id bigint;
  v_changed_at timestamptz := timezone('utc', now());
begin
  if p_order_id is null or btrim(p_order_id) = '' then
    raise exception 'ORDER_NOT_FOUND';
  end if;

  if p_provider_event_id is null or btrim(p_provider_event_id) = '' then
    raise exception 'PAYMENT_EVENT_ID_REQUIRED';
  end if;

  select
    orders.status,
    orders.payment_status,
    orders.paid_at
  into
    v_current_status,
    v_current_payment_status,
    v_paid_at
  from public.orders
  where orders.id = btrim(p_order_id)
  for update;

  if v_current_status is null then
    raise exception 'ORDER_NOT_FOUND';
  end if;

  insert into public.order_payment_events (
    order_id,
    provider,
    external_reference,
    provider_event_id,
    event_type,
    provider_status,
    payload,
    applied,
    outcome_reason,
    created_at
  )
  values (
    btrim(p_order_id),
    coalesce(nullif(btrim(p_provider), ''), 'unknown'),
    coalesce(nullif(btrim(p_external_reference), ''), btrim(p_order_id)),
    btrim(p_provider_event_id),
    coalesce(nullif(btrim(p_event_type), ''), 'payment.unknown'),
    p_provider_status,
    coalesce(p_payload, '{}'::jsonb),
    p_apply,
    nullif(btrim(coalesce(p_outcome_reason, '')), ''),
    v_changed_at
  )
  on conflict (provider_event_id) do nothing
  returning order_payment_events.id into v_event_id;

  if v_event_id is null then
    return query
    select
      orders.id,
      orders.status,
      orders.payment_status,
      true
    from public.orders
    where orders.id = btrim(p_order_id);
    return;
  end if;

  if not p_apply then
    return query
    select
      orders.id,
      orders.status,
      orders.payment_status,
      false
    from public.orders
    where orders.id = btrim(p_order_id);
    return;
  end if;

  update public.orders
  set status = p_next_status,
      payment_status = p_next_payment_status,
      payment_last_event_id = btrim(p_provider_event_id),
      customer_next_step = nullif(btrim(coalesce(p_customer_next_step, '')), ''),
      paid_at = case
        when p_next_status = 'paid' and orders.paid_at is null then v_changed_at
        else orders.paid_at
      end
  where orders.id = btrim(p_order_id);

  insert into public.order_status_history (
    order_id,
    previous_status,
    next_status,
    actor_type,
    actor_id,
    note,
    created_at
  )
  values (
    btrim(p_order_id),
    v_current_status,
    p_next_status,
    'system',
    btrim(p_provider_event_id),
    nullif(btrim(coalesce(p_note, '')), ''),
    v_changed_at
  );

  return query
  select
    orders.id,
    orders.status,
    orders.payment_status,
    false
  from public.orders
  where orders.id = btrim(p_order_id);
end;
$$;
