/**
 * Verifies the Fuse.js client-side search configuration used by the COA
 * library page. The page itself is a client component; we re-create the same
 * Fuse instance shape here so the search keys + threshold stay locked.
 *
 * Phase 1G: coaRecords is now DERIVED from productTestPanels (P1D ingested
 * 13 panels). Search assertions exercise real records instead of the empty
 * pre-publication state.
 */
import Fuse from "fuse.js";
import { describe, expect, it } from "vitest";
import { coaRecords, type CoaRecord } from "@/lib/content/coa";

const fuse = new Fuse<CoaRecord>(coaRecords, {
  keys: ["peptideName", "batch", "lab"],
  threshold: 0.3,
  ignoreLocation: true,
});

describe("COA search (Fuse)", () => {
  it("has at least the publicLaunchProductSlugs records available", () => {
    expect(coaRecords.length).toBeGreaterThanOrEqual(13);
  });

  it("finds records by peptide short name", () => {
    const hits = fuse.search("BPC-157").map((r) => r.item.peptide);
    expect(hits.length).toBeGreaterThan(0);
    expect(hits).toContain("bpc-157-10mg");
  });

  it("finds records by lab name (lab-agnostic 'Independent Lab' per Iron Law 2.45)", () => {
    const hits = fuse.search("Independent Lab");
    expect(hits.length).toBeGreaterThan(0);
  });

  it("returns no matches for irrelevant query", () => {
    const hits = fuse.search("nonsense-token-xyz");
    expect(hits).toHaveLength(0);
  });
});
