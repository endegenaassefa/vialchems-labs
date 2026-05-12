/**
 * Phase 10.4 (v4) → Phase 11.1 (v4) — D9 Plaid HMAC → JWKS migration.
 *
 * Plaid's production webhook signing scheme is JWT (ES256) with the
 * public key fetched from the verification-key endpoint. Phase 11.1
 * upgrades the stub structural pre-flight to a full ES256 signature
 * verification via the `jose` package.
 *
 *   - pickVerificationMode(env): 'hmac' (default) | 'jwks'
 *   - verifyPlaidJwt(input): full structural pre-flight + body-hash
 *     check + ES256 signature verification against the JWKS-fetched
 *     public key.
 *
 * Iron Law 2.5 / 2.19: this file is on the protected paths list as
 * payment-rail-adjacent code.
 */
import crypto from "node:crypto";
import { importJWK, jwtVerify } from "jose";

export type VerificationMode = "hmac" | "jwks";

export function pickVerificationMode(env: {
  PLAID_VERIFICATION_MODE?: string;
}): VerificationMode {
  return env.PLAID_VERIFICATION_MODE === "jwks" ? "jwks" : "hmac";
}

export interface PlaidJwksKey {
  kty: string;
  crv: string;
  x: string;
  y: string;
  alg?: string;
  use?: string;
  kid?: string;
}

export interface PlaidJwtVerifyInput {
  rawBody: string;
  /** Value of the `Plaid-Verification` header (full JWT). */
  jwtHeader: string | undefined;
  /**
   * Caller-supplied fetcher: given a `kid`, return the matching JWKS
   * entry or null. Lets tests stub the network without crypto deps.
   */
  jwksFetcher: (kid: string) => Promise<PlaidJwksKey | null>;
  /** Override Date.now for deterministic clock-skew tests. */
  nowMs?: number;
}

export type PlaidJwtVerifyResult =
  | { verified: true }
  | {
      verified: false;
      reason:
        | "missing_jwt"
        | "malformed_jwt"
        | "missing_kid"
        | "jwks_fetch_failed"
        | "body_hash_mismatch"
        | "expired"
        | "signature_invalid"
        | "verification_unsupported";
    };

interface JwtParts {
  headerB64: string;
  payloadB64: string;
  signatureB64: string;
  header: { alg?: string; kid?: string };
  payload: {
    request_body_sha256?: string;
    iat?: number;
  };
}

function decodeJwt(token: string): JwtParts | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signatureB64] = parts;
  try {
    const header = JSON.parse(
      Buffer.from(headerB64, "base64url").toString("utf8"),
    );
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8"),
    );
    return { headerB64, payloadB64, signatureB64, header, payload };
  } catch {
    return null;
  }
}

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

const MAX_AGE_SECONDS = 5 * 60;

export async function verifyPlaidJwt(
  input: PlaidJwtVerifyInput,
): Promise<PlaidJwtVerifyResult> {
  if (!input.jwtHeader) {
    return { verified: false, reason: "missing_jwt" };
  }
  const decoded = decodeJwt(input.jwtHeader);
  if (!decoded) {
    return { verified: false, reason: "malformed_jwt" };
  }
  if (!decoded.header.kid) {
    return { verified: false, reason: "missing_kid" };
  }

  const key = await input.jwksFetcher(decoded.header.kid);
  if (!key) {
    return { verified: false, reason: "jwks_fetch_failed" };
  }

  const expectedHash = sha256(input.rawBody);
  if (decoded.payload.request_body_sha256 !== expectedHash) {
    return { verified: false, reason: "body_hash_mismatch" };
  }

  const nowSeconds = Math.floor((input.nowMs ?? Date.now()) / 1000);
  if (
    decoded.payload.iat !== undefined &&
    nowSeconds - decoded.payload.iat > MAX_AGE_SECONDS
  ) {
    return { verified: false, reason: "expired" };
  }

  // Phase 11.1: full ES256 signature verification via `jose`.
  try {
    const cryptoKey = await importJWK(
      {
        kty: key.kty,
        crv: key.crv,
        x: key.x,
        y: key.y,
        alg: key.alg ?? "ES256",
        use: key.use ?? "sig",
      },
      key.alg ?? "ES256",
    );
    await jwtVerify(input.jwtHeader, cryptoKey, {
      algorithms: ["ES256"],
      // Plaid does not currently set iss/aud claims on webhook tokens
      // per their docs; if they later do, we'll plumb the expected
      // values through the input shape.
    });
  } catch {
    return { verified: false, reason: "signature_invalid" };
  }

  return { verified: true };
}
