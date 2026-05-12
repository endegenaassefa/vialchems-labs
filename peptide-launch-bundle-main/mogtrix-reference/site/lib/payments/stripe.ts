import Stripe from "stripe";

import type {
  HostedPaymentSession,
  PaymentAdapter,
  PaymentIntent,
  PaymentStatusSnapshot,
  PaymentWebhookVerification
} from "@/lib/payments/types";
import { PaymentConfigurationError } from "@/lib/payments/config";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

function mapStripePaymentStatus(
  status: Stripe.Checkout.Session["payment_status"] | null
): PaymentStatus {
  switch (status) {
    case "paid":
    case "no_payment_required":
      return "succeeded";
    case "unpaid":
      return "pending";
    default:
      return "processing";
  }
}

function mapStripeEventType(
  eventType: string,
  session: Stripe.Checkout.Session
): PaymentWebhookVerification["eventType"] {
  switch (eventType) {
    case "checkout.session.completed":
      return session.payment_status === "paid" ? "payment.paid" : "payment.pending";
    case "checkout.session.async_payment_succeeded":
      return "payment.paid";
    case "checkout.session.async_payment_failed":
      return "payment.failed";
    case "checkout.session.expired":
      return "payment.cancelled";
    default:
      return undefined;
  }
}

function mapStripeSessionOrderStatus(session: Stripe.Checkout.Session): Extract<
  OrderStatus,
  "payment_requested" | "payment_pending" | "paid" | "issue"
> {
  if (session.status === "expired") {
    return "issue";
  }

  if (session.payment_status === "paid" || session.payment_status === "no_payment_required") {
    return "paid";
  }

  if (session.status === "complete") {
    return "payment_pending";
  }

  return "payment_requested";
}

function getPaymentIntentId(session: Stripe.Checkout.Session) {
  if (typeof session.payment_intent === "string") {
    return session.payment_intent;
  }

  return session.payment_intent?.id ?? null;
}

function getShippingCents(session: Stripe.Checkout.Session) {
  return session.shipping_cost?.amount_total
    ?? session.shipping_cost?.amount_subtotal
    ?? session.total_details?.amount_shipping
    ?? 0;
}

export class StripePaymentAdapter implements PaymentAdapter {
  private readonly stripe: Stripe;

  constructor(
    secretKey: string,
    private readonly webhookSecret: string
  ) {
    this.stripe = new Stripe(secretKey);
  }

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
    if (!params.lineItems?.length) {
      throw new PaymentConfigurationError(
        "Stripe Checkout requires concrete line items before a hosted payment session can be created."
      );
    }

    if (!params.shipping?.shippingAmountCents && params.shipping?.shippingAmountCents !== 0) {
      throw new PaymentConfigurationError(
        "Stripe Checkout requires a configured US pilot shipping amount."
      );
    }

    if (!params.successUrl || !params.cancelUrl || !params.shipping) {
      throw new PaymentConfigurationError(
        "Stripe Checkout requires success/cancel URLs and a shipping address."
      );
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: "payment",
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer_email: params.customerEmail,
      client_reference_id: params.orderId,
      billing_address_collection: "required",
      customer_creation: "always",
      automatic_tax: {
        enabled: true
      },
      shipping_address_collection: {
        allowed_countries: ["US"]
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: "Ground shipping",
            fixed_amount: {
              amount: params.shipping.shippingAmountCents,
              currency: params.currency
            },
            tax_behavior: "exclusive"
          }
        }
      ],
      payment_intent_data: {
        metadata: {
          orderId: params.orderId,
          ...(params.metadata ?? {})
        },
        shipping: {
          name: params.shipping.name,
          address: {
            line1: params.shipping.line1,
            line2: params.shipping.line2 ?? undefined,
            city: params.shipping.city,
            state: params.shipping.state,
            postal_code: params.shipping.postalCode,
            country: params.shipping.country
          }
        }
      },
      metadata: {
        orderId: params.orderId,
        ...(params.metadata ?? {})
      },
      line_items: params.lineItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: params.currency,
          unit_amount: item.unitAmountCents,
          tax_behavior: "exclusive",
          product_data: {
            name: item.name,
            description: item.description ?? undefined
          }
        }
      }))
    });

    if (!session.url) {
      throw new PaymentConfigurationError(
        "Stripe Checkout did not return a hosted payment URL."
      );
    }

    return {
      reference: session.id,
      hostedUrl: session.url,
      provider: "stripe",
      status: "payment_requested",
      customerMessage: "Complete payment in the secure Stripe checkout window to continue.",
      subtotalCents: session.amount_subtotal ?? params.amountCents,
      shippingCents: getShippingCents(session),
      taxCents: session.total_details?.amount_tax ?? 0,
      totalCents: session.amount_total ?? params.amountCents,
      paymentIntentId: getPaymentIntentId(session)
    };
  }

  async verifyWebhook(
    payload: string,
    signature: string
  ): Promise<PaymentWebhookVerification> {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret
      );

      const session = event.data.object as Stripe.Checkout.Session;
      const providerStatus = mapStripePaymentStatus(session.payment_status);
      const eventType = mapStripeEventType(event.type, session);

      if (!eventType) {
        return { valid: false };
      }

      return {
        valid: true,
        eventId: event.id,
        eventType,
        reference: session.id,
        orderId: session.metadata?.orderId ?? session.client_reference_id ?? undefined,
        providerStatus
      };
    } catch {
      return { valid: false };
    }
  }

  async readPaymentStatus(reference: string): Promise<PaymentStatusSnapshot> {
    const session = await this.stripe.checkout.sessions.retrieve(reference);
    const providerStatus = mapStripePaymentStatus(session.payment_status);

    return {
      reference: session.id,
      provider: "stripe",
      status: mapStripeSessionOrderStatus(session),
      providerStatus,
      hostedUrl: session.url ?? null,
      customerMessage:
        providerStatus === "succeeded"
          ? "Payment confirmed. Mogtrix ops is preparing your order for fulfillment."
          : providerStatus === "failed" || session.status === "expired"
            ? "Payment needs follow-up before this order can move forward."
            : "Payment is still processing. Return here for the latest order update.",
      paymentIntentId: getPaymentIntentId(session),
      subtotalCents: session.amount_subtotal ?? null,
      shippingCents: getShippingCents(session),
      taxCents: session.total_details?.amount_tax ?? null,
      totalCents: session.amount_total ?? null
    };
  }

  async createPaymentIntent(): Promise<PaymentIntent> {
    throw new PaymentConfigurationError(
      "Stripe Checkout uses hosted sessions instead of direct client payment intents in this pilot."
    );
  }

  async confirmPayment(): Promise<PaymentIntent> {
    throw new PaymentConfigurationError(
      "Stripe Checkout payments are confirmed by Stripe webhooks in this pilot."
    );
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

  async getPaymentStatus(): Promise<PaymentIntent> {
    throw new PaymentConfigurationError(
      "Stripe Checkout does not expose direct payment-intent polling through this adapter path."
    );
  }
}
