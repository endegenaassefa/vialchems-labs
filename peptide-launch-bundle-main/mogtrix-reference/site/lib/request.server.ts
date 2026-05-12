import { createHash } from "node:crypto";
import { requiredAttestations } from "@/lib/attestations";
import { REQUEST_LIMITS, validateResearchRequest } from "@/lib/request";
import type { ConsentLog, ResearchRequestSubmission } from "@/lib/types";

export { REQUEST_LIMITS };

export type ResearchRequestMeta = {
  now?: Date;
  source: string;
  requestOrigin: string;
  originIp: string | null;
  userAgent: string | null;
};

export type ResearchRequestWriteInput = {
  contactName: string;
  organization: string;
  email: string;
  normalizedEmail: string;
  projectSummary: string;
  idempotencyKey: string;
  items: ResearchRequestSubmission["items"];
  consentLogs: ConsentLog[];
  requestOrigin: string;
  originIpHash: string | null;
  userAgent: string | null;
};

export function validateResearchRequestSubmission(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return { ok: false as const, errors: ["Invalid research request payload."] };
  }

  const submission = payload as Partial<ResearchRequestSubmission>;
  const items = Array.isArray(submission.items) ? submission.items : [];
  const attestationIds = Array.isArray(submission.attestationIds)
    ? submission.attestationIds.filter((value): value is string => typeof value === "string")
    : [];

  const validation = validateResearchRequest({
    contactName: typeof submission.contactName === "string" ? submission.contactName : "",
    organization: typeof submission.organization === "string" ? submission.organization : "",
    email: typeof submission.email === "string" ? submission.email : "",
    projectSummary: typeof submission.projectSummary === "string" ? submission.projectSummary : "",
    attestationIds
  }, items);

  const errors = [...validation.errors];
  const clientRequestId = typeof submission.clientRequestId === "string" ? submission.clientRequestId.trim() : "";

  if (!clientRequestId || !/^[a-zA-Z0-9-]{8,80}$/.test(clientRequestId)) {
    errors.push("Request fingerprint is missing or malformed.");
  }

  return {
    ok: errors.length === 0,
    errors,
    submission: errors.length
      ? null
      : {
          clientRequestId,
          contactName: submission.contactName!.trim(),
          organization: submission.organization!.trim(),
          email: submission.email!.trim(),
          projectSummary: submission.projectSummary!.trim(),
          attestationIds,
          items: items.map((item) => ({
            productId: String(item.productId),
            quantity: Number(item.quantity)
          }))
        }
  } as const;
}

export function buildResearchRequestWriteInput(
  submission: ResearchRequestSubmission,
  meta: ResearchRequestMeta
): ResearchRequestWriteInput {
  const acceptedAt = (meta.now ?? new Date()).toISOString();
  const consentLogs: ConsentLog[] = requiredAttestations.map((attestation) => ({
    attestationId: attestation.id,
    clause: attestation.clause,
    accepted: submission.attestationIds.includes(attestation.id),
    acceptedAt,
    source: meta.source
  }));
  const normalizedEmail = submission.email.trim().toLowerCase();

  return {
    contactName: submission.contactName.trim(),
    organization: submission.organization.trim(),
    email: submission.email.trim(),
    normalizedEmail,
    projectSummary: submission.projectSummary.trim(),
    idempotencyKey: submission.clientRequestId,
    items: submission.items.map((item) => ({
      productId: item.productId.trim(),
      quantity: item.quantity
    })),
    consentLogs,
    requestOrigin: meta.requestOrigin.slice(0, 200),
    originIpHash: hashIpAddress(meta.originIp),
    userAgent: meta.userAgent?.slice(0, 512) ?? null
  };
}

export function buildResearchRequestMeta(request: Request, source: string): ResearchRequestMeta {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const requestUrl = new URL(request.url);

  return {
    source,
    requestOrigin: request.headers.get("origin")
      ?? request.headers.get("referer")
      ?? (forwardedHost ? `${requestUrl.protocol}//${forwardedHost}` : requestUrl.origin),
    originIp: forwardedFor?.split(",")[0]?.trim()
      ?? request.headers.get("x-real-ip")
      ?? null,
    userAgent: request.headers.get("user-agent")
  };
}

export function hashIpAddress(ip: string | null | undefined) {
  if (!ip) return null;
  return createHash("sha256").update(ip.trim()).digest("hex");
}
