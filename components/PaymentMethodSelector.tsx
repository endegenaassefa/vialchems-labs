"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import {
  Apple,
  BadgeDollarSign,
  Bitcoin,
  CreditCard,
  DollarSign,
  Landmark,
  Smartphone,
} from "lucide-react";
import {
  CHECKOUT_PAYMENT_METHOD_INFO,
  isLiveCheckoutMethod,
  type CheckoutPaymentMethod,
} from "@/lib/checkout/payment-routing";

export type { CheckoutPaymentMethod };

interface PaymentMethod {
  id: CheckoutPaymentMethod;
  title: string;
  description: string;
  badge: string;
  Icon: ComponentType<{ size?: number; strokeWidth?: number }>;
}

const paymentIcons: Record<CheckoutPaymentMethod, PaymentMethod["Icon"]> = {
  link_money: Landmark,
  bitcoin: Bitcoin,
  zelle: DollarSign,
  card: CreditCard,
  apple_pay: Apple,
  google_pay: Smartphone,
  paypal: BadgeDollarSign,
};

const paymentMethods: PaymentMethod[] = CHECKOUT_PAYMENT_METHOD_INFO.map(
  (method) => ({
    ...method,
    Icon: paymentIcons[method.id],
  }),
);

const bitcoinCheckoutEnabled =
  process.env.NEXT_PUBLIC_ENABLE_BITCOIN_CHECKOUT === "true";

type BitcoinAvailability = "off" | "checking" | "ready" | "unavailable";

interface PaymentMethodSelectorProps {
  value: CheckoutPaymentMethod;
  onChange: (method: CheckoutPaymentMethod) => void;
}

export function PaymentMethodSelector({
  value,
  onChange,
}: PaymentMethodSelectorProps) {
  const [bitcoinAvailability, setBitcoinAvailability] =
    useState<BitcoinAvailability>(bitcoinCheckoutEnabled ? "checking" : "off");

  useEffect(() => {
    if (!bitcoinCheckoutEnabled) {
      return;
    }

    const controller = new AbortController();
    fetch("/api/payments/bitcoin/status", {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => {
        setBitcoinAvailability(response.ok ? "ready" : "unavailable");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setBitcoinAvailability("unavailable");
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (value === "bitcoin" && bitcoinAvailability !== "ready") {
      onChange("zelle");
    }
  }, [bitcoinAvailability, onChange, value]);

  return (
    <fieldset className="v2-payment-selector">
      <legend className="eyebrow">Secure checkout payment options</legend>
      <p className="v2-payment-selector-copy">
        Zelle is available on vialchem.labs. Bitcoin activates after endpoint
        checks pass; additional checkout methods are coming soon.
      </p>
      <div className="v2-payment-grid">
        {paymentMethods.map((method) => {
          const selected = value === method.id;
          const live = isLiveCheckoutMethod(method.id);
          const bitcoinPaused =
            method.id === "bitcoin" && bitcoinAvailability !== "ready";
          const disabled = !live || bitcoinPaused;
          const bitcoinDescription =
            bitcoinAvailability === "checking"
              ? "Checking Bitcoin checkout availability..."
              : bitcoinAvailability === "unavailable"
                ? "Bitcoin checkout is paused while the payment endpoint is being fixed."
                : "Bitcoin checkout is paused while BTCPay setup is completed.";
          return (
            <label
              key={method.id}
              className="v2-payment-option"
              data-selected={selected ? "true" : "false"}
              data-disabled={disabled ? "true" : "false"}
            >
              <input
                type="radio"
                name="preferred-payment-method"
                value={method.id}
                checked={selected}
                disabled={disabled}
                onChange={() => {
                  if (!disabled) onChange(method.id);
                }}
              />
              <span className="v2-payment-icon" aria-hidden="true">
                <method.Icon size={16} strokeWidth={1.6} />
              </span>
              <span className="v2-payment-text">
                <span className="v2-payment-title-row">
                  <span>{method.title}</span>
                  <span className="badge">
                    {!live
                      ? "Coming soon"
                      : bitcoinPaused
                        ? bitcoinAvailability === "checking"
                          ? "Checking"
                          : "Setup pending"
                        : method.badge}
                  </span>
                </span>
                <span className="v2-payment-description">
                  {!live
                    ? method.description
                    : bitcoinPaused
                      ? bitcoinDescription
                      : method.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
