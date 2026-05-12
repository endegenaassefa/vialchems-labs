import { NextResponse } from "next/server";

import { sendOrderEmail } from "@/lib/order-email";
import { getCustomerNextStepMessage } from "@/lib/payments/server";
import {
  canAutoAdvanceOrderToShipped,
  getStaffSessionState,
  validateOrderShipmentInput
} from "@/lib/ops";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

type OrderRow = {
  id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total_cents: number;
  shipping_name: string;
  shipment_tracking_reference: string | null;
  shipped_at: string | null;
  customer?: {
    email: string | null;
  } | {
    email: string | null;
  }[] | null;
};

function getCustomerEmail(order: OrderRow) {
  const customer = Array.isArray(order.customer) ? order.customer[0] ?? null : order.customer ?? null;
  return customer?.email?.trim().toLowerCase() ?? null;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getStaffSessionState();

  if (session.kind === "unavailable") {
    return NextResponse.json({ error: "Ops auth is unavailable until Supabase public keys are configured." }, { status: 503 });
  }

  if (session.kind === "anonymous") {
    return NextResponse.json({ error: "Sign in to update shipment details." }, { status: 401 });
  }

  if (session.kind === "forbidden") {
    return NextResponse.json({ error: "This account is not an active Mogtrix operator." }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid shipment payload." }, { status: 400 });
  }

  const validation = validateOrderShipmentInput(payload);
  if (!validation.ok || !validation.input) {
    return NextResponse.json({
      error: validation.errors[0] ?? "Invalid shipment payload.",
      details: validation.errors
    }, { status: 400 });
  }

  const { id } = await context.params;
  const { data: order, error: orderError } = await session.supabase
    .from("orders")
    .select("id, status, payment_status, total_cents, shipping_name, shipment_tracking_reference, shipped_at, customer:customer_profiles!customer_id(email)")
    .eq("id", id)
    .maybeSingle();

  if (orderError || !order) {
    return NextResponse.json({ error: "That order no longer exists." }, { status: 404 });
  }

  const currentOrder = order as OrderRow;
  const nextStatus: OrderStatus | null =
    ["shipped", "completed", "delivered"].includes(currentOrder.status)
      ? currentOrder.status
      : canAutoAdvanceOrderToShipped({
        status: currentOrder.status,
        paymentStatus: currentOrder.payment_status
      })
        ? "shipped"
        : null;

  if (!nextStatus) {
    return NextResponse.json({
      error: "Shipment updates are only allowed after payment succeeds and fulfillment is ready."
    }, { status: 409 });
  }
  const timestamp = new Date().toISOString();

  const { error: updateError } = await session.supabase
    .from("orders")
    .update({
      shipment_tracking_reference: validation.input.trackingReference ?? null,
      shipment_tracking_url: validation.input.trackingUrl ?? null,
      shipment_note: validation.input.shipmentNote ?? null,
      status: nextStatus,
      shipped_at: !currentOrder.shipped_at && nextStatus === "shipped"
        ? timestamp
        : currentOrder.shipped_at,
      customer_next_step: getCustomerNextStepMessage(nextStatus)
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: "The shipment update could not be saved." }, { status: 500 });
  }

  await session.supabase.from("order_status_history").insert({
    order_id: id,
    previous_status: currentOrder.status,
    next_status: nextStatus,
    actor_type: "staff",
    actor_id: session.profile.id,
    note: validation.input.shipmentNote ?? "Shipment details updated."
  });

  const customerEmail = getCustomerEmail(currentOrder);
  if (customerEmail) {
    try {
      await sendOrderEmail("shipped", {
        id,
        status: nextStatus,
        paymentStatus: currentOrder.payment_status,
        totalCents: currentOrder.total_cents,
        customerEmail,
        shippingName: currentOrder.shipping_name,
        customerNextStep: getCustomerNextStepMessage(nextStatus),
        shipmentTrackingReference:
          validation.input.trackingReference
          ?? currentOrder.shipment_tracking_reference
          ?? null
      });
    } catch (emailError) {
      console.error("shipment email failed", emailError);
    }
  }

  return NextResponse.json({
    id,
    status: nextStatus,
    shipment: {
      trackingReference: validation.input.trackingReference ?? null,
      trackingUrl: validation.input.trackingUrl ?? null,
      shipmentNote: validation.input.shipmentNote ?? null
    }
  });
}
