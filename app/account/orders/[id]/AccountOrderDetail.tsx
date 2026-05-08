/**
 * AccountOrderDetail — client island for /account/orders/[id].
 *
 * Reuses the session-bound stub from sessionStorage. Adds cancel + refund-
 * request action stubs (Phase 9 wires them).
 */
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Specs } from '@/components/ui/Specs';
import { formatPrice } from '@/lib/content/products';
import { useSessionStorageItem } from '@/lib/use-session-storage';

const ORDER_KEY = 'vialchems:checkout:order';

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
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  if (!order) {
    return (
      <Card className="p-12 text-center">
        <p className="text-[18px] text-[var(--text-muted)] mb-3">
          No matching order in your current session.
        </p>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 px-5 h-11 rounded-[var(--radius-full)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[14px] transition-colors"
        >
          ← All orders
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <Pill variant="accent">
          {order.method === 'crypto' ? 'Crypto pending' : 'ACH pending'}
        </Pill>
        <Pill variant="info">RUO</Pill>
      </div>

      <Card className="p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
          Summary
        </p>
        <Specs
          items={[
            { term: 'Order ID', value: order.id },
            {
              term: 'Placed',
              value: new Date(order.placedAt).toLocaleString(),
            },
            { term: 'Method', value: order.method },
            { term: 'Subtotal', value: formatPrice(order.subtotalCents) },
            {
              term: 'Discount',
              value:
                order.discountCents > 0
                  ? `− ${formatPrice(order.discountCents)}`
                  : '—',
            },
            {
              term: 'Shipping',
              value: order.shippingCents === 0 ? 'Free' : formatPrice(order.shippingCents),
            },
            {
              term: 'Total',
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
                {l.name}{' '}
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
            onClick={() =>
              setActionMessage(
                'Cancel request received [stub]. Phase 9 routes this through the orders queue.',
              )
            }
          >
            Cancel order
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() =>
              setActionMessage(
                'Refund request submitted [stub]. Phase 9 wires this to the operator inbox.',
              )
            }
          >
            Request refund
          </Button>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 h-10 rounded-[var(--radius-md)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[14px] transition-colors"
          >
            Contact support
          </Link>
        </div>
        {actionMessage && (
          <p
            role="status"
            className="mt-4 font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--accent)]"
          >
            {actionMessage}
          </p>
        )}
      </Card>
    </div>
  );
}
