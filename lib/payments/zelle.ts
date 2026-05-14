import type {
  CreateIntentInput,
  PaymentIntent,
  PaymentProvider,
  WebhookResult,
} from "./types";

export interface ZelleEnv {
  ENABLE_ZELLE?: string;
  ZELLE_BUSINESS_NAME?: string;
  ZELLE_HANDLE?: string;
  ZELLE_BANK_NAME?: string;
  ZELLE_TERMS_APPROVED_AT?: string;
  ZELLE_QR_IMAGE_URL?: string;
}

export interface ZelleAdapterOptions {
  env?: ZelleEnv;
  now?: () => Date;
}

const DEFAULT_NOW = (): Date => new Date();

function fromProcessEnv(): ZelleEnv {
  return {
    ENABLE_ZELLE: process.env.ENABLE_ZELLE,
    ZELLE_BUSINESS_NAME: process.env.ZELLE_BUSINESS_NAME,
    ZELLE_HANDLE: process.env.ZELLE_HANDLE,
    ZELLE_BANK_NAME: process.env.ZELLE_BANK_NAME,
    ZELLE_TERMS_APPROVED_AT: process.env.ZELLE_TERMS_APPROVED_AT,
    ZELLE_QR_IMAGE_URL: process.env.ZELLE_QR_IMAGE_URL,
  };
}

function truthy(value: string | undefined): boolean {
  const normalized = value?.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

function present(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

export function envIsConfigured(env: ZelleEnv = fromProcessEnv()): boolean {
  return (
    truthy(env.ENABLE_ZELLE) &&
    present(env.ZELLE_BUSINESS_NAME) &&
    present(env.ZELLE_HANDLE) &&
    present(env.ZELLE_BANK_NAME) &&
    present(env.ZELLE_TERMS_APPROVED_AT)
  );
}

function buildInstructions(env: ZelleEnv, orderId: string): string {
  return [
    `Send the exact order total through Zelle to ${env.ZELLE_HANDLE}.`,
    `Use ${orderId} as the payment memo.`,
    "The order remains on hold until staff verifies receipt in the business bank account.",
  ].join(" ");
}

export function createZelleAdapter(
  options: ZelleAdapterOptions = {},
): PaymentProvider {
  const env = options.env ?? fromProcessEnv();
  const now = options.now ?? DEFAULT_NOW;

  return {
    id: "zelle",

    async createIntent(input: CreateIntentInput): Promise<PaymentIntent> {
      if (!envIsConfigured(env)) {
        throw new Error(
          "zelle_not_configured: ENABLE_ZELLE, ZELLE_BUSINESS_NAME, ZELLE_HANDLE, ZELLE_BANK_NAME, and ZELLE_TERMS_APPROVED_AT are required before Zelle checkout can be used.",
        );
      }
      if (input.method !== "zelle") {
        throw new Error(
          "zelle_method_mismatch: Zelle payment intents require method=zelle.",
        );
      }

      const ts = now().toISOString();
      const id = `zelle_${input.orderId}`;
      const instructions = buildInstructions(env, input.orderId);

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
          zelleBusinessName: env.ZELLE_BUSINESS_NAME?.trim() ?? "",
          zelleHandle: env.ZELLE_HANDLE?.trim() ?? "",
          zelleBankName: env.ZELLE_BANK_NAME?.trim() ?? "",
          zelleTermsApprovedAt: env.ZELLE_TERMS_APPROVED_AT?.trim() ?? "",
          zelleMemo: input.orderId,
          instructions,
          ...(env.ZELLE_QR_IMAGE_URL?.trim()
            ? { zelleQrImageUrl: env.ZELLE_QR_IMAGE_URL.trim() }
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
