"use client";

/**
 * Sign in — B1 magic-link flow
 * (Section 6 super-prompt 2026-05-22).
 *
 * The customer enters their email, clicks "Email me a sign-in
 * link", and Supabase Auth sends a magic link that lands at
 * /auth/callback. Replaces the prior PBKDF2 password form; the
 * legacy localStorage path stays in lib/auth-store.ts for any
 * existing accounts that haven't been migrated.
 *
 * Stub mode: when Supabase Auth isn't configured (REQUIRE_SUPABASE=
 * false), the helper returns supabase_unavailable and the UI shows
 * a setup-pending message instead of pretending to send a link.
 */

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
import {
  isSupabaseAuthAvailable,
  resolveAuthRedirectTo,
  signInWithOtp,
} from "@/lib/supabase-auth";

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "sent"; email: string }
  | { kind: "unavailable" }
  | { kind: "error"; message: string };

function ErrorBanner({ reason }: { reason: string | null }) {
  if (!reason) return null;
  const copy =
    reason === "supabase_unavailable"
      ? "Magic-link sign-in isn't enabled yet on this environment."
      : reason === "missing_code"
        ? "That sign-in link is incomplete — request a fresh one below."
        : reason === "auth_error"
          ? "The sign-in link could not be verified — request a fresh one below."
          : "Sign in didn't complete. Please try again.";
  return (
    <div
      role="alert"
      className="rounded-[var(--radius-md)] border border-[var(--pill-error)] px-4 py-3 text-[13px] text-[var(--pill-error)] mb-4"
    >
      {copy}
    </div>
  );
}

function LoginPageInner() {
  const search = useSearchParams();
  const errorParam = search?.get("error") ?? null;
  const nextParam = search?.get("next");

  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  // Lazy initializer reads `isSupabaseAuthAvailable()` once at mount.
  // SSR returns `true` optimistically so the form renders without a
  // hydration mismatch; the first client render then computes the
  // real value via browserSupabase() before the user can submit.
  // Previously this was a useState(true) + useEffect(setAvailable)
  // pattern, which trips react-hooks/set-state-in-effect.
  const [available] = useState(() =>
    typeof window === "undefined" ? true : isSupabaseAuthAvailable(),
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setState({ kind: "submitting" });
    const safeNext =
      nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
        ? nextParam
        : "/account";
    const redirectTo = resolveAuthRedirectTo(undefined, safeNext);
    const result = await signInWithOtp({ email: email.trim(), redirectTo });
    if (result.ok) {
      setState({ kind: "sent", email: email.trim() });
      return;
    }
    if (result.code === "supabase_unavailable") {
      setState({ kind: "unavailable" });
      return;
    }
    setState({ kind: "error", message: result.message });
  }

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section>
          <div className="mx-auto max-w-md px-6 py-32 md:py-40">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-6">
              S I G N · I N
            </p>
            <h1 className="text-[clamp(36px,5vw,56px)] font-light tracking-tight leading-[1.05] text-[var(--text)] mb-6">
              <span className="block">Welcome</span>
              <span className="font-serif-italic block text-[var(--accent-soft)]">
                back.
              </span>
            </h1>
            <p className="text-[15px] leading-[1.6] text-[var(--text-muted)] mb-8">
              Enter your email and we&apos;ll send a one-tap sign-in link. No
              password to forget.
            </p>

            <ErrorBanner reason={errorParam} />

            {state.kind === "sent" ? (
              <Card variant="elevated" className="p-6">
                <Pill variant="accent">Check your inbox</Pill>
                <h2 className="mt-3 text-[22px] font-medium text-[var(--text)]">
                  Magic link sent.
                </h2>
                <p className="mt-2 text-[14px] leading-[1.55] text-[var(--text-muted)]">
                  We just emailed{" "}
                  <span className="font-mono">{state.email}</span>. Click the
                  link to land back here signed in. The link is valid for one
                  hour and can only be used once.
                </p>
                <p className="mt-4 text-[12px] text-[var(--text-subtle)]">
                  Didn&apos;t arrive? Check spam, then try again with a fresh
                  request.
                </p>
              </Card>
            ) : state.kind === "unavailable" || !available ? (
              <Card variant="elevated" className="p-6">
                <Pill variant="info">Setup pending</Pill>
                <h2 className="mt-3 text-[20px] font-medium text-[var(--text)]">
                  Magic-link sign-in isn&apos;t enabled yet.
                </h2>
                <p className="mt-2 text-[14px] leading-[1.55] text-[var(--text-muted)]">
                  Supabase Auth is being provisioned. Email{" "}
                  <a
                    href="mailto:support@vialchemlabs.net"
                    className="text-[var(--accent)] underline"
                  >
                    support@vialchemlabs.net
                  </a>{" "}
                  if you need to access your order history before then —
                  reference any order id from your confirmation email.
                </p>
              </Card>
            ) : (
              <Card variant="elevated" className="p-6">
                <form onSubmit={onSubmit} className="space-y-5" noValidate>
                  <div>
                    <FieldLabel htmlFor="login-email" required>
                      Email
                    </FieldLabel>
                    <div className="mt-2">
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

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
                      ? "Sending magic link…"
                      : "Email me a sign-in link"}
                  </Button>
                </form>
              </Card>
            )}

            <p className="mt-6 text-[14px] text-[var(--text-muted)] text-center">
              No account yet?{" "}
              <Link
                href="/signup"
                className="text-[var(--accent)] hover:text-[var(--accent-soft)]"
              >
                Create one →
              </Link>
            </p>
            <p className="mt-2 text-[14px] text-[var(--text-muted)] text-center">
              <Link
                href="/contact"
                className="text-[var(--text-muted)] hover:text-[var(--accent)]"
              >
                Trouble signing in?
              </Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}
