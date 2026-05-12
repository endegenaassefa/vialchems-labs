"use client";

import { formatOrderCurrency } from "@/lib/orders";
import type { HostedPaymentSession } from "@/lib/payments";

export function PaymentStep({
  orderId,
  paymentSession,
  subtotalCents,
  shippingCents,
  taxCents,
  totalCents,
  processing,
  error,
  onSubmit
}: {
  orderId: string | null;
  paymentSession: HostedPaymentSession | null;
  subtotalCents: number;
  shippingCents?: number | null;
  taxCents?: number | null;
  totalCents?: number | null;
  processing: boolean;
  error: string | null;
  onSubmit: () => void;
}) {
  const finalTotalReady = typeof totalCents === "number";

  return (
    <section className="metal rounded-[28px] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
        Payment
      </p>
      <h2 className="mt-2 text-3xl font-black text-white">
        Hosted payment handoff
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
        Pilot checkout uses a hosted payment handoff for selected SKUs and US-only
        shipping. Final shipping and tax are locked by the payment provider before
        payment is submitted, and your account order record updates by webhook after
        the return.
      </p>

      <div className="mt-5 rounded-[22px] border border-[var(--border)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Order
            </p>
            <p className="mt-2 text-lg font-bold text-white">
              {orderId ?? "Preparing order..."}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Total due
            </p>
            <p className="mt-2 text-xl font-black text-white">
              {finalTotalReady
                ? formatOrderCurrency(totalCents)
                : "Prepared in secure checkout"}
            </p>
          </div>
        </div>

        <dl className="mt-5 grid gap-3 text-sm text-[var(--text-muted)]">
          <div className="flex items-center justify-between rounded-[18px] border border-[var(--border)] p-4">
            <dt>Subtotal</dt>
            <dd className="text-white">{formatOrderCurrency(subtotalCents)}</dd>
          </div>
          <div className="flex items-center justify-between rounded-[18px] border border-[var(--border)] p-4">
            <dt>Shipping</dt>
            <dd className="text-white">
              {typeof shippingCents === "number"
                ? formatOrderCurrency(shippingCents)
                : "Locked in secure checkout"}
            </dd>
          </div>
          <div className="flex items-center justify-between rounded-[18px] border border-[var(--border)] p-4">
            <dt>Tax</dt>
            <dd className="text-white">
              {typeof taxCents === "number"
                ? formatOrderCurrency(taxCents)
                : "Calculated by provider"}
            </dd>
          </div>
        </dl>

        <dl className="mt-5 grid gap-3 text-sm text-[var(--text-muted)] sm:grid-cols-2">
          <div className="rounded-[18px] border border-[var(--border)] p-4">
            <dt className="text-xs uppercase tracking-[0.2em]">Provider</dt>
            <dd className="mt-2 text-white">
              {paymentSession?.provider ?? "Hosted payment"}
            </dd>
          </div>
          <div className="rounded-[18px] border border-[var(--border)] p-4">
            <dt className="text-xs uppercase tracking-[0.2em]">Reference</dt>
            <dd className="mt-2 break-all text-white">
              {paymentSession?.reference ?? "Pending creation"}
            </dd>
          </div>
        </dl>

        <div className="mt-4 rounded-[18px] border border-[var(--border)] bg-black/20 p-4 text-sm text-[var(--text-muted)]">
          {paymentSession?.customerMessage ?? "Request the hosted payment session to continue."}
        </div>

        {error ? (
          <p className="mt-4 text-sm text-[#ffb1a3]">{error}</p>
        ) : null}

        <button
          type="button"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black disabled:opacity-60"
          disabled={!orderId || processing}
          onClick={onSubmit}
        >
          {processing
            ? "Preparing secure payment..."
            : paymentSession?.hostedUrl
              ? "Open secure payment"
              : "Retry secure payment setup"}
        </button>
      </div>
    </section>
  );
}
