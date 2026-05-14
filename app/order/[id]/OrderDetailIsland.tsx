/**
 * OrderDetailIsland — client island for /order/[id].
 *
 * PLACEHOLDER: real implementation reads order rows from Supabase with a
 * one-time token in Phase 9. Phase 5 reads the most-recent order written to
 * sessionStorage by ReviewPanel.
 */
"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Specs } from "@/components/ui/Specs";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonClassNames } from "@/components/ui/Button";
import { formatPrice } from "@/lib/content/products";
import { useSessionStorageItem } from "@/lib/use-session-storage";

const ORDER_KEY = "vialchemlabs:checkout:order";

interface StoredOrder {
  id: string;
  placedAt: string;
  method: "crypto" | "ach" | "zelle";
  lines: {
    sku: string;
    slug: string;
    name: string;
    unitPriceCents: number;
    qty: number;
  }[];
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  totalCents: number;
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

const METHOD_LABELS: Record<string, string> = {
  crypto: "Cryptocurrency (BTC / LTC)",
  ach: "Bank transfer (US ACH)",
  zelle: "Zelle bank payment",
};

function statusLabel(method: StoredOrder["method"]): string {
  if (method === "crypto") return "Awaiting BTC confirmation";
  if (method === "zelle") return "Awaiting Zelle verification";
  return "Awaiting ACH clearance";
}

export function OrderDetailIsland({ expectedId }: { expectedId: string }) {
  const stored = useSessionStorageItem<StoredOrder>(ORDER_KEY);
  const order = stored && stored.id === expectedId ? stored : null;

  if (!order) {
    return (
      <EmptyState
        title="Order detail not available in this session"
        description="Token-gated order pages activate pre-launch. Until then, only the originating browser tab can render this view."
        action={
          <Link
            href="/account/orders"
            className={buttonClassNames("outline", "md")}
          >
            Sign in to view order
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <Pill variant="accent">{statusLabel(order.method)}</Pill>
        <Pill variant="info">RUO</Pill>
        <Pill variant="electric">Tracking pending</Pill>
      </div>

      <Card variant="elevated" className="p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
          Summary
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Specs
            items={[
              { term: "Order ID", value: order.id },
              {
                term: "Placed",
                value: new Date(order.placedAt).toLocaleString(),
              },
              {
                term: "Method",
                value: METHOD_LABELS[order.method] ?? order.method,
              },
            ]}
          />
          <Specs
            items={[
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
        </div>
      </Card>

      <Card className="p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
          Shipping address
        </p>
        <div className="text-[14px] text-[var(--text-muted)] leading-[1.6]">
          <p className="text-[var(--text)] font-medium">{order.address.name}</p>
          <p>
            {order.address.street}
            {order.address.street2 ? `, ${order.address.street2}` : ""}
          </p>
          <p>
            {order.address.city}, {order.address.stateCode} {order.address.zip}
          </p>
          <p>{order.address.countryCode}</p>
        </div>
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

      <p className="text-[12px] text-[var(--text-subtle)] font-mono">
        COA reference attaches to your order email once the batch is allocated.
      </p>
    </div>
  );
}
