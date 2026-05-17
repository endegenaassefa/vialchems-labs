/**
 * FAQ — 20 verbatim Q+A from SUPER_PROMPT_v3 Appendix M.
 * In SKIP_PATHS for grep-forbidden-words.sh because Q13 names the
 * excluded GLP-1 compounds in their non-marketing exclusion-rationale context.
 *
 * No client-side state needed: <details> is native browser-controlled
 * disclosure. Server component.
 */
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StaggerReveal } from "@/components/ui/StaggerReveal";
import { faqEntries } from "@/lib/content/faq";
import { faqPageJsonLd, serializeJsonLdSafe } from "@/lib/seo/jsonLd";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Twenty answers on vialchem.labs research peptides, Certificates of Analysis, payment, shipping, refunds, and the affiliate program.",
};

export default function FaqPage() {
  const faqLd = faqPageJsonLd(
    faqEntries.map((entry) => ({ q: entry.q, a: entry.a })),
  );
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLdSafe(faqLd) }}
      />
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* v4 hero — varied. FAQ uses a numbered counter range hero
            (01 → 20) per the brand's mono-numerical visual register. */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-32 md:py-40">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-10">
              F R E Q U E N T L Y · A S K E D
            </p>
            <div className="flex items-baseline gap-6 mb-10">
              <p className="font-mono tabular text-[clamp(96px,16vw,180px)] leading-none font-light text-[var(--text)]">
                20
              </p>
              <div className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--text-subtle)] leading-relaxed">
                <p>questions</p>
                <p>answered</p>
                <p>below</p>
              </div>
            </div>
            <p className="text-[18px] leading-[1.55] text-[var(--text-muted)] max-w-2xl">
              Operational and compliance questions. If yours is not here, reach
              the team via{" "}
              <a
                href="/contact"
                className="text-[var(--accent)] hover:text-[var(--accent-soft)]"
              >
                the contact form
              </a>{" "}
              — response within one business day.
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-3xl px-6 py-12">
            <StaggerReveal as="ol" itemAs="li" className="space-y-3">
              {faqEntries.map((entry, idx) => (
                <details
                  key={idx}
                  className="group rounded-[14px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] open:border-[var(--border-strong)] open:bg-[var(--surface-elevated)] open:shadow-[var(--shadow-md)] transition-[background-color,border-color,box-shadow] duration-[var(--dur-short)]"
                >
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
                      {String(idx + 1).padStart(2, "0")}
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
              ))}
            </StaggerReveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
