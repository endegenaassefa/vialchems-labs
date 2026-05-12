# DECISION: Opening SKU Set

Status: **LOCKED_DEFAULT** (operator may override)
Source: `02_claude_code_outputs/opening_sku_recommendation.md`
Rubric: Bible §15 (per-mg margin 35% × demand 35% × supply 20% × compliance 10%)

## The 7 opening SKUs

| # | SKU | Format | List | Per-mg | Position | Role |
|---|---|---|---|---|---|---|
| 1 | BPC-157 10mg | vial | $54.00 | $5.40 | 10% below median | loss-leader |
| 2 | TB-500 5mg | vial | $34.00 | $6.80 | 5% below median | loss-leader |
| 3 | GHK-Cu 50mg | vial | $34.00 | $0.68 | 9% below median | loss-leader |
| 4 | Ipamorelin 10mg | vial | $50.00 | $5.00 | just below p25 | volume driver |
| 5 | CJC-1295 (no DAC) 5mg | vial | $25.00 | $5.00 | just below p25 | volume driver |
| 6 | MOTS-c 10mg | vial | $48.00 | $4.80 | median | catalog filler |
| 7 | Selank 10mg | vial | $48.00 | $4.80 | just below median | catalog filler |

All prices verified against `sku_distributions.md` market percentiles for each peptide.

## Bundle

**Recovery Stack**: BPC-157 10mg + TB-500 5mg = $77.00 (vs $88.00 a la carte = 12.5% effective discount)

Backed by 298 of 3,388 rows in `pricing_matrix.csv` tagged with bundle membership; recovery-stack labels (`BPC-TB-blend`, `BPC-TB500-blend`, `BNDL-LOOKSMAX`, `bpc-157-tb-500`, `wolverine`) are the most attested pattern.

## Intro Promo

15% off first order via newsletter signup, gated behind:
1. Research-use-only acknowledgment
2. Age gate (18+ or 21+)

## GLP-1 Carve-Out

**Excluded** from opening set per Bible §15.4 conservative compliance posture:
- Tirzepatide (highest demand, 207 vendors, but ITC GEO 337-TA-1377 in effect)
- Semaglutide (153 vendors)
- Retatrutide (222 vendors)

**Operator may override after**: B1 fire (community channel data) plus operator review of FDA enforcement signal in `compliance_disclaimers/enforcement_events.md`.

## How to override

Replace this file's body with:

```
LOCKED_OVERRIDE: <override reason>
Locked-on: YYYY-MM-DD
Override scope: <pricing | catalog additions | catalog removals | both>
Specific changes:
  - <SKU>: <change> (rationale)
GLP-1 inclusion decision: <still excluded | include Semaglutide only | include Tirzepatide only | include all>
Override rationale: <2-3 sentences>
```

## Why this default is shippable as-is

Per audit (`AUDIT_2026-05-08.md` §3.2): all 7 prices verified against actual market distributions. Bible §15 rubric satisfied. Bundle math validated. Promo mechanic matches observed crypto-discount band. Day-1 catalog is rubric-compliant and competitive.
