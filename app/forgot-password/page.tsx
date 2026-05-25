"use client";

/**
 * /forgot-password — request a password-reset link.
 *
 * Spec §3.4 — single email input. POST to /api/auth/forgot-password
 * (uniform 200). UI says "if an account exists" so the customer
 * doesn't learn whether their email is on file.
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<
    { kind: "idle" } | { kind: "sending" } | { kind: "done" }
  >({ kind: "idle" });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (state.kind === "sending") return;
    setState({ kind: "sending" });
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Uniform response by design; we don't surface fetch errors.
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
              <Pill variant="electric">Check your inbox</Pill>
              <h1 className="text-2xl font-semibold">Reset link sent</h1>
              <p className="text-sm text-slate-600">
                If an account exists for that email, you&rsquo;ll receive a
                password-reset link within a minute. The link is valid for 1
                hour.
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
              <h1 className="text-2xl font-semibold">Reset your password</h1>
              <p className="text-sm text-slate-600">
                Enter the email you registered with. If we find an account,
                we&rsquo;ll send you a link to set a new password.
              </p>
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
                <Input
                  id="forgot-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={state.kind === "sending"}>
                {state.kind === "sending" ? "Sending..." : "Send reset link"}
              </Button>
              <p className="text-xs text-slate-500">
                For privacy, we always return the same response whether the
                email is on file or not.
              </p>
            </form>
          )}
        </Card>
      </main>
      <SiteFooter />
    </>
  );
}
