/**
 * Auth store — password hashing + session token persistence.
 *
 * v5 Phase 7.8 hardening per audit H30 + M26:
 *   - PBKDF2-SHA256 with 100,000 iterations is the v5 LOCKED default
 *     (hashVersion 2). Single-round SHA-256 (hashVersion 1) is retained
 *     ONLY for backward compatibility with hashes stored before this commit,
 *     so existing on-device users do NOT get force-logged-out by the
 *     hardening upgrade.
 *   - Salt-versioning via the AccountUser.hashVersion field (1 | 2) lets
 *     us roll the hash algorithm again without forcing a global re-login;
 *     verifyPassword() dispatches on the stored version.
 *
 * v4 deferred D2 (Supabase auth) to Phase 10. v1.3 shipped a real-feeling
 * account system in the meantime: Zustand + localStorage persist, multi-
 * user-per-device keyed by email. When Supabase wires in (D2 closure), this
 * store becomes a cache for server state — the public API stays the same.
 *
 * Iron Law 2.22 spirit: passwords are hashed (never stored plain) with a
 * memory-hard-ish KDF (PBKDF2-SHA256 100k iterations is the Web Crypto
 * floor; Argon2 isn't in the browser yet). But this is still browser-side
 * storage — anyone with the device has access. The honest positioning
 * ("pre-launch · server auth wires before public launch") stays surfaced
 * in the UI so users know.
 *
 * SCANNER_OK: reviewed-and-cso-passed (PROTECTED PATH — Iron Law 2.5 / 2.19).
 */
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { QualificationRole } from "@/lib/customer-qualification";

export interface SavedAddress {
  id: string;
  label: string;
  name: string;
  street: string;
  street2: string;
  city: string;
  stateCode: string;
  zip: string;
  countryCode: string;
}

/**
 * Latest hash version. New accounts are created at this version; older
 * records continue to verify against their stored version.
 */
export const HASH_VERSION_LATEST = 2 as const;

/** PBKDF2 iteration count for hashVersion 2. */
const PBKDF2_ITERATIONS = 100_000;

/** PBKDF2 derived-bits length (bits). 256 bits = 32 bytes = 64 hex chars. */
const PBKDF2_BITS = 256;

export type HashVersion = 1 | 2;

export interface AccountUser {
  id: string;
  email: string;
  role: QualificationRole;
  displayName: string;
  /**
   * Password hash. Format depends on hashVersion:
   *   - v1: hex digest of SHA-256(password + salt).
   *   - v2: hex digest of PBKDF2-SHA256(password, salt-bytes, iterations).
   */
  passwordHash: string;
  /** Per-account salt (hex string of random bytes). */
  salt: string;
  /**
   * Hashing scheme used to produce passwordHash. Optional for backward
   * compat: records persisted before Phase 7.8 do not have this field and
   * are treated as v1. New records are written at HASH_VERSION_LATEST.
   */
  hashVersion?: HashVersion;
  /** Iteration count (v2 only). */
  iterations?: number;
  createdAt: string;
  qualified: boolean;
  qualifiedAt: string | null;
  addresses: SavedAddress[];
  newsletterOptIn: boolean;
}

/**
 * Structured result of a hashPassword() call. The fields land directly on
 * AccountUser when persisting.
 */
export interface PasswordHashResult {
  version: HashVersion;
  salt: string;
  hash: string;
  iterations?: number;
}

interface AuthState {
  /** Map of email → user record. */
  users: Record<string, AccountUser>;
  /** Email of the currently signed-in user, or null. */
  currentEmail: string | null;
  _hasHydrated: boolean;
  setHydrated: (v: boolean) => void;

  /** Throws if email already exists. */
  signup: (input: {
    email: string;
    password: string;
    role: QualificationRole;
    displayName: string;
    newsletterOptIn?: boolean;
  }) => Promise<AccountUser>;

  /** Returns user on success, throws on bad credentials. */
  login: (input: { email: string; password: string }) => Promise<AccountUser>;

  /** Clears currentEmail (does not delete the user). */
  logout: () => void;

  /** Returns the current user, or null if signed out. */
  getCurrentUser: () => AccountUser | null;

  /** Marks the current user as qualified (called after qualification flow). */
  markQualified: () => void;

  /** Adds a saved address to the current user. */
  addAddress: (address: Omit<SavedAddress, "id">) => SavedAddress;

  /** Updates newsletter opt-in for the current user. */
  setNewsletterOptIn: (v: boolean) => void;

  /** Updates display name for the current user. */
  setDisplayName: (name: string) => void;
}

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as { randomUUID: () => string }).randomUUID();
  }
  return (
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10)
  );
}

function genSalt(): string {
  const arr = new Uint8Array(16);
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < arr.length; i++)
      arr[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  if (hex.length % 2 !== 0) {
    // Defensive: pad/trim so the function never throws on a malformed input.
    // Callers should always pass even-length hex (genSalt does).
    hex = hex.length > 0 ? hex.padStart(hex.length + 1, "0") : "";
  }
  // Allocate over a plain ArrayBuffer (not SharedArrayBuffer) so the result
  // satisfies Web Crypto's BufferSource type on strict TS lib settings.
  const buf = new ArrayBuffer(hex.length / 2);
  const out = new Uint8Array(buf);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function bytesToHex(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) {
    s += bytes[i].toString(16).padStart(2, "0");
  }
  return s;
}

/**
 * Hash a password against a salt using the requested scheme.
 *
 * @param password   plaintext password
 * @param salt       per-account salt (hex string of random bytes)
 * @param version    hash scheme; defaults to HASH_VERSION_LATEST (2 / PBKDF2)
 *
 * v1 = legacy single-round SHA-256(password + salt) (retained for backward
 *      compatibility with pre-Phase-7.8 records; do NOT pick for new hashes).
 * v2 = PBKDF2-SHA256 with PBKDF2_ITERATIONS rounds, 256-bit output.
 */
export async function hashPassword(
  password: string,
  salt: string,
  version: HashVersion = HASH_VERSION_LATEST,
): Promise<PasswordHashResult> {
  const encoder = new TextEncoder();

  if (version === 1) {
    // Legacy: single-round SHA-256(password || salt-hex).
    // The original implementation concatenated the salt as its hex string,
    // not as raw bytes. Preserve that bit-exact format so existing hashes
    // still verify.
    const data = encoder.encode(password + salt);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return {
      version: 1,
      salt,
      hash: bytesToHex(new Uint8Array(buf)),
    };
  }

  // Version 2: PBKDF2-SHA256, PBKDF2_ITERATIONS iterations, 256-bit output.
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );
  const saltBytes = hexToBytes(salt);
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    PBKDF2_BITS,
  );
  return {
    version: 2,
    salt,
    hash: bytesToHex(new Uint8Array(derivedBits)),
    iterations: PBKDF2_ITERATIONS,
  };
}

/**
 * Verify a plaintext password against a stored AccountUser record.
 *
 * Reads hashVersion from the record (defaults to 1 for pre-Phase-7.8
 * records that don't carry the field). Re-derives the hash using the
 * stored salt and version, and constant-time compares against the
 * stored passwordHash.
 *
 * Returns false (never throws) on any mismatch — including malformed
 * inputs — so the caller doesn't have to wrap in try/catch.
 */
export async function verifyPassword(
  password: string,
  stored: Pick<AccountUser, "passwordHash" | "salt"> & {
    hashVersion?: HashVersion;
    iterations?: number;
  },
): Promise<boolean> {
  const version: HashVersion = stored.hashVersion ?? 1;
  try {
    const recomputed = await hashPassword(password, stored.salt, version);
    return constantTimeEqual(recomputed.hash, stored.passwordHash);
  } catch {
    return false;
  }
}

/**
 * Constant-time string comparison. Returns false on length mismatch
 * (length is not secret), then XOR-accumulates byte differences so the
 * compare time depends only on the input length, not on where the
 * mismatch sits.
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: {},
      currentEmail: null,
      _hasHydrated: false,
      setHydrated: (v) => set({ _hasHydrated: v }),

      signup: async ({
        email,
        password,
        role,
        displayName,
        newsletterOptIn = true,
      }) => {
        const key = normalizeEmail(email);
        if (get().users[key]) {
          throw new Error(
            "An account already exists for this email. Sign in instead.",
          );
        }
        if (password.length < 8) {
          throw new Error("Password must be at least 8 characters.");
        }
        const salt = genSalt();
        // New accounts always use HASH_VERSION_LATEST.
        const result = await hashPassword(password, salt, HASH_VERSION_LATEST);
        const user: AccountUser = {
          id: uuid(),
          email: key,
          role,
          displayName: displayName.trim() || key.split("@")[0],
          passwordHash: result.hash,
          salt: result.salt,
          hashVersion: result.version,
          iterations: result.iterations,
          createdAt: new Date().toISOString(),
          qualified: false,
          qualifiedAt: null,
          addresses: [],
          newsletterOptIn,
        };
        set((state) => ({
          users: { ...state.users, [key]: user },
          currentEmail: key,
        }));
        return user;
      },

      login: async ({ email, password }) => {
        const key = normalizeEmail(email);
        const user = get().users[key];
        if (!user) {
          throw new Error("No account found for that email. Create one first.");
        }
        const ok = await verifyPassword(password, user);
        if (!ok) {
          throw new Error("Wrong password. Try again or reset.");
        }
        set({ currentEmail: key });
        return user;
      },

      logout: () => set({ currentEmail: null }),

      getCurrentUser: () => {
        const { currentEmail, users } = get();
        if (!currentEmail) return null;
        return users[currentEmail] ?? null;
      },

      markQualified: () => {
        const { currentEmail, users } = get();
        if (!currentEmail || !users[currentEmail]) return;
        const updated = {
          ...users[currentEmail],
          qualified: true,
          qualifiedAt: new Date().toISOString(),
        };
        set({ users: { ...users, [currentEmail]: updated } });
      },

      addAddress: (address) => {
        const newAddr: SavedAddress = { ...address, id: uuid() };
        const { currentEmail, users } = get();
        if (!currentEmail || !users[currentEmail]) return newAddr;
        const updated = {
          ...users[currentEmail],
          addresses: [...users[currentEmail].addresses, newAddr],
        };
        set({ users: { ...users, [currentEmail]: updated } });
        return newAddr;
      },

      setNewsletterOptIn: (v) => {
        const { currentEmail, users } = get();
        if (!currentEmail || !users[currentEmail]) return;
        const updated = { ...users[currentEmail], newsletterOptIn: v };
        set({ users: { ...users, [currentEmail]: updated } });
      },

      setDisplayName: (name) => {
        const { currentEmail, users } = get();
        if (!currentEmail || !users[currentEmail]) return;
        const updated = { ...users[currentEmail], displayName: name.trim() };
        set({ users: { ...users, [currentEmail]: updated } });
      },
    }),
    {
      name: "vialchemlabs:auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        users: state.users,
        currentEmail: state.currentEmail,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export const useAuthHydrated = () => useAuthStore((s) => s._hasHydrated);
export const useCurrentUser = () =>
  useAuthStore((s) =>
    s.currentEmail ? (s.users[s.currentEmail] ?? null) : null,
  );
