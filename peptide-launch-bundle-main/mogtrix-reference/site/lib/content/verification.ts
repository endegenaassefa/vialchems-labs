export type VerificationBatch = {
  batchId: string;
  category: string;
  productSlug: string;
  status: "verified" | "review" | "expired";
  documentStatus: string;
  documentSet: string[];
  releasedAt: string;
  testingLab: string;
  notes: string;
};

export const sampleBatches: VerificationBatch[] = [
  {
    batchId: "MGX-BPC-2604",
    category: "BPC-157 5mg",
    productSlug: "bpc-157-5mg",
    status: "verified",
    documentStatus: "COA-ready record",
    documentSet: ["Identity summary", "Lot COA status", "Handling note"],
    releasedAt: "2026-04-02",
    testingLab: "Third-party analytical record review",
    notes: "Demo record for UI verification. Not a live product record."
  },
  {
    batchId: "MGX-BT5-2604",
    category: "BPC-157 + TB-500 5mg/5mg",
    productSlug: "bpc-157-tb-500-5mg-5mg",
    status: "review",
    documentStatus: "Document review",
    documentSet: ["Identity summary", "Blend record", "Storage note"],
    releasedAt: "2026-04-12",
    testingLab: "Third-party analytical record review",
    notes: "Demo record marked for administrative review."
  },
  {
    batchId: "MGX-SMX-2604",
    category: "Semax 5mg",
    productSlug: "semax-5mg",
    status: "expired",
    documentStatus: "Archived record",
    documentSet: ["Archived lot record"],
    releasedAt: "2025-11-18",
    testingLab: "Archived analytical packet",
    notes: "Demo archived record. Public lookup should show clear status."
  }
];

export type LookupResult =
  | { state: "empty"; message: string }
  | { state: "found"; batch: VerificationBatch }
  | { state: "missing"; message: string };

export function lookupBatch(query: string, batches = sampleBatches): LookupResult {
  const normalized = query.trim().toUpperCase();

  if (!normalized) {
    return {
      state: "empty",
      message: "Enter a batch code to search the verification index."
    };
  }

  const batch = batches.find((candidate) => candidate.batchId === normalized);

  if (!batch) {
    return {
      state: "missing",
      message:
        "No public verification record matched that code. Check the format or contact support after qualification."
    };
  }

  return { state: "found", batch };
}
