import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  FileCheck2,
  ShieldCheck,
  TestTube2
} from "lucide-react";

import { ProductVialVisual } from "@/components/product-vial-visual";
import type {
  ProductPreview,
  StorefrontProduct
} from "@/lib/content/products";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product | ProductPreview | StorefrontProduct;
  index?: number;
};

function isStorefrontProduct(
  product: Product | ProductPreview | StorefrontProduct
): product is StorefrontProduct {
  return "displayPrice" in product;
}

function isProductPreview(
  product: Product | ProductPreview | StorefrontProduct
): product is ProductPreview {
  return "catalogCode" in product && !("displayPrice" in product);
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  if (isStorefrontProduct(product)) {
    return (
      <article className="metal flex min-h-[100%] flex-col overflow-hidden rounded-[26px] transition hover:border-[var(--accent)] hover:shadow-[0_0_38px_rgba(124,255,0,0.14)]">
        <div className="border-b border-[var(--border)] px-5 pb-4 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                {product.categoryTitle}
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                {product.name}
              </h2>
            </div>
            <p className="text-right text-lg font-black text-white">
              {product.displayPrice}
            </p>
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            {product.short}
          </p>
        </div>
        <div className="px-5 pt-5">
          <div className="relative overflow-hidden rounded-[24px] border border-[var(--border)] bg-[radial-gradient(circle_at_top,_rgba(124,255,0,0.18),_rgba(4,6,4,0.95)_58%)]">
            <ProductVialVisual product={product} priority={index < 3} />
            <div className="absolute left-4 top-4 inline-flex rounded-full border border-[var(--border)] bg-black/55 px-3 py-1 text-xs text-white">
              {product.batchId}
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between px-5 pb-5 pt-5">
          <div>
            <dl className="grid gap-3 text-sm text-[var(--text-muted)] sm:grid-cols-2">
              <div className="rounded-[18px] border border-[var(--border)] p-3">
                <dt className="text-xs uppercase tracking-[0.2em]">Purity / record</dt>
                <dd className="mt-2 text-base font-semibold text-white">
                  {product.purity}
                </dd>
              </div>
              <div className="rounded-[18px] border border-[var(--border)] p-3">
                <dt className="text-xs uppercase tracking-[0.2em]">Vial</dt>
                <dd className="mt-2 text-base font-semibold text-white">
                  {product.vialSize}
                </dd>
              </div>
            </dl>
            <ul
              className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--text-muted)]"
              aria-label={`${product.name} controls`}
            >
              {product.trustBadges.map((badge) => (
                <li
                  className="rounded-full border border-[var(--border)] px-3 py-2"
                  key={badge}
                >
                  {badge}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-bold text-black"
              aria-label={`View ${product.name}`}
            >
              View {product.name} <ArrowUpRight size={16} />
            </Link>
            <Link
              href="/coa"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] px-4 py-3 text-sm font-semibold text-white hover:border-[var(--accent)]"
            >
              <TestTube2 size={16} />
              COA Library
            </Link>
          </div>
        </div>
      </article>
    );
  }

  if (isProductPreview(product)) {
    return (
      <article
        className="metal flex min-h-[100%] flex-col overflow-hidden rounded-[26px] transition hover:border-[var(--accent)] hover:shadow-[0_0_38px_rgba(124,255,0,0.14)]"
        data-product-card
        data-product-index={index}
      >
        <div className="border-b border-[var(--border)] px-5 pb-4 pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            {product.categoryTitle}
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">
            {product.name}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            {product.short}
          </p>
        </div>
        <div className="px-5 pt-5">
          <div className="relative overflow-hidden rounded-[24px] border border-[var(--border)] bg-[radial-gradient(circle_at_top,_rgba(124,255,0,0.18),_rgba(4,6,4,0.95)_58%)]">
            <ProductVialVisual product={product} priority={index < 3} />
            <span className="absolute left-4 top-4 inline-flex rounded-full border border-[var(--border)] bg-black/55 px-3 py-1 text-xs text-white">
              {product.batchId}
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between px-5 pb-5 pt-5">
          <dl className="grid gap-3 text-sm text-[var(--text-muted)] sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em]">Purity</dt>
              <dd className="mt-2 text-base font-semibold text-white">
                {product.purity}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em]">Form</dt>
              <dd className="mt-2 text-base font-semibold text-white">
                {product.form}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em]">Record</dt>
              <dd className="mt-2 text-base font-semibold text-white">
                {product.documentation}
              </dd>
            </div>
          </dl>
          <ul
            className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--text-muted)]"
            aria-label={`${product.name} controls`}
          >
            <li className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-2">
              <FileCheck2 size={14} aria-hidden="true" />
              Preview only
            </li>
            <li className="rounded-full border border-[var(--border)] px-3 py-2">
              Pricing after sign in
            </li>
          </ul>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-bold text-black"
              href={`/products/${product.slug}`}
            >
              View product <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border)] px-4 py-3 text-sm font-semibold text-white hover:border-[var(--accent)]"
              href="/login"
            >
              Sign in
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="metal flex min-h-[270px] flex-col justify-between rounded-[22px] p-5 transition hover:border-[var(--accent)] hover:shadow-[0_0_38px_rgba(124,255,0,0.14)]">
      <div>
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-muted)]">{product.sku}</span>
          <span className="text-xs uppercase text-[var(--accent)]">{product.category}</span>
        </div>
        <h2 className="text-2xl font-black text-white">{product.name}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{product.summary}</p>
      </div>
      <div className="mt-6 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <ShieldCheck size={14} />
          Research-use-only
        </span>
        <Link href={`/products/${product.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-2 text-sm font-bold text-black" aria-label={`View ${product.name}`}>
          View <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}
