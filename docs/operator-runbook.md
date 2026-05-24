# VialChem Labs — Operator Runbook (Day-1 through Months 2-3)

Date generated: 2026-05-08 (v1) — updated 2026-05-10 (v2 / Phase 13.3 v4) — refreshed 2026-05-20 (v3 / Phase 6 v5)
Brand: VialChem Labs (Posture A clean clinical LIGHT variant, vialchemlabs.net)
Source: SUPER_PROMPT_v5 + Appendix I + research digest sub_3_acquisition.md + `docs/DECISIONS/locked_override_2026-05-20.md`

- v4 deferral closures (Phases 0-12)
- v5 production-grade closure (catalog + payments + brand + Iron Law 2.8 amendment)

---

## v5 status snapshot (2026-05-20)

v5.0.0 production-grade closure is complete; the codebase has landed
the audit-driven posture (catalog cleanup, multi-rail payments
hardening, brand reconciliation, CI infrastructure). The remaining
items are the three irreducible Human-In-The-Loop (HIL) gates:

1. **HIL GATE 1** — operator drops production credentials into Vercel env
2. **HIL GATE 2** — operator runs first-buyer test (full-price order +
   operator-immediate-refund across BTCPay + Plaid rails)
3. **HIL GATE 3** — operator triggers ad campaign launch (autonomous-mode
   protocol cannot spend operator's ad budget)

```
v5 status (2026-05-20):
  Live deployment:    https://vialchemlabs.net/ (Vercel IAD1, age-gate active)
  Brand:              VialChem Labs (Posture A LIGHT, vialchemlabs.net)
  Catalog:            39 SKUs SAFE + 5 bundles (renamed to research register)
  Payment rails:      stub | btcpay | plaid | zelle  (direct)
                      link_money | card | apple_pay | google_pay | paypal  (indirect via Woo handoff)
  Jurisdictional:     all 50 US states (Iron Law 2.8 amended via LOCKED_OVERRIDE — see below)
  Unit tests:         1061/1061 GREEN
  Preflight gates:    11/11 GREEN (typecheck + lint + format + tests + build + audit + grep + canonical-domain + dns)
  Git tag (local):    pending v5.0.0 (push deferred to gstack:land-and-deploy)
```

### Iron Law 2.8 amendment note

Operator weakened `BLOCKED_US_STATES` from `['CA','TX','NY','FL']` to
`[]` (all 50 states allowed; international remains US-only). This is
codified as an amendment in
[`docs/DECISIONS/locked_override_2026-05-20.md`](DECISIONS/locked_override_2026-05-20.md)
§ "Jurisdictional block (AMENDED per supplemental S20)". Day-1
buyer-attests assume regulatory responsibility per the existing
7-attestation Appendix A.5. Operator may re-add per-state blocks via
a separate `docs/DECISIONS/iron_law_2_8_block_<date>.md` document.

### Historical lineage

```
v4 phases shipped: 0 1 2 3 4 5 6 7 8 9 10 11 12   (12/12 + Phase 13 docs)
deferrals closed:  D1 D2 D3 D4 D5 D6 D7 D8 D9 D10 D11 D12 D13
                   D14 D15 D16 D17 D24 D25 D26 D27          (21/27)
deferrals operator: D18 D19 D20 D21 D22 D23                  (6/27)
unit tests:        304 → 457 (v4) → 1061 (v5)
e2e tests:           0 → 136 (incl. 114 visual baseline)
released versions: v1.0.0 → v1.1.0 → v1.2.0 → v1.3.0 → v5.0.0 (pending PR merge)
```

Detailed phase ledgers: `docs/checkpoints/v4_phase_*.md` (v4) + `docs/checkpoints/v5_phase_*.md` (v5).

## Pre-Launch Checklist (Operator Action Required)

Items marked ✅ are already shipped against placeholders in the
codebase — operator just needs to drop the credentials. Complete in
order:

1. ✅ **Domain registration**: register `vialchemlabs.net` (LOCKED primary
   per `docs/DECISIONS/locked_override_2026-05-20.md` row 5). Per-registrar
   guide at `docs/deploy/dns.md`. Cloudflare > Gandi > 101domain >
   Namecheap. Optional fallback TLDs if primary becomes unavailable:
   `vialchemlabs.bio`, `vialchemlabs.co`. **(D19)**
2. **USPTO TESS trademark search** for "VialChem Labs" and `vialchemlabs`.
   Flag conflicts.
3. ✅ **LLC formation**: file Wyoming (default), Delaware, or Nevada LLC.
   Update `LLC_NAME` and `LLC_JURISDICTION` env. Replace `[Wyoming]`
   placeholder in legal pages. **(D20)**
4. **Source supplier conversation**: confirm MOQ, lead time, COA passthrough, contingency, per-mg cost. Update `DECISIONS/source_terms.md` (operator-side).
5. **Real lab partner contract**: contract with an independent third-party
   analytical laboratory and sign a per-batch testing agreement. Public
   copy uses the lab-agnostic phrase `an independent third-party laboratory`
   per v1.3 operator override (see LOCKED_OVERRIDE row 3). To surface a
   named partner publicly, set the env vars `LAB_PARTNER_NAME` +
   `LAB_PARTNER_PORTAL_URL` — no code change required.
6. **Replace stub credentials**:
   - Supabase project (URL + anon + service-role keys)
   - Resend API key + verified sender domain
   - Sentry project (DSN + auth token + org + project)
   - Plaid client ID + secret
   - BTCPay Server self-hosted URL + API key + store ID + webhook secret
7. **Apply Supabase migrations (BEFORE v5 launch)**: two migrations exist
   under `supabase/migrations/`. Apply in filename order:
   1. `20260510000001_init.sql` — initial schema (15 tables, RLS policies,
      seed data). Closes deferrals D2 / D3 / D4 / D5 / D6 / D7.
   2. `20260520000001_append_only_triggers_and_indexes.sql` — Phase 7
      closure (Iron Law 2.33 append-only triggers on `attestations_audit`,
      `audit_log`, `order_status_history`; Iron Law 2.36 datetime + FK
      indexes; RLS policy clarification comments; lab_partners
      Janoshik seed flipped to `default_for_brand=false` for lab-agnostic
      posture per Iron Law 2.26). Closes audit findings H15, H16, H23,
      H24, M11, M12.

   Apply via Supabase CLI (`supabase db push`) or the SQL editor in the
   Supabase Dashboard. Verify post-apply:

   ```
   -- Confirm triggers exist (expect 3 rows):
   select tgname, tgrelid::regclass
   from pg_trigger
   where tgname like 'no_mutate_%' and not tgisinternal;

   -- Confirm function exists (expect 1 row):
   select proname from pg_proc where proname = 'reject_audit_mutation';

   -- Confirm lab_partners is now lab-agnostic (expect default_for_brand=f):
   select slug, default_for_brand from lab_partners where slug = 'janoshik';

   -- Confirm indexes (expect 6+ rows for idx_*):
   select indexname from pg_indexes
   where indexname in (
     'idx_orders_placed_at',
     'idx_email_subscriptions_unsubscribed_at',
     'idx_audit_log_recorded_at',
     'idx_order_status_history_changed_at',
     'idx_attestations_audit_qualification_id',
     'idx_attestations_audit_recorded_at'
   );

   -- Confirm append-only enforcement (this should RAISE Iron Law 2.33):
   -- DO NOT RUN ON PRODUCTION DATA — staging only.
   -- update audit_log set details = '{}'::jsonb where id = (select min(id) from audit_log);
   ```

   For a stage-environment smoke test, you can also use `\d+ audit_log`
   and `\d+ attestations_audit` from `psql` to confirm the
   `no_mutate_*` triggers are bound.

8. **Replace placeholder COA PDFs**: `public/coa/<slug>-BATCH-2026-PLACEHOLDER.pdf` are stubs marked "EXAMPLE COA — REPLACE BEFORE LAUNCH". Generate real per-batch COAs from the chosen analytical laboratory for first inventory.
9. **Vercel project link**: `vercel link` in the project directory; environment variables set per `.env.example`.
10. **Domain DNS**: point `vialchemlabs.net` (or fallback) to Vercel.
11. **Buyer-conversation assignment** (Bible §16): 60-minute test with 3 prospective buyers in target audience. Optional but recommended.

## Day-1 Acquisition Workstreams

These start the moment the site goes live. Execute in parallel.

### 1. Google Organic SEO (3-6 month traction horizon)

**What**: long-form research-context PDPs and blog posts that rank for compound names.

**Day-1 baseline**: 5 blog posts already shipped (BPC-157 mechanism, COA reading guide, GHK-Cu overview, TB-500 mechanism, Recovery Stack synergy). Each at 1500-2400 words with 6 PubMed citations.

**Operator extension**:

- Submit `https://vialchemlabs.net/sitemap.xml` to Google Search Console.
- Add 30-50 PDPs over 90 days (1500-2400 words each, 10+ scientific citations).
- Internal linking discipline: every blog post links ≥2 PDPs; every PDP links ≥3 related products.
- Schema markup: Product on PDPs, Article on blog posts, FAQPage on /faq, BreadcrumbList on catalog. (Currently rendered server-side via Next metadata; verify with Google Rich Results Test.)

**Time-to-traction**: 3-6 months for compound-name terms. Earliest signal: Search Console impressions on long-tail queries within 2-3 weeks.

### 2. Email capture + 4-email welcome sequence

**What**: footer + dedicated `/newsletter` form. Lead magnet: Reconstitution and Storage Guide PDF (5 pages, neutral research content).

**Day-1 baseline**: form wired in `/api/newsletter/subscribe` (currently stubs; Phase 10 wires Resend send). 4-email sequence drafted in `lib/content/email-templates.ts`:

- Email 1 (signup): lead-magnet delivery
- Email 2 (day +3): reading-a-COA explainer
- Email 3 (day +7): BPC-157 research applications
- Email 4 (day +14): WELCOME15 15% off first-order discount code

**Operator extension**:

- Generate the actual lead-magnet PDF (5 pages, brand-consistent).
- Configure Resend with verified sender domain (`research@vialchemlabs.net`).
- Set up DMARC `p=reject` policy for the sending domain.
- Optional: dedicated Mailgun IP at $59/month for deliverability if list grows past 500.

**Time-to-traction**: signups start same day site goes live with traffic. WELCOME15 conversions Day 14+.

### 3. Affiliate listicle setup (Outliyr / Muscle+Brawn / PepPal / Brainflow)

**What**: outreach to affiliate listicle ecosystem that ranks for "best peptide vendor" queries.

**Outreach script template**:

> Subject: New peptide research supplier — per-batch independent COA
>
> Hi [name],
>
> I run [Outliyr / Muscle+Brawn / PepPal / Brainflow]'s peptide vendor coverage. We launched VialChem Labs this month at vialchemlabs.net with research peptides and per-batch independent third-party COA testing.
>
> Three things I'd flag for any vendor review:
>
> 1. Every batch is HPLC-tested by an independent third-party laboratory; PDFs are public at vialchemlabs.net/coa.
> 2. Catalog is intentionally small (BPC-157, TB-500, GHK-Cu, Ipamorelin, CJC-1295 no DAC, MOTS-c, Selank). No GLP-1s.
> 3. Compliance posture: research-use-only, age 21+ contractual checkbox, no shipping to CA/TX/NY/FL Day 1.
>
> Affiliate program: 10% / 15% / 20% commission tiers (90-day cookie) at vialchemlabs.net/affiliate.
>
> Happy to send a sample for review or answer any questions.
>
> Thanks,
> [Operator name]
> vialchemlabs

**Send to**: Outliyr, Muscle+Brawn, PepPal, Brainflow, plus 5-10 niche peptide listicle sites discovered via Google "best peptide vendor 2026" searches.

**Time-to-traction**: 2-6 weeks for inclusion; 4-12 weeks for ranking-driven traffic.

### 4. Tier S clinical-credentialed creator outreach (THE Day-1 wedge)

**What**: 5-10 micro-creators with clinical credentials (RN, PA-C, MD, DC) at 5K-30K follower tier on Instagram, TikTok, YouTube. **This is the highest-leverage Day-1 channel for Posture A.**

Source: research digest `docs/research/sub_3_acquisition.md` Tier S band.

**Compensation structure**:

- Per-post fee: $300-$1,000 (depending on follower count + engagement)
- Affiliate commission: 20% with 90-day cookie (matches top-of-market; undercuts the 10% floor)
- Discount code: per-creator unique code (placeholder pattern: `CREATOR_NAME15`)

**Outreach template**:

> Hi [creator handle],
>
> I'm [Operator] from VialChem Labs. We supply research peptides for in-vitro and animal-model studies with per-batch independent third-party COAs.
>
> I noticed your work on [topic — recovery research, sleep research, longevity research]. Would you be open to a paid post + affiliate program?
>
> - $500 flat fee for one IG post / Reel / TikTok
> - 20% commission on sales via your code, 90-day cookie
> - Per-creator unique discount code (your audience saves 15%)
> - Full creative latitude with one constraint: research-use-only framing (no human-use claims, no dosing protocols on-platform). FTC #ad disclosure required.
>
> Catalog: vialchemlabs.net/shop
> Affiliate detail: vialchemlabs.net/affiliate
>
> Reply if interested and I'll send a sample for your protocol research.
>
> Thanks,
> [Operator]

**FTC compliance**: `#ad` disclosure must appear in caption AND first 3 seconds of video. Operator monitors creator posts for compliance; non-compliant posts terminate the affiliate relationship.

**Time-to-traction**: first paid order from a stranger via creator code expected weeks 2-4 if 5+ creators land.

### 5. Defensive social handle registration

**What**: register `@vialchemlabs`, `@vialchemlabs`, `@vialchemlabs.net` (where allowed) on Instagram, TikTok, X — but **do NOT actively post** Day 1.

**Why**: prevents squatters; keeps platform-policy surface minimal. Posture A doesn't compete on social-native creative; the active social presence is via Tier S creator partnerships, not first-party posting.

**Optional**: founder-personal X account (per Peptide Sciences template — research-citation hashtag-thread cadence, ~95 followers/month organic). Brand X account stays as a stub.

### 6. Founder-personal X cadence (Posture A signature)

**What**: weekly thread cadence from founder X account citing recent peptide research papers (PubMed-linked). Brand-neutral attribution.

**Cadence**: 1 thread per week. Pattern: "New paper: [study title] — [3-4 sentence summary]. [Link]. #peptide #research."

**Why**: builds technical brand reputation in the community; signals expertise; drives indirect search traffic to vialchemlabs.net.

---

## Weeks 2-4 Channels

### 7. Mid-tier biohacking podcast host-reads ($1.5K-$4.5K/insertion)

Targets: shows in fitness/biohacking/longevity vertical with 5K-50K listeners. Outreach script focused on per-batch COA differentiator.

### 8. Bing Webmaster Tools + sitemap

Submit sitemap to Bing Webmaster Tools. Bing/DDG account for ~10% of search but enforce category bans less strictly than Google.

### 9. Newsletter signups → WELCOME15 conversions

Email 4 of welcome sequence sends 15% off code. Track redemptions in Supabase `email_subscriptions` linked to `orders.promo_code`.

---

## Months 2-3 Channels

### 10. SEO traction landing

3-6 months to rank for compound-name terms. Track Search Console weekly. Expected: 50-200 organic visits/day by Month 3 if content cadence holds (1+ blog post per week).

### 11. Catalog expansion: KPV (Day-30 candidate)

Per `docs/research/sub_2_pricing.md` ranking, KPV is the #1 expansion candidate (clean enforcement record + structural recovery-stack pairing + sweet-spot $5/mg median).

To add KPV:

1. Confirm source supply + COA passthrough
2. Add KPV row to `lib/content/products.ts`
3. Add verbatim Appendix-style description (336-345 words, research register)
4. Generate placeholder COA → replace with real third-party-laboratory COA on first batch
5. Deploy

Catalog data structure already supports this without schema changes.

---

## Permanent Avoid List

These channels are not viable Day-1 for Posture A. Each closed by either platform policy, regulatory exposure, or audience mismatch:

- **Google Ads / Microsoft Ads**: Pharmaceutical Manufacturers sub-policy + crawler-level enforcement. Verdict from research: AVOID.
- **SMS marketing**: CTIA §3.5.1 + 10DLC TCR brand-vetting + TCPA $500-$1,500-per-message exposure. Verdict: AVOID.
- **Vendor-owned YouTube growth**: channel termination ceiling for peptide content. Verdict: DEFER (limited use only via creator partnerships).
- **Active vendor IG/TikTok brand presence**: Posture A doesn't compete on social-native creative. Verdict: DEFENSIVE REGISTRATION ONLY.
- **Trustpilot review counts**: unverifiable for most vendors per research; no Day-1 reviews.
- **Reddit incentive offers**: "25% off for honest review" pattern is policy violation (Limitless Life precedent). Forbidden.
- **Posture B meme-creator partnerships**: brand mismatch; defer to operator decision post-validation.

---

## Slice 3 PLACEHOLDER (community channels — primary buyer habitat is dark)

The community-channel acquisition surface (Reddit, Meso-Rx, anabolic forums, Telegram, Discord) was NOT mapped from primary data in the research corpus. This is the dominant Pillar B gap (40% complete vs. 95%+ for other pillars).

**To close this gap post-launch**:

1. Fire the B1 prompt at ChatGPT Pro Deep Research. The prompt is at `/mnt/c/Users/endeg/Downloads/slice_B1_reddit_and_forum_ecosystem_map.md`. Cost: 1 of ~125 monthly Deep Research runs. Wall-clock: 20-45 minutes.
2. Save output to `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/slice_B1_reddit_and_forum_ecosystem.md`.
3. Re-run this runbook generation; Slice 3 sections regenerate from the populated B1 output.

**Until B1 fires, the following community channels are PLACEHOLDER**:

- **Reddit subreddit map + engagement strategy** — PLACEHOLDER
  - Expected coverage: r/Peptides, r/PeptideTalk, r/Steroids, r/Sarms, r/Nootropics, r/MoreNutrition, r/MorePlatesMoreDates, r/SARMSourceTalk, looksmaxxing subs, biohacking subs
  - Buyer behavior: source-review threads, pinned source lists, vendor-history weighting
  - Engagement playbook: forum lurker phase 0-30 days, organic-only contribution, no incentive offers, response to cold mentions only

- **Specialized forums** — PLACEHOLDER
  - Expected coverage: Meso-Rx, Anabolic Steroid Forums, Anabolic Minds, Evolutionary, ThinkSteroids, EliteFitness, MuscleGurus, Peptide Underground
  - Engagement playbook: founder-personal account on highest-engagement forum, weekly research-citation contribution

- **Telegram channels with flash-sale mechanics** — PLACEHOLDER
  - Expected coverage: niche peptide aggregator channels with 5K-50K subscribers
  - Engagement playbook: deferred until first B1 output identifies channel-specific norms

- **Discord servers** — PLACEHOLDER
  - Expected coverage: looksmaxxing-adjacent + biohacking servers
  - Engagement playbook: deferred until B1

- **Niche aggregator review sites** — PLACEHOLDER beyond Day-1 listicle outreach (Outliyr, Muscle+Brawn, PepPal, Brainflow are covered)

---

## Success Metrics (Bible §15 Go/No-Go Thresholds)

Evaluation window: 21-30 days from ads going live (Tier S creator codes count as ads).

**Strong go** (commit to bigger plan):

- ≥30 paid orders from strangers
- Repeat-buyer rate ≥15%
- Blended CAC <50% of gross margin per order
- ≥3 organic forum mentions

**Weak go** (continue, restructure):

- 5-29 paid orders from strangers
- Any positive signal in any channel
- Blended CAC <100% of gross margin per order

**Pivot** (brand or channel mix wrong):

- 0 paid orders + meaningful traffic/engagement signal
- Try other posture OR other channel mix

**No-go** (stop):

- 0 paid orders + no traffic/engagement signal
- Salvage LLC, return capital, regroup

Track via:

- Vercel Analytics (page views, conversion funnel)
- Sentry (error rate, payment-flow failures)
- Supabase `orders` table (paid orders, repeat buyers, CAC math)
- Search Console (impressions, clicks, position)
- Per-creator code redemption (manual reconciliation Day-1; Phase 2 dashboard)

---

## Post-Launch First Week Operator Checklist

Day 1 (launch day):

- [ ] Smoke-test full purchase flow (browse → add → cart → checkout → place order). Confirm order email lands.
- [ ] Verify `/api/health` returns 200.
- [ ] Verify Sentry receives a manual test error.
- [ ] Submit sitemap to Google Search Console + Bing Webmaster Tools.
- [ ] Defensive social handle registration on IG/TikTok/X.

Day 2-3:

- [ ] Send Tier S creator outreach emails (target: 10 emails on Day 2, 10 on Day 3).
- [ ] Send affiliate listicle outreach emails (Outliyr, Muscle+Brawn, PepPal, Brainflow + 5 long-tail).
- [ ] Founder-personal X account: post first weekly research-citation thread.
- [ ] Verify newsletter signup → email 1 delivers (manual smoke test with operator email).

Day 4-7:

- [ ] Respond to inbound creator/affiliate replies within 24h.
- [ ] First batch of order processing (if any). Test the fulfillment loop end-to-end.
- [ ] Monitor Sentry for any production errors. Fix or page operator.
- [ ] Search Console: check for first impressions on long-tail terms.

Week 2 retro:

- [ ] How many orders? From strangers vs. network?
- [ ] CAC math: cost per order across channels?
- [ ] What surprised? What broke?
- [ ] Pre-mortem: which channel is producing zero signal? What does that mean?

---

## Operator Support Resources

- **Research corpus**: `/root/peptide-launch-bundle/corpus/` (read-only; AUDIT, MANIFEST, NAVIGATION_GUIDE, DECISIONS, sub_1-6 distillations)
- **Compliance reference**: `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/compliance_disclaimers/` (FDA enforcement timeline, marketing language patterns)
- **Pricing matrix**: `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/pricing_matrix.csv` (3,388 SKUs across 169 vendors)
- **Build artifacts**: `/root/peptide-site/docs/checkpoints/` (per-phase checkpoint logs)
- **Slice 3 firing prompt**: `/mnt/c/Users/endeg/Downloads/slice_B1_reddit_and_forum_ecosystem_map.md`

---

## Soft-launch operator playbooks (Phase 11)

Added per `SUPER_PROMPT_softlaunch_2026-05-22.md` §6 items F1, L1, L2, L3.

### F1 — Fulfillment SOP

Trigger: operator-notification email arrives subject `[VC] Order <display_id> PAID — ...`.

1. Open `/operator/orders` and locate the order by display_id.
2. Verify line items + shipping address match the order detail.
3. Print a USPS shipping label via the USPS Click-N-Ship UI (or the carrier the operator prefers for the SKU's weight class).
4. Pack:
   - Use a tamper-evident inner pouch.
   - Add a cold-pack for heat-sensitive SKUs (peptides >= -20°C stable in transit for 72h; cold-pack required if >72h transit predicted).
   - Include the printed pick-list (order detail PDF from the dashboard).
   - Seal outer box with branded tape.
5. Drop at the carrier or schedule pickup.
6. Enter tracking number + carrier in the operator dashboard order detail and click **Mark shipped**. This fires the F2 shipped email to the customer with the tracking URL.
7. File the printed pick-list in the physical order binder for audit.

SLA: paid -> shipped within 2 business days for soft launch.

### L1 — Refund SOP per rail

**BTCPay (Bitcoin Lightning + onchain):**

1. BTCPay store dashboard -> Invoices -> find the invoice by `display_id`.
2. Click **Refund** -> select line items + payment method (same the customer used).
3. Confirm BTC returned. Lightning via LNURL; onchain needs customer BTC address (request via email if missing).
4. In `/operator/orders/<id>`, click **Refund**. Fires refund-confirmation email.

**Zelle:**

1. Bank Zelle UI -> Send -> customer's Zelle handle from the order receipt -> refund amount + memo `REFUND-<display_id>`.
2. Wait for Zelle confirmation.
3. In `/operator/orders/<id>`, click **Refund** + paste confirmation ref into operator_notes.

**Bitcoin direct (on-chain fallback):**

1. Customer replies to support@vialchemlabs.net with refund-to BTC address.
2. Operator sends BTC manually via their wallet.
3. In `/operator/orders/<id>`, paste txid into operator_notes + click **Refund**.

**Plaid (ACH):** hidden from UI per G2 decision until operator provisions Plaid credentials.

### L2 — Emergency rollback playbook

**Vercel deploy rollback (<=2 minutes):**

```bash
gh run list --workflow=ci --branch=main --limit 5
# Note the deploy SHA of the last KNOWN-GOOD deploy.

vercel rollback <previous-deployment-url> --yes
# or via dashboard: vercel.com -> deployments -> ... -> Promote to Production

curl -s https://vialchemlabs.net/api/health  # expect: gitSha matches rollback
```

**Git revert (when the prod bug is committed to main):**

```bash
git fetch origin main && git checkout main
git revert <bad-sha>
git push origin main
```

**Supabase point-in-time restore:**

1. Supabase dashboard -> Database -> Backups.
2. Pick timestamp BEFORE the bad write (free-tier retention ~7d).
3. Restore to a NEW database first; inspect; then repoint Vercel `NEXT_PUBLIC_SUPABASE_URL`.
4. Backfill orders between the restore timestamp and rollback by replaying reconciliation events from Sentry / Resend logs.

**Customer comms template:**

> Subject: VialChem Labs system maintenance
>
> Hi {{name}}, we briefly took the site offline at HH:MM to recover from a configuration error. No payment data or customer accounts were exposed. Your order #{{display_id}} is {{status}}. Reach support@vialchemlabs.net with any questions.

### L3 — Where-to-look dashboard

| Signal                        | Where                                            |
| ----------------------------- | ------------------------------------------------ |
| New orders                    | `/operator/orders`                               |
| Order detail + status updates | `/operator/orders/<id>`                          |
| Customer signups + auth       | dashboard.supabase.com -> Auth -> Users          |
| Page traffic + funnel         | plausible.io -> vialchemlabs.net                 |
| Server errors + perf          | sentry.io -> VialChem Labs                       |
| Email deliverability          | resend.com -> vialchemlabs.net                   |
| BTC payments                  | BTCPay store URL                                 |
| Zelle deposits                | Operator's bank Zelle                            |
| Server logs                   | vercel.com -> vialchems-labs -> Logs             |
| Rate-limit hits               | upstash.com -> vialchemlabs-ratelimit            |
| Health probe                  | `curl https://vialchemlabs.net/api/health`       |
| Deploy-ready probe            | `curl https://vialchemlabs.net/api/health/ready` |

Quick triage rules:

- 500 errors -> Sentry first, then Vercel logs.
- "I never got the email" -> Resend dashboard, search by recipient.
- "My payment didn't go through" -> BTCPay (BTC) or bank (Zelle), then `/operator/orders/<id>`.
- "I can't log in" -> Supabase Auth -> Users, then ask customer to re-request magic link.

### H4 — Operator in-flight PR #4 status

Operator opened PR #4 (`v5.1-rate-limit-closure`) on 2026-05-22. The PR bundles:

- Iron Law 2.34 closure: Upstash adapter swap, `SKIP_RATE_LIMIT` bypass, Sentry breadcrumbs, per-email gates wired at `/api/access` + `/api/newsletter/subscribe`, LRU cap on the in-memory store, response key rename `retryAfter` → `retryAfterSeconds`.
- Hero copy refresh experiment ("The Certificate of Analysis is the product. The vial is the packaging.") on `components/v2/Home.tsx`.

Status as of 2026-05-23:

- State: OPEN, `mergeable: CONFLICTING` against current `main` (M0a-h + the soft-launch infra PRs have advanced main significantly).
- CI: RED across Unit+preflight, e2e+visual-regression, Lighthouse mobile + desktop.
- Recommendation: rebase the rate-limit half onto current main as a fresh PR (the Iron Law 2.34 closure covers I3 substantively); close or revert the hero-copy half (already superseded by the M0c hero work that landed in PR #13).

**This soft-launch session intentionally did NOT push to or rebase PR #4** (per super-prompt §7 "NEVER push to or rebase a PR you didn't create"). The operator decides whether to:

1. Rebase + split the PR themselves.
2. Close PR #4 and re-author the rate-limit + per-email gate work as a new PR (the underlying changes to `lib/rate-limit.ts` + `app/api/*` are reusable).
3. Defer the I3 Upstash wiring until post-soft-launch and accept the in-memory rate-limiter for the first 1-5K-impression ad campaign (the LRU cap from PR #4 is already implemented at the code level, just not committed to `main`).

### M2 — Load test (super-prompt M2)

A simple fetch-loop driver lives at `scripts/load-test.mjs`. Default
scenario: 100 virtual users for 5 minutes against `/`, `/shop`, and a
handful of PDPs. Verifies P95 latency under 3 seconds, success rate
above 99.5%, and zero 5xx responses.

**Run locally against the dev server** (safest):

```
npm run dev &
sleep 30
BASE_URL=http://127.0.0.1:3200 VU=20 DURATION_S=60 node scripts/load-test.mjs
```

**Against a Vercel preview** (medium risk):

```
BASE_URL=https://vialchemlabs-pr-xxx.vercel.app VU=50 DURATION_S=180 \
  node scripts/load-test.mjs
```

**Against production** (DO NOT run without operator coordination):

```
# Will trigger Vercel rate limits + Sentry alerts. Coordinate first.
BASE_URL=https://vialchemlabs.net VU=100 DURATION_S=300 \
  node scripts/load-test.mjs
```

Output JSON lands under `.gstack/load-tests/<ts>.json`. Exit code 0 if
all three verdict gates pass (P95 + success rate + zero 5xx), 1 if any
gate fails, 2 on fatal driver error.

### M3 — Backup + disaster-recovery plan

**What lives where:**

| Layer                | Backed up by                        | RPO                    | RTO             |
| -------------------- | ----------------------------------- | ---------------------- | --------------- |
| Postgres data        | Supabase automatic backups          | ~24h (free) / 2h (pro) | ~1–2h restore   |
| Application code     | GitHub `origin/main`                | n/a (source of truth)  | <5 min revert   |
| Vercel deployments   | Vercel automatic deployment history | n/a                    | <2 min rollback |
| Customer files / COA | `public/coa/` checked into the repo | n/a                    | <5 min revert   |
| Sentry events        | Sentry 30-day retention             | n/a                    | n/a             |
| Resend events        | Resend 30-day retention             | n/a                    | n/a             |

**Recovery procedures:**

1. **Bad deploy / regression** — fastest is Vercel rollback. From the
   Vercel dashboard: Project → Deployments → pick the prior good
   deploy → "Promote to Production". Verifies in under 2 minutes.

2. **Bad code on main** — `git revert <bad-sha>` and push. Vercel
   redeploys automatically. Use this when the rollback target is more
   than 2–3 deploys back and a clean forward fix is preferable.

3. **Database corruption / accidental destructive query** — Supabase
   point-in-time restore:
   - Dashboard: Project → Database → Backups → "Point in time"
   - Pick the timestamp just before the bad event
   - Confirm restore. Connection string stays the same; expect 1–2h
     downtime depending on database size.
   - Note: the free tier only retains the last daily backup; the pro
     tier retains 7 days at the moment of writing.

4. **Lost a user's data** (cookie wipe, customer wants their order
   re-emailed) — the order itself is in `orders` + `order_items`;
   re-send the confirmation manually via Resend dashboard "Send"
   from a saved template, or trigger via a small server action.

5. **Sentry / Resend outage** — both vendors have status pages.
   Reconciliation and order placement still succeed; only the
   observability tail is degraded. No customer-side action needed.

**RPO/RTO targets for soft launch:**

- RPO (data loss tolerance): 24 hours on the free tier, 2 hours after
  the Supabase pro upgrade. Order placement itself is durably
  recorded in Supabase at request time, so the realistic data-loss
  window is only the gap between Supabase backups, not the full 24h.
- RTO (recovery time): under 2 hours for any single failure mode
  above. The longest path is a full Postgres restore; everything
  else is sub-5-minute.

**Off-platform redundancy:**

- Source code: GitHub origin/main is the canonical backup. Any
  clone reproduces the site if Vercel disappears.
- COA PDFs: checked into the repo under `public/coa/`. Re-deployable
  anywhere.
- Customer/order data: only in Supabase. If Supabase disappears, the
  audit_log + Resend dashboard + BTCPay/bank records are the
  forensic recovery path; this is acceptable for soft-launch volume
  but should be revisited before scaling to >100 orders/day.

### D2 — Sentry verification probe

Once `NEXT_PUBLIC_SENTRY_DSN` (plus `SENTRY_ORG`, `SENTRY_PROJECT`,
`SENTRY_AUTH_TOKEN`) are set in Vercel and a redeploy lands, fire the
synthetic probe:

```
curl -i 'https://vialchemlabs.net/api/test-error?token=vc-sentry-probe'
```

Expected:

- HTTP `500` response with body `{ ok: false, code: "sentry_probe_fired", ... }`
- A `SentryProbeError` event in the Sentry dashboard within ~1 minute,
  tagged `route=test-error`, `probe=sentry`
- The captured event payload should have NO PII (no headers, no body,
  no email, no IP) — confirms Iron Law 2.32 `beforeSend` scrubber

If the response is `403`, the token is wrong. If `200`, the route isn't
deployed yet. If the response is `500` but Sentry stays empty after 5
minutes, check the DSN value in Vercel and re-deploy.
