/**
 * Plaid adapter tests. Same shape as BTCPay tests: stub-env guard,
 * signature verification, status mapping, webhook routing.
 *
 * Phase 3.1 (v5) — JWKS default + createIntent real Transfer API impl.
 *
 * Webhook verification branches on PLAID_VERIFICATION_MODE:
 *   - default / 'jwks' → ES256 JWT via verifyPlaidJwt (production)
 *   - 'hmac'           → HMAC-SHA256 via verifyPlaidHmac (legacy/sandbox)
 *
 * createIntent posts to /transfer/create with ACH PPD debit and the
 * supplied idempotency_key. Missing env throws payment_provider_not_configured.
 */
import crypto from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createPlaidAdapter,
  envIsConfigured,
  mapPlaidStatus,
  verifyPlaidHmac,
  verifyPlaidSignature,
  verifyPlaidWebhook,
  type PlaidEnv,
} from "@/lib/payments/plaid";

const STUB_ENV: PlaidEnv = {
  PLAID_CLIENT_ID: "stub_plaid_client_id",
  PLAID_SECRET: "stub_plaid_secret",
  PLAID_ENV: "sandbox",
  PLAID_WEBHOOK_VERIFICATION_KEY: "stub_plaid_webhook_verification_key",
};

const REAL_ENV: PlaidEnv = {
  PLAID_CLIENT_ID: "real_client_id",
  PLAID_SECRET: "real_secret_xyz",
  PLAID_ENV: "sandbox",
  PLAID_WEBHOOK_VERIFICATION_KEY: "real_webhook_key",
};

/** HMAC mode legacy env: used to keep historical HMAC tests deterministic. */
const REAL_ENV_HMAC: PlaidEnv = {
  ...REAL_ENV,
  PLAID_VERIFICATION_MODE: "hmac",
};

function sign(body: string, key: string): string {
  return (
    "sha256=" + crypto.createHmac("sha256", key).update(body).digest("hex")
  );
}

/* ------------------------------------------------------------------ */
/* ES256 JWT helpers (mirror plaid-jwks.test.ts).                     */
/* ------------------------------------------------------------------ */

function b64url(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf
    .toString("base64")
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function makeES256SignedJwt(opts: {
  privateKey: crypto.KeyObject;
  payload: Record<string, unknown>;
  kid: string;
}): string {
  const header = { alg: "ES256", typ: "JWT", kid: opts.kid };
  const headerB64 = b64url(JSON.stringify(header));
  const payloadB64 = b64url(JSON.stringify(opts.payload));
  const signingInput = `${headerB64}.${payloadB64}`;
  const der = crypto
    .createSign("SHA256")
    .update(signingInput)
    .sign({ key: opts.privateKey, dsaEncoding: "ieee-p1363" });
  return `${signingInput}.${b64url(der)}`;
}

function makeES256KeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ec", {
    namedCurve: "P-256",
  });
  const publicJwk = publicKey.export({ format: "jwk" });
  return { publicJwk, privateKey };
}

describe("Plaid envIsConfigured", () => {
  it("returns false when stub values are set", () => {
    expect(envIsConfigured(STUB_ENV)).toBe(false);
  });

  it("returns true when CLIENT_ID + SECRET are real", () => {
    expect(envIsConfigured(REAL_ENV)).toBe(true);
  });

  it("returns false when client id is missing", () => {
    expect(envIsConfigured({ ...REAL_ENV, PLAID_CLIENT_ID: undefined })).toBe(
      false,
    );
  });
});

describe("mapPlaidStatus", () => {
  it("maps POSTED / SETTLED / COMPLETED → paid", () => {
    expect(mapPlaidStatus("TRANSFER_POSTED")).toBe("paid");
    expect(mapPlaidStatus("TRANSFER_SETTLED")).toBe("paid");
    expect(mapPlaidStatus("TRANSFER_COMPLETED")).toBe("paid");
  });

  it("maps RETURNED / FAILED / CANCELED → failed", () => {
    expect(mapPlaidStatus("TRANSFER_RETURNED")).toBe("failed");
    expect(mapPlaidStatus("TRANSFER_FAILED")).toBe("failed");
    expect(mapPlaidStatus("TRANSFER_CANCELED")).toBe("failed");
    expect(mapPlaidStatus("TRANSFER_CANCELLED")).toBe("failed");
  });

  it("maps AUTH / VERIFIED → authorized", () => {
    expect(mapPlaidStatus("AUTH_AUTOMATICALLY_VERIFIED")).toBe("authorized");
    expect(mapPlaidStatus("AUTH_MANUALLY_VERIFIED")).toBe("authorized");
  });

  it("falls back to pending on unknown", () => {
    expect(mapPlaidStatus("SOMETHING_ELSE")).toBe("pending");
    expect(mapPlaidStatus("")).toBe("pending");
  });
});

describe("verifyPlaidHmac (legacy / sandbox)", () => {
  const key = "real_webhook_key";
  const body = '{"webhook_type":"TRANSFER","webhook_code":"POSTED"}';

  it("accepts a valid signature", () => {
    expect(verifyPlaidHmac(body, sign(body, key), key)).toBe(true);
  });

  it("rejects forged signatures", () => {
    expect(verifyPlaidHmac(body, "sha256=" + "b".repeat(64), key)).toBe(false);
  });

  it("rejects tampered body", () => {
    const sig = sign(body, key);
    expect(verifyPlaidHmac(body + " ", sig, key)).toBe(false);
  });

  it("rejects missing inputs", () => {
    expect(verifyPlaidHmac(body, undefined, key)).toBe(false);
    expect(verifyPlaidHmac(body, sign(body, key), "")).toBe(false);
  });

  it("verifyPlaidSignature is preserved as a backwards-compatible alias", () => {
    expect(verifyPlaidSignature(body, sign(body, key), key)).toBe(true);
    expect(verifyPlaidSignature).toBe(verifyPlaidHmac);
  });
});

describe("verifyPlaidWebhook — verification-mode branching", () => {
  it("defaults to JWKS when PLAID_VERIFICATION_MODE is unset", async () => {
    // Default path: missing JWT header → unverified, reason cites JWT.
    const result = await verifyPlaidWebhook("body", {}, {});
    expect(result.verified).toBe(false);
    expect(result.reason).toMatch(/missing_plaid_verification_header|missing/i);
  });

  it("uses JWKS when PLAID_VERIFICATION_MODE='jwks' explicitly", async () => {
    const env = { PLAID_VERIFICATION_MODE: "jwks" } as PlaidEnv;
    const result = await verifyPlaidWebhook("body", {}, env);
    expect(result.verified).toBe(false);
    expect(result.reason).toMatch(/missing_plaid_verification_header|missing/i);
  });

  it("verifies a real ES256-signed JWT via JWKS branch", async () => {
    const { publicJwk, privateKey } = makeES256KeyPair();
    const rawBody = '{"webhook_type":"TRANSFER","webhook_code":"POSTED"}';
    const bodyHash = crypto.createHash("sha256").update(rawBody).digest("hex");
    const jwt = makeES256SignedJwt({
      privateKey,
      payload: {
        request_body_sha256: bodyHash,
        iat: Math.floor(Date.now() / 1000),
      },
      kid: "phase-3-1-test-kid",
    });

    const env = {
      PLAID_VERIFICATION_MODE: "jwks",
      PLAID_JWKS_KEYS: JSON.stringify({
        "phase-3-1-test-kid": {
          kty: publicJwk.kty,
          crv: publicJwk.crv,
          x: publicJwk.x,
          y: publicJwk.y,
          alg: "ES256",
        },
      }),
    } as PlaidEnv;

    const result = await verifyPlaidWebhook(
      rawBody,
      { "plaid-verification": jwt },
      env,
    );
    expect(result.verified).toBe(true);
  });

  it("uses HMAC when PLAID_VERIFICATION_MODE='hmac'", async () => {
    const key = "hmac_key";
    const env = {
      PLAID_VERIFICATION_MODE: "hmac",
      PLAID_WEBHOOK_VERIFICATION_KEY: key,
    } as PlaidEnv;
    const body = "{}";
    const ok = await verifyPlaidWebhook(
      body,
      { "plaid-verification": sign(body, key) },
      env,
    );
    expect(ok.verified).toBe(true);

    const bad = await verifyPlaidWebhook(
      body,
      { "plaid-verification": "sha256=deadbeef" },
      env,
    );
    expect(bad.verified).toBe(false);
  });

  it("throws clear error for unknown verification mode", async () => {
    const env = { PLAID_VERIFICATION_MODE: "garbage" } as PlaidEnv;
    await expect(verifyPlaidWebhook("body", {}, env)).rejects.toThrow(
      /PLAID_VERIFICATION_MODE|verification.?mode/i,
    );
  });
});

describe("createPlaidAdapter — stub env guards", () => {
  it("throws on createIntent when env is stubbed", async () => {
    const adapter = createPlaidAdapter({ env: STUB_ENV });
    await expect(
      adapter.createIntent({
        amountCents: 5400,
        method: "ach",
        orderId: "order_x",
        customerEmail: "r@example.com",
      }),
    ).rejects.toThrow(/payment_provider_not_configured|plaid_not_configured/);
  });

  it("returns null on getIntent with stub env", async () => {
    const adapter = createPlaidAdapter({ env: STUB_ENV });
    expect(await adapter.getIntent("any")).toBeNull();
  });
});

describe("createPlaidAdapter — createIntent real Transfer API impl", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const url = typeof input === "string" ? input : input.toString();
      const method =
        init?.method ??
        (typeof input === "object" ? (input as Request).method : "GET");
      if (url.endsWith("/transfer/create") && method === "POST") {
        return new Response(
          JSON.stringify({
            transfer: {
              id: "transfer-abc-123",
              status: "pending",
              amount: "54.00",
              iso_currency_code: "USD",
            },
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      }
      return new Response("not found", { status: 404 });
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("posts to /transfer/create and returns a Plaid PaymentIntent", async () => {
    const adapter = createPlaidAdapter({ env: REAL_ENV });
    const intent = await adapter.createIntent({
      amountCents: 5400,
      method: "ach",
      orderId: "VC-ACH-1",
      customerEmail: "r@example.com",
      metadata: {
        access_token: "access-sandbox-xxx",
        account_id: "acct_1",
        idempotency_key: "VC-ACH-1-key",
      },
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    const call = (
      globalThis.fetch as unknown as { mock: { calls: unknown[][] } }
    ).mock.calls[0];
    const url = call[0] as string;
    const init = call[1] as RequestInit;

    expect(url).toMatch(/\.plaid\.com\/transfer\/create$/);
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe(
      "application/json",
    );
    const body = JSON.parse(init.body as string);
    expect(body.client_id).toBe("real_client_id");
    expect(body.secret).toBe("real_secret_xyz");
    expect(body.access_token).toBe("access-sandbox-xxx");
    expect(body.account_id).toBe("acct_1");
    expect(body.amount).toBe("54.00");
    expect(body.iso_currency_code).toBe("USD");
    expect(body.ach_class).toBe("ppd");
    expect(body.type).toBe("debit");
    expect(body.network).toBe("ach");
    // idempotency_key must be forwarded (input.metadata.idempotency_key or input.orderId)
    expect(typeof body.idempotency_key).toBe("string");
    expect(body.idempotency_key.length).toBeGreaterThan(0);

    expect(intent.provider).toBe("plaid");
    expect(intent.method).toBe("ach");
    expect(intent.amountCents).toBe(5400);
    expect(intent.currency).toBe("USD");
    expect(intent.externalId).toBe("transfer-abc-123");
    expect(intent.status).toBe("pending");
  });

  it("uses sandbox base URL when PLAID_ENV=sandbox", async () => {
    const adapter = createPlaidAdapter({
      env: { ...REAL_ENV, PLAID_ENV: "sandbox" },
    });
    await adapter.createIntent({
      amountCents: 100,
      method: "ach",
      orderId: "VC-ACH-2",
      customerEmail: "r@example.com",
      metadata: {
        access_token: "access-sandbox-xxx",
        account_id: "acct_1",
      },
    });
    const call = (
      globalThis.fetch as unknown as { mock: { calls: unknown[][] } }
    ).mock.calls.at(-1);
    expect(call?.[0]).toBe("https://sandbox.plaid.com/transfer/create");
  });

  it("uses production base URL when PLAID_ENV=production", async () => {
    const adapter = createPlaidAdapter({
      env: { ...REAL_ENV, PLAID_ENV: "production" },
    });
    await adapter.createIntent({
      amountCents: 100,
      method: "ach",
      orderId: "VC-ACH-3",
      customerEmail: "r@example.com",
      metadata: {
        access_token: "access-prod-xxx",
        account_id: "acct_1",
      },
    });
    const call = (
      globalThis.fetch as unknown as { mock: { calls: unknown[][] } }
    ).mock.calls.at(-1);
    expect(call?.[0]).toBe("https://production.plaid.com/transfer/create");
  });

  it("respects an explicit idempotency_key from metadata", async () => {
    const adapter = createPlaidAdapter({ env: REAL_ENV });
    await adapter.createIntent({
      amountCents: 100,
      method: "ach",
      orderId: "VC-ACH-4",
      customerEmail: "r@example.com",
      metadata: {
        access_token: "tok",
        account_id: "acct_1",
        idempotency_key: "EXPLICIT-IDEMPOTENCY-KEY",
      },
    });
    const call = (
      globalThis.fetch as unknown as { mock: { calls: unknown[][] } }
    ).mock.calls.at(-1);
    const body = JSON.parse((call?.[1] as RequestInit).body as string);
    expect(body.idempotency_key).toBe("EXPLICIT-IDEMPOTENCY-KEY");
  });

  it("falls back to orderId for idempotency_key when not provided", async () => {
    const adapter = createPlaidAdapter({ env: REAL_ENV });
    await adapter.createIntent({
      amountCents: 100,
      method: "ach",
      orderId: "VC-ACH-5",
      customerEmail: "r@example.com",
      metadata: {
        access_token: "tok",
        account_id: "acct_1",
      },
    });
    const call = (
      globalThis.fetch as unknown as { mock: { calls: unknown[][] } }
    ).mock.calls.at(-1);
    const body = JSON.parse((call?.[1] as RequestInit).body as string);
    expect(body.idempotency_key).toBe("VC-ACH-5");
  });

  it("throws payment_provider_not_configured when PLAID_CLIENT_ID is missing", async () => {
    const adapter = createPlaidAdapter({
      env: { ...REAL_ENV, PLAID_CLIENT_ID: undefined },
    });
    await expect(
      adapter.createIntent({
        amountCents: 100,
        method: "ach",
        orderId: "VC-ACH-6",
        customerEmail: "r@example.com",
        metadata: { access_token: "tok", account_id: "acct_1" },
      }),
    ).rejects.toThrow(/payment_provider_not_configured/);
  });

  it("throws payment_provider_not_configured when PLAID_SECRET is a stub", async () => {
    const adapter = createPlaidAdapter({
      env: { ...REAL_ENV, PLAID_SECRET: "stub_plaid_secret" },
    });
    await expect(
      adapter.createIntent({
        amountCents: 100,
        method: "ach",
        orderId: "VC-ACH-7",
        customerEmail: "r@example.com",
        metadata: { access_token: "tok", account_id: "acct_1" },
      }),
    ).rejects.toThrow(/payment_provider_not_configured/);
  });

  it("throws when Plaid Transfer API returns 4xx", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
      return new Response("Bad Request: invalid access_token", { status: 400 });
    });
    const adapter = createPlaidAdapter({ env: REAL_ENV });
    await expect(
      adapter.createIntent({
        amountCents: 100,
        method: "ach",
        orderId: "VC-ACH-8",
        customerEmail: "r@example.com",
        metadata: { access_token: "bad", account_id: "acct_1" },
      }),
    ).rejects.toThrow(/plaid_transfer_create_failed/);
  });

  it("throws when Plaid Transfer API returns 5xx", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
      return new Response("Server Error", { status: 500 });
    });
    const adapter = createPlaidAdapter({ env: REAL_ENV });
    await expect(
      adapter.createIntent({
        amountCents: 100,
        method: "ach",
        orderId: "VC-ACH-9",
        customerEmail: "r@example.com",
        metadata: { access_token: "tok", account_id: "acct_1" },
      }),
    ).rejects.toThrow(/plaid_transfer_create_failed/);
  });
});

describe("createPlaidAdapter — handleWebhook (HMAC legacy path)", () => {
  const key = "real_webhook_key";
  const env: PlaidEnv = {
    ...REAL_ENV_HMAC,
    PLAID_WEBHOOK_VERIFICATION_KEY: key,
  };

  it("rejects unverified payloads", async () => {
    const adapter = createPlaidAdapter({ env });
    const body = '{"webhook_type":"TRANSFER","webhook_code":"POSTED"}';
    const result = await adapter.handleWebhook(body, {});
    expect(result.verified).toBe(false);
    expect(result.intent).toBeNull();
  });

  it("verifies and maps a posted transfer to paid", async () => {
    const adapter = createPlaidAdapter({ env });
    const body = JSON.stringify({
      webhook_type: "TRANSFER",
      webhook_code: "POSTED",
      transfer_id: "tr_42",
      metadata: { intentId: "pi_77" },
    });
    const result = await adapter.handleWebhook(body, {
      "plaid-verification": sign(body, key),
    });
    expect(result.verified).toBe(true);
    expect(result.eventType).toBe("TRANSFER:POSTED");
    expect(result.intent?.status).toBe("paid");
    expect(result.intent?.id).toBe("pi_77");
    expect(result.intent?.provider).toBe("plaid");
    expect(result.intent?.method).toBe("ach");
    expect(result.intent?.externalId).toBe("tr_42");
  });

  it("falls back to transfer_id when metadata.intentId is missing", async () => {
    const adapter = createPlaidAdapter({ env });
    const body = JSON.stringify({
      webhook_type: "TRANSFER",
      webhook_code: "POSTED",
      transfer_id: "tr_99",
    });
    const result = await adapter.handleWebhook(body, {
      "plaid-verification": sign(body, key),
    });
    expect(result.verified).toBe(true);
    expect(result.intent?.id).toBe("tr_99");
  });

  it("AUTH webhook → authorized status", async () => {
    const adapter = createPlaidAdapter({ env });
    const body = JSON.stringify({
      webhook_type: "AUTH",
      webhook_code: "AUTOMATICALLY_VERIFIED",
      item_id: "item_42",
      metadata: { intentId: "pi_5" },
    });
    const result = await adapter.handleWebhook(body, {
      "plaid-verification": sign(body, key),
    });
    expect(result.verified).toBe(true);
    expect(result.intent?.status).toBe("authorized");
  });
});

describe("createPlaidAdapter — handleWebhook (JWKS production path)", () => {
  it("verifies a real ES256-signed JWT end-to-end and parses the intent", async () => {
    const { publicJwk, privateKey } = makeES256KeyPair();
    const rawBody = JSON.stringify({
      webhook_type: "TRANSFER",
      webhook_code: "POSTED",
      transfer_id: "tr_jwt_1",
      metadata: { intentId: "pi_jwt_1" },
    });
    const bodyHash = crypto.createHash("sha256").update(rawBody).digest("hex");
    const jwt = makeES256SignedJwt({
      privateKey,
      payload: {
        request_body_sha256: bodyHash,
        iat: Math.floor(Date.now() / 1000),
      },
      kid: "kid-prod-1",
    });

    const env: PlaidEnv = {
      ...REAL_ENV,
      PLAID_VERIFICATION_MODE: "jwks",
      PLAID_JWKS_KEYS: JSON.stringify({
        "kid-prod-1": {
          kty: publicJwk.kty,
          crv: publicJwk.crv,
          x: publicJwk.x,
          y: publicJwk.y,
          alg: "ES256",
        },
      }),
    };

    const adapter = createPlaidAdapter({ env });
    const result = await adapter.handleWebhook(rawBody, {
      "plaid-verification": jwt,
    });
    expect(result.verified).toBe(true);
    expect(result.intent?.id).toBe("pi_jwt_1");
    expect(result.intent?.status).toBe("paid");
    expect(result.intent?.provider).toBe("plaid");
  });

  it("rejects when JWKS header is missing", async () => {
    const env: PlaidEnv = { ...REAL_ENV, PLAID_VERIFICATION_MODE: "jwks" };
    const adapter = createPlaidAdapter({ env });
    const result = await adapter.handleWebhook("{}", {});
    expect(result.verified).toBe(false);
    expect(result.intent).toBeNull();
  });

  it("rejects when JWT signature is invalid", async () => {
    const { publicJwk, privateKey } = makeES256KeyPair();
    const rawBody = '{"webhook_type":"TRANSFER","webhook_code":"POSTED"}';
    const bodyHash = crypto.createHash("sha256").update(rawBody).digest("hex");
    const jwt = makeES256SignedJwt({
      privateKey,
      payload: {
        request_body_sha256: bodyHash,
        iat: Math.floor(Date.now() / 1000),
      },
      kid: "kid-tamper",
    });
    const parts = jwt.split(".");
    const tampered = `${parts[0]}.${parts[1]}.AAAA${parts[2].slice(4)}`;

    const env: PlaidEnv = {
      ...REAL_ENV,
      PLAID_VERIFICATION_MODE: "jwks",
      PLAID_JWKS_KEYS: JSON.stringify({
        "kid-tamper": {
          kty: publicJwk.kty,
          crv: publicJwk.crv,
          x: publicJwk.x,
          y: publicJwk.y,
          alg: "ES256",
        },
      }),
    };
    const adapter = createPlaidAdapter({ env });
    const result = await adapter.handleWebhook(rawBody, {
      "plaid-verification": tampered,
    });
    expect(result.verified).toBe(false);
    expect(result.intent).toBeNull();
  });
});
