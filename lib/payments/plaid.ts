/**
 * Plaid ACH payment adapter.
 *
 * Day-1 ACH rail. 5% discount, 3-4 day clearance. Plaid Link mints a public
 * token in the browser; the server exchanges it for a permanent access token
 * and creates a Transfer via /transfer/create with ACH PPD debit.
 *
 * Webhook verification: Plaid production uses JWT-based verification via the
 * `plaid-verification` header (ES256 / JWKS). Legacy HMAC mode retained for
 * sandbox / migration. Branch on PLAID_VERIFICATION_MODE env (default: 'jwks').
 * JWKS implementation in ./plaid-jwks.ts; HMAC retained inline as verifyPlaidHmac.
 *
 * Plaid event mapping:
 *   AUTH (item-ready / numbers ready)        → authorized
 *   TRANSFER posted / settled / completed    → paid
 *   TRANSFER returned / failed / canceled    → failed
 */
import crypto from "node:crypto";
import { pickVerificationMode, verifyPlaidJwt } from "./plaid-jwks";
import type { PlaidJwksKey } from "./plaid-jwks";
import type {
  CreateIntentInput,
  PaymentIntent,
  PaymentProvider,
  PaymentStatus,
  WebhookResult,
} from "./types";

const STUB_VALUES = new Set([
  "",
  "stub_plaid_client_id",
  "stub_plaid_secret",
  "stub_plaid_webhook_verification_key",
]);

function isStub(value: string | undefined): boolean {
  if (value === undefined) return true;
  return STUB_VALUES.has(value);
}

export interface PlaidEnv {
  PLAID_CLIENT_ID?: string;
  PLAID_SECRET?: string;
  PLAID_ENV?: string;
  PLAID_WEBHOOK_VERIFICATION_KEY?: string;
  /** 'jwks' (default, production) or 'hmac' (legacy / sandbox). */
  PLAID_VERIFICATION_MODE?: string;
  /**
   * Test/dev-only static JWKS: a stringified object mapping kid → PlaidJwksKey.
   * Production should leave this unset; a future hook can wire the
   * verification-key endpoint here.
   */
  PLAID_JWKS_KEYS?: string;
}

export interface PlaidAdapterOptions {
  env?: PlaidEnv;
}

export function envIsConfigured(env: PlaidEnv): boolean {
  return !isStub(env.PLAID_CLIENT_ID) && !isStub(env.PLAID_SECRET);
}

/**
 * Maps a Plaid event/code string to local PaymentIntent status.
 *
 * Conservative — anything we don't recognize stays 'pending'. Plaid uses
 * separate `webhook_type` (AUTH / TRANSFER) and `webhook_code` (e.g.
 * AUTOMATICALLY_VERIFIED, POSTED, RETURNED) fields; this normaliser accepts
 * either a code or a colon-joined tuple.
 */
export function mapPlaidStatus(eventCode: string): PaymentStatus {
  const normalized = eventCode.toUpperCase();
  if (
    normalized.includes("POSTED") ||
    normalized.includes("SETTLED") ||
    normalized.includes("COMPLETED") ||
    normalized.includes("SUCCESS")
  ) {
    return "paid";
  }
  if (
    normalized.includes("RETURNED") ||
    normalized.includes("FAILED") ||
    normalized.includes("CANCELED") ||
    normalized.includes("CANCELLED") ||
    normalized.includes("REJECTED")
  ) {
    return "failed";
  }
  if (
    normalized.includes("AUTH") ||
    normalized.includes("VERIFIED") ||
    normalized.includes("READY") ||
    normalized.includes("PENDING_ADMIN_APPROVAL")
  ) {
    return "authorized";
  }
  return "pending";
}

/**
 * Legacy HMAC verification path. Retained for sandbox + migration; the
 * default production path is JWKS via verifyPlaidJwt (see plaid-jwks.ts).
 *
 * Header carries `sha256=<hex>`; constant-time compare via timingSafeEqual.
 */
export function verifyPlaidHmac(
  rawBody: string,
  signatureHeader: string | undefined,
  key: string,
): boolean {
  if (!signatureHeader || !key) return false;
  const provided = signatureHeader.startsWith("sha256=")
    ? signatureHeader.slice("sha256=".length)
    : signatureHeader;
  const expected = crypto
    .createHmac("sha256", key)
    .update(rawBody)
    .digest("hex");
  if (provided.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(provided, "hex"),
      Buffer.from(expected, "hex"),
    );
  } catch {
    return false;
  }
}

/**
 * Backwards-compatible alias. Older callers imported `verifyPlaidSignature`;
 * Phase 3.1 renamed the primary name to verifyPlaidHmac to make the
 * verification scheme explicit alongside the JWKS branch.
 */
export const verifyPlaidSignature = verifyPlaidHmac;

/**
 * JWKS fetcher with two tiers:
 *
 *   1. STATIC map from `PLAID_JWKS_KEYS` env (stringified `{ kid → key }`).
 *      Tests use this; operators can use it to pin a key during incident
 *      response if the live endpoint is degraded.
 *
 *   2. LIVE fetch against Plaid's `/webhook_verification_key/get` endpoint
 *      (Phase 14, codex B5), authenticated with PLAID_CLIENT_ID + PLAID_SECRET,
 *      cached in-memory for ~24h. Without this tier, every production Plaid
 *      webhook fails with `jwks_fetch_failed` (the pre-Phase-14 behavior).
 *
 * Cache is per-process (Vercel instance). On cold-start, the first webhook
 * for each kid pays one Plaid round-trip; subsequent webhooks short-circuit.
 *
 * Iron Law 2.30: webhook signature verification on ALL payment rails.
 */
const jwksCache = new Map<string, { key: PlaidJwksKey; expiresAt: number }>();
const JWKS_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/** Test-only: drop the cache so suites don't bleed state. */
export function _resetPlaidJwksCacheForTests(): void {
  jwksCache.clear();
}

export interface JwksFetcherOptions {
  /** Override fetch for testing. Defaults to global fetch. */
  fetchImpl?: typeof fetch;
}

// plaidBaseUrl is defined further down in this file (alongside createIntent),
// where it has lived since Phase 3.1. Re-use it here.

async function fetchAndCachePlaidKey(
  kid: string,
  env: PlaidEnv,
  fetchImpl: typeof fetch,
): Promise<PlaidJwksKey | null> {
  const clientId = env.PLAID_CLIENT_ID;
  const secret = env.PLAID_SECRET;
  if (!clientId || !secret) return null;

  try {
    const res = await fetchImpl(
      `${plaidBaseUrl(env)}/webhook_verification_key/get`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          secret,
          key_id: kid,
        }),
      },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as { key?: PlaidJwksKey };
    if (!data.key) return null;

    jwksCache.set(kid, {
      key: data.key,
      expiresAt: Date.now() + JWKS_CACHE_TTL_MS,
    });
    return data.key;
  } catch {
    return null;
  }
}

export function buildJwksFetcher(
  env: PlaidEnv,
  options: JwksFetcherOptions = {},
) {
  const fetchImpl = options.fetchImpl ?? fetch;
  return async (kid: string): Promise<PlaidJwksKey | null> => {
    // Tier 1: static map.
    const raw = env.PLAID_JWKS_KEYS;
    if (raw) {
      try {
        const map = JSON.parse(raw) as Record<string, PlaidJwksKey>;
        if (map[kid]) return map[kid];
      } catch {
        // Malformed JSON — fall through to live fetch.
      }
    }

    // Tier 2: in-memory cache from a previous live fetch.
    const cached = jwksCache.get(kid);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.key;
    }

    // Tier 3: live fetch + cache.
    return fetchAndCachePlaidKey(kid, env, fetchImpl);
  };
}

export interface PlaidVerifyResult {
  verified: boolean;
  reason?: string;
}

/**
 * Top-level webhook verifier. Branches on PLAID_VERIFICATION_MODE:
 *   - 'jwks' (default, production): ES256 JWT via the `plaid-verification`
 *     header, with body-hash + iat skew + JWKS-fetched key.
 *   - 'hmac' (legacy, sandbox): HMAC-SHA256 over the raw body using
 *     PLAID_WEBHOOK_VERIFICATION_KEY.
 *
 * Unknown modes throw a clear error; callers should not silently fall through.
 */
export async function verifyPlaidWebhook(
  rawBody: string,
  headers: Record<string, string>,
  env: PlaidEnv = process.env as PlaidEnv,
): Promise<PlaidVerifyResult> {
  // pickVerificationMode also throws on unknown values.
  const mode = pickVerificationMode({
    PLAID_VERIFICATION_MODE: env.PLAID_VERIFICATION_MODE,
  });

  // `headersToRecord` (lib/payments/server.ts) lowercases all keys before
  // calling adapters, so production traffic only hits the lowercase keys.
  // Direct callers (verifyPlaidWebhook is also exported) may pass mixed
  // case; we normalize once here to be tolerant without dead chains.
  // M5 closure (Phase 8).
  const lowered: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers)) {
    lowered[k.toLowerCase()] = v;
  }
  const jwtHeader =
    lowered["plaid-verification"] ?? lowered["x-plaid-signature"];

  if (mode === "jwks") {
    if (!jwtHeader) {
      return { verified: false, reason: "missing_plaid_verification_header" };
    }
    try {
      const result = await verifyPlaidJwt({
        rawBody,
        jwtHeader,
        jwksFetcher: buildJwksFetcher(env),
      });
      if (result.verified) return { verified: true };
      return { verified: false, reason: `jwt_verify_failed: ${result.reason}` };
    } catch (err) {
      return {
        verified: false,
        reason: `jwt_verify_failed: ${(err as Error).message}`,
      };
    }
  }

  // mode === 'hmac'
  const key = env.PLAID_WEBHOOK_VERIFICATION_KEY ?? "";
  const ok = verifyPlaidHmac(rawBody, jwtHeader, key);
  return ok
    ? { verified: true }
    : { verified: false, reason: "hmac_verify_failed" };
}

interface PlaidWebhookPayload {
  webhook_type?: string;
  webhook_code?: string;
  transfer_id?: string;
  item_id?: string;
  metadata?: Record<string, string>;
}

interface PlaidTransferCreateResponse {
  transfer?: {
    id: string;
    status?: string;
    amount?: string;
    iso_currency_code?: string;
  };
}

/**
 * Response shape from Plaid `POST /transfer/get`. Documented at
 * https://plaid.com/docs/api/products/transfer/reading-transfers/#transferget
 * — same `transfer` object shape as `/transfer/create`, with a richer
 * status set (pending, posted, settled, returned, failed, cancelled).
 */
interface PlaidTransferGetResponse {
  transfer?: {
    id: string;
    status?: string;
    amount?: string;
    iso_currency_code?: string;
    metadata?: Record<string, string>;
    created?: string;
  };
}

function plaidBaseUrl(env: PlaidEnv): string {
  const e = (env.PLAID_ENV ?? "sandbox").toLowerCase();
  if (e === "production") return "https://production.plaid.com";
  if (e === "development") return "https://development.plaid.com";
  return "https://sandbox.plaid.com";
}

export function createPlaidAdapter(
  options: PlaidAdapterOptions = {},
): PaymentProvider {
  const env: PlaidEnv = options.env ?? {
    PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
    PLAID_SECRET: process.env.PLAID_SECRET,
    PLAID_ENV: process.env.PLAID_ENV,
    PLAID_WEBHOOK_VERIFICATION_KEY: process.env.PLAID_WEBHOOK_VERIFICATION_KEY,
    PLAID_VERIFICATION_MODE: process.env.PLAID_VERIFICATION_MODE,
    PLAID_JWKS_KEYS: process.env.PLAID_JWKS_KEYS,
  };

  return {
    id: "plaid",

    /**
     * Creates a Plaid Transfer (ACH PPD debit) and returns a normalized
     * PaymentIntent.
     *
     * Required input.metadata fields (forwarded from the Plaid Link
     * exchange that the caller performs before invoking this):
     *   - access_token: permanent token bound to the customer item
     *   - account_id:   the bank account selected in Link
     * Optional:
     *   - idempotency_key: forwarded to Plaid; defaults to orderId.
     */
    async createIntent(input: CreateIntentInput): Promise<PaymentIntent> {
      if (!envIsConfigured(env)) {
        throw new Error(
          "payment_provider_not_configured: PLAID_CLIENT_ID and PLAID_SECRET must be set to non-stub values (plaid_not_configured).",
        );
      }

      const baseUrl = plaidBaseUrl(env);
      const amount = (input.amountCents / 100).toFixed(2);
      const idempotencyKey = input.metadata?.idempotency_key ?? input.orderId;

      const body = {
        client_id: env.PLAID_CLIENT_ID,
        secret: env.PLAID_SECRET,
        access_token: input.metadata?.access_token,
        account_id: input.metadata?.account_id,
        amount,
        iso_currency_code: "USD",
        description:
          input.metadata?.description ?? "vialchemlabs research order",
        ach_class: "ppd",
        type: "debit",
        network: "ach",
        idempotency_key: idempotencyKey,
        user: {
          legal_name: input.metadata?.legal_name ?? input.customerEmail,
        },
      } as const;

      let res: Response;
      try {
        res = await fetch(`${baseUrl}/transfer/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } catch (err) {
        throw new Error(
          `plaid_transfer_create_failed: network error ${(err as Error).message}`,
        );
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "<unreadable>");
        throw new Error(
          `plaid_transfer_create_failed: HTTP ${res.status} ${text.slice(0, 256)}`,
        );
      }

      const json = (await res.json()) as PlaidTransferCreateResponse;
      const transfer = json.transfer;
      if (!transfer?.id) {
        throw new Error(
          "plaid_transfer_create_failed: response missing transfer.id",
        );
      }

      const ts = new Date().toISOString();
      const intent: PaymentIntent = {
        id: transfer.id,
        provider: "plaid",
        method: "ach",
        amountCents: input.amountCents,
        currency: "USD",
        status: mapPlaidStatus(transfer.status ?? "pending"),
        metadata: {
          ...(input.metadata ?? {}),
          ...(transfer.status ? { plaid_status: transfer.status } : {}),
        },
        createdAt: ts,
        updatedAt: ts,
        externalId: transfer.id,
      };
      return intent;
    },

    /**
     * Status poll against Plaid `POST /transfer/get`. Returns null when:
     *   - env is stubbed (cannot reach Plaid)
     *   - transfer is not found (404 or item_not_found error)
     * Throws `plaid_transfer_get_failed` on any other error so callers can
     * distinguish "missing" from "infrastructure broken". M19 closure
     * (Phase 8) — earlier path returned null unconditionally with a TODO.
     */
    async getIntent(intentId: string): Promise<PaymentIntent | null> {
      if (!envIsConfigured(env)) return null;

      const baseUrl = plaidBaseUrl(env);
      const url = `${baseUrl}/transfer/get`;

      let res: Response;
      try {
        res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: env.PLAID_CLIENT_ID,
            secret: env.PLAID_SECRET,
            transfer_id: intentId,
          }),
          cache: "no-store",
        });
      } catch (err) {
        throw new Error(
          `plaid_transfer_get_failed: network error ${(err as Error).message}`,
        );
      }

      if (res.status === 404) return null;
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        // Plaid emits item_not_found / transfer_not_found as 400 with a
        // JSON error_code; surface those as null for clean polling UX.
        if (/transfer_not_found|item_not_found/i.test(text)) return null;
        throw new Error(
          `plaid_transfer_get_failed: HTTP ${res.status} ${text.slice(0, 256)}`,
        );
      }

      const json = (await res.json()) as PlaidTransferGetResponse;
      const transfer = json.transfer;
      if (!transfer?.id) return null;

      const ts = new Date().toISOString();
      const amountNumber =
        typeof transfer.amount === "string"
          ? Number.parseFloat(transfer.amount)
          : 0;

      return {
        id: transfer.id,
        provider: "plaid",
        method: "ach",
        amountCents: Number.isFinite(amountNumber)
          ? Math.round(amountNumber * 100)
          : 0,
        currency: "USD",
        status: mapPlaidStatus(transfer.status ?? "pending"),
        metadata: {
          ...(transfer.metadata ?? {}),
          ...(transfer.status ? { plaid_status: transfer.status } : {}),
        },
        createdAt: transfer.created ?? ts,
        updatedAt: ts,
        externalId: transfer.id,
      };
    },

    async handleWebhook(
      payload: unknown,
      headers: Record<string, string>,
    ): Promise<WebhookResult> {
      const rawBody =
        typeof payload === "string" ? payload : JSON.stringify(payload ?? {});

      let verification: PlaidVerifyResult;
      try {
        verification = await verifyPlaidWebhook(rawBody, headers, env);
      } catch {
        // Unknown verification mode → reject; callers see unverified.
        return { intent: null, eventType: "unverified", verified: false };
      }
      if (!verification.verified) {
        return { intent: null, eventType: "unverified", verified: false };
      }

      let parsed: PlaidWebhookPayload;
      try {
        parsed =
          typeof payload === "string"
            ? (JSON.parse(payload) as PlaidWebhookPayload)
            : ((payload ?? {}) as PlaidWebhookPayload);
      } catch {
        return { intent: null, eventType: "invalid_payload", verified: true };
      }

      const code = parsed.webhook_code ?? "";
      const type = parsed.webhook_type ?? "";
      const eventType = type ? `${type}:${code}` : code || "unknown";
      const status = mapPlaidStatus(`${type}_${code}`);
      const intentId =
        parsed.metadata?.intentId ?? parsed.transfer_id ?? parsed.item_id ?? "";

      if (!intentId) {
        return { intent: null, eventType, verified: true };
      }

      const ts = new Date().toISOString();
      const intent: PaymentIntent = {
        id: intentId,
        provider: "plaid",
        method: "ach",
        amountCents: 0, // populated by reconciliation against the order row
        currency: "USD",
        status,
        metadata: parsed.metadata ?? {},
        createdAt: ts,
        updatedAt: ts,
        externalId: parsed.transfer_id ?? parsed.item_id,
      };

      return { intent, eventType, verified: true };
    },
  };
}
