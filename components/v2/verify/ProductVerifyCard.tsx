/**
 * ProductVerifyCard — single product tile on the /verify index grid.
 * Per super-prompt §6.3.A: each card has product image + name + dose +
 * CTA into /verify/[slug] for the per-product test panel.
 */
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Pill } from "@/components/ui/Pill";
import type { ProductTestPanel } from "@/lib/content/coa";
import type { Product } from "@/lib/content/products";

export interface ProductVerifyCardProps {
  product: Pick<Product, "slug" | "shortName" | "dose">;
  panel: ProductTestPanel;
}

function countAvailable(panel: ProductTestPanel) {
  return (
    Number(panel.purity.available) +
    Number(panel.sterility.available) +
    Number(panel.endotoxin.available) +
    Number(panel.heavyMetals.available)
  );
}

export function ProductVerifyCard({ product, panel }: ProductVerifyCardProps) {
  const available = countAvailable(panel);
  const fullPanel = available === 4;
  const productImage = `/product-shots/${product.slug}.png`;
  return (
    <Link
      href={`/verify/${product.slug}`}
      className="group relative rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col gap-4 hover:border-[var(--accent)] transition-colors"
      aria-label={`View test panel for ${product.shortName} ${product.dose}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[16px] font-semibold text-[var(--text)] leading-tight">
            {product.shortName}
          </h3>
          <p className="text-[13px] text-[var(--text-muted)] mt-0.5 font-mono">
            {product.dose}
          </p>
        </div>
        <Pill variant={fullPanel ? "accent" : "info"}>
          {fullPanel ? "Full panel" : `${available}/4 tests`}
        </Pill>
      </div>
      <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden bg-[var(--surface-muted)]">
        <Image
          src={productImage}
          alt=""
          fill
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
          className="object-contain object-center"
        />
      </div>
      <div className="flex items-center justify-between mt-auto">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
          Batch {panel.batch}
        </span>
        <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[var(--accent)] group-hover:gap-2 transition-all">
          View Lab Reports
          <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
