/**
 * Per-batch COA detail page. Phase 1H rewrite: replaces the legacy 6-row
 * flat spec table with the WWB-style 2x2 TestPanel layout that
 * /verify/[slug] already uses. Same content, same components, both URL
 * patterns reach the cool grid view.
 *
 * The /coa/[peptide]/[batch] URL is preserved (legacy email links + the
 * /coa search-index entries point at it) so existing inbound traffic
 * doesn't 404. Internally it now renders TestPanel + breadcrumb +
 * footer nav from components/v2/verify/.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { V2Footer, V2Header } from "@/components/v2/Shell";
import { TestPanel } from "@/components/v2/verify/TestPanel";
import { VerifyBreadcrumb } from "@/components/v2/verify/VerifyBreadcrumb";
import { VerifyFooterNav } from "@/components/v2/verify/VerifyFooterNav";
import { coaRecords, getCoa, getProductTestPanel } from "@/lib/content/coa";
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
  return {
    title: `${coa.peptideName} · Lab Reports · ${coa.batch}`,
    description: `Independent third-party lab reports for ${coa.peptideName}, batch ${coa.batch}: HPLC purity, sterility, endotoxin, and heavy metals.`,
  };
}

export default async function CoaDetailPage({ params }: PageProps) {
  const { peptide, batch } = await params;
  const coa = getCoa(peptide, batch);
  if (!coa) {
    notFound();
  }
  const product = getProductBySlug(coa.peptide);
  const panel = getProductTestPanel(coa.peptide);
  if (!product || !panel) {
    notFound();
  }

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", url: `${siteConfig.url}/` },
    { name: "Certificates", url: `${siteConfig.url}/coa` },
    {
      name: `${coa.peptideName} · ${coa.batch}`,
      url: `${siteConfig.url}/coa/${coa.peptide}/${coa.batch}`,
    },
  ]);

  const productName = `${product.shortName} ${product.dose}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLdSafe(breadcrumbLd) }}
      />
      <V2Header />
      <main id="main">
        <section className="border-b border-[var(--line)]">
          <div className="container py-10 md:py-14">
            <VerifyBreadcrumb productName={productName} />
            <div className="mt-5 flex items-end justify-between gap-6 flex-wrap">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-3">
                  Lab Reports
                </p>
                <h1 className="text-[clamp(28px,4vw,40px)] font-semibold leading-[1.15] text-[var(--text)]">
                  {product.shortName}
                </h1>
                <p className="mt-2 font-mono text-[14px] text-[var(--text-muted)]">
                  {product.dose} · Vial · Lyophilized
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-1">
                  Batch
                </p>
                <p className="font-mono text-[14px] text-[var(--text)]">
                  {panel.batch}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="container">
            <h2 className="text-[18px] font-semibold text-[var(--text)] mb-6">
              Test Reports
            </h2>
            <TestPanel panel={panel} productName={productName} />
            <VerifyFooterNav
              productSlug={product.slug}
              productName={productName}
            />
          </div>
        </section>
      </main>
      <V2Footer />
    </>
  );
}
