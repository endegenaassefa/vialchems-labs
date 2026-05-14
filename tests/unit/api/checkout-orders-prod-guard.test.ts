/**
 * Regression test for the checkout production guard.
 *
 * Bug (found via /investigate 2026-05-14): app/api/checkout/orders/route.ts
 * wraps every DB insert in `if (supabase) { ... }`. When serviceSupabase()
 * returns null (REQUIRE_SUPABASE not "true"), the handler skipped all
 * persistence but still returned 200 "order confirmed" — a silent
 * order-loss bug if production ever booted misconfigured.
 *
 * Fix: a production guard that returns 503 "checkout_unavailable" when
 * the Supabase client is null AND isProductionRuntime() is true. Demo
 * mode (local dev, non-production) is unchanged.
 *
 * This test FAILS without the guard: the old handler would fall through
 * past the (skipped) insert block and call provider.createIntent on the
 * minimal mock — which has no such method — yielding a 500/throw, never
 * the clean 503 we now assert.
 */
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

// next/headers cookies() throws outside a request scope in unit tests.
// Mock it to return a stub store — the actual cookie value is irrelevant
// because isSignedAgeVerificationCurrent is mocked to return true.
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => ({ value: "mocked-age-cookie" }),
  }),
}));

// serviceSupabase returns null — the demo-mode condition that the guard
// must catch when running in production.
vi.mock("@/lib/supabase", () => ({
  serviceSupabase: () => null,
  _resetSupabaseCachesForTests: () => {},
}));

// Age gate passes — we want the request to reach the Supabase guard,
// not bail at the 403 age check.
vi.mock("@/lib/age-verification", () => ({
  AGE_VERIFICATION_COOKIE: "vialchemlabs_age_verified",
  isSignedAgeVerificationCurrent: vi.fn(async () => true),
}));

// isProductionRuntime is toggled per-test via this mock handle.
const isProductionRuntimeMock = vi.fn(() => true);
vi.mock("@/lib/runtime-env", () => ({
  isProductionRuntime: () => isProductionRuntimeMock(),
  envFlag: () => false,
}));

// Minimal payment provider — guard returns BEFORE any provider method is
// called, so { id } is enough for the production-guard path.
vi.mock("@/lib/payments/config", () => ({
  getPaymentProvider: () => ({ id: "btcpay" }),
}));

import { POST } from "@/app/api/checkout/orders/route";

// A fully valid checkout payload — passes schema, jurisdiction (WI is not
// on the CA/TX/NY/FL block list), catalog (real SKU), and method checks
// so execution reaches the Supabase guard.
const validPayload = {
  address: {
    name: "Test Researcher",
    email: "researcher@example.com",
    street: "1 Lab Way",
    street2: "",
    city: "Madison",
    stateCode: "WI",
    zip: "53703",
    countryCode: "US",
  },
  method: "crypto" as const,
  lines: [{ sku: "BPC-157-10MG", slug: "bpc-157-10mg", qty: 1 }],
  qualification: {
    email: "researcher@example.com",
    role: "academic-researcher",
    researchPurpose:
      "Investigating in-vitro fibroblast migration kinetics in cell-culture wound-closure assays per laboratory protocol.",
    ageAcknowledgment: true,
    ruoAcknowledgment: true,
    jurisdictionAcknowledgment: true,
    attestationsAcknowledged: true,
  },
};

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/checkout/orders", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      // Any non-empty cookie value works — isSignedAgeVerificationCurrent
      // is mocked to return true regardless.
      cookie: "vialchemlabs_age_verified=mocked",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/checkout/orders — production guard", () => {
  beforeEach(() => {
    isProductionRuntimeMock.mockReset();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns 503 checkout_unavailable when Supabase is null in production", async () => {
    isProductionRuntimeMock.mockReturnValue(true);
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe("checkout_unavailable");
  });

  it("does NOT 503 at the guard in non-production (demo mode proceeds)", async () => {
    isProductionRuntimeMock.mockReturnValue(false);
    const res = await POST(makeRequest(validPayload));
    // In demo mode the guard is bypassed. Execution continues past it;
    // the exact downstream status depends on the (mocked) provider, but
    // it must NOT be the production-guard 503/checkout_unavailable.
    if (res.status === 503) {
      const body = await res.json();
      expect(body.error).not.toBe("checkout_unavailable");
    } else {
      expect(res.status).not.toBe(503);
    }
  });
});
