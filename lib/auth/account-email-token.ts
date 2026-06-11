/**
 * HMAC-signed tokens for account-email flows: registration
 * confirmation, password reset, and email-change confirmation.
 *
 * Spec §8 token format: base64url(JSON payload).hmac_hex_signature.
 * Payload includes a `purpose` discriminator so a password-reset
 * link cannot be replayed against the email-confirm endpoint, and a
 * `nonce` so otherwise-identical payloads still produce distinct
 * tokens (defence against link-prediction).
 *
 * Secret rotation: `ACCOUNT_EMAIL_TOKEN_SECRET` is the signing
 * secret. `ACCOUNT_EMAIL_TOKEN_SECRET_PREVIOUS` is checked on
 * verification only — set this during rotation overlap so links
 * signed under the old secret keep working until they expire (24h
 * for confirm-email, 1h for password-reset).
 *
 * Iron Law 2.22: secret is server-side only. This module is never
 * imported by client components. The verifyAccountEmailToken
 * function fails CLOSED on any error (missing secret → null,
 * malformed → null, tampered → null, expired → null) so silent
 * fail-open is impossible.
 */
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export type AccountEmailTokenPurpose =
  | "confirm-email"
  | "password-reset"
  | "email-change";

export interface AccountEmailTokenPayload {
  purpose: AccountEmailTokenPurpose;
  userId: string;
  email: string;
  /** Epoch seconds. Set internally by signAccountEmailToken; callers
   * cannot override (would let a route mint arbitrarily long-lived
   * tokens). */
  exp: number;
  /** Issued-at epoch seconds. Used at verify time to bound the
   * lifetime of a token signed under a rotated-out secret. */
  iat: number;
  nonce: string;
}

export interface SignOptions {
  ttlSeconds: number;
  /** Test-only clock injection (epoch seconds). Defaults to Date.now() / 1000. */
  nowSeconds?: number;
}

export interface VerifyOptions {
  /** Test-only clock injection (epoch seconds). Defaults to Date.now() / 1000. */
  nowSeconds?: number;
}

/**
 * Per-purpose hard caps used at verify time. A token whose
 * `exp - iat` exceeds the cap for its purpose is rejected even if
 * the signature is otherwise valid — this bounds the blast radius
 * of a leaked PREVIOUS rotation secret (codex HIGH 2026-05-25):
 * an attacker who learns the old key can mint a fresh token, but
 * cannot mint one valid for longer than the legitimate flow
 * allows.
 */
export const MAX_TTL_SECONDS: Record<AccountEmailTokenPurpose, number> = {
  "confirm-email": 24 * 60 * 60, // 24h
  "password-reset": 60 * 60, // 1h
  "email-change": 24 * 60 * 60, // 24h
};

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

function hmacHex(secret: string, message: string): string {
  return createHmac("sha256", secret).update(message).digest("hex");
}

function readPrimarySecret(): string {
  return (process.env.ACCOUNT_EMAIL_TOKEN_SECRET ?? "").trim();
}

function readPreviousSecret(): string {
  return (process.env.ACCOUNT_EMAIL_TOKEN_SECRET_PREVIOUS ?? "").trim();
}

export function signAccountEmailToken(
  payload: Pick<AccountEmailTokenPayload, "purpose" | "userId" | "email">,
  opts: SignOptions,
): string {
  const secret = readPrimarySecret();
  if (!secret) {
    throw new Error("account_email_token_secret_required");
  }
  // Codex LOW (2026-05-25): `exp` is internal-only. Callers cannot
  // override `opts.ttlSeconds` to mint longer-lived tokens.
  const cap = MAX_TTL_SECONDS[payload.purpose];
  if (!cap) {
    throw new Error(`unknown_token_purpose:${payload.purpose}`);
  }
  const ttl = Math.min(opts.ttlSeconds, cap);
  const iat = opts.nowSeconds ?? Math.floor(Date.now() / 1000);
  const exp = iat + ttl;
  const nonce = randomBytes(8).toString("hex");
  const normalised: AccountEmailTokenPayload = {
    purpose: payload.purpose,
    userId: payload.userId,
    email: payload.email.trim().toLowerCase(),
    exp,
    iat,
    nonce,
  };
  const json = JSON.stringify(normalised);
  const encoded = base64UrlEncode(json);
  const sig = hmacHex(secret, encoded);
  return `${encoded}.${sig}`;
}

/**
 * Verify a token and assert it matches the expected purpose.
 * Returns the decoded payload on success, null on ANY failure
 * (missing secret, malformed input, tampered payload/sig, expired,
 * purpose mismatch). Never throws.
 */
export function verifyAccountEmailToken(
  token: string,
  expectedPurpose: AccountEmailTokenPurpose,
  opts: VerifyOptions = {},
): AccountEmailTokenPayload | null {
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return null;
  }
  const primary = readPrimarySecret();
  const previous = readPreviousSecret();
  // If neither secret is configured, refuse every token. Fail closed.
  if (!primary && !previous) return null;

  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const encoded = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  // Signature must be 64 hex chars (sha256 → 32 bytes → 64 hex).
  if (!/^[a-f0-9]{64}$/i.test(sig)) return null;

  // Try each known secret. timingSafeEqual demands equal-length buffers,
  // which the hex regex above guarantees.
  let matched = false;
  const sigBuf = Buffer.from(sig, "hex");
  for (const secret of [primary, previous]) {
    if (!secret) continue;
    const expected = hmacHex(secret, encoded);
    const expectedBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expectedBuf.length) continue;
    try {
      if (timingSafeEqual(sigBuf, expectedBuf)) {
        matched = true;
        break;
      }
    } catch {
      // length mismatch or otherwise — fall through
    }
  }
  if (!matched) return null;

  let payload: unknown;
  try {
    payload = JSON.parse(base64UrlDecode(encoded));
  } catch {
    return null;
  }
  if (
    !payload ||
    typeof payload !== "object" ||
    Array.isArray(payload) ||
    typeof (payload as { purpose?: unknown }).purpose !== "string" ||
    typeof (payload as { userId?: unknown }).userId !== "string" ||
    typeof (payload as { email?: unknown }).email !== "string" ||
    typeof (payload as { exp?: unknown }).exp !== "number" ||
    typeof (payload as { iat?: unknown }).iat !== "number" ||
    typeof (payload as { nonce?: unknown }).nonce !== "string"
  ) {
    return null;
  }
  const typed = payload as AccountEmailTokenPayload;
  if (typed.purpose !== expectedPurpose) return null;
  const cap = MAX_TTL_SECONDS[typed.purpose];
  if (!cap) return null;
  const now = opts.nowSeconds ?? Math.floor(Date.now() / 1000);
  // Reject obvious clock-skew / future-iat fraud (allow 5 minutes slack).
  if (typed.iat > now + 5 * 60) return null;
  // Codex HIGH (2026-05-25): per-purpose max-TTL clamp. Bounds the
  // blast radius of a leaked PREVIOUS rotation secret — even if an
  // attacker mints a fresh token, they cannot mint one with exp
  // beyond MAX_TTL_SECONDS from iat.
  if (typed.exp - typed.iat > cap) return null;
  if (typed.exp <= now) return null;
  return typed;
}
