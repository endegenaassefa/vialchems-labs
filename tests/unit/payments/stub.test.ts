/**
 * Stub payment adapter tests. Verifies the deterministic mock behavior used
 * for local dev and unit/integration suites.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createStubAdapter } from "@/lib/payments/stub";
import type { CreateIntentInput } from "@/lib/payments/types";

const FIXED_NOW = new Date("2026-01-01T00:00:00.000Z");
const baseInput: CreateIntentInput = {
  amountCents: 4590,
  method: "crypto",
  orderId: "order_001",
  customerEmail: "researcher@example.com",
};

describe("createStubAdapter", () => {
  let counter = 0;
  let adapter = createStubAdapter({
    now: () => FIXED_NOW,
    randomId: () => `stub_${++counter}`,
    autoConfirm: false,
  });

  beforeEach(() => {
    counter = 0;
    adapter = createStubAdapter({
      now: () => FIXED_NOW,
      randomId: () => `stub_${++counter}`,
      autoConfirm: false,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("exposes the stub id", () => {
    expect(adapter.id).toBe("stub");
  });

  it("creates an intent in pending state", async () => {
    const intent = await adapter.createIntent(baseInput);
    expect(intent.id).toBe("stub_1");
    expect(intent.provider).toBe("stub");
    expect(intent.method).toBe("crypto");
    expect(intent.amountCents).toBe(4590);
    expect(intent.currency).toBe("USD");
    expect(intent.status).toBe("pending");
    expect(intent.createdAt).toBe(FIXED_NOW.toISOString());
    expect(intent.updatedAt).toBe(FIXED_NOW.toISOString());
    expect(intent.redirectUrl).toBe("/order/stub/stub_1");
  });

  it("preserves metadata orderId + customerEmail", async () => {
    const intent = await adapter.createIntent(baseInput);
    expect(intent.metadata.orderId).toBe("order_001");
    expect(intent.metadata.customerEmail).toBe("researcher@example.com");
  });

  it("merges caller metadata over defaults", async () => {
    const intent = await adapter.createIntent({
      ...baseInput,
      metadata: { source: "checkout-test" },
    });
    expect(intent.metadata.source).toBe("checkout-test");
    expect(intent.metadata.orderId).toBe("order_001");
  });

  it("getIntent returns the stored intent", async () => {
    const created = await adapter.createIntent(baseInput);
    const fetched = await adapter.getIntent(created.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.id).toBe(created.id);
  });

  it("getIntent returns null for unknown id", async () => {
    expect(await adapter.getIntent("nonexistent")).toBeNull();
  });

  it("markPaid moves a pending intent to paid", async () => {
    const intent = await adapter.createIntent(baseInput);
    const updated = adapter.markPaid(intent.id);
    expect(updated?.status).toBe("paid");
    const fetched = await adapter.getIntent(intent.id);
    expect(fetched?.status).toBe("paid");
  });

  it("markPaid is idempotent on already-paid intents", async () => {
    const intent = await adapter.createIntent(baseInput);
    adapter.markPaid(intent.id);
    const second = adapter.markPaid(intent.id);
    expect(second?.status).toBe("paid");
  });

  it("markPaid returns null for unknown id", () => {
    expect(adapter.markPaid("nonexistent")).toBeNull();
  });

  it("handleWebhook returns a no-op result (stub has no webhooks)", async () => {
    const result = await adapter.handleWebhook({}, {});
    expect(result.verified).toBe(false);
    expect(result.eventType).toBe("noop");
    expect(result.intent).toBeNull();
  });

  it("reset clears all stored intents", async () => {
    const created = await adapter.createIntent(baseInput);
    adapter.reset();
    expect(await adapter.getIntent(created.id)).toBeNull();
  });

  it("does not auto-confirm when autoConfirm: false", async () => {
    const intent = await adapter.createIntent(baseInput);
    // Without ticking timers, status remains pending.
    expect(intent.status).toBe("pending");
    expect((await adapter.getIntent(intent.id))?.status).toBe("pending");
  });

  it("refuses to create production intents unless explicitly allowed", async () => {
    vi.stubEnv("NODE_ENV", "production");
    await expect(adapter.createIntent(baseInput)).rejects.toThrow(
      /stub_payments_forbidden/,
    );

    vi.stubEnv("ALLOW_STUB_PAYMENTS_IN_PRODUCTION", "true");
    await expect(adapter.createIntent(baseInput)).resolves.toMatchObject({
      provider: "stub",
    });
  });
});
