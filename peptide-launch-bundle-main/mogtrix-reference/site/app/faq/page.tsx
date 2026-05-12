import type { Metadata } from "next";

import { faqItems } from "@/lib/content/faq";

export const metadata: Metadata = {
  title: "FAQ"
};

export default function FaqPage() {
  return (
    <main className="shell py-16">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Storefront support
        </p>
        <h1 className="mt-3 text-5xl font-black text-white">Frequently asked questions</h1>
        <p className="mt-4 text-[var(--text-muted)]">
          Quick answers about sign-in, qualification, pilot checkout, supporting
          documents, and follow-up.
        </p>
      </div>
      <div className="mt-8 grid gap-4">
        {faqItems.map((item) => (
          <article key={item.question} className="metal rounded-[24px] p-6">
            <h2 className="text-2xl font-black text-white">{item.question}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
              {item.answer}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
