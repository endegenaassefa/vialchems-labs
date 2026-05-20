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
import {
  HASH_VERSION_LATEST,
  hashPassword,
  verifyPassword,
  useAuthStore,
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
    // Hash should be the PBKDF2 output, NOT a 64-char SHA-256 hex.
    expect(user.passwordHash).not.toMatch(/^[0-9a-f]{64}$/);
    // Salt is still a hex string per genSalt().
    expect(user.salt).toMatch(/^[0-9a-f]{32}$/);
  });

  it("signup rejects duplicates", async () => {
    await useAuthStore.getState().signup({
      email: "dup@example.com",
      password: "supersecret",
      role: "lab-tech",
      displayName: "Dup",
    });
    await expect(
      useAuthStore.getState().signup({
        email: "dup@example.com",
        password: "supersecret",
        role: "lab-tech",
        displayName: "Dup",
      }),
    ).rejects.toThrow(/already exists/i);
  });

  it("signup rejects passwords under 8 characters", async () => {
    await expect(
      useAuthStore.getState().signup({
        email: "short@example.com",
        password: "abc",
        role: "lab-tech",
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
      role: "lab-tech",
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
      role: "lab-tech",
      displayName: "User",
    });
    expect(useAuthStore.getState().currentEmail).toBe("user@example.com");
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().currentEmail).toBeNull();
    expect(useAuthStore.getState().users["user@example.com"]).toBeDefined();
  });

  it("multi-user-per-device: two users co-exist, login switches", async () => {
    await useAuthStore
      .getState()
      .signup({
        email: "a@example.com",
        password: "passpass1",
        role: "lab-tech",
        displayName: "A",
      });
    useAuthStore.getState().logout();
    await useAuthStore
      .getState()
      .signup({
        email: "b@example.com",
        password: "passpass2",
        role: "lab-tech",
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
    await useAuthStore
      .getState()
      .signup({
        email: "u@example.com",
        password: "passpass1",
        role: "lab-tech",
        displayName: "U",
      });
    expect(useAuthStore.getState().getCurrentUser()?.email).toBe(
      "u@example.com",
    );
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().getCurrentUser()).toBeNull();
  });

  it("markQualified marks the current user as qualified", async () => {
    await useAuthStore
      .getState()
      .signup({
        email: "q@example.com",
        password: "passpass1",
        role: "lab-tech",
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
    await useAuthStore
      .getState()
      .signup({
        email: "a@example.com",
        password: "passpass1",
        role: "lab-tech",
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
    await useAuthStore
      .getState()
      .signup({
        email: "n@example.com",
        password: "passpass1",
        role: "lab-tech",
        displayName: "N",
      });
    useAuthStore.getState().setNewsletterOptIn(false);
    expect(useAuthStore.getState().getCurrentUser()?.newsletterOptIn).toBe(
      false,
    );
  });

  it("setNewsletterOptIn is a no-op when logged out", () => {
    expect(() => useAuthStore.getState().setNewsletterOptIn(false)).not.toThrow();
  });

  it("setDisplayName updates the current user", async () => {
    await useAuthStore
      .getState()
      .signup({
        email: "d@example.com",
        password: "passpass1",
        role: "lab-tech",
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
});
