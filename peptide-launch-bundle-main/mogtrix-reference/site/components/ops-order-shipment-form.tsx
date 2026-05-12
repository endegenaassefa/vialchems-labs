"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function OpsOrderShipmentForm({
  orderId,
  trackingReference: initialTrackingReference,
  trackingUrl: initialTrackingUrl,
  shipmentNote: initialShipmentNote
}: {
  orderId: string;
  trackingReference?: string | null;
  trackingUrl?: string | null;
  shipmentNote?: string | null;
}) {
  const router = useRouter();
  const [trackingReference, setTrackingReference] = useState(initialTrackingReference ?? "");
  const [trackingUrl, setTrackingUrl] = useState(initialTrackingUrl ?? "");
  const [shipmentNote, setShipmentNote] = useState(initialShipmentNote ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);

    const response = await fetch(`/api/ops/orders/${orderId}/shipment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trackingReference,
        trackingUrl,
        shipmentNote
      })
    });
    const payload = await response.json().catch(() => null);

    setSubmitting(false);
    if (!response.ok) {
      setError(payload?.error ?? "The shipment update could not be saved.");
      return;
    }

    router.refresh();
  }

  return (
    <form className="grid gap-3" onSubmit={submit}>
      <label className="grid gap-2">
        <span className="text-sm text-[var(--text-muted)]">Tracking reference</span>
        <input
          value={trackingReference}
          onChange={(event) => setTrackingReference(event.target.value)}
          className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm text-[var(--text-muted)]">Tracking URL</span>
        <input
          value={trackingUrl}
          onChange={(event) => setTrackingUrl(event.target.value)}
          className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm text-[var(--text-muted)]">Shipment note</span>
        <textarea
          value={shipmentNote}
          onChange={(event) => setShipmentNote(event.target.value)}
          rows={4}
          className="rounded-2xl border border-[var(--border)] bg-black px-4 py-3 text-white"
        />
      </label>
      {error ? <p className="text-sm text-[#ffb1a3]">{error}</p> : null}
      <button className="min-h-11 rounded-2xl bg-[var(--accent)] px-5 text-sm font-bold text-black" disabled={submitting}>
        {submitting ? "Saving..." : "Save shipment update"}
      </button>
    </form>
  );
}
