/**
 * Migration syntax + structural assertions for the Phase 7 closure follow-up
 * migration `20260521000001_extend_append_only_triggers_and_indexes.sql`.
 *
 * This is a syntax-check + structural assertion test, not a Postgres
 * replay test. We assert that the migration file:
 *
 *   1. Is well-formed SQL (ends with `;` after the last statement;
 *      balanced parentheses; balanced `$$` dollar-quoted strings).
 *   2. Defines the `reject_audit_mutation()` trigger function.
 *   3. Wires the three append-only triggers on the audit tables
 *      (attestations_audit, audit_log, order_status_history) per
 *      Iron Law 2.33 (audit H15 + H16).
 *   4. Adds the six datetime + foreign-key indexes per Iron Law 2.36
 *      (audit M11).
 *   5. Comments the three RLS policies (magic_links_anon_insert,
 *      qualifications_anon_insert, sessions_self) per audit H23 / M12.
 *   6. Flips the lab_partners Janoshik seed to default_for_brand=false
 *      per audit H24 + Iron Law 2.26.
 *
 * Why no real Postgres replay: the v5 closure CI does not yet wire a
 * pglite or supabase-test-helpers stack. When that infrastructure
 * lands, this test should be extended to actually `psql -f` the
 * migration and assert via `\d+` introspection. The structural
 * assertions here close the immediate "did the SQL parse correctly + do
 * the right statements exist" gap.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const MIGRATION_PATH = resolve(
  __dirname,
  "..",
  "..",
  "supabase",
  "migrations",
  "20260521000001_extend_append_only_triggers_and_indexes.sql",
);

const sql = readFileSync(MIGRATION_PATH, "utf8");

describe("20260521000001 append-only triggers + indexes migration", () => {
  describe("structural well-formedness", () => {
    it("is non-empty", () => {
      expect(sql.length).toBeGreaterThan(500);
    });

    it("ends with a terminated statement (last non-comment line ends with ';')", () => {
      // Strip trailing whitespace + comment-only trailing lines.
      const lines = sql.trimEnd().split("\n");
      let lastNonCommentLine = "";
      for (let i = lines.length - 1; i >= 0; i--) {
        const t = lines[i].trim();
        if (t.length === 0) continue;
        if (t.startsWith("--")) continue;
        lastNonCommentLine = t;
        break;
      }
      expect(lastNonCommentLine.endsWith(";")).toBe(true);
    });

    it("has balanced parentheses", () => {
      const open = (sql.match(/\(/g) ?? []).length;
      const close = (sql.match(/\)/g) ?? []).length;
      expect(open).toBe(close);
    });

    it("has balanced dollar-quoted strings ($$ … $$ in pairs)", () => {
      const dollars = (sql.match(/\$\$/g) ?? []).length;
      expect(dollars % 2).toBe(0);
    });
  });

  describe("Iron Law 2.33 — append-only triggers (H15 + H16)", () => {
    it("defines the reject_audit_mutation trigger function", () => {
      expect(sql).toMatch(
        /create or replace function reject_audit_mutation\(\)/,
      );
    });

    it("raises Iron Law 2.33 exception with P0001 errcode", () => {
      expect(sql).toMatch(/raise exception 'Iron Law 2\.33: cannot mutate %'/);
      expect(sql).toMatch(/using errcode = 'P0001'/);
    });

    it("creates BEFORE UPDATE OR DELETE trigger on attestations_audit", () => {
      expect(sql).toMatch(
        /create trigger no_mutate_attestations_audit\s+before update or delete on attestations_audit/,
      );
    });

    it("creates BEFORE UPDATE OR DELETE trigger on audit_log", () => {
      expect(sql).toMatch(
        /create trigger no_mutate_audit_log\s+before update or delete on audit_log/,
      );
    });

    it("creates BEFORE UPDATE OR DELETE trigger on order_status_history", () => {
      expect(sql).toMatch(
        /create trigger no_mutate_order_status_history\s+before update or delete on order_status_history/,
      );
    });

    it("idempotently drops existing triggers before re-creating them", () => {
      const drops = sql.match(/drop trigger if exists no_mutate_/g) ?? [];
      expect(drops.length).toBe(3);
    });
  });

  describe("Iron Law 2.36 — datetime + FK indexes (M11)", () => {
    it("has at least 5 `create index if not exists` statements", () => {
      const indexes = sql.match(/create index if not exists/g) ?? [];
      expect(indexes.length).toBeGreaterThanOrEqual(5);
    });

    it("indexes orders.placed_at", () => {
      expect(sql).toMatch(
        /create index if not exists idx_orders_placed_at\s+on orders\(placed_at\)/,
      );
    });

    it("partial-indexes email_subscriptions.unsubscribed_at where not null", () => {
      expect(sql).toMatch(
        /create index if not exists idx_email_subscriptions_unsubscribed_at[\s\S]*?where unsubscribed_at is not null/,
      );
    });

    it("indexes audit_log.recorded_at", () => {
      expect(sql).toMatch(
        /create index if not exists idx_audit_log_recorded_at\s+on audit_log\(recorded_at\)/,
      );
    });

    it("indexes order_status_history.changed_at", () => {
      expect(sql).toMatch(
        /create index if not exists idx_order_status_history_changed_at\s+on order_status_history\(changed_at\)/,
      );
    });

    it("indexes attestations_audit.qualification_id + recorded_at", () => {
      expect(sql).toMatch(
        /create index if not exists idx_attestations_audit_qualification_id\s+on attestations_audit\(qualification_id\)/,
      );
      expect(sql).toMatch(
        /create index if not exists idx_attestations_audit_recorded_at\s+on attestations_audit\(recorded_at\)/,
      );
    });
  });

  describe("H23 + M12 — RLS policy clarification comments", () => {
    it("has at least 3 `comment on policy` statements", () => {
      const comments = sql.match(/comment on policy /g) ?? [];
      expect(comments.length).toBeGreaterThanOrEqual(3);
    });

    it("comments magic_links_anon_insert with anti-abuse rationale", () => {
      expect(sql).toMatch(
        /comment on policy magic_links_anon_insert on magic_links is[\s\S]*?Anti-abuse[\s\S]*?Iron Law 2\.34/,
      );
    });

    it("comments qualifications_anon_insert with anti-abuse rationale", () => {
      expect(sql).toMatch(
        /comment on policy qualifications_anon_insert on customer_qualifications is[\s\S]*?Iron Law 2\.34/,
      );
    });

    it("comments sessions_self with INSERT/UPDATE/DELETE service-role explanation", () => {
      expect(sql).toMatch(
        /comment on policy sessions_self on sessions is[\s\S]*?service-role only[\s\S]*?Iron Law 2\.23/,
      );
    });
  });

  describe("H24 — lab_partners agnostic seed (Iron Law 2.26)", () => {
    it("updates lab_partners set default_for_brand=false where slug='janoshik'", () => {
      expect(sql).toMatch(
        /update lab_partners\s+set default_for_brand = false\s+where slug = 'janoshik'/,
      );
    });

    it("does NOT delete the Janoshik row (preserved as historical record)", () => {
      // Active DELETE should not be present. The migration may include a
      // commented-out delete option, but `delete from lab_partners` outside
      // a comment context must not appear.
      const lines = sql.split("\n");
      const activeDeletes = lines.filter((line) => {
        const trimmed = line.trim();
        return (
          !trimmed.startsWith("--") &&
          /delete\s+from\s+lab_partners/i.test(trimmed)
        );
      });
      expect(activeDeletes.length).toBe(0);
    });
  });

  describe("migration metadata", () => {
    it("declares closure of H15 + H16 + H23 + H24 + M11 + M12", () => {
      expect(sql).toMatch(/H15/);
      expect(sql).toMatch(/H16/);
      expect(sql).toMatch(/H23/);
      expect(sql).toMatch(/H24/);
      expect(sql).toMatch(/M11/);
      expect(sql).toMatch(/M12/);
    });

    it("sets search_path = public", () => {
      expect(sql).toMatch(/set search_path = public;/);
    });
  });
});
