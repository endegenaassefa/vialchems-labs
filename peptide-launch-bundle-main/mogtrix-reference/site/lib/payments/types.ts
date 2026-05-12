import type { OrderStatus, PaymentStatus } from "@/lib/types";

export interface PaymentIntent {
  id: string;
  clientSecret?: string;
  status: "pending" | "requires_action" | "succeeded" | "failed" | "cancelled";
  amount_cents: number;
  currency: string;
  provider: string;
}

export interface HostedPaymentLineItem {
  name: string;
  description?: string | null;
  unitAmountCents: number;
  quantity: number;
}

export interface HostedPaymentShippingAddress {
  name: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  shippingAmountCents?: number;
}

export interface HostedPaymentSession {
  reference: string;
  hostedUrl: string;
  provider: string;
  status: Extract<OrderStatus, "payment_requested" | "payment_pending" | "paid" | "issue">;
  customerMessage: string;
  subtotalCents?: number | null;
  shippingCents?: number | null;
  taxCents?: number | null;
  totalCents?: number | null;
  paymentIntentId?: string | null;
}

export interface PaymentWebhookVerification {
  valid: boolean;
  eventId?: string;
  eventType?: string;
  reference?: string;
  orderId?: string;
  providerStatus?: PaymentStatus;
}

export interface PaymentStatusSnapshot {
  reference: string;
  provider: string;
  status: Extract<OrderStatus, "payment_requested" | "payment_pending" | "paid" | "issue">;
  providerStatus: PaymentStatus;
  hostedUrl: string | null;
  customerMessage: string | null;
  paymentIntentId?: string | null;
  subtotalCents?: number | null;
  shippingCents?: number | null;
  taxCents?: number | null;
  totalCents?: number | null;
}

export interface PaymentAdapter {
  createHostedPaymentSession(params: {
    amountCents: number;
    currency: string;
    orderId: string;
    customerEmail: string;
    metadata?: Record<string, string>;
    lineItems?: HostedPaymentLineItem[];
    shipping?: HostedPaymentShippingAddress;
    successUrl?: string;
    cancelUrl?: string;
  }): Promise<HostedPaymentSession>;

  verifyWebhook(
    payload: string,
    signature: string
  ): Promise<PaymentWebhookVerification>;

  readPaymentStatus(reference: string): Promise<PaymentStatusSnapshot>;

  createPaymentIntent(params: {
    amount_cents: number;
    currency: string;
    orderId: string;
    customerEmail: string;
    metadata?: Record<string, string>;
  }): Promise<PaymentIntent>;

  confirmPayment(intentId: string): Promise<PaymentIntent>;

  verifyWebhookSignature(
    payload: string,
    signature: string
  ): Promise<{ valid: boolean; event?: string; intentId?: string }>;

  getPaymentStatus(intentId: string): Promise<PaymentIntent>;
}
