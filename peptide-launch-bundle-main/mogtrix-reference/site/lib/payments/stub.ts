import type {
  HostedPaymentSession,
  PaymentAdapter,
  PaymentIntent,
  PaymentStatusSnapshot,
  PaymentWebhookVerification
} from "@/lib/payments/types";

function createStubNonce(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

export class StubPaymentAdapter implements PaymentAdapter {
  async createHostedPaymentSession(params: {
    amountCents: number;
    currency: string;
    orderId: string;
    customerEmail: string;
    metadata?: Record<string, string>;
    lineItems?: Array<{
      name: string;
      description?: string | null;
      unitAmountCents: number;
      quantity: number;
    }>;
    shipping?: {
      name: string;
      line1: string;
      line2?: string | null;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      shippingAmountCents?: number;
    };
    successUrl?: string;
    cancelUrl?: string;
  }): Promise<HostedPaymentSession> {
    const reference = createStubNonce("stub_pay");
    const shippingCents = params.shipping?.shippingAmountCents ?? 0;
    const totalCents = params.amountCents + shippingCents;

    return {
      reference,
      hostedUrl: `/payments/stub/hosted?reference=${encodeURIComponent(reference)}&orderId=${encodeURIComponent(params.orderId)}`,
      provider: "stub",
      status: "payment_requested",
      customerMessage: "Complete your hosted payment using the secure payment link to continue.",
      subtotalCents: params.amountCents,
      shippingCents,
      taxCents: 0,
      totalCents
    };
  }

  async verifyWebhook(
    payload: string,
    signature: string
  ): Promise<PaymentWebhookVerification> {
    const expectedSignature = process.env.STUB_PAYMENT_WEBHOOK_SECRET ?? "stub_signature";
    if (signature !== expectedSignature) {
      return { valid: false };
    }

    try {
      const parsed = JSON.parse(payload) as {
        eventId?: unknown;
        eventType?: unknown;
        reference?: unknown;
        orderId?: unknown;
        providerStatus?: unknown;
      };

      return {
        valid: true,
        eventId: typeof parsed.eventId === "string" ? parsed.eventId : undefined,
        eventType: typeof parsed.eventType === "string" ? parsed.eventType : undefined,
        reference: typeof parsed.reference === "string" ? parsed.reference : undefined,
        orderId: typeof parsed.orderId === "string" ? parsed.orderId : undefined,
        providerStatus: typeof parsed.providerStatus === "string" ? parsed.providerStatus as PaymentWebhookVerification["providerStatus"] : undefined
      };
    } catch {
      return { valid: false };
    }
  }

  async readPaymentStatus(reference: string): Promise<PaymentStatusSnapshot> {
    return {
      reference,
      provider: "stub",
      status: "payment_pending",
      providerStatus: "pending",
      hostedUrl: `/payments/stub/hosted?reference=${encodeURIComponent(reference)}`,
      customerMessage: "Hosted payment requested. Waiting for payment confirmation.",
      paymentIntentId: null
    };
  }

  async createPaymentIntent(params: {
    amount_cents: number;
    currency: string;
    orderId: string;
    customerEmail: string;
    metadata?: Record<string, string>;
  }): Promise<PaymentIntent> {
    const nonce = createStubNonce("stub_pi").replace(/^stub_pi_/, "");

    return {
      id: `stub_pi_${nonce}`,
      clientSecret: `stub_secret_${nonce}`,
      status: "pending",
      amount_cents: params.amount_cents,
      currency: params.currency,
      provider: "stub"
    };
  }

  async confirmPayment(intentId: string): Promise<PaymentIntent> {
    return {
      id: intentId,
      status: "succeeded",
      amount_cents: 0,
      currency: "usd",
      provider: "stub"
    };
  }

  async verifyWebhookSignature(
    payload: string,
    signature: string
  ): Promise<{ valid: boolean; event?: string; intentId?: string }> {
    const verification = await this.verifyWebhook(payload, signature);

    return {
      valid: verification.valid,
      event: verification.eventType,
      intentId: verification.reference
    };
  }

  async getPaymentStatus(intentId: string): Promise<PaymentIntent> {
    return {
      id: intentId,
      status: "succeeded",
      amount_cents: 0,
      currency: "usd",
      provider: "stub"
    };
  }
}
