# DECISION: Source-Side Terms

Status: **PENDING**
Closes: blocking for super-prompt lock
Source: direct conversation with supplier (NOT a research output)

## What the operator decides here

Capture the supplier's actual terms so the super-prompt can prescribe accurate fulfillment promises, finalize per-mg margins, and scope the opening stock buy.

## Required answers (per Bible §8 + §14)

1. **Supplier identity** — which vendor or lab, what reputation in source-review threads.
2. **MOQ** — minimum order quantity per peptide, can it be met for the trial-run budget.
3. **Lab-test passthrough format** — what COAs you can pass through to your customers, in what format (PDF? web portal? per-batch numbered?), at what frequency.
4. **Restocking lead time** — how fast can you re-up if a SKU sells out mid-trial.
5. **Contingency posture** — what's your plan if the source goes dark, raises prices, or is themselves shut down. Backup source identified?
6. **Exclusivity terms** — does the source restrict who else they sell to in your geography or culture.
7. **Per-mg cost at trial-run volumes** — confirms the 70-75% margin assumption from Bible §10. If margin compresses below 50% at small volume, pricing strategy needs adjustment.
8. **Vialing supply chain** — where empty vials, labels, stoppers, boxes come from; what compliance information has to be on the label.
9. **Shipping origin** — does the supplier ship direct to the customer (drop-ship), or to the operator first for repackaging.
10. **Payment terms** — net-30, COD, prepay, crypto-only.

## How to lock this decision

Replace this file's body with:

```
LOCKED: source terms confirmed
Locked-on: YYYY-MM-DD
Supplier: <name> (kept confidential in source-review references)
MOQ:
  BPC-157 10mg vial: <quantity>
  TB-500 5mg vial: <quantity>
  GHK-Cu 50mg vial: <quantity>
  Ipamorelin 10mg vial: <quantity>
  CJC-1295 (no DAC) 5mg vial: <quantity>
  MOTS-c 10mg vial: <quantity>
  Selank 10mg vial: <quantity>
COA format: <PDF | web portal | per-batch numbered | other>
COA per-batch: <yes/no>
Restocking lead time: <N business days>
Contingency: <backup supplier identified yes/no, plan if primary goes dark>
Exclusivity: <none | regional | other>
Per-mg cost at trial volume: <$X.XX/mg per peptide>
Margin at recommended list price: <% per peptide>
Vialing: <empty vials from X, labels printed by Y, packaging Z>
Shipping origin: <drop-ship from supplier | repackaged by operator>
Payment terms: <prepay | net-30 | crypto-only | other>
Initial stock buy size: <$X total, <quantities>>
```

## Why this blocks the super-prompt

Without source terms, the site cannot accurately promise shipping speed, the catalog cannot be confidently priced (margin assumption is not validated), the COA module cannot be accurately templated (format unknown), and the operational flow (drop-ship vs repackage) cannot be wired up.
