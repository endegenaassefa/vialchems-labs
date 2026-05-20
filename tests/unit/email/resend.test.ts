/**
 * Phase 10 J2 (v5) — Resend client wrapper coverage.
 *
 * Iron Law 2.36 — lift lib/email/resend.ts above the 85% line bar.
 *
 * The SUT has three orthogonal axes:
 *   1. isRequired() — production vs non-production + REQUIRE_RESEND + the
 *      ALLOW_RESEND_OPTIONAL_IN_PRODUCTION escape hatch.
 *   2. getClient() — cached-null, cached-instance, missing-api-key throw,
 *      and successful Resend instantiation.
 *   3. sendEmail() — stub path (no client), real-client happy path with /
 *      without scheduledAt + tag + replyTo + from default, error
 *      propagation, and the unknown-id fallback.
 *
 * The `resend` SDK is mocked at module level via vi.mock so we never make
 * a real network call.
 *
 * Env vars are mutated via vi.stubEnv / vi.unstubAllEnvs (NODE_ENV is
 * read-only at the type level in Next.js' types).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { resendCtorMock, sendMock } = vi.hoisted(() => ({
  resendCtorMock: vi.fn(),
  sendMock: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class {
    public emails = { send: sendMock };
    constructor(key: string) {
      resendCtorMock(key);
    }
  },
}));

// Import after the mock so the SUT picks up the mocked Resend class.
import {
  _resetResendClientForTests,
  sendEmail,
} from "@/lib/email/resend";

function clearEnvKeys() {
  // Stub-unset only the keys this module reads. `undefined` removes the
  // env var entirely (so `??` nullish-coalescing falls through). Empty
  // string would still be a value and would NOT trigger ?? fallback.
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("VERCEL_ENV", undefined);
  vi.stubEnv("REQUIRE_RESEND", undefined);
  vi.stubEnv("ALLOW_RESEND_OPTIONAL_IN_PRODUCTION", undefined);
  vi.stubEnv("RESEND_API_KEY", undefined);
  vi.stubEnv("ORDER_EMAIL_FROM", undefined);
  vi.stubEnv("BRAND_DOMAIN", undefined);
}

describe("lib/email/resend — sendEmail stub path", () => {
  beforeEach(() => {
    clearEnvKeys();
    _resetResendClientForTests();
    resendCtorMock.mockReset();
    sendMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    _resetResendClientForTests();
  });

  it("returns a stub result with `stub:<tag>:<ts>` id when REQUIRE_RESEND is unset and not in production", async () => {
    vi.stubEnv("REQUIRE_RESEND", "false");

    const result = await sendEmail({
      to: "researcher@example.com",
      subject: "Hello",
      text: "Body",
      tag: "welcome-1",
    });

    expect(result.ok).toBe(true);
    expect(result.stub).toBe(true);
    expect(result.id).toMatch(/^stub:welcome-1:\d+$/);
    expect(sendMock).not.toHaveBeenCalled();
    expect(resendCtorMock).not.toHaveBeenCalled();
  });

  it("returns `stub:untagged:<ts>` when no tag is provided", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const result = await sendEmail({
      to: "researcher@example.com",
      subject: "Hello",
      text: "Body",
    });
    expect(result.id).toMatch(/^stub:untagged:\d+$/);
  });

  it("appends a `:sched:<iso>` suffix when scheduledAt is provided on the stub path", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const result = await sendEmail({
      to: "researcher@example.com",
      subject: "Hello",
      text: "Body",
      tag: "welcome-2",
      scheduledAt: "2026-06-04T12:00:00.000Z",
    });
    expect(result.id).toMatch(
      /^stub:welcome-2:\d+:sched:2026-06-04T12:00:00\.000Z$/,
    );
  });

  it("does not require a Resend API key on the stub path", async () => {
    // No RESEND_API_KEY set — must not throw.
    await expect(
      sendEmail({
        to: "researcher@example.com",
        subject: "Hello",
        text: "Body",
        tag: "magic-link",
      }),
    ).resolves.toMatchObject({ ok: true, stub: true });
  });

  it("caches the null client across calls (no duplicate gate re-checks)", async () => {
    await sendEmail({
      to: "a@example.com",
      subject: "1",
      text: "x",
      tag: "welcome-1",
    });
    await sendEmail({
      to: "b@example.com",
      subject: "2",
      text: "y",
      tag: "welcome-1",
    });
    // Even if env flipped now, the cache stays null.
    vi.stubEnv("REQUIRE_RESEND", "true");
    vi.stubEnv("RESEND_API_KEY", "test_key");
    const r3 = await sendEmail({
      to: "c@example.com",
      subject: "3",
      text: "z",
      tag: "welcome-1",
    });
    expect(r3.stub).toBe(true);
    expect(sendMock).not.toHaveBeenCalled();
  });
});

describe("lib/email/resend — isRequired / getClient gating", () => {
  beforeEach(() => {
    clearEnvKeys();
    _resetResendClientForTests();
    resendCtorMock.mockReset();
    sendMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    _resetResendClientForTests();
  });

  it("treats NODE_ENV=production as required by default (no escape flag)", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    sendMock.mockResolvedValueOnce({ data: { id: "real-id-1" }, error: null });

    const result = await sendEmail({
      to: "researcher@example.com",
      subject: "Live",
      text: "ok",
      tag: "welcome-1",
    });
    expect(resendCtorMock).toHaveBeenCalledWith("re_test_key");
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(result.id).toBe("real-id-1");
    expect(result.stub).toBeUndefined();
  });

  it("allows production to skip Resend when ALLOW_RESEND_OPTIONAL_IN_PRODUCTION=true", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_RESEND_OPTIONAL_IN_PRODUCTION", "true");

    const result = await sendEmail({
      to: "researcher@example.com",
      subject: "stub",
      text: "ok",
      tag: "welcome-1",
    });
    expect(result.stub).toBe(true);
    expect(resendCtorMock).not.toHaveBeenCalled();
  });

  it("treats VERCEL_ENV=production identically to NODE_ENV=production via isProductionRuntime", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("RESEND_API_KEY", "re_vercel");
    sendMock.mockResolvedValueOnce({ data: { id: "vercel-id" }, error: null });

    const result = await sendEmail({
      to: "x@example.com",
      subject: "y",
      text: "z",
      tag: "order-confirmation",
    });
    expect(result.id).toBe("vercel-id");
    expect(resendCtorMock).toHaveBeenCalledWith("re_vercel");
  });

  it("throws when REQUIRE_RESEND=true outside production but RESEND_API_KEY is empty", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("REQUIRE_RESEND", "true");
    // No RESEND_API_KEY set.
    await expect(
      sendEmail({
        to: "a@example.com",
        subject: "s",
        text: "t",
        tag: "welcome-1",
      }),
    ).rejects.toThrow(/Phase 10\.2.*REQUIRE_RESEND=true.*RESEND_API_KEY/);
  });

  it("throws when in production with no RESEND_API_KEY and no escape flag", async () => {
    vi.stubEnv("NODE_ENV", "production");
    // RESEND_API_KEY missing, ALLOW_RESEND_OPTIONAL_IN_PRODUCTION unset.
    await expect(
      sendEmail({
        to: "a@example.com",
        subject: "s",
        text: "t",
        tag: "welcome-1",
      }),
    ).rejects.toThrow(/REQUIRE_RESEND=true but RESEND_API_KEY is empty/);
  });

  it("caches a successfully created client across calls (constructor fires once)", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("REQUIRE_RESEND", "true");
    vi.stubEnv("RESEND_API_KEY", "re_cache_test");
    sendMock.mockResolvedValue({ data: { id: "cached" }, error: null });

    await sendEmail({
      to: "a@example.com",
      subject: "s",
      text: "t",
      tag: "welcome-1",
    });
    await sendEmail({
      to: "b@example.com",
      subject: "s",
      text: "t",
      tag: "welcome-2",
    });
    expect(resendCtorMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledTimes(2);
  });
});

describe("lib/email/resend — sendEmail real-client paths", () => {
  beforeEach(() => {
    clearEnvKeys();
    _resetResendClientForTests();
    resendCtorMock.mockReset();
    sendMock.mockReset();
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("REQUIRE_RESEND", "true");
    vi.stubEnv("RESEND_API_KEY", "re_real_key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    _resetResendClientForTests();
  });

  it("forwards explicit from / replyTo / scheduledAt / tag fields to the SDK", async () => {
    sendMock.mockResolvedValueOnce({ data: { id: "sdk-id" }, error: null });
    const result = await sendEmail({
      from: "ops@vialchemlabs.net",
      to: ["a@example.com", "b@example.com"],
      subject: "Subj",
      text: "Body",
      html: "<p>Body</p>",
      replyTo: "support@vialchemlabs.net",
      tag: "order-confirmation",
      scheduledAt: "2026-08-05T11:52:01.858Z",
    });
    expect(result.ok).toBe(true);
    expect(result.id).toBe("sdk-id");
    expect(sendMock).toHaveBeenCalledWith({
      from: "ops@vialchemlabs.net",
      to: ["a@example.com", "b@example.com"],
      subject: "Subj",
      text: "Body",
      html: "<p>Body</p>",
      replyTo: "support@vialchemlabs.net",
      tags: [{ name: "category", value: "order-confirmation" }],
      scheduledAt: "2026-08-05T11:52:01.858Z",
    });
  });

  it("falls back to ORDER_EMAIL_FROM when no explicit from is supplied", async () => {
    vi.stubEnv("ORDER_EMAIL_FROM", "research-from-env@vialchemlabs.net");
    sendMock.mockResolvedValueOnce({ data: { id: "id-2" }, error: null });
    await sendEmail({
      to: "a@example.com",
      subject: "s",
      text: "t",
      tag: "welcome-3",
    });
    const arg = sendMock.mock.calls[0][0];
    expect(arg.from).toBe("research-from-env@vialchemlabs.net");
  });

  it("falls back to research@<BRAND_DOMAIN> when neither from nor ORDER_EMAIL_FROM is set", async () => {
    vi.stubEnv("BRAND_DOMAIN", "example-brand.test");
    sendMock.mockResolvedValueOnce({ data: { id: "id-3" }, error: null });
    await sendEmail({
      to: "a@example.com",
      subject: "s",
      text: "t",
      tag: "welcome-4",
    });
    expect(sendMock.mock.calls[0][0].from).toBe(
      "research@example-brand.test",
    );
  });

  it("falls back to the hard-coded default domain when BRAND_DOMAIN is also unset", async () => {
    sendMock.mockResolvedValueOnce({ data: { id: "id-4" }, error: null });
    await sendEmail({
      to: "a@example.com",
      subject: "s",
      text: "t",
      tag: "magic-link",
    });
    expect(sendMock.mock.calls[0][0].from).toBe(
      "research@vialchemlabs.net",
    );
  });

  it("omits `tags` from the SDK call when no tag is supplied", async () => {
    sendMock.mockResolvedValueOnce({ data: { id: "id-5" }, error: null });
    await sendEmail({
      to: "a@example.com",
      subject: "s",
      text: "t",
    });
    expect(sendMock.mock.calls[0][0].tags).toBeUndefined();
  });

  it("throws when the SDK returns a non-null error object (preserves message)", async () => {
    sendMock.mockResolvedValueOnce({
      data: null,
      error: { message: "rate_limited", name: "RateLimitError" },
    });
    await expect(
      sendEmail({
        to: "a@example.com",
        subject: "s",
        text: "t",
        tag: "welcome-1",
      }),
    ).rejects.toThrow(/Resend send failed: rate_limited/);
  });

  it("falls back to 'unknown' id when the SDK response is missing data.id", async () => {
    sendMock.mockResolvedValueOnce({ data: undefined, error: null });
    const result = await sendEmail({
      to: "a@example.com",
      subject: "s",
      text: "t",
      tag: "welcome-1",
    });
    expect(result.id).toBe("unknown");
    expect(result.ok).toBe(true);
  });

  it("falls back to 'unknown' id when data is present but data.id is undefined", async () => {
    sendMock.mockResolvedValueOnce({ data: {}, error: null });
    const result = await sendEmail({
      to: "a@example.com",
      subject: "s",
      text: "t",
      tag: "welcome-1",
    });
    expect(result.id).toBe("unknown");
  });
});

describe("_resetResendClientForTests", () => {
  beforeEach(() => {
    clearEnvKeys();
    resendCtorMock.mockReset();
    sendMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    _resetResendClientForTests();
  });

  it("re-initialises the client on the next call after reset", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("REQUIRE_RESEND", "true");
    vi.stubEnv("RESEND_API_KEY", "re_key_a");
    sendMock.mockResolvedValue({ data: { id: "x" }, error: null });
    await sendEmail({
      to: "a@example.com",
      subject: "s",
      text: "t",
      tag: "welcome-1",
    });
    expect(resendCtorMock).toHaveBeenCalledTimes(1);

    // Reset, swap the key, and confirm the ctor fires again.
    _resetResendClientForTests();
    vi.stubEnv("RESEND_API_KEY", "re_key_b");

    await sendEmail({
      to: "b@example.com",
      subject: "s",
      text: "t",
      tag: "welcome-1",
    });
    expect(resendCtorMock).toHaveBeenCalledTimes(2);
    expect(resendCtorMock.mock.calls[1][0]).toBe("re_key_b");
  });
});
