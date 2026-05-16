"use client";

import type { ComponentType } from "react";
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
        Bitcoin and Zelle stay on vialchemlabs.net. Other methods continue at
        secure checkout.
      </p>
      <div className="v2-payment-grid">
        {paymentMethods.map((method) => {
          const selected = value === method.id;
          const disabled = method.id === "bitcoin" && !bitcoinCheckoutEnabled;
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
                    {disabled ? "Setup pending" : method.badge}
                  </span>
                </span>
                <span className="v2-payment-description">
                  {disabled
                    ? "Bitcoin checkout is paused while BTCPay wallet setup is completed."
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
