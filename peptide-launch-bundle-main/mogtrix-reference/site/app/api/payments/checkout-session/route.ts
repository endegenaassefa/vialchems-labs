import { NextResponse } from "next/server";
import { z } from "zod/v4";

import { requireQualifiedCustomer } from "@/lib/auth/customer";
import { sendOrderEmail } from "@/lib/order-email";
import { getPaymentAdapter, PaymentConfigurationError } from "@/lib/payments";
import { getPilotUsShippingCents, getSiteUrl } from "@/lib/payments/config";
import { getCustomerNextStepMessage } from "@/lib/payments/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const schema = z.object({
  orderId: z.string().min(1)
});

type CheckoutSessionOrderRow = {
  id: string;
  customer_id: string;
  status: string;
  payment_status: string;
  payment_provider: string | null;
  subtotal_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  shipping_name: string;
  shipping_address_line1: string;
  shipping_address_line2: string | null;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  external_payment_url: string | null;
  external_payment_reference: string | null;
  customer_next_step: string | null;
};

type OrderItemRow = {
  product_name: string;
  price_cents: number;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const customer = await requireQualifiedCustomer();
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Payments are unavailable." }, { status: 503 });
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "orderId is required." }, { status: 400 });
    }

    const { data: orderData, error } = await supabase
      .from("orders")
      .select([
        "id",
        "customer_id",
        "status",
        "payment_status",
        "payment_provider",
        "subtotal_cents",
        "shipping_cents",
        "tax_cents",
        "total_cents",
        "shipping_name",
        "shipping_address_line1",
        "shipping_address_line2",
        "shipping_city",
        "shipping_state",
        "shipping_postal_code",
        "shipping_country",
        "external_payment_url",
        "external_payment_reference",
        "customer_next_step"
      ].join(", "))
      .eq("id", parsed.data.orderId)
      .eq("customer_id", customer.customerId)
      .maybeSingle();
    const order = orderData as unknown as CheckoutSessionOrderRow | null;

    if (error || !order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (["paid", "processing", "shipped", "completed", "delivered"].includes(order.status)) {
      return NextResponse.json({
        error: "Order no longer needs a payment session."
      }, { status: 400 });
    }

    const adapter = getPaymentAdapter();
    const shippingAmountCents = getPilotUsShippingCents();

    if (
      order.external_payment_reference &&
      order.external_payment_url &&
      ["payment_requested", "payment_pending", "pending_payment"].includes(order.status)
    ) {
      const current = await adapter.readPaymentStatus(order.external_payment_reference);

      return NextResponse.json({
        paymentSession: {
          ...current,
          hostedUrl: order.external_payment_url,
          provider: order.payment_provider ?? current.provider,
          status: order.status === "payment_pending" || order.status === "pending_payment"
            ? "payment_pending"
            : "payment_requested",
          customerMessage: order.customer_next_step ?? current.customerMessage
        }
      });
    }

    const { data: itemRows, error: itemError } = await supabase
      .from("order_items")
      .select("product_name, price_cents, quantity")
      .eq("order_id", order.id);

    if (itemError || !itemRows?.length) {
      return NextResponse.json({ error: "Order items are unavailable for payment." }, { status: 500 });
    }

    const siteUrl = getSiteUrl();
    const successUrl = `${siteUrl}/account/orders/${encodeURIComponent(order.id)}?status=payment_pending`;
    const cancelUrl = `${siteUrl}/checkout`;

    const paymentSession = await adapter.createHostedPaymentSession({
      amountCents: order.total_cents,
      currency: "usd",
      orderId: order.id,
      customerEmail: customer.email,
      metadata: {
        orderId: order.id
      },
      lineItems: (itemRows as OrderItemRow[]).map((item) => ({
        name: item.product_name,
        unitAmountCents: item.price_cents,
        quantity: item.quantity
      })),
      shipping: {
        name: order.shipping_name,
        line1: order.shipping_address_line1,
        line2: order.shipping_address_line2,
        city: order.shipping_city,
        state: order.shipping_state,
        postalCode: order.shipping_postal_code,
        country: order.shipping_country,
        shippingAmountCents
      },
      successUrl,
      cancelUrl
    });

    const nextStep = paymentSession.customerMessage || getCustomerNextStepMessage("payment_requested");
    const updatedSubtotal = paymentSession.subtotalCents ?? order.subtotal_cents;
    const updatedShipping = paymentSession.shippingCents ?? shippingAmountCents;
    const updatedTax = paymentSession.taxCents ?? 0;
    const updatedTotal =
      paymentSession.totalCents ?? (updatedSubtotal + updatedShipping + updatedTax);

    const { data: updateData, error: updateError } = await supabase.rpc(
      "update_checkout_order_payment_session",
      {
        p_order_id: order.id,
        p_payment_provider: paymentSession.provider,
        p_payment_intent_id: paymentSession.paymentIntentId ?? paymentSession.reference,
        p_external_payment_reference: paymentSession.reference,
        p_external_payment_url: paymentSession.hostedUrl,
        p_customer_next_step: nextStep,
        p_subtotal_cents: updatedSubtotal,
        p_shipping_cents: updatedShipping,
        p_tax_cents: updatedTax,
        p_total_cents: updatedTotal
      }
    );

    if (updateError || !(Array.isArray(updateData) ? updateData[0] : updateData)?.id) {
      return NextResponse.json({ error: "Payment could not be initialized." }, { status: 500 });
    }

    try {
      await sendOrderEmail("payment_requested", {
        id: order.id,
        status: "payment_requested",
        paymentStatus: "pending",
        totalCents: updatedTotal,
        customerEmail: customer.email,
        shippingName: order.shipping_name,
        customerNextStep: nextStep,
        shipmentTrackingReference: null
      });
    } catch (emailError) {
      console.error("payment requested email failed", emailError);
    }

    return NextResponse.json({
      paymentSession: {
        ...paymentSession,
        customerMessage: nextStep,
        subtotalCents: updatedSubtotal,
        shippingCents: updatedShipping,
        taxCents: updatedTax,
        totalCents: updatedTotal
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Not qualified")) {
      return NextResponse.json({ error: "Qualification required." }, { status: 403 });
    }
    if (error instanceof Error && error.message.includes("Auth failed")) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }
    if (error instanceof PaymentConfigurationError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }

    return NextResponse.json({ error: "Unknown payment error." }, { status: 500 });
  }
}
