import { Button } from "@/components/button";
import { login, requestStaffAccess } from "@/app/ops/actions";
import { getBrowserSupabaseConfig } from "@/lib/supabase";
import {
  normalizeOpsNextPath,
  STAFF_AUTH_ERROR,
  STAFF_AUTH_STATUS,
  type StaffAuthErrorCode,
  type StaffAuthStatusCode
} from "@/lib/ops";
import type { SupabaseEnv } from "@/lib/supabase/env";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Staff Access",
  robots: {
    index: false,
    follow: false
  }
};

const errorMessages: Record<StaffAuthErrorCode, string> = {
  [STAFF_AUTH_ERROR.auth]: "The email/password combination was rejected.",
  [STAFF_AUTH_ERROR.inactive]:
    "That account exists but is still pending staff activation.",
  [STAFF_AUTH_ERROR.profile]:
    "That auth account does not have a matching active staff profile yet. Ask an owner to repair and activate it from Admin.",
  [STAFF_AUTH_ERROR.credentials]: "Enter both an email and a password.",
  [STAFF_AUTH_ERROR.config]:
    "Ops access is unavailable until the public Supabase URL and public key are configured.",
  [STAFF_AUTH_ERROR.signup]:
    "The access request could not be created. Check the form and try again.",
  [STAFF_AUTH_ERROR.signupCredentials]:
    "Enter a valid email, full name, and a password of at least 8 characters.",
  [STAFF_AUTH_ERROR.signupDisabled]:
    "Staff signup is currently closed. Ask an existing owner to invite or activate the account."
};

const statusMessages: Record<StaffAuthStatusCode, string> = {
  [STAFF_AUTH_STATUS.signupPending]:
    "Access request created. Confirm the email if prompted, then wait for an owner to activate the staff profile."
};

function getOpsErrorMessage(error?: string) {
  if (!error) {
    return null;
  }

  return errorMessages[error as StaffAuthErrorCode] ?? "The operator session could not be started.";
}

function getOpsStatusMessage(status?: string) {
  if (!status) {
    return null;
  }

  return statusMessages[status as StaffAuthStatusCode] ?? "Staff access status updated.";
}

export default async function OpsLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; mode?: string; next?: string; status?: string }>;
}) {
  const { error, mode, next, status } = await searchParams;
  const browser = getBrowserSupabaseConfig(process.env as SupabaseEnv);
  const nextPath = normalizeOpsNextPath(next);
  const signupEnabled = process.env.OPS_SIGNUP_ENABLED === "true";
  const signupOpen = mode === "signup";

  return (
    <main className="shell py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">Protected operator access</p>
          <h1 className="mt-3 text-5xl font-black text-white">Mogtrix request ops</h1>
          <p className="mt-4 text-[var(--text-muted)]">
            Staff sign in with Supabase email/password accounts. New accounts stay pending until an owner activates the staff profile.
          </p>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-black/40 p-4 text-sm text-[var(--text-muted)]">
            <p className="font-semibold text-white">Public auth connection</p>
            <p className="mt-2">
              {browser.configured
                ? "Configured. Email/password sign-in is available on this deployment."
                : "Missing or malformed. Staff sign-in will stay blocked until the public Supabase URL and public key are fixed."}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-black/40 p-4 text-sm text-[var(--text-muted)]">
            <p className="font-semibold text-white">Signup mode</p>
            <p className="mt-2">
              {signupEnabled
                ? "Open. New staff requests create pending accounts that still require owner activation."
                : "Closed. Set OPS_SIGNUP_ENABLED=true on the target deployment before expecting the request form to accept signups."}
            </p>
          </div>
        </div>

        {!browser.configured ? (
          <div className="mb-5 rounded-2xl border border-[#7a2a22] bg-[#210b08] p-4 text-sm text-[#ffb1a3]">
            Ops access is blocked until the public Supabase URL and public key are configured correctly.
          </div>
        ) : null}

        {error ? (
          <div className="mb-5 rounded-2xl border border-[#7a2a22] bg-[#210b08] p-4 text-sm text-[#ffb1a3]">
            {getOpsErrorMessage(error)}
          </div>
        ) : null}

        {status ? (
          <div className="mb-5 rounded-2xl border border-[#31583a] bg-[#071b0d] p-4 text-sm text-[#b8f6c4]">
            {getOpsStatusMessage(status)}
          </div>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="metal rounded-[22px] p-6">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase text-[var(--accent)]">Existing staff</p>
              <h2 className="mt-2 text-2xl font-black text-white">Sign in</h2>
            </div>

            <form action={login} className="grid gap-4">
              <input type="hidden" name="next" value={nextPath} />
              <label className="grid gap-2">
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white"
                />
              </label>
              <label className="grid gap-2">
                <span>Password</span>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white"
                />
              </label>
              <Button disabled={!browser.configured}>Sign in to ops</Button>
            </form>
          </section>

          <section className="metal rounded-[22px] p-6" id="request-access">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase text-[var(--accent)]">New staff</p>
              <h2 className="mt-2 text-2xl font-black text-white">Request access</h2>
              <p className="mt-3 text-sm text-[var(--text-muted)]">
                Signup creates a pending account only. An owner must activate the profile before ops opens.
              </p>
            </div>

            {!signupEnabled ? (
              <div className="rounded-2xl border border-[var(--border)] bg-black/40 p-4 text-sm text-[var(--text-muted)]">
                Staff signup is closed on this deployment.
              </div>
            ) : null}

            {signupEnabled && signupOpen ? (
              <form action={requestStaffAccess} className="grid gap-4">
                <label className="grid gap-2">
                  <span>Full name</span>
                  <input
                    name="fullName"
                    autoComplete="name"
                    className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white"
                  />
                </label>
                <label className="grid gap-2">
                  <span>Organization</span>
                  <input
                    name="organization"
                    autoComplete="organization"
                    className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white"
                  />
                </label>
                <label className="grid gap-2">
                  <span>Email</span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white"
                  />
                </label>
                <label className="grid gap-2">
                  <span>Password</span>
                  <input
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white"
                  />
                </label>
                <Button disabled={!browser.configured}>Request staff access</Button>
              </form>
            ) : null}

            {signupEnabled && !signupOpen ? (
              <a
                href="/ops/login?mode=signup#request-access"
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-white transition hover:border-[var(--accent)]"
              >
                Open request form
              </a>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
