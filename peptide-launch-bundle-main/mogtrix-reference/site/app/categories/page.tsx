import type { Metadata } from "next";

import { CategoryCard } from "@/components/category-card";
import { ProductCard } from "@/components/product-card";
import { ProductMotionEnhancer } from "@/components/product-motion-enhancer";
import { categories } from "@/lib/content/categories";
import { productPreviews } from "@/lib/content/products";
import { sharedResearchLinks } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Shop Preview"
};

export default function CategoriesPage() {
  return (
    <>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h1>Peptide catalog preview</h1>
            <p>
              Public category cards show the peptide site structure only. Private
              pricing, exact availability, and order discussion stay behind
              access review.
            </p>
          </div>
          <div className="mb-8 flex flex-wrap gap-3">
            {sharedResearchLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="button button-secondary"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="card-grid">
            {categories.map((category) => (
              <CategoryCard category={category} key={category.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="section-heading">
            <h2>Product records</h2>
            <p>
              These records are visible for discovery only. Pricing, checkout,
              detailed specs, and full documentation require signed-in access.
            </p>
          </div>
          <ProductMotionEnhancer />
          <div className="product-grid">
            {productPreviews.map((product, index) => (
              <ProductCard index={index} product={product} key={product.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container card-grid">
          {[
            "COA Library surfaces batch status before access is approved.",
            "Testing pages explain documentation posture without public checkout.",
            "Signed-in shop pages add visible pricing, specs, and related records."
          ].map((item) => (
            <article key={item} className="info-card">
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
