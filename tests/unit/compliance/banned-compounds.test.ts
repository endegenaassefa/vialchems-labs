/**
 * Iron Law 2.29 — static banned-compound blocklist regression suite.
 *
 * Asserts the LAST-LINE structural defense at `lib/compliance/banned-compounds.ts`:
 *   - Every member of BANNED_COMPOUNDS is detected in its canonical form
 *   - Case-insensitive (capital, mixed, lower)
 *   - Surrounding whitespace / punctuation does not let a banned token slip past
 *   - Multi-word + hyphenated forms (bacteriostatic water, melanotan-ii) match
 *     across whitespace / hyphen variants
 *   - Safe compound names (BPC-157, TB-500, GHK-Cu, Selank, ...) return FALSE
 *   - Concrete supplemental S1 cases (Reta, Tirz, KLOW, "Reta 10mg vial", ...)
 *     all return TRUE (these were the operator-shipped compounds that
 *     prompted Iron Law 2.29 in audit C5).
 *   - Whole-word boundary semantics — "tirzepatide-mimetic" matches via
 *     substring; "retreat" does NOT match (banned token must be its own word
 *     for single-word entries).
 *   - Empty / null-ish inputs return FALSE without throwing.
 */
import { describe, expect, it } from "vitest";

import {
  BANNED_COMPOUNDS,
  isBannedCompound,
} from "@/lib/compliance/banned-compounds";

describe("BANNED_COMPOUNDS constant", () => {
  it("contains the v3 PERPETUAL bans (GLP-1 class + short codes)", () => {
    expect(BANNED_COMPOUNDS).toContain("tirzepatide");
    expect(BANNED_COMPOUNDS).toContain("semaglutide");
    expect(BANNED_COMPOUNDS).toContain("retatrutide");
    expect(BANNED_COMPOUNDS).toContain("liraglutide");
    expect(BANNED_COMPOUNDS).toContain("dulaglutide");
    expect(BANNED_COMPOUNDS).toContain("tirz");
    expect(BANNED_COMPOUNDS).toContain("sema");
    expect(BANNED_COMPOUNDS).toContain("reta");
    expect(BANNED_COMPOUNDS).toContain("glp-1");
    expect(BANNED_COMPOUNDS).toContain("glp1");
    expect(BANNED_COMPOUNDS).toContain("glp 1");
    expect(BANNED_COMPOUNDS).toContain("glp-1ra");
  });

  it("contains the v5 §2.29 FDA approved-drug-analog additions", () => {
    expect(BANNED_COMPOUNDS).toContain("tesamorelin");
    expect(BANNED_COMPOUNDS).toContain("th9507");
    expect(BANNED_COMPOUNDS).toContain("egrifta");
  });

  it("contains the v5 §2.29 melanocortin FDA enforcement additions", () => {
    expect(BANNED_COMPOUNDS).toContain("melanotan");
    expect(BANNED_COMPOUNDS).toContain("melanotan-i");
    expect(BANNED_COMPOUNDS).toContain("melanotan-ii");
    expect(BANNED_COMPOUNDS).toContain("mt-i");
    expect(BANNED_COMPOUNDS).toContain("mt-ii");
    expect(BANNED_COMPOUNDS).toContain("mt-1");
    expect(BANNED_COMPOUNDS).toContain("mt-2");
    expect(BANNED_COMPOUNDS).toContain("bremelanotide");
    expect(BANNED_COMPOUNDS).toContain("vyleesi");
    expect(BANNED_COMPOUNDS).toContain("pt-141");
    expect(BANNED_COMPOUNDS).toContain("pt141");
  });

  it("contains the v5 §2.29 RUO bypass vectors (BAC water)", () => {
    expect(BANNED_COMPOUNDS).toContain("bacteriostatic water");
    expect(BANNED_COMPOUNDS).toContain("bac water");
    expect(BANNED_COMPOUNDS).toContain("bacteriostatic-water");
    expect(BANNED_COMPOUNDS).toContain("bac-water");
  });

  it("contains the v5 §2.29 SS-31 / elamipretide additions", () => {
    expect(BANNED_COMPOUNDS).toContain("ss-31");
    expect(BANNED_COMPOUNDS).toContain("ss31");
    expect(BANNED_COMPOUNDS).toContain("elamipretide");
  });

  it("contains the v5.0 supplemental KLOW ban", () => {
    expect(BANNED_COMPOUNDS).toContain("klow");
  });

  it("is a frozen, non-empty list", () => {
    expect(BANNED_COMPOUNDS.length).toBeGreaterThan(0);
  });
});

describe("isBannedCompound — exact lowercase canonical entries", () => {
  const lowerCases: Array<[string]> = BANNED_COMPOUNDS.map(
    (c: string) => [c] as [string],
  );
  it.each(lowerCases)("rejects exact lowercase form: %s", (entry) => {
    expect(isBannedCompound(entry)).toBe(true);
  });
});

describe("isBannedCompound — case-insensitive matching", () => {
  const upperCases: Array<[string, string]> = BANNED_COMPOUNDS.map(
    (c: string) => [c.toUpperCase(), c] as [string, string],
  );
  it.each(upperCases)(
    "rejects uppercase form: %s (banned token: %s)",
    (uppered) => {
      expect(isBannedCompound(uppered)).toBe(true);
    },
  );

  it("rejects Title-Case form for single-word entries", () => {
    expect(isBannedCompound("Tirzepatide")).toBe(true);
    expect(isBannedCompound("Semaglutide")).toBe(true);
    expect(isBannedCompound("Retatrutide")).toBe(true);
    expect(isBannedCompound("Tesamorelin")).toBe(true);
    expect(isBannedCompound("Melanotan")).toBe(true);
    expect(isBannedCompound("Bremelanotide")).toBe(true);
    expect(isBannedCompound("Vyleesi")).toBe(true);
    expect(isBannedCompound("Elamipretide")).toBe(true);
    expect(isBannedCompound("Klow")).toBe(true);
  });

  it("rejects MixedCase obfuscation for short codes", () => {
    expect(isBannedCompound("Tirz")).toBe(true);
    expect(isBannedCompound("Sema")).toBe(true);
    expect(isBannedCompound("Reta")).toBe(true);
    expect(isBannedCompound("TIRZ")).toBe(true);
    expect(isBannedCompound("Reta")).toBe(true);
    expect(isBannedCompound("KLOW")).toBe(true);
  });
});

describe("isBannedCompound — whitespace + punctuation handling", () => {
  it("rejects with leading/trailing whitespace", () => {
    expect(isBannedCompound("  tirzepatide  ")).toBe(true);
    expect(isBannedCompound("\ttirz\n")).toBe(true);
    expect(isBannedCompound("  KLOW")).toBe(true);
  });

  it("rejects when token is followed by a dose suffix", () => {
    expect(isBannedCompound("Reta 10mg")).toBe(true);
    expect(isBannedCompound("Tirz 25mg")).toBe(true);
    expect(isBannedCompound("KLOW 80mg")).toBe(true);
    expect(isBannedCompound("Sema 5mg")).toBe(true);
    expect(isBannedCompound("tesamorelin 5mg vial")).toBe(true);
  });

  it("rejects when token is preceded by a brand/product prefix", () => {
    expect(isBannedCompound("Product: Tirz 25mg")).toBe(true);
    expect(isBannedCompound("SKU - reta-10mg")).toBe(true);
    expect(isBannedCompound("Variant: KLOW 80mg vial")).toBe(true);
  });

  it("rejects banned tokens inside larger strings (vial labels)", () => {
    expect(isBannedCompound("Reta 10mg vial")).toBe(true);
    expect(isBannedCompound("Tirz 25mg vial")).toBe(true);
    expect(isBannedCompound("KLOW 80mg vial")).toBe(true);
    expect(isBannedCompound("Melanotan-II 10mg")).toBe(true);
  });
});

describe("isBannedCompound — hyphenated entries", () => {
  it("matches hyphenated GLP-1 forms", () => {
    expect(isBannedCompound("glp-1")).toBe(true);
    expect(isBannedCompound("GLP-1")).toBe(true);
    expect(isBannedCompound("glp1")).toBe(true);
    expect(isBannedCompound("glp 1")).toBe(true);
    expect(isBannedCompound("glp-1ra")).toBe(true);
    expect(isBannedCompound("GLP-1RA")).toBe(true);
  });

  it("matches melanotan-i and melanotan-ii hyphen forms", () => {
    expect(isBannedCompound("melanotan-i")).toBe(true);
    expect(isBannedCompound("melanotan-ii")).toBe(true);
    expect(isBannedCompound("MT-I")).toBe(true);
    expect(isBannedCompound("MT-II")).toBe(true);
    expect(isBannedCompound("mt-1")).toBe(true);
    expect(isBannedCompound("mt-2")).toBe(true);
  });

  it("matches SS-31 + SS31 variants", () => {
    expect(isBannedCompound("ss-31")).toBe(true);
    expect(isBannedCompound("SS-31")).toBe(true);
    expect(isBannedCompound("ss31")).toBe(true);
    expect(isBannedCompound("SS31")).toBe(true);
  });

  it("matches PT-141 + PT141 variants", () => {
    expect(isBannedCompound("pt-141")).toBe(true);
    expect(isBannedCompound("PT-141")).toBe(true);
    expect(isBannedCompound("pt141")).toBe(true);
    expect(isBannedCompound("PT141")).toBe(true);
  });

  it("matches klow-80mg slug form", () => {
    expect(isBannedCompound("klow-80mg")).toBe(true);
  });

  it("matches retatrutide-10mg slug form (substring within token)", () => {
    expect(isBannedCompound("retatrutide-10mg")).toBe(true);
  });

  it("matches tirzepatide-mimetic (substring banned token within larger word)", () => {
    // Banned single-word entries like 'tirzepatide' substring-match
    // because the word-boundary regex is `(^|[^a-z0-9])tirzepatide([^a-z0-9]|$)`
    // and "tirzepatide-mimetic" has a hyphen boundary after tirzepatide.
    expect(isBannedCompound("tirzepatide-mimetic")).toBe(true);
  });
});

describe("isBannedCompound — multi-word entries (BAC water family)", () => {
  it("matches bacteriostatic water with single space", () => {
    expect(isBannedCompound("bacteriostatic water")).toBe(true);
    expect(isBannedCompound("Bacteriostatic Water")).toBe(true);
    expect(isBannedCompound("BACTERIOSTATIC WATER")).toBe(true);
  });

  it("matches bac water with single space", () => {
    expect(isBannedCompound("bac water")).toBe(true);
    expect(isBannedCompound("BAC Water")).toBe(true);
  });

  it("matches hyphenated bacteriostatic-water + bac-water", () => {
    expect(isBannedCompound("bacteriostatic-water")).toBe(true);
    expect(isBannedCompound("bac-water")).toBe(true);
    expect(isBannedCompound("Bac-Water")).toBe(true);
  });

  it("matches BAC water inside a larger product label", () => {
    expect(isBannedCompound("30ml bacteriostatic water vial")).toBe(true);
    expect(isBannedCompound("Order bac water 30mL")).toBe(true);
    expect(isBannedCompound("vial: bacteriostatic-water 30mL")).toBe(true);
  });
});

describe("isBannedCompound — concrete S1 / audit C5 cases", () => {
  // These are the literal cases that audit C5 + supplemental S1 demonstrated
  // would slip past the catalog-inclusion gate when the operator added
  // shortName="Reta" + "Tirz" + "KLOW" to lib/content/products.ts. The
  // blocklist is the second gate; these MUST be rejected.
  it.each([
    ["Reta"],
    ["Tirz"],
    ["KLOW"],
    ["Reta 10mg vial"],
    ["Tirz 25mg"],
    ["klow-80mg"],
    ["reta-10mg"],
    ["tirz-25mg"],
    ["tesamorelin-5mg"],
    ["pt-141-10mg"],
    ["melanotan-ii-10mg"],
    ["klow-80mg vial"],
  ])("rejects audit S1 case: %s", (input) => {
    expect(isBannedCompound(input)).toBe(true);
  });
});

describe("isBannedCompound — safe compounds (NEGATIVE cases)", () => {
  // Every name below SHOULD return false. If any of these starts returning
  // true, the blocklist over-blocks and the safe v5.0 catalog breaks.
  const safeCompounds: Array<[string]> = [
    ["BPC-157"],
    ["bpc-157"],
    ["BPC157"],
    ["TB-500"],
    ["tb-500"],
    ["TB500"],
    ["GHK-Cu"],
    ["ghk-cu"],
    ["MOTS-c"],
    ["mots-c"],
    ["MOTS-C"],
    ["Selank"],
    ["selank"],
    ["Semax"],
    ["semax"],
    ["Epitalon"],
    ["epitalon"],
    ["KPV"],
    ["kpv"],
    ["NAD"],
    ["NAD+"],
    ["nad"],
    ["Ipamorelin"],
    ["ipamorelin"],
    ["CJC-1295"],
    ["cjc-1295"],
    ["Sermorelin"],
    ["sermorelin"],
    ["Hexarelin"],
    ["GHRP-2"],
    ["GHRP-6"],
    ["Thymosin Alpha-1"],
    ["DSIP"],
    ["AOD-9604"],
    ["LL-37"],
  ];

  it.each(safeCompounds)("returns false for safe compound: %s", (compound) => {
    expect(isBannedCompound(compound)).toBe(false);
  });
});

describe("isBannedCompound — whole-word semantics", () => {
  it("does NOT match 'retreat' (different word, starts with 'reta'-like)", () => {
    expect(isBannedCompound("retreat")).toBe(false);
  });

  it("does NOT match 'retainer' (different word, starts with 'reta')", () => {
    expect(isBannedCompound("retainer")).toBe(false);
  });

  it("does NOT match 'sematic' (different word, starts with 'sema')", () => {
    // 'sema' is a banned 4-letter short code, but only as a standalone word.
    expect(isBannedCompound("sematic")).toBe(false);
  });

  it("does NOT match 'tirzon' (different word, starts with 'tirz')", () => {
    expect(isBannedCompound("tirzon")).toBe(false);
  });

  it("does NOT match 'klowinski' (different word, starts with 'klow')", () => {
    expect(isBannedCompound("klowinski")).toBe(false);
  });

  it("does match across hyphen boundaries (still considered a word boundary)", () => {
    expect(isBannedCompound("foo-tirz-bar")).toBe(true);
    expect(isBannedCompound("foo-reta-bar")).toBe(true);
    expect(isBannedCompound("a-klow-b")).toBe(true);
  });

  it("does match across whitespace boundaries", () => {
    expect(isBannedCompound("vial of tirz here")).toBe(true);
    expect(isBannedCompound("contains reta")).toBe(true);
  });
});

describe("isBannedCompound — edge cases / defensive inputs", () => {
  it("returns false on empty string", () => {
    expect(isBannedCompound("")).toBe(false);
  });

  it("returns false on whitespace-only string", () => {
    expect(isBannedCompound("   ")).toBe(false);
    expect(isBannedCompound("\t\n")).toBe(false);
  });

  it("returns false on non-string input (undefined)", () => {
    expect(isBannedCompound(undefined as unknown as string)).toBe(false);
  });

  it("returns false on non-string input (null)", () => {
    expect(isBannedCompound(null as unknown as string)).toBe(false);
  });

  it("returns false on non-string input (number)", () => {
    expect(isBannedCompound(42 as unknown as string)).toBe(false);
  });

  it("returns false on non-string input (object)", () => {
    expect(isBannedCompound({} as unknown as string)).toBe(false);
  });

  it("returns false on safe phrase that contains no banned tokens", () => {
    expect(
      isBannedCompound("BPC-157 is a 15-amino-acid peptide fragment"),
    ).toBe(false);
    expect(
      isBannedCompound(
        "Recovery Stack: BPC-157 10mg + TB-500 5mg supplied lyophilized",
      ),
    ).toBe(false);
  });
});
