import Link from "next/link";
import type { Metadata } from "next";
import { loginCustomer } from "@/app/auth/actions";
import { CustomerAccessShell } from "@/components/customer-access-shell";
import { getCustomerAccessState } from "@/lib/customer";
import { getCustomerAuthMode } from "@/lib/customer-auth";
import { normalizeCustomerNextPath } from "@/lib/customer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Customer Sign In",
  robots: {
    index: false,
    follow: false
  }
};

const errorMessages: Record<string, string> = {
  access: "This account is not currently approved for the full catalog.",
  auth: "We couldn't match that email and password.",
  credentials: "Enter your email and password.",
  config: "Customer sign-in is unavailable until public authentication is configured.",
  verify: "Please verify your email before signing in."
};

const statusMessages: Record<string, string> = {
  verified: "Email confirmed. Sign in to continue.",
  signed_out: "You are signed out.",
  signup_success: "Account created. Check your inbox, verify your email, then sign in.",
  verify: "Check your inbox and verify your email before signing in."
};

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; next?: string; status?: string }>;
}) {
  const { error, next, status } = await searchParams;
  const mode = getCustomerAuthMode();
  const nextPath = normalizeCustomerNextPath(next);
  const state = await getCustomerAccessState();
  const displayError = error ?? (state.kind === "forbidden" ? "access" : undefined);

  return (
    <CustomerAccessShell
      title="Sign in"
      description="View pricing, batch records, and order status."
      mode={mode}
      footer={
        <>
          New to Mogtrix?{" "}
          <Link href="/signup" className="text-white underline underline-offset-4">
            Create account
          </Link>
        </>
      }
    >
      {displayError ? (
        <div className="mb-5 rounded-2xl border border-[#7a2a22] bg-[#210b08] p-4 text-sm text-[#ffb1a3]">
          {errorMessages[displayError] ?? "The customer session could not be started."}
        </div>
      ) : null}

      {status ? (
        <div className="mb-5 rounded-2xl border border-[#31583a] bg-[#071b0d] p-4 text-sm text-[#b8f6c4]">
          {statusMessages[status] ?? "Customer session status updated."}
        </div>
      ) : null}

      <form action={loginCustomer} className="grid gap-4">
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
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!mode.configured}
          type="submit"
        >
          Sign in
        </button>
      </form>
    </CustomerAccessShell>
  );
}
