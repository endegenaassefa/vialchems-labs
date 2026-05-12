"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { ResearchRequestStatus } from "@/lib/types";

const statusOptions: ResearchRequestStatus[] = [
  "pending_review",
  "needs_more_info",
  "approved",
  "rejected"
];

export function OpsStatusForm({
  requestId,
  currentStatus
}: {
  requestId: string;
  currentStatus: ResearchRequestStatus;
}) {
  const router = useRouter();
  const [nextStatus, setNextStatus] = useState<ResearchRequestStatus>(
    statusOptions.find((status) => status !== currentStatus) ?? currentStatus
  );
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    const response = await fetch(`/api/ops/requests/${requestId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nextStatus, note })
    });
    const body = await response.json().catch(() => null);

    setSubmitting(false);
    if (!response.ok) {
      setError(body?.error ?? "The request status could not be updated.");
      return;
    }

    setNote("");
    router.refresh();
  }

  return (
    <form className="grid gap-3" onSubmit={submit}>
      <label className="grid gap-2">
        <span className="text-sm text-[var(--text-muted)]">Next status</span>
        <select
          value={nextStatus}
          onChange={(event) => setNextStatus(event.target.value as ResearchRequestStatus)}
          className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status} disabled={status === currentStatus}>
              {status.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2">
        <span className="text-sm text-[var(--text-muted)]">Optional note</span>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={4}
          className="rounded-2xl border border-[var(--border)] bg-black px-4 py-3 text-white"
        />
      </label>
      {error ? <p className="text-sm text-[#ffb1a3]">{error}</p> : null}
      <button className="min-h-11 rounded-2xl bg-[var(--accent)] px-5 text-sm font-bold text-black" disabled={submitting}>
        {submitting ? "Saving..." : "Update status"}
      </button>
    </form>
  );
}
