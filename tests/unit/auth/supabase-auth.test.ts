/**
 * B1 — Supabase Auth wrapper regression guard
 * (Section 6 super-prompt 2026-05-22).
 *
 * The wrapper degrades gracefully when REQUIRE_SUPABASE=false (the
 * Day-1 default). These assertions lock that contract so a future
 * change can't silently throw instead of returning a structured
 * `{ ok: false, code: "supabase_unavailable" }` payload.
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  signInWithOtp,
  signOut,
  getSession,
  getUser,
  onAuthStateChange,
  isSupabaseAuthAvailable,
} from "@/lib/supabase-auth";
import { _resetSupabaseCachesForTests } from "@/lib/supabase";

describe("supabase-auth wrapper — REQUIRE_SUPABASE=false fallback", () => {
  beforeEach(() => {
    delete process.env.REQUIRE_SUPABASE;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    _resetSupabaseCachesForTests();
  });

  afterEach(() => {
    _resetSupabaseCachesForTests();
  });

  it("reports Supabase Auth as unavailable", () => {
    expect(isSupabaseAuthAvailable()).toBe(false);
  });

  it("signInWithOtp returns a structured supabase_unavailable error", async () => {
    const result = await signInWithOtp({ email: "test@example.com" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("supabase_unavailable");
      expect(result.message).toMatch(/Supabase Auth is not configured/i);
    }
  });

  it("signOut returns a structured supabase_unavailable error", async () => {
    const result = await signOut();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("supabase_unavailable");
    }
  });

  it("getSession returns null when Supabase is unavailable", async () => {
    expect(await getSession()).toBeNull();
  });

  it("getUser returns null when Supabase is unavailable", async () => {
    expect(await getUser()).toBeNull();
  });

  it("onAuthStateChange returns a no-op unsubscribe when Supabase is unavailable", () => {
    let called = false;
    const unsub = onAuthStateChange(() => {
      called = true;
    });
    expect(typeof unsub).toBe("function");
    unsub();
    expect(called).toBe(false);
  });
});
