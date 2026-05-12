import Link from "next/link";
import type { Metadata } from "next";
import { signupCustomer } from "@/app/auth/actions";
import { CustomerAccessShell } from "@/components/customer-access-shell";
import { getCustomerAuthMode } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create Customer Account",
  robots: {
    index: false,
    follow: false
  }
};

const errorMessages: Record<string, string> = {
  config: "Customer sign-up is unavailable until public authentication is configured.",
  credentials: "Enter your full name, email, and a password with at least 8 characters.",
  signup: "We couldn't create your account. Please check the form and try again."
};

export default async function SignupPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const mode = getCustomerAuthMode();

  return (
    <CustomerAccessShell
      title="Create account"
      description="Create your account to view pricing, records, and order status."
      mode={mode}
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-white underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      {error ? (
        <div className="mb-5 rounded-2xl border border-[#7a2a22] bg-[#210b08] p-4 text-sm text-[#ffb1a3]">
          {errorMessages[error] ?? "The customer account could not be created."}
        </div>
      ) : null}

      <form action={signupCustomer} className="grid gap-4">
        <label className="grid gap-2">
          <span>Full name</span>
          <input
            name="fullName"
            autoComplete="name"
            className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white"
          />
        </label>
        <label className="grid gap-2">
          <span>Organization or lab</span>
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
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!mode.configured}
          type="submit"
        >
          Create account
        </button>
      </form>
    </CustomerAccessShell>
  );
}
