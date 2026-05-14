/**
 * Phase A — seed 20 test orders covering every order status.
 *
 * Usage:
 *   npx tsx scripts/seed-test-orders.ts
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_DB_URL via PG) in .env.
 * Migrations 20260510000001_init.sql + 20260513000001_phase_A_order_admin.sql
 * must be applied first.
 *
 * Every row inserted has is_test=true (parent), and the inheritance triggers
 * from migration 20260513000001 propagate that flag to child rows
 * (order_items / order_status_history / payments / audit_log). RLS keeps
 * test rows invisible to authenticated/anon customers; only ops admin
 * (service role) sees them, and only when "Show test orders" is toggled on.
 *
 * Re-running is safe — display_id values start with TEST-SEED-* and are
 * unique. The script first deletes any prior TEST-SEED-* orders before
 * re-inserting (uses ON DELETE CASCADE for items + history + payments).
 *
 * The 20 orders break down as:
 *   3 × pending
 *   4 × awaiting_payment
 *   3 × paid
 *   2 × fulfilled
 *   3 × shipped (with tracking + carrier)
 *   2 × delivered
 *   1 × cancelled
 *   1 × refunded (full)
 *   1 × jurisdictional_rejected
 *   = 20 total
 */
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

interface SeedItem {
  sku: string;
  slug: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
}

interface SeedOrder {
  displayId: string;
  status:
    | "pending"
    | "awaiting_payment"
    | "paid"
    | "fulfilled"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded"
    | "jurisdictional_rejected";
  email: string;
  paymentProvider: "stub" | "btcpay" | "plaid" | "zelle";
  items: SeedItem[];
  // Shipping fields filled only for shipped / delivered.
  trackingNumber?: string;
  carrier?: "usps" | "ups" | "fedex" | "dhl" | "other";
  shippoTransactionId?: string;
  // Refund fields filled only for refunded.
  refundAmountCents?: number;
  refundReason?: string;
  paymentStatus?: "pending" | "authorized" | "paid" | "failed" | "refunded";
}

const SAMPLE_ITEMS: SeedItem[] = [
  {
    sku: "BPC-157-10MG",
    slug: "bpc-157-10mg",
    name: "BPC-157, 10mg vial",
    unitPriceCents: 5400,
    quantity: 1,
  },
  {
    sku: "TB-500-5MG",
    slug: "tb-500-5mg",
    name: "TB-500, 5mg vial",
    unitPriceCents: 6900,
    quantity: 1,
  },
  {
    sku: "GHK-CU-50MG",
    slug: "ghk-cu-50mg",
    name: "GHK-Cu, 50mg vial",
    unitPriceCents: 4800,
    quantity: 1,
  },
  {
    sku: "IPAMORELIN-10MG",
    slug: "ipamorelin-10mg",
    name: "Ipamorelin, 10mg vial",
    unitPriceCents: 4200,
    quantity: 1,
  },
];

function pickItems(seed: number, n: number): SeedItem[] {
  const result: SeedItem[] = [];
  for (let i = 0; i < n; i++) {
    const item = SAMPLE_ITEMS[(seed + i) % SAMPLE_ITEMS.length];
    result.push({ ...item, quantity: 1 + (i % 2) });
  }
  return result;
}

function buildOrders(): SeedOrder[] {
  const base = (n: number, status: SeedOrder["status"]): SeedOrder => ({
    displayId: `TEST-SEED-${String(n).padStart(4, "0")}`,
    status,
    email: `test-seed-${n}@vialchems.test`,
    paymentProvider: n % 3 === 0 ? "btcpay" : n % 3 === 1 ? "plaid" : "stub",
    items: pickItems(n, 1 + (n % 3)),
  });

  const orders: SeedOrder[] = [];

  for (let i = 1; i <= 3; i++) orders.push({ ...base(i, "pending"), paymentStatus: "pending" });
  for (let i = 4; i <= 7; i++)
    orders.push({ ...base(i, "awaiting_payment"), paymentStatus: "authorized" });
  for (let i = 8; i <= 10; i++)
    orders.push({ ...base(i, "paid"), paymentStatus: "paid" });
  for (let i = 11; i <= 12; i++)
    orders.push({ ...base(i, "fulfilled"), paymentStatus: "paid" });
  for (let i = 13; i <= 15; i++)
    orders.push({
      ...base(i, "shipped"),
      paymentStatus: "paid",
      trackingNumber: `9400111899223334445${(566 + i).toString().padStart(3, "0")}`,
      carrier: i % 2 === 0 ? "usps" : "ups",
      shippoTransactionId: `test_seed_shippo_${i}`,
    });
  for (let i = 16; i <= 17; i++)
    orders.push({
      ...base(i, "delivered"),
      paymentStatus: "paid",
      trackingNumber: `9400111899223334445${(570 + i).toString().padStart(3, "0")}`,
      carrier: "usps",
      shippoTransactionId: `test_seed_shippo_${i}`,
    });
  orders.push({ ...base(18, "cancelled"), paymentStatus: "pending" });
  orders.push({
    ...base(19, "refunded"),
    paymentStatus: "refunded",
    trackingNumber: "9400111899223334445588",
    carrier: "usps",
    refundAmountCents: 0, // computed from totals below
    refundReason: "test seed — full refund",
  });
  orders.push({ ...base(20, "jurisdictional_rejected"), paymentStatus: "failed" });

  return orders;
}

function sumLines(items: SeedItem[]): number {
  return items.reduce((acc, i) => acc + i.unitPriceCents * i.quantity, 0);
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error(
      "ERROR: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.",
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  console.log("Cleaning previous TEST-SEED-* orders...");
  // Cascade deletes order_items, order_status_history, payments.
  const { error: delError } = await supabase
    .from("orders")
    .delete()
    .like("display_id", "TEST-SEED-%");
  if (delError) {
    console.error(`Cleanup failed: ${delError.message}`);
    process.exit(1);
  }

  const orders = buildOrders();
  console.log(`Seeding ${orders.length} test orders...`);

  for (const order of orders) {
    const subtotal = sumLines(order.items);
    const shipping = order.status === "jurisdictional_rejected" ? 0 : 1500;
    const total = subtotal + shipping;
    const orderId = randomUUID();
    const refundAmount =
      order.status === "refunded"
        ? order.refundAmountCents && order.refundAmountCents > 0
          ? order.refundAmountCents
          : total
        : null;

    const orderRow: Record<string, unknown> = {
      id: orderId,
      display_id: order.displayId,
      email: order.email,
      shipping_address_snapshot: {
        name: `Test Customer ${order.displayId}`,
        street1: "1 Lab Way",
        city: "Madison",
        state: "WI",
        zip: "53703",
        country: "US",
        email: order.email,
      },
      status: order.status,
      payment_provider: order.paymentProvider,
      subtotal_cents: subtotal,
      discount_cents: 0,
      shipping_cents: shipping,
      total_cents: total,
      placed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      is_test: true,
    };

    if (order.status === "fulfilled" || order.status === "shipped" || order.status === "delivered" || order.status === "refunded") {
      orderRow.fulfilled_at = new Date(
        Date.now() - 1000 * 60 * 60 * 24 * 2,
      ).toISOString();
    }
    if (order.trackingNumber) {
      orderRow.tracking_number = order.trackingNumber;
      orderRow.shipped_carrier = order.carrier;
      orderRow.shippo_transaction_id = order.shippoTransactionId;
      orderRow.shipped_at = new Date(
        Date.now() - 1000 * 60 * 60 * 24,
      ).toISOString();
    }
    if (order.status === "delivered") {
      orderRow.delivered_at = new Date(Date.now() - 1000 * 60 * 30).toISOString();
    }
    if (order.status === "cancelled") {
      orderRow.cancelled_at = new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString();
    }
    if (refundAmount !== null) {
      orderRow.refund_amount_cents = refundAmount;
      orderRow.refund_reason = order.refundReason;
      orderRow.refunded_at = new Date(Date.now() - 1000 * 60 * 60).toISOString();
    }
    if (order.status === "jurisdictional_rejected") {
      orderRow.jurisdictional_rejected_at = new Date(
        Date.now() - 1000 * 60 * 60 * 24 * 3,
      ).toISOString();
    }

    const { error: insertError } = await supabase.from("orders").insert(orderRow);
    if (insertError) {
      console.error(
        `  ${order.displayId} (${order.status}) — FAILED: ${insertError.message}`,
      );
      continue;
    }

    // Insert items (trigger inherits is_test).
    const itemRows = order.items.map((it) => ({
      order_id: orderId,
      sku: it.sku,
      slug: it.slug,
      name_snapshot: it.name,
      unit_price_cents: it.unitPriceCents,
      quantity: it.quantity,
    }));
    const { error: itemsError } = await supabase.from("order_items").insert(itemRows);
    if (itemsError) {
      console.error(`  ${order.displayId} items: ${itemsError.message}`);
    }

    // Insert a payment row (trigger inherits is_test).
    if (order.paymentStatus) {
      const { error: payError } = await supabase.from("payments").insert({
        order_id: orderId,
        provider: order.paymentProvider,
        provider_intent_id: `test_seed_${order.displayId}_${order.paymentProvider}`,
        status: order.paymentStatus,
        amount_cents: total,
        currency: "USD",
      });
      if (payError) {
        console.error(`  ${order.displayId} payment: ${payError.message}`);
      }
    }

    // Insert a single audit-log entry marking this as seeded.
    await supabase.from("audit_log").insert({
      event_type: "order.placed",
      order_id: orderId,
      details: {
        seeded: true,
        seed_script: "scripts/seed-test-orders.ts",
        status: order.status,
      },
    });

    console.log(`  ${order.displayId} (${order.status}) — total $${(total / 100).toFixed(2)}`);
  }

  console.log("\nDone. Open /ops/orders and toggle 'Show test orders' to view.");
}

main().catch((err) => {
  console.error("seed_failed:", err);
  process.exit(1);
});
