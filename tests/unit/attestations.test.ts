/**
 * lib/attestations.ts unit tests.
 *
 * Phase 8 (M9 closure) — the `hashLegalText` + `hashAttestationsBlock`
 * helpers anchor the Iron Law 2.10 immutability pipeline: every
 * `attestations_audit.legal_text_sha256` value MUST come from the same
 * canonical algorithm.
 */
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  AGE_GATE_TEXT,
  JURISDICTION_ACK_TEXT,
  RUO_ACK_TEXT,
  getQualificationAttestations,
  hashAttestationsBlock,
  hashLegalText,
} from "@/lib/attestations";
import { ATTESTATIONS } from "@/lib/customer-qualification";

describe("hashLegalText", () => {
  it("returns the SHA-256 hex digest of the input", () => {
    const expected = createHash("sha256").update("hello").digest("hex");
    expect(hashLegalText("hello")).toBe(expected);
  });

  it("is stable across calls (pure function)", () => {
    const a = hashLegalText(AGE_GATE_TEXT);
    const b = hashLegalText(AGE_GATE_TEXT);
    expect(a).toBe(b);
  });

  it("differs when input differs by a single character", () => {
    const a = hashLegalText(AGE_GATE_TEXT);
    const b = hashLegalText(AGE_GATE_TEXT.replace("21+", "21 "));
    expect(a).not.toBe(b);
  });

  it("hashes the empty string to the standard SHA-256 of the empty string", () => {
    const expected = createHash("sha256").update("").digest("hex");
    expect(hashLegalText("")).toBe(expected);
  });
});

describe("hashAttestationsBlock", () => {
  it("hashes the 7-attestation block joined by newline", () => {
    const expected = createHash("sha256")
      .update(ATTESTATIONS.join("\n"))
      .digest("hex");
    expect(hashAttestationsBlock()).toBe(expected);
  });

  it("equals hashLegalText(ATTESTATIONS.join('\\n'))", () => {
    expect(hashAttestationsBlock()).toBe(
      hashLegalText(ATTESTATIONS.join("\n")),
    );
  });
});

describe("getQualificationAttestations", () => {
  it("returns the same 7-attestation block as the customer-qualification module", () => {
    expect(getQualificationAttestations()).toEqual(ATTESTATIONS);
    expect(getQualificationAttestations().length).toBe(7);
  });
});

describe("verbatim legal text exports", () => {
  it("AGE_GATE_TEXT contains the 21+ confirmation phrase", () => {
    expect(AGE_GATE_TEXT).toMatch(/21\+/);
    expect(AGE_GATE_TEXT).toMatch(/laboratory research/i);
    expect(AGE_GATE_TEXT).toMatch(/not for human consumption/i);
  });

  it("RUO_ACK_TEXT mentions research, laboratory, or analytical purposes", () => {
    expect(RUO_ACK_TEXT).toMatch(/research, laboratory, or analytical/i);
  });

  it("JURISDICTION_ACK_TEXT mentions municipality, state, or country", () => {
    expect(JURISDICTION_ACK_TEXT).toMatch(/municipality, state, or country/i);
  });
});
