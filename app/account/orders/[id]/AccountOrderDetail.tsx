/**
 * AccountOrderDetail — client island for /account/orders/[id].
 *
 * Phase 5 v4 marquee deliverable: Cancel-order + Refund-request flows now use
 * the Phase 2 `<Dialog>` primitive instead of the inline `actionMessage`
 * pattern. Dialog provides:
 *   - role="dialog" + aria-modal + aria-labelledby (focus-trapped panel)
 *   - Esc-to-close + backdrop-click-close
 *   - React Portal mount to document.body
 *   - Phase 2 elevated panel (--surface-elevated + --shadow-2xl)
 *
 * Each action presents a confirmation Dialog with the destructive Button
 * variant ("danger" for cancel, "primary" for refund-request) so the user
 * confirms intent explicitly before the request is submitted. After confirm,
 * a success Toast announces the receipt with role="alert".
 *
 * Backend wiring is still PLACEHOLDER (Phase 10 v4 services-wiring lands the
 * real Supabase persistence + email notification). The visual state machine
 * here mirrors what the production flow will do.
 */
"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, buttonClassNames } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Specs } from "@/components/ui/Specs";
import { Dialog } from "@/components/ui/Dialog";
import { Toast } from "@/components/ui/Toast";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice } from "@/lib/content/products";
import { useSessionStorageItem } from "@/lib/use-session-storage";

const ORDER_KEY = "vialchemlabs:checkout:order";

interface StoredOrder {
  id: string;
  placedAt: string;
  method: string;
  totalCents: number;
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  lines: {
    sku: string;
    slug: string;
    name: string;
    unitPriceCents: number;
    qty: number;
  }[];
  address: {
    name: string;
    street: string;
    street2: string;
    city: string;
    stateCode: string;
    zip: string;
    countryCode: string;
  };
}

type DialogMode = null | "cancel" | "refund";

function methodPendingLabel(method: string): string {
  if (method === "crypto") return "Crypto pending";
  if (method === "zelle") return "Zelle pending";
  if (method === "ach") return "ACH pending";
  return "Payment pending";
}

export function AccountOrderDetail({ expectedId }: { expectedId: string }) {
  const stored = useSessionStorageItem<StoredOrder>(ORDER_KEY);
  const order = stored && stored.id === expectedId ? stored : null;
  const [dialog, setDialog] = useState<DialogMode>(null);
  const [toast, setToast] = useState<string | null>(null);

  function handleCancel() {
    setDialog(null);
    setToast(
      "Cancel request received. Our team will respond within 1 business day.",
    );
  }

  function handleRefund() {
    setDialog(null);
    setToast(
      "Refund request submitted. We will respond within 1 business day with next steps.",
    );
  }

  if (!order) {
    return (
      <EmptyState
        title="No matching order in your current session"
        description="Order history will appear here once Supabase persistence is wired in (pre-launch). For now, only orders placed in the current browser session are visible."
        action={
          <Link
            href="/account/orders"
            className={buttonClassNames("outline", "md")}
          >
            All orders
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <Pill variant="accent">{methodPendingLabel(order.method)}</Pill>
        <Pill variant="info">RUO</Pill>
      </div>

      <Card variant="elevated" className="p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
          Summary
        </p>
        <Specs
          items={[
            { term: "Order ID", value: order.id },
            {
              term: "Placed",
              value: new Date(order.placedAt).toLocaleString(),
            },
            { term: "Method", value: order.method },
            { term: "Subtotal", value: formatPrice(order.subtotalCents) },
            {
              term: "Discount",
              value:
                order.discountCents > 0
                  ? `− ${formatPrice(order.discountCents)}`
                  : "—",
            },
            {
              term: "Shipping",
              value:
                order.shippingCents === 0
                  ? "Free"
                  : formatPrice(order.shippingCents),
            },
            {
              term: "Total",
              value: (
                <span className="text-[18px] font-semibold">
                  {formatPrice(order.totalCents)}
                </span>
              ),
            },
          ]}
        />
      </Card>

      <Card className="p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
          Items
        </p>
        <ul className="divide-y divide-[var(--border)]">
          {order.lines.map((l) => (
            <li
              key={l.sku}
              className="py-3 flex items-baseline justify-between gap-3"
            >
              <Link
                href={`/products/${l.slug}`}
                className="text-[14px] text-[var(--text)] hover:text-[var(--accent-soft)]"
              >
                {l.name}{" "}
                <span className="font-mono text-[12px] text-[var(--text-subtle)]">
                  × {l.qty}
                </span>
              </Link>
              <span className="font-mono tabular text-[14px] text-[var(--text)]">
                {formatPrice(l.unitPriceCents * l.qty)}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
          Actions
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => setDialog("cancel")}
          >
            Cancel order
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => setDialog("refund")}
          >
            Request refund
          </Button>
          <Link href="/contact" className={buttonClassNames("outline", "md")}>
            Contact support
          </Link>
        </div>
      </Card>

      {/* Phase 5 v4 marquee — Dialog primitive replaces inline actionMessage */}
      <Dialog
        open={dialog === "cancel"}
        onClose={() => setDialog(null)}
        title="Cancel this order?"
      >
        <p className="text-[14px] leading-[1.6] text-[var(--text-muted)] mb-6">
          Cancellation requests are processed within 1 business day. If your
          payment has already cleared, our team will issue a refund per the
          refund policy. Pending crypto invoices auto-expire if not paid.
        </p>
        <div className="flex flex-wrap gap-3 justify-end">
          <Button variant="outline" size="md" onClick={() => setDialog(null)}>
            Keep order
          </Button>
          <Button variant="danger" size="md" onClick={handleCancel}>
            Confirm cancellation
          </Button>
        </div>
      </Dialog>

      <Dialog
        open={dialog === "refund"}
        onClose={() => setDialog(null)}
        title="Request a refund?"
      >
        <p className="text-[14px] leading-[1.6] text-[var(--text-muted)] mb-6">
          Refund requests are reviewed against the refund policy (research
          peptides cannot be returned to inventory once shipped; pre-ship
          refunds are routine). Our team will respond within 1 business day.
        </p>
        <div className="flex flex-wrap gap-3 justify-end">
          <Button variant="outline" size="md" onClick={() => setDialog(null)}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleRefund}>
            Submit refund request
          </Button>
        </div>
      </Dialog>

      {toast ? (
        <Toast
          message={toast}
          tone="success"
          duration={5000}
          onDismiss={() => setToast(null)}
        />
      ) : null}
    </div>
  );
}
