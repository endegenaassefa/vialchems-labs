"use client";

import { FormEvent, useState } from "react";
import { LogIn } from "lucide-react";

export function AdminLoginForm({ redirectTo = "/admin" }: { redirectTo?: string }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: String(form.get("passcode") ?? "") })
    });

    if (!response.ok) {
      setLoading(false);
      setError("Admin access was not approved.");
      return;
    }

    window.location.href = redirectTo;
  }

  return (
    <form
      action="/api/admin/login"
      className="form-panel stack"
      method="post"
      onSubmit={handleSubmit}
    >
      <input name="redirectTo" type="hidden" value={redirectTo} />
      <div>
        <p className="eyebrow">Protected area</p>
        <h1>Admin login</h1>
        <p className="subtle">
          Local development passcode defaults to <code>mogtrix-demo-admin</code>.
          Set <code>MOGTRIX_ADMIN_PASSCODE</code> before production.
        </p>
      </div>
      {error ? <div className="alert alert-error">{error}</div> : null}
      <div className="field">
        <label htmlFor="passcode">Passcode</label>
        <input id="passcode" name="passcode" required type="password" />
      </div>
      <button className="button button-primary" disabled={loading} type="submit">
        <LogIn size={18} aria-hidden="true" />
        {loading ? "Checking..." : "Enter admin"}
      </button>
    </form>
  );
}
