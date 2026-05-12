import { NextResponse } from "next/server";
import { z } from "zod/v4";

import { requireQualifiedCustomer } from "@/lib/auth/customer";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1).max(50)
    })
  ).min(1),
  shippingName: z.string().trim().min(1),
  shippingAddressLine1: z.string().trim().min(1),
  shippingAddressLine2: z.string().trim().optional(),
  shippingCity: z.string().trim().min(1),
  shippingState: z.string().trim().min(1),
  shippingPostalCode: z.string().trim().min(1),
  shippingCountry: z.string().trim().min(1).default("US"),
  idempotencyKey: z.uuid()
});

export async function POST(request: Request) {
  try {
    await requireQualifiedCustomer();
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Checkout is unavailable." }, { status: 503 });
    }

    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid order input." }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_checkout_order_draft", {
      p_items: parsed.data.items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity
      })),
      p_shipping: {
        shippingName: parsed.data.shippingName,
        shippingAddressLine1: parsed.data.shippingAddressLine1,
        shippingAddressLine2: parsed.data.shippingAddressLine2,
        shippingCity: parsed.data.shippingCity,
        shippingState: parsed.data.shippingState,
        shippingPostalCode: parsed.data.shippingPostalCode,
        shippingCountry: parsed.data.shippingCountry
      },
      p_idempotency_key: parsed.data.idempotencyKey
    });

    if (error) {
      switch (error.message) {
        case "ORDER_ITEMS_REQUIRED":
        case "INVALID_ORDER_ITEMS":
          return NextResponse.json({ error: "Add at least one valid product before checkout." }, { status: 400 });
        case "INVALID_CHECKOUT_PRODUCT_IDS":
          return NextResponse.json({ error: "One or more cart items are not eligible for the hosted checkout pilot. Use the manual request path for those products." }, { status: 400 });
        case "US_ONLY_CHECKOUT":
          return NextResponse.json({ error: "The first live checkout pilot only supports US shipping addresses." }, { status: 400 });
        case "INVALID_SHIPPING_DESTINATION":
          return NextResponse.json({ error: "Complete the required US shipping fields before continuing." }, { status: 400 });
        default:
          return NextResponse.json({ error: "The order could not be created." }, { status: 500 });
      }
    }

    const result = Array.isArray(data) ? data[0] : data;
    if (!result?.id || !result?.status || !result?.payment_status || typeof result?.total_cents !== "number") {
      return NextResponse.json({ error: "The order could not be created." }, { status: 500 });
    }

    return NextResponse.json({
      id: result.id,
      status: result.status,
      paymentStatus: result.payment_status,
      totalCents: result.total_cents,
      duplicate: Boolean(result.duplicate)
    }, { status: result.duplicate ? 200 : 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Not qualified")) {
      return NextResponse.json({ error: "Qualification required." }, { status: 403 });
    }
    if (error instanceof Error && error.message.includes("Auth failed")) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Unknown checkout error." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const customer = await requireQualifiedCustomer();
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Orders are unavailable." }, { status: 503 });
    }

    const { data, error } = await supabase
      .from("orders")
      .select("id, status, payment_status, total_cents, created_at, updated_at")
      .eq("customer_id", customer.customerId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Orders could not be loaded." }, { status: 500 });
    }

    return NextResponse.json({ orders: data ?? [] });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Not qualified")) {
      return NextResponse.json({ error: "Qualification required." }, { status: 403 });
    }
    if (error instanceof Error && error.message.includes("Auth failed")) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    return NextResponse.json({ error: "Unknown order lookup error." }, { status: 500 });
  }
}
