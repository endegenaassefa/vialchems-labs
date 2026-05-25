"use client";

/**
 * /account — customer dashboard.
 *
 * Spec §6 (welcome screen design). Single page that exposes:
 *   - Identity card (verified pill, name, email, member since)
 *   - "Your next steps" tile row → Shop / Lab reports / Profile
 *   - Recent orders inline (top 3, "view all" link)
 *   - Account details table with inline Edit links to the
 *     subpages that own each section (addresses, security)
 *   - Sign out + Account settings buttons
 *
 * Data sources:
 *   - useSupabaseUser() — session, loading, unavailable
 *   - GET /api/account/orders — top 3
 *   - GET /api/account/profile — customer_profiles row
 *     (returns { needs_completion: true } for legacy magic-link
 *     customers who never registered through /register; client
 *     redirects to /account/complete-profile in that case)
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

interface ProfileShape {
  id: string;
  email: string;
  phone: string | null;
  full_name: string;
  date_of_birth: string;
  research_org_type: string;
  research_org_other: string | null;
  research_focus: string;
  status: string;
  email_confirmed_at: string | null;
  created_at: string;
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

const ORG_TYPE_LABELS: Record<string, string> = {
  university: "University / academic lab",
  biotech: "Biotech / pharma",
  independent_research: "Independent research org",
  cro: "Contract research org",
  government: "Government / public-sector lab",
  individual: "Individual researcher",
  other: "Other",
};

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
  const [profile, setProfile] = useState<ProfileShape | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Fetch the top 3 orders inline so the dashboard is useful at first paint.
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

  // Fetch profile row. Redirect legacy magic-link customers to the
  // complete-profile funnel.
  useEffect(() => {
    if (!user || !session?.access_token) return;
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/account/profile", {
          headers: { Authorization: `Bearer ${session!.access_token}` },
        });
        const body = (await res.json()) as {
          ok: boolean;
          profile?: ProfileShape | null;
          needs_completion?: boolean;
        };
        if (cancelled) return;
        if (body.needs_completion) {
          router.replace("/account/complete-profile");
          return;
        }
        setProfile(body.profile ?? null);
      } catch {
        // Ignore; profile card simply won't render.
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [user, session, router]);

  async function handleSignOut() {
    await supabaseSignOut();
    router.push("/");
  }

  if (unavailable) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-md px-6 py-32 text-center">
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
        </main>
        <SiteFooter />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-6 py-40 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
            Loading account...
          </p>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") {
      router.replace("/login?next=/account");
    }
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-md px-6 py-32 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
            Redirecting to sign in...
          </p>
        </main>
        <SiteFooter />
      </>
    );
  }

  const firstName = profile?.full_name?.split(/\s+/)[0] ?? null;
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
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
        {welcome ? <WelcomePill email={user.email ?? ""} /> : null}

        {/* Identity card — verified pill + name + email + member since */}
        <section>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-3">
            A C C O U N T
          </p>
          <h1 className="text-[clamp(28px,4vw,40px)] font-light tracking-tight">
            {firstName
              ? `Welcome back, ${firstName}.`
              : "Welcome to VialChem Labs."}
          </h1>
          <Card className="mt-4 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <Pill variant="electric">Verified</Pill>
              <span className="text-[15px] font-medium">
                {profile?.full_name ?? user.email}
              </span>
              <span className="text-[14px] text-slate-500">{user.email}</span>
              {memberSince && (
                <span className="text-[13px] text-slate-500">
                  · Member since {memberSince}
                </span>
              )}
            </div>
          </Card>
        </section>

        {/* Your next steps — 3 tiles */}
        <section>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500 mb-3">
            Your next steps
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link href="/shop">
              <Card className="h-full p-5 hover:border-[var(--accent)] transition-colors">
                <p className="text-[15px] font-medium">Shop catalog</p>
                <p className="mt-1 text-[13px] text-slate-600">
                  Browse research-grade vials with public lab reports.
                </p>
              </Card>
            </Link>
            <Link href="/verify">
              <Card className="h-full p-5 hover:border-[var(--accent)] transition-colors">
                <p className="text-[15px] font-medium">View lab reports</p>
                <p className="mt-1 text-[13px] text-slate-600">
                  COA-verified attestations for every SKU.
                </p>
              </Card>
            </Link>
            <Link href="/account/security">
              <Card className="h-full p-5 hover:border-[var(--accent)] transition-colors">
                <p className="text-[15px] font-medium">Manage your profile</p>
                <p className="mt-1 text-[13px] text-slate-600">
                  Password, sign out everywhere, delete account.
                </p>
              </Card>
            </Link>
          </div>
        </section>

        {/* Recent orders */}
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
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
                    <div className="h-5 w-24 bg-slate-200 rounded mb-2" />
                    <div className="h-3 w-32 bg-slate-200 rounded" />
                  </Card>
                </li>
              ))}
            </ul>
          ) : recentOrders.length > 0 ? (
            <ul className="space-y-3">
              {recentOrders.map((o) => (
                <li key={o.display_id}>
                  <Link href={`/account/orders/${o.display_id}`} className="block">
                    <Card className="p-4 flex flex-wrap items-center justify-between gap-4 hover:border-[var(--accent)] transition-colors">
                      <div>
                        <p className="font-mono text-[14px] tabular-nums">
                          {o.display_id}
                        </p>
                        <p className="text-[12px] text-slate-500 mt-1">
                          {new Date(o.placed_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Pill variant={statusVariant(o.status)}>
                          {statusLabel(o.status)}
                        </Pill>
                        <span className="font-mono tabular-nums text-[14px]">
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
              <p className="text-[14px] text-slate-600 leading-[1.55] mb-4">
                You haven&rsquo;t placed an order yet. Browse the catalog to
                place your first one.
              </p>
              <Link href="/shop" className={buttonClassNames("outline", "sm")}>
                Browse the catalog →
              </Link>
            </Card>
          )}
        </section>

        {/* Account details */}
        <section>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500 mb-3">
            Account details
          </p>
          <Card className="p-0 overflow-hidden">
            {profileLoading ? (
              <div className="p-6 text-sm text-slate-500">
                Loading account details...
              </div>
            ) : (
              <dl className="divide-y divide-slate-200">
                <Row
                  label="Name"
                  value={profile?.full_name ?? "Not set"}
                  href="/account/security"
                  hrefLabel="Edit"
                />
                <Row
                  label="Email"
                  value={user.email ?? ""}
                  href="/account/security"
                  hrefLabel="Edit"
                />
                <Row
                  label="Phone"
                  value={profile?.phone ?? "Not set"}
                  href="/account/security"
                  hrefLabel="Edit"
                />
                <Row
                  label="Research org"
                  value={
                    profile
                      ? ORG_TYPE_LABELS[profile.research_org_type] ??
                        profile.research_org_type
                      : "Not set"
                  }
                  href="/account/security"
                  hrefLabel="Edit"
                />
                <Row
                  label="Mailing address"
                  value="Manage on the Addresses tab"
                  href="/account/addresses"
                  hrefLabel="Edit"
                />
              </dl>
            )}
          </Card>
        </section>

        <section className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={handleSignOut}>
            Sign out
          </Button>
          <Link
            href="/account/security"
            className={buttonClassNames("outline", "md")}
          >
            Account settings
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Row({
  label,
  value,
  href,
  hrefLabel,
}: {
  label: string;
  value: string;
  href: string;
  hrefLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-[14px]">
      <dt className="font-medium text-slate-700">{label}</dt>
      <dd className="flex items-center gap-3">
        <span className="text-slate-700">{value}</span>
        <Link
          href={href}
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] hover:text-[var(--accent-soft)]"
        >
          {hrefLabel}
        </Link>
      </dd>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountDashboardInner />
    </Suspense>
  );
}
