/**
 * MethodForm — client island for /checkout/method.
 *
 * Payment method selection. Production checkout currently allows only crypto,
 * because the Plaid ACH adapter has verification scaffolding but no live
 * create-intent implementation.
 *
 * Side panel: live order summary from useCartStore. Submit persists to
 * sessionStorage and routes to /checkout/review.
 */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Specs } from "@/components/ui/Specs";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/content/products";
import { siteConfig } from "@/lib/content/site";
import { useSessionStorageString } from "@/lib/use-session-storage";

type MethodId = "crypto" | "ach" | "card";

const METHOD_STORAGE_KEY = "vialchemlabs:checkout:method";

export function MethodForm() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const subtotalCents = useCartStore((s) => s.subtotalCents)();
  const stored = useSessionStorageString(METHOD_STORAGE_KEY);
  const initialMethod: MethodId = stored === "crypto" ? stored : "crypto";
  const [override, setOverride] = useState<MethodId | null>(null);
  const method: MethodId = override ?? initialMethod;
  const setMethod = (m: MethodId) => setOverride(m);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (method === "card" || method === "ach") return;
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(METHOD_STORAGE_KEY, method);
    }
    router.push("/checkout/review");
  }

  const shippingCents =
    subtotalCents >= siteConfig.shipping.freeShippingThresholdCents
      ? 0
      : siteConfig.shipping.pilotUSCents;
  const totalCents = subtotalCents + shippingCents;

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-10 lg:grid-cols-[3fr_2fr]"
    >
      <div className="space-y-3">
        <fieldset className="space-y-3">
          <legend className="sr-only">Choose payment method</legend>

          <PaymentOption
            id="method-crypto"
            checked={method === "crypto"}
            onChange={() => setMethod("crypto")}
            title="Cryptocurrency"
            subtitle="BTC · LTC (optional ETH) via self-hosted BTCPay Server"
            badge="Save 10–15%"
            recommended
          />

          <PaymentOption
            id="method-ach"
            checked={false}
            onChange={() => {}}
            title="Bank transfer (US ACH)"
            subtitle="Plaid verification is not enabled for live checkout yet"
            badge="Coming soon"
            disabled
          />

          <PaymentOption
            id="method-card"
            checked={false}
            onChange={() => {}}
            title="Credit / debit card"
            subtitle="Visa · Mastercard · AMEX · Discover"
            badge="Coming soon"
            disabled
          />
        </fieldset>

        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)] mt-6">
          Card networks do not currently support research-peptide categories.
          Crypto and ACH are routed through self-hosted infrastructure.
        </p>

        <div className="flex items-center justify-between pt-6">
          <Link
            href="/checkout/address"
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] hover:text-[var(--accent)]"
          >
            ← Back to address
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={method === "card" || method === "ach"}
          >
            Continue to review
          </Button>
        </div>
      </div>

      <Card variant="elevated" className="p-6 h-fit sticky top-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
          Order summary
        </p>
        {lines.length === 0 ? (
          <p className="text-[14px] text-[var(--text-muted)]">
            Your cart is empty.{" "}
            <Link href="/shop" className="text-[var(--accent)]">
              Add a product →
            </Link>
          </p>
        ) : (
          <>
            <ul className="space-y-2 mb-4 text-[13px]">
              {lines.map((l) => (
                <li
                  key={l.sku}
                  className="flex items-baseline justify-between gap-3"
                >
                  <span className="text-[var(--text-muted)]">
                    {l.name} × {l.qty}
                  </span>
                  <span className="font-mono tabular text-[var(--text)]">
                    {formatPrice(l.unitPriceCents * l.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <Specs
              items={[
                { term: "Subtotal", value: formatPrice(subtotalCents) },
                {
                  term: "Shipping",
                  value:
                    shippingCents === 0 ? "Free" : formatPrice(shippingCents),
                },
                { term: "Discount", value: "— at review" },
                {
                  term: "Total",
                  value: (
                    <span className="text-[18px] font-semibold">
                      {formatPrice(totalCents)}
                    </span>
                  ),
                },
              ]}
            />
          </>
        )}
      </Card>
    </form>
  );
}

interface PaymentOptionProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  subtitle: string;
  badge: string;
  recommended?: boolean;
  disabled?: boolean;
}

function PaymentOption({
  id,
  checked,
  onChange,
  title,
  subtitle,
  badge,
  recommended,
  disabled,
}: PaymentOptionProps) {
  return (
    <label
      htmlFor={id}
      className={[
        "block border rounded-[var(--radius-lg)] p-4 cursor-pointer",
        "transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        disabled
          ? "opacity-60 cursor-not-allowed border-[var(--border)] bg-[var(--surface)]"
          : checked
            ? "border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_8%,transparent)]"
            : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="radio"
          name="payment-method"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="mt-1 h-4 w-4 accent-[var(--accent)]"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[16px] font-medium text-[var(--text)]">
              {title}
            </span>
            <Pill
              variant={disabled ? "info" : recommended ? "accent" : "electric"}
            >
              {badge}
            </Pill>
            {recommended && !disabled && (
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
                Recommended
              </span>
            )}
          </div>
          <p className="text-[13px] text-[var(--text-muted)]">{subtitle}</p>
        </div>
      </div>
    </label>
  );
}
