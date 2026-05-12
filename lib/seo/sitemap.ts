/**
 * Phase 9 (v4) — sitemap generator per §7.5.
 *
 * Returns a list of MetadataRoute.Sitemap-compatible entries that
 * `app/sitemap.ts` can return directly. Driven by content sources
 * (products, bundles, blog posts, COA records) so the sitemap stays in
 * sync as catalog grows or shrinks.
 *
 * The lastModified value is derived from a single LAUNCH_DATE constant
 * for now — Phase 10 wires it to per-resource timestamps from Supabase
 * once persistence lands.
 */

import { products, bundles } from "@/lib/content/products";
import { blogPosts } from "@/lib/content/blog";
import { coaRecords } from "@/lib/content/coa";

export type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}

const LAUNCH_DATE = "2026-05-10";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/shop", changeFrequency: "weekly", priority: 0.9 },
  { path: "/coa", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/affiliate", changeFrequency: "monthly", priority: 0.5 },
  { path: "/test-reports", changeFrequency: "monthly", priority: 0.5 },
  { path: "/legal/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal/refunds", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal/shipping", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal/cookies", changeFrequency: "yearly", priority: 0.3 },
];

export function buildSitemap(baseUrl: string): SitemapEntry[] {
  const entries: SitemapEntry[] = [];

  for (const route of STATIC_ROUTES) {
    entries.push({
      url: `${baseUrl}${route.path}`,
      lastModified: LAUNCH_DATE,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    });
  }

  for (const product of products) {
    entries.push({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: LAUNCH_DATE,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const bundle of bundles) {
    entries.push({
      url: `${baseUrl}/products/${bundle.slug}`,
      lastModified: LAUNCH_DATE,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const post of blogPosts) {
    entries.push({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const record of coaRecords) {
    if (record.status !== "verified") continue;
    entries.push({
      url: `${baseUrl}/coa/${record.peptide}/${record.batch}`,
      lastModified: LAUNCH_DATE,
      changeFrequency: "monthly",
      priority: 0.4,
    });
  }

  return entries;
}
