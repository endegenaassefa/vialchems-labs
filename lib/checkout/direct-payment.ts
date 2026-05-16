import type { BtcpayEnv } from "@/lib/payments/btcpay";
import { isProductionRuntime } from "@/lib/runtime-env";
import { createHmac, timingSafeEqual } from "node:crypto";

export interface RuntimeEnv {
  [key: string]: string | undefined;
}

export interface ZelleDetails {
  recipientName: string;
  email?: string;
  phone?: string;
  handle: string;
  memoPrefix: string;
  qrImageUrl?: string;
  supportEmail?: string;
}

const BTCPAY_REQUIRED = [
  "BTCPAY_SERVER_URL",
  "BTCPAY_API_KEY",
  "BTCPAY_STORE_ID",
  "BTCPAY_WEBHOOK_SECRET",
] as const;

const DEFAULT_ZELLE_DETAILS: Required<
  Pick<ZelleDetails, "recipientName" | "handle" | "memoPrefix" | "supportEmail">
> = {
  recipientName: "Vialchem Labs LLC",
  handle: "vialchem-pay",
  memoPrefix: "VCL",
  supportEmail: "abhinav@vialchemlabs.net",
};

const ZELLE_SIGNED_PARAMS = [
  "order",
  "amount_cents",
  "recipient_name",
  "recipient_handle",
  "memo",
  "zelle_email",
  "zelle_phone",
  "support_email",
  "qr_image_url",
] as const;

function present(value: string | undefined): boolean {
  const normalized = value?.trim();
  if (!normalized) return false;
  if (/^PLACEHOLDER_/i.test(normalized)) return false;
  if (/^stub_/i.test(normalized)) return false;
  if (normalized === "https://your-btcpay-server.example.com") return false;
  return true;
}

function firstPresent(...values: (string | undefined)[]): string | undefined {
  for (const value of values) {
    if (present(value)) return value?.trim();
  }
  return undefined;
}

export function getBtcpayServerUrl(env: RuntimeEnv = process.env): string {
  return (env.BTCPAY_SERVER_URL ?? env.BTCPAY_URL ?? "").trim();
}

export function getMissingBtcpayCredentials(
  env: RuntimeEnv = process.env,
): string[] {
  return BTCPAY_REQUIRED.filter((name) => {
    if (name === "BTCPAY_SERVER_URL") return !present(getBtcpayServerUrl(env));
    return !present(env[name]);
  });
}

export function getBtcpayAdapterEnv(env: RuntimeEnv = process.env): BtcpayEnv {
  return {
    BTCPAY_SERVER_URL: getBtcpayServerUrl(env),
    BTCPAY_URL: getBtcpayServerUrl(env),
    BTCPAY_API_KEY: env.BTCPAY_API_KEY,
    BTCPAY_STORE_ID: env.BTCPAY_STORE_ID,
    BTCPAY_WEBHOOK_SECRET: env.BTCPAY_WEBHOOK_SECRET,
  };
}

export function shouldUseDirectPaymentPlaceholder(
  env: RuntimeEnv = process.env,
): boolean {
  return !isProductionRuntime() || env.ALLOW_PAYMENT_PLACEHOLDERS === "true";
}

export function getMissingZelleCredentials(
  env: RuntimeEnv = process.env,
): string[] {
  const missing: string[] = [];
  if (
    !firstPresent(
      env.ZELLE_RECIPIENT_NAME,
      env.ZELLE_BUSINESS_NAME,
      DEFAULT_ZELLE_DETAILS.recipientName,
    )
  ) {
    missing.push("ZELLE_RECIPIENT_NAME");
  }
  if (
    !firstPresent(
      env.ZELLE_HANDLE,
      env.ZELLE_EMAIL,
      DEFAULT_ZELLE_DETAILS.handle,
    )
  ) {
    missing.push("ZELLE_HANDLE");
  }
  if (
    !firstPresent(
      env.ZELLE_PAYMENT_NOTE_PREFIX,
      DEFAULT_ZELLE_DETAILS.memoPrefix,
    )
  ) {
    missing.push("ZELLE_PAYMENT_NOTE_PREFIX");
  }
  return missing;
}

export function getZelleDetails(
  env: RuntimeEnv = process.env,
  options: { allowPlaceholders?: boolean } = {},
): ZelleDetails {
  const allowPlaceholders = options.allowPlaceholders ?? false;
  const recipientName =
    firstPresent(
      env.ZELLE_RECIPIENT_NAME,
      env.ZELLE_BUSINESS_NAME,
      DEFAULT_ZELLE_DETAILS.recipientName,
    ) || (allowPlaceholders ? "PLACEHOLDER_ZELLE_RECIPIENT_NAME" : "");
  const handle =
    firstPresent(
      env.ZELLE_HANDLE,
      env.ZELLE_EMAIL,
      DEFAULT_ZELLE_DETAILS.handle,
    ) || (allowPlaceholders ? "PLACEHOLDER_ZELLE_HANDLE" : "");
  const email = firstPresent(env.ZELLE_EMAIL);
  const phone = firstPresent(env.ZELLE_PHONE);
  const memoPrefix =
    firstPresent(
      env.ZELLE_PAYMENT_NOTE_PREFIX,
      DEFAULT_ZELLE_DETAILS.memoPrefix,
    ) || (allowPlaceholders ? "VCL" : "");
  const supportEmail = firstPresent(
    env.ZELLE_SUPPORT_EMAIL,
    env.ZELLE_EMAIL,
    DEFAULT_ZELLE_DETAILS.supportEmail,
  );

  return {
    recipientName,
    email,
    phone,
    handle,
    memoPrefix,
    qrImageUrl: env.ZELLE_QR_IMAGE_URL?.trim() || undefined,
    supportEmail,
  };
}

function zelleSignatureBase(params: URLSearchParams): string {
  return ZELLE_SIGNED_PARAMS.map(
    (name) => `${name}=${params.get(name) ?? ""}`,
  ).join("\n");
}

export function signZelleCheckoutParams(
  params: URLSearchParams,
  signingSecret: string,
): string {
  return createHmac("sha256", signingSecret)
    .update(zelleSignatureBase(params))
    .digest("hex");
}

export function verifyZelleCheckoutSignature(
  params: URLSearchParams,
  signingSecret: string | undefined,
): boolean {
  if (!signingSecret) return false;
  const received = params.get("sig");
  if (!received || !/^[a-f0-9]{64}$/i.test(received)) return false;
  const expected = signZelleCheckoutParams(params, signingSecret);
  return timingSafeEqual(
    Buffer.from(received, "hex"),
    Buffer.from(expected, "hex"),
  );
}

export function getZelleCheckoutSigningSecret(
  env: RuntimeEnv = process.env,
): string {
  const configured = firstPresent(
    env.ZELLE_CHECKOUT_SIGNING_SECRET,
    env.AGE_GATE_SECRET,
  );
  if (configured) return configured;
  return isProductionRuntime() ? "" : "local-zelle-checkout-signing-secret";
}

export function buildBitcoinCheckoutUrl({
  siteUrl,
  orderId,
  amountCents,
  invoiceId,
  invoiceUrl,
  placeholder,
}: {
  siteUrl: string;
  orderId: string;
  amountCents: number;
  invoiceId: string;
  invoiceUrl?: string;
  placeholder?: boolean;
}): string {
  const url = new URL("/checkout/bitcoin", siteUrl);
  url.searchParams.set("order", orderId);
  url.searchParams.set("amount_cents", String(amountCents));
  url.searchParams.set("invoice", invoiceId);
  if (invoiceUrl) url.searchParams.set("invoice_url", invoiceUrl);
  if (placeholder) url.searchParams.set("placeholder", "true");
  return url.toString();
}

export function buildZelleCheckoutUrl({
  siteUrl,
  orderId,
  amountCents,
  details,
  signingSecret,
}: {
  siteUrl: string;
  orderId: string;
  amountCents: number;
  details: ZelleDetails;
  signingSecret?: string;
}): string {
  const url = new URL("/checkout/zelle", siteUrl);
  url.searchParams.set("order", orderId);
  url.searchParams.set("amount_cents", String(amountCents));
  url.searchParams.set("recipient_name", details.recipientName);
  url.searchParams.set("recipient_handle", details.handle);
  url.searchParams.set("memo", `${details.memoPrefix}-${orderId}`);
  if (details.email) url.searchParams.set("zelle_email", details.email);
  if (details.phone) url.searchParams.set("zelle_phone", details.phone);
  if (details.supportEmail)
    url.searchParams.set("support_email", details.supportEmail);
  if (details.qrImageUrl)
    url.searchParams.set("qr_image_url", details.qrImageUrl);
  if (signingSecret)
    url.searchParams.set(
      "sig",
      signZelleCheckoutParams(url.searchParams, signingSecret),
    );
  return url.toString();
}
