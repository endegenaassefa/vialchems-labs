import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content/site";
import { buildSitemap } from "@/lib/seo/sitemap";

/**
 * Phase 9 (v4) — sitemap.xml served at /sitemap.xml.
 * Driven by lib/seo/sitemap.ts which sources from products / bundles /
 * blog / COA content modules.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(siteConfig.url).map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
