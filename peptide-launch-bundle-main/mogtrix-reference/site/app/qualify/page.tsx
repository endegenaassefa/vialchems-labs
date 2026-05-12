import type { Metadata } from "next";
import { completeCustomerQualification } from "@/app/auth/actions";
import { QualificationFlow } from "@/components/qualification-flow";
import { getCustomerAccessState, getCustomerRouteDecision, normalizeCustomerNextPath } from "@/lib/customer";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Finish Account Setup",
  robots: {
    index: false,
    follow: false
  }
};

const errorMessages: Record<string, string> = {
  required: "Complete every required step, including any follow-up details for custom answers, before continuing.",
  save: "We couldn't save your account details. Please try again."
};

export default async function QualifyPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  const state = await getCustomerAccessState();
  const nextPath = normalizeCustomerNextPath(next);
  const decision = getCustomerRouteDecision("/qualify", state);

  if (state.kind === "unavailable") {
    return (
      <main className="shell py-16">
        <div className="metal mx-auto max-w-3xl rounded-[22px] p-6">
          <h1 className="text-4xl font-black text-white">Account setup is unavailable in local demo mode.</h1>
          <p className="mt-4 text-[var(--text-muted)]">Configure public Supabase auth to test the customer account flow.</p>
        </div>
      </main>
    );
  }

  if (decision.action === "redirect") {
    redirect(decision.location);
  }

  if (state.kind !== "unqualified") {
    redirect("/login");
  }

  return (
    <main className="shell py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">One-time account setup</p>
          <h1 className="mt-3 text-5xl font-black text-white">Finish your account setup</h1>
          <p className="mt-4 text-[var(--text-muted)]">
            Tell us a little about your lab or purchasing workflow so we can open pricing, product details, and checkout for your account.
          </p>
        </div>

        {error ? (
          <div className="mb-5 rounded-2xl border border-[#7a2a22] bg-[#210b08] p-4 text-sm text-[#ffb1a3]">
            {errorMessages[error] ?? "We couldn't complete your account setup."}
          </div>
        ) : null}

        <section className="metal rounded-[22px] p-6">
          <QualificationFlow
            action={completeCustomerQualification}
            customerEmail={state.user.email ?? ""}
            customerName={state.profile.fullName || state.user.email || "Customer"}
            defaultInstitutionName={state.profile.organization ?? ""}
            nextPath={nextPath}
          />
        </section>
      </div>
    </main>
  );
}
