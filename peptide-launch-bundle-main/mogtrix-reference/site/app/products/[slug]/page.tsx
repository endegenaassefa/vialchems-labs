import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductDetailActions } from "@/components/product-detail-actions";
import { ProductDetailPanels } from "@/components/product-detail-panels";
import { ProductVialVisual } from "@/components/product-vial-visual";
import {
  customerCanViewPrivatePricing,
  getCatalogAccessAction,
  getCustomerAccessState
} from "@/lib/customer";
import {
  getStorefrontProductContent,
  storefrontProducts,
  mergeProductWithStorefrontContent
} from "@/lib/content/products";
import { getCatalogProductBySlug } from "@/lib/catalog.server";
import { CatalogUnavailableError } from "@/lib/catalog";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const state = await getCustomerAccessState();
  const showPrivatePricing = customerCanViewPrivatePricing(state);
  const accessAction = getCatalogAccessAction(`/products/${slug}`, state);
  const publicProduct = getStorefrontProductContent(slug);
  if (!publicProduct) notFound();
  let privateBaseProduct: Product | null = null;
  let catalogError: string | null = null;

  if (showPrivatePricing) {
    try {
      privateBaseProduct = await getCatalogProductBySlug(slug);
    } catch (error) {
      if (error instanceof CatalogUnavailableError) {
        catalogError =
          "Pricing is temporarily unavailable because we couldn't load the full catalog.";
      } else {
        throw error;
      }
    }
  }

  const privateProduct = privateBaseProduct
    ? mergeProductWithStorefrontContent(privateBaseProduct)
    : null;
  const product = privateProduct ?? publicProduct;

  const relatedProducts = product.relatedSlugs
    .map((relatedSlug) =>
      storefrontProducts.find((candidate) => candidate.slug === relatedSlug)
    )
    .filter((candidate): candidate is (typeof storefrontProducts)[number] =>
      Boolean(candidate)
    );

  return (
    <main className="shell py-16">
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="metal overflow-hidden rounded-[28px] p-6">
            <div className="rounded-[24px] border border-[var(--border)] bg-[radial-gradient(circle_at_top,_rgba(124,255,0,0.18),_rgba(4,6,4,0.95)_58%)]">
              <ProductVialVisual product={product} priority />
            </div>
          </div>
          <div className="metal rounded-[28px] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Trust markers
            </p>
            <ul className="mt-4 grid gap-3 text-sm text-[var(--text-muted)]">
              {product.trustBadges.map((badge) => (
                <li
                  className="rounded-[18px] border border-[var(--border)] px-4 py-3"
                  key={badge}
                >
                  {badge}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="metal rounded-[28px] p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                  {product.categoryTitle}
                </p>
                <h1 className="mt-3 text-5xl font-black text-white">
                  {product.name}
                </h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--text-muted)]">
                  {product.short}
                </p>
              </div>
              {privateProduct ? (
                <div className="rounded-[24px] border border-[var(--border)] px-5 py-4 text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Your price
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">
                    {privateProduct.displayPrice}
                  </p>
                </div>
              ) : (
                <div className="rounded-[24px] border border-[var(--border)] px-5 py-4 text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Pricing
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">
                    {showPrivatePricing
                      ? catalogError
                        ? "Temporarily unavailable"
                        : "Not currently available"
                      : "Sign in for pricing"}
                  </p>
                </div>
              )}
            </div>
            {privateProduct && privateProduct.checkoutEnabled ? (
              <ProductDetailActions productId={privateProduct.id} />
            ) : privateProduct ? (
              <div className="mt-8 rounded-[24px] border border-[var(--border)] bg-[rgba(8,12,8,0.7)] p-5">
                <p className="text-sm leading-7 text-[var(--text-muted)]">
                  This product is available to qualified buyers, but it still routes through manual Mogtrix review instead of the hosted checkout pilot.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/request"
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black"
                  >
                    Request manual procurement
                  </Link>
                  <Link
                    href="/shop"
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-white hover:border-[var(--accent)]"
                  >
                    Return to shop
                  </Link>
                </div>
              </div>
            ) : showPrivatePricing ? (
              <div className="mt-8 rounded-[24px] border border-[#7a2a22] bg-[#210b08] p-5">
                <p className="text-sm leading-7 text-[#ffb1a3]">
                  {catalogError ??
                    "This product is temporarily unavailable in the full catalog. Return to the shop to view currently available items."}
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/shop"
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black"
                  >
                    Return to shop
                  </Link>
                  <Link
                    href="/coa"
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-white hover:border-[var(--accent)]"
                  >
                    Open COA Library
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-[24px] border border-[var(--border)] bg-[rgba(8,12,8,0.7)] p-5">
                <p className="text-sm leading-7 text-[var(--text-muted)]">
                  {accessAction.note}
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={accessAction.href}
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black"
                  >
                    {accessAction.label}
                  </Link>
                  <Link
                    href="/coa"
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-white hover:border-[var(--accent)]"
                  >
                    Open COA Library
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="metal rounded-[28px] p-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                  Specifications
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  Research product details
                </h2>
              </div>
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-white hover:border-[var(--accent)]"
                href="/coa"
              >
                Open COA Library
              </Link>
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              {product.specifications.map((specification) => (
                <div
                  key={specification.label}
                  className="rounded-[20px] border border-[var(--border)] p-4"
                >
                  <dt className="text-sm text-[var(--text-muted)]">
                    {specification.label}
                  </dt>
                  <dd className="mt-2 text-lg font-semibold text-white">
                    {specification.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <ProductDetailPanels panels={product.panels} />

          <div className="metal rounded-[28px] p-8">
            <h2 className="text-2xl font-black text-white">Helpful links</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "COA Library",
                  body: "Check batch-specific documents and release status.",
                  href: "/coa"
                },
                {
                  title: "Testing",
                  body: "See what testing and supporting information is available.",
                  href: "/testing"
                },
                {
                  title: "FAQ",
                  body: "Read answers about qualification, pricing, and pilot checkout.",
                  href: "/faq"
                }
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-[20px] border border-[var(--border)] p-4 transition hover:border-[var(--accent)]"
                >
                  <p className="text-base font-bold text-white">{item.title}</p>
                  <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                    {item.body}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="metal rounded-[28px] p-8">
            <h2 className="text-2xl font-black text-white">You may also want</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {relatedProducts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/products/${related.slug}`}
                  className="rounded-[20px] border border-[var(--border)] p-4 transition hover:border-[var(--accent)]"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                    {related.catalogCode}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-white">
                    {related.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                    {related.short}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
