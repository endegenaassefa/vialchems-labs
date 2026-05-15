"use client";

import type { ComponentType } from "react";
import {
  Apple,
  BadgeDollarSign,
  Bitcoin,
  CreditCard,
  Landmark,
  Smartphone,
} from "lucide-react";

export type CheckoutPaymentMethod =
  | "link_money"
  | "bitcoin"
  | "card"
  | "apple_pay"
  | "google_pay"
  | "paypal";

interface PaymentMethod {
  id: CheckoutPaymentMethod;
  title: string;
  description: string;
  badge: string;
  Icon: ComponentType<{ size?: number; strokeWidth?: number }>;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "link_money",
    title: "Link Money",
    description: "Pay by bank at secure checkout.",
    badge: "Bank",
    Icon: Landmark,
  },
  {
    id: "bitcoin",
    title: "Bitcoin",
    description: "BTCPay Server invoice at checkout.",
    badge: "Crypto",
    Icon: Bitcoin,
  },
  {
    id: "card",
    title: "Cards",
    description: "Credit and debit cards where enabled.",
    badge: "Card",
    Icon: CreditCard,
  },
  {
    id: "apple_pay",
    title: "Apple Pay",
    description: "Shown when supported by the checkout browser.",
    badge: "Wallet",
    Icon: Apple,
  },
  {
    id: "google_pay",
    title: "Google Pay",
    description: "Shown when supported by the checkout browser.",
    badge: "Wallet",
    Icon: Smartphone,
  },
  {
    id: "paypal",
    title: "PayPal",
    description: "Available when enabled for the order.",
    badge: "PayPal",
    Icon: BadgeDollarSign,
  },
];

interface PaymentMethodSelectorProps {
  value: CheckoutPaymentMethod;
  onChange: (method: CheckoutPaymentMethod) => void;
}

export function PaymentMethodSelector({
  value,
  onChange,
}: PaymentMethodSelectorProps) {
  return (
    <fieldset className="v2-payment-selector">
      <legend className="eyebrow">Secure checkout payment options</legend>
      <p className="v2-payment-selector-copy">
        Available at secure checkout on shop.vialchemlabs.net.
      </p>
      <div className="v2-payment-grid">
        {paymentMethods.map((method) => {
          const selected = value === method.id;
          return (
            <label
              key={method.id}
              className="v2-payment-option"
              data-selected={selected ? "true" : "false"}
            >
              <input
                type="radio"
                name="preferred-payment-method"
                value={method.id}
                checked={selected}
                onChange={() => onChange(method.id)}
              />
              <span className="v2-payment-icon" aria-hidden="true">
                <method.Icon size={16} strokeWidth={1.6} />
              </span>
              <span className="v2-payment-text">
                <span className="v2-payment-title-row">
                  <span>{method.title}</span>
                  <span className="badge">{method.badge}</span>
                </span>
                <span className="v2-payment-description">
                  {method.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
