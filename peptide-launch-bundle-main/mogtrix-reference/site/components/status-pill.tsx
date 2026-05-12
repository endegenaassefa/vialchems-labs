import type { AccessStatus } from "@/lib/db/types";
import type { VerificationBatch } from "@/lib/content/verification";

type Status = AccessStatus | VerificationBatch["status"];

export function StatusPill({ status }: { status: Status }) {
  return <span className={`status-pill status-${status}`}>{status}</span>;
}
