import type { MetadataRoute } from "next";
import { legalPages } from "@/lib/legal";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/legal`, lastModified: now, changeFrequency: "monthly", priority: 0.5 }
  ];

  const legalRoutes: MetadataRoute.Sitemap = legalPages.map((page) => ({
    url: `${siteUrl}/legal/${page.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4
  }));

  return [...staticRoutes, ...legalRoutes];
}
