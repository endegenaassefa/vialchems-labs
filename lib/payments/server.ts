/**
 * Server-only helpers for payments. Never imported from client components.
 *
 * Holds env-loading + signature pre-checks that are expensive or unsafe to
 * run on the edge. Used by the BTCPay + Plaid webhook route handlers under
 * `app/api/payments/`.
 *
 * Note: not using the `server-only` package directly (not in deps); this
 * module's filename + the .ts extension and its consumers' route.ts callsite
 * keep it server-side. Phase 10 adds `server-only` to the deps vector.
 */
import { envIsConfigured as btcpayEnvConfigured } from "./btcpay";
import { envIsConfigured as plaidEnvConfigured } from "./plaid";
import type { PaymentProviderId } from "./types";

export interface ProviderEnvStatus {
  provider: PaymentProviderId;
  configured: boolean;
  reason?: string;
}

export function getProviderEnvStatus(): ProviderEnvStatus[] {
  const btcpay = btcpayEnvConfigured({
    BTCPAY_URL: process.env.BTCPAY_URL,
    BTCPAY_API_KEY: process.env.BTCPAY_API_KEY,
    BTCPAY_STORE_ID: process.env.BTCPAY_STORE_ID,
    BTCPAY_WEBHOOK_SECRET: process.env.BTCPAY_WEBHOOK_SECRET,
  });
  const plaid = plaidEnvConfigured({
    PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
    PLAID_SECRET: process.env.PLAID_SECRET,
    PLAID_ENV: process.env.PLAID_ENV,
    PLAID_WEBHOOK_VERIFICATION_KEY: process.env.PLAID_WEBHOOK_VERIFICATION_KEY,
  });
  return [
    { provider: "stub", configured: true, reason: "always-on for dev" },
    {
      provider: "btcpay",
      configured: btcpay,
      reason: btcpay
        ? undefined
        : "BTCPAY_URL/API_KEY/STORE_ID/WEBHOOK_SECRET stubbed",
    },
    {
      provider: "plaid",
      configured: plaid,
      reason: plaid ? undefined : "PLAID_CLIENT_ID/SECRET stubbed",
    },
  ];
}

/**
 * Reads the raw body string from a Next.js Request. We need the unparsed
 * body to verify HMAC signatures.
 */
export async function readRawBody(req: Request): Promise<string> {
  const text = await req.text();
  return text;
}

/**
 * Flatten request headers into a lower-cased plain record so adapters can
 * look up signatures without caring about Headers vs object.
 */
export function headersToRecord(req: Request): Record<string, string> {
  const out: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    out[key.toLowerCase()] = value;
  });
  return out;
}
