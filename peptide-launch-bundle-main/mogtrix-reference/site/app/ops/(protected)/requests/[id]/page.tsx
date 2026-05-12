import { notFound } from "next/navigation";
import { OpsNoteForm } from "@/components/ops-note-form";
import { OpsStatusForm } from "@/components/ops-status-form";
import { formatPrice } from "@/lib/catalog";
import { getResearchRequestDetail, requireStaffPageSession } from "@/lib/ops";

export const dynamic = "force-dynamic";

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default async function OpsRequestDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireStaffPageSession(`/ops/requests/${id}`);
  const request = await getResearchRequestDetail(session.supabase, id);

  if (!request) notFound();

  return (
    <section className="grid gap-6">
      <div className="metal rounded-[22px] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase text-[var(--accent)]">{request.status.replaceAll("_", " ")}</p>
            <h1 className="mt-2 text-4xl font-black text-white">{request.contactName}</h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">{request.organization} · {request.email}</p>
            <p className="mt-4 max-w-4xl text-[var(--text-muted)]">{request.projectSummary}</p>
          </div>
          <div className="text-sm text-[var(--text-muted)]">
            <p>Created {formatTimestamp(request.createdAt)}</p>
            <p className="mt-1">Last change {formatTimestamp(request.lastStatusChangedAt)}</p>
            <p className="mt-4 font-mono text-xs text-white">{request.id}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-6">
          <div className="metal rounded-[22px] p-6">
            <h2 className="text-2xl font-black text-white">Requested items</h2>
            <div className="mt-5 grid gap-4">
              {request.items.map((item) => (
                <article key={item.productId} className="rounded-2xl border border-[var(--border)] p-4">
                  <p className="text-xs text-[var(--accent)]">{item.productSku}</p>
                  <h3 className="mt-1 text-lg font-bold text-white">{item.productName}</h3>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {item.quantity} × {formatPrice(item.productPriceCents)}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="metal rounded-[22px] p-6">
            <h2 className="text-2xl font-black text-white">Consent logs</h2>
            <div className="mt-5 grid gap-4">
              {request.consentLogs.map((log) => (
                <article key={log.attestationId} className="rounded-2xl border border-[var(--border)] p-4">
                  <p className="text-sm font-semibold text-white">{log.attestationId}</p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">{log.clause}</p>
                  <p className="mt-3 text-xs uppercase text-[var(--accent)]">
                    {log.accepted ? "accepted" : "rejected"} · {formatTimestamp(log.acceptedAt)}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="metal rounded-[22px] p-6">
            <h2 className="text-2xl font-black text-white">Status history</h2>
            <div className="mt-5 grid gap-4">
              {request.statusHistory.map((entry) => (
                <article key={entry.id} className="rounded-2xl border border-[var(--border)] p-4">
                  <p className="text-sm font-semibold text-white">
                    {entry.previousStatus ? `${entry.previousStatus.replaceAll("_", " ")} → ` : ""}
                    {entry.nextStatus.replaceAll("_", " ")}
                  </p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {entry.actorName ?? entry.actorEmail ?? entry.actorType} · {formatTimestamp(entry.createdAt)}
                  </p>
                  {entry.note ? <p className="mt-3 text-sm text-[var(--text-muted)]">{entry.note}</p> : null}
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="metal rounded-[22px] p-6">
            <h2 className="text-2xl font-black text-white">Update status</h2>
            <div className="mt-5">
              <OpsStatusForm requestId={request.id} currentStatus={request.status} />
            </div>
          </div>

          <div className="metal rounded-[22px] p-6">
            <h2 className="text-2xl font-black text-white">Internal notes</h2>
            <div className="mt-5">
              <OpsNoteForm requestId={request.id} />
            </div>
            <div className="mt-5 grid gap-4">
              {request.notes.length ? request.notes.map((note) => (
                <article key={note.id} className="rounded-2xl border border-[var(--border)] p-4">
                  <p className="text-sm text-white">{note.body}</p>
                  <p className="mt-3 text-xs text-[var(--text-muted)]">
                    {note.authorName ?? note.authorEmail ?? note.authorProfileId} · {formatTimestamp(note.createdAt)}
                  </p>
                </article>
              )) : (
                <p className="text-sm text-[var(--text-muted)]">No internal notes yet.</p>
              )}
            </div>
          </div>

          <div className="metal rounded-[22px] p-6 text-sm text-[var(--text-muted)]">
            <p><strong className="text-white">Request origin:</strong> {request.requestOrigin ?? "Unavailable"}</p>
            <p className="mt-2"><strong className="text-white">IP hash:</strong> {request.originIpHash ?? "Unavailable"}</p>
            <p className="mt-2"><strong className="text-white">User agent:</strong> {request.userAgent ?? "Unavailable"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
