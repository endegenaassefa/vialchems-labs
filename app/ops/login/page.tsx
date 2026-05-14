"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setOpsToken } from "@/components/ops/OpsAuthGate";

// Single-input login: paste the OPS_API_TOKEN, click in. Stored in
// localStorage for this device. Logout = clear localStorage (link in
// the layout header — added when we need it; trivial to add).

export default function OpsLoginPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const trimmed = token.trim();
    if (!trimmed) {
      setError("Token is required.");
      setSubmitting(false);
      return;
    }
    // Verify the token works by hitting the orders list endpoint.
    try {
      const response = await fetch("/api/ops/orders?pageSize=1", {
        headers: { Authorization: `Bearer ${trimmed}` },
      });
      if (response.status === 401) {
        setError("Token rejected. Check the value in your .env / Vercel settings.");
        setSubmitting(false);
        return;
      }
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(
          `Server returned ${response.status}: ${
            (body as { message?: string }).message ?? "unknown error"
          }`,
        );
        setSubmitting(false);
        return;
      }
      setOpsToken(trimmed);
      router.replace("/ops/orders");
    } catch {
      setError("Network error. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 p-8 rounded-[14px] border border-[var(--border)] bg-[var(--surface)]"
      >
        <div>
          <div className="text-[11px] tracking-[0.24em] uppercase text-[var(--text-muted)]">
            Vialchems Labs
          </div>
          <h1 className="text-2xl font-light mt-2">Ops admin</h1>
          <p className="text-sm text-[var(--text-muted)] mt-2">
            Paste your <code className="text-[var(--text)]">OPS_API_TOKEN</code> to access the
            order admin. The token lives in your Vercel / .env settings.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="ops-token"
            className="block text-[11px] tracking-[0.24em] uppercase text-[var(--text-muted)]"
          >
            Token
          </label>
          <input
            id="ops-token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoComplete="off"
            className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--surface)] font-mono text-sm focus:outline-none focus:border-[var(--accent)]"
            placeholder="Paste here"
          />
        </div>

        {error && (
          <div className="text-sm text-[var(--pill-error)]" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-2 rounded-md bg-[var(--accent)] text-white font-mono text-sm uppercase tracking-[0.16em] disabled:opacity-50"
        >
          {submitting ? "Verifying..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
