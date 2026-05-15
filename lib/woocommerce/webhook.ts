import { createHmac, timingSafeEqual } from "node:crypto";

export interface WooOrderWebhook {
  id: number;
  status: string;
  orderKey: string | null;
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
  };

  if (
    typeof candidate.id !== "number" ||
    typeof candidate.status !== "string"
  ) {
    return null;
  }

  return {
    id: candidate.id,
    status: candidate.status,
    orderKey:
      typeof candidate.order_key === "string" ? candidate.order_key : null,
  };
}
