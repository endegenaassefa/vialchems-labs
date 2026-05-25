/**
 * Auth-flow redesign — /track-order
 *
 * Self-service "I lost my email" entry point. Customer enters email +
 * order id, we POST /api/track-order which (if real) emails a fresh
 * tokenized "view your order" link. Response is uniform regardless of
 * outcome (anti-enumeration), so the UI always shows the same
 * confirmation card.
 */
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "sent" }
  | { kind: "error" };

function TrackOrderInner() {
  const search = useSearchParams();
  const prefillDisplayId = search?.get("display_id") ?? "";

  const [email, setEmail] = useState("");
  const [displayId, setDisplayId] = useState(prefillDisplayId);
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !displayId.trim()) return;
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          displayId: displayId.trim(),
        }),
      });
      // The server always returns 200 with the uniform body, so anything
      // non-2xx is a true network/server fault.
      if (!res.ok) {
        setState({ kind: "error" });
        return;
      }
      setState({ kind: "sent" });
    } catch {
      setState({ kind: "error" });
    }
  }

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section>
          <div className="mx-auto max-w-md px-6 py-32 md:py-40">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-6">
              T R A C K · O R D E R
            </p>
            <h1 className="text-[clamp(36px,5vw,56px)] font-light tracking-tight leading-[1.05] text-[var(--text)] mb-6">
              <span className="block">Find your</span>
              <span className="font-serif-italic block text-[var(--accent-soft)]">
                order.
              </span>
            </h1>
            <p className="text-[15px] leading-[1.6] text-[var(--text-muted)] mb-8">
              Enter the email used at checkout and your order id (it&apos;s in
              the confirmation we sent). We&apos;ll email a one-click tracking
              link.
            </p>

            {state.kind === "sent" ? (
              <Card variant="elevated" className="p-6">
                <Pill variant="accent">Check your inbox</Pill>
                <h2 className="mt-3 text-[22px] font-medium text-[var(--text)]">
                  Link sent.
                </h2>
                <p className="mt-2 text-[14px] leading-[1.55] text-[var(--text-muted)]">
                  If an order matching that email exists, a link has been sent.
                  Check your inbox (and spam) in the next minute.
                </p>
                <p className="mt-4 text-[12px] text-[var(--text-subtle)]">
                  Didn&apos;t get it? Wait a minute then try again, or reach{" "}
                  <a
                    href="mailto:support@vialchemlabs.net"
                    className="text-[var(--accent)] underline"
                  >
                    support@vialchemlabs.net
                  </a>
                  .
                </p>
              </Card>
            ) : (
              <Card variant="elevated" className="p-6">
                <form onSubmit={onSubmit} className="space-y-5" noValidate>
                  <div>
                    <FieldLabel htmlFor="track-email" required>
                      Email
                    </FieldLabel>
                    <div className="mt-2">
                      <Input
                        id="track-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        required
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel htmlFor="track-display-id" required>
                      Order id
                    </FieldLabel>
                    <div className="mt-2">
                      <Input
                        id="track-display-id"
                        name="displayId"
                        type="text"
                        autoComplete="off"
                        required
                        placeholder="VC-XXXXXXXX"
                        value={displayId}
                        onChange={(e) => setDisplayId(e.target.value)}
                      />
                    </div>
                  </div>

                  {state.kind === "error" ? (
                    <div
                      role="alert"
                      className="rounded-[var(--radius-md)] border border-[var(--pill-error)] px-4 py-3 text-[13px] text-[var(--pill-error)]"
                    >
                      Something went wrong. Try again in a moment.
                    </div>
                  ) : null}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={state.kind === "submitting"}
                  >
                    {state.kind === "submitting"
                      ? "Sending…"
                      : "Email me a link"}
                  </Button>
                </form>
              </Card>
            )}

            <p className="mt-6 text-[14px] text-[var(--text-muted)] text-center">
              Have an account?{" "}
              <Link
                href="/login"
                className="text-[var(--accent)] hover:text-[var(--accent-soft)]"
              >
                Sign in →
              </Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={null}>
      <TrackOrderInner />
    </Suspense>
  );
}
