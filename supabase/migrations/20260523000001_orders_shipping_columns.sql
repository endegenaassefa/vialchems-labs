-- ============================================================
-- C3 — Orders table shipping columns (operator dashboard support)
-- Section 6 super-prompt 2026-05-22.
--
-- The operator dashboard (item C1) and the shipped-email flow
-- (item F2) both need to record tracking metadata + free-text
-- operator notes against an order. The v5 schema didn't have
-- those columns; this migration adds them and an index that lets
-- the dashboard filter by status without a table scan.
--
-- Iron Law 2.14 / 2.33 compliance:
--   - All additions are ADD COLUMN (non-destructive); no DROP /
--     ALTER on existing columns.
--   - tracking_number / carrier / operator_notes / shipped_at are
--     all NULLABLE so existing rows remain valid without backfill.
--   - The orders table is NOT an append-only audit log (status
--     changes are tracked in order_status_history); operator
--     writes to these columns are normal UPDATE operations and
--     don't require trigger guards.
-- ============================================================

-- Phase 11 (C3): operator dashboard shipping columns.
alter table orders add column if not exists tracking_number text;
alter table orders add column if not exists carrier text;
alter table orders add column if not exists operator_notes text;
alter table orders add column if not exists shipped_at timestamptz;

-- Phase 11 (C3): status index for the dashboard filter chips.
-- The operator UI filters orders by status (pending / paid /
-- shipped / refunded) and sorts by placed_at; the existing
-- idx_orders_placed_at (added by the 2026-05-21 extension
-- migration) handles the sort; this composite covers the filter.
create index if not exists idx_orders_status_placed_at
  on orders(status, placed_at desc);
