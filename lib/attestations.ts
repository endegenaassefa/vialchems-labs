// Pattern adapted from mogtrix-website/site/lib/attestations.ts
// Adapted with peptide-specific context.
//
// Attestation immutability pipeline (Iron Law 2.10):
//
//   1. The verbatim legal text snapshotted at submission time is stored
//      alongside its SHA-256 hash so a future legal review can verify
//      the exact wording shown to the user when they clicked Accept.
//   2. The hashing helper `hashLegalText` lives here so the access
//      route, future order-confirmation flows, and the attestations_audit
//      back-fill scripts all share a single canonical algorithm.
//   3. Insertion site: `app/api/access/route.ts` calls `hashLegalText`,
//      then writes the result into the `customer_qualifications`,
//      `attestations_audit`, and `audit_log` tables on every POST.
//   4. The append-only trigger on `attestations_audit` (see
//      `supabase/migrations/20260520000001_append_only_triggers_and_indexes.sql`)
//      enforces the immutability after-the-fact at the DB layer.
//
// M9 closure (Phase 8): the hashing was inline in the access route; it
// is now a one-line helper exported from this module so the documented
// pipeline lines up with where the code actually lives.

import { createHash } from "node:crypto";
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

/**
 * Canonical SHA-256 hash of the legal text shown to the buyer at the
 * moment of acceptance. Hex-encoded.
 *
 * Iron Law 2.10: the hash is part of the immutability pipeline — every
 * `attestations_audit.legal_text_sha256` and
 * `customer_qualifications.attestation_text_sha256` value MUST come
 * from this helper so future legal review can re-derive the hash from
 * the verbatim text in source and confirm both match.
 *
 * The function is intentionally synchronous + side-effect-free so it
 * can run inside route handlers, Edge functions, and back-fill scripts
 * identically.
 */
export function hashLegalText(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

/**
 * Hash of the full 7-attestation block (joined by newline). Pre-computed
 * for callers that always submit the full block — saves the join +
 * hash on every POST.
 */
export function hashAttestationsBlock(): string {
  return hashLegalText(ATTESTATIONS.join("\n"));
}
