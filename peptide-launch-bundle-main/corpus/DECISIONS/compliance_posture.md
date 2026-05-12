# DECISION: Compliance Posture

Status: **LOCKED_DEFAULT** (operator may add jurisdictional or content modifications, but not weaken)
Sources:
- `02_claude_code_outputs/compliance_disclaimers/COMPLIANCE_DISCLAIMER_FINDINGS.md` (11 numbered findings)
- `02_claude_code_outputs/compliance_disclaimers/enforcement_events.md` (19 FDA letters + 3 DOJ + ITC GEO)
- `02_claude_code_outputs/compliance_disclaimers/marketing_language_compliance.md`
- `01_strategic_frame/combined_context.md` (Mogtrix Context.md mirror at /root/mogtrix-website/Context.md is also a journalism-grade timeline)

## Verbatim disclaimer block (footer, every page)

```
All products are sold for research, laboratory, or analytical purposes only, and are not for human consumption.

The statements made within this website have not been evaluated by the US Food and Drug Administration. The statements and the products of this company are not intended to diagnose, treat, cure or prevent any disease.

[BRAND] is a chemical supplier. [BRAND] is not a compounding pharmacy or chemical compounding facility as defined under 503A of the Federal Food, Drug, and Cosmetic act. [BRAND] is not an outsourcing facility as defined under 503B of the Federal Food, Drug, and Cosmetic act.
```

## Verbatim product-page disclaimer (every product)

```
For research use only. Not for human or veterinary use. These products are not intended for human dosing, injection, or ingestion. Bodily introduction of any kind into humans or animals is strictly forbidden by law.
```

## Age gate

**Pattern**: text-based contractual checkbox (NOT modal popup). Lower friction, equally legally defensible. Pattern observed at 60% of Tier 1 vendors.

**Threshold**: 21+ (matches the more conservative end of vendor-universe practice).

**Verbatim text** (checkbox at first cart action):
```
[ ] I confirm that I am 21+ years of age and will use these products solely for laboratory research in non-clinical settings. Products are not for human consumption.
```

## Jurisdictional restrictions

**Default block list (states with documented enforcement risk)**: California, Texas, New York, Florida.
**International default**: US-only shipping. Add countries individually only after legal review.

**Verbatim text** (Shipping Policy + checkout):
```
[BRAND] ships to addresses within the United States. [BRAND] does not ship to: California, Texas, New York, Florida. The customer assumes all regulatory compliance responsibility for their jurisdiction specific to their municipality, state, or country.
```

## What the brand will NEVER say

(Extending `lib/compliance.ts` `assertMarketingCopySafe` with peptide-specific patterns.)

Forbidden marketing patterns:
- "Weight loss"
- "Blood sugar"
- "Appetite suppression"
- "GLP-1"
- "Semaglutide" / "Tirzepatide" / "Retatrutide" in consumer context
- "Insulin"
- "Diabetes"
- "Diagnose" / "Treat" / "Cure" / "Prevent"
- "Human use" / "Human dosing" / "Human consumption"
- "FDA approved" (false claim)
- "Pharmaceutical grade" / "Prescription strength" (false equivalence)
- "Therapy" / "Therapeutic"
- "Medical advice"
- Personal pronouns describing compound effects ("makes you", "for you", "your weight")

## COA hosting model

**Primary**: per-batch on-site PDFs linked from product pages (Limitless Life pattern)
**Secondary**: searchable batch-lot index at `/coa/` (Swiss Chems pattern)
**Tertiary**: third-party portal links (Janoshik / Kovera / TrustPointe / MZ Biolabs)

Every product page must show:
- Batch/lot number (mono font)
- Test date
- Lab name
- COA link (PDF)
- Test types: HPLC, Mass Spec, Endotoxin, Sterility (when applicable)

## Buyer qualification

**Pattern**: structured qualification form before first order (Mogtrix already implements this — reuse).

Required fields:
- Email (verified)
- Institution / role (researcher, lab tech, compounding pharmacy, biotech, other)
- Research purpose (free text, screened by `assertMarketingCopySafe`)
- Age confirmation (21+)
- Research-use-only acknowledgment
- Jurisdictional acknowledgment

The Mogtrix `lib/customer-qualification.ts` plus `components/qualification-flow.tsx` provides the scaffold. Update attestation text for peptide context.

## Customer service vocabulary discipline

Per Proven Peptides red-flag analysis (defunct vendor's defensive disclaimer language anticipated screenshot evidence): customer service team uses "research" / "laboratory" / "in-vitro" vocabulary consistently. NEVER personal pronouns when discussing compound effects.

## What this posture buys

Per `compliance_disclaimers/` corpus and the 19 FDA warning letters: this posture matches the strongest observed vendors (Peptide Partners, Skye Peptides, Limitless Life) and avoids the patterns that triggered the 2026-03-31 FDA enforcement wave (which pierced "Research Use Only" defenses where vendors paired RUO with human-benefit marketing).

## Operator extensions allowed

- Strengthen jurisdictional block list (add more states)
- Strengthen age gate (move to modal, raise to third-party verification via Intellicheck/Socure)
- Add lab partner names (when source terms are confirmed)
- Add additional disclaimer language

Operator extensions NOT allowed:
- Weaken any of the above
- Add forbidden marketing patterns
- Use personal pronouns in compound descriptions
- Skip the qualification flow
