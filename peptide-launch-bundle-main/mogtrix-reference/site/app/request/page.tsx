import { RequestForm } from "@/components/request-form";
import { requireCustomerPageSession } from "@/lib/customer";
import { getSupabaseMode } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function RequestPage() {
  await requireCustomerPageSession("/request");
  const mode = getSupabaseMode();

  return (
    <main className="shell py-16">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase text-[var(--accent)]">Required attestations</p>
        <h1 className="mt-3 text-5xl font-black text-white">Request manual procurement help</h1>
        <p className="mt-4 text-[var(--text-muted)]">Use this path for special sourcing questions or orders that need staff follow-up outside the standard catalog checkout flow.</p>
        <p className="mt-4 rounded-2xl border border-[var(--border)] px-4 py-3 text-sm text-[var(--text-muted)]">{mode.label}: {mode.reason}</p>
      </div>
      <div className="metal rounded-[22px] p-6">
        <RequestForm />
      </div>
    </main>
  );
}
