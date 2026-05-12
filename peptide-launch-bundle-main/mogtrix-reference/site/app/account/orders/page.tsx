import Link from "next/link";

import { requireCustomerPageSession } from "@/lib/customer";
import {
  formatOrderCurrency,
  formatOrderDate,
  getCustomerOrderState
} from "@/lib/orders";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AccountOrdersPage() {
  await requireCustomerPageSession("/account/orders");
  const supabase = await createServerSupabaseClient();
  const { data: orders } = supabase
    ? await supabase
      .from("orders")
      .select("id, status, payment_status, total_cents, created_at, customer_next_step")
      .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <main className="shell py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">Account</p>
          <h1 className="mt-3 text-5xl font-black text-white">Orders</h1>
          <p className="mt-4 text-[var(--text-muted)]">
            Status first, totals second, date third. Every paid order stays here with its next operational step.
          </p>
        </div>

        {orders?.length ? (
          <section className="metal overflow-hidden rounded-[22px]">
            <div className="grid grid-cols-[1.2fr_0.9fr_0.7fr] gap-4 border-b border-[var(--border)] px-6 py-4 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              <span>Order</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="grid gap-3 px-6 py-5 transition hover:bg-white/[0.02] md:grid-cols-[1.2fr_0.9fr_0.7fr]"
                >
                  <div>
                    <p className="text-base font-bold text-white">{order.id}</p>
                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                      {formatOrderCurrency(order.total_cents)}
                    </p>
                  </div>
                  <div>
                    <p className="text-white">{getCustomerOrderState({
                      status: order.status,
                      paymentStatus: order.payment_status
                    }).label}</p>
                    {order.customer_next_step ? (
                      <p className="mt-2 text-sm text-[var(--text-muted)]">
                        {order.customer_next_step}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-sm text-[var(--text-muted)]">
                    {formatOrderDate(order.created_at)}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section className="metal rounded-[22px] p-6">
            <h2 className="text-2xl font-black text-white">No orders yet</h2>
            <p className="mt-3 text-[var(--text-muted)]">
              Once you complete a checkout, paid orders will appear here with their current status and totals.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black"
            >
              Return to shop
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
