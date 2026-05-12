# Pillar A Schema (per-vendor profile)

> Read together with `00_inputs/research_directive.md` §3 (Anti-Cheat
> Covenant), §5 (Per-Vendor Workflow), §6 (Per-Claim Evidence
> Protocol), and §10 (Self-Audit). This schema specifies the JSON
> shape; the directive specifies the verification gates. Both bind.

Every vendor profile is a JSON file at
`02_claude_code_outputs/vendors/{slug}.json` with these fields.

## Required JSON shape

```jsonc
{
  // identity
  "vendor_slug": "kebab-case-vendor-name",
  "brand_name": "Brand Name",
  "primary_domain": "https://...",

  // fetch metadata
  "fetched_url": "https://... (the URL you actually fetched first)",
  "fetched_at": "ISO 8601 timestamp",
  "fetch_status": "ok | partial | failed",

  // tiering and completion
  "tier": "1 | 2 | 3",
  "tier_rationale": "if tier was downgraded from seed assignment, why; otherwise leave as 'as-assigned'",
  "field_completion_ratio": "decimal between 0 and 1 — proportion of schema fields with non-uncertain values; computed at profile-write time and used to validate fetch_status per directive Rule 17",

  // jurisdiction and operations
  "country_of_operation": "...",
  "fulfillment_country": "...",
  "ship_to_scope": "us_only | us_intl | intl_excl_us",
  "year_established": "YYYY or unknown",

  // homepage
  "homepage": {
    "hero_copy_excerpt": "verbatim quote, max 200 chars",
    "hero_imagery_style": "clinical | lifestyle | meme_coded | anonymous | other",
    "primary_cta": "...",
    "navigation_pattern": "...",
    "footer_disclaimers": "verbatim quote"
  },

  // catalog
  "catalog": {
    "sku_count": "integer or unknown",
    "category_taxonomy": ["..."],
    "search_filter_capabilities": "...",
    "stack_bundle_pages_present": "true | false"
  },

  // representative product page
  "product_page_anatomy": {
    "sample_product_url": "https://...",
    "sample_product_name": "...",
    "dose_options": ["..."],
    "list_price": "$...",
    "per_mg_cost": "$...",
    "photographic_treatment": "...",
    "description_copy_excerpt": "verbatim quote, max 300 chars",
    "exact_disclaimer_language": "verbatim quote",
    "coa_present": "true | false",
    "coa_hosting": "on_site | third_party_portal | none",
    "lab_partner_named": "...",
    "batch_lot_transparency": "true | false",
    "customer_review_module_present": "true | false",
    "related_product_modules_present": "true | false"
  },

  // trust and compliance
  "trust_compliance": {
    "research_use_only_phrasing": "verbatim quote",
    "age_gate_present": "true | false",
    "jurisdictional_restriction_notice": "verbatim quote or none",
    "tos_url": "https://...",
    "tos_highlights": "...",
    "refund_policy": "...",
    "shipping_policy": "..."
  },

  // checkout
  "checkout_flow": {
    "account_required": "true | false",
    "guest_checkout_available": "true | false",
    "fields_collected": ["..."],
    "id_verification_present": "true | false",
    "payment_methods_accepted": ["named methods, e.g., 'BTC', 'ETH', 'USDT-TRC20', 'eCheck', 'wire', 'gift_card', 'credit_card_via_X'"],
    "shipping_carriers": ["..."],
    "shipping_cost_structure": "...",
    "international_policy": "..."
  },

  // tech stack
  "tech_stack": {
    "platform_signal": "shopify | woocommerce | bigcommerce | wix | custom | headless | unknown",
    "cdn": "...",
    "analytics_tools_loaded": ["..."],
    "marketing_pixels_present": ["..."],
    "chat_widget_present": "true | false"
  },

  // content
  "content_footprint": {
    "blog_present": "true | false",
    "blog_url": "https://... or none",
    "content_cadence": "...",
    "topic_taxonomy": ["..."],
    "author_bylines_present": "true | false",
    "internal_linking_to_products": "..."
  },

  // social proof
  "social_proof": {
    "on_site_reviews": "true | false",
    "off_site_aggregators": ["..."],
    "testimonial_usage": "...",
    "visible_influencer_endorsements": "..."
  },

  // SKUs (Pillar C feeds from this array)
  "skus": [
    {
      "sku_id": "<vendor_slug>:<sku-slug> — globally unique",
      "name": "...",
      "peptide_canonical": "BPC-157 | TB-500 | ... | other",
      "peptide_variant": "acetate | arginine_salt | nasal_spray | pre_mixed_2mg/ml | empty",
      "dose_value": 5,
      "dose_unit": "mg | mcg",
      "format": "vial | capsule | nasal | oral_liquid | topical | pre_mixed_pen | other",
      "concentration": "vendor-specified, e.g., '2mg/ml' or empty",
      "bottle_size": "vendor-specified, e.g., '5ml vial' or empty",
      "list_price_usd": 0.00,
      "sale_price_usd": null,
      "sale_observed_at": "ISO 8601 or null",
      "per_mg_price_usd": 0.0000,
      "volume_tier_label": "1-pack | 5-pack | empty",
      "bundle_membership": ["bundle_id_1", "..."],
      "crypto_discount_pct": 0,
      "subscription_price_usd": null,
      "out_of_stock": "true | false | uncertain",
      "url": "https://...",
      "raw_artifact": "03_raw_fetches/<slug>/product_<n>__<sku-slug>.md",
      "evidence_entry_id": "claim-N pointer into evidence/<slug>.txt"
    }
  ],

  // discovery
  "discovery_provenance": {
    "first_seen_pass": "integer pass number from discovery_pass_log.md",
    "discovery_source_url": "the page where this vendor name first appeared",
    "discovery_source_quote": "verbatim mention, max 200 chars"
  },

  // pointers and notes
  "raw_fetches_dir": "03_raw_fetches/<slug>/",
  "evidence_file": "evidence/<slug>.txt",
  "uncertainty_notes": "any field marked 'uncertain' with reason; any [INFERENCE] field with the reasoning summary"
}
```

## Field-completion ratio

`field_completion_ratio` is computed as:

```
non_uncertain_field_count / required_field_count_for_tier
```

Where:

- `required_field_count_for_tier` = the count of leaf fields the
  vendor's tier requires (Tier 1: all listed schema fields except
  `evidence_file`, `raw_fetches_dir`, `uncertainty_notes`,
  `discovery_provenance.*`; Tier 2: same minus optional fields the
  schema labels optional; Tier 3: the baseline subset listed in
  `research_directive.md` §2.1).
- `non_uncertain_field_count` = leaf fields whose value is **not**
  the literal string `"uncertain"`, **not** an empty string, **not**
  an empty array, and **not** an `[INFERENCE]`-derived value (per
  directive Rule 19).

The ratio gates `fetch_status` per directive Rule 17:

- ≥0.70 → `ok`
- 0.40 to 0.69 → `partial`
- <0.40 → `failed` (use baseline-only profile)

If the computed ratio and declared `fetch_status` disagree, fix the
status, not the ratio.

## Evidence file format

Spec lives in `00_inputs/research_directive.md` §6. Summary:

- One file per vendor at `02_claude_code_outputs/evidence/<slug>.txt`.
- Entries separated by blank lines.
- Each entry has: `[CLAIM] [URL] [FETCHED_AT] [FETCH_METHOD]
  [RAW_ARTIFACT] [LINE_RANGE] [QUOTE]…[/QUOTE]`.
- Multi-source claims repeat the URL/QUOTE block within the same
  CLAIM entry.
- Inferred values use `[INFERENCE]` block instead of `[QUOTE]`,
  with ≥2 `[SUPPORT_QUOTE]` sub-blocks and a `[REASONING]` block.
- Trivial fields (slug, brand, fetched_at) need no entry. Everything
  else is non-trivial.

Every `[QUOTE]` block must grep-match its `[RAW_ARTIFACT]`. Profile
self-audit (directive §5 step 14) verifies this before marking the
vendor done.

## Raw fetches directory

Spec in `00_inputs/research_directive.md` Rule 11. Summary:

- One directory per vendor at `03_raw_fetches/<slug>/`.
- One file per fetch. Naming pattern in directive §5 step 3+.
- Each file's first 5 lines are a YAML front-matter block with
  `url`, `fetched_at`, `fetch_method`, `sha256`.
- Body below the front matter is the rendered text the agent read.

## Tiering

See `00_inputs/research_directive.md` §7.4 for tier-assignment
criteria. Tier may be downgraded with written rationale in
`tier_rationale`; never silently lowered.

## Status semantics

- `fetch_status: ok` — homepage and most subpages fetched cleanly,
  field_completion_ratio ≥ 0.70, all evidence quotes grep-match.
- `fetch_status: partial` — homepage fetched but specific subpages
  failed; ratio between 0.40 and 0.69; affected fields marked
  `"uncertain"`.
- `fetch_status: failed` — homepage unreachable after 3 attempts
  (directive §8.1); profile contains baseline identity + discovery
  provenance only; failure documented in `coverage_report.md`.

## What this schema does not cover

- Customer-acquisition channel data → `PILLAR_B_SCHEMA.md`.
- Cross-vendor pricing comparison → `PILLAR_C_SCHEMA.md`
  (`pricing_matrix.csv`, `sku_distributions.md`,
  `opening_sku_recommendation.md`).
- Aggregate findings, audits, follow-ups → `coverage_report.md`,
  `executive_summary.md`, `final_audit_log.md`.

The vendor profile is the atom. Everything else aggregates from it.
