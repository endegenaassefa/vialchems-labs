"use client";

/**
 * /auth/resend-confirmation — small client page where a customer
 * whose confirmation link expired or never arrived can request a
 * fresh one. POSTs to /api/auth/resend-confirmation (uniform 200).
 *
 * Codex P2 (2026-05-25) wiring fix: previously the failure card
 * on /auth/confirm-email pointed at `/login?action=resend` which
 * the login page didn't honour. This page closes the loop.
 */

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { Input } from "@/components/ui/Input";

export default function ResendConfirmationPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<
    { kind: "idle" } | { kind: "sending" } | { kind: "done" }
  >({ kind: "idle" });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (state.kind === "sending") return;
    setState({ kind: "sending" });
    try {
      await fetch("/api/auth/resend-confirmation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Uniform response means we never differentiate; swallow.
    }
    setState({ kind: "done" });
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-16">
        <Card>
          {state.kind === "done" ? (
            <div className="flex flex-col gap-4 p-6 text-center">
              <Pill variant="electric">Request sent</Pill>
              <h1 className="text-2xl font-semibold">Check your inbox</h1>
              <p className="text-sm text-slate-600">
                If a pending account exists for that email, we sent a fresh
                confirmation link. It expires in 24 hours.
              </p>
              <Link
                href="/login"
                className="text-sm text-slate-700 underline underline-offset-2"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form className="flex flex-col gap-4 p-6" onSubmit={onSubmit}>
              <h1 className="text-2xl font-semibold">
                Resend confirmation link
              </h1>
              <p className="text-sm text-slate-600">
                Enter the email you registered with. If we find a pending
                account, we&rsquo;ll send a fresh 24-hour confirmation link.
              </p>
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor="resend-email">Email</FieldLabel>
                <Input
                  id="resend-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={state.kind === "sending"}>
                {state.kind === "sending"
                  ? "Sending..."
                  : "Send confirmation link"}
              </Button>
              <p className="text-xs text-slate-500">
                For privacy, we always return the same response whether the
                email matches a pending account or not.
              </p>
            </form>
          )}
        </Card>
      </main>
      <SiteFooter />
    </>
  );
}
