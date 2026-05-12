import type { Metadata } from "next";

import {
  testingHighlights,
  testingSteps
} from "@/lib/content/testing";

export const metadata: Metadata = {
  title: "Testing"
};

export default function TestingPage() {
  return (
    <main className="shell py-16">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <section className="metal rounded-[28px] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            COA and testing
          </p>
          <h1 className="mt-3 text-5xl font-black text-white">Testing support surface</h1>
          <p className="mt-4 text-[var(--text-muted)]">
            Mogtrix uses this page to explain how documentation status, batch
            lookup, and record release fit into the signed-in storefront.
          </p>
          <ul className="mt-6 grid gap-3">
            {testingHighlights.map((item) => (
              <li
                key={item}
                className="rounded-[20px] border border-[var(--border)] px-4 py-3 text-sm leading-6 text-[var(--text-muted)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
        <section className="grid gap-4">
          {testingSteps.map((step) => (
            <article key={step.title} className="metal rounded-[24px] p-6">
              <h2 className="text-2xl font-black text-white">{step.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                {step.body}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
