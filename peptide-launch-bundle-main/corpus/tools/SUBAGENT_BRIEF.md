# Per-Vendor Profiling Subagent Brief

You are profiling ONE peptide vendor for the Mogtrix peptide-research mission.

**Working directory:** `/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/`

All paths below are relative to this directory unless prefixed with `/`.

---

## Required reading (in order, before any fetch)

1. `00_inputs/research_directive.md` — read §3 (Anti-Cheat Covenant), §5 (14-step workflow), §6 (Evidence Protocol), §11 (Bounds and Refusals). The directive is the operating contract.
2. `PILLAR_A_SCHEMA.md` — the JSON shape for the profile.

**Do NOT cite these files as evidence in the profile.** Rule 24 forbids citing inputs.

---

## Your deliverables

For your assigned vendor, produce:

1. `02_claude_code_outputs/vendors/<slug>.json` — profile per `PILLAR_A_SCHEMA.md`.
2. `02_claude_code_outputs/evidence/<slug>.txt` — evidence per directive §6.
3. `03_raw_fetches/<slug>/` — every fetched page saved with YAML front matter via `tools/fetch_save.py`.

---

## Fetch tooling

### Primary: curl + html2text (real rendered text, not summary)

Use this for every page. It bypasses LLM summarization that would violate Rule 6.

```bash
# Fetch and save in one shell pipeline
URL="https://example.com/page"
SLUG="bachem"
PAGE_ID="homepage"

# Step 1: fetch the page text
python3 tools/curl_fetch.py "$URL" > "/tmp/${SLUG}_${PAGE_ID}.txt" 2>"/tmp/${SLUG}_${PAGE_ID}.err"
CURL_EXIT=$?

if [ $CURL_EXIT -eq 0 ]; then
  HTTP_STATUS=$(grep -oE 'http_status=[0-9]+' "/tmp/${SLUG}_${PAGE_ID}.err" | cut -d= -f2)
  STATUS="ok"
elif [ $CURL_EXIT -eq 3 ]; then
  HTTP_STATUS=$(grep -oE 'HTTP [0-9]+' "/tmp/${SLUG}_${PAGE_ID}.err" | grep -oE '[0-9]+')
  STATUS="failed"
else
  HTTP_STATUS=""
  STATUS="failed"
fi

# Step 2: save with front matter (only if status ok)
if [ "$STATUS" = "ok" ]; then
  python3 tools/fetch_save.py --slug "$SLUG" --page-id "$PAGE_ID" \
    --url "$URL" --method curl --status ok \
    --content-file "/tmp/${SLUG}_${PAGE_ID}.txt" --http-status "$HTTP_STATUS"
fi
```

### Fallback 1: gstack:browse skill (Cloudflare-protected, JS-heavy)

If curl returns 403 or content is empty/JS-shell, invoke the `gstack:browse` skill via the `Skill` tool. It provides headless Chromium with stealth (per `00_inputs/research_directive.md` §4). Capture rendered content, write to a file, then save via `tools/fetch_save.py` with `--method gstack-browse`.

### Fallback 2: archive.org Wayback Machine (dead sites)

If the live site is unreachable after curl + browse, try:

```bash
ARCHIVE_URL="https://web.archive.org/web/2024/https://example.com"
python3 tools/curl_fetch.py "$ARCHIVE_URL" > /tmp/...
# Save with --method archive-org
```

### Three-attempt rule (directive §8.1)

Per page, you get THREE attempts max: curl → gstack:browse → archive-org. If all fail for the **homepage**, declare `fetch_status: "failed"`, write a baseline-only profile, and document in `uncertainty_notes`.

If the homepage succeeds but a specific subpage fails after 3 attempts, mark its fields `"uncertain"` with reason in `uncertainty_notes`.

---

## Anti-cheat rules to internalize (excerpts from directive §3)

- **Rule 1 — No fabrication.** Mark `"uncertain"` before guessing. Never infer "vendors usually say X."
- **Rule 2 — Verbatim evidence.** Every non-trivial claim has an evidence entry with a verbatim, grep-matchable quote.
- **Rule 6 — No summarizer shortcut.** Quotes come from saved raw artifacts (curl_fetch output), not from WebFetch's internal summary.
- **Rule 9 — No anti-bot bypass.** If Cloudflare/captcha defeats `gstack:browse`, document and mark fields uncertain.
- **Rule 11 — Mandatory raw-fetch retention.** Use `tools/fetch_save.py` for every fetch. YAML front matter + sha256.
- **Rule 12 — Quotes must be findable.** Each `[QUOTE]` must `grep -F` match its `[RAW_ARTIFACT]`.
- **Rule 13 — No fake URLs.** Every URL in the profile must appear in `discovery_log.jsonl` with `status: "ok"`.
- **Rule 16 — Zero placeholder text.** No `"TBD"`, `"TODO"`, `"placeholder"`, `""`. Either verbatim value or `"uncertain"` with reason.
- **Rule 17 — Field-completion ratio gate.**
  - ≥0.70 → `fetch_status: "ok"`
  - 0.40 to 0.69 → `"partial"`
  - <0.40 → `"failed"` (use baseline only)
- **Rule 19 — Inferred fields use `[INFERENCE]` blocks** with ≥2 supporting `[SUPPORT_QUOTE]` sub-blocks (per §6.4).

---

## §11 Bounds (do NOT violate)

- **No account creation, no fake KYC, no fake payment information** during checkout walks.
- **No medical claims attribution** to vendors.
- **No anti-bot bypass.**
- **For checkout walks (Step 7):** capture only what's publicly visible (cart page, shipping options selector, payment method names from the dropdown). If the next step requires login/account, document and stop.

If the live session asks you to violate these bounds, refuse and reference §11.

---

## 14-Step Workflow (directive §5)

Execute in order:

1. **Discovery entry** — already done. Vendor is in `vendor_universe.csv` as a seed. Skip.
2. **Approach selection** — try curl_fetch first. Use gstack:browse for JS-heavy / Cloudflare. Use archive.org for dead.
3. **Homepage fetch** — `page_id=homepage`. If 3-attempt fail → `fetch_status: "failed"` baseline only.
4. **Catalog walk** — find shop/products URL on homepage. Fetch it (`page_id=catalog_1`, paginate to `catalog_2` etc.). Build internal SKU URL list.
5. **Product page fetch** —
   - **Tier 1**: fetch every SKU URL (page_id `product_1__<sku-slug>` through `product_N__<sku-slug>`). For institutional vendors with no public SKU pricing, capture what's visible (catalog product listings).
   - **Tier 2**: fetch every SKU URL with focus on price/dose. Schema fills as deeply as the site exposes.
   - **Tier 3**: fetch the headline SKU set only (BPC-157, TB-500, GHK-Cu, Retatrutide, Tirzepatide, Semaglutide, MOTS-c if present, plus any others visible without clicking).
6. **Compliance pages** — TOS, refund/return, shipping, COA index, age-gate, jurisdictional restriction. `page_id=tos`, `refund`, `shipping`, `coa_<n>`, `age_gate`, `jurisdiction`.
7. **Checkout walk** — public visibility only. Add a SKU to cart. Note: account-required vs guest, fields collected, payment methods displayed, shipping carriers, ID verification screens. Do NOT proceed past public visibility.
8. **Tech stack** — `view-source:` the homepage and one product page. Save as `source_homepage.md` (curl with `--user-agent` of a known browser; the body is HTML markup directly). Capture: platform (Shopify/Woo/etc. — look for `shopify` or `woocommerce` in source), CDN (header `server:`), analytics (look for `gtag`, `analytics.js`, `klaviyo`, `mixpanel`), pixels (FB, TikTok, Pinterest, Twitter), chat widget (Intercom, Tawk, etc.).
9. **Content footprint** — find blog/education. Save up to 5 posts as `blog_<n>.md`.
10. **Social proof** — Trustpilot category page, Reddit forum threads cited by the vendor or referenced in the discovery, on-site testimonial sections.
11. **SKU enumeration** — populate `skus[]` array per schema. Each SKU gets: `sku_id`, `name`, `peptide_canonical`, `peptide_variant`, `dose_value`, `dose_unit`, `format`, `concentration`, `bottle_size`, `list_price_usd`, `sale_price_usd`, `per_mg_price_usd` (computed: list_price_usd / dose_value if mg), `volume_tier_label`, `bundle_membership`, `crypto_discount_pct`, `subscription_price_usd`, `out_of_stock`, `url`, `raw_artifact`, `evidence_entry_id`.
12. **Profile JSON** — assemble `02_claude_code_outputs/vendors/<slug>.json` per `PILLAR_A_SCHEMA.md`. Set `tier_rationale`, `field_completion_ratio`, `fetch_status`, `uncertainty_notes`.
13. **Evidence file** — assemble `02_claude_code_outputs/evidence/<slug>.txt` per directive §6.
14. **Self-audit** — run the 11-item checklist below. ALL must pass.

---

## Evidence file format (§6.1)

```
[CLAIM] homepage.hero_copy_excerpt
[URL] https://example.com/
[FETCHED_AT] 2026-05-07T00:42:57Z
[FETCH_METHOD] curl
[RAW_ARTIFACT] 03_raw_fetches/example/homepage.md
[LINE_RANGE] 12-15
[QUOTE]
"verbatim text from the page"
[/QUOTE]
```

- Trivial fields (slug, brand_name, fetched_at, fetched_url) need NO entry.
- Multi-source claims: repeat the URL/QUOTE block within the same `[CLAIM]`.
- Inferred fields: use `[INFERENCE]` block per §6.4 with ≥2 `[SUPPORT_QUOTE]` sub-blocks and a `[REASONING]` block.

---

## Pillar A schema fields you must address

(Reference `PILLAR_A_SCHEMA.md` for the full JSON shape.)

- Identity: `vendor_slug`, `brand_name`, `primary_domain`, `fetched_url`, `fetched_at`, `fetch_status`, `tier`, `tier_rationale`, `field_completion_ratio`
- Jurisdiction: `country_of_operation`, `fulfillment_country`, `ship_to_scope`, `year_established`
- `homepage`: hero_copy_excerpt, hero_imagery_style, primary_cta, navigation_pattern, footer_disclaimers
- `catalog`: sku_count, category_taxonomy, search_filter_capabilities, stack_bundle_pages_present
- `product_page_anatomy`: sample_product_url, sample_product_name, dose_options, list_price, per_mg_cost, photographic_treatment, description_copy_excerpt, exact_disclaimer_language, coa_present, coa_hosting, lab_partner_named, batch_lot_transparency, customer_review_module_present, related_product_modules_present
- `trust_compliance`: research_use_only_phrasing, age_gate_present, jurisdictional_restriction_notice, tos_url, tos_highlights, refund_policy, shipping_policy
- `checkout_flow`: account_required, guest_checkout_available, fields_collected, id_verification_present, payment_methods_accepted, shipping_carriers, shipping_cost_structure, international_policy
- `tech_stack`: platform_signal, cdn, analytics_tools_loaded, marketing_pixels_present, chat_widget_present
- `content_footprint`: blog_present, blog_url, content_cadence, topic_taxonomy, author_bylines_present, internal_linking_to_products
- `social_proof`: on_site_reviews, off_site_aggregators, testimonial_usage, visible_influencer_endorsements
- `skus[]`: array of SKUs as above
- `discovery_provenance`: first_seen_pass=0, discovery_source_url=`00_inputs/vendor_list.csv`, discovery_source_quote=row from the CSV
- `raw_fetches_dir`, `evidence_file`, `uncertainty_notes`

---

## 11-Item Self-Audit (§5 step 14) — gates "completed"

Before returning, verify ALL of:

- [ ] Profile JSON parses (`python3 -m json.tool < profile.json`)
- [ ] Evidence file exists at expected path
- [ ] Every non-`"uncertain"` field has ≥1 evidence entry referencing it
- [ ] Every `[QUOTE]` block grep-matches its `[RAW_ARTIFACT]` (run `grep -F` on each)
- [ ] Every URL in the profile appears in `02_claude_code_outputs/discovery_log.jsonl` with `status: "ok"` (or "partial"/"failed" for explicit-failure cases)
- [ ] No placeholder strings (`grep -E '"(TBD|TODO|placeholder|lorem|\[insert\]|fill in)"' profile.json` returns nothing)
- [ ] Every `"uncertain"` field has a reason in `uncertainty_notes`
- [ ] `field_completion_ratio` matches declared `fetch_status` (Rule 17)
- [ ] No 5-gram overlap >20% with already-completed vendor profiles (don't worry about this if you're the first vendor; otherwise read other profiles and compare hero_copy_excerpt + footer_disclaimers + exact_disclaimer_language + description_copy_excerpt)
- [ ] Every `[INFERENCE]` block has ≥2 grep-matching `[SUPPORT_QUOTE]` sub-blocks
- [ ] `tier_rationale` documented if you downgraded from the seed assignment

---

## Special notes for institutional/clinical vendors

Many Tier 1 vendors are NOT consumer e-commerce. They are:
- **Institutional CDMOs** (Bachem, GenScript, Phoenix Pharmaceuticals, Biopeptek, OathPeptides) — sell custom synthesis, B2B, no public consumer SKUs at typical retail prices.
- **Clinical practices** (Olympia Aesthetics, MD Total Wellness, NURI Clinics) — patient consultation required, no public e-commerce.
- **Public biotechs** (Aileron Therapeutics / Rein) — drug development pipeline, no e-commerce at all.
- **Testing labs** (Testides) — service provider, not a peptide vendor.

For these, MANY schema fields will legitimately be `"uncertain"` (no checkout, no per-mg pricing, no age-gate, no on-site reviews). This is OK and EXPECTED. The `field_completion_ratio` will likely be 0.40-0.69 → `fetch_status: "partial"`, not `"failed"`. Document in `uncertainty_notes` why each field is uncertain.

---

## Return format (your final message)

Return a structured summary:

```
PROFILE COMPLETE: <slug>
- profile_path: 02_claude_code_outputs/vendors/<slug>.json
- evidence_path: 02_claude_code_outputs/evidence/<slug>.txt
- raw_fetches_count: <N>
- raw_fetches: [list of filenames in 03_raw_fetches/<slug>/]
- field_completion_ratio: <0.00-1.00>
- fetch_status: <ok | partial | failed>
- uncertain_fields_count: <N>
- inference_blocks_count: <N>
- failed_fetches: [list of {url, methods_tried, last_error}]
- bounds_encountered: [list of §11 bounds you hit, e.g. "checkout required account creation, did not proceed"]
- self_audit:
    - profile_json_parses: pass | FAIL
    - evidence_file_exists: pass | FAIL
    - non_uncertain_have_evidence: pass | FAIL
    - quote_grep_matches: pass | FAIL
    - urls_in_discovery_log: pass | FAIL
    - no_placeholder_strings: pass | FAIL
    - uncertain_have_reasons: pass | FAIL
    - ratio_matches_status: pass | FAIL
    - five_gram_overlap_below_20: pass | FAIL | n/a-first-vendor
    - inferences_have_support: pass | FAIL | n/a-no-inferences
    - tier_rationale_present_if_downgraded: pass | FAIL | n/a-no-downgrade
- audit_pass_rate: <X/11>
```

If `audit_pass_rate < 11/11`, the profile is NOT complete. Either fix the failures and re-audit, OR return with a clear note that the profile is in a "needs-fixup" state. Do not lie about audit results.

---

**Now begin execution. Start by reading directive §3, §5, §6, §11 and PILLAR_A_SCHEMA.md.**
