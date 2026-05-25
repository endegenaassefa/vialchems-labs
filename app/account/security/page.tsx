"use client";

/**
 * /account/security — change password / sign out everywhere / delete account.
 *
 * Spec §3.5 Tab 4. Three sections in a single column:
 *
 *   1. Change password
 *      - current + new + confirm
 *      - browser-side supabase.auth.updateUser({ password })
 *      - we DO NOT re-verify the current password server-side
 *        because Supabase Auth doesn't expose that; the session
 *        is already authenticated, so changing the password is
 *        equivalent to a logged-in session-trusted action
 *      - 12-128 chars, zxcvbn >= 3 enforced via evaluatePasswordStrength
 *
 *   2. Sign out everywhere
 *      - supabase.auth.signOut({ scope: "global" }) — invalidates
 *        every refresh token across all browsers/devices
 *
 *   3. Delete account
 *      - opens an in-page confirmation panel; requires typing
 *        DELETE into a small input as the intent token
 *      - POSTs to /api/account/delete which archives + tears down
 *        the auth user + sends the deleted-confirmation email
 *      - on success: signOut + redirect to /?account_deleted=1
 *
 * Notes:
 *   - This page does NOT handle email change yet; spec marks that
 *     as a separate flow that needs re-verification. Tracked in
 *     the PR body as a follow-up.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { Input } from "@/components/ui/Input";
import { browserSupabase } from "@/lib/supabase";
import { useSupabaseUser } from "@/lib/auth/use-supabase-user";
import { signOut as supabaseSignOut } from "@/lib/supabase-auth";
import { evaluatePasswordStrength } from "@/lib/validation/customer";

type PwState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

type DeleteState =
  | { kind: "closed" }
  | { kind: "confirming" }
  | { kind: "deleting" }
  | { kind: "error"; message: string };

export default function SecurityPage() {
  const router = useRouter();
  const { user, session, loading, unavailable } = useSupabaseUser();

  // Change password state
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwState, setPwState] = useState<PwState>({ kind: "idle" });
  const pwEval = useMemo(
    () => (newPw.length === 0 ? null : evaluatePasswordStrength(newPw)),
    [newPw],
  );

  // Sign out everywhere
  const [signingOutAll, setSigningOutAll] = useState(false);

  // Delete account
  const [deleteState, setDeleteState] = useState<DeleteState>({ kind: "closed" });
  const [deleteConfirm, setDeleteConfirm] = useState("");

  if (unavailable || (!loading && !user)) {
    if (typeof window !== "undefined" && !loading && !user) {
      router.replace("/login?next=/account/security");
    }
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-md px-6 py-32 text-center">
          <p className="text-sm text-slate-500">
            {unavailable
              ? "Account is temporarily unavailable."
              : "Redirecting to sign in..."}
          </p>
        </main>
        <SiteFooter />
      </>
    );
  }

  async function onChangePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pwState.kind === "saving") return;
    if (newPw !== confirmPw) {
      setPwState({ kind: "error", message: "Passwords do not match." });
      return;
    }
    if (!pwEval?.acceptable) {
      setPwState({
        kind: "error",
        message: pwEval?.feedback[0] ?? "Choose a stronger password.",
      });
      return;
    }
    setPwState({ kind: "saving" });
    const supabase = browserSupabase();
    if (!supabase) {
      setPwState({
        kind: "error",
        message: "Sign-in isn't enabled yet on this environment.",
      });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) {
      setPwState({ kind: "error", message: error.message });
      return;
    }
    setPwState({ kind: "saved" });
    setNewPw("");
    setConfirmPw("");
  }

  async function onSignOutEverywhere() {
    setSigningOutAll(true);
    try {
      const supabase = browserSupabase();
      if (supabase) {
        await supabase.auth.signOut({ scope: "global" });
      }
      router.push("/");
    } finally {
      setSigningOutAll(false);
    }
  }

  async function onDeleteAccount() {
    if (deleteConfirm !== "DELETE") {
      setDeleteState({
        kind: "error",
        message: 'Type "DELETE" exactly to confirm.',
      });
      return;
    }
    setDeleteState({ kind: "deleting" });
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${session!.access_token}`,
        },
        body: JSON.stringify({ confirm: "DELETE" }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { code?: string };
        setDeleteState({
          kind: "error",
          message:
            body.code === "rate_limited"
              ? "Too many delete attempts. Try again later."
              : "Could not delete your account. Try again or contact support.",
        });
        return;
      }
      // Success — sign out + redirect to home.
      await supabaseSignOut();
      router.push("/?account_deleted=1");
    } catch {
      setDeleteState({
        kind: "error",
        message: "Network error. Please try again.",
      });
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-12">
        <header>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-2">
            A C C O U N T · S E C U R I T Y
          </p>
          <h1 className="text-3xl font-semibold">Password & access</h1>
        </header>

        <Link
          href="/account"
          className="text-sm text-slate-700 underline underline-offset-2"
        >
          ← Back to dashboard
        </Link>

        {/* Change password */}
        <Card>
          <form
            onSubmit={onChangePassword}
            className="flex flex-col gap-4 p-5"
            noValidate
          >
            <h2 className="text-lg font-medium">Change password</h2>
            <p className="text-sm text-slate-600">
              You&rsquo;re already signed in, so we don&rsquo;t require your
              current password here. Choose a strong new password.
            </p>
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor="sec-new" required>
                New password
              </FieldLabel>
              <Input
                id="sec-new"
                type="password"
                autoComplete="new-password"
                required
                minLength={12}
                maxLength={128}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
              />
              {pwEval && (
                <p
                  className={
                    pwEval.acceptable
                      ? "text-xs text-emerald-700"
                      : "text-xs text-amber-700"
                  }
                >
                  Strength: {["very weak", "weak", "ok", "good", "strong"][pwEval.score]}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor="sec-confirm" required>
                Confirm new password
              </FieldLabel>
              <Input
                id="sec-confirm"
                type="password"
                autoComplete="new-password"
                required
                minLength={12}
                maxLength={128}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
              />
            </div>
            {pwState.kind === "error" && (
              <div
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900"
              >
                {pwState.message}
              </div>
            )}
            {pwState.kind === "saved" && (
              <Pill variant="electric">Password updated</Pill>
            )}
            <Button type="submit" variant="primary" disabled={pwState.kind === "saving"}>
              {pwState.kind === "saving" ? "Saving..." : "Update password"}
            </Button>
          </form>
        </Card>

        {/* Sign out everywhere */}
        <Card>
          <div className="flex flex-col gap-3 p-5">
            <h2 className="text-lg font-medium">Sign out everywhere</h2>
            <p className="text-sm text-slate-600">
              Invalidates every active session across every browser + device.
              You&rsquo;ll need to sign in again here too.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={onSignOutEverywhere}
              disabled={signingOutAll}
            >
              {signingOutAll ? "Signing out..." : "Sign out everywhere"}
            </Button>
          </div>
        </Card>

        {/* Delete account */}
        <Card>
          <div className="flex flex-col gap-3 p-5">
            <h2 className="text-lg font-medium">Delete account</h2>
            <p className="text-sm text-slate-600">
              Removes your profile, addresses, and login. Past orders stay on
              file for tax + warranty reasons but no longer link to your
              account. The email is freed so you can register fresh.
            </p>
            {deleteState.kind === "closed" ? (
              <Button
                type="button"
                variant="danger"
                onClick={() => setDeleteState({ kind: "confirming" })}
              >
                Delete my account
              </Button>
            ) : (
              <div className="flex flex-col gap-3 rounded-md border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-900">
                  This is permanent. Type <strong>DELETE</strong> below to
                  confirm.
                </p>
                <Input
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="DELETE"
                  aria-label="Type DELETE to confirm"
                />
                {deleteState.kind === "error" && (
                  <p className="text-sm text-red-900">{deleteState.message}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="danger"
                    onClick={onDeleteAccount}
                    disabled={deleteState.kind === "deleting"}
                  >
                    {deleteState.kind === "deleting"
                      ? "Deleting..."
                      : "Delete account permanently"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setDeleteState({ kind: "closed" });
                      setDeleteConfirm("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </main>
      <SiteFooter />
    </>
  );
}
