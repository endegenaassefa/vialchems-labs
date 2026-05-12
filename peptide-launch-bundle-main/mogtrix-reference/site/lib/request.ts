import { requiredAttestations } from "@/lib/attestations";
import type { CartItem, ResearchRequestSubmission } from "@/lib/types";

export const REQUEST_LIMITS = {
  maxItems: 20,
  maxProjectSummaryLength: 2000
} as const;

export type ResearchRequestForm = {
  contactName: string;
  organization: string;
  email: string;
  projectSummary: string;
  attestationIds: string[];
};

export function getResearchRequestItemCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function validateResearchRequest(form: ResearchRequestForm, items: CartItem[]) {
  const errors: string[] = [];
  const accepted = new Set(form.attestationIds);
  const itemCount = getResearchRequestItemCount(items);

  if (!items.length) errors.push("Add at least one research item before submitting.");
  if (itemCount > REQUEST_LIMITS.maxItems) errors.push(`Limit research requests to ${REQUEST_LIMITS.maxItems} items per submission.`);
  if (!form.contactName.trim()) errors.push("Enter a contact name.");
  if (!form.organization.trim()) errors.push("Enter an organization or research affiliation.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.push("Enter a valid email address.");
  if (form.projectSummary.trim().length < 12) errors.push("Describe the research request in at least 12 characters.");
  if (form.projectSummary.trim().length > REQUEST_LIMITS.maxProjectSummaryLength) {
    errors.push(`Keep the research summary under ${REQUEST_LIMITS.maxProjectSummaryLength} characters.`);
  }
  if (requiredAttestations.some((attestation) => !accepted.has(attestation.id))) {
    errors.push("All required attestations must be accepted.");
  }

  return { ok: errors.length === 0, errors };
}

export function buildResearchRequestPayload(
  form: ResearchRequestForm,
  items: CartItem[],
  clientRequestId: string
): ResearchRequestSubmission {
  return {
    clientRequestId,
    contactName: form.contactName.trim(),
    organization: form.organization.trim(),
    email: form.email.trim().toLowerCase(),
    projectSummary: form.projectSummary.trim(),
    attestationIds: Array.from(new Set(form.attestationIds.filter((id) => requiredAttestations.some((attestation) => attestation.id === id)))),
    items: items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity
    }))
  };
}
