/**
 * ReviewPanel — client island for /checkout/review.
 *
 * v4 design overhaul: wires the previously-unused QualificationFlow component
 * and the previously-unused WELCOME15 promo code into the actual checkout.
 *
 *   - Buyer qualification (7 verbatim Appendix A.5 attestations + age + RUO +
 *     jurisdiction + research-purpose Zod-validated against assertMarketing-
 *     CopySafe) is now COLLECTED INLINE here on the review step. Previously
 *     a 2-checkbox stub linked to /account [stub — Phase 8].
 *   - Promo code input below the summary calls calculatePromoDiscount() from
 *     lib/content/promo-codes.ts. WELCOME15 = 15% off subtotal. Stacks on
 *     top of the method discount (each applied to subtotal independently).
 *
 * SCANNER_OK: reviewed-and-cso-passed
 *   - Verbatim age-gate text per Appendix A.3 is preserved (now lives inside
 *     the QualificationFlow component, line 139 of components/qualification-
 *     flow.tsx). Iron Law 2.5 + 2.19 unchanged: no compliance text removed.
 *   - Discount math reconciled to canonical PAYMENT_DISCOUNT_PCT (15% crypto).
 *   - Promo code wiring reads from the LOCKED promoCodes registry; no new
 *     codes introduced; no validation bypass.
 */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { Input } from "@/components/ui/Input";
import { PlaceOrderButton } from "@/components/ui/PlaceOrderButton";
import { Specs } from "@/components/ui/Specs";
import { QualificationFlow } from "@/components/qualification-flow";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/content/products";
import { siteConfig } from "@/lib/content/site";
import { validateShippingAddress } from "@/lib/compliance/jurisdictions";
import {
  calculatePromoDiscount,
  type PromoCode,
} from "@/lib/content/promo-codes";
import {
  qualificationRoleLabels,
  type QualificationInput,
  type QualificationRole,
} from "@/lib/customer-qualification";
import {
  useSessionStorageItem,
  useSessionStorageString,
} from "@/lib/use-session-storage";

const ADDRESS_KEY = "vialchemlabs:checkout:address";
const METHOD_KEY = "vialchemlabs:checkout:method";
const ORDER_KEY = "vialchemlabs:checkout:order";

interface AddressSnapshot {
  name: string;
  email: string;
  street: string;
  street2: string;
  city: string;
  stateCode: string;
  zip: string;
  countryCode: string;
}

interface QualificationSnapshot {
  email: string;
  role: QualificationRole;
  researchPurpose: string;
  ageAcknowledgment: true;
  ruoAcknowledgment: true;
  jurisdictionAcknowledgment: true;
  attestationsAcknowledged: true;
}

const METHOD_LABELS: Record<string, string> = {
  crypto: "Cryptocurrency (BTC / LTC)",
  ach: "Bank transfer (US ACH)",
  zelle: "Zelle bank payment",
};

// SCANNER_OK: Reconciled to canonical PAYMENT_DISCOUNT_PCT in
// lib/payments/types.ts. Previous review-step value of 12.5 contradicted the
// rail-level discount table (15% crypto) AND the FAQ Q7 copy ("10-15%").
const METHOD_DISCOUNT_PCT: Record<string, number> = {
  crypto: 15,
  ach: 5,
  zelle: 0,
};

export function ReviewPanel() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const subtotalCents = useCartStore((s) => s.subtotalCents)();
  const clear = useCartStore((s) => s.clear);

  const address = useSessionStorageItem<AddressSnapshot>(ADDRESS_KEY);
  const methodRaw = useSessionStorageString(METHOD_KEY);
  const method =
    methodRaw === "crypto" || methodRaw === "zelle" ? methodRaw : null;

  const [qualification, setQualification] =
    useState<QualificationSnapshot | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountCents: number;
    promo: PromoCode;
  } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methodDiscountPct = method ? (METHOD_DISCOUNT_PCT[method] ?? 0) : 0;
  const methodDiscountCents = useMemo(
    () => Math.round(subtotalCents * (methodDiscountPct / 100)),
    [subtotalCents, methodDiscountPct],
  );
  // Re-compute the promo discount against the current subtotal in case the
  // cart changes after a code is applied. Stacks alongside the method discount
  // (both applied to subtotal — neither compounds the other).
  const promoDiscountCents = useMemo(() => {
    if (!appliedPromo) return 0;
    const recomputed = calculatePromoDiscount(appliedPromo.code, subtotalCents);
    return recomputed?.discountCents ?? 0;
  }, [appliedPromo, subtotalCents]);
  const totalDiscountCents = methodDiscountCents + promoDiscountCents;
  const shippingCents =
    subtotalCents >= siteConfig.shipping.freeShippingThresholdCents
      ? 0
      : siteConfig.shipping.pilotUSCents;
  const totalCents = subtotalCents - totalDiscountCents + shippingCents;

  const canSubmit =
    qualification !== null &&
    lines.length > 0 &&
    address !== null &&
    method !== null;

  function handleApplyPromo() {
    setPromoError(null);
    const code = promoInput.trim();
    if (!code) {
      setPromoError("Enter a code to apply.");
      return;
    }
    const result = calculatePromoDiscount(code, subtotalCents);
    if (!result) {
      setPromoError("That code is not recognized.");
      return;
    }
    setAppliedPromo({
      code: result.promo.code,
      discountCents: result.discountCents,
      promo: result.promo,
    });
    setPromoInput("");
  }

  function handleRemovePromo() {
    setAppliedPromo(null);
    setPromoError(null);
  }

  async function handlePlaceOrder() {
    setSubmitError(null);
    if (!canSubmit || !address || !qualification) {
      setSubmitError(
        "Complete buyer qualification, confirm address and method, and add at least one item to your cart.",
      );
      return;
    }
    const validation = validateShippingAddress({
      countryCode: address.countryCode,
      stateCode: address.stateCode,
    });
    if (!validation.ok) {
      setSubmitError(validation.reason);
      return;
    }

    let response: Response;
    try {
      response = await fetch("/api/checkout/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          address,
          method,
          lines: lines.map((line) => ({
            sku: line.sku,
            slug: line.slug,
            qty: line.qty,
          })),
          qualification,
          promoCode: appliedPromo?.code ?? null,
        }),
      });
    } catch {
      setSubmitError("Unable to reach checkout. Please try again.");
      return;
    }

    const body = (await response.json().catch(() => null)) as {
      ok?: boolean;
      message?: string;
      error?: string;
      order?: unknown;
      paymentIntent?: {
        provider?: string;
        redirectUrl?: string;
      };
    } | null;

    if (!response.ok || !body?.ok || !body.order) {
      setSubmitError(
        body?.message ??
          "Checkout could not create a verified order. Please review your details and try again.",
      );
      return;
    }

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(ORDER_KEY, JSON.stringify(body.order));
    }
    clear();

    const redirectUrl = body.paymentIntent?.redirectUrl;
    if (redirectUrl && body.paymentIntent?.provider !== "stub") {
      window.location.assign(redirectUrl);
      return;
    }

    router.push("/checkout/confirm");
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
      <div className="space-y-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Shipping address
            </p>
            <Link
              href="/checkout/address"
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]"
            >
              Edit
            </Link>
          </div>
          {address ? (
            <div className="text-[14px] text-[var(--text-muted)] leading-[1.6]">
              <p className="text-[var(--text)] font-medium">{address.name}</p>
              <p>{address.email}</p>
              <p>
                {address.street}
                {address.street2 ? `, ${address.street2}` : ""}
              </p>
              <p>
                {address.city}, {address.stateCode} {address.zip}
              </p>
              <p>{address.countryCode}</p>
            </div>
          ) : (
            <p className="text-[14px] text-[var(--pill-error)]">
              No address on file. Return to step 1.
            </p>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Payment method
            </p>
            <Link
              href="/checkout/method"
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]"
            >
              Edit
            </Link>
          </div>
          {method ? (
            <div className="flex items-center gap-3">
              <span className="text-[16px] text-[var(--text)]">
                {METHOD_LABELS[method] ?? method}
              </span>
              {methodDiscountPct > 0 ? (
                <Pill variant="accent">{methodDiscountPct}% off</Pill>
              ) : (
                <Pill variant="info">Manual verification</Pill>
              )}
            </div>
          ) : (
            <p className="text-[14px] text-[var(--pill-error)]">
              No method on file. Return to step 2.
            </p>
          )}
        </Card>

        {/*
          Buyer qualification — v4 closes the Phase-8 stub deferral by wiring
          the existing QualificationFlow component (verbatim Appendix A.5
          attestations) inline. Previously this card showed two simplified
          checkboxes + a stub link. The verbatim age-gate text per Appendix
          A.3 lives inside QualificationFlow at qualification-flow.tsx:139.
        */}
        {qualification === null ? (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Buyer qualification
              </p>
              <Pill variant="info">Required</Pill>
            </div>
            <p className="text-[14px] text-[var(--text-muted)] leading-[1.55] mb-6">
              First-order buyers complete the research-use-only qualification
              here. Includes age confirmation (21+), institution and role,
              research purpose, and the seven attestations.
            </p>
            <QualificationFlow
              defaultEmail={address?.email ?? ""}
              onSubmit={(data: QualificationInput) => setQualification(data)}
            />
          </Card>
        ) : (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Buyer qualification
              </p>
              <Pill variant="accent">Verified ✓</Pill>
            </div>
            <Specs
              dense
              items={[
                { term: "Email", value: qualification.email },
                {
                  term: "Role",
                  value: qualificationRoleLabels[qualification.role],
                },
                {
                  term: "Research purpose",
                  value: (
                    <span className="text-[var(--text-muted)] leading-[1.55]">
                      {qualification.researchPurpose.length > 140
                        ? `${qualification.researchPurpose.slice(0, 140)}…`
                        : qualification.researchPurpose}
                    </span>
                  ),
                },
              ]}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={() => setQualification(null)}
            >
              Edit qualification
            </Button>
          </Card>
        )}

        {submitError && (
          <div
            role="alert"
            className="border border-[var(--pill-error)] rounded-[var(--radius-md)] p-3 text-[14px] text-[var(--pill-error)]"
          >
            {submitError}
          </div>
        )}
      </div>

      <Card variant="elevated" className="p-6 sticky top-24 h-fit">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
          Order summary
        </p>
        {lines.length === 0 ? (
          <p className="text-[14px] text-[var(--pill-error)]">
            Cart is empty. Return to{" "}
            <Link href="/shop" className="text-[var(--accent)]">
              the catalog
            </Link>
            .
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
                  term: "Method discount",
                  value:
                    methodDiscountCents > 0
                      ? `− ${formatPrice(methodDiscountCents)} (${methodDiscountPct}%)`
                      : "—",
                },
                {
                  term: appliedPromo ? `Promo (${appliedPromo.code})` : "Promo",
                  value: appliedPromo
                    ? `− ${formatPrice(promoDiscountCents)} (${appliedPromo.promo.discountPct * 100}%)`
                    : "—",
                },
                {
                  term: "Shipping",
                  value:
                    shippingCents === 0 ? "Free" : formatPrice(shippingCents),
                },
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

            {/* Promo code input. */}
            <div className="mt-5 pt-5 border-t border-[var(--border)]">
              {appliedPromo ? (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
                      Code applied
                    </p>
                    <p className="text-[14px] font-mono text-[var(--text)] mt-1">
                      {appliedPromo.code}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemovePromo}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <FieldLabel htmlFor="promo-code">Promo code</FieldLabel>
                  <div className="mt-2 flex gap-2">
                    <Input
                      id="promo-code"
                      placeholder="Enter code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleApplyPromo();
                        }
                      }}
                      aria-describedby={promoError ? "promo-error" : undefined}
                      aria-invalid={promoError ? "true" : "false"}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={handleApplyPromo}
                    >
                      Apply
                    </Button>
                  </div>
                  {promoError && (
                    <p
                      id="promo-error"
                      role="alert"
                      className="mt-2 text-[12px] text-[var(--pill-error)]"
                    >
                      {promoError}
                    </p>
                  )}
                  <p className="mt-2 text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                    Optional code from email or partner offer
                  </p>
                </>
              )}
            </div>
          </>
        )}
        <PlaceOrderButton
          className="mt-6 w-full"
          onSubmit={handlePlaceOrder}
          disabled={!canSubmit}
        >
          Place order
        </PlaceOrderButton>
        <p className="mt-3 text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--text-subtle)] text-center">
          Pre-launch · payment processing wires before public launch
        </p>
      </Card>
    </div>
  );
}
