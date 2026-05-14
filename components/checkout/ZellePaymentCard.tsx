/**
 * ZellePaymentCard — the Zelle manual-payment instruction block.
 *
 * Zelle has no merchant API; the customer pays manually from their bank
 * app. This screen has to make that foolproof: the memo code is the field
 * people forget, so it gets the most visual weight. "I've sent the
 * payment" only notifies ops (advisory) — it never moves the order to
 * paid; staff confirm that after seeing the transfer land.
 *
 * Shared by /checkout/confirm (first view) and /order/[id] (re-show for
 * an order still awaiting payment) so the instructions never disappear on
 * the customer.
 */
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { buttonClassNames } from "@/components/ui/Button";
import { formatPrice } from "@/lib/content/products";

export interface ZelleInstructions {
  provider: "zelle";
  businessName: string;
  handle: string;
  bankName: string;
  memo: string;
  instructions: string;
  qrImageUrl?: string;
}

export function ZellePaymentCard({
  orderId,
  totalCents,
  instructions,
}: {
  orderId: string;
  totalCents: number;
  instructions: ZelleInstructions;
}) {
  const [claimState, setClaimState] = useState<
    "idle" | "sending" | "done" | "error"
  >("idle");

  async function claimSent() {
    setClaimState("sending");
    try {
      const res = await fetch(`/api/orders/${orderId}/payment-claimed`, {
        method: "POST",
      });
      setClaimState(res.ok ? "done" : "error");
    } catch {
      setClaimState("error");
    }
  }

  return (
    <Card className="p-6 space-y-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-1">
          Send your Zelle payment
        </p>
        <p className="text-[14px] leading-[1.6] text-[var(--text-muted)]">
          Your order is reserved. Send the transfer below from your
          bank&apos;s app and we&apos;ll confirm it shortly.
        </p>
      </div>

      <div className="rounded-[12px] border border-[var(--border)] p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
          Amount to send
        </p>
        <p className="font-mono text-[28px] font-semibold tabular text-[var(--text)] mt-1">
          {formatPrice(totalCents)}
        </p>
      </div>

      <div className="rounded-[12px] border border-[var(--border)] p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
          Send to (Zelle)
        </p>
        <p className="font-mono text-[18px] text-[var(--text)] mt-1 break-all">
          {instructions.handle}
        </p>
        <p className="text-[12px] text-[var(--text-subtle)] mt-1">
          {instructions.businessName} · {instructions.bankName}
        </p>
      </div>

      <div className="rounded-[12px] border-2 border-[var(--accent)] bg-[var(--accent-soft)] p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
          Memo / reference code
        </p>
        <p className="font-mono text-[22px] font-semibold text-[var(--text)] mt-1 break-all">
          {instructions.memo}
        </p>
        <p className="text-[13px] leading-[1.5] text-[var(--text)] mt-2">
          Put this in the Zelle memo field. Without it we can&apos;t match
          your payment to your order, and it will be delayed.
        </p>
      </div>

      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-2">
          How to pay
        </p>
        <ol className="space-y-1.5 text-[14px] leading-[1.5] text-[var(--text)]">
          <li>1. Open your bank&apos;s app and choose Zelle / Send Money.</li>
          <li>
            2. Send exactly {formatPrice(totalCents)} to{" "}
            <span className="font-mono">{instructions.handle}</span>.
          </li>
          <li>
            3. Paste <span className="font-mono">{instructions.memo}</span>{" "}
            into the memo / note field.
          </li>
        </ol>
      </div>

      <p className="text-[13px] leading-[1.6] text-[var(--text-muted)]">
        Order <span className="font-mono text-[var(--text)]">{orderId}</span>{" "}
        is held as &ldquo;Awaiting Payment.&rdquo; We confirm Zelle transfers
        once they land in our account and email you the moment yours clears.
      </p>

      {claimState === "done" ? (
        <p className="text-[14px] text-[var(--accent)] font-medium">
          Thanks — we&apos;ve been notified and will confirm your payment
          shortly.
        </p>
      ) : (
        <div className="space-y-1">
          <button
            type="button"
            disabled={claimState === "sending"}
            onClick={claimSent}
            className={`${buttonClassNames("primary", "md")} disabled:opacity-50`}
          >
            {claimState === "sending"
              ? "Notifying..."
              : "I've sent the payment"}
          </button>
          {claimState === "error" && (
            <p className="text-[12px] text-[var(--pill-error)]">
              Could not notify us automatically — your order is still
              reserved. We&apos;ll see your payment when it lands.
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
