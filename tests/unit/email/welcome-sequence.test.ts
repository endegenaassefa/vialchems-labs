/**
 * Phase 7 G4 (v5) — welcome-sequence scheduled-send tests.
 *
 * Audit H8 close-out: Emails 2/3/4 must fire via Resend `scheduledAt` (ISO
 * timestamp), NOT placeholder `scheduled:tag:+Nd` strings. Email 1 fires
 * immediately (no scheduledAt). Idempotency comes from
 * email_subscriptions.welcome_email_{1..4}_sent_at — second dispatch for the
 * same subscription is a no-op for already-sent slots. Errors on any single
 * email are captured to Sentry and the function returns partial-success ids
 * for those that did send.
 *
 * Iron Law 2.32 (Sentry) + Iron Law 2.36 (coverage ≥95% lines / 90% branch).
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

// ---- vi.hoisted mocks ------------------------------------------------------

const { sendEmailMock } = vi.hoisted(() => ({
  sendEmailMock: vi.fn(),
}));

const { captureExceptionMock } = vi.hoisted(() => ({
  captureExceptionMock: vi.fn(),
}));

const { supabaseUpdateChain } = vi.hoisted(() => {
  const calls: Array<{
    table: string;
    payload: Record<string, unknown>;
    eq?: [string, unknown];
  }> = [];
  const subscriptions = new Map<string, Record<string, string | null>>();
  const lastQuery = {
    table: "",
    action: "",
    payload: null as Record<string, unknown> | null,
  };
  const throwOn = { selectMaybeSingle: false, updateEq: false };
  return {
    supabaseUpdateChain: {
      calls,
      subscriptions,
      lastQuery,
      throwOn,
      reset() {
        calls.length = 0;
        subscriptions.clear();
        lastQuery.table = "";
        lastQuery.action = "";
        lastQuery.payload = null;
        throwOn.selectMaybeSingle = false;
        throwOn.updateEq = false;
      },
    },
  };
});

vi.mock("@/lib/email/resend", () => ({
  sendEmail: sendEmailMock,
}));

vi.mock("@/lib/sentry", () => ({
  captureException: captureExceptionMock,
}));

vi.mock("@/lib/supabase", () => ({
  serviceSupabase: () => {
    const builder = {
      from(table: string) {
        supabaseUpdateChain.lastQuery.table = table;
        return {
          update(payload: Record<string, unknown>) {
            supabaseUpdateChain.lastQuery.action = "update";
            supabaseUpdateChain.lastQuery.payload = payload;
            return {
              eq(col: string, value: unknown) {
                if (supabaseUpdateChain.throwOn.updateEq) {
                  throw new Error("supabase update eq failed");
                }
                supabaseUpdateChain.calls.push({
                  table,
                  payload,
                  eq: [col, value],
                });
                if (typeof value === "string") {
                  const existing =
                    supabaseUpdateChain.subscriptions.get(value) ?? {};
                  supabaseUpdateChain.subscriptions.set(value, {
                    ...existing,
                    ...(payload as Record<string, string | null>),
                  });
                }
                return Promise.resolve({ data: null, error: null });
              },
            };
          },
          select(columns: string) {
            void columns;
            return {
              eq(_col: string, value: unknown) {
                void _col;
                return {
                  maybeSingle: () => {
                    if (supabaseUpdateChain.throwOn.selectMaybeSingle) {
                      throw new Error("supabase select maybeSingle failed");
                    }
                    return Promise.resolve({
                      data:
                        typeof value === "string"
                          ? (supabaseUpdateChain.subscriptions.get(value) ??
                            null)
                          : null,
                      error: null,
                    });
                  },
                };
              },
            };
          },
        };
      },
    };
    return builder;
  },
  _resetSupabaseCachesForTests: () => {},
}));

// Now import the SUT (after the mocks).
import { dispatchWelcomeSequence } from "@/lib/email/welcome-sequence";
import { emailWelcomeSequence } from "@/lib/content/email-templates";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

describe("dispatchWelcomeSequence — Phase 7 G4 (audit H8)", () => {
  beforeEach(() => {
    sendEmailMock.mockReset();
    captureExceptionMock.mockReset();
    supabaseUpdateChain.reset();
    sendEmailMock.mockImplementation(async (input: { tag?: string }) => ({
      ok: true,
      id: `resend_${input.tag ?? "untagged"}`,
    }));
  });

  it("fires Email 1 immediately (no scheduledAt) via sendEmail", async () => {
    const now = new Date("2026-06-01T12:00:00.000Z");
    const result = await dispatchWelcomeSequence({
      email: "researcher@example.com",
      subscriptionId: "sub-1",
      now,
    });

    expect(sendEmailMock).toHaveBeenCalled();
    const firstCall = sendEmailMock.mock.calls[0][0];
    expect(firstCall.tag).toBe("welcome-1");
    // Email 1 is immediate: scheduledAt is either undefined or absent.
    expect(firstCall.scheduledAt).toBeUndefined();
    expect(firstCall.to).toBe("researcher@example.com");
    expect(result.dispatched).toBeGreaterThanOrEqual(1);
  });

  it("schedules Emails 2/3/4 via Resend scheduledAt at now + delayDays (ISO 8601)", async () => {
    const now = new Date("2026-06-01T12:00:00.000Z");
    await dispatchWelcomeSequence({
      email: "researcher@example.com",
      subscriptionId: "sub-2",
      now,
    });

    // Calls 2/3/4 must carry scheduledAt as ISO string at the correct offset.
    expect(sendEmailMock).toHaveBeenCalledTimes(4);
    for (let i = 1; i < 4; i++) {
      const call = sendEmailMock.mock.calls[i][0];
      expect(call.tag).toBe(`welcome-${i + 1}`);
      expect(typeof call.scheduledAt).toBe("string");
      const offsetMs =
        new Date(call.scheduledAt as string).getTime() - now.getTime();
      const expectedOffsetMs = emailWelcomeSequence[i].delayDays * ONE_DAY_MS;
      expect(offsetMs).toBe(expectedOffsetMs);
      // ISO format check (ends with Z).
      expect(call.scheduledAt as string).toMatch(/T.*Z$/);
    }
  });

  it("returns no placeholder ids — all ids are real provider ids from sendEmail", async () => {
    const result = await dispatchWelcomeSequence({
      email: "researcher@example.com",
      subscriptionId: "sub-3",
      now: new Date("2026-06-01T12:00:00.000Z"),
    });

    expect(result.ids).toHaveLength(4);
    for (const id of result.ids) {
      // The buggy v4 implementation emitted "scheduled:tag:+Nd" placeholders.
      expect(id).not.toMatch(/^scheduled:/);
    }
  });

  it("persists welcome_email_X_sent_at for every successfully dispatched email", async () => {
    await dispatchWelcomeSequence({
      email: "researcher@example.com",
      subscriptionId: "sub-4",
      now: new Date("2026-06-01T12:00:00.000Z"),
    });

    const updates = supabaseUpdateChain.calls.filter(
      (c) => c.table === "email_subscriptions",
    );
    // 4 sent timestamps recorded (one per email).
    expect(updates.length).toBeGreaterThanOrEqual(4);

    const stored = supabaseUpdateChain.subscriptions.get("sub-4");
    expect(stored?.welcome_email_1_sent_at).toBeTruthy();
    expect(stored?.welcome_email_2_sent_at).toBeTruthy();
    expect(stored?.welcome_email_3_sent_at).toBeTruthy();
    expect(stored?.welcome_email_4_sent_at).toBeTruthy();
  });

  it("idempotent — a second dispatch for the same subscriptionId is a no-op for already-sent emails", async () => {
    const now = new Date("2026-06-01T12:00:00.000Z");
    await dispatchWelcomeSequence({
      email: "researcher@example.com",
      subscriptionId: "sub-5",
      now,
    });

    sendEmailMock.mockClear();

    // Re-dispatch with the same subscription. No new sends expected.
    const result = await dispatchWelcomeSequence({
      email: "researcher@example.com",
      subscriptionId: "sub-5",
      now,
    });

    expect(sendEmailMock).not.toHaveBeenCalled();
    expect(result.dispatched).toBe(0);
  });

  it("captures Sentry exception on Resend failure for a single email and continues with remaining", async () => {
    sendEmailMock.mockImplementation(async (input: { tag?: string }) => {
      if (input.tag === "welcome-2") {
        throw new Error("Resend: 503 upstream");
      }
      return { ok: true, id: `resend_${input.tag}` };
    });

    const result = await dispatchWelcomeSequence({
      email: "researcher@example.com",
      subscriptionId: "sub-6",
      now: new Date("2026-06-01T12:00:00.000Z"),
    });

    // One sentry capture for the welcome-2 failure.
    expect(captureExceptionMock).toHaveBeenCalled();
    const captureArgs = captureExceptionMock.mock.calls[0];
    const errArg = captureArgs[0];
    const contextArg = captureArgs[1];
    expect((errArg as Error).message).toContain("Resend");
    expect((contextArg as { tags?: Record<string, string> }).tags?.route).toBe(
      "welcome_sequence",
    );

    // 3 succeeded (welcome-1, welcome-3, welcome-4); 1 failed.
    expect(result.dispatched).toBe(3);
    expect(result.ids).toHaveLength(3);
  });

  it("tags every email with the welcome-N category for Resend dashboard grouping", async () => {
    await dispatchWelcomeSequence({
      email: "researcher@example.com",
      subscriptionId: "sub-7",
      now: new Date("2026-06-01T12:00:00.000Z"),
    });

    expect(sendEmailMock).toHaveBeenCalledTimes(4);
    expect(sendEmailMock.mock.calls[0][0].tag).toBe("welcome-1");
    expect(sendEmailMock.mock.calls[1][0].tag).toBe("welcome-2");
    expect(sendEmailMock.mock.calls[2][0].tag).toBe("welcome-3");
    expect(sendEmailMock.mock.calls[3][0].tag).toBe("welcome-4");
  });

  it("returns dispatched=4 and ids.length=4 when all sends succeed", async () => {
    const result = await dispatchWelcomeSequence({
      email: "researcher@example.com",
      subscriptionId: "sub-8",
      now: new Date("2026-06-01T12:00:00.000Z"),
    });
    expect(result.dispatched).toBe(4);
    expect(result.ids).toHaveLength(4);
  });

  it("works when subscriptionId is undefined — sends without persistence (no DB writes)", async () => {
    const result = await dispatchWelcomeSequence({
      email: "researcher@example.com",
      now: new Date("2026-06-01T12:00:00.000Z"),
    });
    expect(result.dispatched).toBe(4);
    // No DB updates without a subscriptionId.
    const updates = supabaseUpdateChain.calls.filter(
      (c) => c.table === "email_subscriptions",
    );
    expect(updates).toHaveLength(0);
  });

  it("captures Sentry exception when idempotency-read throws and continues with dispatch", async () => {
    supabaseUpdateChain.throwOn.selectMaybeSingle = true;
    const result = await dispatchWelcomeSequence({
      email: "researcher@example.com",
      subscriptionId: "sub-err-read",
      now: new Date("2026-06-01T12:00:00.000Z"),
    });

    // Idempotency-read error captured to Sentry with phase tag.
    const idempotencyCapture = captureExceptionMock.mock.calls.find(
      (c: unknown[]) => {
        const ctx = c[1] as { tags?: Record<string, string> };
        return ctx?.tags?.phase === "idempotency_read";
      },
    );
    expect(idempotencyCapture).toBeDefined();
    expect(
      (idempotencyCapture![1] as { tags: Record<string, string> }).tags.route,
    ).toBe("welcome_sequence");

    // Dispatch still proceeded — all 4 sends went out despite the read failure.
    expect(result.dispatched).toBe(4);
  });

  it("captures Sentry exception when persist_sent_at write throws and continues with remaining emails", async () => {
    supabaseUpdateChain.throwOn.updateEq = true;
    const result = await dispatchWelcomeSequence({
      email: "researcher@example.com",
      subscriptionId: "sub-err-write",
      now: new Date("2026-06-01T12:00:00.000Z"),
    });

    // Persist-write error captured to Sentry with phase tag for each email.
    const persistCaptures = captureExceptionMock.mock.calls.filter(
      (c: unknown[]) => {
        const ctx = c[1] as { tags?: Record<string, string> };
        return ctx?.tags?.phase === "persist_sent_at";
      },
    );
    // 4 persistence attempts, all fail — 4 captures.
    expect(persistCaptures.length).toBe(4);

    // All 4 emails still dispatched (the send succeeded; only persist failed).
    expect(result.dispatched).toBe(4);
    expect(result.ids).toHaveLength(4);
  });

  it("defaults now to current time when not provided in options", async () => {
    const before = Date.now();
    await dispatchWelcomeSequence({ email: "researcher@example.com" });
    const after = Date.now();

    expect(sendEmailMock).toHaveBeenCalledTimes(4);
    // scheduledAt on welcome-2 should be ~3 days from "now".
    const email2Call = sendEmailMock.mock.calls[1][0];
    const scheduledMs = new Date(email2Call.scheduledAt as string).getTime();
    const expectedMin = before + 3 * ONE_DAY_MS - 1000;
    const expectedMax = after + 3 * ONE_DAY_MS + 1000;
    expect(scheduledMs).toBeGreaterThanOrEqual(expectedMin);
    expect(scheduledMs).toBeLessThanOrEqual(expectedMax);
  });
});
