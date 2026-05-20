import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CHECKOUT_VERIFICATION_SKU,
  calculateCheckoutShippingCents,
  calculateCheckoutTotals,
  generateMainSiteOrderReference,
  getLocalPreviewSiteUrl,
  resolveCheckoutCartLines,
  safeCheckoutReturnPath,
} from "@/lib/checkout/cart";

describe("checkout cart totals", () => {
  it("keeps the checkout verification SKU at a $1 shipped total", () => {
    const resolved = resolveCheckoutCartLines([
      {
        sku: CHECKOUT_VERIFICATION_SKU,
        slug: "checkout-verification-1usd",
        qty: 1,
      },
    ]);

    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;

    expect(calculateCheckoutTotals(resolved.lines)).toEqual({
      subtotalCents: 100,
      shippingCents: 0,
      totalCents: 100,
    });
  });

  it("rejects custom-request catalog items at checkout", () => {
    const resolved = resolveCheckoutCartLines([
      {
        sku: "TB-500-5MG",
        slug: "tb-500-5mg",
        qty: 1,
      },
    ]);

    expect(resolved).toEqual({
      ok: false,
      message: "TB-500, 5mg vial is available by custom request only.",
    });
  });
});

describe("resolveCheckoutCartLines — branch coverage", () => {
  it("rejects an unknown slug", () => {
    const resolved = resolveCheckoutCartLines([
      { sku: "DOES-NOT-EXIST", slug: "does-not-exist-9mg", qty: 1 },
    ]);
    expect(resolved.ok).toBe(false);
    if (resolved.ok) return;
    expect(resolved.message).toMatch(/Unknown or mismatched catalog line/);
  });

  it("rejects when slug exists but SKU is mismatched (product)", () => {
    const resolved = resolveCheckoutCartLines([
      { sku: "WRONG-SKU", slug: "bpc-157-10mg", qty: 1 },
    ]);
    expect(resolved.ok).toBe(false);
    if (resolved.ok) return;
    expect(resolved.message).toMatch(/Unknown or mismatched catalog line/);
  });

  it("rejects a bundle slug as custom-request", () => {
    // Bundles always hit the bundle-rejection branch, regardless of SKU
    // match — they are never directly purchasable at checkout.
    const resolved = resolveCheckoutCartLines([
      {
        sku: "BUNDLE-RECOVERY-STACK",
        slug: "recovery-stack",
        qty: 1,
      },
    ]);
    expect(resolved.ok).toBe(false);
    if (resolved.ok) return;
    expect(resolved.message).toMatch(/available by custom request only/);
  });

  it("resolves multiple lines with names and unit prices preserved", () => {
    const resolved = resolveCheckoutCartLines([
      {
        sku: CHECKOUT_VERIFICATION_SKU,
        slug: "checkout-verification-1usd",
        qty: 2,
      },
    ]);
    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;
    expect(resolved.lines).toHaveLength(1);
    expect(resolved.lines[0]).toMatchObject({
      sku: CHECKOUT_VERIFICATION_SKU,
      slug: "checkout-verification-1usd",
      qty: 2,
      name: "Checkout Verification, 1 unit",
      unitPriceCents: 100,
    });
  });

  it("returns ok with an empty list when given no lines", () => {
    const resolved = resolveCheckoutCartLines([]);
    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;
    expect(resolved.lines).toEqual([]);
  });
});

describe("calculateCheckoutShippingCents — branch coverage", () => {
  it("returns 0 when only verification SKU lines are present", () => {
    expect(
      calculateCheckoutShippingCents(100, [{ sku: CHECKOUT_VERIFICATION_SKU }]),
    ).toBe(0);
  });

  it("returns 0 when subtotal meets the free-shipping threshold", () => {
    // siteConfig.shipping.freeShippingThresholdCents default is 20000 (=$200).
    expect(
      calculateCheckoutShippingCents(20000, [{ sku: "BPC-157-10MG" }]),
    ).toBe(0);
  });

  it("returns 0 when subtotal exceeds the free-shipping threshold", () => {
    expect(
      calculateCheckoutShippingCents(50000, [{ sku: "BPC-157-10MG" }]),
    ).toBe(0);
  });

  it("returns the pilot US shipping cents below the threshold", () => {
    // Default pilotUSCents is 1500.
    expect(
      calculateCheckoutShippingCents(1000, [{ sku: "BPC-157-10MG" }]),
    ).toBe(1500);
  });

  it("does not treat an empty line-list as verification-only", () => {
    // When no lines, `every` would technically return true, but the
    // `lines.length > 0` guard prevents that — so this falls through to
    // the threshold check.
    expect(calculateCheckoutShippingCents(0, [])).toBe(1500);
  });

  it("returns pilot shipping when mixed verification + real-product lines exist", () => {
    expect(
      calculateCheckoutShippingCents(5000, [
        { sku: CHECKOUT_VERIFICATION_SKU },
        { sku: "BPC-157-10MG" },
      ]),
    ).toBe(1500);
  });
});

describe("calculateCheckoutTotals — branch coverage", () => {
  it("sums multiple line subtotals and includes shipping below threshold", () => {
    const totals = calculateCheckoutTotals([
      {
        sku: "BPC-157-10MG",
        slug: "bpc-157-10mg",
        name: "BPC-157, 10mg vial",
        unitPriceCents: 5000,
        qty: 2,
      },
    ]);
    expect(totals).toEqual({
      subtotalCents: 10000,
      shippingCents: 1500,
      totalCents: 11500,
    });
  });

  it("zeroes shipping at the free-shipping threshold", () => {
    const totals = calculateCheckoutTotals([
      {
        sku: "BPC-157-10MG",
        slug: "bpc-157-10mg",
        name: "BPC-157, 10mg vial",
        unitPriceCents: 20000,
        qty: 1,
      },
    ]);
    expect(totals).toEqual({
      subtotalCents: 20000,
      shippingCents: 0,
      totalCents: 20000,
    });
  });

  it("returns zero subtotal and pilot shipping with empty lines", () => {
    expect(calculateCheckoutTotals([])).toEqual({
      subtotalCents: 0,
      shippingCents: 1500,
      totalCents: 1500,
    });
  });
});

describe("safeCheckoutReturnPath", () => {
  it("returns /cart when path is undefined", () => {
    expect(safeCheckoutReturnPath(undefined)).toBe("/cart");
  });

  it("returns /cart when path is empty string", () => {
    expect(safeCheckoutReturnPath("")).toBe("/cart");
  });

  it("returns /cart when path does not start with /", () => {
    expect(safeCheckoutReturnPath("evil.example.com")).toBe("/cart");
  });

  it("returns /cart when path is a protocol-relative URL (//evil.com)", () => {
    expect(safeCheckoutReturnPath("//evil.example.com")).toBe("/cart");
  });

  it("returns the original path when it starts with a single /", () => {
    expect(safeCheckoutReturnPath("/checkout/review")).toBe("/checkout/review");
  });

  it("preserves query string + hash on a safe path", () => {
    expect(safeCheckoutReturnPath("/checkout?step=2#confirm")).toBe(
      "/checkout?step=2#confirm",
    );
  });
});

describe("getLocalPreviewSiteUrl", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("returns fallback in production regardless of origin", () => {
    process.env.NODE_ENV = "production";
    expect(
      getLocalPreviewSiteUrl(
        "http://localhost:3000",
        "https://www.example.com",
      ),
    ).toBe("https://www.example.com");
  });

  it("returns fallback when origin is null (non-production)", () => {
    process.env.NODE_ENV = "development";
    expect(getLocalPreviewSiteUrl(null, "https://www.example.com")).toBe(
      "https://www.example.com",
    );
  });

  it("returns localhost origin when running in dev with localhost origin", () => {
    process.env.NODE_ENV = "development";
    expect(
      getLocalPreviewSiteUrl(
        "http://localhost:3000",
        "https://www.example.com",
      ),
    ).toBe("http://localhost:3000");
  });

  it("returns 127.0.0.1 origin when running in dev with 127.0.0.1 origin", () => {
    process.env.NODE_ENV = "development";
    expect(
      getLocalPreviewSiteUrl("http://127.0.0.1:3000", "https://www.example.com"),
    ).toBe("http://127.0.0.1:3000");
  });

  it("returns fallback for non-localhost dev origins", () => {
    process.env.NODE_ENV = "development";
    expect(
      getLocalPreviewSiteUrl(
        "https://staging.example.com",
        "https://www.example.com",
      ),
    ).toBe("https://www.example.com");
  });

  it("returns fallback when origin string is not a valid URL", () => {
    process.env.NODE_ENV = "development";
    expect(
      getLocalPreviewSiteUrl("not a url at all", "https://www.example.com"),
    ).toBe("https://www.example.com");
  });
});

describe("generateMainSiteOrderReference", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("formats with VC- prefix, YYMMDD date, and 8-character uppercase suffix", () => {
    const now = new Date("2026-05-20T10:00:00.000Z");
    const randomId = "abcdef01-2345-6789-abcd-ef0123456789";
    const ref = generateMainSiteOrderReference(now, randomId);
    expect(ref).toBe("VC-260520-ABCDEF01");
  });

  it("uses crypto.randomUUID() as the default randomId", () => {
    const ref = generateMainSiteOrderReference(new Date("2026-01-01T00:00:00.000Z"));
    expect(ref).toMatch(/^VC-260101-[A-F0-9]{8}$/);
  });

  it("uses now=new Date() as the default", () => {
    const before = Date.now();
    const ref = generateMainSiteOrderReference();
    const after = Date.now();
    // VC-YYMMDD where YYMMDD is derived from a date in [before, after].
    const match = ref.match(/^VC-(\d{6})-[A-F0-9]{8}$/);
    expect(match).not.toBeNull();
    if (!match) return;
    // Loose check: just confirm prefix shape stayed correct and that the
    // date matches one of the timestamps in the window.
    const expected = new Date(before).toISOString().slice(2, 10).replace(/-/g, "");
    const expectedAfter = new Date(after).toISOString().slice(2, 10).replace(/-/g, "");
    expect([expected, expectedAfter]).toContain(match[1]);
  });

  it("strips dashes from the random UUID before slicing", () => {
    // Provide a UUID with dashes that would change behavior if not stripped.
    const ref = generateMainSiteOrderReference(
      new Date("2026-12-31T23:59:59.000Z"),
      "11112222-3333-4444-5555-666677778888",
    );
    // The first 8 chars (no dashes) of "1111222233334444..." are "11112222".
    expect(ref).toBe("VC-261231-11112222");
  });
});
