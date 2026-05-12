import Link from "next/link";
import { ArrowRight, FileCheck2, FlaskConical, ShieldCheck } from "lucide-react";

import { ProductMotionEnhancer } from "@/components/product-motion-enhancer";
import { ProductVialVisual } from "@/components/product-vial-visual";
import { productPreviews } from "@/lib/content/products";

const showcaseProducts = productPreviews.slice(0, 5);

export function ProductShowcase() {
  return (
    <section className="product-showcase" aria-labelledby="product-showcase-title">
      <ProductMotionEnhancer />
      <div className="container product-showcase-grid">
        <div className="product-showcase-visual" aria-hidden="true">
          <div className="product-glow-pulse" data-glow-pulse />
          <div className="product-vial-float" data-vial-float>
            <ProductVialVisual product={showcaseProducts[0]} priority />
          </div>
        </div>

        <div className="product-showcase-content">
          <p className="eyebrow">MOGTRIX Labs · private catalog preview</p>
          <h2 id="product-showcase-title">Animated product visuals for gated research records.</h2>
          <p>
            Neon-highlighted peptide references stay framed around documentation,
            qualification, and research-use boundaries.
          </p>

          <div className="showcase-card-grid">
            {showcaseProducts.map((product, index) => (
              <article
                className="showcase-product-card"
                data-showcase-card
                data-showcase-index={index}
                key={product.name}
              >
                <div className="showcase-card-topline">
                  <FlaskConical size={20} aria-hidden="true" />
                  <span>{product.vialSize}</span>
                </div>
                <h3>{product.name}</h3>
                <ul className="showcase-card-tags" aria-label={`${product.name} status`}>
                  <li>
                    <ShieldCheck size={14} aria-hidden="true" />
                    Research Use Only
                  </li>
                  <li>
                    <FileCheck2 size={14} aria-hidden="true" />
                    COA Available
                  </li>
                </ul>
                <Link className="button showcase-request-button" href="/access">
                  Request Access <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
