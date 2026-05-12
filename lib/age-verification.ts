import { isProductionRuntime } from "@/lib/runtime-env";

export const AGE_VERIFICATION_STORAGE_KEY = "vcl_age_verified";
export const AGE_VERIFICATION_COOKIE = "vcl_age_verified";
export const AGE_VERIFICATION_DAYS = 30;
export const AGE_VERIFICATION_MAX_AGE_SECONDS =
  AGE_VERIFICATION_DAYS * 24 * 60 * 60;
export const AGE_GATE_PATH = "/age-gate";
export const AGE_GATE_GOODBYE_URL = "https://www.google.com";

export function isAgeVerificationCurrent(value: string | undefined | null) {
  if (!value) return false;

  const verifiedAt = Date.parse(value);
  if (!Number.isFinite(verifiedAt)) return false;

  const expiresAt = verifiedAt + AGE_VERIFICATION_MAX_AGE_SECONDS * 1000;
  return expiresAt > Date.now();
}

export function normalizeAgeGateNext(value: string | undefined | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  if (value.startsWith(AGE_GATE_PATH)) return "/";
  return value;
}

function base64UrlEncode(bytes: ArrayBuffer): string {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecode(value: string): ArrayBuffer {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  );
}

function getAgeGateSecret(): string {
  const secret = process.env.AGE_GATE_SECRET;
  if (!secret && isProductionRuntime()) {
    throw new Error(
      "age_gate_secret_required: AGE_GATE_SECRET must be set in production.",
    );
  }
  return secret ?? "dev-only-age-gate-secret";
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getAgeGateSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signAgeVerification(
  verifiedAt = new Date().toISOString(),
): Promise<string> {
  const key = await hmacKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(verifiedAt),
  );
  return `${verifiedAt}.${base64UrlEncode(signature)}`;
}

export async function verifyAgeVerificationCookie(
  value: string | undefined | null,
): Promise<string | null> {
  if (!value) return null;
  const separator = value.lastIndexOf(".");
  if (separator <= 0) return null;

  const verifiedAt = value.slice(0, separator);
  const signature = value.slice(separator + 1);
  if (!isAgeVerificationCurrent(verifiedAt) || !signature) return null;

  const key = await hmacKey();
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlDecode(signature),
    new TextEncoder().encode(verifiedAt),
  );
  return ok ? verifiedAt : null;
}

export async function isSignedAgeVerificationCurrent(
  value: string | undefined | null,
): Promise<boolean> {
  return (await verifyAgeVerificationCookie(value)) !== null;
}
