/**
 * Auth store unit tests — Phase 7.8 (v5 closure) hardening for audit
 * H30 (PBKDF2) + M26 (salt-versioning).
 *
 * Coverage targets:
 *   - hashPassword(password, salt, version): supports legacy v1 (SHA-256) and
 *     new v2 (PBKDF2-SHA256, 100k iterations); default is v2.
 *   - verifyPassword(plaintext, storedUser): dispatches on stored hashVersion.
 *   - signup() creates v2 records by default.
 *   - login() against v1 user records still works (backward compat).
 *   - login() against v2 user records works.
 *   - constant-time comparison (verifyPassword returns false on mismatch
 *     without throwing).
 *   - Store hydration / multi-user / qualification helpers still pass.
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import {
  HASH_VERSION_LATEST,
  hashPassword,
  verifyPassword,
  useAuthStore,
  useAuthHydrated,
  useCurrentUser,
  type AccountUser,
} from "@/lib/auth-store";

const RESET_STATE = () => {
  useAuthStore.setState({ users: {}, currentEmail: null });
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("vialchemlabs:auth");
  }
};

describe("HASH_VERSION_LATEST", () => {
  it("is 2 (PBKDF2-SHA256 default)", () => {
    expect(HASH_VERSION_LATEST).toBe(2);
  });
});

describe("hashPassword()", () => {
  const SAMPLE_SALT_HEX = "0123456789abcdef0123456789abcdef";

  it("returns a structured record with version, salt, hash, and iterations (v2 default)", async () => {
    const result = await hashPassword("hunter2hunter2", SAMPLE_SALT_HEX);
    expect(result.version).toBe(2);
    expect(result.salt).toBe(SAMPLE_SALT_HEX);
    expect(typeof result.hash).toBe("string");
    expect(result.hash.length).toBeGreaterThan(0);
    expect(result.iterations).toBe(100_000);
  });

  it("explicit version 1 produces a SHA-256 hex digest (64 chars) and no iterations", async () => {
    const result = await hashPassword("hunter2hunter2", SAMPLE_SALT_HEX, 1);
    expect(result.version).toBe(1);
    expect(result.hash).toMatch(/^[0-9a-f]{64}$/);
    expect(result.iterations).toBeUndefined();
  });

  it("v1 hash is deterministic for the same password + salt (legacy single-round SHA-256)", async () => {
    const a = await hashPassword("hunter2hunter2", SAMPLE_SALT_HEX, 1);
    const b = await hashPassword("hunter2hunter2", SAMPLE_SALT_HEX, 1);
    expect(a.hash).toBe(b.hash);
  });

  it("v1 hash matches the legacy single-round SHA-256(password+salt) hex format", async () => {
    const result = await hashPassword("hunter2hunter2", SAMPLE_SALT_HEX, 1);
    // Compute the legacy form directly to lock in compat.
    const data = new TextEncoder().encode("hunter2hunter2" + SAMPLE_SALT_HEX);
    const buf = await crypto.subtle.digest("SHA-256", data);
    const expectedHex = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    expect(result.hash).toBe(expectedHex);
  });

  it("v2 hash is deterministic for the same password + salt + iterations", async () => {
    const a = await hashPassword("hunter2hunter2", SAMPLE_SALT_HEX, 2);
    const b = await hashPassword("hunter2hunter2", SAMPLE_SALT_HEX, 2);
    expect(a.hash).toBe(b.hash);
  });

  it("v1 and v2 produce different outputs for the same password + salt", async () => {
    const v1 = await hashPassword("hunter2hunter2", SAMPLE_SALT_HEX, 1);
    const v2 = await hashPassword("hunter2hunter2", SAMPLE_SALT_HEX, 2);
    expect(v1.hash).not.toBe(v2.hash);
  });

  it("different salts produce different hashes (v2)", async () => {
    const a = await hashPassword("hunter2hunter2", "a".repeat(32), 2);
    const b = await hashPassword("hunter2hunter2", "b".repeat(32), 2);
    expect(a.hash).not.toBe(b.hash);
  });

  it("different passwords produce different hashes (v2)", async () => {
    const a = await hashPassword("hunter2hunter2", SAMPLE_SALT_HEX, 2);
    const b = await hashPassword("hunter3hunter3", SAMPLE_SALT_HEX, 2);
    expect(a.hash).not.toBe(b.hash);
  });

  it("default version is HASH_VERSION_LATEST (2)", async () => {
    const explicit = await hashPassword("hunter2hunter2", SAMPLE_SALT_HEX, 2);
    const implicit = await hashPassword("hunter2hunter2", SAMPLE_SALT_HEX);
    expect(implicit.version).toBe(HASH_VERSION_LATEST);
    expect(implicit.hash).toBe(explicit.hash);
  });
});

describe("verifyPassword()", () => {
  const SAMPLE_SALT_HEX = "0123456789abcdef0123456789abcdef";

  it("verifies a v1 stored record (backward compat — existing users keep working)", async () => {
    // Simulate a user created BEFORE Phase 7.8 (legacy single-round SHA-256).
    const data = new TextEncoder().encode("legacy-pw-legacy" + SAMPLE_SALT_HEX);
    const buf = await crypto.subtle.digest("SHA-256", data);
    const legacyHex = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const storedUser: Pick<
      AccountUser,
      "passwordHash" | "salt" | "hashVersion" | "iterations"
    > = {
      passwordHash: legacyHex,
      salt: SAMPLE_SALT_HEX,
      hashVersion: 1,
    };

    expect(await verifyPassword("legacy-pw-legacy", storedUser)).toBe(true);
    expect(await verifyPassword("wrong-password!!", storedUser)).toBe(false);
  });

  it("verifies a v1 stored record where hashVersion is absent (treated as v1)", async () => {
    // Records persisted to localStorage BEFORE Phase 7.8 won't have hashVersion.
    const data = new TextEncoder().encode("legacy-pw-legacy" + SAMPLE_SALT_HEX);
    const buf = await crypto.subtle.digest("SHA-256", data);
    const legacyHex = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const storedUser: Pick<AccountUser, "passwordHash" | "salt"> = {
      passwordHash: legacyHex,
      salt: SAMPLE_SALT_HEX,
    };

    expect(await verifyPassword("legacy-pw-legacy", storedUser)).toBe(true);
    expect(await verifyPassword("wrong-password!!", storedUser)).toBe(false);
  });

  it("verifies a v2 stored record", async () => {
    const h = await hashPassword("v2-password-rocks", SAMPLE_SALT_HEX, 2);
    const storedUser: Pick<
      AccountUser,
      "passwordHash" | "salt" | "hashVersion" | "iterations"
    > = {
      passwordHash: h.hash,
      salt: SAMPLE_SALT_HEX,
      hashVersion: 2,
      iterations: 100_000,
    };

    expect(await verifyPassword("v2-password-rocks", storedUser)).toBe(true);
    expect(await verifyPassword("wrong-password!!", storedUser)).toBe(false);
  });

  it("returns false (not throws) on mismatch", async () => {
    const h = await hashPassword("v2-password-rocks", SAMPLE_SALT_HEX, 2);
    const storedUser: Pick<
      AccountUser,
      "passwordHash" | "salt" | "hashVersion" | "iterations"
    > = {
      passwordHash: h.hash,
      salt: SAMPLE_SALT_HEX,
      hashVersion: 2,
      iterations: 100_000,
    };
    expect(await verifyPassword("definitely-wrong", storedUser)).toBe(false);
  });

  it("returns false when stored hash length differs (constant-time compare guards)", async () => {
    const storedUser: Pick<
      AccountUser,
      "passwordHash" | "salt" | "hashVersion"
    > = {
      passwordHash: "deadbeef", // truncated
      salt: SAMPLE_SALT_HEX,
      hashVersion: 2,
    };
    expect(await verifyPassword("v2-password-rocks", storedUser)).toBe(false);
  });
});

describe("useAuthStore — signup + login (Phase 7.8)", () => {
  beforeEach(() => RESET_STATE());
  afterEach(() => RESET_STATE());

  it("signup creates a user with hashVersion 2 by default", async () => {
    const user = await useAuthStore.getState().signup({
      email: "Alex@example.com",
      password: "supersecret",
      role: "academic-researcher",
      displayName: "Alex",
    });
    expect(user.email).toBe("alex@example.com");
    expect(user.hashVersion).toBe(2);
    expect(user.iterations).toBe(100_000);
    // Hash is hex (PBKDF2 output happens to be 64 chars / 256 bits like
    // SHA-256, so distinguishing by length alone is impossible — assert
    // shape instead and compare to what the legacy v1 hash would have been
    // to prove the algorithm actually changed).
    expect(user.passwordHash).toMatch(/^[0-9a-f]+$/);
    const legacyForm = await hashPassword("supersecret", user.salt, 1);
    expect(user.passwordHash).not.toBe(legacyForm.hash);
    // Salt is still a hex string per genSalt().
    expect(user.salt).toMatch(/^[0-9a-f]{32}$/);
  });

  it("signup rejects duplicates", async () => {
    await useAuthStore.getState().signup({
      email: "dup@example.com",
      password: "supersecret",
      role: "lab-technician",
      displayName: "Dup",
    });
    await expect(
      useAuthStore.getState().signup({
        email: "dup@example.com",
        password: "supersecret",
        role: "lab-technician",
        displayName: "Dup",
      }),
    ).rejects.toThrow(/already exists/i);
  });

  it("signup rejects passwords under 8 characters", async () => {
    await expect(
      useAuthStore.getState().signup({
        email: "short@example.com",
        password: "abc",
        role: "lab-technician",
        displayName: "Short",
      }),
    ).rejects.toThrow(/at least 8/i);
  });

  it("login succeeds against a freshly-created v2 user", async () => {
    await useAuthStore.getState().signup({
      email: "user@example.com",
      password: "supersecret",
      role: "academic-researcher",
      displayName: "User",
    });
    useAuthStore.getState().logout();

    const result = await useAuthStore.getState().login({
      email: "user@example.com",
      password: "supersecret",
    });
    expect(result.email).toBe("user@example.com");
    expect(useAuthStore.getState().currentEmail).toBe("user@example.com");
  });

  it("login throws on wrong password (v2 user)", async () => {
    await useAuthStore.getState().signup({
      email: "user@example.com",
      password: "supersecret",
      role: "lab-technician",
      displayName: "User",
    });
    useAuthStore.getState().logout();

    await expect(
      useAuthStore
        .getState()
        .login({ email: "user@example.com", password: "wrongpassword" }),
    ).rejects.toThrow(/wrong password/i);
  });

  it("login throws when email is unknown", async () => {
    await expect(
      useAuthStore
        .getState()
        .login({ email: "ghost@example.com", password: "doesnotmatter" }),
    ).rejects.toThrow(/no account/i);
  });

  it("login still works against a legacy v1 user record (back-compat)", async () => {
    // Hand-craft a legacy user with SHA-256 single-round hash + no hashVersion.
    const salt = "0123456789abcdef0123456789abcdef";
    const data = new TextEncoder().encode("supersecret" + salt);
    const buf = await crypto.subtle.digest("SHA-256", data);
    const legacyHex = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    useAuthStore.setState({
      users: {
        "legacy@example.com": {
          id: "legacy-id",
          email: "legacy@example.com",
          role: "academic-researcher",
          displayName: "Legacy",
          passwordHash: legacyHex,
          salt,
          // hashVersion intentionally omitted (pre-Phase-7.8 record).
          createdAt: "2026-01-01T00:00:00.000Z",
          qualified: false,
          qualifiedAt: null,
          addresses: [],
          newsletterOptIn: true,
        } as AccountUser,
      },
      currentEmail: null,
    });

    const result = await useAuthStore.getState().login({
      email: "legacy@example.com",
      password: "supersecret",
    });
    expect(result.email).toBe("legacy@example.com");
  });

  it("logout clears currentEmail but does not delete the user record", async () => {
    await useAuthStore.getState().signup({
      email: "user@example.com",
      password: "supersecret",
      role: "lab-technician",
      displayName: "User",
    });
    expect(useAuthStore.getState().currentEmail).toBe("user@example.com");
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().currentEmail).toBeNull();
    expect(useAuthStore.getState().users["user@example.com"]).toBeDefined();
  });

  it("multi-user-per-device: two users co-exist, login switches", async () => {
    await useAuthStore.getState().signup({
      email: "a@example.com",
      password: "passpass1",
      role: "lab-technician",
      displayName: "A",
    });
    useAuthStore.getState().logout();
    await useAuthStore.getState().signup({
      email: "b@example.com",
      password: "passpass2",
      role: "lab-technician",
      displayName: "B",
    });
    expect(Object.keys(useAuthStore.getState().users).length).toBe(2);

    await useAuthStore
      .getState()
      .login({ email: "a@example.com", password: "passpass1" });
    expect(useAuthStore.getState().currentEmail).toBe("a@example.com");
    await useAuthStore
      .getState()
      .login({ email: "b@example.com", password: "passpass2" });
    expect(useAuthStore.getState().currentEmail).toBe("b@example.com");
  });

  it("getCurrentUser returns the signed-in user, null otherwise", async () => {
    expect(useAuthStore.getState().getCurrentUser()).toBeNull();
    await useAuthStore.getState().signup({
      email: "u@example.com",
      password: "passpass1",
      role: "lab-technician",
      displayName: "U",
    });
    expect(useAuthStore.getState().getCurrentUser()?.email).toBe(
      "u@example.com",
    );
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().getCurrentUser()).toBeNull();
  });

  it("markQualified marks the current user as qualified", async () => {
    await useAuthStore.getState().signup({
      email: "q@example.com",
      password: "passpass1",
      role: "lab-technician",
      displayName: "Q",
    });
    expect(useAuthStore.getState().getCurrentUser()?.qualified).toBe(false);
    useAuthStore.getState().markQualified();
    expect(useAuthStore.getState().getCurrentUser()?.qualified).toBe(true);
    expect(useAuthStore.getState().getCurrentUser()?.qualifiedAt).toBeTruthy();
  });

  it("markQualified is a no-op when nobody is signed in", () => {
    expect(() => useAuthStore.getState().markQualified()).not.toThrow();
  });

  it("addAddress pushes an address onto the current user", async () => {
    await useAuthStore.getState().signup({
      email: "a@example.com",
      password: "passpass1",
      role: "lab-technician",
      displayName: "A",
    });
    const addr = useAuthStore.getState().addAddress({
      label: "Lab",
      name: "A",
      street: "1 Lab Way",
      street2: "",
      city: "Burbank",
      stateCode: "CA",
      zip: "91501",
      countryCode: "US",
    });
    expect(addr.id).toBeTruthy();
    expect(useAuthStore.getState().getCurrentUser()?.addresses).toHaveLength(1);
  });

  it("addAddress returns a stub addr but is a no-op when logged out", () => {
    const addr = useAuthStore.getState().addAddress({
      label: "Lab",
      name: "A",
      street: "1 Lab Way",
      street2: "",
      city: "Burbank",
      stateCode: "CA",
      zip: "91501",
      countryCode: "US",
    });
    expect(addr.id).toBeTruthy();
  });

  it("setNewsletterOptIn updates the current user", async () => {
    await useAuthStore.getState().signup({
      email: "n@example.com",
      password: "passpass1",
      role: "lab-technician",
      displayName: "N",
    });
    useAuthStore.getState().setNewsletterOptIn(false);
    expect(useAuthStore.getState().getCurrentUser()?.newsletterOptIn).toBe(
      false,
    );
  });

  it("setNewsletterOptIn is a no-op when logged out", () => {
    expect(() =>
      useAuthStore.getState().setNewsletterOptIn(false),
    ).not.toThrow();
  });

  it("setDisplayName updates the current user", async () => {
    await useAuthStore.getState().signup({
      email: "d@example.com",
      password: "passpass1",
      role: "lab-technician",
      displayName: "Old",
    });
    useAuthStore.getState().setDisplayName("New Name");
    expect(useAuthStore.getState().getCurrentUser()?.displayName).toBe(
      "New Name",
    );
  });

  it("setDisplayName is a no-op when logged out", () => {
    expect(() => useAuthStore.getState().setDisplayName("x")).not.toThrow();
  });

  it("setHydrated flips the flag", () => {
    useAuthStore.getState().setHydrated(false);
    expect(useAuthStore.getState()._hasHydrated).toBe(false);
    useAuthStore.getState().setHydrated(true);
    expect(useAuthStore.getState()._hasHydrated).toBe(true);
  });

  it("signup falls back to email-local-part when displayName is blank", async () => {
    const user = await useAuthStore.getState().signup({
      email: "fallback@example.com",
      password: "passpass1",
      role: "lab-technician",
      // displayName intentionally blank — should fall back to "fallback".
      displayName: "   ",
    });
    expect(user.displayName).toBe("fallback");
  });
});

describe("React hooks", () => {
  beforeEach(() => RESET_STATE());
  afterEach(() => RESET_STATE());

  it("useAuthHydrated reflects the hydrated flag", () => {
    useAuthStore.getState().setHydrated(true);
    const { result } = renderHook(() => useAuthHydrated());
    expect(result.current).toBe(true);
  });

  it("useCurrentUser returns null when nobody is signed in", () => {
    useAuthStore.setState({ currentEmail: null, users: {} });
    const { result } = renderHook(() => useCurrentUser());
    expect(result.current).toBeNull();
  });

  it("useCurrentUser returns the signed-in user", async () => {
    await useAuthStore.getState().signup({
      email: "hooked@example.com",
      password: "passpass1",
      role: "lab-technician",
      displayName: "Hooked",
    });
    const { result } = renderHook(() => useCurrentUser());
    expect(result.current?.email).toBe("hooked@example.com");
  });

  it("useCurrentUser returns null when currentEmail points at a missing user", () => {
    // Forge an inconsistent state (currentEmail set, user not in map).
    useAuthStore.setState({ currentEmail: "ghost@example.com", users: {} });
    const { result } = renderHook(() => useCurrentUser());
    expect(result.current).toBeNull();
  });
});

describe("verifyPassword — defensive paths", () => {
  it("returns false when the salt is unparseable for the v2 PBKDF2 path", async () => {
    // hexToBytes is defensive enough that PBKDF2 won't throw on a weird
    // salt, but a fully empty stored hash + non-matching plaintext should
    // still cleanly return false (not throw).
    const result = await verifyPassword("anything", {
      passwordHash: "",
      salt: "",
      hashVersion: 2,
      iterations: 100_000,
    });
    expect(result).toBe(false);
  });

  it("hashPassword v2 with an odd-length hex salt is handled defensively (no throw)", async () => {
    // Triggers the odd-length hexToBytes branch.
    const result = await hashPassword("hello", "abc", 2);
    expect(result.version).toBe(2);
    expect(result.hash).toMatch(/^[0-9a-f]+$/);
  });

  it("verifyPassword catches a hashPassword failure and returns false", async () => {
    // Force crypto.subtle.importKey to throw, exercising the catch branch
    // inside verifyPassword(). We restore the original immediately after.
    const originalImportKey = crypto.subtle.importKey;
    Object.defineProperty(crypto.subtle, "importKey", {
      configurable: true,
      writable: true,
      value: async () => {
        throw new Error("simulated WebCrypto failure");
      },
    });
    try {
      const result = await verifyPassword("anything", {
        passwordHash: "deadbeef",
        salt: "0123456789abcdef0123456789abcdef",
        hashVersion: 2,
        iterations: 100_000,
      });
      expect(result).toBe(false);
    } finally {
      Object.defineProperty(crypto.subtle, "importKey", {
        configurable: true,
        writable: true,
        value: originalImportKey,
      });
    }
  });
});

describe("environment fallbacks (uuid / genSalt)", () => {
  beforeEach(() => RESET_STATE());
  afterEach(() => RESET_STATE());

  it("signup still produces a usable id + salt when WebCrypto helpers are stubbed away", async () => {
    // Trigger the uuid() and genSalt() Math.random fallback paths by hiding
    // crypto.randomUUID + crypto.getRandomValues. PBKDF2 still works (it
    // uses crypto.subtle which we leave intact). The guards in auth-store
    // use `"name" in crypto` checks, so we have to actually delete the
    // properties — not just set them to undefined.
    const cryptoAny = crypto as unknown as Record<string, unknown>;
    const originalRandomUUID = cryptoAny.randomUUID;
    const originalGetRandomValues = cryptoAny.getRandomValues;
    delete cryptoAny.randomUUID;
    delete cryptoAny.getRandomValues;
    try {
      const user = await useAuthStore.getState().signup({
        email: "fallback-env@example.com",
        password: "passpass1",
        role: "lab-technician",
        displayName: "F",
      });
      expect(user.id).toBeTruthy();
      expect(user.salt).toMatch(/^[0-9a-f]{32}$/);
    } finally {
      cryptoAny.randomUUID = originalRandomUUID;
      cryptoAny.getRandomValues = originalGetRandomValues;
    }
  });
});
