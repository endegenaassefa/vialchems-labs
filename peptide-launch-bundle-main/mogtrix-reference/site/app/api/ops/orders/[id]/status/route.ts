import { NextResponse } from "next/server";

import { sendOrderEmail } from "@/lib/order-email";
import { getCustomerNextStepMessage } from "@/lib/payments/server";
import {
  getStaffSessionState,
  validateOrderStatusTransitionInput
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
  completed_at: string | null;
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
    return NextResponse.json({ error: "Sign in to update order statuses." }, { status: 401 });
  }

  if (session.kind === "forbidden") {
    return NextResponse.json({ error: "This account is not an active Mogtrix operator." }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid order status payload." }, { status: 400 });
  }

  const validation = validateOrderStatusTransitionInput(payload);
  if (!validation.ok || !validation.input) {
    return NextResponse.json({
      error: validation.errors[0] ?? "Invalid order status payload.",
      details: validation.errors
    }, { status: 400 });
  }

  const { id } = await context.params;
  const { data: order, error: orderError } = await session.supabase
    .from("orders")
    .select("id, status, payment_status, total_cents, shipping_name, shipment_tracking_reference, shipped_at, completed_at, customer:customer_profiles!customer_id(email)")
    .eq("id", id)
    .maybeSingle();

  if (orderError || !order) {
    return NextResponse.json({ error: "That order no longer exists." }, { status: 404 });
  }

  if (order.status === validation.input.nextStatus) {
    return NextResponse.json({ error: "Choose a different status before saving." }, { status: 400 });
  }

  const timestamp = new Date().toISOString();
  const nextStatus = validation.input.nextStatus as OrderStatus;
  const updatePayload: Record<string, unknown> = {
    status: nextStatus,
    customer_next_step: getCustomerNextStepMessage(nextStatus)
  };

  if (nextStatus === "shipped" && !(order as OrderRow).shipped_at) {
    updatePayload.shipped_at = timestamp;
  }

  if (nextStatus === "completed" && !(order as OrderRow).completed_at) {
    updatePayload.completed_at = timestamp;
  }

  const { error: updateError } = await session.supabase
    .from("orders")
    .update(updatePayload)
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: "The order status could not be updated." }, { status: 500 });
  }

  await session.supabase.from("order_status_history").insert({
    order_id: id,
    previous_status: (order as OrderRow).status,
    next_status: nextStatus,
    actor_type: "staff",
    actor_id: session.profile.id,
    note: validation.input.note ?? `Order moved to ${nextStatus.replaceAll("_", " ")}.`
  });

  if (nextStatus === "shipped" || nextStatus === "issue" || nextStatus === "cancelled" || nextStatus === "refunded") {
    const customerEmail = getCustomerEmail(order as OrderRow);

    if (customerEmail) {
      try {
        await sendOrderEmail(nextStatus === "shipped" ? "shipped" : "issue", {
          id,
          status: nextStatus,
          paymentStatus: (order as OrderRow).payment_status as never,
          totalCents: (order as OrderRow).total_cents,
          customerEmail,
          shippingName: (order as OrderRow).shipping_name,
          customerNextStep: getCustomerNextStepMessage(nextStatus),
          shipmentTrackingReference: (order as OrderRow).shipment_tracking_reference
        });
      } catch (emailError) {
        console.error("order status email failed", emailError);
      }
    }
  }

  return NextResponse.json({
    id,
    status: nextStatus
  });
}
