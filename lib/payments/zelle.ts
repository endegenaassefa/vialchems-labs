import type {
  CreateIntentInput,
  PaymentIntent,
  PaymentProvider,
  WebhookResult,
} from "./types";
import {
  getMissingZelleCredentials,
  getZelleDetails,
  type RuntimeEnv,
} from "@/lib/checkout/direct-payment";

export interface ZelleEnv extends RuntimeEnv {
  ENABLE_ZELLE?: string;
  ZELLE_RECIPIENT_NAME?: string;
  ZELLE_EMAIL?: string;
  ZELLE_PHONE?: string;
  ZELLE_QR_IMAGE_URL?: string;
  ZELLE_PAYMENT_NOTE_PREFIX?: string;
  ZELLE_BUSINESS_NAME?: string;
  ZELLE_HANDLE?: string;
}

export interface ZelleAdapterOptions {
  env?: ZelleEnv;
  now?: () => Date;
  allowPlaceholders?: boolean;
}

const DEFAULT_NOW = (): Date => new Date();

function fromProcessEnv(): ZelleEnv {
  return {
    ENABLE_ZELLE: process.env.ENABLE_ZELLE,
    ZELLE_RECIPIENT_NAME: process.env.ZELLE_RECIPIENT_NAME,
    ZELLE_EMAIL: process.env.ZELLE_EMAIL,
    ZELLE_PHONE: process.env.ZELLE_PHONE,
    ZELLE_QR_IMAGE_URL: process.env.ZELLE_QR_IMAGE_URL,
    ZELLE_PAYMENT_NOTE_PREFIX: process.env.ZELLE_PAYMENT_NOTE_PREFIX,
    ZELLE_BUSINESS_NAME: process.env.ZELLE_BUSINESS_NAME,
    ZELLE_HANDLE: process.env.ZELLE_HANDLE,
  };
}

export function envIsConfigured(env: ZelleEnv = fromProcessEnv()): boolean {
  return getMissingZelleCredentials(env).length === 0;
}

export function createZelleAdapter(
  options: ZelleAdapterOptions = {},
): PaymentProvider {
  const env = options.env ?? fromProcessEnv();
  const now = options.now ?? DEFAULT_NOW;

  return {
    id: "zelle",

    async createIntent(input: CreateIntentInput): Promise<PaymentIntent> {
      const missing = getMissingZelleCredentials(env);
      if (missing.length > 0 && !options.allowPlaceholders) {
        throw new Error(
          `zelle_not_configured: Missing required credential: ${missing[0]}`,
        );
      }
      if (input.method !== "zelle") {
        throw new Error(
          "zelle_method_mismatch: Zelle payment intents require method=zelle.",
        );
      }

      const ts = now().toISOString();
      const details = getZelleDetails(env, {
        allowPlaceholders: options.allowPlaceholders,
      });
      const memo = `${details.memoPrefix}-${input.orderId}`;
      const id = `zelle_${input.orderId}`;
      const instructions = [
        `Send the exact order total through Zelle to ${details.handle}.`,
        `Use ${memo} as the payment memo.`,
        "The order remains on hold until staff verifies receipt in the business bank account.",
      ].join(" ");

      return {
        id,
        provider: "zelle",
        method: "zelle",
        amountCents: input.amountCents,
        currency: "USD",
        status: "pending",
        metadata: {
          orderId: input.orderId,
          customerEmail: input.customerEmail,
          zelleRecipientName: details.recipientName,
          zelleHandle: details.handle,
          zelleEmail: details.email ?? "",
          zellePhone: details.phone ?? "",
          zelleMemo: memo,
          instructions,
          ...(details.qrImageUrl
            ? { zelleQrImageUrl: details.qrImageUrl }
            : {}),
          ...(input.metadata ?? {}),
        },
        createdAt: ts,
        updatedAt: ts,
        externalId: input.orderId,
      };
    },

    async getIntent(): Promise<PaymentIntent | null> {
      return null;
    },

    async handleWebhook(): Promise<WebhookResult> {
      return {
        intent: null,
        eventType: "manual_verification_required",
        verified: false,
      };
    },
  };
}
