"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/button";
import { requiredAttestations } from "@/lib/attestations";
import { useCartStore } from "@/lib/cart-store";
import {
  REQUEST_LIMITS,
  buildResearchRequestPayload,
  getResearchRequestItemCount,
  validateResearchRequest
} from "@/lib/request";

export function RequestForm() {
  const { items, clear } = useCartStore();
  const [attestationIds, setAttestationIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [projectSummary, setProjectSummary] = useState("");

  const summaryLength = projectSummary.length;
  const summaryOver = summaryLength > REQUEST_LIMITS.maxProjectSummaryLength;
  const itemCount = getResearchRequestItemCount(items);
  const itemsOver = itemCount > REQUEST_LIMITS.maxItems;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const data = new FormData(event.currentTarget);
    const form = {
      contactName: String(data.get("contactName") ?? ""),
      organization: String(data.get("organization") ?? ""),
      email: String(data.get("email") ?? ""),
      projectSummary: String(data.get("projectSummary") ?? ""),
      attestationIds
    };
    const validation = validateResearchRequest(form, items);
    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }
    setSubmitting(true);
    setErrors([]);
    const payload = buildResearchRequestPayload(form, items, crypto.randomUUID());
    const response = await fetch("/api/research-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = await response.json().catch(() => null);
    setSubmitting(false);
    if (!response.ok) {
      setErrors([body?.error ?? "The request could not be saved. Check the connection and retry."]);
      return;
    }
    clear();
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="metal rounded-[22px] p-8">
        <p className="text-xs font-semibold uppercase text-[var(--accent)]">Request received for pilot review</p>
        <h1 className="mt-3 text-4xl font-black text-white">Mogtrix recorded the intake request.</h1>
        <p className="mt-4 text-[var(--text-muted)]">No payment was captured. A team member will review the request and handle any offline follow-up.</p>
      </div>
    );
  }

  const summaryColor = summaryOver
    ? "text-[#ff8e7c]"
    : summaryLength > REQUEST_LIMITS.maxProjectSummaryLength * 0.85
      ? "text-[var(--amber)]"
      : "text-[var(--text-muted)]";

  const itemColor = itemsOver
    ? "text-[#ff8e7c]"
    : itemCount > REQUEST_LIMITS.maxItems * 0.85
      ? "text-[var(--amber)]"
      : "text-[var(--text-muted)]";

  return (
    <form className="grid gap-5" onSubmit={submit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span>Contact name</span>
          <input name="contactName" className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white" />
        </label>
        <label className="grid gap-2">
          <span>Organization</span>
          <input name="organization" className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white" />
        </label>
      </div>
      <label className="grid gap-2">
        <span>Email</span>
        <input name="email" type="email" className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white" />
      </label>
      <label className="grid gap-2">
        <div className="flex items-baseline justify-between gap-4">
          <span>Research project summary</span>
          <span className={`text-xs tabular-nums ${summaryColor}`} aria-live="polite">
            {summaryLength.toLocaleString()} / {REQUEST_LIMITS.maxProjectSummaryLength.toLocaleString()}
          </span>
        </div>
        <textarea
          name="projectSummary"
          rows={4}
          maxLength={REQUEST_LIMITS.maxProjectSummaryLength + 200}
          value={projectSummary}
          onChange={(event) => setProjectSummary(event.target.value)}
          className="rounded-2xl border border-[var(--border)] bg-black px-4 py-3 text-white"
        />
      </label>
      <div className={`flex items-center justify-between rounded-2xl border border-[var(--border)] px-4 py-3 text-sm ${itemColor}`}>
        <span>Items in this request</span>
        <span className="font-semibold tabular-nums">
          {itemCount} / {REQUEST_LIMITS.maxItems}
        </span>
      </div>
      <div className="grid gap-3">
        {requiredAttestations.map((attestation) => (
          <label key={attestation.id} className="flex min-h-11 items-start gap-3 rounded-2xl border border-[var(--border)] p-4">
            <input
              className="mt-1 min-h-5 min-w-5 accent-[var(--accent)]"
              type="checkbox"
              checked={attestationIds.includes(attestation.id)}
              onChange={(event) =>
                setAttestationIds((current) => event.target.checked ? [...current, attestation.id] : current.filter((id) => id !== attestation.id))
              }
            />
            <span>{attestation.label}</span>
          </label>
        ))}
      </div>
      {errors.length ? (
        <div className="rounded-2xl border border-[#7a2a22] bg-[#210b08] p-4 text-sm text-[#ffb1a3]">
          {errors.map((error) => <p key={error}>{error}</p>)}
        </div>
      ) : null}
      <Button disabled={submitting || summaryOver || itemsOver}>{submitting ? "Submitting..." : "Submit research request"}</Button>
    </form>
  );
}
