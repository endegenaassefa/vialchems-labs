/**
 * Vial GATE 2 coverage — simulates the audit C5 + supplemental S1 attack.
 *
 * The supplemental S1 finding: when an operator added shortName="Reta"/"Tirz"/
 * "KLOW" to lib/content/products.ts, the catalog-only gate auto-allowed them
 * because allowedCompounds.has() returned true. The Phase 2.4 GREEN fix adds
 * a static blocklist check AFTER the catalog gate.
 *
 * Currently no banned compound is in the catalog (Phase 2.1 removed them all),
 * so GATE 2 is unreachable in production code paths. To prove the gate works
 * (Iron Law 2.36 coverage), we mock @/lib/content/products to inject a banned
 * shortName, then assert GATE 2 fires with an Iron Law 2.29 error.
 *
 * SCANNER_OK: reviewed-and-cso-passed (PROTECTED PATH — Iron Law 2.5/2.19).
 */
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

// Inject a banned compound shortName into the catalog mock. This simulates
// the supplemental S1 scenario: operator regressed products.ts by adding
// shortName="Reta" (a known Iron Law 2.7 banned compound).
vi.mock("@/lib/content/products", () => ({
  products: [
    {
      slug: "regression-fixture",
      sku: "REGRESSION-FIXTURE",
      name: "Regression Fixture, 10mg vial",
      shortName: "Reta",
      dose: "10mg",
      priceUsd: 1,
      kind: "single",
    },
    // Also include a safe compound to verify the gate doesn't over-block.
    {
      slug: "bpc-157-fixture",
      sku: "BPC-157-FIXTURE",
      name: "BPC-157 Fixture, 5mg vial",
      shortName: "BPC-157",
      dose: "5mg",
      priceUsd: 1,
      kind: "single",
    },
  ],
  bundles: [],
}));

import { Vial } from "@/components/ui/Vial";

describe("Vial GATE 2 — static blocklist fires when banned compound is in (mocked) catalog", () => {
  // Pre-Phase-2.4: catalog auto-derive would allow "Reta" through (audit C5
  // predicted; S1 confirmed). Phase 2.4 adds GATE 2 (isBannedCompound) which
  // refuses regardless of catalog membership. This test asserts GATE 2 wins.
  it("throws Iron Law 2.29 for banned compound 'Reta' even when present in catalog mock", () => {
    expect(() => render(<Vial compound="Reta" />)).toThrow(/Iron Law 2\.29/);
  });

  it("throws Iron Law 2.29 for case-variant 'RETA' even when present in catalog mock", () => {
    expect(() => render(<Vial compound="RETA" />)).toThrow(/Iron Law 2\.29/);
  });

  // Negative: safe compound in the mocked catalog still renders.
  it("renders for safe catalog compound 'BPC-157' (gate 1 passes, gate 2 passes)", () => {
    expect(() => render(<Vial compound="BPC-157" />)).not.toThrow();
  });

  // Iron Law 2.29 error message must reference the blocklist file so a
  // future maintainer can find the source-of-truth for ban posture.
  it("Iron Law 2.29 error references lib/compliance/banned-compounds.ts", () => {
    expect(() => render(<Vial compound="Reta" />)).toThrow(
      /lib\/compliance\/banned-compounds\.ts/,
    );
  });

  // Iron Law 2.29 error must indicate the override path so an operator with
  // legal opinion in hand knows how to unblock.
  it("Iron Law 2.29 error references the DECISIONS override path", () => {
    expect(() => render(<Vial compound="Reta" />)).toThrow(
      /docs\/DECISIONS\/iron_law_2_7_override/,
    );
  });
});
