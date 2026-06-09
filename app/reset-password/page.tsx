"use client";

/**
 * /reset-password?token=... — consume a password-reset HMAC token.
 *
 * Spec §3.4 — new password + confirm. Posts to /api/auth/reset-password,
 * which validates the token (1h TTL), enforces the password policy
 * (zxcvbn-ts >= 3), records the nonce as used, and writes the new
 * password via Supabase admin updateUser. On success, redirect to
 * /login?reset=1.
 *
 * If the token is missing entirely from the URL we surface a hard
 * failure card before rendering the form — saves a wasted POST.
 */

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { Input } from "@/components/ui/Input";

interface ApiResponseBody {
  ok: boolean;
  code?: string;
  message?: string;
  errors?: string[];
  retry_after_seconds?: number;
}

function ResetInner() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params?.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [topError, setTopError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setErrors([]);
    setTopError(null);
    if (password !== confirm) {
      setErrors(["Passwords do not match."]);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          password,
          confirm_password: confirm,
        }),
      });
      const body = (await res.json()) as ApiResponseBody;
      if (res.ok) {
        router.replace("/login?reset=1");
        return;
      }
      if (body.code === "invalid_or_expired_token") {
        setTopError(
          "This reset link is no longer valid. Request a fresh one from the sign-in page.",
        );
      } else if (body.code === "invalid_password") {
        setErrors(
          body.errors && body.errors.length > 0
            ? body.errors
            : ["Choose a stronger password."],
        );
      } else if (body.code === "rate_limited") {
        const seconds = body.retry_after_seconds ?? 60;
        setTopError(
          `Too many attempts. Try again in ${seconds} second${seconds === 1 ? "" : "s"}.`,
        );
      } else {
        setTopError(
          "Something went wrong. Please try again, or request a fresh reset link.",
        );
      }
    } catch {
      setTopError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <Card>
        <div className="flex flex-col gap-4 p-6 text-center">
          <Pill variant="error">Link unavailable</Pill>
          <h1 className="text-2xl font-semibold">
            This reset link can&rsquo;t be used
          </h1>
          <p className="text-sm text-slate-600">
            The token is missing from the URL. Request a fresh reset link from
            the sign-in page.
          </p>
          <Link
            href="/forgot-password"
            className="text-sm text-slate-700 underline underline-offset-2"
          >
            Request a new link
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <form className="flex flex-col gap-4 p-6" onSubmit={onSubmit}>
        <h1 className="text-2xl font-semibold">Set a new password</h1>
        <p className="text-sm text-slate-600">
          Choose a password with 12 or more characters, mixed case, and at least
          one digit.
        </p>
        {topError && (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            {topError}
          </div>
        )}
        {errors.length > 0 && (
          <ul
            role="alert"
            className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 space-y-1"
          >
            {errors.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        )}
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor="reset-password">New password</FieldLabel>
          <Input
            id="reset-password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={12}
            maxLength={128}
          />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor="reset-confirm">Confirm new password</FieldLabel>
          <Input
            id="reset-confirm"
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            minLength={12}
            maxLength={128}
          />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Updating..." : "Update password"}
        </Button>
        <p className="text-xs text-slate-500">
          Once your password is updated, sign in with the new one.
        </p>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-16">
        <Suspense
          fallback={
            <Card>
              <div className="p-6 text-sm text-slate-500">Loading...</div>
            </Card>
          }
        >
          <ResetInner />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
