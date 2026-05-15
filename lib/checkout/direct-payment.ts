import type { BtcpayEnv } from "@/lib/payments/btcpay";
import { isProductionRuntime } from "@/lib/runtime-env";

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
}

const BTCPAY_REQUIRED = [
  "BTCPAY_SERVER_URL",
  "BTCPAY_API_KEY",
  "BTCPAY_STORE_ID",
  "BTCPAY_WEBHOOK_SECRET",
] as const;

function present(value: string | undefined): boolean {
  const normalized = value?.trim();
  if (!normalized) return false;
  if (/^PLACEHOLDER_/i.test(normalized)) return false;
  if (/^stub_/i.test(normalized)) return false;
  if (normalized === "https://your-btcpay-server.example.com") return false;
  return true;
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
  if (!present(env.ZELLE_RECIPIENT_NAME ?? env.ZELLE_BUSINESS_NAME)) {
    missing.push("ZELLE_RECIPIENT_NAME");
  }
  if (!present(env.ZELLE_EMAIL ?? env.ZELLE_HANDLE)) {
    missing.push("ZELLE_EMAIL");
  }
  if (!present(env.ZELLE_PAYMENT_NOTE_PREFIX)) {
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
    (env.ZELLE_RECIPIENT_NAME ?? env.ZELLE_BUSINESS_NAME)?.trim() ||
    (allowPlaceholders ? "PLACEHOLDER_ZELLE_RECIPIENT_NAME" : "");
  const email =
    (env.ZELLE_EMAIL ?? env.ZELLE_HANDLE)?.trim() ||
    (allowPlaceholders ? "PLACEHOLDER_ZELLE_EMAIL" : undefined);
  const phone = env.ZELLE_PHONE?.trim() || undefined;
  const memoPrefix =
    env.ZELLE_PAYMENT_NOTE_PREFIX?.trim() || (allowPlaceholders ? "VCL" : "");

  return {
    recipientName,
    email,
    phone,
    handle: email ?? phone ?? "",
    memoPrefix,
    qrImageUrl: env.ZELLE_QR_IMAGE_URL?.trim() || undefined,
  };
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
}: {
  siteUrl: string;
  orderId: string;
  amountCents: number;
  details: ZelleDetails;
}): string {
  const url = new URL("/checkout/zelle", siteUrl);
  url.searchParams.set("order", orderId);
  url.searchParams.set("amount_cents", String(amountCents));
  url.searchParams.set("recipient_name", details.recipientName);
  url.searchParams.set("recipient_handle", details.handle);
  url.searchParams.set("memo", `${details.memoPrefix}-${orderId}`);
  if (details.email) url.searchParams.set("zelle_email", details.email);
  if (details.phone) url.searchParams.set("zelle_phone", details.phone);
  if (details.qrImageUrl)
    url.searchParams.set("qr_image_url", details.qrImageUrl);
  return url.toString();
}
