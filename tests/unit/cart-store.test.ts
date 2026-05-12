/**
 * Cart store unit tests.
 *
 * The Phase 5 cart store is a Zustand vanilla store. Tests verify:
 *   - addLine pushes new lines, increments existing
 *   - qty is clamped to [1, 10]
 *   - removeLine drops by sku
 *   - subtotalCents reflects the live state
 *   - clear empties everything
 */
import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "@/lib/cart-store";

const SAMPLE = {
  sku: "BPC-157-10MG",
  slug: "bpc-157-10mg",
  name: "BPC-157, 10mg vial",
  unitPriceCents: 5400,
};

describe("useCartStore", () => {
  beforeEach(() => {
    useCartStore.getState().clear();
  });

  it("starts empty", () => {
    expect(useCartStore.getState().lines).toHaveLength(0);
    expect(useCartStore.getState().count()).toBe(0);
    expect(useCartStore.getState().subtotalCents()).toBe(0);
  });

  it("adds a new line with default qty 1", () => {
    useCartStore.getState().addLine(SAMPLE);
    const state = useCartStore.getState();
    expect(state.lines).toHaveLength(1);
    expect(state.lines[0].qty).toBe(1);
    expect(state.subtotalCents()).toBe(SAMPLE.unitPriceCents);
  });

  it("increments existing sku rather than duplicating", () => {
    useCartStore.getState().addLine(SAMPLE);
    useCartStore.getState().addLine(SAMPLE);
    const state = useCartStore.getState();
    expect(state.lines).toHaveLength(1);
    expect(state.lines[0].qty).toBe(2);
  });

  it("clamps qty to a maximum of 10 on add", () => {
    useCartStore.getState().addLine({ ...SAMPLE, qty: 25 });
    expect(useCartStore.getState().lines[0].qty).toBe(10);
  });

  it("clamps qty to a minimum of 1 on setQty", () => {
    useCartStore.getState().addLine(SAMPLE);
    useCartStore.getState().setQty(SAMPLE.sku, -3);
    expect(useCartStore.getState().lines[0].qty).toBe(1);
  });

  it("clamps qty to maximum of 10 on setQty", () => {
    useCartStore.getState().addLine(SAMPLE);
    useCartStore.getState().setQty(SAMPLE.sku, 999);
    expect(useCartStore.getState().lines[0].qty).toBe(10);
  });

  it("removes a line by sku", () => {
    useCartStore.getState().addLine(SAMPLE);
    useCartStore.getState().removeLine(SAMPLE.sku);
    expect(useCartStore.getState().lines).toHaveLength(0);
  });

  it("subtotalCents sums unit price times qty", () => {
    useCartStore.getState().addLine({ ...SAMPLE, qty: 3 });
    expect(useCartStore.getState().subtotalCents()).toBe(
      SAMPLE.unitPriceCents * 3,
    );
  });

  it("count() returns total qty across lines", () => {
    useCartStore.getState().addLine({ ...SAMPLE, qty: 2 });
    useCartStore.getState().addLine({
      sku: "TB-500-5MG",
      slug: "tb-500-5mg",
      name: "TB-500",
      unitPriceCents: 3400,
      qty: 1,
    });
    expect(useCartStore.getState().count()).toBe(3);
  });

  it("clear() resets state", () => {
    useCartStore.getState().addLine(SAMPLE);
    useCartStore.getState().clear();
    expect(useCartStore.getState().lines).toHaveLength(0);
  });
});
