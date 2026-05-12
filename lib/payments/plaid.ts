/**
 * Plaid ACH payment adapter.
 *
 * Day-1 ACH rail. 5% discount, 3-4 day clearance. Plaid Link mints a public
 * token in the browser; the server exchanges it for a permanent access token
 * and creates a Transfer.
 *
 * Webhook verification: per spec, HMAC-SHA256 over the raw body using
 * PLAID_WEBHOOK_VERIFICATION_KEY, sent in `Plaid-Verification` header as
 * `sha256=<hex>`. Plaid's production scheme is JWT-based; this scaffold
 * uses HMAC for parity with BTCPay until ops wires JWKS in Phase 10.
 *
 * Plaid event mapping:
 *   AUTH (item-ready / numbers ready)        → authorized
 *   TRANSFER posted / settled / completed    → paid
 *   TRANSFER returned / failed / canceled    → failed
 */
import crypto from "node:crypto";
import type {
  CreateIntentInput,
  PaymentIntent,
  PaymentProvider,
  PaymentStatus,
  WebhookResult,
} from "./types";

const STUB_VALUES = new Set([
  "",
  "stub_plaid_client_id",
  "stub_plaid_secret",
  "stub_plaid_webhook_verification_key",
]);

function isStub(value: string | undefined): boolean {
  if (value === undefined) return true;
  return STUB_VALUES.has(value);
}

export interface PlaidEnv {
  PLAID_CLIENT_ID?: string;
  PLAID_SECRET?: string;
  PLAID_ENV?: string;
  PLAID_WEBHOOK_VERIFICATION_KEY?: string;
}

export interface PlaidAdapterOptions {
  env?: PlaidEnv;
}

export function envIsConfigured(env: PlaidEnv): boolean {
  return !isStub(env.PLAID_CLIENT_ID) && !isStub(env.PLAID_SECRET);
}

/**
 * Maps a Plaid event/code string to local PaymentIntent status.
 *
 * Conservative — anything we don't recognize stays 'pending'. Plaid uses
 * separate `webhook_type` (AUTH / TRANSFER) and `webhook_code` (e.g.
 * AUTOMATICALLY_VERIFIED, POSTED, RETURNED) fields; this normaliser accepts
 * either a code or a colon-joined tuple.
 */
export function mapPlaidStatus(eventCode: string): PaymentStatus {
  const normalized = eventCode.toUpperCase();
  if (
    normalized.includes("POSTED") ||
    normalized.includes("SETTLED") ||
    normalized.includes("COMPLETED") ||
    normalized.includes("SUCCESS")
  ) {
    return "paid";
  }
  if (
    normalized.includes("RETURNED") ||
    normalized.includes("FAILED") ||
    normalized.includes("CANCELED") ||
    normalized.includes("CANCELLED") ||
    normalized.includes("REJECTED")
  ) {
    return "failed";
  }
  if (
    normalized.includes("AUTH") ||
    normalized.includes("VERIFIED") ||
    normalized.includes("READY") ||
    normalized.includes("PENDING_ADMIN_APPROVAL")
  ) {
    return "authorized";
  }
  return "pending";
}

export function verifyPlaidSignature(
  rawBody: string,
  signatureHeader: string | undefined,
  key: string,
): boolean {
  if (!signatureHeader || !key) return false;
  const provided = signatureHeader.startsWith("sha256=")
    ? signatureHeader.slice("sha256=".length)
    : signatureHeader;
  const expected = crypto
    .createHmac("sha256", key)
    .update(rawBody)
    .digest("hex");
  if (provided.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(provided, "hex"),
      Buffer.from(expected, "hex"),
    );
  } catch {
    return false;
  }
}

interface PlaidWebhookPayload {
  webhook_type?: string;
  webhook_code?: string;
  transfer_id?: string;
  item_id?: string;
  metadata?: Record<string, string>;
}

export function createPlaidAdapter(
  options: PlaidAdapterOptions = {},
): PaymentProvider {
  const env: PlaidEnv = options.env ?? {
    PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
    PLAID_SECRET: process.env.PLAID_SECRET,
    PLAID_ENV: process.env.PLAID_ENV,
    PLAID_WEBHOOK_VERIFICATION_KEY: process.env.PLAID_WEBHOOK_VERIFICATION_KEY,
  };

  return {
    id: "plaid",

    async createIntent(input: CreateIntentInput): Promise<PaymentIntent> {
      void input; // Phase 10 wires Plaid Link + Transfer; signature pinned by PaymentProvider.
      if (!envIsConfigured(env)) {
        throw new Error(
          "plaid_not_configured: PLAID_CLIENT_ID and PLAID_SECRET must be set to non-stub values.",
        );
      }
      // Phase 9 scaffold: real Plaid Link token + Transfer flow lands when
      // ops wires the dashboard credentials.
      throw new Error(
        "plaid_create_intent_not_implemented: scaffolded for Phase 10 wiring.",
      );
    },

    async getIntent(intentId: string): Promise<PaymentIntent | null> {
      void intentId; // Phase 10 wires /transfer/get; signature pinned by PaymentProvider.
      if (!envIsConfigured(env)) return null;
      // Phase 10: GET /transfer/get with the stored transfer_id.
      return null;
    },

    async handleWebhook(
      payload: unknown,
      headers: Record<string, string>,
    ): Promise<WebhookResult> {
      const key = env.PLAID_WEBHOOK_VERIFICATION_KEY ?? "";
      const rawBody =
        typeof payload === "string" ? payload : JSON.stringify(payload ?? {});
      const sigHeader =
        headers["plaid-verification"] ??
        headers["Plaid-Verification"] ??
        headers["x-plaid-signature"];

      const verified = verifyPlaidSignature(rawBody, sigHeader, key);
      if (!verified) {
        return { intent: null, eventType: "unverified", verified: false };
      }

      let parsed: PlaidWebhookPayload;
      try {
        parsed =
          typeof payload === "string"
            ? (JSON.parse(payload) as PlaidWebhookPayload)
            : ((payload ?? {}) as PlaidWebhookPayload);
      } catch {
        return { intent: null, eventType: "invalid_payload", verified: true };
      }

      const code = parsed.webhook_code ?? "";
      const type = parsed.webhook_type ?? "";
      const eventType = type ? `${type}:${code}` : code || "unknown";
      const status = mapPlaidStatus(`${type}_${code}`);
      const intentId =
        parsed.metadata?.intentId ?? parsed.transfer_id ?? parsed.item_id ?? "";

      if (!intentId) {
        return { intent: null, eventType, verified: true };
      }

      const ts = new Date().toISOString();
      const intent: PaymentIntent = {
        id: intentId,
        provider: "plaid",
        method: "ach",
        amountCents: 0, // populated by reconciliation against the order row
        currency: "USD",
        status,
        metadata: parsed.metadata ?? {},
        createdAt: ts,
        updatedAt: ts,
        externalId: parsed.transfer_id ?? parsed.item_id,
      };

      return { intent, eventType, verified: true };
    },
  };
}
