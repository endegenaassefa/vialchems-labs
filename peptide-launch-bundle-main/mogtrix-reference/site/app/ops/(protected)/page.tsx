import Link from "next/link";
import { listResearchRequestQueue, REQUEST_STATUS_OPTIONS, requireStaffPageSession } from "@/lib/ops";

export const dynamic = "force-dynamic";

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default async function OpsQueuePage({
  searchParams
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const session = await requireStaffPageSession("/ops");
  const { status, q } = await searchParams;
  const requests = await listResearchRequestQueue(session.supabase, { status, query: q });
  const activeStatus = status && REQUEST_STATUS_OPTIONS.includes(status as (typeof REQUEST_STATUS_OPTIONS)[number]) ? status : "all";

  return (
    <section className="grid gap-6">
      <div className="metal rounded-[22px] p-6">
        <form className="grid gap-4 lg:grid-cols-[220px_1fr_auto]">
          <label className="grid gap-2">
            <span className="text-sm text-[var(--text-muted)]">Status</span>
            <select
              name="status"
              defaultValue={activeStatus}
              className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white"
            >
              <option value="all">All statuses</option>
              {REQUEST_STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>{option.replaceAll("_", " ")}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-[var(--text-muted)]">Search</span>
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Request ID, contact, organization, or email"
              className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white"
            />
          </label>
          <button className="mt-auto min-h-11 rounded-2xl bg-[var(--accent)] px-5 text-sm font-bold text-black">
            Apply filters
          </button>
        </form>
      </div>

      {requests.length ? (
        <div className="grid gap-4">
          {requests.map((request) => (
            <Link
              key={request.id}
              href={`/ops/requests/${request.id}`}
              className="metal rounded-[22px] p-5 transition hover:border-[var(--accent)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase text-[var(--accent)]">{request.status.replaceAll("_", " ")}</p>
                  <h2 className="mt-2 text-2xl font-black text-white">{request.contactName}</h2>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{request.organization} · {request.email}</p>
                  <p className="mt-3 max-w-3xl text-sm text-[var(--text-muted)]">{request.projectSummary}</p>
                </div>
                <div className="text-sm text-[var(--text-muted)]">
                  <p>Created {formatTimestamp(request.createdAt)}</p>
                  <p className="mt-1">Status updated {formatTimestamp(request.lastStatusChangedAt)}</p>
                  <p className="mt-4 font-mono text-xs text-white">{request.id}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="metal rounded-[22px] p-8 text-[var(--text-muted)]">
          No requests match the current filters.
        </div>
      )}
    </section>
  );
}
