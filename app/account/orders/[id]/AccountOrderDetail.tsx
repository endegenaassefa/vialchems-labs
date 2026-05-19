/**
/** Account order detail for session-backed orders and support handoff links. */
"use client";

import Link from "next/link";
import { buttonClassNames } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Specs } from "@/components/ui/Specs";
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

export function AccountOrderDetail({ expectedId }: { expectedId: string }) {
  const stored = useSessionStorageItem<StoredOrder>(ORDER_KEY);
  const order = stored && stored.id === expectedId ? stored : null;

  if (!order) {
    return (
      <EmptyState
        title="No matching order in your current session"
        description="If you completed checkout in another browser or device, contact support with your order reference."
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
        <Pill variant="accent">
          {order.method === "crypto" ? "Crypto pending" : "ACH pending"}
        </Pill>
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
          <Link
            href={`/contact?topic=cancel-order&order=${encodeURIComponent(order.id)}`}
            className={buttonClassNames("outline", "md")}
          >
            Request cancellation
          </Link>
          <Link
            href={`/contact?topic=refund&order=${encodeURIComponent(order.id)}`}
            className={buttonClassNames("outline", "md")}
          >
            Request refund
          </Link>
          <Link href="/contact" className={buttonClassNames("outline", "md")}>
            Contact support
          </Link>
        </div>
      </Card>
    </div>
  );
}
