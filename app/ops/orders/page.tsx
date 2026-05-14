"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { opsFetch } from "@/components/ops/OpsAuthGate";
import { statusColor } from "@/lib/ops/status-display";
import type { OpsOrder } from "@/lib/ops/orders";

// Order list with status + email filters, pagination, and a "show test
// orders" toggle. Service-role on the server side returns whatever we ask
// for; this page just defaults to production-only.

interface ListResponse {
  ok: true;
  rows: OpsOrder[];
  total: number;
  page: number;
  pageSize: number;
}

const STATUS_FILTERS = [
  "all",
  "paid",
  "fulfilled",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

const PAGE_SIZE = 50;

function fmtUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrdersListPage() {
  const [orders, setOrders] = useState<OpsOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTERS)[number]>("all");
  const [emailFilter, setEmailFilter] = useState("");
  const [includeTest, setIncludeTest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: PAGE_SIZE.toString(),
      });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (emailFilter.trim())
        params.set("email", emailFilter.trim().toLowerCase());
      if (includeTest) params.set("includeTest", "true");

      try {
        const res = await opsFetch(`/api/ops/orders?${params.toString()}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          if (!cancelled) {
            setError(
              `Failed to load orders: ${
                (body as { message?: string }).message ?? res.statusText
              }`,
            );
            setLoading(false);
          }
          return;
        }
        const data = (await res.json()) as ListResponse;
        if (!cancelled) {
          setOrders(data.rows);
          setTotal(data.total);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message);
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [page, statusFilter, emailFilter, includeTest]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-light">Orders</h1>
        <div className="text-[11px] tracking-[0.24em] uppercase text-[var(--text-muted)]">
          {total} total
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-wrap gap-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`px-3 py-1 text-[11px] tracking-[0.16em] uppercase rounded-full border ${
                statusFilter === s
                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="email"
          value={emailFilter}
          onChange={(e) => {
            setEmailFilter(e.target.value);
            setPage(1);
          }}
          placeholder="customer email"
          className="px-3 py-1 text-sm rounded-md border border-[var(--border)] bg-[var(--surface)] font-mono w-56"
        />
        <label className="flex items-center gap-2 text-[11px] tracking-[0.16em] uppercase text-[var(--text-muted)]">
          <input
            type="checkbox"
            checked={includeTest}
            onChange={(e) => {
              setIncludeTest(e.target.checked);
              setPage(1);
            }}
          />
          Show test orders
        </label>
      </div>

      {error && (
        <div className="rounded-md border border-[var(--pill-error)] bg-red-50 px-4 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="rounded-[14px] border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface)] border-b border-[var(--border)]">
            <tr className="text-[11px] tracking-[0.16em] uppercase text-[var(--text-muted)]">
              <th className="text-left px-4 py-3">Order</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Customer</th>
              <th className="text-left px-4 py-3">Total</th>
              <th className="text-left px-4 py-3">Placed</th>
              <th className="text-left px-4 py-3">Test?</th>
            </tr>
          </thead>
          <tbody>
            {loading && orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-[var(--text-muted)]"
                >
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-[var(--text-muted)]"
                >
                  No orders match these filters.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => router.push(`/ops/orders/${o.id}`)}
                  className="border-b border-[var(--border)] hover:bg-[var(--accent-soft)] transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 font-mono">
                    <Link
                      href={`/ops/orders/${o.id}`}
                      className="hover:text-[var(--accent)]"
                    >
                      {o.displayId}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] tracking-[0.12em] uppercase ${statusColor(
                        o.status,
                      )}`}
                    >
                      {o.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{o.email}</td>
                  <td className="px-4 py-3 font-mono">
                    {fmtUsd(o.totalCents)}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)] text-xs">
                    {fmtDate(o.placedAt)}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {o.isTest ? (
                      <span className="text-amber-700">TEST</span>
                    ) : (
                      <span className="text-[var(--text-muted)]">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-[11px] tracking-[0.16em] uppercase text-[var(--text-muted)]">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-md border border-[var(--border)] disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded-md border border-[var(--border)] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
