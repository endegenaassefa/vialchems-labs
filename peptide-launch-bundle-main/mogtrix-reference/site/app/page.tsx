import { ShieldCheck } from "lucide-react";
import { HomeActions } from "@/components/home-actions";
import { HomeProofRow } from "@/components/home-proof-row";

export default function HomePage() {
  return (
    <main>
      <section className="overflow-hidden border-b border-[var(--border)]">
        <div className="shell grid min-h-[calc(100vh-80px)] items-center gap-10 py-10 lg:grid-cols-[0.88fr_1.12fr] lg:py-14">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold uppercase text-[var(--accent)]">
              <ShieldCheck size={16} /> Approved research accounts
            </p>
            <h1 className="text-5xl font-black leading-[0.92] text-white md:text-7xl">
              Private catalog. No runaround.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--text-muted)]">
              Sign in to view availability, batch records, and order status.
            </p>
            <p className="mt-3 max-w-lg text-sm uppercase tracking-[0.24em] text-[var(--accent)]">
              Research-use restrictions apply. Verified buyers only.
            </p>
            <HomeActions />
            <div className="mt-8 grid max-w-xl gap-3 text-sm text-[var(--text-muted)] sm:grid-cols-3">
              <div className="rounded-[18px] border border-[var(--border)] bg-black/25 p-4">
                Create or confirm your account.
              </div>
              <div className="rounded-[18px] border border-[var(--border)] bg-black/25 p-4">
                Verify your email once.
              </div>
              <div className="rounded-[18px] border border-[var(--border)] bg-black/25 p-4">
                Review the catalog and place the order.
              </div>
            </div>
          </div>
          <div className="metal relative rounded-[34px] p-5 sm:p-6">
            <div className="pointer-events-none absolute inset-x-10 top-0 h-24 rounded-full bg-[radial-gradient(circle,_rgba(124,255,0,0.16),_rgba(124,255,0,0)_70%)] blur-3xl" />
            <p className="relative text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
              Current catalog proof
            </p>
            <p className="relative mt-3 max-w-md text-sm leading-7 text-[var(--text-muted)]">
              Product names stay visible here. Batch records and availability open after sign-in.
            </p>
            <div className="relative mt-5">
              <HomeProofRow />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
