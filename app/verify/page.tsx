import type { Metadata } from "next";
import Link from "next/link";
import { V2Footer, V2Header } from "@/components/v2/Shell";
import { ProductVerifyCard } from "@/components/v2/verify/ProductVerifyCard";
import { VerifyBreadcrumb } from "@/components/v2/verify/VerifyBreadcrumb";
import { getProductTestPanel } from "@/lib/content/coa";
import { products } from "@/lib/content/products";

export const metadata: Metadata = {
  title: "Lab Reports — VialChem Labs",
  description:
    "Independent third-party lab reports per product. HPLC purity, sterility, endotoxin, and heavy metals screening for every batch in the catalog.",
};

const ACCESS_STEPS = [
  {
    n: "01",
    title: "Create lab account",
    body: "Provide organization, role, and research-use context for order records.",
  },
  {
    n: "02",
    title: "Compliance review",
    body: "Buyer details, shipping eligibility, and research-use acknowledgement are reviewed.",
  },
  {
    n: "03",
    title: "Unlock catalog access",
    body: "Restricted materials and order flow become available to qualified accounts.",
  },
  {
    n: "04",
    title: "Verify each vial",
    body: "Match the lot code on the vial to the public lab reports before bench intake.",
  },
];

export default function VerifyIndexPage() {
  const productsWithPanels = products
    .map((product) => {
      const panel = getProductTestPanel(product.slug);
      return panel ? { product, panel } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <>
      <V2Header />
      <main id="main">
        <section className="border-b border-[var(--line)]">
          <div className="container py-16 md:py-20">
            <VerifyBreadcrumb />
            <div className="mt-6 max-w-3xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-4">
                Counted, weighed, verified.
              </p>
              <h1 className="text-[clamp(34px,5vw,52px)] font-semibold leading-[1.1] text-[var(--text)] mb-5">
                Independent lab reports, per product.
              </h1>
              <p className="text-[17px] leading-[1.6] text-[var(--text-muted)]">
                Every batch is tested by an independent third-party laboratory.
                HPLC purity, USP &lt;71&gt; sterility, LAL endotoxin, and ICP-MS
                heavy metals screening. Open the per-product panel for the full
                test breakdown and PDF downloads.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container">
            {productsWithPanels.length === 0 ? (
              <div
                role="status"
                className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-2">
                  Reports loading
                </p>
                <p className="text-[15px] text-[var(--text-muted)] max-w-xl mx-auto">
                  Public lab reports are published as each batch ships. While
                  the catalog warms up, browse the{" "}
                  <Link
                    href="/coa"
                    className="text-[var(--accent)] underline underline-offset-2"
                  >
                    full COA library
                  </Link>{" "}
                  or read the{" "}
                  <Link
                    href="/test-reports"
                    className="text-[var(--accent)] underline underline-offset-2"
                  >
                    testing standard
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {productsWithPanels.map(({ product, panel }) => (
                  <ProductVerifyCard
                    key={product.slug}
                    product={product}
                    panel={panel}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-[var(--line)] py-12 md:py-16 bg-[var(--surface-muted)]">
          <div className="container">
            <div className="mb-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-3">
                Access flow
              </p>
              <h2 className="text-[clamp(24px,3vw,32px)] font-semibold text-[var(--text)] max-w-2xl">
                Built for documented research procurement.
              </h2>
            </div>
            <div className="grid gap-px bg-[var(--border)] border border-[var(--border)] rounded-md overflow-hidden md:grid-cols-4">
              {ACCESS_STEPS.map((step) => (
                <div
                  key={step.n}
                  className="bg-[var(--surface)] p-6 min-h-[180px]"
                >
                  <p className="font-mono text-[11px] text-[var(--accent-hi)] mb-5">
                    {step.n}
                  </p>
                  <h3 className="text-[16px] font-semibold text-[var(--text)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[13px] leading-[1.55] text-[var(--text-muted)]">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <V2Footer />
    </>
  );
}
