import { describe, expect, it } from "vitest";
import {
  checkOpsAuthRateLimit,
  hashIp,
  recordOpsAuthAttempt,
} from "@/lib/ops/rate-limit";

interface MockOptions {
  perIpFailures?: number;
  countError?: { message: string };
}

interface RecordedCall {
  op: "select" | "insert" | "delete";
  filters: Record<string, unknown>;
  payload?: unknown;
}

// Minimal chainable Supabase stand-in. select() resolves to a { count }
// shaped by whether an ip_hash filter was applied (per-IP vs global query);
// insert()/delete() just record the call and resolve cleanly.
function makeSupabase(opts: MockOptions = {}) {
  const calls: RecordedCall[] = [];

  function builder(op: RecordedCall["op"], payload?: unknown) {
    const filters: Record<string, unknown> = {};
    calls.push({ op, filters, payload });

    const chain = {
      eq(col: string, val: unknown) {
        filters[col] = val;
        return chain;
      },
      gte(col: string, val: unknown) {
        filters[`${col}__gte`] = val;
        return chain;
      },
      lt(col: string, val: unknown) {
        filters[`${col}__lt`] = val;
        return chain;
      },
      then(resolve: (value: unknown) => unknown) {
        if (op === "select") {
          if (opts.countError) {
            return Promise.resolve({
              count: null,
              error: opts.countError,
            }).then(resolve);
          }
          const count = opts.perIpFailures ?? 0;
          return Promise.resolve({ count, error: null }).then(resolve);
        }
        return Promise.resolve({ data: null, error: null }).then(resolve);
      },
    };
    return chain;
  }

  return {
    client: {
      from() {
        return {
          select() {
            return builder("select");
          },
          insert(payload: unknown) {
            return builder("insert", payload);
          },
          delete() {
            return builder("delete");
          },
        };
      },
    } as never,
    calls,
  };
}

describe("hashIp", () => {
  it("is deterministic for the same address", () => {
    expect(hashIp("203.0.113.7")).toBe(hashIp("203.0.113.7"));
  });

  it("produces different hashes for different addresses", () => {
    expect(hashIp("203.0.113.7")).not.toBe(hashIp("203.0.113.8"));
  });

  it("collapses missing addresses into one shared bucket", () => {
    const unknown = hashIp(null);
    expect(hashIp(undefined)).toBe(unknown);
    expect(hashIp("")).toBe(unknown);
    expect(hashIp("203.0.113.7")).not.toBe(unknown);
  });
});

describe("checkOpsAuthRateLimit", () => {
  it("allows when per-IP failures are under the limit", async () => {
    const db = makeSupabase({ perIpFailures: 3 });
    const result = await checkOpsAuthRateLimit(
      db.client,
      hashIp("203.0.113.7"),
    );
    expect(result.allowed).toBe(true);
  });

  it("locks the IP once per-IP failures hit the threshold", async () => {
    const db = makeSupabase({ perIpFailures: 10 });
    const result = await checkOpsAuthRateLimit(
      db.client,
      hashIp("203.0.113.7"),
    );
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("per_ip_locked");
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("fails open when the backing count query errors", async () => {
    const db = makeSupabase({ countError: { message: "db unavailable" } });
    const result = await checkOpsAuthRateLimit(
      db.client,
      hashIp("203.0.113.7"),
    );
    expect(result.allowed).toBe(true);
  });
});

describe("recordOpsAuthAttempt", () => {
  it("records a failed attempt and purges aged-out rows, without clearing the IP", async () => {
    const db = makeSupabase();
    await recordOpsAuthAttempt(db.client, "ip-hash-abc", false);

    const inserts = db.calls.filter((c) => c.op === "insert");
    expect(inserts).toHaveLength(1);
    expect(inserts[0].payload).toEqual({
      ip_hash: "ip-hash-abc",
      succeeded: false,
    });

    const deletes = db.calls.filter((c) => c.op === "delete");
    // Only the age-out purge — no per-IP clear on a failed attempt.
    expect(deletes).toHaveLength(1);
    expect(deletes[0].filters).toHaveProperty("attempted_at__lt");
  });

  it("clears the IP's prior failures on a successful attempt", async () => {
    const db = makeSupabase();
    await recordOpsAuthAttempt(db.client, "ip-hash-abc", true);

    const inserts = db.calls.filter((c) => c.op === "insert");
    expect(inserts[0].payload).toEqual({
      ip_hash: "ip-hash-abc",
      succeeded: true,
    });

    const deletes = db.calls.filter((c) => c.op === "delete");
    // One delete clears this IP's failures; one is the age-out purge.
    expect(deletes).toHaveLength(2);
    const ipClear = deletes.find((c) => c.filters.ip_hash === "ip-hash-abc");
    expect(ipClear?.filters).toMatchObject({
      ip_hash: "ip-hash-abc",
      succeeded: false,
    });
  });
});
