"use client";

/**
 * /login — rebuilt sign-in page.
 *
 * Spec §3.3 — primary form is email + password. "Forgot your
 * password?" link to /forgot-password. Expandable
 * "Sign in with a magic link instead" section preserves the
 * legacy passwordless flow for repeat customers + as fallback.
 *
 * Flow (password):
 *   1. Pre-flight POST /api/auth/sign-in for rate-limit + status
 *      check (returns active | pending | suspended | none)
 *      - pending: render "your email isn't confirmed" with resend
 *      - rate_limited: surface retry message
 *      - everything else: proceed to step 2
 *   2. supabase.auth.signInWithPassword from the browser.
 *      Generic "invalid_credentials" message on failure (no
 *      differentiation between "wrong password" and
 *      "account doesn't exist").
 *   3. On success, redirect to ?next= or /account.
 *
 * Flow (magic link): unchanged from the prior implementation —
 * email + signInWithOtp + "check your inbox" card. Still useful
 * for legacy customers who never set a password.
 */

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  signInWithPassword,
} from "@/lib/supabase-auth";

type PreflightStatus = "active" | "pending" | "suspended" | "none";

type PasswordState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "pending"; email: string; resendMessage?: string }
  | { kind: "rate_limited"; retryAfterSeconds: number }
  | { kind: "error"; message: string };

type OtpState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "sent"; email: string }
  | { kind: "unavailable" }
  | { kind: "error"; message: string };

function safeNextPath(value: string | null | undefined): string {
  if (!value) return "/account";
  if (!value.startsWith("/") || value.startsWith("//")) return "/account";
  return value;
}

function ConfirmedBanner({ confirmed }: { confirmed: boolean }) {
  if (!confirmed) return null;
  return (
    <div
      role="status"
      className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
    >
      Your email is confirmed. Sign in to land on your dashboard.
    </div>
  );
}

function ResetBanner({ reset }: { reset: boolean }) {
  if (!reset) return null;
  return (
    <div
      role="status"
      className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
    >
      Password updated. Sign in with your new password.
    </div>
  );
}

function ErrorBanner({ reason }: { reason: string | null }) {
  if (!reason) return null;
  const copy =
    reason === "supabase_unavailable"
      ? "Sign-in isn't enabled yet on this environment."
      : reason === "missing_code"
        ? "That sign-in link is incomplete — request a fresh one below."
        : reason === "auth_error"
          ? "The sign-in link could not be verified — request a fresh one below."
          : "Sign in didn't complete. Please try again.";
  return (
    <div
      role="alert"
      className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
    >
      {copy}
    </div>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const search = useSearchParams();
  const errorParam = search?.get("error") ?? null;
  const nextParam = safeNextPath(search?.get("next"));
  const confirmedFlag = search?.get("confirmed") === "1";
  const resetFlag = search?.get("reset") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordState, setPasswordState] = useState<PasswordState>({ kind: "idle" });

  const [otpExpanded, setOtpExpanded] = useState(false);
  const [otpState, setOtpState] = useState<OtpState>({ kind: "idle" });

  // Lazy initialiser: SSR returns `true` optimistically so the form
  // renders without a hydration mismatch; the first client render
  // then computes the real value before submit can fire. Mirrors
  // the earlier magic-link-only login implementation.
  const [available] = useState(() =>
    typeof window === "undefined" ? true : isSupabaseAuthAvailable(),
  );

  async function preflight(
    targetEmail: string,
  ): Promise<{ ok: true; status: PreflightStatus } | { ok: false; retryAfterSeconds: number }> {
    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: targetEmail, password: "x".repeat(12) }),
      });
      // Note: the body's password is throwaway — the pre-flight
      // checks status + rate limit only. The real credential check
      // is the browser-side signInWithPassword call below.
      const body = (await res.json()) as {
        ok: boolean;
        status?: PreflightStatus;
        code?: string;
        retry_after_seconds?: number;
      };
      if (body.code === "rate_limited") {
        return { ok: false, retryAfterSeconds: body.retry_after_seconds ?? 60 };
      }
      return { ok: true, status: body.status ?? "active" };
    } catch {
      // On preflight network error, fall through and let Supabase
      // surface the real error.
      return { ok: true, status: "active" };
    }
  }

  async function onSubmitPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !password) return;
    setPasswordState({ kind: "submitting" });

    const pre = await preflight(trimmed);
    if (!pre.ok) {
      setPasswordState({
        kind: "rate_limited",
        retryAfterSeconds: pre.retryAfterSeconds,
      });
      return;
    }
    if (pre.status === "pending") {
      setPasswordState({ kind: "pending", email: trimmed });
      return;
    }
    if (pre.status === "suspended") {
      // Surface as generic invalid credentials — never differentiate.
      setPasswordState({
        kind: "error",
        message: "We couldn't sign you in with those credentials.",
      });
      return;
    }

    const result = await signInWithPassword({ email: trimmed, password });
    if (result.ok) {
      // For /account specifically, append welcome=1 so the dashboard
      // shows the just-signed-in pill. For deep links to /account/orders
      // etc., go directly without rewriting the URL.
      if (nextParam === "/account") {
        router.replace("/account?welcome=1");
      } else {
        router.replace(nextParam);
      }
      return;
    }
    if (result.code === "supabase_unavailable") {
      setPasswordState({
        kind: "error",
        message: "Sign-in isn't enabled yet on this environment.",
      });
      return;
    }
    setPasswordState({
      kind: "error",
      message: "We couldn't sign you in with those credentials.",
    });
  }

  async function onResend(emailToResend: string) {
    try {
      await fetch("/api/auth/resend-confirmation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: emailToResend }),
      });
    } catch {
      // Uniform response by design.
    }
    setPasswordState({
      kind: "pending",
      email: emailToResend,
      resendMessage:
        "If a pending account exists for that email, we've sent a fresh confirmation link.",
    });
  }

  async function onSubmitOtp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setOtpState({ kind: "submitting" });
    const redirectTo = resolveAuthRedirectTo(undefined, nextParam);
    const result = await signInWithOtp({ email: trimmed, redirectTo });
    if (result.ok) {
      setOtpState({ kind: "sent", email: trimmed });
      return;
    }
    if (result.code === "supabase_unavailable") {
      setOtpState({ kind: "unavailable" });
      return;
    }
    setOtpState({ kind: "error", message: result.message });
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-16">
        <header>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-2">
            S I G N · I N
          </p>
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in with your password, or request a magic link if you
            haven&rsquo;t set one.
          </p>
        </header>

        <ConfirmedBanner confirmed={confirmedFlag} />
        <ResetBanner reset={resetFlag} />
        <ErrorBanner reason={errorParam} />

        {!available ? (
          <Card>
            <div className="flex flex-col gap-3 p-6">
              <Pill variant="info">Setup pending</Pill>
              <h2 className="text-xl font-medium">
                Sign-in isn&rsquo;t enabled yet
              </h2>
              <p className="text-sm text-slate-600">
                Supabase Auth is being provisioned. Email support if you need
                to access your order history before then.
              </p>
            </div>
          </Card>
        ) : passwordState.kind === "pending" ? (
          <Card>
            <div className="flex flex-col gap-3 p-6">
              <Pill variant="info">Email not confirmed</Pill>
              <h2 className="text-xl font-medium">Confirm your email first</h2>
              <p className="text-sm text-slate-600">
                We sent a confirmation link to{" "}
                <span className="font-mono">{passwordState.email}</span>. Click
                it to activate your account, then sign in.
              </p>
              {passwordState.resendMessage && (
                <p className="text-sm text-emerald-700">
                  {passwordState.resendMessage}
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => void onResend(passwordState.email)}
                >
                  Resend confirmation link
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setPasswordState({ kind: "idle" })}
                >
                  Back
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <form
              onSubmit={onSubmitPassword}
              className="flex flex-col gap-4 p-6"
              noValidate
            >
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor="login-email" required>
                  Email
                </FieldLabel>
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
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor="login-password" required>
                  Password
                </FieldLabel>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={1}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {passwordState.kind === "rate_limited" && (
                <div
                  role="alert"
                  className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
                >
                  Too many attempts. Try again in {passwordState.retryAfterSeconds}{" "}
                  seconds.
                </div>
              )}
              {passwordState.kind === "error" && (
                <div
                  role="alert"
                  className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
                >
                  {passwordState.message}
                </div>
              )}
              <Button
                type="submit"
                variant="primary"
                disabled={passwordState.kind === "submitting"}
              >
                {passwordState.kind === "submitting"
                  ? "Signing in..."
                  : "Sign in"}
              </Button>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <Link
                  href="/forgot-password"
                  className="text-slate-700 underline underline-offset-2"
                >
                  Forgot your password?
                </Link>
                <Link
                  href={`/register${nextParam !== "/account" ? `?next=${encodeURIComponent(nextParam)}` : ""}`}
                  className="text-slate-700 underline underline-offset-2"
                >
                  Create an account
                </Link>
              </div>
            </form>
          </Card>
        )}

        <details
          className="rounded-md border border-slate-200 bg-white p-4 text-sm"
          open={otpExpanded}
          onToggle={(e) => setOtpExpanded((e.target as HTMLDetailsElement).open)}
        >
          <summary className="cursor-pointer text-slate-700">
            Sign in with a magic link instead
          </summary>
          {otpState.kind === "sent" ? (
            <div className="mt-4 flex flex-col gap-2">
              <Pill variant="accent">Check your inbox</Pill>
              <p className="text-sm text-slate-600">
                We sent a sign-in link to{" "}
                <span className="font-mono">{otpState.email}</span>. The link
                expires in 1 hour.
              </p>
            </div>
          ) : otpState.kind === "unavailable" ? (
            <p className="mt-4 text-sm text-slate-600">
              Magic-link sign-in isn&rsquo;t enabled yet on this environment.
            </p>
          ) : (
            <form onSubmit={onSubmitOtp} className="mt-4 flex flex-col gap-3">
              {otpState.kind === "error" && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                  {otpState.message}
                </div>
              )}
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor="otp-email">Email</FieldLabel>
                <Input
                  id="otp-email"
                  name="otp-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                variant="ghost"
                disabled={otpState.kind === "submitting" || !email.trim()}
              >
                {otpState.kind === "submitting"
                  ? "Sending..."
                  : "Email me a sign-in link"}
              </Button>
            </form>
          )}
        </details>

        <p className="text-center text-sm text-slate-600">
          New to{" "}
          <span className="font-medium">VialChem Labs</span>?{" "}
          <Link
            href={`/register${nextParam !== "/account" ? `?next=${encodeURIComponent(nextParam)}` : ""}`}
            className="font-medium text-slate-900 underline underline-offset-2"
          >
            Create an account
          </Link>
          .
        </p>
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
