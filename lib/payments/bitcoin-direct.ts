import { createHmac, timingSafeEqual } from "node:crypto";
import { isProductionRuntime } from "@/lib/runtime-env";
import type { RuntimeEnv } from "@/lib/checkout/direct-payment";

const SATS_PER_BTC = 100_000_000;
const DEFAULT_RATE_URL = "https://api.coinbase.com/v2/prices/BTC-USD/spot";

export interface BitcoinDirectDetails {
  receiveAddress: string;
  supportEmail: string;
  confirmationsRequired: number;
  rateBufferBps: number;
  rateUrl: string;
}

export interface BitcoinQuote {
  btcUsdCents: number;
  sats: number;
  btcAmount: string;
  rateSource: string;
  quotedAt: string;
}

const BITCOIN_DIRECT_SIGNED_PARAMS = [
  "order",
  "amount_cents",
  "btc_sats",
  "btc_amount",
  "btc_usd_cents",
  "address",
  "rate_source",
  "quoted_at",
  "support_email",
] as const;

function present(value: string | undefined): boolean {
  const normalized = value?.trim();
  if (!normalized) return false;
  if (/^PLACEHOLDER_/i.test(normalized)) return false;
  if (/^stub_/i.test(normalized)) return false;
  return true;
}

function firstPresent(...values: (string | undefined)[]): string | undefined {
  for (const value of values) {
    if (present(value)) return value?.trim();
  }
  return undefined;
}

export function isBitcoinAddressLike(address: string): boolean {
  return /^(bc1[ac-hj-np-z02-9]{11,87}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$/.test(
    address.trim(),
  );
}

export function getBitcoinDirectSigningSecret(
  env: RuntimeEnv = process.env,
): string {
  const configured = firstPresent(
    env.BITCOIN_DIRECT_SIGNING_SECRET,
    env.ZELLE_CHECKOUT_SIGNING_SECRET,
    env.AGE_GATE_SECRET,
  );
  if (configured) return configured;
  return isProductionRuntime() ? "" : "local-bitcoin-direct-signing-secret";
}

export function getMissingBitcoinDirectCredentials(
  env: RuntimeEnv = process.env,
): string[] {
  const missing: string[] = [];
  const address = firstPresent(env.BITCOIN_RECEIVE_ADDRESS);
  if (!address) missing.push("BITCOIN_RECEIVE_ADDRESS");
  else if (!isBitcoinAddressLike(address))
    missing.push("BITCOIN_RECEIVE_ADDRESS");

  if (!firstPresent(env.BITCOIN_DIRECT_SIGNING_SECRET, env.AGE_GATE_SECRET)) {
    missing.push("BITCOIN_DIRECT_SIGNING_SECRET");
  }
  return missing;
}

export function getBitcoinDirectDetails(
  env: RuntimeEnv = process.env,
): BitcoinDirectDetails {
  const receiveAddress = firstPresent(env.BITCOIN_RECEIVE_ADDRESS) ?? "";
  // J1: support inbox placeholder. Operator points the
  // support@vialchemlabs.net mailbox at endegenaassefa2@gmail.com
  // (or a dedicated inbox) post-launch.
  const supportEmail =
    firstPresent(
      env.BITCOIN_SUPPORT_EMAIL,
      env.ZELLE_SUPPORT_EMAIL,
      env.ZELLE_EMAIL,
    ) ?? "support@vialchemlabs.net";
  const confirmationsRequired = Number.parseInt(
    env.BITCOIN_CONFIRMATIONS_REQUIRED ?? "1",
    10,
  );
  const rateBufferBps = Number.parseInt(
    env.BITCOIN_DIRECT_RATE_BUFFER_BPS ?? "0",
    10,
  );

  return {
    receiveAddress,
    supportEmail,
    confirmationsRequired: Number.isFinite(confirmationsRequired)
      ? Math.max(1, confirmationsRequired)
      : 1,
    rateBufferBps: Number.isFinite(rateBufferBps)
      ? Math.max(0, rateBufferBps)
      : 0,
    rateUrl: firstPresent(env.BITCOIN_RATE_URL) ?? DEFAULT_RATE_URL,
  };
}

export function isBitcoinDirectConfigured(
  env: RuntimeEnv = process.env,
): boolean {
  return (
    env.BITCOIN_DIRECT_CHECKOUT_ENABLED === "true" &&
    getMissingBitcoinDirectCredentials(env).length === 0
  );
}

function formatBtcAmount(sats: number): string {
  return (sats / SATS_PER_BTC).toFixed(8).replace(/0+$/, "").replace(/\.$/, "");
}

export async function fetchBitcoinQuote({
  amountCents,
  details = getBitcoinDirectDetails(),
  fetchImpl = fetch,
}: {
  amountCents: number;
  details?: BitcoinDirectDetails;
  fetchImpl?: typeof fetch;
}): Promise<BitcoinQuote> {
  const response = await fetchImpl(details.rateUrl, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`bitcoin_rate_unavailable: HTTP ${response.status}`);
  }

  const json = (await response.json()) as {
    data?: { amount?: string; currency?: string };
  };
  const btcUsd = Number.parseFloat(json.data?.amount ?? "");
  if (!Number.isFinite(btcUsd) || btcUsd <= 0) {
    throw new Error("bitcoin_rate_unavailable: invalid BTC-USD spot response");
  }

  const btcUsdCents = Math.round(btcUsd * 100);
  const baseSats = Math.ceil((amountCents * SATS_PER_BTC) / btcUsdCents);
  const sats = Math.ceil(baseSats * (1 + details.rateBufferBps / 10_000));

  return {
    btcUsdCents,
    sats,
    btcAmount: formatBtcAmount(sats),
    rateSource: details.rateUrl,
    quotedAt: new Date().toISOString(),
  };
}

function bitcoinSignatureBase(params: URLSearchParams): string {
  return BITCOIN_DIRECT_SIGNED_PARAMS.map(
    (name) => `${name}=${params.get(name) ?? ""}`,
  ).join("\n");
}

export function signBitcoinDirectCheckoutParams(
  params: URLSearchParams,
  signingSecret: string,
): string {
  return createHmac("sha256", signingSecret)
    .update(bitcoinSignatureBase(params))
    .digest("hex");
}

export function verifyBitcoinDirectCheckoutSignature(
  params: URLSearchParams,
  signingSecret: string | undefined,
): boolean {
  if (!signingSecret) return false;
  const received = params.get("sig");
  if (!received || !/^[a-f0-9]{64}$/i.test(received)) return false;
  const expected = signBitcoinDirectCheckoutParams(params, signingSecret);
  return timingSafeEqual(
    Buffer.from(received, "hex"),
    Buffer.from(expected, "hex"),
  );
}

export function buildBitcoinDirectCheckoutUrl({
  siteUrl,
  orderId,
  amountCents,
  details,
  quote,
  signingSecret,
}: {
  siteUrl: string;
  orderId: string;
  amountCents: number;
  details: BitcoinDirectDetails;
  quote: BitcoinQuote;
  signingSecret: string;
}): string {
  const url = new URL("/checkout/bitcoin", siteUrl);
  url.searchParams.set("mode", "direct");
  url.searchParams.set("order", orderId);
  url.searchParams.set("amount_cents", String(amountCents));
  url.searchParams.set("btc_sats", String(quote.sats));
  url.searchParams.set("btc_amount", quote.btcAmount);
  url.searchParams.set("btc_usd_cents", String(quote.btcUsdCents));
  url.searchParams.set("address", details.receiveAddress);
  url.searchParams.set("rate_source", quote.rateSource);
  url.searchParams.set("quoted_at", quote.quotedAt);
  url.searchParams.set("support_email", details.supportEmail);
  url.searchParams.set(
    "sig",
    signBitcoinDirectCheckoutParams(url.searchParams, signingSecret),
  );
  return url.toString();
}

export function buildBitcoinUri({
  address,
  btcAmount,
  orderId,
}: {
  address: string;
  btcAmount: string;
  orderId: string;
}): string {
  const url = new URL(`bitcoin:${address}`);
  url.searchParams.set("amount", btcAmount);
  url.searchParams.set("label", "VialChem Labs");
  url.searchParams.set("message", orderId);
  return url.toString();
}
