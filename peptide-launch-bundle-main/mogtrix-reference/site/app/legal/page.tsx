import Link from "next/link";
import { legalPages } from "@/lib/content/legal";

export default function LegalIndexPage() {
  return (
    <main className="shell py-16">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">Policies and controls</p>
        <h1 className="mt-3 text-5xl font-black text-white">Legal policies</h1>
        <p className="mt-4 text-[var(--text-muted)]">
          These draft pages define the storefront boundary: gated access,
          protected checkout, research-use-only positioning, and order handling.
        </p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {legalPages.map((page) => (
          <Link key={page.slug} href={`/legal/${page.slug}`} className="metal rounded-[22px] p-6 hover:border-[var(--accent)]">
            <h2 className="text-2xl font-black text-white">{page.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{page.summary}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
