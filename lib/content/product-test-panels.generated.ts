/**
 * AUTO-GENERATED — written by scripts/ingest-coa-pdfs.mjs.
 *
 * Do NOT hand-edit. Re-run the ingest script when COAs change.
 * See docs/operator-runbook.md § "H3 COA ingest" for the workflow.
 *
 * The map is mutable (plain object) so tests can seed + clean up
 * per the same pattern coa.ts uses for coaRecords.splice().
 *
 * Iron Law 2.45: no lab/manufacturer/janoshik fields per ProductTestPanel
 * type definition in lib/content/coa.ts. The ingest script enforces this.
 */
import type { ProductTestPanel } from "./coa";

export const productTestPanels: Record<string, ProductTestPanel> = {
  "bpc-157-10mg": {
    batch: "vc-bpc-157-bc1acd23",
    purity: {
      available: true,
      testDate: "2026-05-21",
      pdfPath: "/coa/bpc-157-10mg-purity.pdf",
      thumbPath: "/coa-thumbnails/bpc-157-10mg-purity.png",
    },
    sterility: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/bpc-157-10mg-sterility.pdf",
      thumbPath: "/coa-thumbnails/bpc-157-10mg-sterility.png",
      resultSummary: "PASS",
    },
    endotoxin: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/bpc-157-10mg-endotoxin.pdf",
      thumbPath: "/coa-thumbnails/bpc-157-10mg-endotoxin.png",
      resultSummary: "<0.05EU/mg",
    },
    heavyMetals: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/bpc-157-10mg-heavymetals.pdf",
      thumbPath: "/coa-thumbnails/bpc-157-10mg-heavymetals.png",
    },
  },
  "cjc-1295-ipamorelin-5mg": {
    batch: "vc-cjc-1295-ipa-6029008b",
    purity: {
      available: true,
      testDate: "2026-05-21",
      pdfPath: "/coa/cjc-1295-ipamorelin-5mg-purity.pdf",
      thumbPath: "/coa-thumbnails/cjc-1295-ipamorelin-5mg-purity.png",
    },
    sterility: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/cjc-1295-ipamorelin-5mg-sterility.pdf",
      thumbPath: "/coa-thumbnails/cjc-1295-ipamorelin-5mg-sterility.png",
      resultSummary: "PASS",
    },
    endotoxin: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/cjc-1295-ipamorelin-5mg-endotoxin.pdf",
      thumbPath: "/coa-thumbnails/cjc-1295-ipamorelin-5mg-endotoxin.png",
      resultSummary: "<0.05EU/mg",
    },
    heavyMetals: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/cjc-1295-ipamorelin-5mg-heavymetals.pdf",
      thumbPath: "/coa-thumbnails/cjc-1295-ipamorelin-5mg-heavymetals.png",
    },
  },
  "ghk-cu-50mg": {
    batch: "vc-ghk-cu-21f0f152",
    purity: {
      available: true,
      testDate: "2026-05-21",
      pdfPath: "/coa/ghk-cu-50mg-purity.pdf",
      thumbPath: "/coa-thumbnails/ghk-cu-50mg-purity.png",
    },
    sterility: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/ghk-cu-50mg-sterility.pdf",
      thumbPath: "/coa-thumbnails/ghk-cu-50mg-sterility.png",
      resultSummary: "PASS",
    },
    endotoxin: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/ghk-cu-50mg-endotoxin.pdf",
      thumbPath: "/coa-thumbnails/ghk-cu-50mg-endotoxin.png",
      resultSummary: "<0.05EU/mg",
    },
    heavyMetals: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/ghk-cu-50mg-heavymetals.pdf",
      thumbPath: "/coa-thumbnails/ghk-cu-50mg-heavymetals.png",
    },
  },
  "klow-80mg": {
    batch: "vc-klow-c5ea7df1",
    purity: {
      available: true,
      testDate: "2026-05-21",
      pdfPath: "/coa/klow-80mg-purity.pdf",
      thumbPath: "/coa-thumbnails/klow-80mg-purity.png",
    },
    sterility: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/klow-80mg-sterility.pdf",
      thumbPath: "/coa-thumbnails/klow-80mg-sterility.png",
      resultSummary: "PASS",
    },
    endotoxin: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/klow-80mg-endotoxin.pdf",
      thumbPath: "/coa-thumbnails/klow-80mg-endotoxin.png",
      resultSummary: "<0.05EU/mg",
    },
    heavyMetals: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/klow-80mg-heavymetals.pdf",
      thumbPath: "/coa-thumbnails/klow-80mg-heavymetals.png",
    },
  },
  "kpv-500mcg": {
    batch: "vc-kpv-2ec3cf27",
    purity: {
      available: true,
      testDate: "2026-05-21",
      pdfPath: "/coa/kpv-500mcg-purity.pdf",
      thumbPath: "/coa-thumbnails/kpv-500mcg-purity.png",
      resultSummary: "99.687%",
    },
    sterility: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/kpv-500mcg-sterility.pdf",
      thumbPath: "/coa-thumbnails/kpv-500mcg-sterility.png",
      resultSummary: "PASS",
    },
    endotoxin: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/kpv-500mcg-endotoxin.pdf",
      thumbPath: "/coa-thumbnails/kpv-500mcg-endotoxin.png",
      resultSummary: "<0.05EU/mg",
    },
    heavyMetals: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/kpv-500mcg-heavymetals.pdf",
      thumbPath: "/coa-thumbnails/kpv-500mcg-heavymetals.png",
    },
  },
  "mots-c-10mg": {
    batch: "vc-mots-c-d4de95eb",
    purity: {
      available: true,
      testDate: "2026-05-21",
      pdfPath: "/coa/mots-c-10mg-purity.pdf",
      thumbPath: "/coa-thumbnails/mots-c-10mg-purity.png",
    },
    sterility: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/mots-c-10mg-sterility.pdf",
      thumbPath: "/coa-thumbnails/mots-c-10mg-sterility.png",
      resultSummary: "PASS",
    },
    endotoxin: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/mots-c-10mg-endotoxin.pdf",
      thumbPath: "/coa-thumbnails/mots-c-10mg-endotoxin.png",
      resultSummary: "<0.05EU/mg",
    },
    heavyMetals: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/mots-c-10mg-heavymetals.pdf",
      thumbPath: "/coa-thumbnails/mots-c-10mg-heavymetals.png",
    },
  },
  "nad-500mg": {
    batch: "vc-nad-26014a68",
    purity: {
      available: true,
      testDate: "2026-05-21",
      pdfPath: "/coa/nad-500mg-purity.pdf",
      thumbPath: "/coa-thumbnails/nad-500mg-purity.png",
      resultSummary: "99.876%",
    },
    sterility: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/nad-500mg-sterility.pdf",
      thumbPath: "/coa-thumbnails/nad-500mg-sterility.png",
      resultSummary: "PASS",
    },
    endotoxin: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/nad-500mg-endotoxin.pdf",
      thumbPath: "/coa-thumbnails/nad-500mg-endotoxin.png",
      resultSummary: "<0.05EU/mg",
    },
    heavyMetals: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/nad-500mg-heavymetals.pdf",
      thumbPath: "/coa-thumbnails/nad-500mg-heavymetals.png",
    },
  },
  "reta-10mg": {
    batch: "vc-reta-9cfcc627",
    purity: {
      available: true,
      testDate: "2026-05-21",
      pdfPath: "/coa/reta-10mg-purity.pdf",
      thumbPath: "/coa-thumbnails/reta-10mg-purity.png",
    },
    sterility: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/reta-10mg-sterility.pdf",
      thumbPath: "/coa-thumbnails/reta-10mg-sterility.png",
      resultSummary: "PASS",
    },
    endotoxin: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/reta-10mg-endotoxin.pdf",
      thumbPath: "/coa-thumbnails/reta-10mg-endotoxin.png",
      resultSummary: "<0.05EU/mg",
    },
    heavyMetals: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/reta-10mg-heavymetals.pdf",
      thumbPath: "/coa-thumbnails/reta-10mg-heavymetals.png",
    },
  },
  "reta-20mg": {
    batch: "vc-reta-cffe7a9e",
    purity: {
      available: true,
      testDate: "2026-05-21",
      pdfPath: "/coa/reta-20mg-purity.pdf",
      thumbPath: "/coa-thumbnails/reta-20mg-purity.png",
    },
    sterility: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/reta-20mg-sterility.pdf",
      thumbPath: "/coa-thumbnails/reta-20mg-sterility.png",
      resultSummary: "PASS",
    },
    endotoxin: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/reta-20mg-endotoxin.pdf",
      thumbPath: "/coa-thumbnails/reta-20mg-endotoxin.png",
      resultSummary: "<0.05EU/mg",
    },
    heavyMetals: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/reta-20mg-heavymetals.pdf",
      thumbPath: "/coa-thumbnails/reta-20mg-heavymetals.png",
    },
  },
  "selank-10mg": {
    batch: "vc-selank-dcb1f849",
    purity: {
      available: true,
      testDate: "2026-05-21",
      pdfPath: "/coa/selank-10mg-purity.pdf",
      thumbPath: "/coa-thumbnails/selank-10mg-purity.png",
    },
    sterility: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/selank-10mg-sterility.pdf",
      thumbPath: "/coa-thumbnails/selank-10mg-sterility.png",
      resultSummary: "PASS",
    },
    endotoxin: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/selank-10mg-endotoxin.pdf",
      thumbPath: "/coa-thumbnails/selank-10mg-endotoxin.png",
      resultSummary: "<0.05EU/mg",
    },
    heavyMetals: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/selank-10mg-heavymetals.pdf",
      thumbPath: "/coa-thumbnails/selank-10mg-heavymetals.png",
    },
  },
  "semax-10mg": {
    batch: "vc-semax-11ae51e0",
    purity: {
      available: true,
      testDate: "2026-05-21",
      pdfPath: "/coa/semax-10mg-purity.pdf",
      thumbPath: "/coa-thumbnails/semax-10mg-purity.png",
    },
    sterility: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/semax-10mg-sterility.pdf",
      thumbPath: "/coa-thumbnails/semax-10mg-sterility.png",
      resultSummary: "PASS",
    },
    endotoxin: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/semax-10mg-endotoxin.pdf",
      thumbPath: "/coa-thumbnails/semax-10mg-endotoxin.png",
      resultSummary: "<0.05EU/mg",
    },
    heavyMetals: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/semax-10mg-heavymetals.pdf",
      thumbPath: "/coa-thumbnails/semax-10mg-heavymetals.png",
    },
  },
  "tb-500-10mg": {
    batch: "vc-tb-500-e94f3e48",
    purity: {
      available: true,
      testDate: "2026-05-21",
      pdfPath: "/coa/tb-500-10mg-purity.pdf",
      thumbPath: "/coa-thumbnails/tb-500-10mg-purity.png",
    },
    sterility: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/tb-500-10mg-sterility.pdf",
      thumbPath: "/coa-thumbnails/tb-500-10mg-sterility.png",
      resultSummary: "PASS",
    },
    endotoxin: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/tb-500-10mg-endotoxin.pdf",
      thumbPath: "/coa-thumbnails/tb-500-10mg-endotoxin.png",
      resultSummary: "<0.05EU/mg",
    },
    heavyMetals: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/tb-500-10mg-heavymetals.pdf",
      thumbPath: "/coa-thumbnails/tb-500-10mg-heavymetals.png",
    },
  },
  "tirz-25mg": {
    batch: "vc-tirz-c40d0f3c",
    purity: {
      available: true,
      testDate: "2026-05-21",
      pdfPath: "/coa/tirz-25mg-purity.pdf",
      thumbPath: "/coa-thumbnails/tirz-25mg-purity.png",
    },
    sterility: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/tirz-25mg-sterility.pdf",
      thumbPath: "/coa-thumbnails/tirz-25mg-sterility.png",
      resultSummary: "PASS",
    },
    endotoxin: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/tirz-25mg-endotoxin.pdf",
      thumbPath: "/coa-thumbnails/tirz-25mg-endotoxin.png",
      resultSummary: "<0.05EU/mg",
    },
    heavyMetals: {
      available: true,
      testDate: "2026-05-13",
      pdfPath: "/coa/tirz-25mg-heavymetals.pdf",
      thumbPath: "/coa-thumbnails/tirz-25mg-heavymetals.png",
    },
  },
};
