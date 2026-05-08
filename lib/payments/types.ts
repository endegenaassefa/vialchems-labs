/**
 * Payment provider types per SUPER_PROMPT_v3 §8 Phase 9 + Appendix F +
 * DECISIONS/payment_stack.md.
 *
 * Day-1 stack:
 *   - 'stub'   — deterministic in-memory mock for local dev / tests
 *   - 'btcpay' — BTCPay Server self-hosted (BTC, LTC; 10-15% discount)
 *   - 'plaid'  — Plaid ACH (5% discount; 3-4 day clearance)
 *
 * Day-1 forbidden: Stripe, PayPal, Square, Shopify Payments. Iron Law 2.9.
 *
 * Phase 2 (Day 90+): MESH/MAX/Rocketfuel single processor; $1,000 cap;
 * "UNBLOCK" descriptor; gated behind ENABLE_CARDS_PHASE_2 env.
 */

export type PaymentProviderId = 'stub' | 'btcpay' | 'plaid';

export type PaymentMethod = 'crypto' | 'ach' | 'card';

export type PaymentStatus =
  | 'pending'
  | 'authorized'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface PaymentIntent {
  id: string;
  provider: PaymentProviderId;
  method: PaymentMethod;
  amountCents: number;
  currency: 'USD';
  status: PaymentStatus;
  metadata: Record<string, string>;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  /** External reference: BTCPay invoice ID or Plaid transaction ID. */
  externalId?: string;
  /** Optional checkout URL: BTCPay invoice page or Plaid Link token. */
  redirectUrl?: string;
}

export interface CreateIntentInput {
  amountCents: number;
  method: PaymentMethod;
  orderId: string;
  customerEmail: string;
  metadata?: Record<string, string>;
}

export interface WebhookResult {
  intent: PaymentIntent | null;
  eventType: string;
  verified: boolean;
}

export interface PaymentProvider {
  readonly id: PaymentProviderId;
  createIntent(input: CreateIntentInput): Promise<PaymentIntent>;
  getIntent(intentId: string): Promise<PaymentIntent | null>;
  handleWebhook(
    payload: unknown,
    headers: Record<string, string>,
  ): Promise<WebhookResult>;
}

/**
 * Payment-method discount band per DECISIONS/payment_stack.md.
 * crypto top of 10-15% band; ACH 5%; card 0% (Phase 2).
 */
export const PAYMENT_DISCOUNT_PCT: Record<PaymentMethod, number> = {
  crypto: 0.15,
  ach: 0.05,
  card: 0,
};

export interface DiscountCalculation {
  method: PaymentMethod;
  discountCents: number;
  totalCents: number;
}

export function applyPaymentMethodDiscount(
  subtotalCents: number,
  method: PaymentMethod,
): DiscountCalculation {
  const pct = PAYMENT_DISCOUNT_PCT[method];
  const discountCents = Math.round(subtotalCents * pct);
  return {
    method,
    discountCents,
    totalCents: subtotalCents - discountCents,
  };
}
