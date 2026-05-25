"use client";

/**
 * Account dashboard — auth-flow redesign.
 *
 * Single source of truth: Supabase Auth via useSupabaseUser(). Orders-first
 * hierarchy (the #1 reason customers visit /account after buying). Welcome
 * pill on ?welcome=1 (set by /auth/callback after a fresh magic-link
 * sign-in). No fake stat cards. No legacy PBKDF2 path.
 */

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Button, buttonClassNames } from "@/components/ui/Button";
import { signOut as supabaseSignOut } from "@/lib/supabase-auth";
import { useSupabaseUser } from "@/lib/auth/use-supabase-user";

interface RecentOrder {
  display_id: string;
  total_cents: number;
  status: string;
  placed_at: string;
}

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

function WelcomePill({ email }: { email: string }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setVisible(false), 4000);
    return () => window.clearTimeout(t);
  }, []);
  if (!visible) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="mb-6 transition-opacity duration-300"
    >
      <Pill variant="accent">Signed in as {email} · just now</Pill>
    </div>
  );
}

function AccountDashboardInner() {
  const router = useRouter();
  const search = useSearchParams();
  const { user, session, loading, unavailable } = useSupabaseUser();
  const welcome = search?.get("welcome") === "1";

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Fetch the top 3 orders inline so the dashboard is useful at first paint.
  // No-user case is handled by the parent redirect; we never render the
  // loading skeleton without a session, so leaving ordersLoading=true on
  // the early-return path is safe (and avoids react-hooks/set-state-in-effect).
  useEffect(() => {
    if (!user || !session?.access_token) return;
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/account/orders", {
          headers: { Authorization: `Bearer ${session!.access_token}` },
        });
        if (!res.ok || cancelled) {
          if (!cancelled) setOrdersLoading(false);
          return;
        }
        const body = (await res.json()) as { orders?: RecentOrder[] };
        if (!cancelled) {
          setRecentOrders((body.orders ?? []).slice(0, 3));
          setOrdersLoading(false);
        }
      } catch {
        if (!cancelled) setOrdersLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [user, session]);

  async function handleSignOut() {
    await supabaseSignOut();
    router.push("/");
  }

  // Stub-mode message — Supabase not configured.
  if (unavailable) {
    return (
      <>
        <SiteHeader />
        <main id="main" className="flex-1">
          <section className="mx-auto max-w-md px-6 py-32 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-6">
              A C C O U N T
            </p>
            <h1 className="text-[28px] font-light text-[var(--text)] mb-4">
              Account is temporarily unavailable.
            </h1>
            <p className="text-[14px] text-[var(--text-muted)] mb-6">
              Try again in a moment. If you just placed an order, your
              confirmation email has a direct tracking link.
            </p>
            <Link href="/track-order" className={buttonClassNames("outline", "md")}>
              Track an order
            </Link>
          </section>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main id="main" className="flex-1">
          <section className="mx-auto max-w-3xl px-6 py-40 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
              Loading account…
            </p>
          </section>
        </main>
        <SiteFooter />
      </>
    );
  }

  // No session → full redirect to /login (no inline CTA). The spec calls
  // this out as a regression guard: pages that should only be reachable
  // when signed in must never look like sign-in promos.
  if (!user) {
    if (typeof window !== "undefined") {
      router.replace("/login?next=/account");
    }
    return (
      <>
        <SiteHeader />
        <main id="main" className="flex-1">
          <section className="mx-auto max-w-md px-6 py-32 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
              Redirecting to sign in…
            </p>
          </section>
        </main>
        <SiteFooter />
      </>
    );
  }

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-5xl px-6 py-12">
            {welcome ? <WelcomePill email={user.email ?? ""} /> : null}
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-3">
              A C C O U N T
            </p>
            <h1 className="text-[clamp(28px,4vw,40px)] font-light tracking-tight text-[var(--text)]">
              Your account
            </h1>
          </div>
        </section>

        {/* PRIMARY: recent orders. This is why people come here. */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-5xl px-6 py-12">
            <div className="flex items-baseline justify-between mb-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Recent orders
              </p>
              <Link
                href="/account/orders"
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] hover:text-[var(--accent-soft)]"
              >
                View all →
              </Link>
            </div>
            {ordersLoading ? (
              <ul className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <li key={i}>
                    <Card className="p-4 opacity-50">
                      <div className="h-5 w-24 bg-[var(--border)] rounded mb-2" />
                      <div className="h-3 w-32 bg-[var(--border)] rounded" />
                    </Card>
                  </li>
                ))}
              </ul>
            ) : recentOrders.length > 0 ? (
              <ul className="space-y-3">
                {recentOrders.map((o) => (
                  <li key={o.display_id}>
                    <Link
                      href={`/account/orders/${o.display_id}`}
                      className="block"
                    >
                      <Card className="p-4 flex flex-wrap items-center gap-4 justify-between hover:border-[var(--accent)] transition-colors">
                        <div>
                          <p className="font-mono text-[14px] tabular text-[var(--text)]">
                            {o.display_id}
                          </p>
                          <p className="text-[12px] text-[var(--text-muted)] mt-1">
                            {new Date(o.placed_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Pill variant={statusVariant(o.status)}>
                            {statusLabel(o.status)}
                          </Pill>
                          <span className="font-mono tabular text-[14px] text-[var(--text)]">
                            ${(o.total_cents / 100).toFixed(2)}
                          </span>
                        </div>
                      </Card>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Card className="p-6">
                <p className="text-[14px] text-[var(--text-muted)] leading-[1.55] mb-4">
                  No orders yet. Once you place one, it will appear here with
                  status, tracking, and lab-report references.
                </p>
                <Link href="/shop" className={buttonClassNames("outline", "sm")}>
                  Browse the catalog →
                </Link>
              </Card>
            )}
          </div>
        </section>

        {/* SECONDARY: identity confirmation. */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-5xl px-6 py-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
              Signed in
            </p>
            <p className="text-[16px] text-[var(--text)]">
              {user.email}
              {memberSince ? (
                <span className="text-[var(--text-muted)]">
                  {" · Member since "}
                  {memberSince}
                </span>
              ) : null}
            </p>
          </div>
        </section>

        {/* TERTIARY: section links + sign out. */}
        <section>
          <div className="mx-auto max-w-5xl px-6 py-12 space-y-4">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/account/orders"
                className={buttonClassNames("outline", "sm")}
              >
                Orders
              </Link>
              <Link
                href="/account/addresses"
                className={buttonClassNames("outline", "sm")}
              >
                Addresses
              </Link>
              <Link
                href="/account/settings"
                className={buttonClassNames("outline", "sm")}
              >
                Settings
              </Link>
            </div>
            <div>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleSignOut}
              >
                Sign out
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountDashboardInner />
    </Suspense>
  );
}
