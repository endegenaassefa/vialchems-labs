import { describe, expect, it } from "vitest";
import {
  createZelleAdapter,
  envIsConfigured,
  type ZelleEnv,
} from "@/lib/payments/zelle";

const DISABLED_ENV: ZelleEnv = {
  ENABLE_ZELLE: "false",
  ZELLE_BUSINESS_NAME: "vialchemlabs LLC",
  ZELLE_HANDLE: "payments@example.com",
  ZELLE_BANK_NAME: "Example Bank",
  ZELLE_TERMS_APPROVED_AT: "2026-05-12T00:00:00.000Z",
};

const READY_ENV: ZelleEnv = {
  ...DISABLED_ENV,
  ENABLE_ZELLE: "true",
};

describe("Zelle envIsConfigured", () => {
  it("requires the rail to be explicitly enabled", () => {
    expect(envIsConfigured(DISABLED_ENV)).toBe(false);
  });

  it("requires business identity, handle, bank name, and approval timestamp", () => {
    expect(envIsConfigured(READY_ENV)).toBe(true);
    expect(envIsConfigured({ ...READY_ENV, ZELLE_HANDLE: "" })).toBe(false);
    expect(
      envIsConfigured({ ...READY_ENV, ZELLE_TERMS_APPROVED_AT: undefined }),
    ).toBe(false);
  });
});

describe("createZelleAdapter", () => {
  it("exposes the zelle provider id", () => {
    expect(createZelleAdapter({ env: READY_ENV }).id).toBe("zelle");
  });

  it("refuses to create intents until bank/legal approval is configured", async () => {
    const adapter = createZelleAdapter({ env: DISABLED_ENV });
    await expect(
      adapter.createIntent({
        amountCents: 5400,
        method: "zelle",
        orderId: "VC-ABCD1234",
        customerEmail: "researcher@example.com",
      }),
    ).rejects.toThrow(/zelle_not_configured/);
  });

  it("creates a pending manual-payment intent with order memo instructions", async () => {
    const adapter = createZelleAdapter({
      env: READY_ENV,
      now: () => new Date("2026-05-12T12:00:00.000Z"),
    });

    const intent = await adapter.createIntent({
      amountCents: 5400,
      method: "zelle",
      orderId: "VC-ABCD1234",
      customerEmail: "researcher@example.com",
    });

    expect(intent).toMatchObject({
      id: "zelle_VC-ABCD1234",
      provider: "zelle",
      method: "zelle",
      amountCents: 5400,
      currency: "USD",
      status: "pending",
      externalId: "VC-ABCD1234",
    });
    expect(intent.metadata.zelleMemo).toBe("VC-ABCD1234");
    expect(intent.metadata.zelleHandle).toBe("payments@example.com");
    expect(intent.metadata.instructions).toContain("VC-ABCD1234");
    expect(intent.redirectUrl).toBeUndefined();
  });

  it("does not accept webhooks because staff must manually verify receipt", async () => {
    const adapter = createZelleAdapter({ env: READY_ENV });
    const result = await adapter.handleWebhook({}, {});
    expect(result).toEqual({
      intent: null,
      eventType: "manual_verification_required",
      verified: false,
    });
  });
});
