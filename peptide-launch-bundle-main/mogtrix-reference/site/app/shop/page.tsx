import { ProductCard } from "@/components/product-card";
import {
  customerCanViewPrivatePricing,
  getCatalogAccessAction,
  getCustomerAccessState
} from "@/lib/customer";
import { listCatalogProducts } from "@/lib/catalog.server";
import { CatalogUnavailableError } from "@/lib/catalog";
import { categories } from "@/lib/content/categories";
import {
  mergeProductsWithStorefrontContent,
  productPreviews
} from "@/lib/content/products";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const state = await getCustomerAccessState();
  const { category } = await searchParams;
  const showPrivateCatalog = customerCanViewPrivatePricing(state);
  const accessAction = getCatalogAccessAction("/shop", state);
  let catalogProducts: Product[] = [];
  let catalogError: string | null = null;

  if (showPrivateCatalog) {
    try {
      catalogProducts = await listCatalogProducts();
    } catch (error) {
      if (error instanceof CatalogUnavailableError) {
        catalogError =
          "We couldn't load the full catalog right now. Please refresh or try again shortly.";
      } else {
        throw error;
      }
    }
  }

  const privateProducts = showPrivateCatalog
    ? mergeProductsWithStorefrontContent(catalogProducts)
    : [];
  const publicProducts = category
    ? productPreviews.filter((product) => product.categorySlug === category)
    : productPreviews;
  const filteredProducts = showPrivateCatalog ? privateProducts : publicProducts;
  const unavailableCount = showPrivateCatalog
    ? catalogProducts.length - privateProducts.length
    : 0;
  const productCountLabel = `${filteredProducts.length} product${
    filteredProducts.length === 1 ? "" : "s"
  }`;
  const introCopy = showPrivateCatalog
    ? "Pricing, batch records, and order status stay tied to this account."
    : "Pricing appears after sign in. Product names and formats stay visible here.";

  return (
    <main className="shell py-16">
      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="metal rounded-[24px] p-5 lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            Filters
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            Filter by category
          </p>
          {!showPrivateCatalog ? (
            <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
              {accessAction.note}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-3 lg:flex-col">
            <a
              href="/shop"
              className={`rounded-full border px-4 py-2 text-sm transition ${
                !category
                  ? "border-[var(--accent)] text-white"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-white"
              }`}
            >
              All products
            </a>
            {categories.map((item) => (
              <a
                key={item.slug}
                href={`/shop?category=${item.slug}`}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  category === item.slug
                    ? "border-[var(--accent)] text-white"
                    : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-white"
                }`}
              >
                {item.title}
              </a>
            ))}
          </div>
          <div className="mt-5">
            {showPrivateCatalog ? (
              <a
                href="/cart"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black"
              >
                Open cart
              </a>
            ) : (
              <a
                href={accessAction.href}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black"
              >
                {accessAction.label}
              </a>
            )}
          </div>
        </aside>

        <section>
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
              {showPrivateCatalog ? "Approved customer catalog" : "Catalog preview"}
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-5xl font-black text-white">
                  {showPrivateCatalog ? "Catalog" : "Research products"}
                </h1>
                <p className="mt-4 max-w-2xl text-[var(--text-muted)]">
                  {introCopy}
                </p>
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
                {productCountLabel}
              </p>
            </div>
          </div>

          {catalogError ? (
            <div className="mb-6 rounded-[22px] border border-[#7a2a22] bg-[#210b08] p-4 text-sm text-[#ffb1a3]">
              {catalogError}
            </div>
          ) : null}

          {filteredProducts.length ? (
            <>
              {unavailableCount > 0 && !catalogError ? (
                <div className="mb-6 rounded-[22px] border border-[#7a5b1f] bg-[#21180a] p-4 text-sm text-[#f6d08b]">
                  Some products are temporarily hidden while we finish updating
                  their details.
                </div>
              ) : null}
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.slug} index={index} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="metal rounded-[22px] p-8 text-[var(--text-muted)]">
              {showPrivateCatalog
                ? catalogError
                  ? "The full catalog is temporarily unavailable. Please try again shortly."
                  : "No products are available right now. Please check back soon."
                : "Product previews are temporarily unavailable. Please check back soon."}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
