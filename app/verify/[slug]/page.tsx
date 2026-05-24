import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { V2Footer, V2Header } from "@/components/v2/Shell";
import { TestPanel } from "@/components/v2/verify/TestPanel";
import { VerifyBreadcrumb } from "@/components/v2/verify/VerifyBreadcrumb";
import { VerifyFooterNav } from "@/components/v2/verify/VerifyFooterNav";
import { getProductTestPanel, productTestPanels } from "@/lib/content/coa";
import { getProductBySlug } from "@/lib/content/products";

interface PageParams {
  slug: string;
}

export function generateStaticParams(): PageParams[] {
  return Object.keys(productTestPanels).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.shortName} ${product.dose} — Lab Reports`,
    description: `Independent third-party lab reports for ${product.shortName} ${product.dose}: HPLC purity, sterility, endotoxin, and heavy metals.`,
  };
}

export default async function VerifyDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  const panel = getProductTestPanel(slug);
  if (!product || !panel) {
    notFound();
  }

  return (
    <>
      <V2Header />
      <main id="main">
        <section className="border-b border-[var(--line)]">
          <div className="container py-10 md:py-14">
            <VerifyBreadcrumb
              productName={`${product.shortName} ${product.dose}`}
            />
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
            <TestPanel
              panel={panel}
              productName={`${product.shortName} ${product.dose}`}
            />
            <VerifyFooterNav
              productSlug={product.slug}
              productName={`${product.shortName} ${product.dose}`}
            />
          </div>
        </section>
      </main>
      <V2Footer />
    </>
  );
}
