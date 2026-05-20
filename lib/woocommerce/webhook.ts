import { createHmac, timingSafeEqual } from "node:crypto";

export interface WooOrderShippingAddress {
  countryCode: string;
  stateCode: string;
}

export interface WooOrderWebhook {
  id: number;
  status: string;
  orderKey: string | null;
  /**
   * Phase 3.3 (v5) — shipping address extracted from the WC webhook payload
   * so the route handler can run Layer 3 jurisdictional guard without
   * roundtripping Supabase. Falls back to billing address when shipping is
   * not populated. May be null for partial payloads.
   */
  shippingAddress: WooOrderShippingAddress | null;
}

export function verifyWooWebhookSignature(
  rawBody: string,
  signature: string | null | undefined,
  secret: string | null | undefined,
): boolean {
  if (!signature || !secret) return false;

  const expected = createHmac("sha256", secret)
    .update(rawBody)
    .digest("base64");
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, signatureBuffer);
}

function extractAddress(source: unknown): WooOrderShippingAddress | null {
  if (!source || typeof source !== "object") return null;
  const obj = source as {
    country?: unknown;
    state?: unknown;
    country_code?: unknown;
    state_code?: unknown;
  };
  const country =
    typeof obj.country === "string"
      ? obj.country
      : typeof obj.country_code === "string"
        ? obj.country_code
        : "";
  const state =
    typeof obj.state === "string"
      ? obj.state
      : typeof obj.state_code === "string"
        ? obj.state_code
        : "";
  if (!country) return null;
  return { countryCode: country, stateCode: state };
}

export function parseWooOrderWebhook(rawBody: string): WooOrderWebhook | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return null;
  }

  if (typeof parsed !== "object" || parsed === null) return null;

  const candidate = parsed as {
    id?: unknown;
    status?: unknown;
    order_key?: unknown;
    shipping?: unknown;
    billing?: unknown;
  };

  if (
    typeof candidate.id !== "number" ||
    typeof candidate.status !== "string"
  ) {
    return null;
  }

  const shipping =
    extractAddress(candidate.shipping) ?? extractAddress(candidate.billing);

  return {
    id: candidate.id,
    status: candidate.status,
    orderKey:
      typeof candidate.order_key === "string" ? candidate.order_key : null,
    shippingAddress: shipping,
  };
}
