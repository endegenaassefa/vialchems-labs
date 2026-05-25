"use client";

/**
 * Account dashboard — v1.3 real account view.
 *
 * Reads the current user from lib/auth-store.ts (localStorage-backed) and
 * renders a real dashboard: profile, qualification status, addresses,
 * preferences, recent order (from sessionStorage), and a logout action.
 *
 * If no user is signed in, renders a sign-in prompt instead of redirecting
 * (avoid SSR/CSR redirect mismatch). Hydration-safe via useAuthHydrated().
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Button, buttonClassNames } from "@/components/ui/Button";
import { Specs } from "@/components/ui/Specs";
import {
  useAuthHydrated,
  useAuthStore,
  useCurrentUser,
} from "@/lib/auth-store";
import { qualificationRoleLabels } from "@/lib/customer-qualification";
import { browserSupabase } from "@/lib/supabase";
import { signOut as supabaseSignOut } from "@/lib/supabase-auth";

interface RecentOrder {
  id: string;
  placedAt: string;
  totalCents: number;
  method: string;
}

function readRecentOrder(): RecentOrder | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem("vialchemlabs:checkout:order");
    return raw ? (JSON.parse(raw) as RecentOrder) : null;
  } catch {
    return null;
  }
}

export default function AccountPage() {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const user = useCurrentUser();
  const logout = useAuthStore((s) => s.logout);
  const [recentOrder] = useState<RecentOrder | null>(readRecentOrder);
  // Phase 2A3 — also recognize Supabase Auth sessions (magic-link sign-in)
  // alongside the legacy PBKDF2 localStorage user. Without this check, a
  // user who completes the magic-link flow lands on /account and sees
  // "No account on this device" because useCurrentUser only reads the
  // Zustand auth-store. We subscribe to onAuthStateChange so the page
  // re-renders when the Supabase session lands.
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  // Lazy initializer: when Supabase is not configured (stub mode) we're
  // not loading anything, so default to false. When it IS configured the
  // effect below kicks off getUser() and sets state on completion. This
  // avoids the react-hooks/set-state-in-effect violation that would fire
  // if we always defaulted to true + flipped to false synchronously.
  const [supabaseLoading, setSupabaseLoading] = useState(() => {
    if (typeof window === "undefined") return false;
    return browserSupabase() !== null;
  });

  useEffect(() => {
    const supabase = browserSupabase();
    if (!supabase) return;
    let cancelled = false;
    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      setSupabaseUser(data.user ?? null);
      setSupabaseLoading(false);
    });
    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUser(session?.user ?? null);
    });
    return () => {
      cancelled = true;
      sub.data.subscription.unsubscribe();
    };
  }, []);

  function handleLogout() {
    logout();
    // Best-effort: also sign out of Supabase Auth if a session is present.
    void supabaseSignOut();
    router.push("/");
  }

  async function handleSupabaseSignOut() {
    await supabaseSignOut();
    setSupabaseUser(null);
    router.push("/");
  }

  if (!hydrated || supabaseLoading) {
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

  // Phase 2A3 — Supabase-only path. User signed in via magic link but has
  // no legacy PBKDF2 record. Render a simplified dashboard that surfaces
  // email + recent order + order-history link + sign-out. The legacy
  // dashboard below remains intact for the PBKDF2 codepath.
  if (!user && supabaseUser) {
    return (
      <>
        <SiteHeader />
        <main id="main" className="flex-1">
          <section className="border-b border-[var(--border)]">
            <div className="mx-auto max-w-3xl px-6 py-32 md:py-40">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-6">
                A C C O U N T
              </p>
              <h1 className="text-[clamp(36px,5vw,56px)] font-light leading-[1.05] tracking-tight text-[var(--text)] mb-6">
                <span className="block">Welcome,</span>
                <span className="font-serif-italic block text-[var(--accent-soft)]">
                  {supabaseUser.email}.
                </span>
              </h1>
              <div className="flex items-center gap-2 flex-wrap mb-8">
                <Pill variant="accent">Signed in</Pill>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                  Magic-link session · Supabase Auth
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 mb-8">
                <Card className="p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-2">
                    Order history
                  </p>
                  <p className="text-[14px] text-[var(--text-muted)] mb-3 leading-[1.55]">
                    View every order placed with this email.
                  </p>
                  <Link
                    href="/account/orders"
                    className={buttonClassNames("primary", "md")}
                  >
                    View orders →
                  </Link>
                </Card>
                <Card className="p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-2">
                    Lab reports
                  </p>
                  <p className="text-[14px] text-[var(--text-muted)] mb-3 leading-[1.55]">
                    Per-product 4-test panel for every catalog SKU.
                  </p>
                  <Link
                    href="/verify"
                    className={buttonClassNames("outline", "md")}
                  >
                    Browse lab reports →
                  </Link>
                </Card>
              </div>
              {recentOrder ? (
                <Card className="p-5 mb-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
                    Most recent order
                  </p>
                  <Specs
                    items={[
                      { term: "Order ID", value: recentOrder.id },
                      { term: "Placed", value: recentOrder.placedAt },
                      { term: "Method", value: recentOrder.method },
                      {
                        term: "Total",
                        value: `$${(recentOrder.totalCents / 100).toFixed(2)}`,
                      },
                    ]}
                  />
                </Card>
              ) : null}
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleSupabaseSignOut}
              >
                Sign out
              </Button>
            </div>
          </section>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <SiteHeader />
        <main id="main" className="flex-1">
          <section>
            <div className="mx-auto max-w-md px-6 py-32 md:py-40">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-6">
                A C C O U N T
              </p>
              <h1 className="text-[clamp(36px,5vw,56px)] font-light tracking-tight leading-[1.05] text-[var(--text)] mb-6">
                <span className="block">Sign in to your</span>
                <span className="font-serif-italic block text-[var(--accent-soft)]">
                  researcher account.
                </span>
              </h1>
              <p className="text-[15px] leading-[1.6] text-[var(--text-muted)] mb-8">
                No account on this device. Create one or sign in to view your
                dashboard.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link
                  href="/signup"
                  className={buttonClassNames("primary", "lg")}
                >
                  Create account
                </Link>
                <Link
                  href="/login"
                  className={buttonClassNames("outline", "lg")}
                >
                  Sign in
                </Link>
              </div>
            </div>
          </section>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-5xl px-6 py-32 md:py-40">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-6">
              A C C O U N T
            </p>
            <h1 className="text-[clamp(36px,5vw,60px)] font-light leading-[1.05] tracking-tight text-[var(--text)] mb-6">
              <span className="block">Welcome back,</span>
              <span className="font-serif-italic block text-[var(--accent-soft)]">
                {user.displayName}.
              </span>
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              {user.qualified ? (
                <Pill variant="accent">Qualified ✓</Pill>
              ) : (
                <Pill variant="info">Qualification pending</Pill>
              )}
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                {qualificationRoleLabels[user.role]} · Member since{" "}
                {user.createdAt.slice(0, 10)}
              </span>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-5xl px-6 py-20 grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
                Profile
              </p>
              <Specs
                items={[
                  { term: "Email", value: user.email },
                  { term: "Display name", value: user.displayName },
                  { term: "Role", value: qualificationRoleLabels[user.role] },
                  {
                    term: "Newsletter",
                    value: user.newsletterOptIn ? "Subscribed" : "Unsubscribed",
                  },
                ]}
              />
            </Card>

            <Card className="p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
                Qualification
              </p>
              {user.qualified ? (
                <div>
                  <Pill variant="accent" className="mb-3">
                    Verified ✓
                  </Pill>
                  <p className="text-[14px] text-[var(--text-muted)] leading-[1.55]">
                    Qualified on {user.qualifiedAt?.slice(0, 10)}. Buyer
                    qualification persists across orders; you will not be
                    re-asked at checkout.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-[14px] text-[var(--text-muted)] leading-[1.55] mb-4">
                    Buyer qualification (verbatim Appendix A.5 attestations) is
                    collected inline at checkout review on your first order.
                  </p>
                  <Link
                    href="/shop"
                    className={buttonClassNames("outline", "sm")}
                  >
                    Browse the catalog →
                  </Link>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
                Recent order
              </p>
              {recentOrder ? (
                <Specs
                  items={[
                    {
                      term: "Order ID",
                      value: (
                        <span className="font-mono">{recentOrder.id}</span>
                      ),
                    },
                    {
                      term: "Placed",
                      value: recentOrder.placedAt.slice(0, 10),
                    },
                    { term: "Method", value: recentOrder.method },
                    {
                      term: "Total",
                      value: (
                        <span className="font-mono tabular">
                          ${(recentOrder.totalCents / 100).toFixed(2)}
                        </span>
                      ),
                    },
                  ]}
                />
              ) : (
                <p className="text-[14px] text-[var(--text-muted)] leading-[1.55]">
                  No recent orders on this device. Your order history will
                  populate here.
                </p>
              )}
            </Card>

            <Card className="p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
                Saved addresses
              </p>
              {user.addresses.length === 0 ? (
                <p className="text-[14px] text-[var(--text-muted)] leading-[1.55]">
                  No addresses saved yet. The address you enter at checkout is
                  saved automatically once your first order completes.
                </p>
              ) : (
                <ul className="space-y-3 text-[14px] text-[var(--text-muted)]">
                  {user.addresses.map((addr) => (
                    <li key={addr.id}>
                      <p className="text-[var(--text)] font-medium">
                        {addr.label}
                      </p>
                      <p>
                        {addr.street}
                        {addr.street2 ? `, ${addr.street2}` : ""}
                      </p>
                      <p>
                        {addr.city}, {addr.stateCode} {addr.zip}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-md px-6 py-20 text-center">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleLogout}
            >
              Sign out
            </Button>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
              Pre-launch · Server auth wires before public launch
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
