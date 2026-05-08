/**
 * OrdersList — client island for /account/orders.
 *
 * PLACEHOLDER: real implementation hits Supabase + RLS in Phase 8/9. Phase 5
 * surfaces only the most-recent stub order written to sessionStorage by the
 * checkout review flow, so QA can verify the empty / non-empty layouts.
 */
'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { formatPrice } from '@/lib/content/products';
import { useSessionStorageItem } from '@/lib/use-session-storage';

const ORDER_KEY = 'vialchems:checkout:order';

interface StoredOrder {
  id: string;
  placedAt: string;
  method: string;
  totalCents: number;
  lines: { name: string; qty: number }[];
}

export function OrdersList() {
  const order = useSessionStorageItem<StoredOrder>(ORDER_KEY);

  if (!order) {
    return (
      <Card className="p-12 text-center">
        <p className="text-[18px] text-[var(--text-muted)] mb-2">
          You have not placed an order yet.
        </p>
        <p className="text-[14px] text-[var(--text-subtle)] mb-6">
          Once an order is placed, it will show here with status, tracking, and
          per-batch COA reference.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-5 h-11 rounded-[var(--radius-full)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[14px] transition-colors"
        >
          Browse the catalog →
        </Link>
      </Card>
    );
  }

  return (
    <ul className="space-y-4">
      <li>
        <Card className="p-5 flex flex-wrap items-center gap-4 justify-between">
          <div className="min-w-0">
            <Link
              href={`/account/orders/${order.id}`}
              className="font-mono text-[14px] tabular text-[var(--text)] hover:text-[var(--accent-soft)]"
            >
              {order.id}
            </Link>
            <p className="text-[13px] text-[var(--text-muted)] mt-1">
              {new Date(order.placedAt).toLocaleDateString()} ·{' '}
              {order.lines.length} {order.lines.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Pill variant="accent">
              {order.method === 'crypto' ? 'Crypto pending' : 'ACH pending'}
            </Pill>
            <span className="font-mono tabular text-[16px] text-[var(--text)]">
              {formatPrice(order.totalCents)}
            </span>
            <Link
              href={`/account/orders/${order.id}`}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]"
            >
              Detail →
            </Link>
          </div>
        </Card>
      </li>
    </ul>
  );
}
