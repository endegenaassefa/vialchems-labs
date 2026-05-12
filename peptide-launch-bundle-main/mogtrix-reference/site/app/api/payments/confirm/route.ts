import { NextResponse } from "next/server";
import { z } from "zod/v4";

import { requireQualifiedCustomer } from "@/lib/auth/customer";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const schema = z.object({
  orderId: z.string().min(1)
});

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

    const { data: order, error } = await supabase
      .from("orders")
      .select("id, customer_id, status, payment_status, external_payment_url")
      .eq("id", parsed.data.orderId)
      .eq("customer_id", customer.customerId)
      .maybeSingle();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (["paid", "processing", "shipped", "completed", "delivered"].includes(order.status)) {
      return NextResponse.json({
        orderId: order.id,
        status: order.status,
        paymentStatus: order.payment_status
      });
    }

    return NextResponse.json({
      error: "Payment confirmation now happens automatically after the hosted payment provider sends its webhook.",
      orderId: order.id,
      status: order.status,
      paymentStatus: order.payment_status,
      hostedUrl: order.external_payment_url
    }, { status: 409 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Not qualified")) {
      return NextResponse.json({ error: "Qualification required." }, { status: 403 });
    }
    if (error instanceof Error && error.message.includes("Auth failed")) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    return NextResponse.json({ error: "Unknown payment confirmation error." }, { status: 500 });
  }
}
