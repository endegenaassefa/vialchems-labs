"use client";

import Link from "next/link";
import { useState } from "react";

import { OrderSummary } from "@/components/checkout/order-summary";
import { PaymentStep } from "@/components/checkout/payment-step";
import { ShippingForm } from "@/components/checkout/shipping-form";
import type { HostedPaymentSession } from "@/lib/payments";
import { useCartStore } from "@/lib/cart-store";
import { getCartCatalogNotice, useCartCatalogRows } from "@/lib/use-cart-catalog";

type ShippingValues = {
  shippingName: string;
  shippingAddressLine1: string;
  shippingAddressLine2: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
};

type ShippingErrors = Partial<Record<keyof ShippingValues, string>>;

const initialShipping: ShippingValues = {
  shippingName: "",
  shippingAddressLine1: "",
  shippingAddressLine2: "",
  shippingCity: "",
  shippingState: "",
  shippingPostalCode: "",
  shippingCountry: "US"
};

function createIdempotencyKey() {
  return crypto.randomUUID();
}

export function CheckoutFlow() {
  const { items, clear } = useCartStore();
  const catalogState = useCartCatalogRows(items);
  const { rows, loading: loadingProducts } = catalogState;
  const catalogNotice = getCartCatalogNotice(catalogState);
  const [shipping, setShipping] = useState<ShippingValues>(initialShipping);
  const [shippingErrors, setShippingErrors] = useState<ShippingErrors>({});
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [paymentActionLoading, setPaymentActionLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentSession, setPaymentSession] = useState<HostedPaymentSession | null>(null);
  const [idempotencyKey] = useState(createIdempotencyKey);

  const subtotalCents = rows.reduce(
    (sum, row) => sum + row.product.priceCents * row.item.quantity,
    0
  );

  function setShippingField(field: keyof ShippingValues, value: string) {
    setShipping((current) => ({
      ...current,
      [field]: value
    }));

    if (shippingErrors[field]) {
      setShippingErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  function validateShipping() {
    const errors: ShippingErrors = {};
    if (!shipping.shippingName.trim()) errors.shippingName = "Shipping name is required.";
    if (!shipping.shippingAddressLine1.trim()) errors.shippingAddressLine1 = "Address line 1 is required.";
    if (!shipping.shippingCity.trim()) errors.shippingCity = "City is required.";
    if (!shipping.shippingState.trim()) errors.shippingState = "State is required.";
    if (!shipping.shippingPostalCode.trim()) errors.shippingPostalCode = "Postal code is required.";
    if (!shipping.shippingCountry.trim()) errors.shippingCountry = "Country is required.";
    if (shipping.shippingCountry.trim().toUpperCase() !== "US") {
      errors.shippingCountry = "The first live checkout pilot only supports US shipping.";
    }
    return errors;
  }

  async function openHostedPayment(nextOrderId: string) {
    setPaymentError(null);
    setPaymentActionLoading(true);

    try {
      const paymentResponse = await fetch("/api/payments/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderId: nextOrderId
        })
      });

      const paymentPayload = await paymentResponse.json().catch(() => null);
      if (!paymentResponse.ok) {
        setPaymentError(paymentPayload?.error ?? "Payment could not be initialized.");
        setPaymentActionLoading(false);
        return;
      }

      const nextSession = paymentPayload?.paymentSession ?? null;
      setPaymentSession(nextSession);

      if (!nextSession?.hostedUrl) {
        setPaymentError("Hosted payment is unavailable for this order. Retry setup or contact support.");
        setPaymentActionLoading(false);
        return;
      }

      clear();
      window.location.assign(nextSession.hostedUrl);
    } catch {
      setPaymentError("Payment could not be initialized.");
      setPaymentActionLoading(false);
    }
  }

  async function handleContinueToPayment() {
    setCheckoutError(null);
    setPaymentError(null);

    if (catalogNotice) {
      setCheckoutError(catalogNotice);
      return;
    }

    const errors = validateShipping();
    setShippingErrors(errors);

    if (Object.keys(errors).length) {
      setCheckoutError("Fix the highlighted shipping fields before continuing.");
      return;
    }

    if (!rows.length) {
      setCheckoutError("Your cart is empty.");
      return;
    }

    setCreatingOrder(true);

    try {
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: rows.map((row) => ({
            productId: row.item.productId,
            quantity: row.item.quantity
          })),
          ...shipping,
          idempotencyKey
        })
      });

      const orderPayload = await orderResponse.json().catch(() => null);
      if (!orderResponse.ok) {
        setCheckoutError(orderPayload?.error ?? "The order could not be created.");
        setCreatingOrder(false);
        return;
      }

      setOrderId(orderPayload.id);
      setCreatingOrder(false);
      await openHostedPayment(orderPayload.id);
    } catch {
      setCheckoutError("Checkout could not be prepared right now.");
      setCreatingOrder(false);
    }
  }

  async function handleOpenHostedPayment() {
    if (!orderId) {
      return;
    }

    if (paymentSession?.hostedUrl) {
      setPaymentActionLoading(true);
      setPaymentError(null);
      clear();
      window.location.assign(paymentSession.hostedUrl);
      return;
    }

    await openHostedPayment(orderId);
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="metal rounded-[28px] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Checkout
          </p>
          <h1 className="mt-3 text-4xl font-black text-white">Your cart is empty</h1>
          <p className="mt-4 text-[var(--text-muted)]">
            Add products from the shop before starting checkout.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black"
          >
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
      <div className="space-y-6">
        <section className="metal rounded-[28px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Protected checkout
          </p>
          <h1 className="mt-2 text-4xl font-black text-white">
            Shipping and payment
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
            This first-sale pilot is limited to selected live SKUs and US shipping.
            Keep the summary visible while you confirm the destination. Final shipping
            and tax are locked in the hosted payment step before payment is submitted.
          </p>
        </section>

        {catalogNotice ? (
          <div className="rounded-[22px] border border-[#7a2a22] bg-[#210b08] p-4 text-sm text-[#ffb1a3]">
            {catalogNotice}
          </div>
        ) : null}
        {checkoutError ? (
          <div className="rounded-[22px] border border-[#7a2a22] bg-[#210b08] p-4 text-sm text-[#ffb1a3]">
            {checkoutError}
          </div>
        ) : null}

        <ShippingForm
          values={shipping}
          errors={shippingErrors}
          locked={Boolean(orderId)}
          loading={creatingOrder}
          submitDisabled={Boolean(catalogNotice)}
          onChange={setShippingField}
          onSubmit={handleContinueToPayment}
        />

        {orderId ? (
          <PaymentStep
            orderId={orderId}
            paymentSession={paymentSession}
            subtotalCents={subtotalCents}
            shippingCents={paymentSession?.shippingCents ?? null}
            taxCents={paymentSession?.taxCents ?? null}
            totalCents={paymentSession?.totalCents ?? null}
            processing={paymentActionLoading}
            error={paymentError}
            onSubmit={handleOpenHostedPayment}
          />
        ) : null}
      </div>

      <OrderSummary
        rows={rows}
        subtotalCents={subtotalCents}
        shippingCents={paymentSession?.shippingCents ?? null}
        taxCents={paymentSession?.taxCents ?? null}
        totalCents={paymentSession?.totalCents ?? null}
        orderId={orderId}
        loading={loadingProducts}
        notice={rows.length ? catalogNotice : null}
        emptyMessage={catalogNotice ?? "Your cart is empty."}
      />
    </div>
  );
}
