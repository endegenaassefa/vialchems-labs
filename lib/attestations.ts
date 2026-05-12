// Pattern adapted from mogtrix-website/site/lib/attestations.ts
// Adapted with peptide-specific context.

import { ATTESTATIONS } from "./customer-qualification";

/**
 * Attestation tracking — separate from full qualification record so
 * intermediate steps (e.g., age-gate-only at first cart action) can persist
 * without committing the full 7-attestation block until checkout.
 */

export interface AttestationRecord {
  type: "age-gate" | "ruo" | "jurisdiction" | "qualification-full";
  acknowledgedAt: string; // ISO timestamp
  ipAddress?: string;
  userAgent?: string;
}

export interface AgeGateAttestation extends AttestationRecord {
  type: "age-gate";
  ageThreshold: 21;
  text: string; // verbatim from Appendix A.3
}

export const AGE_GATE_TEXT =
  "I confirm that I am 21+ years of age and will use these products solely for laboratory research in non-clinical settings. Products are not for human consumption.";

export const RUO_ACK_TEXT =
  "I acknowledge that all products are sold for research, laboratory, or analytical purposes only, and not for human consumption.";

export const JURISDICTION_ACK_TEXT =
  "I assume all regulatory compliance responsibility for my jurisdiction specific to my municipality, state, or country.";

export function getQualificationAttestations(): readonly string[] {
  return ATTESTATIONS;
}
