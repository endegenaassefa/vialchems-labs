// Pattern adapted from mogtrix-website/site/lib/compliance.ts
// Adapted for peptide e-commerce context with: full Appendix P forbidden patterns
// (extends original 10-pattern set to ~40 patterns covering FDA enforcement triggers
// observed across 18 warning letters + 3 DOJ pleas + ITC GEO 337-TA-1377).

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

export const unsafeMarketingPatterns: readonly RegExp[] = [
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

  // Catalog exclusions (Iron Law 2.7)
  /GLP[-\s]?1/i,
  /\bsemaglutide\b/i,
  /\btirzepatide\b/i,
  /\bretatrutide\b/i,
  /\binsulin\b/i,
  /\bdiabetes\b/i,

  // Quality-claim language (FDA flags as drug-intent)
  /clinically\s*proven/i,
  /medical\s*grade/i,
  /pharmaceutical\s*grade/i,
  /prescription\s*strength/i,
  /FDA[-\s]*approved/i,
  /safe\s+for\s+human/i,
  /medical\s+advice/i,

  // Human-use intent (RUO defense piercing pattern)
  /human\s*use/i,
  /human\s*consumption/i,
  /human\s*dosing/i,
  /human\s*ingestion/i,
  /human\s*injection/i,
  /\bbodybuilding\b/i,

  // Dosing protocol language (FDA cited in 12+ letters)
  /\bdosing\s*recommendation/i,
  /\bdosing\s*protocol/i,
  /\bdose\s*protocol/i,
  /\brecommend(?:ed|s)?\s*dose/i,

  // Personal pronouns describing compound effects
  /\bmakes\s+you\b/i,
  /\bhelps\s+you\b/i,
  /\byour\s+(?:weight|gains|fat|muscles)\b/i,
  /\bimproves?\s+your\b/i,
  /\bfor\s+you(?:r|rs)?\s+(?:body|health|results)\b/i,
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
  if (typeof copy !== 'string' || copy.length === 0) {
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
  if (typeof copy !== 'string' || copy.length === 0) {
    return null;
  }
  const match = unsafeMarketingPatterns.find((pattern) => pattern.test(copy));
  return match ? match.source : null;
}
