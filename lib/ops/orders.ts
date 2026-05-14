import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { logAuditEvent, ORDER_EVENT, PAYMENT_EVENT } from "@/lib/ops/audit";

// Phase A ops order operations. Service-role context (ops endpoints use the
// service_role key) so RLS is bypassed by design — these functions are
// allowed to see is_test rows. The ops UI exposes a "Show test orders"
// toggle in commit 7 that flips the filter on/off.
//
// State machine (locked CEO plan #2):
//   pending → awaiting_payment       (checkout creates the payment intent)
//   awaiting_payment → paid          (webhook OR manual confirm)
//   paid → fulfilled                 (ops marks order ready to ship)
//   fulfilled → shipped              (ops attaches tracking)
//   shipped → delivered              (Shippo webhook OR ops manual)
//   any state → cancelled            (ops cancels)
//   paid|fulfilled|shipped|delivered → refunded   (ops refunds)
//
// No regression from `shipped` (cargo already left). Concurrent-update
// safety via compare-and-swap on the prior status — every update WHERE
// clause includes the expected current status, so two staffers marking
// the same order shipped simultaneously gets one 200 and one 409.

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type OrderStatus =
  | "pending"
  | "awaiting_payment"
  | "paid"
  | "fulfilled"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "jurisdictional_rejected";

export type ShippedCarrier = "usps" | "ups" | "fedex" | "dhl" | "other";

export interface OpsOrder {
  id: string;
  displayId: string;
  status: OrderStatus;
  email: string;
  paymentProvider: string;
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  totalCents: number;
  trackingNumber: string | null;
  shippedCarrier: ShippedCarrier | null;
  shippoTransactionId: string | null;
  refundReason: string | null;
  refundAmountCents: number | null;
  placedAt: string;
  fulfilledAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  refundedAt: string | null;
  isTest: boolean;
}

export interface OpsOrderItem {
  id: string;
  sku: string;
  slug: string;
  nameSnapshot: string;
  unitPriceCents: number;
  quantity: number;
}

export interface OpsOrderHistoryRow {
  id: number;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  reason: string | null;
  changedAt: string;
}

export interface OpsOrderPayment {
  id: string;
  provider: string;
  providerIntentId: string;
  status: string;
  amountCents: number;
  currency: string;
}

export interface OpsOrderDetail extends OpsOrder {
  items: OpsOrderItem[];
  payments: OpsOrderPayment[];
  history: OpsOrderHistoryRow[];
  shippingAddressSnapshot: Record<string, unknown>;
  // Timestamp of the customer's "I've sent the payment" claim, if any.
  // Surfaced in the ops UI so a bounced notification email doesn't leave a
  // manual-payment (Zelle) order with no work-queue signal.
  paymentClaimedAt: string | null;
}

// ---------------------------------------------------------------------------
// State machine
// ---------------------------------------------------------------------------

const ALLOWED_TRANSITIONS: Record<OrderStatus, ReadonlyArray<OrderStatus>> = {
  pending: ["awaiting_payment", "cancelled", "jurisdictional_rejected"],
  awaiting_payment: ["paid", "cancelled"],
  paid: ["fulfilled", "cancelled", "refunded"],
  fulfilled: ["shipped", "cancelled", "refunded"],
  shipped: ["delivered", "refunded"],
  delivered: ["refunded"],
  cancelled: [],
  refunded: [],
  jurisdictional_rejected: [],
};

export function isValidTransition(
  from: OrderStatus,
  to: OrderStatus,
): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function listValidTransitions(from: OrderStatus): ReadonlyArray<OrderStatus> {
  return ALLOWED_TRANSITIONS[from] ?? [];
}

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

const orderStatusSchema = z.enum([
  "pending",
  "awaiting_payment",
  "paid",
  "fulfilled",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
  "jurisdictional_rejected",
]);

const shippedCarrierSchema = z.enum(["usps", "ups", "fedex", "dhl", "other"]);

export const listFilterSchema = z.object({
  status: orderStatusSchema.optional(),
  email: z.string().trim().toLowerCase().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  includeTest: z.boolean().default(false),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(200).default(50),
});
export type ListFilter = z.infer<typeof listFilterSchema>;

export const transitionSchema = z.object({
  orderId: z.string().uuid(),
  expectedStatus: orderStatusSchema,
  targetStatus: orderStatusSchema,
  actor: z.string().trim().min(1).default("ops-api"),
  reason: z.string().trim().max(500).optional(),
});
export type TransitionArgs = z.infer<typeof transitionSchema>;

export const attachTrackingSchema = z.object({
  orderId: z.string().uuid(),
  expectedStatus: orderStatusSchema,
  trackingNumber: z.string().trim().min(1).max(80),
  carrier: shippedCarrierSchema,
  shippoTransactionId: z.string().trim().optional(),
  actor: z.string().trim().min(1).default("ops-api"),
});
export type AttachTrackingArgs = z.infer<typeof attachTrackingSchema>;

export const refundSchema = z.object({
  orderId: z.string().uuid(),
  expectedStatus: orderStatusSchema,
  amountCents: z.number().int().min(1),
  reason: z.string().trim().min(1).max(500),
  actor: z.string().trim().min(1).default("ops-api"),
});
export type RefundArgs = z.infer<typeof refundSchema>;

// ---------------------------------------------------------------------------
// Row mappers (snake_case -> camelCase)
// ---------------------------------------------------------------------------

interface OrderRow {
  id: string;
  display_id: string;
  status: OrderStatus;
  email: string;
  payment_provider: string;
  subtotal_cents: number;
  discount_cents: number;
  shipping_cents: number;
  total_cents: number;
  tracking_number: string | null;
  shipped_carrier: ShippedCarrier | null;
  shippo_transaction_id: string | null;
  refund_reason: string | null;
  refund_amount_cents: number | null;
  placed_at: string;
  fulfilled_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  refunded_at: string | null;
  is_test: boolean;
  shipping_address_snapshot?: Record<string, unknown>;
}

function toOpsOrder(row: OrderRow): OpsOrder {
  return {
    id: row.id,
    displayId: row.display_id,
    status: row.status,
    email: row.email,
    paymentProvider: row.payment_provider,
    subtotalCents: row.subtotal_cents,
    discountCents: row.discount_cents,
    shippingCents: row.shipping_cents,
    totalCents: row.total_cents,
    trackingNumber: row.tracking_number,
    shippedCarrier: row.shipped_carrier,
    shippoTransactionId: row.shippo_transaction_id,
    refundReason: row.refund_reason,
    refundAmountCents: row.refund_amount_cents,
    placedAt: row.placed_at,
    fulfilledAt: row.fulfilled_at,
    shippedAt: row.shipped_at,
    deliveredAt: row.delivered_at,
    cancelledAt: row.cancelled_at,
    refundedAt: row.refunded_at,
    isTest: row.is_test,
  };
}

// Untyped query shape — Supabase's generated types are heavy and this keeps
// the file readable. The runtime calls are exactly what the Supabase
// JS client supports.
type QueryBuilder = {
  select: (cols: string, opts?: { count?: "exact" }) => QueryBuilder;
  insert: (row: Record<string, unknown>) => QueryBuilder;
  update: (row: Record<string, unknown>) => QueryBuilder;
  eq: (col: string, value: unknown) => QueryBuilder;
  in: (col: string, value: unknown[]) => QueryBuilder;
  gte: (col: string, value: unknown) => QueryBuilder;
  lte: (col: string, value: unknown) => QueryBuilder;
  ilike: (col: string, value: string) => QueryBuilder;
  order: (col: string, opts: { ascending: boolean }) => QueryBuilder;
  range: (from: number, to: number) => QueryBuilder;
  single: () => PromiseLike<{ data?: unknown; error?: { message: string } | null }>;
  maybeSingle: () => PromiseLike<{ data?: unknown; error?: { message: string } | null }>;
  then: <T>(onfulfilled: (value: {
    data?: unknown;
    error?: { message: string } | null;
    count?: number | null;
  }) => T) => Promise<T>;
};

type Db = {
  from(table: string): QueryBuilder;
};

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

export async function getOrderById(
  supabase: SupabaseClient,
  orderId: string,
): Promise<OpsOrderDetail | null> {
  const parsed = z.string().uuid().safeParse(orderId);
  if (!parsed.success) throw new Error("invalid_order_id");
  const db = supabase as unknown as Db;

  const orderResult = await db
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();
  if (orderResult.error) {
    throw new Error(`order_lookup_failed: ${orderResult.error.message}`);
  }
  if (!orderResult.data) return null;
  const order = orderResult.data as OrderRow;

  const [itemsResult, paymentsResult, historyResult, claimResult] =
    await Promise.all([
      db.from("order_items").select("*").eq("order_id", orderId),
      db.from("payments").select("*").eq("order_id", orderId),
      db
        .from("order_status_history")
        .select("*")
        .eq("order_id", orderId)
        .order("changed_at", { ascending: true }),
      db
        .from("audit_log")
        .select("recorded_at")
        .eq("order_id", orderId)
        .eq("event_type", PAYMENT_EVENT.CLAIMED_SENT)
        .maybeSingle(),
    ]);

  for (const r of [itemsResult, paymentsResult, historyResult, claimResult]) {
    if (r.error) throw new Error(`order_detail_lookup_failed: ${r.error.message}`);
  }

  return {
    ...toOpsOrder(order),
    shippingAddressSnapshot: order.shipping_address_snapshot ?? {},
    paymentClaimedAt:
      (claimResult.data as { recorded_at?: string } | null)?.recorded_at ??
      null,
    items: (itemsResult.data as Array<Record<string, unknown>>).map((row) => ({
      id: row.id as string,
      sku: row.sku as string,
      slug: row.slug as string,
      nameSnapshot: row.name_snapshot as string,
      unitPriceCents: row.unit_price_cents as number,
      quantity: row.quantity as number,
    })),
    payments: (paymentsResult.data as Array<Record<string, unknown>>).map(
      (row) => ({
        id: row.id as string,
        provider: row.provider as string,
        providerIntentId: row.provider_intent_id as string,
        status: row.status as string,
        amountCents: row.amount_cents as number,
        currency: row.currency as string,
      }),
    ),
    history: (historyResult.data as Array<Record<string, unknown>>).map(
      (row) => ({
        id: row.id as number,
        fromStatus: (row.from_status as OrderStatus) ?? null,
        toStatus: row.to_status as OrderStatus,
        reason: (row.reason as string) ?? null,
        changedAt: row.changed_at as string,
      }),
    ),
  };
}

export interface ListResult {
  rows: OpsOrder[];
  total: number;
  page: number;
  pageSize: number;
}

export async function listOrdersForOps(
  supabase: SupabaseClient,
  filter: Partial<ListFilter>,
): Promise<ListResult> {
  const parsed = listFilterSchema.parse(filter);
  const db = supabase as unknown as Db;

  let query: QueryBuilder = db
    .from("orders")
    .select("*", { count: "exact" })
    .order("placed_at", { ascending: false });

  if (!parsed.includeTest) {
    query = query.eq("is_test", false);
  }
  if (parsed.status) query = query.eq("status", parsed.status);
  if (parsed.email) query = query.eq("email", parsed.email);
  if (parsed.dateFrom) query = query.gte("placed_at", parsed.dateFrom);
  if (parsed.dateTo) query = query.lte("placed_at", parsed.dateTo);

  const from = (parsed.page - 1) * parsed.pageSize;
  const to = from + parsed.pageSize - 1;
  const result = await query.range(from, to);

  if (result.error) {
    throw new Error(`order_list_failed: ${result.error.message}`);
  }

  const rows = (result.data as OrderRow[] | undefined) ?? [];
  return {
    rows: rows.map(toOpsOrder),
    total: result.count ?? rows.length,
    page: parsed.page,
    pageSize: parsed.pageSize,
  };
}

// ---------------------------------------------------------------------------
// Writes
// ---------------------------------------------------------------------------

const STATUS_TIMESTAMP_COLUMN: Partial<Record<OrderStatus, string>> = {
  paid: "placed_at", // already exists; just a no-op timestamp marker
  fulfilled: "fulfilled_at",
  shipped: "shipped_at",
  delivered: "delivered_at",
  cancelled: "cancelled_at",
  refunded: "refunded_at",
  jurisdictional_rejected: "jurisdictional_rejected_at",
};

// Generic state transition. Uses compare-and-swap on the prior status so
// concurrent updates fail loudly with a STALE_STATUS error rather than
// silently double-applying.
export async function transitionStatus(
  supabase: SupabaseClient,
  args: TransitionArgs,
): Promise<OpsOrder> {
  const parsed = transitionSchema.parse(args);
  if (!isValidTransition(parsed.expectedStatus, parsed.targetStatus)) {
    throw new Error(
      `invalid_transition: ${parsed.expectedStatus} → ${parsed.targetStatus}`,
    );
  }
  const db = supabase as unknown as Db;

  const update: Record<string, unknown> = { status: parsed.targetStatus };
  const tsCol = STATUS_TIMESTAMP_COLUMN[parsed.targetStatus];
  if (tsCol && tsCol !== "placed_at") {
    update[tsCol] = new Date().toISOString();
  }

  const result = await db
    .from("orders")
    .update(update)
    .eq("id", parsed.orderId)
    .eq("status", parsed.expectedStatus)
    .select("*")
    .single();

  if (result.error) {
    throw new Error(`status_update_failed: ${result.error.message}`);
  }
  if (!result.data) {
    throw new Error("stale_status");
  }
  const row = result.data as OrderRow;

  await Promise.all([
    db.from("order_status_history").insert({
      order_id: parsed.orderId,
      from_status: parsed.expectedStatus,
      to_status: parsed.targetStatus,
      reason: parsed.reason ?? null,
    }),
    logAuditEvent(supabase, {
      eventType: targetStatusToEvent(parsed.targetStatus),
      orderId: parsed.orderId,
      details: {
        from: parsed.expectedStatus,
        to: parsed.targetStatus,
        reason: parsed.reason,
      },
      actor: parsed.actor,
    }),
  ]);

  return toOpsOrder(row);
}

function targetStatusToEvent(status: OrderStatus) {
  switch (status) {
    case "paid":
      return PAYMENT_EVENT.RECONCILED;
    case "fulfilled":
      return ORDER_EVENT.FULFILLED;
    case "shipped":
      return ORDER_EVENT.SHIPPED;
    case "delivered":
      return ORDER_EVENT.DELIVERED;
    case "cancelled":
      return ORDER_EVENT.CANCELLED;
    case "refunded":
      return ORDER_EVENT.REFUNDED;
    default:
      return ORDER_EVENT.PLACED;
  }
}

// Composite: attach tracking + transition to 'shipped' atomically (one
// UPDATE statement). Optimistic lock on `expectedStatus`.
export async function attachTracking(
  supabase: SupabaseClient,
  args: AttachTrackingArgs,
): Promise<OpsOrder> {
  const parsed = attachTrackingSchema.parse(args);
  if (!isValidTransition(parsed.expectedStatus, "shipped")) {
    throw new Error(
      `invalid_transition: ${parsed.expectedStatus} → shipped`,
    );
  }
  const db = supabase as unknown as Db;

  const update: Record<string, unknown> = {
    status: "shipped",
    tracking_number: parsed.trackingNumber,
    shipped_carrier: parsed.carrier,
    shipped_at: new Date().toISOString(),
  };
  if (parsed.shippoTransactionId) {
    update.shippo_transaction_id = parsed.shippoTransactionId;
  }

  const result = await db
    .from("orders")
    .update(update)
    .eq("id", parsed.orderId)
    .eq("status", parsed.expectedStatus)
    .select("*")
    .single();

  if (result.error) {
    throw new Error(`tracking_attach_failed: ${result.error.message}`);
  }
  if (!result.data) {
    throw new Error("stale_status");
  }
  const row = result.data as OrderRow;

  await Promise.all([
    db.from("order_status_history").insert({
      order_id: parsed.orderId,
      from_status: parsed.expectedStatus,
      to_status: "shipped",
      reason: "tracking_attached",
    }),
    logAuditEvent(supabase, {
      eventType: ORDER_EVENT.TRACKING_ATTACHED,
      orderId: parsed.orderId,
      details: {
        tracking_number: parsed.trackingNumber,
        carrier: parsed.carrier,
        shippo_transaction_id: parsed.shippoTransactionId ?? null,
      },
      actor: parsed.actor,
    }),
  ]);

  return toOpsOrder(row);
}

// Composite: mark refunded with reason + amount, atomically. Partial
// refunds allowed per CEO plan D17.
export async function markRefunded(
  supabase: SupabaseClient,
  args: RefundArgs,
): Promise<OpsOrder> {
  const parsed = refundSchema.parse(args);
  const db = supabase as unknown as Db;

  // Fetch order first so we can validate refund amount <= total without
  // racing the constraint.
  const lookup = await db
    .from("orders")
    .select("total_cents,status")
    .eq("id", parsed.orderId)
    .single();
  if (lookup.error) {
    throw new Error(`refund_lookup_failed: ${lookup.error.message}`);
  }
  if (!lookup.data) {
    throw new Error("order_not_found");
  }
  const lookupRow = lookup.data as { total_cents: number; status: OrderStatus };
  if (parsed.amountCents > lookupRow.total_cents) {
    throw new Error("refund_amount_exceeds_total");
  }
  if (lookupRow.status !== parsed.expectedStatus) {
    throw new Error("stale_status");
  }

  // A FULL refund is a terminal status transition (→ 'refunded'). A PARTIAL
  // refund records the amount/reason but leaves the order in its current
  // status so the rest of the fulfillment lifecycle can still proceed —
  // making a partially-refunded shipped order terminal would strand it.
  // Note: refund_amount_cents holds a single refund record, not a running
  // total — a second partial refund overwrites the first. A refunds ledger
  // is future work; flagged in TODOS.
  const isPartial = parsed.amountCents < lookupRow.total_cents;
  if (!isPartial && !isValidTransition(parsed.expectedStatus, "refunded")) {
    throw new Error(`invalid_transition: ${parsed.expectedStatus} → refunded`);
  }

  const update: Record<string, unknown> = {
    refund_reason: parsed.reason,
    refund_amount_cents: parsed.amountCents,
    refunded_at: new Date().toISOString(),
  };
  if (!isPartial) {
    update.status = "refunded";
  }

  const result = await db
    .from("orders")
    .update(update)
    .eq("id", parsed.orderId)
    .eq("status", parsed.expectedStatus)
    .select("*")
    .single();

  if (result.error) {
    throw new Error(`refund_failed: ${result.error.message}`);
  }
  if (!result.data) {
    throw new Error("stale_status");
  }
  const row = result.data as OrderRow;

  await logAuditEvent(supabase, {
    eventType: isPartial ? ORDER_EVENT.PARTIAL_REFUNDED : ORDER_EVENT.REFUNDED,
    orderId: parsed.orderId,
    details: {
      amount_cents: parsed.amountCents,
      total_cents: lookupRow.total_cents,
      partial: isPartial,
      reason: parsed.reason,
    },
    actor: parsed.actor,
  });

  // Only a full refund is a status transition worth recording in the
  // status-history timeline; a partial refund leaves status unchanged.
  if (!isPartial) {
    await db.from("order_status_history").insert({
      order_id: parsed.orderId,
      from_status: parsed.expectedStatus,
      to_status: "refunded",
      reason: parsed.reason,
    });
  }

  return toOpsOrder(row);
}
