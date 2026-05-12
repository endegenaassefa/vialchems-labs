"use client";

/**
 * Signup — v1.3 real-feeling account creation.
 *
 * Real form (email + password + role + display name) backed by
 * lib/auth-store.ts (Zustand + localStorage). Creates a real account on this
 * device; password is SHA-256 hashed with a per-account salt. On submit,
 * routes to /account where the user sees their dashboard.
 *
 * v4 D2 deferral closes when Supabase auth wires in Phase 10; the public
 * API of useAuthStore stays the same so this page won't need to change.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/lib/auth-store";
import {
  QualificationRoles,
  qualificationRoleLabels,
  type QualificationRole,
} from "@/lib/customer-qualification";

export default function SignupPage() {
  const router = useRouter();
  const signup = useAuthStore((s) => s.signup);

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState<QualificationRole>("academic-researcher");
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await signup({ email, password, role, displayName, newsletterOptIn });
      router.push("/account");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not create account.",
      );
      setSubmitting(false);
    }
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
              <span className="block">Set up your</span>
              <span className="font-serif-italic block text-[var(--accent-soft)]">
                researcher account.
              </span>
            </h1>
            <p className="text-[15px] leading-[1.6] text-[var(--text-muted)] mb-8">
              Faster checkout. Persistent qualification. COA download history.
              Order tracking.
            </p>

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
                  <FieldLabel htmlFor="signup-name" required>
                    Display name
                  </FieldLabel>
                  <div className="mt-2">
                    <Input
                      id="signup-name"
                      name="displayName"
                      autoComplete="name"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Lab tech / researcher / institution name"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel htmlFor="signup-role" required>
                    Institutional role
                  </FieldLabel>
                  <select
                    id="signup-role"
                    name="role"
                    required
                    value={role}
                    onChange={(e) =>
                      setRole(e.target.value as QualificationRole)
                    }
                    className="mt-2 w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--surface-strong)] border border-[var(--border)] text-[14px] focus:border-[var(--accent)] focus:outline-none"
                  >
                    {QualificationRoles.map((r) => (
                      <option key={r} value={r}>
                        {qualificationRoleLabels[r]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel htmlFor="signup-password" required>
                    Password
                  </FieldLabel>
                  <div className="mt-2">
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                    Minimum 8 characters
                  </p>
                </div>

                <div>
                  <FieldLabel htmlFor="signup-password-confirm" required>
                    Confirm password
                  </FieldLabel>
                  <div className="mt-2">
                    <Input
                      id="signup-password-confirm"
                      name="passwordConfirm"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 text-[13px] leading-[1.5] text-[var(--text-muted)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newsletterOptIn}
                    onChange={(e) => setNewsletterOptIn(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-[var(--accent)]"
                  />
                  <span>
                    Send me new-batch announcements + research index updates.
                    Unsubscribe anytime.
                  </span>
                </label>

                {error ? (
                  <div
                    role="alert"
                    className="rounded-[var(--radius-md)] border border-[var(--pill-error)] px-4 py-3 text-[13px] text-[var(--pill-error)]"
                  >
                    {error}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? "Creating account…" : "Create account"}
                </Button>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <Pill variant="info">Pre-launch</Pill>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                    Server auth wires before public launch
                  </span>
                </div>
              </form>
            </Card>

            <p className="mt-6 text-[14px] text-[var(--text-muted)] text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[var(--accent)] hover:text-[var(--accent-soft)]"
              >
                Sign in →
              </Link>
            </p>
            <p className="mt-6 text-[12px] text-[var(--text-subtle)] leading-[1.55]">
              By creating an account, you agree to our{" "}
              <Link
                href="/legal/terms"
                className="text-[var(--text-muted)] underline"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/legal/privacy"
                className="text-[var(--text-muted)] underline"
              >
                Privacy Policy
              </Link>
              . You confirm you are 21+ and will use products solely for
              laboratory research in non-clinical settings.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
