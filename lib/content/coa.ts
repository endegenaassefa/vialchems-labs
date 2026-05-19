/** Public COA records. Only verified, uploaded certificates are listed here. */

export interface CoaRecord {
  peptide: string;
  peptideName: string;
  batch: string;
  testDate: string;
  lab: string;
  hplcPurityPct: number;
  sterilityResult: "PASS" | "FAIL";
  endotoxinEU_per_mg: string;
  pdfPath: string;
  status: "verified";
}

export const coaRecords: CoaRecord[] = [];

export function getCoa(peptide: string, batch: string): CoaRecord | undefined {
  return coaRecords.find((r) => r.peptide === peptide && r.batch === batch);
}
