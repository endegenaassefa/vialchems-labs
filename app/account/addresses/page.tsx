"use client";

/**
 * /account/addresses — mailing + shipping editor.
 *
 * Spec §3.5 Tab 2. Loads existing addresses from
 * GET /api/account/addresses, edits in place via AddressFields,
 * saves via PUT /api/account/addresses (upsert semantics).
 *
 * "Same as mailing" checkbox controls the shipping panel:
 *   - checked: shipping section hidden + existing shipping row
 *     is deleted on save
 *   - unchecked: shipping section visible + upserted on save
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import {
  AddressFields,
  emptyAddress,
  type AddressValue,
} from "@/components/account/AddressFields";
import { useSupabaseUser } from "@/lib/auth/use-supabase-user";

interface AddressRow {
  street1: string;
  street2: string | null;
  city: string;
  region: string;
  postal_code: string;
  country: string;
}

function toValue(r: AddressRow | null): AddressValue {
  if (!r) return emptyAddress();
  return {
    street1: r.street1,
    street2: r.street2 ?? "",
    city: r.city,
    region: r.region,
    postal_code: r.postal_code,
    country: r.country,
  };
}

export default function AddressesPage() {
  const router = useRouter();
  const { user, session, loading, unavailable } = useSupabaseUser();

  const [mailing, setMailing] = useState<AddressValue>(emptyAddress());
  const [shipping, setShipping] = useState<AddressValue>(emptyAddress());
  const [shipSame, setShipSame] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [topError, setTopError] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !user || !session?.access_token) return;
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/account/addresses", {
          headers: { Authorization: `Bearer ${session!.access_token}` },
        });
        if (!res.ok) {
          if (!cancelled) setPageLoading(false);
          return;
        }
        const body = (await res.json()) as {
          mailing: AddressRow | null;
          shipping: AddressRow | null;
          shipping_same_as_mailing: boolean;
        };
        if (cancelled) return;
        setMailing(toValue(body.mailing));
        setShipping(toValue(body.shipping));
        setShipSame(body.shipping_same_as_mailing);
      } catch {
        // silent — page renders with empty inputs
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [loading, user, session]);

  if (unavailable || (!loading && !user)) {
    if (typeof window !== "undefined" && !loading && !user) {
      router.replace("/login?next=/account/addresses");
    }
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-md px-6 py-32 text-center">
          <p className="text-sm text-slate-500">
            {unavailable
              ? "Account is temporarily unavailable."
              : "Redirecting to sign in..."}
          </p>
        </main>
        <SiteFooter />
      </>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setTopError(null);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${session!.access_token}`,
        },
        body: JSON.stringify({
          mailing,
          shipping_same_as_mailing: shipSame,
          shipping: shipSame ? undefined : shipping,
        }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { code?: string };
        setTopError(
          body.code === "invalid_body"
            ? "Some fields are invalid. Check city / postal code / country."
            : "Could not save addresses. Try again.",
        );
        return;
      }
      setSavedAt(Date.now());
    } catch {
      setTopError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-12">
        <header>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-2">
            A C C O U N T · A D D R E S S E S
          </p>
          <h1 className="text-3xl font-semibold">Mailing + shipping</h1>
          <p className="mt-2 text-sm text-slate-600">
            One mailing address and one shipping address per account. These
            populate the checkout form by default but don&rsquo;t replace it —
            you can change the destination per order at checkout.
          </p>
        </header>

        <Link
          href="/account"
          className="text-sm text-slate-700 underline underline-offset-2"
        >
          ← Back to dashboard
        </Link>

        {pageLoading ? (
          <Card>
            <p className="p-6 text-sm text-slate-500">Loading addresses...</p>
          </Card>
        ) : (
          <form className="flex flex-col gap-6" onSubmit={onSubmit} noValidate>
            {topError && (
              <div
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
              >
                {topError}
              </div>
            )}
            {savedAt !== null && <Pill variant="electric">Saved · just now</Pill>}

            <Card>
              <div className="flex flex-col gap-3 p-5">
                <h2 className="text-lg font-medium">Mailing address</h2>
                <AddressFields
                  prefix="addr-mailing"
                  value={mailing}
                  onChange={setMailing}
                  required
                />
              </div>
            </Card>

            <Card>
              <div className="flex flex-col gap-3 p-5">
                <h2 className="text-lg font-medium">Shipping address</h2>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={shipSame}
                    onChange={(e) => setShipSame(e.target.checked)}
                  />
                  <span>Shipping address is the same as mailing</span>
                </label>
                {!shipSame && (
                  <AddressFields
                    prefix="addr-shipping"
                    value={shipping}
                    onChange={setShipping}
                    required
                  />
                )}
              </div>
            </Card>

            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving..." : "Save addresses"}
            </Button>
          </form>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
