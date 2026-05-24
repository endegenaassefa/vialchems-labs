/**
 * Phase 2A — magic-link redirect URL contract.
 *
 * Iron Law (super-prompt §7.1): the emailRedirectTo passed to Supabase
 * Auth MUST resolve via siteConfig.url, NEVER window.location.origin.
 * The window.location.origin fallback bakes localhost into the magic
 * link whenever a developer signs up from a dev environment + breaks
 * production traffic whose Supabase redirect-allowlist doesn't include
 * localhost.
 *
 * The new resolveAuthRedirectTo(callerOverride, nextPath) helper is the
 * single source of truth. Pages + the supabase-auth wrapper both call
 * it; the underlying Supabase client never sees a non-siteConfig URL.
 */
import { describe, expect, it } from "vitest";

import { resolveAuthRedirectTo } from "@/lib/supabase-auth";
import { siteConfig } from "@/lib/content/site";

describe("resolveAuthRedirectTo (Phase 2A)", () => {
  it("defaults to siteConfig.url + /auth/callback + next=/account", () => {
    const url = resolveAuthRedirectTo();
    expect(url).toBe(`${siteConfig.url}/auth/callback?next=%2Faccount`);
  });

  it("encodes the provided nextPath into the query string", () => {
    const url = resolveAuthRedirectTo(undefined, "/account/orders");
    expect(url).toBe(
      `${siteConfig.url}/auth/callback?next=%2Faccount%2Forders`,
    );
  });

  it("honors an explicit caller override (used for special callsites)", () => {
    const url = resolveAuthRedirectTo("https://example.com/cb", "/ignored");
    expect(url).toBe("https://example.com/cb");
  });

  it("ALWAYS uses siteConfig.url even when window.location.origin is set", () => {
    // Sanity check: even if we plant a window.location.origin into globalThis,
    // the helper ignores it. (jsdom provides one by default; this test
    // documents the intentional ignore.)
    if (typeof window !== "undefined") {
      // window.location.origin is jsdom default (http://localhost:3000); the
      // helper must NOT include it in the output.
      const url = resolveAuthRedirectTo();
      expect(url).not.toMatch(/localhost/);
      expect(url.startsWith(siteConfig.url)).toBe(true);
    }
  });

  it("never returns an undefined value (defensive contract)", () => {
    const url = resolveAuthRedirectTo();
    expect(typeof url).toBe("string");
    expect(url.length).toBeGreaterThan(0);
  });

  it("safe-defaults nextPath to /account when given an unsafe value", () => {
    // Open-redirect prevention: only "/..." paths are honored.
    expect(resolveAuthRedirectTo(undefined, "//evil.com")).toBe(
      `${siteConfig.url}/auth/callback?next=%2Faccount`,
    );
    expect(resolveAuthRedirectTo(undefined, "https://evil.com")).toBe(
      `${siteConfig.url}/auth/callback?next=%2Faccount`,
    );
    expect(resolveAuthRedirectTo(undefined, "")).toBe(
      `${siteConfig.url}/auth/callback?next=%2Faccount`,
    );
  });
});
