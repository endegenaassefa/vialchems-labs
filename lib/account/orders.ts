import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

const emailSchema = z.string().trim().email();

export interface CustomerOrderSummary {
  id: string;
  displayId: string;
  status: string;
  paymentProvider: string;
  totalCents: number;
  placedAt: string;
}

interface OrderRow {
  id: string;
  display_id: string;
  status: string;
  payment_provider: string;
  total_cents: number;
  placed_at: string;
}

interface DbError {
  message?: string;
}

interface DbResult {
  data?: unknown;
  error?: DbError | null;
}

interface OrdersQueryBuilder extends PromiseLike<DbResult> {
  select(columns: string): OrdersQueryBuilder;
  eq(column: string, value: unknown): OrdersQueryBuilder;
  order(column: string, options: { ascending: boolean }): OrdersQueryBuilder;
  limit(count: number): OrdersQueryBuilder;
}

interface OrdersDb {
  from(table: "orders"): OrdersQueryBuilder;
}

function toSummary(row: OrderRow): CustomerOrderSummary {
  return {
    id: row.id,
    displayId: row.display_id,
    status: row.status,
    paymentProvider: row.payment_provider,
    totalCents: row.total_cents,
    placedAt: row.placed_at,
  };
}

export async function listCustomerOrders(
  supabase: SupabaseClient,
  email: string,
): Promise<CustomerOrderSummary[]> {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    throw new Error("invalid_customer_email");
  }
  const normalizedEmail = parsed.data.toLowerCase();
  const db = supabase as unknown as OrdersDb;

  const result = await db
    .from("orders")
    .select("id, display_id, status, payment_provider, total_cents, placed_at")
    .eq("email", normalizedEmail)
    .order("placed_at", { ascending: false })
    .limit(50);

  if (result.error) {
    throw new Error(
      `customer_orders_lookup_failed: ${result.error.message ?? "unknown database error"}`,
    );
  }

  const rows = Array.isArray(result.data) ? (result.data as OrderRow[]) : [];
  return rows.map(toSummary);
}
