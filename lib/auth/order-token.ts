/**
 * Auth-flow redesign — HMAC-signed "view this order" token.
 *
 * Order confirmation + shipping emails embed a link of the form:
 *   {siteUrl}/orders/{display_id}?token={signed_jwt}
 *
 * The token grants read-only access to ONE order for 90 days (default).
 * Implementation: base64url(`{payload}.{hmac}`) where payload is the
 * JSON `{orderId, email, exp}`. We keep our own compact format rather
 * than pulling a JWT library — the surface area is tiny and the test
 * suite proves the verifier rejects expired / tampered / cross-secret
 * tokens.
 *
 * Secret rotation: ORDER_TOKEN_SECRET signs + verifies. If
 * ORDER_TOKEN_SECRET_PREVIOUS is also set, verify() will accept tokens
 * signed by EITHER secret. Use the overlap window to rotate secrets
 * without breaking in-flight email links: set both for ~90 days, then
 * drop the previous.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 90; // 90 days

export interface OrderTokenPayload {
  orderId: string;
  email: string;
  exp: number; // epoch seconds
}

export interface SignInput {
  orderId: string;
  email: string;
  ttlSeconds?: number;
}

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

function getCurrentSecret(
  env: Record<string, string | undefined> = process.env,
): string {
  return (env.ORDER_TOKEN_SECRET ?? "").trim();
}

function getPreviousSecret(
  env: Record<string, string | undefined> = process.env,
): string {
  return (env.ORDER_TOKEN_SECRET_PREVIOUS ?? "").trim();
}

function hmacHex(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

export function signOrderToken(input: SignInput): string {
  const secret = getCurrentSecret();
  if (!secret) {
    throw new Error("order_token_secret_required");
  }
  const ttl = input.ttlSeconds ?? DEFAULT_TTL_SECONDS;
  const payload: OrderTokenPayload = {
    orderId: input.orderId,
    email: input.email.trim().toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + ttl,
  };
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = base64UrlEncode(payloadJson);
  const sig = hmacHex(payloadB64, secret);
  return `${payloadB64}.${sig}`;
}

// Max-TTL guard: even if a leaked PREVIOUS secret is used to mint a token
// with a far-future exp, we cap acceptable lifetime here. Slightly larger
// than DEFAULT_TTL_SECONDS so a legitimate 90-day token survives clock skew.
const MAX_ACCEPTABLE_LIFETIME_SECONDS = DEFAULT_TTL_SECONDS + 86400;

export function verifyOrderToken(token: string): OrderTokenPayload | null {
  if (!token || typeof token !== "string") return null;
  if (token.length > 2048) return null;

  const current = getCurrentSecret();
  // Foot-gun guard (codex review): if ORDER_TOKEN_SECRET (current) isn't
  // set, refuse to verify even when PREVIOUS is set. Otherwise a misconfig
  // where the operator "rotated" by only setting PREVIOUS would leave the
  // system silently verifying with a stale secret while sign() refuses
  // to produce new tokens.
  if (!current) return null;
  const previous = getPreviousSecret();

  const dot = token.lastIndexOf(".");
  if (dot <= 0 || dot === token.length - 1) return null;

  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^[0-9a-f]+$/i.test(sig)) return null;

  // Try current first, then previous (rotation window).
  const candidates = [current, previous].filter((s) => s.length > 0);
  let verified = false;
  for (const secret of candidates) {
    const expected = hmacHex(payloadB64, secret);
    if (safeEqualHex(sig, expected)) {
      verified = true;
      break;
    }
  }
  if (!verified) return null;

  let payload: OrderTokenPayload;
  try {
    payload = JSON.parse(base64UrlDecode(payloadB64)) as OrderTokenPayload;
  } catch {
    return null;
  }
  if (
    typeof payload !== "object" ||
    payload === null ||
    typeof payload.orderId !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.exp !== "number" ||
    !Number.isFinite(payload.exp)
  ) {
    return null;
  }
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) return null;
  // Cap acceptable lifetime to bound the blast radius of a leaked secret.
  if (payload.exp - now > MAX_ACCEPTABLE_LIFETIME_SECONDS) return null;

  return payload;
}

/**
 * Convenience: build the absolute URL for the email body.
 * Caller is expected to pass `siteConfig.url` (no trailing slash).
 */
export function buildOrderViewUrl(
  siteUrl: string,
  orderId: string,
  email: string,
): string {
  const token = signOrderToken({ orderId, email });
  const base = siteUrl.replace(/\/+$/, "");
  return `${base}/orders/${encodeURIComponent(orderId)}?token=${token}`;
}
