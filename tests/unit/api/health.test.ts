import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

/**
 * Phase 9 — /api/health GET returns version + gitSha (audit L13 closure).
 *
 * Iron Law 2.32 — Sentry breadcrumb on entry; captureException on error.
 */

vi.mock("@sentry/nextjs", () => ({
  addBreadcrumb: vi.fn(),
}));

vi.mock("@/lib/sentry", () => ({
  captureException: vi.fn(),
}));

describe("/api/health GET", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
    vi.clearAllMocks();
  });

  it("returns status=ok with service + version + gitSha + time", async () => {
    process.env.VERCEL_GIT_COMMIT_SHA = "abcdef0123456789deadbeef";
    process.env.NEXT_PUBLIC_PACKAGE_VERSION = "v5.0.0";
    vi.resetModules();
    const { GET } = await import("@/app/api/health/route");
    const res = await GET();
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.status).toBe("ok");
    expect(body.service).toBe("vialchemlabs");
    expect(body.version).toBe("v5.0.0");
    expect(body.gitSha).toBe("abcdef012345"); // first 12 chars
    expect(body.time).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it("gitSha defaults to 'unknown' when no env vars set", async () => {
    delete process.env.VERCEL_GIT_COMMIT_SHA;
    delete process.env.GIT_COMMIT_SHA;
    delete process.env.COMMIT_SHA;
    vi.resetModules();
    const { GET } = await import("@/app/api/health/route");
    const res = await GET();
    const body = await res.json();
    expect(body.gitSha).toBe("unknown");
  });

  it("version falls back to 'v' + package.json version when no env vars set", async () => {
    // Phase 14 follow-up: route previously hardcoded "v5.0.0" as the
    // fallback, which made /api/health permanently lag behind the actual
    // shipped package.json version. Now the fallback reads from
    // package.json with a "v" prefix so every package version bump
    // propagates automatically — no Vercel env update required.
    delete process.env.NEXT_PUBLIC_PACKAGE_VERSION;
    delete process.env.PACKAGE_VERSION;
    vi.resetModules();
    const packageJson = await import("../../../package.json");
    const { GET } = await import("@/app/api/health/route");
    const res = await GET();
    const body = await res.json();
    expect(body.version).toBe(`v${packageJson.default.version}`);
  });

  it("adds Sentry breadcrumb at entry (Iron Law 2.32)", async () => {
    const Sentry = await import("@sentry/nextjs");
    vi.resetModules();
    const { GET } = await import("@/app/api/health/route");
    await GET();
    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(
      expect.objectContaining({
        category: "webhook",
        level: "info",
        message: "health_entry",
      }),
    );
  });
});
