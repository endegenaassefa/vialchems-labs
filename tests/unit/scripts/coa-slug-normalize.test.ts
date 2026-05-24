/**
 * Slug normalization for COA ingest. Maintains parity with the 13
 * SKU folder names operator drops at /mnt/c/Users/endeg/Downloads/
 * vialchemlabs_coas/ (super-prompt §6.2 inventory).
 */
import { describe, expect, it } from "vitest";

import {
  normalizeSkuFolder,
  normalizeTestName,
  parseCoaFilename,
} from "../../../scripts/coa-redaction/slug-normalize.mjs";

describe("normalizeSkuFolder", () => {
  it("normalizes every operator folder name from the super-prompt §6.2 inventory", () => {
    const expected: Array<[string, string]> = [
      ["BPC-157_10mg", "bpc-157-10mg"],
      ["CJC-1295_plus_Ipamorelin_5mg", "cjc-1295-ipamorelin-5mg"],
      ["GHK-CU_50mg", "ghk-cu-50mg"],
      ["KLOW_80mg", "klow-80mg"],
      ["KPV_500mcg", "kpv-500mcg"],
      ["MOTS-C_10mg", "mots-c-10mg"],
      ["NADplus_500mg", "nad-500mg"],
      ["Reta_10mg", "reta-10mg"],
      ["Reta_20mg", "reta-20mg"],
      ["Selank_10mg", "selank-10mg"],
      ["Semax_10mg", "semax-10mg"],
      ["TB-500_10mg", "tb-500-10mg"],
      ["Tirz_25mg", "tirz-25mg"],
    ];
    for (const [input, output] of expected) {
      expect(normalizeSkuFolder(input)).toBe(output);
    }
  });

  it("collapses consecutive dashes from underscore replacement", () => {
    expect(normalizeSkuFolder("foo__bar")).toBe("foo-bar");
    expect(normalizeSkuFolder("foo-_-bar")).toBe("foo-bar");
  });
});

describe("normalizeTestName", () => {
  it("maps Janoshik test labels to our 4 canonical keys", () => {
    expect(normalizeTestName("Purity")).toBe("purity");
    expect(normalizeTestName("purity")).toBe("purity");
    expect(normalizeTestName("Microbial")).toBe("sterility"); // Janoshik vocabulary
    expect(normalizeTestName("Endotoxin")).toBe("endotoxin");
    expect(normalizeTestName("HeavyMetals")).toBe("heavymetals");
    expect(normalizeTestName("Heavy-Metals")).toBe("heavymetals");
  });

  it("returns null for unknown test names", () => {
    expect(normalizeTestName("Unknown")).toBeNull();
    expect(normalizeTestName("")).toBeNull();
  });
});

describe("parseCoaFilename", () => {
  it("parses standard Janoshik filenames into { sku, test }", () => {
    expect(parseCoaFilename("BPC-157_10mg_Purity.pdf")).toEqual({
      sku: "bpc-157-10mg",
      test: "purity",
    });
    expect(parseCoaFilename("KLOW_80mg_Microbial.pdf")).toEqual({
      sku: "klow-80mg",
      test: "sterility",
    });
    expect(parseCoaFilename("CJC-1295_plus_Ipamorelin_5mg_HeavyMetals.pdf")).toEqual({
      sku: "cjc-1295-ipamorelin-5mg",
      test: "heavymetals",
    });
  });

  it("returns null for non-COA filenames", () => {
    expect(parseCoaFilename("random.pdf")).toBeNull();
    expect(parseCoaFilename("Manifest.pdf")).toBeNull();
    expect(parseCoaFilename("BPC-157_10mg.pdf")).toBeNull(); // no test suffix
  });
});
