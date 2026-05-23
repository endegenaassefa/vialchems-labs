/**
 * OrdersList — /account/orders client island.
 *
 * B2 rewire: fetches /api/account/orders on mount + renders the
 * customer's Supabase-backed order history (newest first). Falls
 * back to the legacy sessionStorage stub when the API returns
 * 401 (no session) or 503 (Supabase not configured) so a
 * just-placed order still shows up between page navigations even
 * before B1 magic-link auth UI ships.
 */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonClassNames } from "@/components/ui/Button";
import { formatPrice } from "@/lib/content/products";
import { useSessionStorageItem } from "@/lib/use-session-storage";

const ORDER_KEY = "vialchemlabs:checkout:order";

interface StoredOrder {
  id: string;
  placedAt: string;
  method: string;
  totalCents: number;
  lines: { name: string; qty: number }[];
}

interface ApiOrderRow {
  display_id: string;
  total_cents: number;
  status: string;
  payment_provider: string;
  placed_at: string;
  shipped_at?: string | null;
  tracking_number?: string | null;
  carrier?: string | null;
  items?: { name: string; qty: number }[] | null;
}

type LoadState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "loaded"; orders: ApiOrderRow[] }
  | { kind: "unauthorized" }
  | { kind: "unavailable" }
  | { kind: "error"; message: string };

function statusLabel(status: string): string {
  switch (status) {
    case "paid":
      return "Paid";
    case "shipped":
      return "Shipped";
    case "refunded":
      return "Refunded";
    case "payment_rejected":
      return "Payment rejected";
    case "awaiting_payment":
      return "Awaiting payment";
    default:
      return status;
  }
}

function statusVariant(
  status: string,
): "accent" | "info" | "electric" | "error" {
  if (status === "paid" || status === "shipped") return "electric";
  if (status === "payment_rejected" || status === "refunded") return "error";
  return "accent";
}

export function OrdersList() {
  const stub = useSessionStorageItem<StoredOrder>(ORDER_KEY);
  const [state, setState] = useState<LoadState>({ kind: "idle" });

  useEffect(() => {
    let cancelled = false;
    setState({ kind: "loading" });
    fetch("/api/account/orders", { credentials: "include" })
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 401) {
          setState({ kind: "unauthorized" });
          return;
        }
        if (res.status === 503) {
          setState({ kind: "unavailable" });
          return;
        }
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as {
            message?: string;
          } | null;
          setState({
            kind: "error",
            message: body?.message ?? `HTTP ${res.status}`,
          });
          return;
        }
        const body = (await res.json()) as { orders: ApiOrderRow[] };
        setState({ kind: "loaded", orders: body.orders ?? [] });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setState({
          kind: "error",
          message: err instanceof Error ? err.message : "network_error",
        });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Live Supabase data wins when available.
  if (state.kind === "loaded" && state.orders.length > 0) {
    return (
      <ul className="space-y-4">
        {state.orders.map((order) => (
          <li key={order.display_id}>
            <Card className="p-5 flex flex-wrap items-center gap-4 justify-between">
              <div className="min-w-0">
                <Link
                  href={`/account/orders/${order.display_id}`}
                  className="font-mono text-[14px] tabular text-[var(--text)] hover:text-[var(--accent-soft)]"
                >
                  {order.display_id}
                </Link>
                <p className="text-[13px] text-[var(--text-muted)] mt-1">
                  {new Date(order.placed_at).toLocaleDateString()} ·{" "}
                  {order.items?.length ?? 0}{" "}
                  {(order.items?.length ?? 0) === 1 ? "item" : "items"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Pill variant={statusVariant(order.status)}>
                  {statusLabel(order.status)}
                </Pill>
                <span className="font-mono tabular text-[16px] text-[var(--text)]">
                  {formatPrice(order.total_cents)}
                </span>
                <Link
                  href={`/account/orders/${order.display_id}`}
                  className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]"
                >
                  Detail →
                </Link>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    );
  }

  // Fall back to the just-placed sessionStorage stub so a customer
  // who hasn't signed in yet still sees their most recent order.
  if (stub) {
    return (
      <>
        {state.kind === "unauthorized" ? (
          <p className="text-[13px] text-[var(--text-muted)] mb-4">
            Sign in with the magic-link email we sent to see your full order
            history; this card is your most recent order from this device.
          </p>
        ) : null}
        <ul className="space-y-4">
          <li>
            <Card className="p-5 flex flex-wrap items-center gap-4 justify-between">
              <div className="min-w-0">
                <Link
                  href={`/account/orders/${stub.id}`}
                  className="font-mono text-[14px] tabular text-[var(--text)] hover:text-[var(--accent-soft)]"
                >
                  {stub.id}
                </Link>
                <p className="text-[13px] text-[var(--text-muted)] mt-1">
                  {new Date(stub.placedAt).toLocaleDateString()} ·{" "}
                  {stub.lines.length}{" "}
                  {stub.lines.length === 1 ? "item" : "items"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Pill variant="accent">
                  {stub.method === "crypto" ? "Crypto pending" : "ACH pending"}
                </Pill>
                <span className="font-mono tabular text-[16px] text-[var(--text)]">
                  {formatPrice(stub.totalCents)}
                </span>
                <Link
                  href={`/account/orders/${stub.id}`}
                  className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]"
                >
                  Detail →
                </Link>
              </div>
            </Card>
          </li>
        </ul>
      </>
    );
  }

  if (state.kind === "loading") {
    return (
      <EmptyState
        title="Loading your orders…"
        description="One moment while we look up your order history."
      />
    );
  }

  if (state.kind === "unauthorized") {
    return (
      <EmptyState
        title="Sign in to see your orders"
        description="Enter your email on the sign-in page to receive a magic link. Your order history appears here once you click through."
        action={
          <Link
            href="/login?next=/account/orders"
            className={buttonClassNames("primary", "md")}
          >
            Sign in
          </Link>
        }
      />
    );
  }

  if (state.kind === "unavailable") {
    return (
      <EmptyState
        title="Order history is temporarily unavailable"
        description="We're still bringing the order-history service online. If you just placed an order, your confirmation email contains the order id and current status."
      />
    );
  }

  if (state.kind === "error") {
    return (
      <EmptyState
        title="We couldn't load your orders"
        description={`Reach out to support if this persists. (${state.message})`}
      />
    );
  }

  return (
    <EmptyState
      title="No orders yet"
      description="Once an order is placed, it will appear here with status, tracking, and Certificate of Analysis reference."
      action={
        <Link href="/shop" className={buttonClassNames("outline", "md")}>
          Browse the catalog
        </Link>
      }
    />
  );
}
