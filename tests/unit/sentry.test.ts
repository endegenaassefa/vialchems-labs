/**
 * Phase 3.4 (v5) — Sentry beforeSend PII scrubber unit tests.
 *
 * Closes audit H9 + M12. Iron Law 2.32 PII scrubbing in Sentry.
 *
 * The `lib/sentry.ts` `beforeSend(event, hint)` hook MUST strip:
 *   - sensitive request headers (authorization, cookie, set-cookie,
 *     btcpay-sig, plaid-verification, x-forwarded-for, x-real-ip,
 *     cf-connecting-ip)
 *   - raw request body
 *   - query string
 *   - email addresses in event.message / exception values /
 *     breadcrumb messages
 *   - breadcrumb data keys for PII (email, phone, ssn, dob, name, address)
 *   - event.user.email + event.user.ip_address
 *
 * Non-PII fields (tags, contexts, environment) MUST be preserved.
 *
 * Spec: SUPER_PROMPT_v5 §2.32 + Appendix K.
 */
import { describe, expect, it } from "vitest";
import type { Event } from "@sentry/core";
import { beforeSend } from "@/lib/sentry";

function baseEvent(): Event {
  return {
    event_id: "abc123",
    environment: "test",
    tags: { runtime: "node" },
    contexts: { app: { app_name: "vialchemlabs" } },
  };
}

describe("beforeSend — header scrubbing", () => {
  it("scrubs Authorization header value", () => {
    const ev = beforeSend(
      {
        ...baseEvent(),
        request: { headers: { Authorization: "Bearer secret-token-xyz" } },
      },
      {},
    );
    expect(ev?.request?.headers?.Authorization).toBe("[scrubbed]");
  });

  it("scrubs Cookie header value", () => {
    const ev = beforeSend(
      {
        ...baseEvent(),
        request: { headers: { Cookie: "session=abc; foo=bar" } },
      },
      {},
    );
    expect(ev?.request?.headers?.Cookie).toBe("[scrubbed]");
  });

  it("scrubs set-cookie header value", () => {
    const ev = beforeSend(
      {
        ...baseEvent(),
        request: { headers: { "set-cookie": "session=abc; Path=/" } },
      },
      {},
    );
    expect(ev?.request?.headers?.["set-cookie"]).toBe("[scrubbed]");
  });

  it("scrubs btcpay-sig header value", () => {
    const ev = beforeSend(
      {
        ...baseEvent(),
        request: { headers: { "btcpay-sig": "sha256=deadbeef" } },
      },
      {},
    );
    expect(ev?.request?.headers?.["btcpay-sig"]).toBe("[scrubbed]");
  });

  it("scrubs plaid-verification header value", () => {
    const ev = beforeSend(
      {
        ...baseEvent(),
        request: { headers: { "plaid-verification": "jwt-token-xyz" } },
      },
      {},
    );
    expect(ev?.request?.headers?.["plaid-verification"]).toBe("[scrubbed]");
  });

  it("scrubs x-forwarded-for header value", () => {
    const ev = beforeSend(
      {
        ...baseEvent(),
        request: { headers: { "x-forwarded-for": "203.0.113.5, 198.51.100.7" } },
      },
      {},
    );
    expect(ev?.request?.headers?.["x-forwarded-for"]).toBe("[scrubbed]");
  });

  it("scrubs x-real-ip and cf-connecting-ip header values", () => {
    const ev = beforeSend(
      {
        ...baseEvent(),
        request: {
          headers: {
            "x-real-ip": "203.0.113.5",
            "cf-connecting-ip": "203.0.113.5",
          },
        },
      },
      {},
    );
    expect(ev?.request?.headers?.["x-real-ip"]).toBe("[scrubbed]");
    expect(ev?.request?.headers?.["cf-connecting-ip"]).toBe("[scrubbed]");
  });

  it("scrubs sensitive headers case-insensitively", () => {
    const ev = beforeSend(
      {
        ...baseEvent(),
        request: {
          headers: {
            AUTHORIZATION: "Bearer x",
            "BTCPAY-SIG": "sha256=y",
          },
        },
      },
      {},
    );
    expect(ev?.request?.headers?.AUTHORIZATION).toBe("[scrubbed]");
    expect(ev?.request?.headers?.["BTCPAY-SIG"]).toBe("[scrubbed]");
  });

  it("preserves non-sensitive headers", () => {
    const ev = beforeSend(
      {
        ...baseEvent(),
        request: {
          headers: {
            Authorization: "Bearer secret",
            "user-agent": "Mozilla/5.0",
            "content-type": "application/json",
          },
        },
      },
      {},
    );
    expect(ev?.request?.headers?.["user-agent"]).toBe("Mozilla/5.0");
    expect(ev?.request?.headers?.["content-type"]).toBe("application/json");
    expect(ev?.request?.headers?.Authorization).toBe("[scrubbed]");
  });
});

describe("beforeSend — request body + query string scrubbing", () => {
  it("scrubs raw request body to '[scrubbed]'", () => {
    const ev = beforeSend(
      {
        ...baseEvent(),
        request: {
          data: { card_number: "4111111111111111", cvv: "123" },
        },
      },
      {},
    );
    expect(ev?.request?.data).toBe("[scrubbed]");
  });

  it("scrubs query_string to '[scrubbed]'", () => {
    const ev = beforeSend(
      {
        ...baseEvent(),
        request: { query_string: "token=abc&email=alice%40example.com" },
      },
      {},
    );
    expect(ev?.request?.query_string).toBe("[scrubbed]");
  });
});

describe("beforeSend — email address scrubbing", () => {
  it("scrubs email in event.message", () => {
    const ev = beforeSend(
      {
        ...baseEvent(),
        message: "Failed to send to alice@example.com — bad domain",
      },
      {},
    );
    expect(ev?.message).toBe("Failed to send to [email] — bad domain");
  });

  it("scrubs email in event.exception.values[].value", () => {
    const ev = beforeSend(
      {
        ...baseEvent(),
        exception: {
          values: [
            {
              type: "Error",
              value: "User not found: bob.smith+test@example.co.uk",
            },
          ],
        },
      },
      {},
    );
    expect(ev?.exception?.values?.[0]?.value).toBe(
      "User not found: [email]",
    );
  });

  it("scrubs email in breadcrumb messages", () => {
    const ev = beforeSend(
      {
        ...baseEvent(),
        breadcrumbs: [
          {
            type: "info",
            message: "received request for user_name@domain.com",
          },
        ],
      },
      {},
    );
    expect(ev?.breadcrumbs?.[0]?.message).toBe(
      "received request for [email]",
    );
  });

  it("scrubs breadcrumb data PII keys (email, phone, ssn, dob, name, address)", () => {
    const ev = beforeSend(
      {
        ...baseEvent(),
        breadcrumbs: [
          {
            type: "info",
            message: "checkout step",
            data: {
              email: "alice@example.com",
              phone: "555-1234",
              ssn: "123-45-6789",
              dob: "1990-01-01",
              name: "Alice Smith",
              address: "1 Main St",
              order_total_cents: 5400, // non-PII — preserved
            },
          },
        ],
      },
      {},
    );
    const bc = ev?.breadcrumbs?.[0];
    expect(bc?.data?.email).toBe("[scrubbed]");
    expect(bc?.data?.phone).toBe("[scrubbed]");
    expect(bc?.data?.ssn).toBe("[scrubbed]");
    expect(bc?.data?.dob).toBe("[scrubbed]");
    expect(bc?.data?.name).toBe("[scrubbed]");
    expect(bc?.data?.address).toBe("[scrubbed]");
    expect(bc?.data?.order_total_cents).toBe(5400);
  });
});

describe("beforeSend — user PII scrubbing", () => {
  it("scrubs event.user.email and event.user.ip_address", () => {
    const ev = beforeSend(
      {
        ...baseEvent(),
        user: {
          id: "user-42",
          email: "alice@example.com",
          ip_address: "203.0.113.5",
        },
      },
      {},
    );
    expect(ev?.user?.email).toBe("[scrubbed]");
    expect(ev?.user?.ip_address).toBe("[scrubbed]");
    expect(ev?.user?.id).toBe("user-42");
  });
});

describe("beforeSend — preservation + safety", () => {
  it("preserves event.tags, event.contexts, environment, non-PII fields", () => {
    const ev = beforeSend(
      {
        ...baseEvent(),
        message: "ok",
        request: { headers: { Authorization: "Bearer x" } },
      },
      {},
    );
    expect(ev?.tags?.runtime).toBe("node");
    expect(ev?.contexts?.app?.app_name).toBe("vialchemlabs");
    expect(ev?.environment).toBe("test");
    expect(ev?.event_id).toBe("abc123");
  });

  it("handles missing fields gracefully (no crash on event with no request/user/breadcrumbs/exception)", () => {
    const ev = beforeSend({ ...baseEvent() }, {});
    expect(ev).not.toBeNull();
    expect(ev?.tags?.runtime).toBe("node");
  });

  it("handles empty hint argument", () => {
    const ev = beforeSend({ ...baseEvent() });
    expect(ev).not.toBeNull();
  });
});

describe("beforeSend — email regex coverage", () => {
  it("matches typical email forms but not non-emails", () => {
    const ev = beforeSend(
      {
        ...baseEvent(),
        message:
          "Failures: alice@example.com bob.smith+test@example.co.uk user_name@domain.com but-not-an-email and-not @nothing",
      },
      {},
    );
    expect(ev?.message).toBe(
      "Failures: [email] [email] [email] but-not-an-email and-not @nothing",
    );
  });
});
