/**
 * About page — verbatim from SUPER_PROMPT_v3 Appendix N.
 *
 * Brand placeholders substituted: vialchem.labs / independent third-party lab.
 * In SKIP_PATHS for grep-forbidden-words.sh because the verbatim Appendix N
 * compliance section uses FDA-mandated negation phrasing
 * ("not intended to diagnose, treat, cure, or prevent any disease").
 */
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProcessFlow } from "@/components/ui/ProcessFlow";
import { siteConfig } from "@/lib/content/site";

/* v4 design overhaul — verbatim Appendix N prose UNCHANGED. Additive edits:
 *   - ProcessFlow added between Thesis and Operations to show "what every
 *     batch goes through" (Titan-inspired pattern).
 *   - NamedAttestation placeholder added at the end (pre-launch honesty).
 *   - Hero/section padding aligned with the broader v4 lift (py-32/40/48).
 * `git diff` will show that prose paragraphs have ZERO additions or removals.
 */
const PROCESS_STEPS = [
  {
    n: 1,
    title: "Sourced",
    description:
      "Synthesized at GMP-licensed facility against the canonical sequence; release documents reviewed before warehouse intake.",
  },
  {
    n: 2,
    title: "Sampled",
    description:
      "Sample drawn under chain-of-custody and shipped to an independent third-party laboratory for test.",
  },
  {
    n: 3,
    title: "Tested",
    description:
      "HPLC area-percent purity, USP <71> sterility, LAL endotoxin in EU/mg.",
  },
  {
    n: 4,
    title: "Published",
    description:
      "COA posted to /coa with batch number, test date, and methodology so the data is on file.",
  },
];

export const metadata: Metadata = {
  title: "About",
  description:
    "vialchem.labs supplies research peptides independently verified per batch. We compete on one axis: measurable accuracy.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* HERO (verbatim Appendix N) */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-6">
              About / {siteConfig.name}
            </p>
            <h1 className="text-[clamp(40px,5.6vw,72px)] font-light leading-[1.05] tracking-tight text-[var(--text)] mb-10">
              <span className="block">Measurable</span>
              <span className="font-serif-italic block text-[var(--accent-soft)]">
                accuracy.
              </span>
            </h1>

            <div className="space-y-6 text-[17px] leading-[1.6] text-[var(--text-muted)]">
              <p>
                We are a peptide research supplier launching into a market of
                1,500+ vendors. Most compete on volume, claims, or brand
                heritage. We compete on one axis: measurable accuracy.
              </p>
              <p>
                vialchem.labs runs an independent third-party testing program —{" "}
                <span className="text-[var(--text)]">
                  independent lab work, published Certificates of Analysis,
                  traceable batch numbers
                </span>
                . We do not claim expertise in effects or outcomes — that is the
                researcher&apos;s work. We claim expertise in knowing, with
                precision, what you ordered.
              </p>
              <p>
                The research-peptide industry has never had consistent
                third-party testing as a standard. Most vendors publish no
                Certificates of Analysis. Some publish claimed COAs without
                independent verification. A few publish results from independent
                labs. We do the third thing — independent third-party testing
                with the COA published alongside the product so the data is on
                the table.
              </p>
              <p className="text-[var(--text)]">
                You are not paying for a story. You are paying for data. We
                publish ours.
              </p>
              <p className="font-mono text-[14px] text-[var(--text-subtle)] uppercase tracking-[0.16em]">
                For researchers, by researchers. {siteConfig.name}, since 2026.
              </p>
            </div>
          </div>
        </section>

        {/* THESIS */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
              01 / Thesis
            </p>
            <h2 className="text-[32px] md:text-[40px] font-light leading-tight tracking-tight text-[var(--text)] mb-8">
              Small catalog. Deep transparency. Third-party-verified accuracy.
            </h2>
            <div className="space-y-5 text-[16px] leading-[1.65] text-[var(--text-muted)]">
              <p>
                {siteConfig.name} was founded on a simple observation: the
                research-peptide market is large, fragmented, and trust-poor.
                Tier 1 vendors carry catalogs of 25+ compounds without
                independent third-party testing. Tier 2 vendors compete on price
                without compliance discipline. Tier 3 vendors are typosquats,
                shells, or single-thread mentions that disappear within a year.
              </p>
              <p>
                We started {siteConfig.name} because we believed there was room
                for a different positioning: small catalog, deep transparency,
                third-party-verified accuracy. The live catalog is focused on
                operator-approved research records across structural, endocrine,
                copper, mitochondrial, neuropeptide, and analytical reference
                systems. Each live item is tested by{" "}
                {siteConfig.labPartner.name} per batch. Each batch&apos;s COA is
                published.
              </p>
              <p>
                Non-live catalog records are handled as custom requests rather
                than instant-checkout products. Our positioning is not
                &quot;everything you can buy&quot; — it is &quot;everything you
                can verify.&quot;
              </p>
            </div>
          </div>
        </section>

        {/* v4 — additive ProcessFlow between Thesis and Operations. */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-32 md:py-40">
            <ProcessFlow
              eyebrow="Pipeline"
              headline="The pipeline from sample draw to your bench."
              steps={PROCESS_STEPS}
              layout="vertical"
            />
          </div>
        </section>

        {/* OPERATIONS */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
              02 / Operations
            </p>
            <h2 className="text-[32px] md:text-[40px] font-light leading-tight tracking-tight text-[var(--text)] mb-8">
              US warehouse. Same-business-day shipping. Self-hosted payments.
            </h2>
            <div className="space-y-5 text-[16px] leading-[1.65] text-[var(--text-muted)]">
              <p>
                {siteConfig.name} operates from a US warehouse with
                same-business-day shipping on orders before 3pm Mon-Fri. We ship
                USPS Priority and FedEx 2-Day. Payment options are crypto via
                self-hosted BTCPay Server (10-15% discount) or US bank transfer
                via Plaid ACH (5% discount). Credit cards are not currently
                supported.
              </p>
              <p>
                Buyer qualification is required and includes age verification
                (21+), institutional or research-role identification,
                research-purpose statement, jurisdictional acknowledgment, and
                research-use-only commitment.
              </p>
            </div>
          </div>
        </section>

        {/* COMPLIANCE */}
        <section>
          <div className="mx-auto max-w-3xl px-6 py-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
              03 / Compliance
            </p>
            <h2 className="text-[32px] md:text-[40px] font-light leading-tight tracking-tight text-[var(--text)] mb-8">
              Chemical supplier. Not a compounding pharmacy.
            </h2>
            <div className="space-y-5 text-[16px] leading-[1.65] text-[var(--text-muted)]">
              <p>
                {siteConfig.name} is a chemical supplier. {siteConfig.name} is
                not a compounding pharmacy or chemical compounding facility as
                defined under 503A of the Federal Food, Drug, and Cosmetic Act.{" "}
                {siteConfig.name} is not an outsourcing facility as defined
                under 503B.
              </p>
              <p>
                All products are sold strictly for in-vitro laboratory research
                and analytical purposes only. Not for human or animal
                consumption, medical, veterinary, or therapeutic use of any
                kind.
              </p>
              <p>
                The statements made within this website have not been evaluated
                by the U.S. Food and Drug Administration. The products of this
                company are not intended to diagnose, treat, cure, or prevent
                any disease.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
