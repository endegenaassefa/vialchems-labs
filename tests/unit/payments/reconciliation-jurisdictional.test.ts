import { describe, expect, it, beforeEach, vi } from "vitest";

// Supabase mock for the PaymentIntent path (resolveAddressFromIntent reads
// orders.shipping_address_snapshot). The mock returns null by default so the
// "address unresolvable" tests exercise the credit-bearing fail-closed path.
const ordersSelectMock = vi.fn();
const ordersEqMock = vi.fn();
const ordersMaybeSingleMock = vi.fn();

const fromMock = vi.fn((table: string) => {
  if (table === "orders") {
    return { select: ordersSelectMock };
  }
  throw new Error(`unexpected table: ${table}`);
});

const fakeSupabase = { from: fromMock };
let serviceClientReturn: typeof fakeSupabase | null = null;

vi.mock("@/lib/supabase", () => ({
  serviceSupabase: () => serviceClientReturn,
  browserSupabase: () => null,
  _resetSupabaseCachesForTests: () => {},
}));

import {
  assertOrderJurisdictionAllowed,
  JurisdictionalGuardError,
  resetReconciliationLedger,
} from "@/lib/payments/reconciliation";
import type { PaymentIntent, PaymentStatus } from "@/lib/payments/types";

function makeIntent(
  status: PaymentStatus,
  metadata: Record<string, string>,
  id = "btcpay_b3_test",
): PaymentIntent {
  const ts = "2026-05-21T12:00:00.000Z";
  return {
    id,
    provider: "btcpay",
    method: "crypto",
    amountCents: 5000,
    currency: "USD",
    status,
    metadata,
    createdAt: ts,
    updatedAt: ts,
    externalId: `inv_${id}`,
  };
}

function resetSupabaseMocks(): void {
  ordersSelectMock.mockReset();
  ordersEqMock.mockReset();
  ordersMaybeSingleMock.mockReset();
  fromMock.mockClear();
  serviceClientReturn = null;

  ordersMaybeSingleMock.mockResolvedValue({ data: null, error: null });
  ordersEqMock.mockImplementation(() => ({
    maybeSingle: ordersMaybeSingleMock,
  }));
  ordersSelectMock.mockReturnValue({ eq: ordersEqMock });
}

/**
 * Phase 10.1 (v4) — D15 Layer 3 jurisdictional guard.
 *
 * Layer 1 is AddressForm client-side validation. Layer 2 is the place-order
 * server re-check in ReviewPanel. Layer 3 is THIS: the final guard at
 * webhook-reconcile time, so a spoofed or ineligible address does not credit.
 */

describe("assertOrderJurisdictionAllowed (D15 Layer 3)", () => {
  beforeEach(() => {
    resetReconciliationLedger();
    resetSupabaseMocks();
  });

  it("passes for US shipping states", async () => {
    for (const stateCode of ["WA", "CA", "TX", "NY", "FL"]) {
      await expect(
        assertOrderJurisdictionAllowed({
          countryCode: "US",
          stateCode,
        }),
      ).resolves.toBeUndefined();
    }
  });

  it("throws for non-US country codes (US-only Day-1)", async () => {
    await expect(
      assertOrderJurisdictionAllowed({
        countryCode: "CA",
        stateCode: "ON",
      }),
    ).rejects.toBeInstanceOf(JurisdictionalGuardError);
  });

  it("error includes the rejection reason from validateShippingAddress", async () => {
    let captured: unknown = null;
    try {
      await assertOrderJurisdictionAllowed({
        countryCode: "CA",
        stateCode: "ON",
      });
    } catch (err) {
      captured = err;
    }
    expect(captured).toBeInstanceOf(JurisdictionalGuardError);
    expect((captured as Error).message).toMatch(/United States/);
    expect((captured as Error).message).toMatch(/International shipping/);
  });
});

/**
 * B3 — Jurisdiction guard MUST fail closed when address is unresolvable on
 * a credit-bearing status. Previously, the guard silently `return`ed when
 * `resolveAddressFromIntent` returned null, on the rationale that "Layers 1+2
 * remain the primary defense." That rationale collapses when the metadata
 * key in the upstream writer (`app/api/checkout/orders/route.ts:336` wrote
 * `databaseOrderId`) doesn't match what the resolver reads (`order_id`
 * `orderId` `orderUuid`). Every checkout-driven BTCPay/Plaid intent then
 * hit `if (!resolved) return;` and Layer 3 silently passed without
 * validating address. The guard must throw for credit-bearing statuses
 * (paid, authorized) when it cannot prove the address is allowed.
 */
describe("assertOrderJurisdictionAllowed — B3 credit-bearing fail-closed", () => {
  beforeEach(() => {
    resetReconciliationLedger();
    resetSupabaseMocks();
  });

  it("throws when intent is paid and metadata has neither shipping_country nor a resolvable order_id key (Supabase off)", async () => {
    serviceClientReturn = null;

    const intent = makeIntent("paid", {
      displayId: "ORD-2026-TEST",
      databaseOrderId: "uuid-but-resolver-doesnt-read-this-key",
    });

    await expect(assertOrderJurisdictionAllowed(intent)).rejects.toBeInstanceOf(
      JurisdictionalGuardError,
    );
  });

  it("throws when intent is authorized and address is unresolvable (Supabase off)", async () => {
    serviceClientReturn = null;

    const intent = makeIntent("authorized", {
      databaseOrderId: "uuid-only-no-canonical-order-id",
    });

    await expect(assertOrderJurisdictionAllowed(intent)).rejects.toBeInstanceOf(
      JurisdictionalGuardError,
    );
  });

  it("throws when intent is paid, has order_id in metadata, but Supabase has no matching row", async () => {
    serviceClientReturn = fakeSupabase;
    ordersMaybeSingleMock.mockResolvedValueOnce({ data: null, error: null });

    const intent = makeIntent("paid", {
      order_id: "11111111-1111-1111-1111-111111111111",
    });

    await expect(assertOrderJurisdictionAllowed(intent)).rejects.toBeInstanceOf(
      JurisdictionalGuardError,
    );
  });

  it("does NOT throw for non-credit-bearing statuses (pending, failed, refunded) when address is unresolvable", async () => {
    serviceClientReturn = null;

    for (const status of ["pending", "failed", "refunded"] as const) {
      const intent = makeIntent(status, {
        databaseOrderId: "uuid",
      });
      await expect(
        assertOrderJurisdictionAllowed(intent),
      ).resolves.toBeUndefined();
    }
  });

  it("passes for paid intent with adapter-injected shipping_country=US in metadata (cheap path still works)", async () => {
    serviceClientReturn = null;

    const intent = makeIntent("paid", {
      shipping_country: "US",
      shipping_state: "WA",
    });

    await expect(
      assertOrderJurisdictionAllowed(intent),
    ).resolves.toBeUndefined();
  });

  it("passes for paid intent with order_id that resolves to US shipping address in Supabase", async () => {
    serviceClientReturn = fakeSupabase;
    ordersMaybeSingleMock.mockResolvedValueOnce({
      data: {
        shipping_address_snapshot: {
          country_code: "US",
          state_code: "WA",
        },
      },
      error: null,
    });

    const intent = makeIntent("paid", {
      order_id: "11111111-1111-1111-1111-111111111111",
    });

    await expect(
      assertOrderJurisdictionAllowed(intent),
    ).resolves.toBeUndefined();
  });
});

/**
 * B3-followup (codex re-review of c943e0c6 / 2026-05-21): the new
 * credit-bearing fail-closed behavior amplifies a pre-existing gap in
 * `/api/create-bitcoin-order`. That route doesn't create a database orders
 * row at invoice-creation time — shipping address is captured at the
 * `/bitcoin/receipt` step. So the BTCPay invoice it creates has no
 * `order_id` UUID metadata, and after the B3 fix every legit Settled
 * webhook on those invoices 403s.
 *
 * Fix: allow intents to mark themselves explicitly as "address capture
 * deferred to a downstream receipt route" via metadata. The guard skips
 * with a Sentry breadcrumb. The downstream receipt route remains the
 * authoritative Layer 3 enforcement point (it gets the address via
 * request payload and calls the guard with an address-like input).
 */
describe("assertOrderJurisdictionAllowed — B3-followup deferred-address marker", () => {
  beforeEach(() => {
    resetReconciliationLedger();
    resetSupabaseMocks();
  });

  it("does NOT throw for paid intent with metadata.address_capture_deferred=true (bitcoin-direct fallback flow)", async () => {
    serviceClientReturn = null;

    const intent = makeIntent("paid", {
      source: "vialchemlabs-main-site",
      address_capture_deferred: "true",
    });

    await expect(
      assertOrderJurisdictionAllowed(intent),
    ).resolves.toBeUndefined();
  });

  it("does NOT throw for authorized intent with address_capture_deferred=true", async () => {
    serviceClientReturn = null;

    const intent = makeIntent("authorized", {
      address_capture_deferred: "true",
    });

    await expect(
      assertOrderJurisdictionAllowed(intent),
    ).resolves.toBeUndefined();
  });

  it("STILL throws for paid intent without the deferred marker (B3 unchanged)", async () => {
    serviceClientReturn = null;

    const intent = makeIntent("paid", {
      databaseOrderId: "uuid-but-no-canonical-order-id-or-deferred-flag",
    });

    await expect(assertOrderJurisdictionAllowed(intent)).rejects.toBeInstanceOf(
      JurisdictionalGuardError,
    );
  });

  it("deferred marker must be exactly 'true' (typo or wrong-type does not bypass)", async () => {
    serviceClientReturn = null;

    for (const wrongValue of ["yes", "1", "True", ""]) {
      const intent = makeIntent("paid", {
        address_capture_deferred: wrongValue,
      });
      await expect(
        assertOrderJurisdictionAllowed(intent),
      ).rejects.toBeInstanceOf(JurisdictionalGuardError);
    }
  });
});
