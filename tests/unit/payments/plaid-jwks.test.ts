import { describe, expect, it, vi, beforeEach } from "vitest";
import crypto from "node:crypto";
import {
  verifyPlaidJwt,
  pickVerificationMode,
} from "@/lib/payments/plaid-jwks";

function b64url(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf
    .toString("base64")
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Build an ES256-signed JWT manually so we don't depend on jose's
 * SignJWT (which has a webapi quirk in v6 around the payload encoding
 * inside our test runtime). This mirrors exactly what Plaid's
 * verification-key endpoint signs.
 */
function makeES256SignedJwt(opts: {
  privateKey: crypto.KeyObject;
  payload: Record<string, unknown>;
  kid: string;
}): string {
  const header = { alg: "ES256", typ: "JWT", kid: opts.kid };
  const headerB64 = b64url(JSON.stringify(header));
  const payloadB64 = b64url(JSON.stringify(opts.payload));
  const signingInput = `${headerB64}.${payloadB64}`;
  const der = crypto
    .createSign("SHA256")
    .update(signingInput)
    .sign({ key: opts.privateKey, dsaEncoding: "ieee-p1363" });
  return `${signingInput}.${b64url(der)}`;
}

function makeES256KeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ec", {
    namedCurve: "P-256",
  });
  const publicJwk = publicKey.export({ format: "jwk" });
  return { publicJwk, privateKey };
}

/**
 * Phase 10.4 (v4) — D9 Plaid HMAC → JWKS migration.
 *
 * The helper verifies Plaid's webhook JWT against a fetched JWKS. Day-1
 * still defaults to HMAC (set via PLAID_VERIFICATION_MODE='hmac' or
 * unset). Production should set 'jwks'.
 *
 * The unit tests below cover the mode selector + the JWT structural
 * preconditions. End-to-end JWT signature verification depends on a
 * real Plaid-issued token + JWKS fetch, which Phase 13 verifies live.
 */

describe("pickVerificationMode", () => {
  it('returns "hmac" by default', () => {
    expect(pickVerificationMode({})).toBe("hmac");
  });

  it('returns "jwks" when PLAID_VERIFICATION_MODE=jwks', () => {
    expect(pickVerificationMode({ PLAID_VERIFICATION_MODE: "jwks" })).toBe(
      "jwks",
    );
  });

  it('returns "hmac" when value is anything else', () => {
    expect(pickVerificationMode({ PLAID_VERIFICATION_MODE: "whatever" })).toBe(
      "hmac",
    );
  });
});

describe("verifyPlaidJwt structural preconditions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("rejects when no signature header is present", async () => {
    const result = await verifyPlaidJwt({
      rawBody: "{}",
      jwtHeader: undefined,
      jwksFetcher: vi.fn(),
    });
    expect(result.verified).toBe(false);
    if (!result.verified) expect(result.reason).toBe("missing_jwt");
  });

  it("rejects when JWT is malformed (not three dot-segments)", async () => {
    const result = await verifyPlaidJwt({
      rawBody: "{}",
      jwtHeader: "not.a.valid.jwt.at.all",
      jwksFetcher: vi.fn(),
    });
    expect(result.verified).toBe(false);
    if (!result.verified) expect(result.reason).toBe("malformed_jwt");
  });

  it("rejects when JWT header lacks a kid", async () => {
    // base64url('{"alg":"ES256"}') = eyJhbGciOiJFUzI1NiJ9
    const header = Buffer.from(JSON.stringify({ alg: "ES256" })).toString(
      "base64url",
    );
    const payload = Buffer.from(JSON.stringify({})).toString("base64url");
    const jwt = `${header}.${payload}.fake-signature`;
    const result = await verifyPlaidJwt({
      rawBody: "{}",
      jwtHeader: jwt,
      jwksFetcher: vi.fn(),
    });
    expect(result.verified).toBe(false);
    if (!result.verified) expect(result.reason).toBe("missing_kid");
  });

  it("calls the jwksFetcher with the kid and rejects when no key returned", async () => {
    const header = Buffer.from(
      JSON.stringify({ alg: "ES256", kid: "abc" }),
    ).toString("base64url");
    const payload = Buffer.from(JSON.stringify({})).toString("base64url");
    const jwt = `${header}.${payload}.fake-signature`;
    const fetcher = vi.fn().mockResolvedValue(null);
    const result = await verifyPlaidJwt({
      rawBody: "{}",
      jwtHeader: jwt,
      jwksFetcher: fetcher,
    });
    expect(fetcher).toHaveBeenCalledWith("abc");
    expect(result.verified).toBe(false);
    if (!result.verified) expect(result.reason).toBe("jwks_fetch_failed");
  });

  it("returns verified:true for a real ES256-signed JWT whose body hash matches", async () => {
    const { publicJwk, privateKey } = makeES256KeyPair();
    const rawBody = '{"webhook_type":"TRANSFER","webhook_code":"POSTED"}';
    const bodyHash = crypto.createHash("sha256").update(rawBody).digest("hex");
    const jwt = makeES256SignedJwt({
      privateKey,
      payload: {
        request_body_sha256: bodyHash,
        iat: Math.floor(Date.now() / 1000),
      },
      kid: "phase-11-test-kid",
    });

    const result = await verifyPlaidJwt({
      rawBody,
      jwtHeader: jwt,
      jwksFetcher: vi.fn().mockResolvedValue({
        kty: publicJwk.kty!,
        crv: publicJwk.crv!,
        x: publicJwk.x!,
        y: publicJwk.y!,
        alg: "ES256",
      }),
    });
    expect(result.verified).toBe(true);
  });

  it("returns signature_invalid when ES256 verification fails (tampered signature)", async () => {
    const { publicJwk, privateKey } = makeES256KeyPair();
    const rawBody = "body";
    const bodyHash = crypto.createHash("sha256").update(rawBody).digest("hex");
    const jwt = makeES256SignedJwt({
      privateKey,
      payload: {
        request_body_sha256: bodyHash,
        iat: Math.floor(Date.now() / 1000),
      },
      kid: "kid-1",
    });
    // Tamper the signature segment.
    const parts = jwt.split(".");
    const tamperedJwt = `${parts[0]}.${parts[1]}.AAAA${parts[2].slice(4)}`;

    const result = await verifyPlaidJwt({
      rawBody,
      jwtHeader: tamperedJwt,
      jwksFetcher: vi.fn().mockResolvedValue({
        kty: publicJwk.kty!,
        crv: publicJwk.crv!,
        x: publicJwk.x!,
        y: publicJwk.y!,
        alg: "ES256",
      }),
    });
    expect(result.verified).toBe(false);
    if (!result.verified) expect(result.reason).toBe("signature_invalid");
  });

  it("rejects when request_body_sha256 claim does not match the raw body", async () => {
    const header = Buffer.from(
      JSON.stringify({ alg: "ES256", kid: "abc" }),
    ).toString("base64url");
    const claims = Buffer.from(
      JSON.stringify({
        request_body_sha256: "not-the-real-hash",
        iat: Math.floor(Date.now() / 1000),
      }),
    ).toString("base64url");
    const jwt = `${header}.${claims}.signature`;
    const result = await verifyPlaidJwt({
      rawBody: "real-body",
      jwtHeader: jwt,
      jwksFetcher: vi.fn().mockResolvedValue({
        kty: "EC",
        crv: "P-256",
        x: "placeholder",
        y: "placeholder",
      }),
    });
    expect(result.verified).toBe(false);
    if (!result.verified) expect(result.reason).toBe("body_hash_mismatch");
  });
});
