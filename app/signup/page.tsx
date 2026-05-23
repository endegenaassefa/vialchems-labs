"use client";

/**
 * Signup — B1 magic-link flow with role capture
 * (Section 6 super-prompt 2026-05-22).
 *
 * The customer enters their email + research role + optional
 * newsletter opt-in. We trigger Supabase Auth's `signInWithOtp`
 * which emails a magic link. The role is captured in
 * `user_metadata` via the `data` option so it follows the user
 * into the qualification flow at first checkout.
 *
 * Stub mode (REQUIRE_SUPABASE=false): renders a "setup pending"
 * card instead of pretending to send a link.
 */

import Link from "next/link";
import { Suspense, useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  QualificationRoles,
  qualificationRoleLabels,
  type QualificationRole,
} from "@/lib/customer-qualification";
import { browserSupabase } from "@/lib/supabase";
import { isSupabaseAuthAvailable } from "@/lib/supabase-auth";

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "sent"; email: string }
  | { kind: "unavailable" }
  | { kind: "error"; message: string };

function SignupPageInner() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<QualificationRole>("academic-researcher");
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  // Lazy initializer — matches the login/page.tsx pattern. SSR
  // optimistically renders available=true to avoid hydration mismatch;
  // client hydration computes the real value via browserSupabase().
  const [available] = useState(() =>
    typeof window === "undefined" ? true : isSupabaseAuthAvailable(),
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setState({ kind: "submitting" });

    const supabase = browserSupabase();
    if (!supabase) {
      setState({ kind: "unavailable" });
      return;
    }
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback?next=/account`
        : undefined;

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectTo,
        data: {
          role,
          newsletter_opt_in: newsletterOptIn,
        },
      },
    });

    if (error) {
      setState({ kind: "error", message: error.message });
      return;
    }
    setState({ kind: "sent", email: email.trim() });
  }

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section>
          <div className="mx-auto max-w-md px-6 py-32 md:py-40">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-6">
              C R E A T E · A C C O U N T
            </p>
            <h1 className="text-[clamp(36px,5vw,56px)] font-light tracking-tight leading-[1.05] text-[var(--text)] mb-6">
              <span className="block">Join the</span>
              <span className="font-serif-italic block text-[var(--accent-soft)]">
                research lab.
              </span>
            </h1>
            <p className="text-[15px] leading-[1.6] text-[var(--text-muted)] mb-8">
              We&apos;ll email a one-tap sign-in link. Your account unlocks
              order history, COA-verified vial tracking, and qualification
              progress — no password.
            </p>

            {state.kind === "sent" ? (
              <Card variant="elevated" className="p-6">
                <Pill variant="accent">Check your inbox</Pill>
                <h2 className="mt-3 text-[22px] font-medium text-[var(--text)]">
                  Confirmation link sent.
                </h2>
                <p className="mt-2 text-[14px] leading-[1.55] text-[var(--text-muted)]">
                  We just emailed{" "}
                  <span className="font-mono">{state.email}</span>. Click the
                  link to confirm and land in your new account.
                </p>
              </Card>
            ) : state.kind === "unavailable" || !available ? (
              <Card variant="elevated" className="p-6">
                <Pill variant="info">Setup pending</Pill>
                <h2 className="mt-3 text-[20px] font-medium text-[var(--text)]">
                  Account creation isn&apos;t enabled yet.
                </h2>
                <p className="mt-2 text-[14px] leading-[1.55] text-[var(--text-muted)]">
                  Supabase Auth is being provisioned. You can still place an
                  order as a guest — your order id will be in the confirmation
                  email and visible on this device until you can sign in.
                </p>
              </Card>
            ) : (
              <Card variant="elevated" className="p-6">
                <form onSubmit={onSubmit} className="space-y-5" noValidate>
                  <div>
                    <FieldLabel htmlFor="signup-email" required>
                      Email
                    </FieldLabel>
                    <div className="mt-2">
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel htmlFor="signup-role" required>
                      Research role
                    </FieldLabel>
                    <div className="mt-2">
                      <select
                        id="signup-role"
                        name="role"
                        value={role}
                        onChange={(e) =>
                          setRole(e.target.value as QualificationRole)
                        }
                        className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[15px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                      >
                        {QualificationRoles.map((r) => (
                          <option key={r} value={r}>
                            {qualificationRoleLabels[r]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 text-[13px] text-[var(--text-muted)]">
                    <input
                      type="checkbox"
                      checked={newsletterOptIn}
                      onChange={(e) => setNewsletterOptIn(e.target.checked)}
                      className="mt-1 accent-[var(--accent)]"
                    />
                    <span>
                      Send me monthly research-citation digests (one-click
                      unsubscribe in every email).
                    </span>
                  </label>

                  {state.kind === "error" ? (
                    <div
                      role="alert"
                      className="rounded-[var(--radius-md)] border border-[var(--pill-error)] px-4 py-3 text-[13px] text-[var(--pill-error)]"
                    >
                      {state.message}
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
                      ? "Sending confirmation link…"
                      : "Email me a confirmation link"}
                  </Button>
                </form>
              </Card>
            )}

            <p className="mt-6 text-[14px] text-[var(--text-muted)] text-center">
              Already have an account?{" "}
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

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupPageInner />
    </Suspense>
  );
}
