/**
 * FAQ — 20 verbatim Q+A from SUPER_PROMPT_v3 Appendix M.
 * In SKIP_PATHS for grep-forbidden-words.sh because Q13 names the
 * excluded GLP-1 compounds in their non-marketing exclusion-rationale context.
 *
 * No client-side state needed: <details> is native browser-controlled
 * disclosure. Server component.
 */
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { faqEntries } from '@/lib/content/faq';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Twenty answers on Vialchems Labs research peptides, Certificates of Analysis, payment, shipping, refunds, and the affiliate program.',
};

export default function FaqPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-6">
              FAQ
            </p>
            <h1 className="text-[clamp(40px,5.6vw,72px)] font-light leading-[1.05] tracking-tight text-[var(--text)] mb-6">
              <span className="block">Twenty</span>
              <span className="font-serif-italic block text-[var(--accent-soft)]">answers.</span>
            </h1>
            <p className="text-[18px] leading-[1.55] text-[var(--text-muted)] max-w-2xl">
              Operational and compliance questions. If a question is not here,
              reach the team via <a href="/contact" className="text-[var(--accent)] hover:text-[var(--accent-soft)]">the contact form</a>.
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-3xl px-6 py-12">
            <ol className="space-y-3">
              {faqEntries.map((entry, idx) => (
                <li key={idx}>
                  <details className="group rounded-[14px] border border-[var(--border)] bg-[var(--surface)] open:border-[var(--border-strong)]">
                    <summary
                      className="
                        flex cursor-pointer items-baseline gap-4 px-6 py-5
                        text-[16px] font-medium text-[var(--text)]
                        list-none
                        marker:hidden
                        rounded-[14px]
                        hover:text-[var(--accent-soft)]
                        transition-colors duration-[var(--dur-short)]
                      "
                    >
                      <span className="font-mono text-[12px] tabular text-[var(--text-subtle)] shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1">{entry.q}</span>
                      <span
                        aria-hidden="true"
                        className="font-mono text-[14px] text-[var(--text-muted)] group-open:rotate-45 transition-transform duration-[var(--dur-short)]"
                      >
                        +
                      </span>
                    </summary>
                    <div className="px-6 pb-6 pl-[calc(1.5rem+2rem)] text-[15px] leading-[1.65] text-[var(--text-muted)]">
                      {entry.a}
                    </div>
                  </details>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
