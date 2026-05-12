/**
 * BTCPay Server payment adapter.
 *
 * Self-hosted BTCPay (BTC + LTC). Day-1 discount: top of 10-15% band (15%).
 * Webhook signature verification is HMAC-SHA256 over the raw body using
 * BTCPAY_WEBHOOK_SECRET, sent in the `BTCPay-Sig` header as `sha256=<hex>`.
 *
 * BTCPay invoice statuses (https://docs.btcpayserver.org/API/Greenfield/v1/):
 *   New / Processing / Settled / Invalid / Expired / PaidPartial
 * Greenfield event types:
 *   InvoiceCreated, InvoiceReceivedPayment, InvoiceProcessing,
 *   InvoiceSettled, InvoiceExpired, InvoiceInvalid.
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
  "stub_btcpay_api_key",
  "stub_store_id",
  "stub_btcpay_webhook_secret",
  "https://stub-btcpay.example.com",
]);

function isStub(value: string | undefined): boolean {
  if (value === undefined) return true;
  return STUB_VALUES.has(value);
}

export interface BtcpayEnv {
  BTCPAY_URL?: string;
  BTCPAY_API_KEY?: string;
  BTCPAY_STORE_ID?: string;
  BTCPAY_WEBHOOK_SECRET?: string;
}

export interface BtcpayAdapterOptions {
  env?: BtcpayEnv;
}

export function envIsConfigured(env: BtcpayEnv): boolean {
  return (
    !isStub(env.BTCPAY_URL) &&
    !isStub(env.BTCPAY_API_KEY) &&
    !isStub(env.BTCPAY_STORE_ID) &&
    !isStub(env.BTCPAY_WEBHOOK_SECRET)
  );
}

/**
 * Maps a BTCPay invoice status string to the local PaymentIntent status.
 * Conservative: anything we don't recognize stays 'pending'.
 */
export function mapBtcpayStatus(s: string): PaymentStatus {
  switch (s) {
    case "New":
    case "PaidPartial":
    case "InvoiceCreated":
    case "InvoiceReceivedPayment":
      return "pending";
    case "Processing":
    case "InvoiceProcessing":
      return "authorized";
    case "Settled":
    case "Paid":
    case "Confirmed":
    case "InvoiceSettled":
      return "paid";
    case "Expired":
    case "Invalid":
    case "InvoiceExpired":
    case "InvoiceInvalid":
      return "failed";
    default:
      return "pending";
  }
}

/**
 * Verifies a BTCPay webhook signature. The header carries `sha256=<hex>` per
 * BTCPay docs. Constant-time comparison via crypto.timingSafeEqual.
 */
export function verifyBtcpaySignature(
  rawBody: string,
  signatureHeader: string | undefined,
  secret: string,
): boolean {
  if (!signatureHeader || !secret) return false;
  const provided = signatureHeader.startsWith("sha256=")
    ? signatureHeader.slice("sha256=".length)
    : signatureHeader;
  const expected = crypto
    .createHmac("sha256", secret)
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

interface BtcpayWebhookPayload {
  type?: string;
  invoiceId?: string;
  status?: string;
  metadata?: Record<string, string>;
}

export function createBtcpayAdapter(
  options: BtcpayAdapterOptions = {},
): PaymentProvider {
  const env: BtcpayEnv = options.env ?? {
    BTCPAY_URL: process.env.BTCPAY_URL,
    BTCPAY_API_KEY: process.env.BTCPAY_API_KEY,
    BTCPAY_STORE_ID: process.env.BTCPAY_STORE_ID,
    BTCPAY_WEBHOOK_SECRET: process.env.BTCPAY_WEBHOOK_SECRET,
  };

  return {
    id: "btcpay",

    async createIntent(input: CreateIntentInput): Promise<PaymentIntent> {
      if (!envIsConfigured(env)) {
        throw new Error(
          "btcpay_not_configured: BTCPAY_URL, BTCPAY_API_KEY, BTCPAY_STORE_ID, and BTCPAY_WEBHOOK_SECRET must all be set to non-stub values.",
        );
      }

      // Phase 10.5 (v4) / D10: real Greenfield invoice POST.
      const url = `${env.BTCPAY_URL!.replace(/\/$/, "")}/api/v1/stores/${env.BTCPAY_STORE_ID}/invoices`;
      const amount = (input.amountCents / 100).toFixed(2);
      const ts = new Date().toISOString();
      const body = JSON.stringify({
        amount,
        currency: "USD",
        metadata: {
          intentId: input.orderId,
          orderId: input.orderId,
          customerEmail: input.customerEmail,
          ...(input.metadata ?? {}),
        },
        checkout: {
          speedPolicy: "MediumSpeed",
          paymentMethods: ["BTC", "LTC"],
          redirectURL: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/checkout/confirm`,
        },
      });

      let res: Response;
      try {
        res = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `token ${env.BTCPAY_API_KEY}`,
            "Content-Type": "application/json",
          },
          body,
        });
      } catch (err) {
        throw new Error(
          `btcpay_invoice_create_failed: network error ${(err as Error).message}`,
        );
      }
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          `btcpay_invoice_create_failed: HTTP ${res.status} ${text.slice(0, 256)}`,
        );
      }
      const json = (await res.json()) as {
        id: string;
        status?: string;
        checkoutLink?: string;
      };

      const intent: PaymentIntent = {
        id: json.id,
        provider: "btcpay",
        method: "crypto",
        amountCents: input.amountCents,
        currency: "USD",
        status: mapBtcpayStatus(json.status ?? "New"),
        metadata: {
          ...(input.metadata ?? {}),
          ...(json.checkoutLink ? { checkoutLink: json.checkoutLink } : {}),
        },
        createdAt: ts,
        updatedAt: ts,
        externalId: json.id,
        redirectUrl: json.checkoutLink,
      };
      return intent;
    },

    async getIntent(intentId: string): Promise<PaymentIntent | null> {
      void intentId; // Phase 10 wires Greenfield GET; signature pinned by PaymentProvider.
      if (!envIsConfigured(env)) return null;
      // Phase 10: GET /api/v1/stores/{storeId}/invoices/{invoiceId}.
      return null;
    },

    async handleWebhook(
      payload: unknown,
      headers: Record<string, string>,
    ): Promise<WebhookResult> {
      const secret = env.BTCPAY_WEBHOOK_SECRET ?? "";
      const rawBody =
        typeof payload === "string" ? payload : JSON.stringify(payload ?? {});
      const sigHeader =
        headers["btcpay-sig"] ?? headers["BTCPay-Sig"] ?? headers["btcPay-sig"];

      const verified = verifyBtcpaySignature(rawBody, sigHeader, secret);
      if (!verified) {
        return { intent: null, eventType: "unverified", verified: false };
      }

      let parsed: BtcpayWebhookPayload;
      try {
        parsed =
          typeof payload === "string"
            ? (JSON.parse(payload) as BtcpayWebhookPayload)
            : ((payload ?? {}) as BtcpayWebhookPayload);
      } catch {
        return { intent: null, eventType: "invalid_payload", verified: true };
      }

      const eventType = parsed.type ?? parsed.status ?? "unknown";
      const status = mapBtcpayStatus(parsed.status ?? parsed.type ?? "");
      const intentId = parsed.metadata?.intentId ?? parsed.invoiceId ?? "";

      if (!intentId) {
        return { intent: null, eventType, verified: true };
      }

      const ts = new Date().toISOString();
      const intent: PaymentIntent = {
        id: intentId,
        provider: "btcpay",
        method: "crypto",
        amountCents: 0, // populated by reconciliation against the order row
        currency: "USD",
        status,
        metadata: parsed.metadata ?? {},
        createdAt: ts,
        updatedAt: ts,
        externalId: parsed.invoiceId,
      };

      return { intent, eventType, verified: true };
    },
  };
}
