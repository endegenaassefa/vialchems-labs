/**
 * Iron Law 2.29 — static banned-compound blocklist regression suite.
 *
 * Asserts the LAST-LINE structural defense at `lib/compliance/banned-compounds.ts`:
 *   - BANNED_COMPOUNDS retains documented entries (audit-trail per Iron Law 2.14)
 *   - OVERRIDE_ALLOWED_COMPOUNDS short-circuits isBannedCompound() to false
 *     for operator-authorized exceptions (per
 *     docs/DECISIONS/iron_law_2_7_override_2026-05-22.md)
 *   - Every still-banned member is detected in its canonical form
 *   - Case-insensitive (capital, mixed, lower)
 *   - Surrounding whitespace / punctuation does not let a banned token slip past
 *   - Multi-word + hyphenated forms (bacteriostatic water, melanotan-ii) match
 *     across whitespace / hyphen variants
 *   - Safe compound names (BPC-157, TB-500, GHK-Cu, Selank, ...) return FALSE
 *   - Whole-word boundary semantics — "tirzepatide-mimetic" matches via
 *     substring for still-banned; "retreat" does NOT match
 *   - Empty / null-ish inputs return FALSE without throwing
 */
import { describe, expect, it } from "vitest";

import {
  BANNED_COMPOUNDS,
  OVERRIDE_ALLOWED_COMPOUNDS,
  isBannedCompound,
} from "@/lib/compliance/banned-compounds";

// Effective banned set = BANNED_COMPOUNDS minus operator-override exceptions
const OVERRIDE_SET = new Set<string>(
  OVERRIDE_ALLOWED_COMPOUNDS.map((c) => c.toLowerCase()),
);
const STILL_BANNED = BANNED_COMPOUNDS.filter(
  (c) => !OVERRIDE_SET.has(c.toLowerCase()),
);

describe("BANNED_COMPOUNDS constant (documented baseline — Iron Law 2.14 audit trail)", () => {
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

  it("is a frozen, non-empty list", () => {
    expect(BANNED_COMPOUNDS.length).toBeGreaterThan(0);
  });
});

describe("OVERRIDE_ALLOWED_COMPOUNDS — operator-authorized exceptions (2026-05-22)", () => {
  it("contains exactly the 5 aliases the operator override re-introduced", () => {
    expect(OVERRIDE_ALLOWED_COMPOUNDS).toContain("klow");
    expect(OVERRIDE_ALLOWED_COMPOUNDS).toContain("reta");
    expect(OVERRIDE_ALLOWED_COMPOUNDS).toContain("retatrutide");
    expect(OVERRIDE_ALLOWED_COMPOUNDS).toContain("tirz");
    expect(OVERRIDE_ALLOWED_COMPOUNDS).toContain("tirzepatide");
  });

  it("does NOT contain still-banned compounds (no silent unbanning of other GLP-1s)", () => {
    expect(OVERRIDE_ALLOWED_COMPOUNDS).not.toContain("semaglutide");
    expect(OVERRIDE_ALLOWED_COMPOUNDS).not.toContain("liraglutide");
    expect(OVERRIDE_ALLOWED_COMPOUNDS).not.toContain("dulaglutide");
    expect(OVERRIDE_ALLOWED_COMPOUNDS).not.toContain("sema");
    expect(OVERRIDE_ALLOWED_COMPOUNDS).not.toContain("tesamorelin");
    expect(OVERRIDE_ALLOWED_COMPOUNDS).not.toContain("melanotan");
    expect(OVERRIDE_ALLOWED_COMPOUNDS).not.toContain("pt-141");
    expect(OVERRIDE_ALLOWED_COMPOUNDS).not.toContain("bremelanotide");
    expect(OVERRIDE_ALLOWED_COMPOUNDS).not.toContain("ss-31");
    expect(OVERRIDE_ALLOWED_COMPOUNDS).not.toContain("elamipretide");
  });

  it("isBannedCompound() returns FALSE for each override-allowed alias", () => {
    for (const allowed of OVERRIDE_ALLOWED_COMPOUNDS) {
      expect(isBannedCompound(allowed)).toBe(false);
    }
  });

  it("isBannedCompound() returns FALSE for case-variants of override-allowed", () => {
    expect(isBannedCompound("KLOW")).toBe(false);
    expect(isBannedCompound("Klow")).toBe(false);
    expect(isBannedCompound("Reta")).toBe(false);
    expect(isBannedCompound("RETA")).toBe(false);
    expect(isBannedCompound("Retatrutide")).toBe(false);
    expect(isBannedCompound("RETATRUTIDE")).toBe(false);
    expect(isBannedCompound("Tirz")).toBe(false);
    expect(isBannedCompound("TIRZ")).toBe(false);
    expect(isBannedCompound("Tirzepatide")).toBe(false);
    expect(isBannedCompound("TIRZEPATIDE")).toBe(false);
  });

  it("isBannedCompound() returns FALSE for slug forms of override-allowed", () => {
    expect(isBannedCompound("klow-80mg")).toBe(false);
    expect(isBannedCompound("reta-10mg")).toBe(false);
    expect(isBannedCompound("reta-20mg")).toBe(false);
    expect(isBannedCompound("tirz-25mg")).toBe(false);
    expect(isBannedCompound("retatrutide-10mg")).toBe(false);
  });

  it("isBannedCompound() returns FALSE for dose-suffix forms of override-allowed", () => {
    expect(isBannedCompound("Reta 10mg")).toBe(false);
    expect(isBannedCompound("Tirz 25mg")).toBe(false);
    expect(isBannedCompound("KLOW 80mg")).toBe(false);
    expect(isBannedCompound("Reta 10mg vial")).toBe(false);
    expect(isBannedCompound("klow-80mg vial")).toBe(false);
  });
});

describe("isBannedCompound — exact lowercase still-banned entries", () => {
  const lowerCases: Array<[string]> = STILL_BANNED.map(
    (c: string) => [c] as [string],
  );
  it.each(lowerCases)("rejects exact lowercase form: %s", (entry) => {
    expect(isBannedCompound(entry)).toBe(true);
  });
});

describe("isBannedCompound — case-insensitive matching (still-banned only)", () => {
  const upperCases: Array<[string, string]> = STILL_BANNED.map(
    (c: string) => [c.toUpperCase(), c] as [string, string],
  );
  it.each(upperCases)(
    "rejects uppercase form: %s (banned token: %s)",
    (uppered) => {
      expect(isBannedCompound(uppered)).toBe(true);
    },
  );

  it("rejects Title-Case form for still-banned single-word entries", () => {
    expect(isBannedCompound("Semaglutide")).toBe(true);
    expect(isBannedCompound("Liraglutide")).toBe(true);
    expect(isBannedCompound("Dulaglutide")).toBe(true);
    expect(isBannedCompound("Tesamorelin")).toBe(true);
    expect(isBannedCompound("Melanotan")).toBe(true);
    expect(isBannedCompound("Bremelanotide")).toBe(true);
    expect(isBannedCompound("Vyleesi")).toBe(true);
    expect(isBannedCompound("Elamipretide")).toBe(true);
  });

  it("rejects MixedCase obfuscation for still-banned short codes", () => {
    expect(isBannedCompound("Sema")).toBe(true);
    expect(isBannedCompound("SEMA")).toBe(true);
  });
});

describe("isBannedCompound — whitespace + punctuation handling", () => {
  it("rejects with leading/trailing whitespace (still-banned compounds)", () => {
    expect(isBannedCompound("  tesamorelin  ")).toBe(true);
    expect(isBannedCompound("\tsema\n")).toBe(true);
    expect(isBannedCompound("  bremelanotide")).toBe(true);
  });

  it("rejects when token is followed by a dose suffix (still-banned)", () => {
    expect(isBannedCompound("Sema 5mg")).toBe(true);
    expect(isBannedCompound("tesamorelin 5mg vial")).toBe(true);
    expect(isBannedCompound("Melanotan-II 10mg")).toBe(true);
    expect(isBannedCompound("PT-141 10mg vial")).toBe(true);
  });

  it("rejects when token is preceded by a brand/product prefix (still-banned)", () => {
    expect(isBannedCompound("Product: Tesamorelin 5mg")).toBe(true);
    expect(isBannedCompound("SKU - pt-141-10mg")).toBe(true);
    expect(isBannedCompound("Variant: Melanotan-II 10mg vial")).toBe(true);
  });
});

describe("isBannedCompound — hyphenated still-banned entries", () => {
  it("matches hyphenated GLP-1 forms (still-banned class identifier)", () => {
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

  it("matches tesamorelin-5mg slug form (substring within token)", () => {
    expect(isBannedCompound("tesamorelin-5mg")).toBe(true);
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

describe("isBannedCompound — concrete still-banned cases (post-2026-05-22 override)", () => {
  // Still-banned compounds — must reject. Reta/Tirz/KLOW are explicitly
  // NOT in this list because the 2026-05-22 operator override allows them.
  it.each([
    ["Tesamorelin"],
    ["tesamorelin-5mg"],
    ["Melanotan"],
    ["Melanotan-II"],
    ["melanotan-ii-10mg"],
    ["PT-141"],
    ["pt-141-10mg"],
    ["Bremelanotide"],
    ["Vyleesi"],
    ["Sema"],
    ["semaglutide"],
    ["bacteriostatic water"],
    ["bac-water"],
    ["SS-31"],
    ["elamipretide"],
    ["GLP-1"],
  ])("rejects still-banned case: %s", (input) => {
    expect(isBannedCompound(input)).toBe(true);
  });
});

describe("isBannedCompound — safe compounds (NEGATIVE cases)", () => {
  // Every name below SHOULD return false. If any of these starts returning
  // true, the blocklist over-blocks and the catalog breaks.
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
    expect(isBannedCompound("sematic")).toBe(false);
  });

  it("does NOT match 'tirzon' (different word, starts with 'tirz')", () => {
    expect(isBannedCompound("tirzon")).toBe(false);
  });

  it("does NOT match 'klowinski' (different word, starts with 'klow')", () => {
    expect(isBannedCompound("klowinski")).toBe(false);
  });

  it("does match still-banned tokens across hyphen boundaries", () => {
    expect(isBannedCompound("foo-tesamorelin-bar")).toBe(true);
    expect(isBannedCompound("foo-sema-bar")).toBe(true);
  });

  it("does match still-banned tokens across whitespace boundaries", () => {
    expect(isBannedCompound("vial of tesamorelin here")).toBe(true);
    expect(isBannedCompound("contains sema")).toBe(true);
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
