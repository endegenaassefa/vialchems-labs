import { describe, expect, it, vi } from "vitest";
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

  it("emits weekly/0.8 entries for product pages and 0.6 for blog posts", () => {
    const entries = buildSitemap(BASE);
    const productEntry = entries.find(
      (e) => e.url === `${BASE}/products/bpc-157-10mg`,
    );
    expect(productEntry).toMatchObject({
      changeFrequency: "weekly",
      priority: 0.8,
    });

    const blogEntries = entries.filter((e) =>
      e.url.startsWith(`${BASE}/blog/`),
    );
    for (const post of blogEntries) {
      expect(post.changeFrequency).toBe("monthly");
      expect(post.priority).toBe(0.6);
    }
  });

  it("never duplicates the home URL across the static + dynamic routes", () => {
    const entries = buildSitemap(BASE);
    const urls = entries.map((e) => e.url);
    const homeCount = urls.filter((u) => u === `${BASE}/`).length;
    expect(homeCount).toBe(1);
  });

  it("respects the baseUrl by emitting every URL with the supplied origin", () => {
    const alt = "https://staging.vialchemlabs.net";
    const entries = buildSitemap(alt);
    for (const entry of entries) {
      expect(entry.url.startsWith(alt)).toBe(true);
    }
  });
});

describe("buildSitemap COA records", () => {
  it("emits a COA entry per verified record and skips non-verified ones", async () => {
    // Mock the coa module to exercise the verified-record branch in buildSitemap.
    vi.resetModules();
    vi.doMock("@/lib/content/coa", () => ({
      coaRecords: [
        {
          peptide: "bpc-157",
          peptideName: "BPC-157",
          batch: "BATCH-001",
          testDate: "2026-05-01",
          lab: "Janoshik Analytical",
          hplcPurityPct: 99.4,
          sterilityResult: "PASS" as const,
          endotoxinEU_per_mg: "<0.1",
          pdfPath: "/coa/bpc-157/BATCH-001.pdf",
          status: "verified" as const,
        },
        {
          peptide: "tb-500",
          peptideName: "TB-500",
          batch: "BATCH-002",
          testDate: "2026-05-02",
          lab: "Janoshik Analytical",
          hplcPurityPct: 99.0,
          sterilityResult: "PASS" as const,
          endotoxinEU_per_mg: "<0.1",
          pdfPath: "/coa/tb-500/BATCH-002.pdf",
          // Cast through unknown to satisfy the narrow union while feeding the
          // non-verified branch.
          status: "pending" as unknown as "verified",
        },
      ],
    }));

    // Re-import buildSitemap so the mocked coaRecords are picked up.
    const { buildSitemap: scopedBuildSitemap } =
      await import("@/lib/seo/sitemap");
    const entries = scopedBuildSitemap(BASE);
    const coaEntries = entries.filter((e) => e.url.includes("/coa/"));

    expect(coaEntries).toHaveLength(1);
    expect(coaEntries[0]).toMatchObject({
      url: `${BASE}/coa/bpc-157/BATCH-001`,
      changeFrequency: "monthly",
      priority: 0.4,
    });

    vi.doUnmock("@/lib/content/coa");
    vi.resetModules();
  });
});
