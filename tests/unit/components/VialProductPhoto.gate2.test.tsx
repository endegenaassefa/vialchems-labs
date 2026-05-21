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
vi.mock("@/lib/content/products", () => ({
  products: [
    {
      slug: "regression-fixture-reta",
      sku: "REGRESSION-FIXTURE-RETA",
      name: "Regression Fixture, 10mg vial",
      shortName: "Reta",
      dose: "10mg",
      priceUsd: 1,
      kind: "single",
    },
    {
      slug: "regression-fixture-tirz",
      sku: "REGRESSION-FIXTURE-TIRZ",
      name: "Regression Fixture, 25mg vial",
      shortName: "Tirz",
      dose: "25mg",
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
  it("throws Iron Law 2.29 for banned compound 'Reta' even when present in catalog mock", () => {
    expect(() =>
      render(<VialProductPhoto compound="Reta" dose="10mg" />),
    ).toThrow(/Iron Law 2\.29/);
  });

  it("throws Iron Law 2.29 for case-variant 'RETA' even when present in catalog mock", () => {
    expect(() =>
      render(<VialProductPhoto compound="RETA" dose="10mg" />),
    ).toThrow(/Iron Law 2\.29/);
  });

  it("throws Iron Law 2.29 for 'Tirz' (sibling banned compound from supplemental S1)", () => {
    expect(() =>
      render(<VialProductPhoto compound="Tirz" dose="25mg" />),
    ).toThrow(/Iron Law 2\.29/);
  });

  it("renders for safe catalog compound 'BPC-157' (gate 1 passes, gate 2 passes)", () => {
    expect(() =>
      render(<VialProductPhoto compound="BPC-157" dose="5mg" />),
    ).not.toThrow();
  });

  it("Iron Law 2.29 error references lib/compliance/banned-compounds.ts", () => {
    expect(() =>
      render(<VialProductPhoto compound="Reta" dose="10mg" />),
    ).toThrow(/lib\/compliance\/banned-compounds\.ts/);
  });

  it("Iron Law 2.29 error references the DECISIONS override path", () => {
    expect(() =>
      render(<VialProductPhoto compound="Reta" dose="10mg" />),
    ).toThrow(/docs\/DECISIONS\/iron_law_2_7_override/);
  });
});
