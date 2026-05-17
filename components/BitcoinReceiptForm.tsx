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

const FIELD_STYLE = {
  width: "100%",
  marginTop: 6,
  padding: "11px 12px",
  border: "1px solid var(--line)",
  borderRadius: "var(--r-sm)",
  background: "var(--bg)",
  color: "var(--fg)",
} as const;

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = true,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label style={{ display: "block", color: "var(--fg-muted)" }}>
      <span>{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={FIELD_STYLE}
      />
    </label>
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
      <Field label="Bitcoin transaction ID" name="txid" />
      <Field label="Buyer name" name="name" autoComplete="name" />
      <Field label="Email" name="email" type="email" />
      <Field label="Shipping street" name="street" />
      <Field label="Apt / suite" name="street2" required={false} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 90px 110px",
          gap: 12,
        }}
      >
        <Field label="City" name="city" />
        <Field label="State" name="stateCode" />
        <Field label="ZIP" name="zip" />
      </div>
      <label
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          color: "var(--fg)",
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        <input name="attestation" type="checkbox" required />
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
      >
        {pending ? "Submitting Bitcoin receipt..." : "Submit Bitcoin receipt"}
      </button>
    </form>
  );
}
