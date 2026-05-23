"use client";

import { useState } from "react";

interface BitcoinReceiptFormProps {
  order: string;
  amountCents: number;
  btcSats: number;
  btcAmount: string;
  btcUsdCents: number;
  address: string;
  rateSource: string;
  quotedAt: string;
  supportEmail: string;
  sig: string;
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = true,
  autoComplete,
  mono = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  /**
   * Render the input with the `.input.mono` variant. The shared
   * `@media (max-width: 860px)` rule in v2-layout.css covers both
   * `.input` and `.input.mono` at 16px so iOS Safari does not
   * auto-zoom on focus (M0a foundation, M0b extends to Bitcoin form).
   */
  mono?: boolean;
}) {
  return (
    <div>
      <label className="label" htmlFor={`btc-${name}`}>
        {label}
      </label>
      <input
        className={mono ? "input mono" : "input"}
        id={`btc-${name}`}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </div>
  );
}

export function BitcoinReceiptForm({
  order,
  amountCents,
  btcSats,
  btcAmount,
  btcUsdCents,
  address,
  rateSource,
  quotedAt,
  supportEmail,
  sig,
}: BitcoinReceiptFormProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      order,
      amountCents,
      btcSats,
      btcAmount,
      btcUsdCents,
      address,
      rateSource,
      quotedAt,
      supportEmail,
      sig,
      txid: String(form.get("txid") ?? ""),
      customer: {
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        street: String(form.get("street") ?? ""),
        street2: String(form.get("street2") ?? ""),
        city: String(form.get("city") ?? ""),
        stateCode: String(form.get("stateCode") ?? "").toUpperCase(),
        zip: String(form.get("zip") ?? ""),
        countryCode: "US",
        attestation: form.get("attestation") === "on",
      },
    };

    let response: Response;
    try {
      response = await fetch("/api/bitcoin/receipt", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      setPending(false);
      setError("Unable to submit Bitcoin receipt. Please try again.");
      return;
    }

    const body = (await response.json().catch(() => null)) as {
      ok?: boolean;
      message?: string;
    } | null;

    if (!response.ok || !body?.ok) {
      setPending(false);
      setError(body?.message ?? "Bitcoin receipt could not be submitted.");
      return;
    }

    window.location.assign(
      `/order-confirmed?order=${encodeURIComponent(order)}&payment=bitcoin`,
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
      <Field label="Bitcoin transaction ID" name="txid" mono />
      <Field label="Buyer name" name="name" autoComplete="name" />
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <Field
        label="Shipping street"
        name="street"
        autoComplete="shipping address-line1"
      />
      <Field
        label="Apt / suite"
        name="street2"
        required={false}
        autoComplete="shipping address-line2"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 84px 120px",
          gap: 10,
        }}
      >
        <Field
          label="City"
          name="city"
          autoComplete="shipping address-level2"
        />
        <Field
          label="State"
          name="stateCode"
          autoComplete="shipping address-level1"
          mono
        />
        <Field
          label="ZIP"
          name="zip"
          autoComplete="shipping postal-code"
          mono
        />
      </div>
      <label
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          color: "var(--fg-muted)",
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        <input
          name="attestation"
          type="checkbox"
          required
          style={{ marginTop: 3, accentColor: "var(--accent)" }}
        />
        <span>
          I sent the exact Bitcoin amount shown above and understand staff will
          verify the transaction before dispatch.
        </span>
      </label>
      {error ? (
        <p className="v2-cart-error" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        className="btn btn-accent btn-lg"
        disabled={pending}
        style={{ justifyContent: "center", width: "100%" }}
      >
        {pending ? "Submitting Bitcoin receipt..." : "Submit Bitcoin receipt"}
      </button>
    </form>
  );
}
