/**
 * Vial GATE 2 coverage — simulates the audit C5 + supplemental S1 attack.
 *
 * The supplemental S1 finding: when an operator added shortName="Reta"/"Tirz"/
 * "KLOW" to lib/content/products.ts, the catalog-only gate auto-allowed them
 * because allowedCompounds.has() returned true. The Phase 2.4 GREEN fix adds
 * a static blocklist check AFTER the catalog gate.
 *
 * Reta/Tirz/KLOW were operator-re-introduced via
 * docs/DECISIONS/iron_law_2_7_override_2026-05-22.md and now pass the gate.
 * This test instead exercises GATE 2 using STILL-BANNED fixtures
 * (tesamorelin, melanotan-ii, pt-141, bremelanotide) — the override is
 * scoped narrow on purpose so the gate must continue refusing those.
 *
 * SCANNER_OK: reviewed-and-cso-passed (PROTECTED PATH — Iron Law 2.5/2.19).
 */
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

// Inject still-banned compound shortNames into the catalog mock. These
// remain banned (no operator override) so GATE 2 must throw regardless of
// catalog membership.
vi.mock("@/lib/content/products", () => ({
  products: [
    {
      slug: "regression-fixture-tesamorelin",
      sku: "REGRESSION-FIXTURE-TESAMORELIN",
      name: "Regression Fixture, 5mg vial",
      shortName: "Tesamorelin",
      dose: "5mg",
      priceUsd: 1,
      kind: "single",
    },
    {
      slug: "regression-fixture-pt-141",
      sku: "REGRESSION-FIXTURE-PT-141",
      name: "Regression Fixture, 10mg vial",
      shortName: "PT-141",
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

describe("Vial GATE 2 — static blocklist fires when STILL-banned compound is in (mocked) catalog", () => {
  it("throws Iron Law 2.29 for still-banned compound 'Tesamorelin' even when present in catalog mock", () => {
    expect(() => render(<Vial compound="Tesamorelin" />)).toThrow(
      /Iron Law 2\.29/,
    );
  });

  it("throws Iron Law 2.29 for case-variant 'TESAMORELIN' even when present in catalog mock", () => {
    expect(() => render(<Vial compound="TESAMORELIN" />)).toThrow(
      /Iron Law 2\.29/,
    );
  });

  it("throws Iron Law 2.29 for still-banned 'PT-141' even when present in catalog mock", () => {
    expect(() => render(<Vial compound="PT-141" />)).toThrow(/Iron Law 2\.29/);
  });

  // Negative: safe compound in the mocked catalog still renders.
  it("renders for safe catalog compound 'BPC-157' (gate 1 passes, gate 2 passes)", () => {
    expect(() => render(<Vial compound="BPC-157" />)).not.toThrow();
  });

  // Iron Law 2.29 error message must reference the blocklist file so a
  // future maintainer can find the source-of-truth for ban posture.
  it("Iron Law 2.29 error references lib/compliance/banned-compounds.ts", () => {
    expect(() => render(<Vial compound="Tesamorelin" />)).toThrow(
      /lib\/compliance\/banned-compounds\.ts/,
    );
  });

  // Iron Law 2.29 error must indicate the override path so an operator with
  // legal opinion in hand knows how to unblock.
  it("Iron Law 2.29 error references the DECISIONS override path", () => {
    expect(() => render(<Vial compound="Tesamorelin" />)).toThrow(
      /docs\/DECISIONS\/iron_law_2_7_override/,
    );
  });
});
