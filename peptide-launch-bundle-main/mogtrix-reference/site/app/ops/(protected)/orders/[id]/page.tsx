import Link from "next/link";
import { notFound } from "next/navigation";

import { OpsOrderNoteForm } from "@/components/ops-order-note-form";
import { OpsOrderShipmentForm } from "@/components/ops-order-shipment-form";
import { OpsOrderStatusForm } from "@/components/ops-order-status-form";
import {
  formatOrderCurrency,
  formatOrderDate,
  getOrderStatusLabel,
  getPaymentStatusLabel
} from "@/lib/orders";
import { getOpsOrderDetail } from "@/lib/ops-orders";
import { requireStaffPageSession } from "@/lib/ops";

export const dynamic = "force-dynamic";

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default async function OpsOrderDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireStaffPageSession(`/ops/orders/${id}`);
  const order = await getOpsOrderDetail(session.supabase, id);

  if (!order) {
    notFound();
  }

  return (
    <section className="grid gap-6">
      <div className="metal rounded-[22px] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase text-[var(--accent)]">
              {getOrderStatusLabel(order.status)} · Payment {getPaymentStatusLabel(order.paymentStatus)}
            </p>
            <h1 className="mt-2 text-4xl font-black text-white">{order.shippingName}</h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {order.buyerName ?? "Unnamed buyer"} · {order.buyerOrganization ?? "Independent account"} · {order.buyerEmail ?? "No email"}
            </p>
            <p className="mt-4 max-w-4xl text-[var(--text-muted)]">
              {order.customerNextStep ?? "No customer-facing next step saved for this order yet."}
            </p>
          </div>
          <div className="text-sm text-[var(--text-muted)]">
            <p>Created {formatTimestamp(order.createdAt)}</p>
            <p className="mt-1">Updated {formatTimestamp(order.updatedAt)}</p>
            {order.paidAt ? <p className="mt-1">Paid {formatTimestamp(order.paidAt)}</p> : null}
            {order.shippedAt ? <p className="mt-1">Shipped {formatTimestamp(order.shippedAt)}</p> : null}
            <p className="mt-4 font-mono text-xs text-white">{order.id}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-6">
          <div className="metal rounded-[22px] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">Buyer and payment</h2>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Hosted payment reference, internal status, and order total.
                </p>
              </div>
              <Link
                href="/ops/orders"
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-white hover:border-[var(--accent)]"
              >
                Back to orders
              </Link>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-[var(--border)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Buyer</p>
                <p className="mt-2 text-white">{order.buyerName ?? order.shippingName}</p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{order.buyerEmail ?? "No email"}</p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{order.buyerOrganization ?? "Independent account"}</p>
              </article>
              <article className="rounded-2xl border border-[var(--border)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Payment</p>
                <p className="mt-2 text-white">{getPaymentStatusLabel(order.paymentStatus)}</p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Provider {order.paymentProvider ?? "Stub adapter"}
                </p>
                <p className="mt-2 text-sm text-[var(--text-muted)] break-all">
                  Ref {order.externalPaymentReference ?? "Unavailable"}
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {formatOrderCurrency(order.totalCents)}
                </p>
              </article>
            </div>
          </div>

          <div className="metal rounded-[22px] p-6">
            <h2 className="text-2xl font-black text-white">Items</h2>
            <div className="mt-5 grid gap-4">
              {order.items.map((item) => (
                <article key={item.productId} className="rounded-2xl border border-[var(--border)] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-[var(--accent)]">{item.productSku}</p>
                      <h3 className="mt-1 text-lg font-bold text-white">{item.productName}</h3>
                      <p className="mt-2 text-sm text-[var(--text-muted)]">
                        {item.quantity} × {formatOrderCurrency(item.priceCents)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {formatOrderCurrency(item.priceCents * item.quantity)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="metal rounded-[22px] p-6">
            <h2 className="text-2xl font-black text-white">Status history</h2>
            <div className="mt-5 grid gap-4">
              {order.history.length ? order.history.map((entry) => (
                <article key={entry.id} className="rounded-2xl border border-[var(--border)] p-4">
                  <p className="text-sm font-semibold text-white">
                    {entry.previousStatus ? `${getOrderStatusLabel(entry.previousStatus)} → ` : ""}
                    {getOrderStatusLabel(entry.nextStatus)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {entry.actorType} · {formatTimestamp(entry.createdAt)}
                  </p>
                  {entry.note ? <p className="mt-3 text-sm text-[var(--text-muted)]">{entry.note}</p> : null}
                </article>
              )) : (
                <p className="text-sm text-[var(--text-muted)]">No order history yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="metal rounded-[22px] p-6">
            <h2 className="text-2xl font-black text-white">Shipping</h2>
            <div className="mt-5 rounded-2xl border border-[var(--border)] p-4 text-sm leading-7 text-[var(--text-muted)]">
              <p className="font-semibold text-white">{order.shippingName}</p>
              <p>{order.shippingAddressLine1}</p>
              {order.shippingAddressLine2 ? <p>{order.shippingAddressLine2}</p> : null}
              <p>
                {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
              </p>
              <p>{order.shippingCountry}</p>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-[var(--text-muted)]">
              <p>Subtotal {formatOrderCurrency(order.subtotalCents)}</p>
              <p>Shipping {formatOrderCurrency(order.shippingCents)}</p>
              <p>Tax {formatOrderCurrency(order.taxCents)}</p>
              {order.shipmentTrackingReference ? (
                <p>Tracking {order.shipmentTrackingReference}</p>
              ) : null}
            </div>
          </div>

          <div className="metal rounded-[22px] p-6">
            <h2 className="text-2xl font-black text-white">Update status</h2>
            <div className="mt-5">
              <OpsOrderStatusForm orderId={order.id} currentStatus={order.status} />
            </div>
          </div>

          <div className="metal rounded-[22px] p-6">
            <h2 className="text-2xl font-black text-white">Shipment and tracking</h2>
            <div className="mt-5">
              <OpsOrderShipmentForm
                orderId={order.id}
                trackingReference={order.shipmentTrackingReference}
                trackingUrl={order.shipmentTrackingUrl}
                shipmentNote={order.shipmentNote}
              />
            </div>
          </div>

          <div className="metal rounded-[22px] p-6">
            <h2 className="text-2xl font-black text-white">Internal notes</h2>
            <div className="mt-5">
              <OpsOrderNoteForm orderId={order.id} />
            </div>
            <div className="mt-5 grid gap-4">
              {order.notes.length ? order.notes.map((note) => (
                <article key={note.id} className="rounded-2xl border border-[var(--border)] p-4">
                  <p className="text-sm text-white">{note.body}</p>
                  <p className="mt-3 text-xs text-[var(--text-muted)]">
                    {note.authorName ?? note.authorEmail ?? note.authorProfileId} · {formatTimestamp(note.createdAt)}
                  </p>
                </article>
              )) : (
                <p className="text-sm text-[var(--text-muted)]">No internal notes yet.</p>
              )}
            </div>
          </div>

          <div className="metal rounded-[22px] p-6 text-sm text-[var(--text-muted)]">
            <p><strong className="text-white">Customer-facing state:</strong> {order.customerNextStep ?? "Unavailable"}</p>
            {order.externalPaymentUrl ? (
              <p className="mt-2 break-all">
                <strong className="text-white">Hosted payment URL:</strong> {order.externalPaymentUrl}
              </p>
            ) : null}
            {order.completedAt ? (
              <p className="mt-2">
                <strong className="text-white">Completed:</strong> {formatOrderDate(order.completedAt)}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
