import { ProductVialVisual } from "@/components/product-vial-visual";
import { featuredProductPreviews } from "@/lib/content/products";

const proofProducts = featuredProductPreviews.slice(0, 3);

export function HomeProofRow() {
  return (
    <div className="-mr-12 flex gap-3 overflow-hidden sm:mr-0">
      {proofProducts.map((product, index) => (
        <article
          key={product.slug}
          className="metal min-w-[44%] flex-1 rounded-[24px] p-3 sm:min-w-0 sm:p-4"
        >
          <div className="overflow-hidden rounded-[18px] border border-[var(--border)] bg-[radial-gradient(circle_at_top,_rgba(124,255,0,0.18),_rgba(5,7,5,0.96)_60%)]">
            <ProductVialVisual product={product} priority={index === 0} />
          </div>
          <div className="mt-3">
            <p className="text-sm font-semibold text-white">{product.name}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
              {product.documentation}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
