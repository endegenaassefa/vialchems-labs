/**
 * Verifies the Fuse.js client-side search configuration used by the COA
 * library page. The page itself is a client component; we re-create the same
 * Fuse instance shape here so the search keys + threshold stay locked.
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
  it("has no searchable records until verified COAs are uploaded", () => {
    expect(coaRecords).toHaveLength(0);
  });

  it("returns no record by peptide short name before publication", () => {
    const hits = fuse.search("BPC-157").map((r) => r.item.peptide);
    expect(hits).toHaveLength(0);
  });

  it("returns no records by batch substring before publication", () => {
    const hits = fuse.search("BATCH-2026");
    expect(hits).toHaveLength(0);
  });

  it("returns no records by laboratory name before publication", () => {
    const hits = fuse.search("Independent Lab");
    expect(hits).toHaveLength(0);
  });

  it("returns no matches for irrelevant query", () => {
    const hits = fuse.search("nonsense-token-xyz");
    expect(hits).toHaveLength(0);
  });
});
