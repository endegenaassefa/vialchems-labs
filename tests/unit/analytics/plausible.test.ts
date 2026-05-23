/**
 * D1 — Plausible track() wrapper regression guard
 * (Section 6 super-prompt 2026-05-22).
 *
 * Stub-mode contract: when window.plausible is undefined (dev,
 * tests, blocked by uBlock), every call is a silent no-op. Never
 * throws into a user-visible code path.
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { track, isPlausibleConfigured } from "@/lib/analytics/plausible";

describe("track() — window.plausible no-op fallback", () => {
  let originalPlausible: typeof window.plausible | undefined;

  beforeEach(() => {
    originalPlausible = window.plausible;
    delete window.plausible;
  });

  afterEach(() => {
    if (originalPlausible !== undefined) {
      window.plausible = originalPlausible;
    } else {
      delete window.plausible;
    }
  });

  it("does not throw when window.plausible is undefined", () => {
    expect(() => track({ event: "test_event" })).not.toThrow();
  });

  it("forwards event + props when window.plausible is set", () => {
    const calls: Array<{ event: string; options?: unknown }> = [];
    window.plausible = (event, options) => {
      calls.push({ event, options });
    };
    track({ event: "checkout_started", props: { rail: "zelle" } });
    expect(calls).toHaveLength(1);
    expect(calls[0].event).toBe("checkout_started");
    expect(calls[0].options).toEqual({ props: { rail: "zelle" } });
  });

  it("does not throw when the plausible function itself throws", () => {
    window.plausible = () => {
      throw new Error("plausible blocked");
    };
    expect(() => track({ event: "test_event" })).not.toThrow();
  });
});

describe("isPlausibleConfigured() — env-var contract", () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  });

  it("returns false when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is unset", () => {
    expect(isPlausibleConfigured()).toBe(false);
  });

  it("returns true when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set", () => {
    process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN = "vialchemlabs.net";
    expect(isPlausibleConfigured()).toBe(true);
  });
});
