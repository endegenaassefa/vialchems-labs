/**
 * VialProductPhoto GATE 2 coverage — closes B4 from the codex pre-merge review.
 *
 * Codex finding: `components/ui/Vial.tsx:139` calls `isBannedCompound()` after
 * the catalog allowlist check, but sibling `components/ui/VialProductPhoto.tsx`
 * only enforces the catalog allowlist — it does NOT call `isBannedCompound()`.
 * The "double-gate" is therefore a 1.5-gate. If a banned compound is added
 * back to `lib/content/products.ts` (the exact failure mode supplemental S1
 * demonstrated for the Vial render path), `VialProductPhoto` would still
 * render. The Iron Law 2.7 / 2.29 "PERPETUAL ban" claim does not hold across
 * every render surface until VialProductPhoto wires the same blocklist call.
 *
 * SCANNER_OK: reviewed-and-cso-passed (PROTECTED PATH — Iron Law 2.5/2.19).
 */
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

// Inject a banned compound shortName into the catalog mock — the same S1
// regression-fixture pattern the sibling Vial.gate2 test uses.
// Use still-banned compound fixtures (tesamorelin / PT-141 — NOT
// overridden by docs/DECISIONS/iron_law_2_7_override_2026-05-22.md). Reta
// and Tirz are now operator-allowed and pass the gate, so they're no
// longer valid fixtures for exercising the rejection path.
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

import { VialProductPhoto } from "@/components/ui/VialProductPhoto";

describe("VialProductPhoto GATE 2 — static blocklist closes the codex B4 double-gate hole", () => {
  it("throws Iron Law 2.29 for still-banned 'Tesamorelin' even when present in catalog mock", () => {
    expect(() =>
      render(<VialProductPhoto compound="Tesamorelin" dose="5mg" />),
    ).toThrow(/Iron Law 2\.29/);
  });

  it("throws Iron Law 2.29 for case-variant 'TESAMORELIN' even when present in catalog mock", () => {
    expect(() =>
      render(<VialProductPhoto compound="TESAMORELIN" dose="5mg" />),
    ).toThrow(/Iron Law 2\.29/);
  });

  it("throws Iron Law 2.29 for 'PT-141' (sibling still-banned compound)", () => {
    expect(() =>
      render(<VialProductPhoto compound="PT-141" dose="10mg" />),
    ).toThrow(/Iron Law 2\.29/);
  });

  it("renders for safe catalog compound 'BPC-157' (gate 1 passes, gate 2 passes)", () => {
    expect(() =>
      render(<VialProductPhoto compound="BPC-157" dose="5mg" />),
    ).not.toThrow();
  });

  it("Iron Law 2.29 error references lib/compliance/banned-compounds.ts", () => {
    expect(() =>
      render(<VialProductPhoto compound="Tesamorelin" dose="5mg" />),
    ).toThrow(/lib\/compliance\/banned-compounds\.ts/);
  });

  it("Iron Law 2.29 error references the DECISIONS override path", () => {
    expect(() =>
      render(<VialProductPhoto compound="Tesamorelin" dose="5mg" />),
    ).toThrow(/docs\/DECISIONS\/iron_law_2_7_override/);
  });
});
