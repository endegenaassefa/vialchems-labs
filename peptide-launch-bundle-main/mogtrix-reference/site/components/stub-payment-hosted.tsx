"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function StubPaymentHosted({
  orderId,
  reference
}: {
  orderId: string;
  reference: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function complete(eventType: "payment.paid" | "payment.pending") {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/payments/stub/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderId,
          reference,
          eventType
        })
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(payload?.error ?? "The stub payment could not be completed.");
        setSubmitting(false);
        return;
      }

      router.push(`/account/orders/${orderId}?status=payment_pending`);
      router.refresh();
    } catch {
      setError("The stub payment could not be completed.");
      setSubmitting(false);
    }
  }

  return (
    <main className="shell py-16">
      <div className="mx-auto max-w-3xl">
        <section className="metal rounded-[28px] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Hosted payment demo
          </p>
          <h1 className="mt-3 text-4xl font-black text-white">
            Confirm the offsite payment handoff
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
            This local stub stands in for the future hosted payment provider. It sends a webhook-driven
            payment result back into Mogtrix and then returns you to the order record.
          </p>

          <div className="mt-6 grid gap-4 rounded-[22px] border border-[var(--border)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Order</p>
                <p className="mt-2 text-lg font-bold text-white">{orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Reference</p>
                <p className="mt-2 break-all text-sm text-white">{reference}</p>
              </div>
            </div>

            {error ? (
              <div className="rounded-[18px] border border-[#7a2a22] bg-[#210b08] p-4 text-sm text-[#ffb1a3]">
                {error}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black disabled:opacity-60"
                disabled={submitting}
                onClick={() => complete("payment.paid")}
              >
                {submitting ? "Sending webhook..." : "Pay and return to order"}
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-white hover:border-[var(--accent)]"
                disabled={submitting}
                onClick={() => complete("payment.pending")}
              >
                Return with payment pending
              </button>
              <Link
                href={`/account/orders/${orderId}`}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-white hover:border-[var(--accent)]"
              >
                Cancel and go back
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
