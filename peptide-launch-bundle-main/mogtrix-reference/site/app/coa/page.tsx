import type { Metadata } from "next";
import Link from "next/link";

import { VerifyClient } from "@/components/verify-client";
import { sampleBatches } from "@/lib/content/verification";

export const metadata: Metadata = {
  title: "COA Library"
};

export default function CoaPage() {
  return (
    <main className="shell py-16">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <section className="space-y-6">
          <article className="metal rounded-[28px] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
              COA Library & Batch Lookup
            </p>
            <h1 className="mt-3 text-5xl font-black text-white">
              COA Library & Batch Lookup
            </h1>
            <p className="mt-4 text-[var(--text-muted)]">
              Search batch-linked record status, supporting document release,
              and current testing context without leaving the Mogtrix storefront.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/testing" className="button button-secondary">
                Testing
              </Link>
              <Link href="/faq" className="button button-secondary">
                FAQ
              </Link>
            </div>
          </article>

          <section className="grid gap-4">
            {sampleBatches.map((batch) => (
              <article key={batch.batchId} className="metal rounded-[24px] p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                      {batch.batchId}
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-white">
                      {batch.category}
                    </h2>
                  </div>
                  <p className="rounded-full border border-[var(--border)] px-3 py-2 text-xs text-white">
                    {batch.documentStatus}
                  </p>
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
                  {batch.testingLab}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
                  {batch.documentSet.map((item) => (
                    <li key={item} className="rounded-full border border-[var(--border)] px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </section>
        </section>

        <VerifyClient />
      </div>
    </main>
  );
}
