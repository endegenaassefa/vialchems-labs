import type { SupabaseClient } from "@supabase/supabase-js";

// Phase A guardrail #2 (CEO plan D18 staging strategy): a wrapper around the
// Supabase client that auto-injects `.eq('is_test', false)` on every read
// from a customer-data table. Use this anywhere outside `app/ops/**` /
// `app/api/ops/**` so test-flagged rows can NEVER leak to a real customer.
//
// RLS policies in migration 20260513000001 also enforce this at the
// database layer for any authenticated client — defence in depth. Service
// role bypasses RLS, so service-role code that reads from these tables
// must either be ops admin (allowed) or apply the is_test filter manually.
//
// Ops admin code MUST NOT use this helper — it needs to see test rows when
// the "Show test orders" toggle is on. Ops code uses the raw `serviceSupabase()`
// client directly.

const SCOPED_TABLES = [
  "orders",
  "order_items",
  "order_status_history",
  "payments",
  "customer_qualifications",
  "email_subscriptions",
] as const;

type ScopedTable = (typeof SCOPED_TABLES)[number];

interface ScopedQuery {
  select: (...args: unknown[]) => ScopedQuery;
  eq: (column: string, value: unknown) => ScopedQuery;
  order: (column: string, options?: unknown) => ScopedQuery;
  limit: (count: number) => ScopedQuery;
  single: () => unknown;
  maybeSingle: () => unknown;
  then: <T>(onfulfilled?: (value: unknown) => T) => Promise<T>;
}

// `productionOnly(supabase).from('orders').select(...).eq('email', ...)`
// pre-binds `is_test = false` to whatever follows. The returned object
// matches the Supabase query builder shape closely enough for normal use;
// for unusual operations callers can drop down to the underlying client.
export function productionOnly(supabase: SupabaseClient) {
  return {
    from(table: ScopedTable) {
      const builder = (
        supabase as unknown as { from: (t: string) => ScopedQuery }
      ).from(table);
      return builder.eq("is_test", false);
    },
  };
}

// For ops code that needs to see both prod and test rows, expose the raw
// client. Callers explicitly opt in by importing this name — easier to
// spot in code review than a bare `supabase.from(...)`.
export function unscopedForOps(supabase: SupabaseClient) {
  return supabase;
}

// Export the SCOPED_TABLES list so the pre-commit hook can keep in sync.
export const CUSTOMER_DATA_TABLES = SCOPED_TABLES;
