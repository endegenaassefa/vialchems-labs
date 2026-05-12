// Pattern adapted from mogtrix-website/site/lib/customer-qualification.ts
// Adapted with peptide-specific attestation language per Appendix A.5.

import { z } from "zod";
import { findMarketingCopyViolation } from "@/lib/compliance";

/**
 * Customer qualification per SUPER_PROMPT_v3 Appendix A.5.
 *
 * Required at first checkout to confirm researcher identity, RUO acknowledgment,
 * 21+ age, and jurisdictional acknowledgment. Adapted from the upstream pattern
 * with peptide-context attestation language derived from the locked compliance
 * posture (see attribution comment on the first line of this file).
 *
 * The 7 attestations are non-negotiable and verbatim from Appendix A.5.
 */

export const QualificationRoles = [
  "academic-researcher",
  "clinical-research",
  "biotech-researcher",
  "lab-technician",
  "compounding-pharmacy",
  "other",
] as const;

export type QualificationRole = (typeof QualificationRoles)[number];

export const qualificationRoleLabels: Record<QualificationRole, string> = {
  "academic-researcher": "Academic researcher",
  "clinical-research": "Clinical research",
  "biotech-researcher": "Biotech researcher",
  "lab-technician": "Lab technician",
  "compounding-pharmacy": "Compounding pharmacy",
  other: "Other",
};

/**
 * Verbatim 7-attestation block from Appendix A.5. Buyer must affirm all.
 */
export const ATTESTATIONS = [
  "I am a qualified researcher acquiring products for in-vitro laboratory research only.",
  "I will not introduce these products into any human or animal subject.",
  "I am 21+ years of age.",
  "I understand these products are not approved by any regulatory authority for any indication.",
  "I am responsible for compliance with all applicable laws in my jurisdiction.",
  "I will store these products under appropriate laboratory conditions.",
  "I will not resell these products to consumers or unqualified third parties.",
] as const;

export const qualificationSchema = z.object({
  email: z.string().email("Valid email required"),
  role: z.enum(QualificationRoles),
  researchPurpose: z
    .string()
    .min(20, "Provide at least 20 characters describing the research context")
    .max(2000, "Statement exceeds 2000 characters")
    .refine(
      (val) => findMarketingCopyViolation(val) === null,
      "Research purpose contains language that does not match the research-use-only framing. Please rephrase using research-context vocabulary.",
    ),
  ageAcknowledgment: z.literal(true, {
    error: "You must confirm 21+ age",
  }),
  ruoAcknowledgment: z.literal(true, {
    error: "You must acknowledge research-use-only framing",
  }),
  jurisdictionAcknowledgment: z.literal(true, {
    error: "You must acknowledge jurisdictional compliance",
  }),
  attestationsAcknowledged: z.literal(true, {
    error: "You must affirm all 7 attestations",
  }),
});

export type QualificationInput = z.infer<typeof qualificationSchema>;

export interface QualificationRecord extends QualificationInput {
  id: string;
  submittedAt: string; // ISO timestamp
  status: "pending" | "approved" | "rejected";
}

/**
 * Validate qualification submission. Returns parsed input or violation list.
 */
export function validateQualification(
  raw: unknown,
):
  | { ok: true; data: QualificationInput }
  | { ok: false; errors: { field: string; message: string }[] } {
  const parsed = qualificationSchema.safeParse(raw);
  if (parsed.success) {
    return { ok: true, data: parsed.data };
  }
  const errors = parsed.error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
  return { ok: false, errors };
}
