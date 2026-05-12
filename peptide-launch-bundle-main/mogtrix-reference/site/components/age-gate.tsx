"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/button";
import { useAgeGateStore } from "@/lib/age-gate-store";

export function AgeGate() {
  const accepted = useAgeGateStore((state) => state.accepted);
  const hydrate = useAgeGateStore((state) => state.hydrate);
  const acceptGate = useAgeGateStore((state) => state.accept);
  const [error, setError] = useState("");

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (accepted) return null;

  function accept(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const age = event.currentTarget.querySelector<HTMLInputElement>("[data-gate='age']")?.checked ?? false;
    const qualified = event.currentTarget.querySelector<HTMLInputElement>("[data-gate='qualified']")?.checked ?? false;

    if (!age || !qualified) {
      setError("Both confirmations are required before entering.");
      return;
    }

    acceptGate();
    window.location.assign("/shop");
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/88 px-4 py-4 backdrop-blur-xl sm:py-8">
      <form
        role="dialog"
        aria-modal="true"
        aria-label="Research access gate"
        className="metal max-h-[calc(100svh-2rem)] w-full max-w-xl overflow-y-auto rounded-[22px] p-5 sm:p-7"
        action="/shop"
        method="get"
        onSubmit={accept}
      >
        <p className="mb-3 text-xs font-semibold uppercase text-[var(--accent)]">Mogtrix access gate</p>
        <h2 className="text-3xl font-black text-white">Qualified research access only.</h2>
        <p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">
          Mogtrix restricts catalog access to adults acting for qualified research organizations. You must confirm both statements to continue.
        </p>
        <div className="mt-6 grid gap-3">
          <label className="flex min-h-11 items-start gap-3 rounded-2xl border border-[var(--border)] p-4">
            <input className="mt-1 min-h-5 min-w-5 accent-[var(--accent)]" type="checkbox" data-gate="age" required />
            <span>I am at least 21 years old.</span>
          </label>
          <label className="flex min-h-11 items-start gap-3 rounded-2xl border border-[var(--border)] p-4">
            <input className="mt-1 min-h-5 min-w-5 accent-[var(--accent)]" type="checkbox" data-gate="qualified" required />
            <span>I am a qualified researcher or authorized procurement contact.</span>
          </label>
        </div>
        {error ? <p className="mt-4 text-sm text-[#ff8e7c]">{error}</p> : null}
        <Button className="mt-6 w-full" type="submit">Enter Mogtrix</Button>
      </form>
    </div>
  );
}
