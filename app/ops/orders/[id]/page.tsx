"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { opsFetch } from "@/components/ops/OpsAuthGate";
import { fmtAddress } from "@/lib/ops/address-display";
import { statusColor } from "@/lib/ops/status-display";
import type { OpsOrderDetail, OrderStatus } from "@/lib/ops/orders";

// Order detail page with fulfill / ship / refund forms inline. Each form
// is a separate POST to its own /api/ops/orders/[id]/<action> endpoint.
// On success we refetch the detail so the page reflects the new state.

interface DetailResponse {
  ok: true;
  order: OpsOrderDetail;
}

function fmtUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<OpsOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState(false);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await opsFetch(`/api/ops/orders/${id}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(
          `Failed to load: ${(body as { message?: string }).message ?? res.statusText}`,
        );
        return;
      }
      const data = (await res.json()) as DetailResponse;
      setOrder(data.order);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function postAction(path: string, body: unknown) {
    setActionPending(true);
    setActionError(null);
    try {
      const res = await opsFetch(path, {
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setActionError(
          `${(data as { error?: string }).error ?? "action_failed"}: ${
            (data as { message?: string }).message ?? res.statusText
          }`,
        );
        setActionPending(false);
        return false;
      }
      await refresh();
      setActionPending(false);
      return true;
    } catch (e) {
      setActionError((e as Error).message);
      setActionPending(false);
      return false;
    }
  }

  if (loading && !order) {
    return <div className="text-[var(--text-muted)]">Loading order...</div>;
  }
  if (error) {
    return <div className="text-red-700">{error}</div>;
  }
  if (!order) return null;

  const addressLines = fmtAddress(order.shippingAddressSnapshot);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/ops/orders"
          className="text-[11px] tracking-[0.24em] uppercase text-[var(--text-muted)] hover:text-[var(--accent)]"
        >
          ← Orders
        </Link>
        <div className="flex items-baseline gap-4 mt-2">
          <h1 className="text-2xl font-light font-mono">{order.displayId}</h1>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] tracking-[0.12em] uppercase ${statusColor(
              order.status,
            )}`}
          >
            {order.status.replace(/_/g, " ")}
          </span>
          {order.isTest && (
            <span className="px-2 py-0.5 rounded-full text-[11px] tracking-[0.12em] uppercase bg-amber-100 text-amber-800">
              TEST
            </span>
          )}
        </div>
      </div>

      {actionError && (
        <div className="rounded-md border border-[var(--pill-error)] bg-red-50 px-4 py-2 text-sm text-red-800">
          {actionError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer + payment */}
        <div className="rounded-[14px] border border-[var(--border)] p-5 space-y-4">
          <div>
            <div className="text-[11px] tracking-[0.24em] uppercase text-[var(--text-muted)]">
              Customer
            </div>
            <div className="font-mono text-sm mt-1">{order.email}</div>
          </div>
          <div>
            <div className="text-[11px] tracking-[0.24em] uppercase text-[var(--text-muted)]">
              Shipping address
            </div>
            {addressLines.length > 0 ? (
              <div className="text-sm mt-1 space-y-0.5">
                {addressLines.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            ) : (
              <div className="text-sm mt-1 text-[var(--text-muted)]">
                No address on file
              </div>
            )}
          </div>
          <div>
            <div className="text-[11px] tracking-[0.24em] uppercase text-[var(--text-muted)]">
              Payment
            </div>
            <div className="text-sm mt-1">
              <span className="font-mono">{order.paymentProvider}</span> ·{" "}
              {fmtUsd(order.totalCents)}
            </div>
            {order.payments.map((p) => (
              <div key={p.id} className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                {p.provider}/{p.providerIntentId} — {p.status} {fmtUsd(p.amountCents)}
              </div>
            ))}
          </div>
        </div>

        {/* Tracking + refund summary */}
        <div className="rounded-[14px] border border-[var(--border)] p-5 space-y-4">
          <div>
            <div className="text-[11px] tracking-[0.24em] uppercase text-[var(--text-muted)]">
              Shipment
            </div>
            {order.trackingNumber ? (
              <div className="font-mono text-sm mt-1">
                {order.shippedCarrier?.toUpperCase()} — {order.trackingNumber}
                <div className="text-xs text-[var(--text-muted)]">
                  Shipped {fmtDate(order.shippedAt)}
                </div>
              </div>
            ) : (
              <div className="text-sm text-[var(--text-muted)] mt-1">
                Not shipped yet
              </div>
            )}
          </div>
          <div>
            <div className="text-[11px] tracking-[0.24em] uppercase text-[var(--text-muted)]">
              Refund
            </div>
            {order.refundAmountCents ? (
              <div className="text-sm mt-1">
                {fmtUsd(order.refundAmountCents)} — {order.refundReason}
                <div className="text-xs text-[var(--text-muted)]">
                  Refunded {fmtDate(order.refundedAt)}
                </div>
              </div>
            ) : (
              <div className="text-sm text-[var(--text-muted)] mt-1">None</div>
            )}
          </div>
          <div>
            <div className="text-[11px] tracking-[0.24em] uppercase text-[var(--text-muted)]">
              Lifecycle
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1 space-y-0.5 font-mono">
              <div>placed: {fmtDate(order.placedAt)}</div>
              <div>fulfilled: {fmtDate(order.fulfilledAt)}</div>
              <div>shipped: {fmtDate(order.shippedAt)}</div>
              <div>delivered: {fmtDate(order.deliveredAt)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-[14px] border border-[var(--border)] overflow-hidden">
        <div className="px-5 py-3 text-[11px] tracking-[0.24em] uppercase text-[var(--text-muted)] border-b border-[var(--border)]">
          Items
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] tracking-[0.16em] uppercase text-[var(--text-muted)]">
              <th className="text-left px-5 py-2">SKU</th>
              <th className="text-left px-5 py-2">Name</th>
              <th className="text-left px-5 py-2">Qty</th>
              <th className="text-left px-5 py-2">Unit</th>
              <th className="text-left px-5 py-2">Line</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((it) => (
              <tr key={it.id} className="border-t border-[var(--border)]">
                <td className="px-5 py-2 font-mono text-xs">{it.sku}</td>
                <td className="px-5 py-2">{it.nameSnapshot}</td>
                <td className="px-5 py-2 font-mono">{it.quantity}</td>
                <td className="px-5 py-2 font-mono">{fmtUsd(it.unitPriceCents)}</td>
                <td className="px-5 py-2 font-mono">
                  {fmtUsd(it.unitPriceCents * it.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action panels — visible based on current status */}
      <FulfillmentPanel
        order={order}
        actionPending={actionPending}
        onMarkPaid={() =>
          postAction(`/api/ops/payments/manual/confirm`, {
            displayId: order.displayId,
          })
        }
        onFulfill={() =>
          postAction(`/api/ops/orders/${order.id}/fulfill`, {
            expectedStatus: order.status,
          })
        }
        onShip={(trackingNumber, carrier) =>
          postAction(`/api/ops/orders/${order.id}/ship`, {
            expectedStatus: order.status,
            trackingNumber,
            carrier,
          })
        }
        onShipShippo={() =>
          postAction(`/api/ops/orders/${order.id}/ship`, {
            expectedStatus: order.status,
            shippoPurchase: true,
          })
        }
        onRefund={(amountCents, reason) =>
          postAction(`/api/ops/orders/${order.id}/refund`, {
            expectedStatus: order.status,
            amountCents,
            reason,
          })
        }
      />

      {/* Audit history */}
      <div className="rounded-[14px] border border-[var(--border)] p-5">
        <div className="text-[11px] tracking-[0.24em] uppercase text-[var(--text-muted)] mb-3">
          Status history
        </div>
        <ol className="space-y-1 text-xs font-mono text-[var(--text-muted)]">
          {order.history.length === 0 && <li>No transitions recorded.</li>}
          {order.history.map((h) => (
            <li key={h.id}>
              {fmtDate(h.changedAt)} — {h.fromStatus ?? "(initial)"} → {h.toStatus}
              {h.reason ? ` (${h.reason})` : ""}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function FulfillmentPanel({
  order,
  actionPending,
  onMarkPaid,
  onFulfill,
  onShip,
  onShipShippo,
  onRefund,
}: {
  order: OpsOrderDetail;
  actionPending: boolean;
  onMarkPaid: () => Promise<boolean>;
  onFulfill: () => Promise<boolean>;
  onShip: (trackingNumber: string, carrier: string) => Promise<boolean>;
  onShipShippo: () => Promise<boolean>;
  onRefund: (amountCents: number, reason: string) => Promise<boolean>;
}) {
  const status: OrderStatus = order.status;
  const canMarkPaid = status === "awaiting_payment";
  const isZelle = order.paymentProvider === "zelle";
  const canFulfill = status === "paid";
  const canShip = status === "fulfilled";
  const canRefund =
    status === "paid" ||
    status === "fulfilled" ||
    status === "shipped" ||
    status === "delivered";

  return (
    <div className="space-y-4">
      {canMarkPaid && isZelle && (
        <div className="rounded-[14px] border border-[var(--border)] p-5 space-y-3">
          <div className="text-[11px] tracking-[0.24em] uppercase text-[var(--text-muted)]">
            Confirm payment received
          </div>
          <div className="text-sm text-[var(--text-muted)]">
            This customer chose Zelle. Once their transfer lands in the bank
            account (memo:{" "}
            <span className="font-mono text-[var(--text)]">
              {order.displayId}
            </span>
            ), confirm it here to move the order to Paid.
          </div>
          <button
            type="button"
            disabled={actionPending}
            onClick={() => onMarkPaid()}
            className="px-4 py-2 rounded-md bg-[var(--accent)] text-white text-sm uppercase tracking-[0.16em] disabled:opacity-50"
          >
            {actionPending ? "Working..." : "Mark payment received"}
          </button>
        </div>
      )}
      {canMarkPaid && !isZelle && (
        <div className="rounded-[14px] border border-[var(--border)] p-5 text-sm text-[var(--text-muted)]">
          Awaiting payment via {order.paymentProvider}. This order moves to Paid
          automatically when the payment webhook confirms the transfer.
        </div>
      )}
      {canFulfill && (
        <div className="rounded-[14px] border border-[var(--border)] p-5">
          <div className="text-[11px] tracking-[0.24em] uppercase text-[var(--text-muted)] mb-3">
            Mark fulfilled
          </div>
          <button
            type="button"
            disabled={actionPending}
            onClick={() => onFulfill()}
            className="px-4 py-2 rounded-md bg-[var(--accent)] text-white text-sm uppercase tracking-[0.16em] disabled:opacity-50"
          >
            {actionPending ? "Working..." : "Mark fulfilled"}
          </button>
        </div>
      )}

      {canShip && (
        <ShipForm onShip={onShip} onShipShippo={onShipShippo} pending={actionPending} />
      )}
      {canRefund && (
        <RefundForm
          totalCents={order.totalCents}
          onRefund={onRefund}
          pending={actionPending}
        />
      )}

      {status === "shipped" && (
        <div className="rounded-[14px] border border-[var(--border)] p-5 text-sm text-[var(--text-muted)]">
          Order is shipped. Delivery status will update automatically when the
          Shippo webhook receives a DELIVERED event.
        </div>
      )}
      {(status === "delivered" || status === "cancelled" || status === "refunded") && (
        <div className="rounded-[14px] border border-[var(--border)] p-5 text-sm text-[var(--text-muted)]">
          Order is in a terminal state ({status}). No further actions available.
        </div>
      )}
    </div>
  );
}

function ShipForm({
  onShip,
  onShipShippo,
  pending,
}: {
  onShip: (trackingNumber: string, carrier: string) => Promise<boolean>;
  onShipShippo: () => Promise<boolean>;
  pending: boolean;
}) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("usps");

  return (
    <div className="space-y-3">
      {/* One-click Shippo label-buy */}
      <div className="rounded-[14px] border border-[var(--border)] p-5 space-y-3 bg-[var(--accent-soft)]">
        <div className="text-[11px] tracking-[0.24em] uppercase text-[var(--text-muted)]">
          Buy label via Shippo
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={onShipShippo}
          className="px-4 py-2 rounded-md bg-[var(--accent)] text-white text-sm uppercase tracking-[0.16em] disabled:opacity-50"
        >
          {pending ? "Working..." : "Buy cheapest USPS label + mark shipped"}
        </button>
        <div className="text-xs text-[var(--text-muted)]">
          Auto-picks the cheapest USPS rate, buys the label, marks shipped,
          and emails the customer. Requires SHIPPING_FROM_* + SHIPPO_API_KEY
          in env. The label PDF URL appears in the audit log.
        </div>
      </div>

      {/* Manual entry path */}
      <div className="rounded-[14px] border border-[var(--border)] p-5 space-y-3">
        <div className="text-[11px] tracking-[0.24em] uppercase text-[var(--text-muted)]">
          Or paste tracking manually (Pirate Ship, etc.)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 items-end">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Tracking number"
            className="px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--surface)] font-mono text-sm"
          />
          <select
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            className="px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--surface)] text-sm"
          >
            <option value="usps">USPS</option>
            <option value="ups">UPS</option>
            <option value="fedex">FedEx</option>
            <option value="dhl">DHL</option>
            <option value="other">Other</option>
          </select>
          <button
            type="button"
            disabled={pending || !trackingNumber.trim()}
            onClick={() => onShip(trackingNumber.trim(), carrier)}
            className="px-4 py-2 rounded-md border border-[var(--accent)] text-[var(--accent)] text-sm uppercase tracking-[0.16em] disabled:opacity-50"
          >
            {pending ? "Working..." : "Mark shipped"}
          </button>
        </div>
        <div className="text-xs text-[var(--text-muted)]">
          Customer gets a tracking email automatically. Test orders divert
          to ORDER_TEST_INBOX.
        </div>
      </div>
    </div>
  );
}

function RefundForm({
  totalCents,
  onRefund,
  pending,
}: {
  totalCents: number;
  onRefund: (amountCents: number, reason: string) => Promise<boolean>;
  pending: boolean;
}) {
  const [amountDollars, setAmountDollars] = useState((totalCents / 100).toFixed(2));
  const [reason, setReason] = useState("");

  const cents = Math.round(parseFloat(amountDollars || "0") * 100);
  const valid = cents > 0 && cents <= totalCents && reason.trim().length > 0;

  return (
    <div className="rounded-[14px] border border-rose-200 p-5 space-y-3">
      <div className="text-[11px] tracking-[0.24em] uppercase text-rose-800">
        Refund
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr_auto] gap-2 items-end">
        <div>
          <label className="block text-[11px] tracking-[0.16em] uppercase text-[var(--text-muted)] mb-1">
            Amount (USD)
          </label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            max={(totalCents / 100).toFixed(2)}
            value={amountDollars}
            onChange={(e) => setAmountDollars(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--surface)] font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-[11px] tracking-[0.16em] uppercase text-[var(--text-muted)] mb-1">
            Reason
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Customer request, defective, etc."
            className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--surface)] text-sm"
          />
        </div>
        <button
          type="button"
          disabled={pending || !valid}
          onClick={() => onRefund(cents, reason.trim())}
          className="px-4 py-2 rounded-md bg-rose-600 text-white text-sm uppercase tracking-[0.16em] disabled:opacity-50"
        >
          {pending ? "Working..." : "Refund"}
        </button>
      </div>
      <div className="text-xs text-[var(--text-muted)]">
        Records the refund in the system. You still need to push the money
        back via Zelle/Plaid/BTCPay manually. Max refund: ${(totalCents / 100).toFixed(2)}.
      </div>
    </div>
  );
}
