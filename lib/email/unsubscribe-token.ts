/**
 * E3 — HMAC-signed unsubscribe token helpers
 * (Section 6 super-prompt 2026-05-22).
 *
 * Marketing emails embed `${siteUrl}/api/unsubscribe?token=<token>`
 * footer links. The token is a base64url-encoded `${email}.${hmac}`
 * pair so the route handler can verify the email came from a
 * VialChem-sent email rather than a guessed URL.
 *
 * Secret resolution mirrors the age-gate pattern: read
 * UNSUBSCRIBE_SIGNING_SECRET, fall back to AGE_GATE_SECRET, fall
 * back to a dev-only constant. In production with no secrets
 * configured, `getUnsubscribeSigningSecret()` returns an empty
 * string and `verifyUnsubscribeToken()` refuses every token.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { isProductionRuntime } from "@/lib/runtime-env";

function base64UrlEncode(input: string): string {
  return Buffer.from(input, "utf-8")
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecode(input: string): string {
  const normalized = input.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );
  return Buffer.from(padded, "base64").toString("utf-8");
}

export function getUnsubscribeSigningSecret(
  env: Record<string, string | undefined> = process.env,
): string {
  const configured = (
    env.UNSUBSCRIBE_SIGNING_SECRET ??
    env.AGE_GATE_SECRET ??
    ""
  ).trim();
  if (configured) return configured;
  return isProductionRuntime() ? "" : "dev-only-unsubscribe-secret";
}

export function signUnsubscribeToken(
  email: string,
  signingSecret = getUnsubscribeSigningSecret(),
): string {
  if (!signingSecret) {
    throw new Error("unsubscribe_secret_required");
  }
  const normalized = email.trim().toLowerCase();
  const hmac = createHmac("sha256", signingSecret)
    .update(normalized)
    .digest("hex");
  return base64UrlEncode(`${normalized}.${hmac}`);
}

export interface VerifiedUnsubscribeToken {
  email: string;
}

export function verifyUnsubscribeToken(
  token: string,
  signingSecret = getUnsubscribeSigningSecret(),
): VerifiedUnsubscribeToken | null {
  if (!signingSecret) return null;
  if (!token || token.length > 1024) return null;
  let decoded: string;
  try {
    decoded = base64UrlDecode(token);
  } catch {
    return null;
  }
  const dot = decoded.lastIndexOf(".");
  if (dot <= 0) return null;
  const email = decoded.slice(0, dot);
  const signature = decoded.slice(dot + 1);
  if (!email || !/^[a-f0-9]{64}$/i.test(signature)) return null;
  const expected = createHmac("sha256", signingSecret)
    .update(email)
    .digest("hex");
  try {
    const match = timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expected, "hex"),
    );
    return match ? { email } : null;
  } catch {
    return null;
  }
}
