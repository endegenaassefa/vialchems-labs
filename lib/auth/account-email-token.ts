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
  exp?: number; // epoch seconds; set by signAccountEmailToken from ttlSeconds
  nonce?: string;
}

export interface SignOptions {
  ttlSeconds: number;
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
  payload: Omit<AccountEmailTokenPayload, "exp" | "nonce"> &
    Partial<Pick<AccountEmailTokenPayload, "exp" | "nonce">>,
  opts: SignOptions,
): string {
  const secret = readPrimarySecret();
  if (!secret) {
    throw new Error("account_email_token_secret_required");
  }
  const exp =
    payload.exp ?? Math.floor(Date.now() / 1000) + opts.ttlSeconds;
  const nonce = payload.nonce ?? randomBytes(8).toString("hex");
  const normalised: AccountEmailTokenPayload = {
    purpose: payload.purpose,
    userId: payload.userId,
    email: payload.email.trim().toLowerCase(),
    exp,
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
    typeof (payload as { exp?: unknown }).exp !== "number"
  ) {
    return null;
  }
  const typed = payload as AccountEmailTokenPayload & { exp: number };
  if (typed.purpose !== expectedPurpose) return null;
  if (typed.exp <= Math.floor(Date.now() / 1000)) return null;
  return typed;
}
