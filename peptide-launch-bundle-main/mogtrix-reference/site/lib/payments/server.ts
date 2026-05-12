import { sendOrderEmail } from "@/lib/order-email";
import type { PaymentWebhookVerification } from "@/lib/payments";
import { getPaymentEventOutcome } from "@/lib/payments/reconciliation";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

type PaymentOrderRow = {
  id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_provider: string | null;
  total_cents: number;
  shipping_name: string;
  customer_next_step: string | null;
  shipment_tracking_reference: string | null;
  paid_at: string | null;
  customer?: {
    email: string | null;
  } | {
    email: string | null;
  }[] | null;
};

function getCustomerEmail(row: PaymentOrderRow) {
  const customer = Array.isArray(row.customer) ? row.customer[0] ?? null : row.customer ?? null;
  return customer?.email?.trim().toLowerCase() ?? null;
}

function inferProviderStatus(eventType: string, providerStatus?: PaymentStatus): PaymentStatus {
  if (providerStatus) {
    return providerStatus;
  }

  switch (eventType) {
    case "payment.paid":
      return "succeeded";
    case "payment.failed":
      return "failed";
    case "payment.cancelled":
      return "cancelled";
    default:
      return "pending";
  }
}

export function getCustomerNextStepMessage(status: OrderStatus) {
  switch (status) {
    case "payment_requested":
      return "Open your hosted payment link to complete checkout.";
    case "payment_pending":
      return "Payment was submitted. We are waiting for confirmation from the payment provider.";
    case "paid":
      return "Payment confirmed. Mogtrix ops is preparing your order for fulfillment.";
    case "processing":
      return "Your order is in fulfillment review.";
    case "shipped":
      return "Shipment is in transit. Tracking details are available below.";
    case "completed":
    case "delivered":
      return "This order has been completed.";
    case "issue":
    case "cancelled":
    case "refunded":
      return "This order needs follow-up. Review the latest status or contact support.";
    default:
      return "Return to checkout to continue this order.";
  }
}

function getPaymentEventNote(eventType: string) {
  switch (eventType) {
    case "payment.pending":
      return "Hosted payment submitted. Waiting for provider confirmation.";
    case "payment.paid":
      return "Payment confirmed by provider webhook.";
    case "payment.failed":
      return "Provider reported a failed payment attempt.";
    case "payment.cancelled":
      return "Provider reported the payment was cancelled.";
    default:
      return "Payment webhook processed.";
  }
}

async function findOrderByReference(reference: string) {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return { supabase: null, order: null };
  }

  const select = [
    "id",
    "status",
    "payment_status",
    "payment_provider",
    "total_cents",
    "shipping_name",
    "customer_next_step",
    "shipment_tracking_reference",
    "paid_at",
    "customer:customer_profiles!customer_id(email)"
  ].join(", ");

  const directLookup = await supabase
    .from("orders")
    .select(select)
    .eq("external_payment_reference", reference)
    .maybeSingle();

  if (directLookup.data) {
    return { supabase, order: directLookup.data as unknown as PaymentOrderRow };
  }

  const legacyLookup = await supabase
    .from("orders")
    .select(select)
    .eq("payment_intent_id", reference)
    .maybeSingle();

  return {
    supabase,
    order: (legacyLookup.data as unknown as PaymentOrderRow | null) ?? null
  };
}

export async function processPaymentWebhookEvent(
  verification: PaymentWebhookVerification,
  payload: string
) {
  if (!verification.reference || !verification.eventType) {
    return {
      status: 400,
      body: { error: "The payment event is missing required fields." }
    };
  }

  const { supabase, order } = await findOrderByReference(verification.reference);
  if (!supabase) {
    return {
      status: 503,
      body: { error: "Webhook processing is unavailable." }
    };
  }

  if (!order) {
    return {
      status: 404,
      body: { error: "Order not found for payment event." }
    };
  }

  const providerStatus = inferProviderStatus(
    verification.eventType,
    verification.providerStatus
  );
  const outcome = getPaymentEventOutcome(
    {
      status: order.status,
      paymentStatus: order.payment_status
    },
    {
      eventType: verification.eventType,
      providerStatus
    }
  );
  const providerEventId = verification.eventId ?? `evt_${crypto.randomUUID()}`;
  const parsedPayload = (() => {
    try {
      return JSON.parse(payload) as unknown;
    } catch {
      return { raw: payload };
    }
  })();

  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "apply_order_payment_webhook_event",
    {
      p_order_id: order.id,
      p_provider: order.payment_provider ?? "stub",
      p_external_reference: verification.reference,
      p_provider_event_id: providerEventId,
      p_event_type: verification.eventType,
      p_provider_status: providerStatus,
      p_payload: parsedPayload,
      p_apply: outcome.apply,
      p_next_status: outcome.apply ? outcome.nextStatus : null,
      p_next_payment_status: outcome.apply ? outcome.nextPaymentStatus : null,
      p_customer_next_step: outcome.apply ? getCustomerNextStepMessage(outcome.nextStatus) : null,
      p_note: getPaymentEventNote(verification.eventType),
      p_outcome_reason: outcome.apply ? null : outcome.reason
    }
  );

  const rpcResult = Array.isArray(rpcData) ? rpcData[0] : rpcData;
  if (rpcError || !rpcResult?.id) {
    return {
      status: 500,
      body: { error: "Order payment state could not be updated." }
    };
  }

  if (rpcResult.duplicate) {
    return {
      status: 200,
      body: { ok: true, duplicate: true }
    };
  }

  if (!outcome.apply) {
    return {
      status: 200,
      body: { ok: true, skipped: outcome.reason }
    };
  }

  const nextStep = getCustomerNextStepMessage(outcome.nextStatus);

  if (outcome.nextStatus === "paid") {
    const customerEmail = getCustomerEmail(order);

    if (customerEmail) {
      try {
        await sendOrderEmail("paid", {
          id: order.id,
          status: outcome.nextStatus,
          paymentStatus: outcome.nextPaymentStatus,
          totalCents: order.total_cents,
          customerEmail,
          shippingName: order.shipping_name,
          customerNextStep: nextStep,
          shipmentTrackingReference: order.shipment_tracking_reference
        });
      } catch (error) {
        console.error("order paid email failed", error);
      }
    }
  } else if (
    verification.eventType === "payment.failed" ||
    verification.eventType === "payment.cancelled"
  ) {
    const customerEmail = getCustomerEmail(order);

    if (customerEmail) {
      try {
        await sendOrderEmail("payment_failed", {
          id: order.id,
          status: outcome.nextStatus,
          paymentStatus: outcome.nextPaymentStatus,
          totalCents: order.total_cents,
          customerEmail,
          shippingName: order.shipping_name,
          customerNextStep: nextStep,
          shipmentTrackingReference: order.shipment_tracking_reference
        });
      } catch (error) {
        console.error("order payment failure email failed", error);
      }
    }
  }

  return {
    status: 200,
    body: {
      ok: true,
      orderId: order.id,
      status: outcome.nextStatus,
      paymentStatus: outcome.nextPaymentStatus
    }
  };
}
