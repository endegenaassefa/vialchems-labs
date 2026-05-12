import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderRefreshPoller } from "@/components/order-refresh-poller";
import { requireCustomerPageSession } from "@/lib/customer";
import {
  getCustomerOrderState,
  formatOrderCurrency,
  formatOrderDate,
  getOrderStatusLabel,
  getPaymentStatusLabel
} from "@/lib/orders";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AccountOrderDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { id } = await params;
  const { status } = await searchParams;
  await requireCustomerPageSession(`/account/orders/${id}`);
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    notFound();
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, status, payment_status, total_cents, subtotal_cents, tax_cents, shipping_cents, shipping_name, shipping_address_line1, shipping_address_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country, created_at, updated_at, paid_at, completed_at, payment_provider, payment_method_summary, external_payment_url, customer_next_step, shipment_tracking_reference, shipment_tracking_url, shipment_note")
    .eq("id", id)
    .maybeSingle();

  if (orderError || !order) {
    notFound();
  }

  const [{ data: items }, { data: history }] = await Promise.all([
    supabase
      .from("order_items")
      .select("product_id, product_sku, product_name, price_cents, quantity")
      .eq("order_id", id),
    supabase
      .from("order_status_history")
      .select("id, previous_status, next_status, actor_type, note, created_at")
      .eq("order_id", id)
      .order("created_at", { ascending: false })
  ]);
  const customerState = getCustomerOrderState({
    status: order.status,
    paymentStatus: order.payment_status
  });
  const awaitingPaymentConfirmation = ["payment_requested", "payment_pending", "pending_payment"].includes(order.status);

  return (
    <main className="shell py-16">
      <div className="mx-auto max-w-5xl">
        <OrderRefreshPoller active={awaitingPaymentConfirmation} />

        {status === "paid" ? (
          <div className="mb-6 rounded-[22px] border border-[#31583a] bg-[#071b0d] p-4 text-sm text-[#b8f6c4]">
            Payment succeeded. Order {id} is now in your account history.
          </div>
        ) : null}
        {status === "payment_pending" ? (
          <div className="mb-6 rounded-[22px] border border-[var(--border)] bg-black/20 p-4 text-sm text-[var(--text-muted)]">
            Payment return received. This page will refresh for a short window while the hosted payment webhook updates the order.
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="space-y-6">
            <article className="metal rounded-[28px] p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Order workspace
              </p>
              <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-5xl font-black text-white">{order.id}</h1>
                  <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
                    Created {formatOrderDate(order.created_at)}. Payment is
                    {` ${getPaymentStatusLabel(order.payment_status).toLowerCase()}`}
                    {" "}and the operational order state is
                    {` ${getOrderStatusLabel(order.status).toLowerCase()}`}.
                  </p>
                </div>
                <div className="rounded-[22px] border border-[var(--border)] px-5 py-4 text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Total</p>
                  <p className="mt-2 text-2xl font-black text-white">
                    {formatOrderCurrency(order.total_cents)}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[18px] border border-[var(--border)] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Account status</p>
                  <p className="mt-2 text-white">{customerState.label}</p>
                </div>
                <div className="rounded-[18px] border border-[var(--border)] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Payment</p>
                  <p className="mt-2 text-white">{getPaymentStatusLabel(order.payment_status)}</p>
                </div>
                <div className="rounded-[18px] border border-[var(--border)] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Internal state</p>
                  <p className="mt-2 text-white">{getOrderStatusLabel(order.status)}</p>
                </div>
              </div>

              <div className="mt-5 rounded-[20px] border border-[var(--border)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Next step</p>
                <p className="mt-2 text-sm leading-7 text-white">
                  {order.customer_next_step ?? "Return here for the latest order updates."}
                </p>
                {order.external_payment_url && awaitingPaymentConfirmation ? (
                  <Link
                    href={order.external_payment_url}
                    className="mt-4 inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-white hover:border-[var(--accent)]"
                  >
                    Reopen hosted payment
                  </Link>
                ) : null}
              </div>
            </article>

            <article className="metal rounded-[28px] p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                    Line items
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">
                    What is in this order?
                  </h2>
                </div>
                <Link
                  href="/account/orders"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-white hover:border-[var(--accent)]"
                >
                  Back to orders
                </Link>
              </div>

              <div className="mt-5 grid gap-4">
                {items?.map((item) => (
                  <div
                    key={`${item.product_id}-${item.product_sku}`}
                    className="rounded-[20px] border border-[var(--border)] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                          {item.product_sku}
                        </p>
                        <p className="mt-2 text-lg font-bold text-white">
                          {item.product_name}
                        </p>
                        <p className="mt-2 text-sm text-[var(--text-muted)]">
                          Qty {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-white">
                        {formatOrderCurrency(item.price_cents * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="space-y-6">
            <article className="metal rounded-[28px] p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Shipping
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">Destination</h2>
              <div className="mt-5 rounded-[20px] border border-[var(--border)] p-4 text-sm leading-7 text-[var(--text-muted)]">
                <p className="font-semibold text-white">{order.shipping_name}</p>
                <p>{order.shipping_address_line1}</p>
                {order.shipping_address_line2 ? <p>{order.shipping_address_line2}</p> : null}
                <p>
                  {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
                </p>
                <p>{order.shipping_country}</p>
              </div>

              <div className="mt-5 grid gap-3 text-sm text-[var(--text-muted)]">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">{formatOrderCurrency(order.subtotal_cents)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="text-white">{formatOrderCurrency(order.shipping_cents)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span className="text-white">{formatOrderCurrency(order.tax_cents)}</span>
                </div>
              </div>

              {(order.shipment_tracking_reference || order.shipment_note || order.completed_at) ? (
                <div className="mt-6 rounded-[20px] border border-[var(--border)] p-4 text-sm text-[var(--text-muted)]">
                  {order.shipment_tracking_reference ? (
                    <p>
                      <strong className="text-white">Tracking:</strong>{" "}
                      {order.shipment_tracking_url ? (
                        <Link href={order.shipment_tracking_url} className="text-[var(--accent)] underline">
                          {order.shipment_tracking_reference}
                        </Link>
                      ) : (
                        order.shipment_tracking_reference
                      )}
                    </p>
                  ) : null}
                  {order.shipment_note ? (
                    <p className={order.shipment_tracking_reference ? "mt-2" : ""}>
                      <strong className="text-white">Shipment note:</strong> {order.shipment_note}
                    </p>
                  ) : null}
                  {order.completed_at ? (
                    <p className={order.shipment_tracking_reference || order.shipment_note ? "mt-2" : ""}>
                      <strong className="text-white">Completed:</strong> {formatOrderDate(order.completed_at)}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </article>

            <article className="metal rounded-[28px] p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Timeline
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">Status history</h2>
              <div className="mt-5 grid gap-4">
                {history?.length ? (
                  history.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-[20px] border border-[var(--border)] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-white">{getOrderStatusLabel(entry.next_status)}</p>
                          {entry.note ? (
                            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                              {entry.note}
                            </p>
                          ) : null}
                        </div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                          {formatOrderDate(entry.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[20px] border border-[var(--border)] p-4 text-sm text-[var(--text-muted)]">
                    Timeline updates will appear here as the order moves through payment and fulfillment.
                  </div>
                )}
              </div>
            </article>
          </section>
        </div>
      </div>
    </main>
  );
}
