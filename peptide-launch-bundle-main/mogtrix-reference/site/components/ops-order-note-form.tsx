"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function OpsOrderNoteForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);

    const response = await fetch(`/api/ops/orders/${orderId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body })
    });
    const payload = await response.json().catch(() => null);

    setSubmitting(false);
    if (!response.ok) {
      setError(payload?.error ?? "The note could not be saved.");
      return;
    }

    setBody("");
    router.refresh();
  }

  return (
    <form className="grid gap-3" onSubmit={submit}>
      <label className="grid gap-2">
        <span className="text-sm text-[var(--text-muted)]">Internal note</span>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={5}
          className="rounded-2xl border border-[var(--border)] bg-black px-4 py-3 text-white"
        />
      </label>
      {error ? <p className="text-sm text-[#ffb1a3]">{error}</p> : null}
      <button className="min-h-11 rounded-2xl border border-[var(--border)] px-5 text-sm font-semibold text-white" disabled={submitting}>
        {submitting ? "Saving..." : "Add note"}
      </button>
    </form>
  );
}
