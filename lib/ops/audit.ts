import type { SupabaseClient } from "@supabase/supabase-js";

// Phase A audit-log helpers. Every order mutation writes to audit_log with
// full context so we can replay disputes forensically. Service-role only —
// audit_log has no client RLS policies.
//
// Event type strings are namespaced "domain.action" to match the existing
// conventions in init migration (e.g. order.placed). Keep these as constants
// so callers don't typo a new variant.

export const ORDER_EVENT = {
  PLACED: "order.placed",
  PAID: "order.paid",
  FULFILLED: "order.fulfilled",
  SHIPPED: "order.shipped",
  DELIVERED: "order.delivered",
  CANCELLED: "order.cancelled",
  REFUNDED: "order.refunded",
  PARTIAL_REFUNDED: "order.partial_refunded",
  TRACKING_ATTACHED: "order.tracking_attached",
} as const;

export const PAYMENT_EVENT = {
  RECONCILED: "payment.reconciled",
  MANUAL_CONFIRMED: "manual_payment.confirmed",
  REFUND_ISSUED: "payment.refund_issued",
  // Customer pressed "I've sent the payment" on the Zelle instruction
  // screen. Advisory only — does NOT move the order to paid. It gives ops
  // a work-queue signal to go check the bank account.
  CLAIMED_SENT: "payment.claimed_sent",
} as const;

export const SHIPPO_EVENT = {
  LABEL_PURCHASED: "shippo.label_purchased",
  TRACKING_UPDATED: "shippo.tracking_updated",
  WEBHOOK_RECEIVED: "shippo.webhook_received",
  WEBHOOK_REJECTED: "shippo.webhook_rejected",
} as const;

export const EMAIL_EVENT = {
  SHIPMENT_SENT: "email.shipment_sent",
  REFUND_SENT: "email.refund_sent",
  TEST_DIVERTED: "email.test_diverted",
} as const;

export type OrderEvent = (typeof ORDER_EVENT)[keyof typeof ORDER_EVENT];
export type PaymentEvent = (typeof PAYMENT_EVENT)[keyof typeof PAYMENT_EVENT];
export type ShippoEvent = (typeof SHIPPO_EVENT)[keyof typeof SHIPPO_EVENT];
export type EmailEvent = (typeof EMAIL_EVENT)[keyof typeof EMAIL_EVENT];
export type AuditEvent = OrderEvent | PaymentEvent | ShippoEvent | EmailEvent;

interface LogOrderEventArgs {
  eventType: AuditEvent;
  orderId?: string | null;
  customerId?: string | null;
  details: Record<string, unknown>;
  actor?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

interface AuditInsertResult {
  data?: { id: number } | null;
  error?: { message: string } | null;
}

interface AuditDb {
  from(table: "audit_log"): {
    insert(row: Record<string, unknown>): {
      select(columns: string): {
        single(): PromiseLike<AuditInsertResult>;
      };
    };
  };
}

// Single entry point for every audit write. `actor` is folded into `details`
// so it survives even if we later split staff names into a separate column.
// The trigger on audit_log (migration 20260513000001) auto-inherits the
// parent order's is_test flag, so we don't pass it here.
export async function logAuditEvent(
  supabase: SupabaseClient,
  args: LogOrderEventArgs,
): Promise<{ id: number }> {
  const db = supabase as unknown as AuditDb;
  const result = await db
    .from("audit_log")
    .insert({
      event_type: args.eventType,
      order_id: args.orderId ?? null,
      customer_id: args.customerId ?? null,
      details: {
        ...args.details,
        actor: args.actor ?? "ops-api",
      },
      ip_address: args.ipAddress ?? null,
      user_agent: args.userAgent ?? null,
    })
    .select("id")
    .single();

  if (result.error) {
    throw new Error(`audit_log_insert_failed: ${result.error.message}`);
  }
  if (!result.data) {
    throw new Error("audit_log_insert_failed: no row returned");
  }
  return { id: result.data.id };
}
