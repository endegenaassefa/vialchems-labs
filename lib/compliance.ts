// Pattern adapted from mogtrix-website/site/lib/compliance.ts
// Adapted for peptide e-commerce context with: full Appendix P forbidden patterns
// (extends original 10-pattern set to ~40 patterns covering FDA enforcement triggers
// observed across 18 warning letters + 3 DOJ pleas + ITC GEO 337-TA-1377).
//
// v5.0 Phase 2.3 — Iron Law 2.29 extensions added: FDA approved-drug-analog
// regex (Tesamorelin/Egrifta), Melanocortin enforcement (Melanotan family +
// PT-141/Bremelanotide/Vyleesi), RUO bypass (BAC water), SS-31/Elamipretide,
// GLP-1 cousins (liraglutide/dulaglutide), short-code obfuscations (Reta,
// Tirz, Sema as standalone words), supplemental KLOW blend, and audit M1
// hyphen-form fix on the `\s*` quality-claim/human-use patterns.
//
// SCANNER_OK: reviewed-and-cso-passed (PROTECTED PATH — Iron Law 2.5/2.19).

import {
  BANNED_COMPOUNDS,
  OVERRIDE_ALLOWED_COMPOUNDS,
} from "./compliance/banned-compounds";

/**
 * Marketing-copy safety filter.
 *
 * Enforces Iron Law 2.4 (NO HUMAN-CONSUMPTION OR THERAPEUTIC LANGUAGE) and Iron
 * Law 2.13 (NO HEDGED-BUT-STILL-CLAIMING LANGUAGE) at runtime. The pre-commit
 * hook at scripts/grep-forbidden-words.sh runs the same patterns at static-time.
 *
 * The 18 FDA warning letters in the corpus consistently cite both bald claims
 * AND hedged claims (e.g., "potential therapeutic effects", "currently being
 * studied for [disease]"). RUO disclaimer alone does NOT protect when paired
 * with named-disease language, dosing protocols, or therapeutic-action verbs.
 *
 * Patterns are tested in this order. The first match short-circuits.
 */

/**
 * Hand-curated explicit regex set. Audit M1 fix replaced `\s*` with `[\s-]*`
 * for hyphen-form catches (e.g., pharmaceutical-grade now blocked).
 */
const explicitUnsafePatterns: readonly RegExp[] = [
  // Outcome claims (any context)
  /weight\s*loss/i,
  /fat\s*loss/i,
  /muscle\s*growth/i,
  /performance\s*enhanc/i,
  /performance\s*improv/i,
  /appetite\s*suppress/i,
  /blood\s*sugar/i,

  // Therapeutic-action verbs
  /\btreats?\b/i,
  /\bcures?\b/i,
  /\bdiagnos(?:e|is|es)\b/i,
  /\btherapy\b/i,
  /\btherapeutic\b/i,
  /\bcure\b/i,
  /\bprevent\s+(?:disease|illness)\b/i,

  // Approved-pharmaceutical comparisons (FDA explicitly cites in letters)
  /\bOzempic\b/i,
  /\bWegovy\b/i,
  /\bMounjaro\b/i,
  /\bZepbound\b/i,

  // Catalog exclusions (Iron Law 2.7).
  // tirzepatide + retatrutide removed from marketing-copy filter per
  // docs/DECISIONS/iron_law_2_7_override_2026-05-22.md (operator override).
  // The compounds still appear in BANNED_COMPOUNDS (audit trail) but are
  // operator-authorized for catalog inclusion + marketing copy.
  /GLP[-\s]?1/i,
  /\bsemaglutide\b/i,
  /\binsulin\b/i,
  /\bdiabetes\b/i,

  // v5 §2.29 extensions — FDA approved-drug-analog (Tesamorelin / Egrifta)
  /\btesamorelin\b/i,
  /\bth9507\b/i,
  /\begrifta\b/i,

  // v5 §2.29 extensions — Melanocortin FDA enforcement
  /\bmelanotan(?:-i{1,2}|-1|-2)?\b/i,
  /\bmt-?[12i]+\b/i, // catches mt-1, mt-2, mt-i, mt-ii, mt1, mt2
  /\bbremelanotide\b/i,
  /\bvyleesi\b/i,
  /\bpt-?141\b/i,

  // v5 §2.29 extensions — RUO bypass vector (BAC water family)
  /\bbacteriostatic[\s-]+water\b/i,
  /\bbac[\s-]+water\b/i,

  // v5 §2.29 extensions — GLP-1 cousins
  /\bliraglutide\b/i,
  /\bdulaglutide\b/i,

  // v5 §2.29 extensions — SS-31 (Elamipretide; approved-drug analog)
  /\bss-?31\b/i,
  /\belamipretide\b/i,

  // v5 §2.29 extensions — short-code GLP-1 obfuscations.
  // 'sema' stays banned. 'tirz' + 'reta' removed per the 2026-05-22
  // operator override (now appear legitimately as catalog shortNames).
  // Whole-word boundary so 'sermorelin', 'retreat', 'tirzon' are NOT
  // over-blocked when scanning copy.
  /\bsema\b/i,
  // 'klow' removed per the same override (catalog SKU klow-80mg).

  // Quality-claim language (FDA flags as drug-intent).
  // Audit M1: `\s*` was silently bypassing hyphenated forms; `[\s-]*` catches
  // both "medical grade" and "medical-grade".
  /clinically\s*proven/i,
  /medical[\s-]*grade/i,
  /pharmaceutical[\s-]*grade/i,
  /prescription[\s-]*strength/i,
  /FDA[\s-]*approved/i,
  /safe\s+for\s+human/i,
  /medical\s+advice/i,

  // Human-use intent (RUO defense piercing pattern).
  // Audit M1: `\s*` -> `[\s-]*` so hyphen forms (human-use, human-dosing,
  // human-consumption) now catch.
  /human[\s-]*use/i,
  /human[\s-]*consumption/i,
  /human[\s-]*dosing/i,
  /human[\s-]*ingestion/i,
  /human[\s-]*injection/i,
  /\bbodybuilding\b/i,

  // Dosing protocol language (FDA cited in 12+ letters).
  // Audit M1 hyphen-fix included for "dosing-protocol".
  /\bdosing[\s-]*recommendation/i,
  /\bdosing[\s-]*protocol/i,
  /\bdose[\s-]*protocol/i,
  /\brecommend(?:ed|s)?\s*dose/i,

  // Personal pronouns describing compound effects
  /\bmakes\s+you\b/i,
  /\bhelps\s+you\b/i,
  /\byour\s+(?:weight|gains|fat|muscles)\b/i,
  /\bimproves?\s+your\b/i,
  /\bfor\s+you(?:r|rs)?\s+(?:body|health|results)\b/i,
] as const;

/**
 * Auto-derived regex patterns from `BANNED_COMPOUNDS` (Iron Law 2.29 belt-
 * and-suspenders).
 *
 * If a future compound is added to the static blocklist but the operator
 * forgets to update `explicitUnsafePatterns`, the derived patterns will
 * still catch it. Two strategies based on entry shape:
 *
 *   - Multi-word or hyphenated entries (e.g. "bacteriostatic water",
 *     "melanotan-ii"): emit a regex with hyphen-or-space tolerance and a
 *     word boundary at start/end so substring-in-larger-string matches
 *     (e.g. "30ml bacteriostatic water vial" -> match).
 *   - Single-word entries (e.g. "tesamorelin", "reta"): emit a `\b...\b`
 *     word-boundary regex so legitimate words like "retreat", "sermorelin",
 *     "tirzon", "klowinski" are NOT over-blocked.
 */
// Filter override-allowed compounds out of the auto-derived regex so
// product descriptions / FAQ / blog body can legitimately reference them
// after operator override per docs/DECISIONS/iron_law_2_7_override_2026-05-22.md.
const OVERRIDE_ALLOWED_SET = new Set<string>(
  OVERRIDE_ALLOWED_COMPOUNDS.map((c) => c.toLowerCase()),
);

const derivedUnsafePatterns: readonly RegExp[] = BANNED_COMPOUNDS.filter(
  (compound) => !OVERRIDE_ALLOWED_SET.has(compound.toLowerCase()),
).map((compound) => {
  const lower = compound.toLowerCase();
  const escaped = lower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (lower.includes(" ") || lower.includes("-")) {
    // Multi-word / hyphenated: tolerate either space or hyphen as the
    // internal separator; flank with \b for word-boundary match.
    const flexible = escaped.replace(/(?:\\-| )/g, "[\\s-]");
    return new RegExp(`\\b${flexible}\\b`, "i");
  }
  // Single-word: strict \b...\b boundary.
  return new RegExp(`\\b${escaped}\\b`, "i");
});

export const unsafeMarketingPatterns: readonly RegExp[] = [
  ...explicitUnsafePatterns,
  ...derivedUnsafePatterns,
] as const;

/**
 * Throws if `copy` matches any forbidden marketing pattern.
 *
 * Use at every boundary where untrusted text becomes user-facing copy:
 *   - Product description rendering
 *   - Blog post body rendering
 *   - Customer qualification "research_purpose" submission
 *   - Newsletter / email template body
 *   - Operator-edited catalog metadata
 *
 * @throws Error with the matched pattern in the message for debug visibility.
 */
export function assertMarketingCopySafe(copy: string): void {
  if (typeof copy !== "string" || copy.length === 0) {
    return;
  }
  const match = unsafeMarketingPatterns.find((pattern) => pattern.test(copy));
  if (match) {
    throw new Error(
      `assertMarketingCopySafe violation: pattern ${match.source} matched in copy. ` +
        `See SUPER_PROMPT_v3 Appendix P for the full forbidden-pattern list.`,
    );
  }
}

/**
 * Non-throwing variant for batch validation (e.g., CMS import paths).
 * Returns the matched pattern source if violation, null otherwise.
 */
export function findMarketingCopyViolation(copy: string): string | null {
  if (typeof copy !== "string" || copy.length === 0) {
    return null;
  }
  const match = unsafeMarketingPatterns.find((pattern) => pattern.test(copy));
  return match ? match.source : null;
}
