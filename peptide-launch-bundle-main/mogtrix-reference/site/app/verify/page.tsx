import type { Metadata } from "next";
import Link from "next/link";
import { getCustomerAccessState } from "@/lib/customer";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Verify Your Email",
  robots: {
    index: false,
    follow: false
  }
};

export const dynamic = "force-dynamic";

export default async function VerifyPage({
  searchParams
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  const state = await getCustomerAccessState();

  if (state.kind === "ready") {
    redirect("/shop");
  }

  if (state.kind === "unqualified") {
    redirect("/qualify");
  }

  return (
    <main className="shell py-16">
      <div className="mx-auto max-w-4xl">
        <section className="metal overflow-hidden rounded-[30px] p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                Email confirmation
              </p>
              <h1 className="mt-3 text-5xl font-black text-white">
                Verify your email
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
                We sent a confirmation link to
                {" "}
                <span className="text-white">
                  {email || "your email address"}
                </span>
                . Open the email once, then come back to finish your account setup.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black"
                >
                  Back to sign in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-white hover:border-[var(--accent)]"
                >
                  Use a different email
                </Link>
              </div>
            </div>

            <div className="rounded-[24px] border border-[var(--border)] bg-[rgba(7,11,7,0.82)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                Next steps
              </p>
              <ol className="mt-4 grid gap-4 text-sm leading-7 text-[var(--text-muted)]">
                <li>1. Open the email from Mogtrix.</li>
                <li>2. Click the confirmation link.</li>
                <li>3. Return to finish your account details.</li>
                <li>4. Then view pricing, documents, and checkout tools.</li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
