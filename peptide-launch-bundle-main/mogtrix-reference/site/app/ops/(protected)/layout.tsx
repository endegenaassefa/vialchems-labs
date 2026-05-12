import Link from "next/link";
import { Button } from "@/components/button";
import { requireStaffPageSession } from "@/lib/ops";
import { signOut } from "@/app/ops/actions";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Staff Workspace",
  robots: {
    index: false,
    follow: false
  }
};

export default async function OpsProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await requireStaffPageSession("/ops");

  return (
    <main className="shell py-12">
      <section className="metal rounded-[22px] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--accent)]">Operator workspace</p>
            <h1 className="mt-2 text-3xl font-black text-white">Mogtrix ops workspace</h1>
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              Signed in as {session.profile.fullName ?? session.profile.email} · {session.profile.role}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/ops" className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm text-white hover:border-[var(--accent)]">
              Requests
            </Link>
            <Link href="/ops/orders" className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm text-white hover:border-[var(--accent)]">
              Paid orders
            </Link>
            <Link href="/shop" className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm text-white hover:border-[var(--accent)]">
              Public catalog
            </Link>
            <form action={signOut}>
              <Button variant="outline" type="submit">Sign out</Button>
            </form>
          </div>
        </div>
      </section>
      <div className="mt-8">{children}</div>
    </main>
  );
}
