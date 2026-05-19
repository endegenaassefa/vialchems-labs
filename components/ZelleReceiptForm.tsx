"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/v2/icons";

interface ZelleReceiptFormProps {
  order: string;
  amountCents: number;
  recipientName: string;
  recipientHandle: string;
  memo: string;
  zelleEmail?: string | null;
  supportEmail?: string | null;
  qrImageUrl?: string | null;
  signature: string;
}

export function ZelleReceiptForm({
  order,
  amountCents,
  recipientName,
  recipientHandle,
  memo,
  zelleEmail,
  supportEmail,
  qrImageUrl,
  signature,
}: ZelleReceiptFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      order,
      amountCents,
      recipientName,
      recipientHandle,
      memo,
      zelleEmail: zelleEmail ?? "",
      supportEmail: supportEmail ?? "",
      qrImageUrl: qrImageUrl ?? "",
      sig: signature,
      customer: {
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        senderName: String(form.get("senderName") ?? ""),
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
      response = await fetch("/api/zelle/receipt", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      setPending(false);
      setError("Unable to submit receipt. Please try again.");
      return;
    }

    const body = (await response.json().catch(() => null)) as {
      ok?: boolean;
      message?: string;
    } | null;

    if (!response.ok || !body?.ok) {
      setPending(false);
      setError(body?.message ?? "Receipt could not be submitted.");
      return;
    }

    router.push(
      `/order-confirmed?order=${encodeURIComponent(order)}&payment=zelle`,
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "grid", gap: 10 }}>
        <div>
          <label className="label" htmlFor="zelle-name">
            Buyer name
          </label>
          <input
            className="input"
            id="zelle-name"
            name="name"
            autoComplete="name"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="zelle-email">
            Email
          </label>
          <input
            className="input"
            id="zelle-email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="zelle-sender-name">
            Bank sender name
          </label>
          <p
            id="zelle-sender-name-help"
            className="mt-1 text-[12px] italic text-[var(--fg-muted)]"
          >
            Use only if the name in your bank app differs from the buyer name.
          </p>
          <input
            className="input"
            id="zelle-sender-name"
            name="senderName"
            autoComplete="off"
            aria-describedby="zelle-sender-name-help"
          />
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <div>
          <label className="label" htmlFor="zelle-street">
            Shipping street
          </label>
          <input
            className="input"
            id="zelle-street"
            name="street"
            autoComplete="shipping address-line1"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="zelle-street2">
            Apt / suite
          </label>
          <input
            className="input"
            id="zelle-street2"
            name="street2"
            autoComplete="shipping address-line2"
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 84px 120px",
            gap: 10,
          }}
        >
          <div>
            <label className="label" htmlFor="zelle-city">
              City
            </label>
            <input
              className="input"
              id="zelle-city"
              name="city"
              autoComplete="shipping address-level2"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="zelle-state">
              State
            </label>
            <input
              className="input mono"
              id="zelle-state"
              name="stateCode"
              autoComplete="shipping address-level1"
              maxLength={2}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="zelle-zip">
              ZIP
            </label>
            <input
              className="input mono"
              id="zelle-zip"
              name="zip"
              autoComplete="shipping postal-code"
              required
            />
          </div>
        </div>
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
          I sent the exact Zelle amount with the memo shown above and understand
          staff will verify receipt before dispatch.
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
        {pending ? "Submitting receipt..." : "Submit Zelle receipt"}
        {!pending ? <Icon.arrow size={14} strokeWidth={1.5} /> : null}
      </button>
    </form>
  );
}
