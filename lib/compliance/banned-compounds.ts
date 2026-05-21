/**
 * Iron Law 2.29 — static banned-compound blocklist (LAST-LINE structural defense).
 *
 * Complements the catalog-inclusion gate in `components/ui/Vial.tsx`
 * `assertCompoundAllowed`. The two-gate posture:
 *   1. Catalog gate: compound must be in `lib/content/products.ts`
 *   2. Blocklist gate (THIS file): compound must NOT match BANNED_COMPOUNDS
 *
 * Audit C5 + supplemental S1 demonstrated concretely that catalog-only
 * gating is insufficient: when the operator added shortName="Reta" + "Tirz"
 * to `products.ts`, Vial.tsx auto-allowed them (audit predicted this; S1
 * confirmed it). This blocklist refuses banned compounds EVEN IF they
 * appear in the catalog.
 *
 * SCANNER_OK: reviewed-and-cso-passed (PROTECTED PATH — Iron Law 2.5/2.19).
 *
 * Per Iron Law 2.7 (PERPETUAL ban for tirzepatide/semaglutide/retatrutide/
 * GLP-1/BAC water) extended by v5 §2.29 to add tesamorelin/melanotan/
 * bremelanotide/MT-2/MT-II/SS-31 + supplemental KLOW.
 *
 * To override: commit `docs/DECISIONS/iron_law_2_7_override_<date>.md` with
 * legal opinion attached + per-SKU justification. Then either remove the
 * compound from this blocklist (changing 2.29 LOCKED state) OR keep it on
 * the blocklist and add a per-SKU exception via a documented mechanism.
 */

export const BANNED_COMPOUNDS = [
  // v3 PERPETUAL bans (GLP-1 class + long-form names)
  "tirzepatide",
  "semaglutide",
  "retatrutide",
  "liraglutide",
  "dulaglutide",
  // v3 PERPETUAL bans (short-code obfuscations as standalone words)
  "tirz",
  "sema",
  "reta",
  // v3 PERPETUAL bans (GLP-1 class identifiers)
  "glp-1",
  "glp1",
  "glp 1",
  "glp-1ra",
  // v5 §2.29 additions — FDA approved-drug-analog (Tesamorelin/Egrifta)
  "tesamorelin",
  "th9507",
  "egrifta",
  // v5 §2.29 additions — Melanocortin FDA enforcement (Melanotan + variants)
  "melanotan",
  "melanotan-i",
  "melanotan-ii",
  "mt-i",
  "mt-ii",
  "mt-1",
  "mt-2",
  "bremelanotide",
  "vyleesi",
  "pt-141",
  "pt141",
  // v5 §2.29 additions — RUO bypass vector
  "bacteriostatic water",
  "bac water",
  "bacteriostatic-water",
  "bac-water",
  // v5 §2.29 additions — SS-31 (Elamipretide; approved-drug analog)
  "ss-31",
  "ss31",
  "elamipretide",
  // v5.0 supplemental — undetermined-composition blend (operator commit
  // e2413ead "fix: restore catalog artwork with KLOW Reta corrections"
  // shipped this compound; KLOW = composite product whose constituent list
  // is not declared in catalog. Default-ban until composition + legal
  // opinion are committed via docs/DECISIONS/locked_override).
  "klow",
] as const;

export type BannedCompound = (typeof BANNED_COMPOUNDS)[number];

/**
 * Case-insensitive substring + whole-word check.
 *
 * Strategy: normalize input to lowercase, then test against each entry.
 * For each entry:
 *   - if entry contains a space or hyphen, do substring match (compound
 *     names with separators must match exactly with delimiter normalization)
 *   - else do whole-word match (avoids false positives on substrings like
 *     "tirz" matching benign words; uses \b word boundaries on hyphen/space)
 *
 * Returns true if input matches ANY banned compound.
 *
 * Examples:
 *   isBannedCompound("Reta")              -> true (whole-word match)
 *   isBannedCompound("Reta 10mg")         -> true
 *   isBannedCompound("retatrutide-10mg")  -> true (substring within token)
 *   isBannedCompound("KLOW 80mg")         -> true
 *   isBannedCompound("BPC-157")           -> false
 *   isBannedCompound("Selank")            -> false
 *   isBannedCompound("ipamorelin")        -> false
 */
export function isBannedCompound(input: string): boolean {
  if (!input || typeof input !== "string") return false;
  const normalized = input.toLowerCase().trim();
  if (normalized.length === 0) return false;
  return BANNED_COMPOUNDS.some((compound) => {
    const banned = compound.toLowerCase();
    // For multi-word or hyphenated bans, do substring match
    if (banned.includes(" ") || banned.includes("-")) {
      return normalized.includes(banned);
    }
    // For single-word bans, do whole-word match (allow hyphen/space boundaries)
    const escaped = banned.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const wordBoundary = new RegExp(
      `(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`,
      "i",
    );
    return wordBoundary.test(normalized);
  });
}
