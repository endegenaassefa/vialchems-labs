/**
 * OrdersList — /account/orders client island.
 *
 * Auth-flow redesign:
 *   - Single source of truth: useSupabaseUser() — no localStorage stub
 *     fallback, no legacy auth-store.
 *   - REGRESSION GUARD: never renders an inline "Sign in" CTA. The page
 *     is reachable from a signed-in nav; if no session is genuinely
 *     present after the hook resolves, we full-redirect to /login.
 *   - State machine: loading skeleton → loaded list → empty state →
 *     fetch error (with retry). No "logged in but page asks me to sign
 *     in again" middle state.
 */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonClassNames } from "@/components/ui/Button";
import { formatPrice } from "@/lib/content/products";
import { useSupabaseUser } from "@/lib/auth/use-supabase-user";

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
  | { kind: "loading" }
  | { kind: "loaded"; orders: ApiOrderRow[] }
  | { kind: "error"; message: string };

function statusLabel(status: string): string {
  switch (status) {
    case "paid":
      return "Paid";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "refunded":
      return "Refunded";
    case "payment_rejected":
      return "Payment rejected";
    case "awaiting_payment":
      return "Awaiting payment";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

function statusVariant(
  status: string,
): "accent" | "info" | "electric" | "error" {
  if (status === "paid" || status === "shipped" || status === "delivered")
    return "electric";
  if (
    status === "payment_rejected" ||
    status === "refunded" ||
    status === "cancelled"
  )
    return "error";
  return "accent";
}

function LoadingSkeleton() {
  return (
    <ul className="space-y-4" aria-busy="true" aria-label="Loading orders">
      {[0, 1, 2].map((i) => (
        <li key={i}>
          <Card className="p-5 opacity-50">
            <div className="h-5 w-32 bg-[var(--border)] rounded mb-2" />
            <div className="h-3 w-40 bg-[var(--border)] rounded" />
          </Card>
        </li>
      ))}
    </ul>
  );
}

export function OrdersList() {
  const router = useRouter();
  const { user, session, loading, unavailable } = useSupabaseUser();
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  // Genuinely no session → full redirect. No inline "Sign in" CTA on a page
  // that should only be reachable when signed in (spec regression rule).
  useEffect(() => {
    if (!loading && !unavailable && !user) {
      router.replace("/login?next=/account/orders");
    }
  }, [loading, unavailable, user, router]);

  useEffect(() => {
    if (unavailable) return; // render branch handles this
    if (!session?.access_token) return; // wait for the hook
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/account/orders", {
          headers: { Authorization: `Bearer ${session!.access_token}` },
        });
        if (cancelled) return;
        if (res.status === 503) {
          setState({
            kind: "error",
            message: "Order history is temporarily unavailable.",
          });
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
      } catch (err) {
        if (cancelled) return;
        setState({
          kind: "error",
          message: err instanceof Error ? err.message : "network_error",
        });
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [session, unavailable]);

  // Hook still resolving OR session-loaded but fetch not yet returned.
  if (loading || (user && state.kind === "loading")) {
    return <LoadingSkeleton />;
  }

  // Genuinely no session — useEffect above is doing the redirect; render
  // a calm placeholder while it happens. NEVER show a "Sign in" CTA here.
  if (!user) {
    return (
      <EmptyState title="Redirecting to sign in…" description="Hold tight." />
    );
  }

  if (unavailable) {
    return (
      <EmptyState
        title="Order history is temporarily unavailable"
        description="If you just placed an order, your confirmation email contains a direct tracking link."
        action={
          <Link
            href="/track-order"
            className={buttonClassNames("outline", "md")}
          >
            Track an order
          </Link>
        }
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

  // Loaded
  if (state.kind !== "loaded") {
    // Defensive — already handled above; appeases TS narrowing.
    return <LoadingSkeleton />;
  }
  if (state.orders.length === 0) {
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

  return (
    <ul className="space-y-4">
      {state.orders.map((order: ApiOrderRow) => (
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
