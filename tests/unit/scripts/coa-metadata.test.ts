/**
 * COA metadata extraction tests. Inputs are OCR-text fixtures that
 * mimic the Janoshik template (with realistic OCR noise).
 */
import { describe, expect, it } from "vitest";

import {
  deriveBrandNeutralBatch,
  extractEndotoxinResult,
  extractOriginalBatch,
  extractPassFailResult,
  extractPurityResult,
  extractTestDate,
} from "../../../scripts/coa-redaction/extract-metadata.mjs";

const PURITY_FIXTURE = `
TEST REPORT Janoshik
Task Number #55477 Testing ordered > 13 MAY 2026
Sample received > 20 MAY 2026
Client vialchemlabs
Sample BPC-157 10mg
Manufacturer wuhanwansheng.net
Batch wwk7U082
Results >
BPC-157 10.00 mg
Purity 99.245
Comments >
Analysis conducted > 21 MAY 2026 Signature >
Verify this test at www.janoshike.com/verify/ with the following unique key
WUSSOKHERSEO
`;

const STERILITY_FIXTURE = `
TEST REPORT Janoshik
Sample BPC-157 10mg
Batch wwk7U082
Results > PASS
Analysis conducted > 21 MAY 2026
`;

const ENDOTOXIN_FIXTURE = `
TEST REPORT Janoshik
Sample BPC-157 10mg
Batch wwk7U082
Results > <0.5 EU/mg
Analysis conducted > 21 MAY 2026
`;

describe("extractTestDate", () => {
  it("prefers 'Analysis conducted' date over other dates", () => {
    expect(extractTestDate(PURITY_FIXTURE)).toBe("2026-05-21");
  });

  it("falls back to 'Testing ordered' when analysis-conducted is absent", () => {
    const text = "Testing ordered > 13 MAY 2026\nSample received > 14 MAY 2026";
    expect(extractTestDate(text)).toBe("2026-05-13");
  });

  it("returns null when no parseable date present", () => {
    expect(extractTestDate("no dates here")).toBeNull();
  });
});

describe("extractPurityResult", () => {
  it("captures the 'Purity X.XXX' value as a %% string", () => {
    expect(extractPurityResult(PURITY_FIXTURE)).toBe("99.245%");
  });

  it("returns null when no purity reading present", () => {
    expect(extractPurityResult(STERILITY_FIXTURE)).toBeNull();
  });
});

describe("extractPassFailResult", () => {
  it("detects PASS in sterility text", () => {
    expect(extractPassFailResult(STERILITY_FIXTURE)).toBe("PASS");
  });

  it("returns null when neither PASS nor FAIL present", () => {
    expect(extractPassFailResult("no verdict here")).toBeNull();
  });
});

describe("extractEndotoxinResult", () => {
  it("normalizes '<0.5 EU/mg' (with possible OCR spaces)", () => {
    expect(extractEndotoxinResult(ENDOTOXIN_FIXTURE)).toBe("<0.5EU/mg");
    expect(extractEndotoxinResult("Results > < 0.25 EU / mg")).toBe("<0.25EU/mg");
  });
});

describe("extractOriginalBatch", () => {
  it("captures the Batch field from the COA body", () => {
    expect(extractOriginalBatch(PURITY_FIXTURE)).toBe("wwk7U082");
  });
});

describe("deriveBrandNeutralBatch", () => {
  it("returns a vc-<stem>-<8hex> identifier (deterministic per inputs)", () => {
    const a = deriveBrandNeutralBatch("bpc-157-10mg", "wwk7U082", "2026-05-21");
    const b = deriveBrandNeutralBatch("bpc-157-10mg", "wwk7U082", "2026-05-21");
    expect(a).toBe(b);
    expect(a).toMatch(/^vc-bpc-157-[0-9a-f]{8}$/);
  });

  it("changes when origBatch changes", () => {
    const a = deriveBrandNeutralBatch("bpc-157-10mg", "wwk7U082", "2026-05-21");
    const b = deriveBrandNeutralBatch("bpc-157-10mg", "wwk7U999", "2026-05-21");
    expect(a).not.toBe(b);
  });

  it("works even when origBatch is null (falls back to slug+date hash)", () => {
    const r = deriveBrandNeutralBatch("klow-80mg", null, "2026-05-21");
    expect(r).toMatch(/^vc-klow-[0-9a-f]{8}$/);
  });
});
