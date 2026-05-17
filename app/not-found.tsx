import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/ui/Card";
import { buttonClassNames } from "@/components/ui/Button";
import { products } from "@/lib/content/products";

export const metadata = {
  title: "Page not found",
  description: "The page you were looking for does not exist on vialchem.labs.",
};

export default function NotFound() {
  const featured = products.slice(0, 3);
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-24 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-4">
              Error 404
            </p>
            <h1 className="text-[clamp(40px,5.6vw,72px)] font-light leading-tight tracking-tight text-[var(--text)] mb-6">
              <span className="block">No record</span>
              <span className="font-serif-italic block text-[var(--accent-soft)]">
                in this batch.
              </span>
            </h1>
            <p className="text-[16px] leading-[1.6] text-[var(--text-muted)] max-w-xl mx-auto mb-10">
              The page you were looking for does not exist. The URL may have
              changed, the product may have been retired, or the link you
              followed is out of date.
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              <Link href="/shop" className={buttonClassNames("primary", "md")}>
                Browse Catalog
              </Link>
              <Link href="/coa" className={buttonClassNames("outline", "md")}>
                Certificate of Analysis Library
              </Link>
              <Link href="/" className={buttonClassNames("outline", "md")}>
                Home
              </Link>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-5xl px-6 py-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-6">
              Popular products
            </p>
            <ul className="grid gap-4 md:grid-cols-3">
              {featured.map((p) => (
                <li key={p.slug}>
                  <Link href={`/products/${p.slug}`} className="group block">
                    <Card variant="interactive" className="p-5">
                      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] mb-2">
                        {p.sku}
                      </p>
                      <p className="text-[18px] font-medium mb-1 group-hover:text-[var(--accent-soft)] transition-colors">
                        {p.shortName}
                      </p>
                      <p className="text-[13px] text-[var(--text-muted)]">
                        {p.dose} vial
                      </p>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
