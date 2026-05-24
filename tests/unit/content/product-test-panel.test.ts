/**
 * Phase 1A — ProductTestPanel schema + helper RED test.
 *
 * The /verify/[slug] route + WWB-style 2x2 grid (super-prompt §6.1-§6.4)
 * needs a per-SKU "panel" object that carries the 4 lab tests + a
 * brand-neutral batch identifier. Iron Law 2.45 forbids any external-lab
 * identifier (lab name, manufacturer field, Janoshik verification key,
 * task number) from reaching the customer-facing schema — that's why
 * the type only carries `batch` + the 4 test slots and NOTHING else.
 *
 * The map of slug → panel lives in lib/content/product-test-panels.generated.ts
 * (auto-written by scripts/ingest-coa-pdfs.mjs). The helper exported
 * from coa.ts looks panels up by slug.
 */
import { afterEach, describe, expect, it } from "vitest";
import {
  getProductTestPanel,
  productTestPanels,
  type ProductTest,
  type ProductTestPanel,
} from "@/lib/content/coa";

describe("ProductTestPanel schema (Phase 1A)", () => {
  it("exports productTestPanels as a record keyed by slug", () => {
    expect(productTestPanels).toBeTypeOf("object");
    expect(productTestPanels).not.toBeNull();
  });

  it("getProductTestPanel returns null for unknown slug", () => {
    expect(getProductTestPanel("nonexistent-slug-xyz")).toBeNull();
  });

  it("ProductTest minimal shape compiles (available=false carries no metadata)", () => {
    const pending: ProductTest = { available: false };
    expect(pending.available).toBe(false);
    expect(pending.testDate).toBeUndefined();
    expect(pending.pdfPath).toBeUndefined();
    expect(pending.thumbPath).toBeUndefined();
    expect(pending.resultSummary).toBeUndefined();
  });

  it("ProductTest available=true shape compiles with all optional fields", () => {
    const available: ProductTest = {
      available: true,
      testDate: "2026-05-15",
      pdfPath: "/coa/bpc-157-10mg-purity.pdf",
      thumbPath: "/coa-thumbnails/bpc-157-10mg-purity.png",
      resultSummary: "99.245%",
    };
    expect(available.available).toBe(true);
    expect(available.testDate).toBe("2026-05-15");
    expect(available.pdfPath).toMatch(/^\/coa\//);
    expect(available.thumbPath).toMatch(/^\/coa-thumbnails\//);
  });

  it("ProductTestPanel carries batch + 4 test keys (purity/sterility/endotoxin/heavyMetals)", () => {
    const panel: ProductTestPanel = {
      batch: "vc-bpc157-7e3a91",
      purity: { available: false },
      sterility: { available: false },
      endotoxin: { available: false },
      heavyMetals: { available: false },
    };
    expect(panel.batch).toBe("vc-bpc157-7e3a91");
    expect(panel.purity).toBeDefined();
    expect(panel.sterility).toBeDefined();
    expect(panel.endotoxin).toBeDefined();
    expect(panel.heavyMetals).toBeDefined();
  });

  it("ProductTestPanel populated shape passes Iron Law 2.45 namespacing", () => {
    const panel: ProductTestPanel = {
      batch: "vc-bpc157-7e3a91",
      purity: {
        available: true,
        testDate: "2026-05-15",
        pdfPath: "/coa/bpc-157-10mg-purity.pdf",
        thumbPath: "/coa-thumbnails/bpc-157-10mg-purity.png",
        resultSummary: "99.245%",
      },
      sterility: {
        available: true,
        testDate: "2026-05-15",
        pdfPath: "/coa/bpc-157-10mg-sterility.pdf",
        thumbPath: "/coa-thumbnails/bpc-157-10mg-sterility.png",
        resultSummary: "PASS",
      },
      endotoxin: {
        available: true,
        testDate: "2026-05-15",
        pdfPath: "/coa/bpc-157-10mg-endotoxin.pdf",
        thumbPath: "/coa-thumbnails/bpc-157-10mg-endotoxin.png",
        resultSummary: "<0.5 EU/mg",
      },
      heavyMetals: {
        available: true,
        testDate: "2026-05-15",
        pdfPath: "/coa/bpc-157-10mg-heavymetals.pdf",
        thumbPath: "/coa-thumbnails/bpc-157-10mg-heavymetals.png",
        resultSummary: "PASS",
      },
    };
    // Iron Law 2.45: every pdfPath stays in our public namespace.
    for (const test of [
      panel.purity,
      panel.sterility,
      panel.endotoxin,
      panel.heavyMetals,
    ]) {
      if (test.pdfPath) {
        expect(test.pdfPath).toMatch(/^\/coa\/[\w-]+\.pdf$/);
      }
      if (test.thumbPath) {
        expect(test.thumbPath).toMatch(/^\/coa-thumbnails\/[\w-]+\.png$/);
      }
    }
    // Brand-neutral batch identifier (no Janoshik strings allowed).
    expect(panel.batch).not.toMatch(/janoshik|wuhanwansheng|wuhan|wansheng/i);
    expect(panel.batch).toMatch(/^vc-/);
  });
});

/**
 * Branch coverage for getProductTestPanel.
 *
 * productTestPanels is treated as a mutable record so the live module
 * binding stays intact across tests; afterEach clears the seeded key
 * so empty-state assertions in this file (and others) still hold.
 */
describe("getProductTestPanel — branch coverage with seeded panels", () => {
  const SEED_SLUG = "test-fixture-bpc";
  const seedPanel: ProductTestPanel = {
    batch: "vc-test-001",
    purity: {
      available: true,
      testDate: "2026-05-15",
      pdfPath: "/coa/test-fixture-bpc-purity.pdf",
      thumbPath: "/coa-thumbnails/test-fixture-bpc-purity.png",
      resultSummary: "99.2%",
    },
    sterility: { available: false },
    endotoxin: { available: false },
    heavyMetals: { available: false },
  };

  afterEach(() => {
    delete productTestPanels[SEED_SLUG];
  });

  it("returns the seeded panel when slug matches", () => {
    productTestPanels[SEED_SLUG] = seedPanel;
    expect(getProductTestPanel(SEED_SLUG)).toBe(seedPanel);
  });

  it("returns null when slug not seeded", () => {
    expect(getProductTestPanel("never-seeded-slug")).toBeNull();
  });

  it("is case-sensitive on the slug (exact match required)", () => {
    productTestPanels[SEED_SLUG] = seedPanel;
    expect(getProductTestPanel(SEED_SLUG.toUpperCase())).toBeNull();
  });
});
