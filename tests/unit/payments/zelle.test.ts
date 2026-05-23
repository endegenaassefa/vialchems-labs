import { describe, expect, it } from "vitest";
import {
  createZelleAdapter,
  envIsConfigured,
  type ZelleEnv,
} from "@/lib/payments/zelle";

const READY_ENV: ZelleEnv = {
  ZELLE_RECIPIENT_NAME: "Vialchem Labs LLC",
  ZELLE_HANDLE: "vialchem-pay",
  ZELLE_EMAIL: "support@vialchemlabs.net",
  ZELLE_PAYMENT_NOTE_PREFIX: "VCL",
};

describe("Zelle envIsConfigured", () => {
  it("is configured with the production bank-recipient defaults", () => {
    expect(envIsConfigured({})).toBe(true);
  });

  it("accepts recipient, handle, and payment note prefix overrides", () => {
    expect(envIsConfigured(READY_ENV)).toBe(true);
  });
});

describe("createZelleAdapter", () => {
  it("exposes the zelle provider id", () => {
    expect(createZelleAdapter({ env: READY_ENV }).id).toBe("zelle");
  });

  it("creates a pending manual-payment intent with the default Zelle ID", async () => {
    const adapter = createZelleAdapter({ env: {} });
    const intent = await adapter.createIntent({
      amountCents: 100,
      method: "zelle",
      orderId: "VC-260515-ABCDEF12",
      customerEmail: "checkout@vialchemlabs.net",
    });

    expect(intent.metadata.zelleRecipientName).toBe("Vialchem Labs LLC");
    expect(intent.metadata.zelleHandle).toBe("vialchem-pay");
    expect(intent.metadata.zelleSupportEmail).toBe("support@vialchemlabs.net");
  });

  it("creates a pending manual-payment intent with memo instructions", async () => {
    const adapter = createZelleAdapter({
      env: READY_ENV,
      now: () => new Date("2026-05-15T12:00:00.000Z"),
    });

    const intent = await adapter.createIntent({
      amountCents: 6900,
      method: "zelle",
      orderId: "VC-260515-ABCDEF12",
      customerEmail: "checkout@vialchemlabs.net",
    });

    expect(intent).toMatchObject({
      id: "zelle_VC-260515-ABCDEF12",
      provider: "zelle",
      method: "zelle",
      amountCents: 6900,
      currency: "USD",
      status: "pending",
      externalId: "VC-260515-ABCDEF12",
    });
    expect(intent.metadata.zelleMemo).toBe("VCL-VC-260515-ABCDEF12");
    expect(intent.metadata.zelleHandle).toBe("vialchem-pay");
    expect(intent.metadata.zelleEmail).toBe("support@vialchemlabs.net");
    expect(intent.metadata.instructions).toContain("VCL-VC-260515-ABCDEF12");
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
