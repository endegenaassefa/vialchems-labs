/**
 * Auth store — v1.3 client-side, localStorage-backed user accounts.
 *
 * v4 deferred D2 (Supabase auth) to Phase 10. v1.3 ships a real-feeling
 * account system in the meantime: Zustand + localStorage persist, password
 * hashing via Web Crypto SHA-256 + per-account salt, multi-user-per-device
 * keyed by email. When Supabase wires in (D2 closure), this store becomes a
 * cache for server state — the public API stays the same.
 *
 * Iron Law 2.22 spirit: passwords are hashed (never stored plain), but this
 * is browser-side storage — anyone with the device has access. The honest
 * positioning ("pre-launch · server auth wires before public launch") stays
 * surfaced in the UI so users know.
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

export interface AccountUser {
  id: string;
  email: string;
  role: QualificationRole;
  displayName: string;
  /** SHA-256(password + salt) hex digest. */
  passwordHash: string;
  /** Per-account salt used in passwordHash. */
  salt: string;
  createdAt: string;
  qualified: boolean;
  qualifiedAt: string | null;
  addresses: SavedAddress[];
  newsletterOptIn: boolean;
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

async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(password + salt);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
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
        const passwordHash = await hashPassword(password, salt);
        const user: AccountUser = {
          id: uuid(),
          email: key,
          role,
          displayName: displayName.trim() || key.split("@")[0],
          passwordHash,
          salt,
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
        const expected = await hashPassword(password, user.salt);
        if (expected !== user.passwordHash) {
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
