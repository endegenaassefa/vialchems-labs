/**
 * Iron Law 2.42 -- every catalog SKU has a placeholder COA PDF on disk.
 *
 * Audit H27 + supplemental S9: after Phase 2 removed banned compounds,
 * `public/coa/` was empty and every COA route 404'd. Phase 7 G7 ships
 * a clearly-marked placeholder PDF per product slug + per bundle slug
 * so no catalog page can dead-link.
 *
 * This integration test asserts the disk-level invariant:
 *
 *   - public/coa/ directory exists
 *   - for every product slug in lib/content/products.ts, the file
 *     public/coa/<slug>-BATCH-2026-PLACEHOLDER.pdf exists, is >1KB, and
 *     starts with the `%PDF-` magic bytes
 *   - for every bundle slug, same assertion
 *   - the directory PDF count matches products + bundles exactly (no
 *     orphaned PDFs from removed/banned SKUs)
 *
 * If a future PR removes a SKU and forgets to remove its placeholder
 * PDF, the count assertion catches it. If a future PR adds a SKU and
 * forgets to regenerate placeholders, the per-slug existence assertion
 * catches it.
 */
import { describe, expect, it } from "vitest";
import { open, stat } from "node:fs/promises";
import path from "node:path";
import { products, bundles } from "@/lib/content/products";

const COA_DIR = path.join(process.cwd(), "public", "coa");
const BATCH_TOKEN = "BATCH-2026-PLACEHOLDER";

async function readMagicBytes(
  filePath: string,
  byteCount = 5,
): Promise<string> {
  const fd = await open(filePath, "r");
  try {
    const buf = Buffer.alloc(byteCount);
    await fd.read(buf, 0, byteCount, 0);
    return buf.toString("ascii");
  } finally {
    await fd.close();
  }
}

describe("Iron Law 2.42 -- placeholder COA on disk per catalog SKU", () => {
  it("public/coa/ directory exists", async () => {
    const stats = await stat(COA_DIR);
    expect(stats.isDirectory()).toBe(true);
  });

  for (const product of products) {
    it(`product '${product.slug}' has a placeholder COA PDF`, async () => {
      const expectedFile = path.join(
        COA_DIR,
        `${product.slug}-${BATCH_TOKEN}.pdf`,
      );
      const stats = await stat(expectedFile);
      expect(stats.isFile()).toBe(true);
      // Sanity range: real placeholders are ~2KB; flag anything truncated or absurdly large.
      expect(stats.size).toBeGreaterThan(1000);
      expect(stats.size).toBeLessThan(100_000);
      const magic = await readMagicBytes(expectedFile);
      expect(magic).toMatch(/^%PDF-/);
    });
  }

  for (const bundle of bundles) {
    it(`bundle '${bundle.slug}' has a placeholder COA PDF`, async () => {
      const expectedFile = path.join(
        COA_DIR,
        `${bundle.slug}-${BATCH_TOKEN}.pdf`,
      );
      const stats = await stat(expectedFile);
      expect(stats.isFile()).toBe(true);
      expect(stats.size).toBeGreaterThan(1000);
      expect(stats.size).toBeLessThan(100_000);
      const magic = await readMagicBytes(expectedFile);
      expect(magic).toMatch(/^%PDF-/);
    });
  }

  it("public/coa/ contains exactly one placeholder PDF per product + bundle (no orphans)", async () => {
    const { readdir } = await import("node:fs/promises");
    const entries = await readdir(COA_DIR);
    const pdfs = entries.filter((name) => name.endsWith(".pdf"));
    const expected = products.length + bundles.length;
    expect(pdfs.length).toBe(expected);

    const expectedNames = new Set<string>();
    for (const p of products) expectedNames.add(`${p.slug}-${BATCH_TOKEN}.pdf`);
    for (const b of bundles) expectedNames.add(`${b.slug}-${BATCH_TOKEN}.pdf`);

    const actualNames = new Set(pdfs);
    // Detect orphans (files on disk that no longer correspond to a SKU).
    for (const name of actualNames) {
      expect(expectedNames.has(name)).toBe(true);
    }
  });
});
