import { describe, expect, it } from "vitest";
import { buildSitemap } from "@/lib/seo/sitemap";

const BASE = "https://vialchemlabs.net";

describe("buildSitemap", () => {
  it("includes the home page", () => {
    const entries = buildSitemap(BASE);
    const home = entries.find((e) => e.url === `${BASE}/`);
    expect(home).toBeDefined();
    expect(home?.priority).toBe(1.0);
  });

  it("emits an entry for every product slug", () => {
    const entries = buildSitemap(BASE);
    const productPages = entries.filter((e) =>
      e.url.startsWith(`${BASE}/products/`),
    );
    // Expanded catalog: current SKU pages + stack bundles. Use a >= floor so
    // future operator catalog additions don't trip this test; the contract is
    // at least one entry per known product/bundle slug.
    expect(productPages.length).toBeGreaterThanOrEqual(42);
    const urls = productPages.map((e) => e.url);
    expect(urls).toContain(`${BASE}/products/bpc-157-10mg`);
    expect(urls).toContain(`${BASE}/products/recovery-stack`);
    expect(urls).toContain(`${BASE}/products/dermal-research-triple`);
    expect(urls).toContain(`${BASE}/products/recovery-pair`);
    expect(urls).toContain(`${BASE}/products/nootropic-pair`);
    expect(urls).toContain(`${BASE}/products/longevity-triple`);
    expect(urls).toContain(`${BASE}/products/sermorelin-2mg`);
  });

  it("emits an entry for every blog post slug", () => {
    const entries = buildSitemap(BASE);
    const posts = entries.filter((e) => e.url.startsWith(`${BASE}/blog/`));
    expect(posts.length).toBeGreaterThanOrEqual(5);
  });

  it("omits COA detail pages until verified certificates are published", () => {
    const entries = buildSitemap(BASE);
    const coa = entries.filter((e) => e.url.includes(`${BASE}/coa/`));
    expect(coa).toHaveLength(0);
  });

  it("includes the legal pages", () => {
    const entries = buildSitemap(BASE);
    const urls = entries.map((e) => e.url);
    expect(urls).toContain(`${BASE}/legal/terms`);
    expect(urls).toContain(`${BASE}/legal/privacy`);
    expect(urls).toContain(`${BASE}/legal/refunds`);
    expect(urls).toContain(`${BASE}/legal/shipping`);
    expect(urls).toContain(`${BASE}/legal/cookies`);
  });

  it("every entry has a valid changeFrequency token", () => {
    const validFreqs = [
      "always",
      "hourly",
      "daily",
      "weekly",
      "monthly",
      "yearly",
      "never",
    ];
    const entries = buildSitemap(BASE);
    for (const e of entries) {
      expect(validFreqs).toContain(e.changeFrequency);
    }
  });

  it("every entry has lastModified as ISO date", () => {
    const entries = buildSitemap(BASE);
    for (const e of entries) {
      expect(e.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}/);
    }
  });
});
