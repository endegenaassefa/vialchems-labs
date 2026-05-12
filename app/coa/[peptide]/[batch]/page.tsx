/**
 * Per-batch COA detail page. Phase 5 renders structured data for the placeholder
 * batch and links to a placeholder PDF. The "EXAMPLE COA — REPLACE BEFORE
 * LAUNCH" notice is rendered prominently per the dispatch.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Pill } from "@/components/ui/Pill";
import { Card } from "@/components/ui/Card";
import { buttonClassNames } from "@/components/ui/Button";
import { coaRecords, getCoa } from "@/lib/content/coa";
import { getProductBySlug } from "@/lib/content/products";
import { breadcrumbJsonLd, serializeJsonLdSafe } from "@/lib/seo/jsonLd";
import { siteConfig } from "@/lib/content/site";

interface PageProps {
  params: Promise<{ peptide: string; batch: string }>;
}

export function generateStaticParams() {
  return coaRecords.map((r) => ({
    peptide: r.peptide,
    batch: r.batch,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { peptide, batch } = await params;
  const coa = getCoa(peptide, batch);
  if (!coa) return { title: "COA not found" };
  const isSample = coa.status === "sample";
  return {
    title: `${coa.peptideName} · ${coa.batch}`,
    description: isSample
      ? `Sample Certificate of Analysis layout for ${coa.peptideName}. Production batch values are required before shipment.`
      : `Independent third-party Certificate of Analysis for ${coa.peptideName}, batch ${coa.batch}, tested by ${coa.lab}.`,
    robots: isSample
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : undefined,
  };
}

export default async function CoaDetailPage({ params }: PageProps) {
  const { peptide, batch } = await params;
  const coa = getCoa(peptide, batch);
  if (!coa) {
    notFound();
  }
  const product = getProductBySlug(coa.peptide);

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", url: `${siteConfig.url}/` },
    { name: "Certificates", url: `${siteConfig.url}/coa` },
    {
      name: `${coa.peptideName} · ${coa.batch}`,
      url: `${siteConfig.url}/coa/${coa.peptide}/${coa.batch}`,
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLdSafe(breadcrumbLd) }}
      />
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-6">
              <Link href="/coa" className="hover:text-[var(--accent-soft)]">
                ← All Certificates
              </Link>
            </p>

            {/* Phase 4 v4: header hierarchy adopts Appendix AD §1 label
                ordering: BRAND → COMPOUND → DOSE → BATCH → DATES → STATUS.
                The PDP-side wrap-label (<Vial withLabel ...>) and this COA
                detail header now share the same visual rhythm so a buyer
                scanning the physical product label and the digital COA
                page perceives them as the same object. */}
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)] mb-2">
              VIALCHEMLABS
            </p>
            <h1 className="text-[clamp(36px,5vw,60px)] font-light leading-[1.08] tracking-tight text-[var(--text)] mb-2">
              {coa.peptideName}
            </h1>
            {product ? (
              <p className="font-mono tabular text-[20px] text-[var(--accent)] mb-3">
                {product.dose}
              </p>
            ) : null}
            <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-[var(--text-muted)] mb-2">
              Batch {coa.batch}
            </p>
            <p className="font-mono text-[13px] text-[var(--text-muted)] mb-6">
              Tested {coa.testDate}
            </p>
            <div className="mb-8">
              <Pill variant={coa.status === "verified" ? "accent" : "info"}>
                {coa.status === "verified" ? "Verified" : "Sample only"}
              </Pill>
            </div>

            <div
              role="note"
              aria-label="Sample certificate"
              className="mb-10 rounded-[14px] border border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_8%,transparent)] px-6 py-5 shadow-[var(--shadow-sm)]"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-2">
                Sample certificate
              </p>
              <p className="text-[14px] text-[var(--text)] leading-[1.6]">
                This is a sample certificate layout. Production batch
                certificates require live laboratory values and PDF upload
                before any lot is released for shipment.
              </p>
            </div>

            {/* Phase 4 v4: Specs grid in elevated Card */}
            <Card variant="elevated" className="p-0 overflow-hidden">
              <dl className="divide-y divide-[var(--border)]">
                <Row label="Peptide" value={coa.peptideName} />
                <Row label="Batch" value={coa.batch} mono />
                <Row label="Test date" value={coa.testDate} mono />
                <Row label="Laboratory" value={coa.lab} />
                <Row
                  label="HPLC purity"
                  value={`${coa.hplcPurityPct.toFixed(1)}% (area-percent, UV 220nm)`}
                  mono
                />
                <Row
                  label="USP <71> sterility"
                  value={coa.sterilityResult}
                  mono
                />
                <Row
                  label="LAL endotoxin"
                  value={coa.endotoxinEU_per_mg}
                  mono
                />
              </dl>
            </Card>

            <div className="mt-10 flex flex-wrap gap-3">
              {coa.status === "verified" ? (
                <a
                  href={coa.pdfPath}
                  className={buttonClassNames("primary", "lg")}
                >
                  Download PDF
                </a>
              ) : (
                <span
                  className={buttonClassNames("outline", "lg")}
                  aria-disabled="true"
                >
                  PDF pending
                </span>
              )}
              {/* v1.3 — operator override per Iron Law 2.26 — public-facing
                  external "verify at lab portal" link removed (no specific
                  lab affiliation in UI). The COA PDF below is the verification
                  artifact; lab portal verification, if needed, is operator-
                  side via the contractual partner relationship. */}
            </div>

            <p className="mt-10 text-[13px] text-[var(--text-subtle)] leading-[1.6]">
              Test methodology: HPLC area-percent purity (reverse-phase, UV
              220nm), USP &lt;71&gt; sterility (broth-based growth assay), and
              Limulus Amebocyte Lysate (LAL) gel-clot endotoxin. Test article
              retained for re-verification per laboratory standard practice.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
      <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
        {label}
      </dt>
      <dd
        className={`text-[15px] text-[var(--text)] ${
          mono ? "font-mono tabular" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
