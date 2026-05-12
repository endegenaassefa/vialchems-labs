import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

type StaffSessionClient = NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>>;

const ORDER_QUEUE_STATUS_OPTIONS = [
  "all",
  "payment_requested",
  "payment_pending",
  "paid",
  "processing",
  "shipped",
  "completed",
  "issue"
] as const;

type OrderQueueStatusFilter = typeof ORDER_QUEUE_STATUS_OPTIONS[number];

type CustomerJoin = {
  email: string | null;
  full_name: string | null;
  organization: string | null;
} | {
  email: string | null;
  full_name: string | null;
  organization: string | null;
}[] | null;

type OrderQueueRow = {
  id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total_cents: number;
  created_at: string;
  updated_at: string;
  shipping_name: string;
  shipment_tracking_reference: string | null;
  customer?: CustomerJoin;
};

type OrderDetailRow = OrderQueueRow & {
  subtotal_cents: number;
  tax_cents: number;
  shipping_cents: number;
  payment_provider: string | null;
  payment_method_summary: string | null;
  external_payment_reference: string | null;
  external_payment_url: string | null;
  customer_next_step: string | null;
  paid_at: string | null;
  shipped_at: string | null;
  completed_at: string | null;
  shipping_address_line1: string;
  shipping_address_line2: string | null;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  shipment_tracking_url: string | null;
  shipment_note: string | null;
};

type OrderItemRow = {
  product_id: string;
  product_sku: string;
  product_name: string;
  price_cents: number;
  quantity: number;
};

type OrderHistoryRow = {
  id: number;
  previous_status: OrderStatus | null;
  next_status: OrderStatus;
  actor_type: string;
  actor_id: string | null;
  note: string | null;
  created_at: string;
};

type OrderStaffNoteRow = {
  id: number;
  order_id: string;
  author_profile_id: string;
  body: string;
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string | null;
    email: string | null;
  } | {
    full_name: string | null;
    email: string | null;
  }[] | null;
};

function mapCustomer(customer: CustomerJoin) {
  const resolved = Array.isArray(customer) ? customer[0] ?? null : customer ?? null;

  return {
    buyerEmail: resolved?.email ?? null,
    buyerName: resolved?.full_name ?? null,
    buyerOrganization: resolved?.organization ?? null
  };
}

export function isOpsOrderStatusFilter(value: string | null | undefined): value is OrderQueueStatusFilter {
  return ORDER_QUEUE_STATUS_OPTIONS.includes((value ?? "") as OrderQueueStatusFilter);
}

function sanitizeSearchTerm(value: string | null | undefined) {
  return value?.trim().slice(0, 80) ?? "";
}

function escapeFilterValue(value: string) {
  return value.replace(/[%_,]/g, "");
}

export async function listOpsOrders(
  supabase: StaffSessionClient,
  input: { status?: string | null; query?: string | null }
) {
  let query = supabase
    .from("orders")
    .select("id, status, payment_status, total_cents, created_at, updated_at, shipping_name, shipment_tracking_reference, customer:customer_profiles!customer_id(email, full_name, organization)")
    .order("created_at", { ascending: false })
    .range(0, 99);

  if (input.status && isOpsOrderStatusFilter(input.status) && input.status !== "all") {
    query = query.eq("status", input.status);
  }

  const search = sanitizeSearchTerm(input.query);
  if (search) {
    const value = escapeFilterValue(search);
    query = query.or([
      `id.ilike.%${value}%`,
      `shipping_name.ilike.%${value}%`,
      `external_payment_reference.ilike.%${value}%`
    ].join(","));
  }

  const { data, error } = await query;
  if (error || !data) {
    return [];
  }

  return data.map((row) => {
    const buyer = mapCustomer((row as OrderQueueRow).customer ?? null);

    return {
      id: (row as OrderQueueRow).id,
      status: (row as OrderQueueRow).status,
      paymentStatus: (row as OrderQueueRow).payment_status,
      totalCents: (row as OrderQueueRow).total_cents,
      createdAt: (row as OrderQueueRow).created_at,
      updatedAt: (row as OrderQueueRow).updated_at,
      shippingName: (row as OrderQueueRow).shipping_name,
      shipmentTrackingReference: (row as OrderQueueRow).shipment_tracking_reference,
      ...buyer
    };
  });
}

export async function getOpsOrderDetail(
  supabase: StaffSessionClient,
  orderId: string
) {
  const orderQuery = supabase
    .from("orders")
    .select("id, status, payment_status, total_cents, subtotal_cents, tax_cents, shipping_cents, created_at, updated_at, shipping_name, shipping_address_line1, shipping_address_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country, payment_provider, payment_method_summary, external_payment_reference, external_payment_url, customer_next_step, paid_at, shipped_at, completed_at, shipment_tracking_reference, shipment_tracking_url, shipment_note, customer:customer_profiles!customer_id(email, full_name, organization)")
    .eq("id", orderId)
    .maybeSingle();
  const itemsQuery = supabase
    .from("order_items")
    .select("product_id, product_sku, product_name, price_cents, quantity")
    .eq("order_id", orderId)
    .order("id", { ascending: true });
  const historyQuery = supabase
    .from("order_status_history")
    .select("id, previous_status, next_status, actor_type, actor_id, note, created_at")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });
  const notesQuery = supabase
    .from("order_staff_notes")
    .select("id, order_id, author_profile_id, body, created_at, updated_at, author:profiles!author_profile_id(full_name, email)")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });

  const [orderResult, itemsResult, historyResult, notesResult] = await Promise.all([
    orderQuery,
    itemsQuery,
    historyQuery,
    notesQuery
  ]);

  if (orderResult.error || !orderResult.data) {
    return null;
  }

  const order = orderResult.data as OrderDetailRow;
  const buyer = mapCustomer(order.customer ?? null);

  return {
    id: order.id,
    status: order.status,
    paymentStatus: order.payment_status,
    totalCents: order.total_cents,
    subtotalCents: order.subtotal_cents,
    taxCents: order.tax_cents,
    shippingCents: order.shipping_cents,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    shippingName: order.shipping_name,
    shippingAddressLine1: order.shipping_address_line1,
    shippingAddressLine2: order.shipping_address_line2,
    shippingCity: order.shipping_city,
    shippingState: order.shipping_state,
    shippingPostalCode: order.shipping_postal_code,
    shippingCountry: order.shipping_country,
    paymentProvider: order.payment_provider,
    paymentMethodSummary: order.payment_method_summary,
    externalPaymentReference: order.external_payment_reference,
    externalPaymentUrl: order.external_payment_url,
    customerNextStep: order.customer_next_step,
    paidAt: order.paid_at,
    shippedAt: order.shipped_at,
    completedAt: order.completed_at,
    shipmentTrackingReference: order.shipment_tracking_reference,
    shipmentTrackingUrl: order.shipment_tracking_url,
    shipmentNote: order.shipment_note,
    items: (itemsResult.data ?? []).map((item) => ({
      productId: (item as OrderItemRow).product_id,
      productSku: (item as OrderItemRow).product_sku,
      productName: (item as OrderItemRow).product_name,
      priceCents: (item as OrderItemRow).price_cents,
      quantity: (item as OrderItemRow).quantity
    })),
    history: (historyResult.data ?? []).map((entry) => ({
      id: (entry as OrderHistoryRow).id,
      previousStatus: (entry as OrderHistoryRow).previous_status,
      nextStatus: (entry as OrderHistoryRow).next_status,
      actorType: (entry as OrderHistoryRow).actor_type,
      actorId: (entry as OrderHistoryRow).actor_id,
      note: (entry as OrderHistoryRow).note,
      createdAt: (entry as OrderHistoryRow).created_at
    })),
    notes: (notesResult.data ?? []).map((note) => {
      const noteRow = note as OrderStaffNoteRow;
      const authorSource = noteRow.author ?? null;
      const author = Array.isArray(authorSource)
        ? authorSource[0] ?? null
        : authorSource;

      return {
        id: noteRow.id,
        orderId: noteRow.order_id,
        authorProfileId: noteRow.author_profile_id,
        body: noteRow.body,
        createdAt: noteRow.created_at,
        updatedAt: noteRow.updated_at,
        authorName: author?.full_name ?? null,
        authorEmail: author?.email ?? null
      };
    }),
    ...buyer
  };
}

export {
  ORDER_QUEUE_STATUS_OPTIONS
};
