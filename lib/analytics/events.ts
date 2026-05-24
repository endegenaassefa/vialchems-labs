/**
 * D4 — Funnel event names + props shapes
 * (Section 6 super-prompt 2026-05-22).
 *
 * Centralized so the call sites in components + API routes + the
 * server-side proxy can't drift on the event name (string typos
 * silently disappear into Plausible's "Other" bucket).
 */

export const FUNNEL_EVENTS = {
  AGE_GATE_PASSED: "age_gate_passed",
  PRODUCT_VIEWED: "product_viewed",
  ADD_TO_CART: "add_to_cart",
  CHECKOUT_STARTED: "checkout_started",
  QUALIFICATION_COMPLETED: "qualification_completed",
  PAYMENT_METHOD_SELECTED: "payment_method_selected",
  ORDER_PLACED: "order_placed",
  ORDER_PAID: "order_paid",
} as const;

export type FunnelEventName =
  (typeof FUNNEL_EVENTS)[keyof typeof FUNNEL_EVENTS];

export interface OrderEventProps {
  provider: string;
  total_cents: number;
}

export interface PaymentMethodEventProps {
  provider: string;
}

export interface ProductEventProps {
  slug: string;
  dose?: string;
}
