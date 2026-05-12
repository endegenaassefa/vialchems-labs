import Link from "next/link";

import { formatOrderCurrency, getOrderStatusLabel, getPaymentStatusLabel } from "@/lib/orders";
import {
  isOpsOrderStatusFilter,
  listOpsOrders,
  ORDER_QUEUE_STATUS_OPTIONS
} from "@/lib/ops-orders";
import { requireStaffPageSession } from "@/lib/ops";

export const dynamic = "force-dynamic";

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default async function OpsOrdersPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const session = await requireStaffPageSession("/ops/orders");
  const { status, q } = await searchParams;
  const orders = await listOpsOrders(session.supabase, { status, query: q });
  const activeStatus = isOpsOrderStatusFilter(status) ? status : "all";

  return (
    <section className="grid gap-6">
      <div className="metal rounded-[22px] p-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Paid-order lane
          </p>
          <h2 className="mt-2 text-3xl font-black text-white">Fulfillment queue</h2>
          <p className="mt-3 max-w-3xl text-sm text-[var(--text-muted)]">
            Review hosted-payment orders, move them into fulfillment, and keep shipment updates inside the same ops workspace.
          </p>
        </div>

        <form className="grid gap-4 lg:grid-cols-[220px_1fr_auto]">
          <label className="grid gap-2">
            <span className="text-sm text-[var(--text-muted)]">Status</span>
            <select
              name="status"
              defaultValue={activeStatus}
              className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white"
            >
              {ORDER_QUEUE_STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All statuses" : option.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-[var(--text-muted)]">Search</span>
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Order ID, buyer name, or payment reference"
              className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white"
            />
          </label>
          <button className="mt-auto min-h-11 rounded-2xl bg-[var(--accent)] px-5 text-sm font-bold text-black">
            Apply filters
          </button>
        </form>
      </div>

      {orders.length ? (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/ops/orders/${order.id}`}
              className="metal rounded-[22px] p-5 transition hover:border-[var(--accent)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                    <span>{getOrderStatusLabel(order.status)}</span>
                    <span className="text-[var(--text-muted)]">/</span>
                    <span className="text-[var(--text-muted)]">
                      Payment {getPaymentStatusLabel(order.paymentStatus)}
                    </span>
                  </div>
                  <h2 className="mt-2 text-2xl font-black text-white">{order.shippingName}</h2>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {order.buyerName ?? "Unnamed buyer"} · {order.buyerOrganization ?? "Independent account"} · {order.buyerEmail ?? "No email"}
                  </p>
                  <p className="mt-3 text-sm text-[var(--text-muted)]">
                    {formatOrderCurrency(order.totalCents)}
                    {order.shipmentTrackingReference ? ` · Tracking ${order.shipmentTrackingReference}` : ""}
                  </p>
                </div>
                <div className="text-sm text-[var(--text-muted)]">
                  <p>Created {formatTimestamp(order.createdAt)}</p>
                  <p className="mt-1">Updated {formatTimestamp(order.updatedAt)}</p>
                  <p className="mt-4 font-mono text-xs text-white">{order.id}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="metal rounded-[22px] p-8 text-[var(--text-muted)]">
          No paid orders match the current filters.
        </div>
      )}
    </section>
  );
}
