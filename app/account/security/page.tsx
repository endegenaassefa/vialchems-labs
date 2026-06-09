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
import { useEffect, useMemo, useState, type FormEvent } from "react";
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
import {
  evaluatePasswordStrength,
  RESEARCH_ORG_TYPES,
  type ResearchOrgType,
} from "@/lib/validation/customer";

const ORG_TYPE_LABELS: Record<ResearchOrgType, string> = {
  university: "University / academic lab",
  biotech: "Biotech / pharma company",
  independent_research: "Independent research organization",
  cro: "Contract research organization (CRO)",
  government: "Government / public-sector lab",
  individual: "Individual researcher",
  other: "Other",
};

interface ProfileShape {
  full_name: string;
  phone: string | null;
  research_org_type: string;
  research_org_other: string | null;
  research_focus: string;
}

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

  // Change password state — codex P1 (2026-05-25): require current
  // password so a stolen-session-open-tab attacker can't change a
  // password silently without the credential. Codex P2 (checkpoint 6):
  // legacy magic-link customers have NO password to enter — detect
  // that case and skip the current-password gate (they re-authed via
  // their magic-link to reach this page in the first place).
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwState, setPwState] = useState<PwState>({ kind: "idle" });
  const pwEval = useMemo(
    () => (newPw.length === 0 ? null : evaluatePasswordStrength(newPw)),
    [newPw],
  );
  // Heuristic: a user without an `email` identity (or whose
  // identity has no password provider) signed up via magic-link
  // and has no password to verify. The Supabase user object
  // exposes `identities` after a getUser() call.
  const hasPasswordIdentity = useMemo(() => {
    // supabase-js types identities as Array<{ provider: string }>
    // but the structure varies by SDK version; guard against both.
    const idents = (
      user as unknown as { identities?: Array<{ provider?: string }> } | null
    )?.identities;
    if (!Array.isArray(idents)) return true; // safer default: require current-pw
    return idents.some((i) => i.provider === "email");
  }, [user]);

  // Codex P2 (2026-05-25): profile edit form. The dashboard Edit
  // affordances all point here, so this is where Name/Phone/Org/Focus
  // actually become editable.
  const [profile, setProfile] = useState<ProfileShape | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSavedAt, setProfileSavedAt] = useState<number | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !user || !session?.access_token) return;
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/account/profile", {
          headers: { Authorization: `Bearer ${session!.access_token}` },
        });
        if (!res.ok) {
          if (!cancelled) setProfileLoading(false);
          return;
        }
        const body = (await res.json()) as {
          ok: boolean;
          profile?: ProfileShape | null;
          needs_completion?: boolean;
        };
        if (cancelled) return;
        if (body.needs_completion) {
          router.replace("/account/complete-profile");
          return;
        }
        setProfile(body.profile ?? null);
      } catch {
        // silent
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [loading, user, session, router]);

  // Sign out everywhere
  const [signingOutAll, setSigningOutAll] = useState(false);

  // Delete account
  const [deleteState, setDeleteState] = useState<DeleteState>({
    kind: "closed",
  });
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

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
    if (hasPasswordIdentity && !currentPw) {
      setPwState({ kind: "error", message: "Enter your current password." });
      return;
    }
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
    if (!supabase || !user?.email) {
      setPwState({
        kind: "error",
        message: "Sign-in isn't enabled yet on this environment.",
      });
      return;
    }
    // Codex P1 (2026-05-25): re-verify the current password before
    // updating IF the customer has one set. Magic-link-only customers
    // (no password identity) skip this check — they're setting their
    // first password, and reaching this page already required a
    // valid Supabase session (their magic-link auth proof).
    if (hasPasswordIdentity) {
      const reauth = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPw,
      });
      if (reauth.error) {
        setPwState({
          kind: "error",
          message: "Current password is incorrect.",
        });
        return;
      }
    }
    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) {
      setPwState({ kind: "error", message: error.message });
      return;
    }
    setPwState({ kind: "saved" });
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
  }

  async function onSaveProfile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (profileSaving || !profile) return;
    setProfileSaving(true);
    setProfileError(null);
    try {
      // Codex P2 (checkpoint 6): always send phone (even when blank)
      // so a clear is persisted. The route distinguishes "key present
      // but empty" from "key omitted entirely".
      const patch: Record<string, unknown> = {
        full_name: profile.full_name,
        phone: profile.phone ?? "",
        research_org_type: profile.research_org_type,
        research_org_other: profile.research_org_other ?? "",
        research_focus: profile.research_focus,
      };
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${session!.access_token}`,
        },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const body = (await res.json()) as { code?: string };
        setProfileError(
          body.code === "invalid_body"
            ? "Some fields are invalid. Check the highlighted entries."
            : "Could not save your profile. Try again.",
        );
        return;
      }
      setProfileSavedAt(Date.now());
    } catch {
      setProfileError("Network error. Please try again.");
    } finally {
      setProfileSaving(false);
    }
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
    if (!deletePassword) {
      setDeleteState({
        kind: "error",
        message: "Enter your current password — we re-verify before deleting.",
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
        body: JSON.stringify({ confirm: "DELETE", password: deletePassword }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { code?: string };
        const msg =
          body.code === "rate_limited"
            ? "Too many delete attempts. Try again later."
            : body.code === "reauth_failed" || body.code === "reauth_required"
              ? "Password is incorrect — re-verify and try again."
              : "Could not delete your account. Try again or contact support.";
        setDeleteState({ kind: "error", message: msg });
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

        {/* Profile edit (codex P2 fix) */}
        <Card>
          {profileLoading ? (
            <p className="p-6 text-sm text-slate-500">Loading profile...</p>
          ) : !profile ? (
            <p className="p-6 text-sm text-slate-500">
              No profile to edit yet.{" "}
              <Link
                href="/account/complete-profile"
                className="underline underline-offset-2"
              >
                Complete your profile
              </Link>
              .
            </p>
          ) : (
            <form
              onSubmit={onSaveProfile}
              className="flex flex-col gap-4 p-5"
              noValidate
            >
              <h2 className="text-lg font-medium">Profile</h2>
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor="prof-name" required>
                  Full legal name
                </FieldLabel>
                <Input
                  id="prof-name"
                  required
                  value={profile.full_name}
                  onChange={(e) =>
                    setProfile({ ...profile, full_name: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor="prof-phone">Phone (optional)</FieldLabel>
                <Input
                  id="prof-phone"
                  type="tel"
                  value={profile.phone ?? ""}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor="prof-org_type" required>
                  Research organization type
                </FieldLabel>
                <select
                  id="prof-org_type"
                  required
                  value={profile.research_org_type}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      research_org_type: e.target.value,
                    })
                  }
                  className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
                >
                  {RESEARCH_ORG_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {ORG_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
              {profile.research_org_type === "other" && (
                <div className="flex flex-col gap-1">
                  <FieldLabel htmlFor="prof-org_other" required>
                    Describe your organization
                  </FieldLabel>
                  <Input
                    id="prof-org_other"
                    value={profile.research_org_other ?? ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        research_org_other: e.target.value,
                      })
                    }
                  />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor="prof-focus" required>
                  Research focus
                </FieldLabel>
                <textarea
                  id="prof-focus"
                  required
                  minLength={10}
                  maxLength={500}
                  rows={3}
                  value={profile.research_focus}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      research_focus: e.target.value,
                    })
                  }
                  className="rounded-md border border-slate-300 bg-white p-3 text-sm"
                />
              </div>
              {profileError && (
                <div
                  role="alert"
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900"
                >
                  {profileError}
                </div>
              )}
              {profileSavedAt !== null && (
                <Pill variant="electric">Profile saved</Pill>
              )}
              <p className="text-xs text-slate-500">
                Email is not editable here — email changes go through a separate
                re-verification flow. Date of birth is immutable; contact
                support to change.
              </p>
              <Button type="submit" variant="primary" disabled={profileSaving}>
                {profileSaving ? "Saving..." : "Save profile"}
              </Button>
            </form>
          )}
        </Card>

        {/* Change password */}
        <Card>
          <form
            onSubmit={onChangePassword}
            className="flex flex-col gap-4 p-5"
            noValidate
          >
            <h2 className="text-lg font-medium">
              {hasPasswordIdentity ? "Change password" : "Set a password"}
            </h2>
            <p className="text-sm text-slate-600">
              {hasPasswordIdentity
                ? "Enter your current password, then choose a strong new one."
                : "Your account uses magic-link sign-in. Add a password as a faster way to sign in next time."}
            </p>
            {hasPasswordIdentity && (
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor="sec-current" required>
                  Current password
                </FieldLabel>
                <Input
                  id="sec-current"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                />
              </div>
            )}
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
                  Strength:{" "}
                  {["very weak", "weak", "ok", "good", "strong"][pwEval.score]}
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
            <Button
              type="submit"
              variant="primary"
              disabled={pwState.kind === "saving"}
            >
              {pwState.kind === "saving"
                ? "Saving..."
                : hasPasswordIdentity
                  ? "Update password"
                  : "Set password"}
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
                  This is permanent. Type <strong>DELETE</strong> and re-enter
                  your password to confirm.
                </p>
                <Input
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="DELETE"
                  aria-label="Type DELETE to confirm"
                />
                <Input
                  type="password"
                  autoComplete="current-password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Your current password"
                  aria-label="Re-enter your current password"
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
