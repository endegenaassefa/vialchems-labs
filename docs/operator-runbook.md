# vialchemlabs — Operator Runbook (Day-1 through Months 2-3)

Date generated: 2026-05-08 (v1) — updated 2026-05-10 (v2 / Phase 13.3 v4)
Brand: vialchemlabs (Posture A clean clinical, vialchemlabs.com)
Source: SUPER_PROMPT_v3 Appendix I + research digest sub_3_acquisition.md
+ v4 deferral closures (Phases 0-12)

---

## v4 status snapshot (2026-05-10)

The v4 pass closed **all in-scope deferrals from D1 through D27**. The
remaining items below are operator-only (credentials + domain
registration + first-buyer dollar) — codebase is ready the moment they
land.

```
v4 phases shipped: 0 1 2 3 4 5 6 7 8 9 10 11 12   (12/12 + Phase 13 docs)
deferrals closed:  D1 D2 D3 D4 D5 D6 D7 D8 D9 D10 D11 D12 D13
                   D14 D15 D16 D17 D24 D25 D26 D27          (21/27)
deferrals operator: D18 D19 D20 D21 D22 D23                  (6/27)
unit tests:        304 → 457
e2e tests:           0 → 136 (incl. 114 visual baseline)
git tag local:     v1.1.0 (push deferred to operator)
```

Detailed phase ledger: `docs/checkpoints/v4_phase_*.md`.

## Pre-Launch Checklist (Operator Action Required)

Items marked ✅ are already shipped against placeholders in the
codebase — operator just needs to drop the credentials. Complete in
order:

1. ✅ **Domain registration**: register `vialchemlabs.com`. Per-registrar
   guide at `docs/deploy/dns.md`. Cloudflare > Gandi > 101domain >
   Namecheap. Fallback: `vialchemlabs.bio`, `vialchemlabs.com`. **(D19)**
2. **USPTO TESS trademark search** for "vialchemlabs" and "vialchemlabs".
   Flag conflicts.
3. ✅ **LLC formation**: file Wyoming (default), Delaware, or Nevada LLC.
   Update `LLC_NAME` and `LLC_JURISDICTION` env. Replace `[Wyoming]`
   placeholder in legal pages. **(D20)**
4. **Source supplier conversation**: confirm MOQ, lead time, COA passthrough, contingency, per-mg cost. Update `DECISIONS/source_terms.md` (operator-side).
5. **Real lab partner contract**: Janoshik Analytical (default placeholder). Sign per-batch testing agreement. Update LAB_PARTNER_NAME if different.
6. **Replace stub credentials**:
   - Supabase project (URL + anon + service-role keys)
   - Resend API key + verified sender domain
   - Sentry project (DSN + auth token + org + project)
   - Plaid client ID + secret
   - BTCPay Server self-hosted URL + API key + store ID + webhook secret
7. **Replace placeholder COA PDFs**: `public/coa/<slug>-BATCH-2026-PLACEHOLDER.pdf` are stubs marked "EXAMPLE COA — REPLACE BEFORE LAUNCH". Generate real per-batch COAs from Janoshik for first inventory.
8. **Vercel project link**: `vercel link` in the project directory; environment variables set per `.env.example`.
9. **Domain DNS**: point `vialchemlabs.com` (or fallback) to Vercel.
10. **Buyer-conversation assignment** (Bible §16): 60-minute test with 3 prospective buyers in target audience. Optional but recommended.

## Day-1 Acquisition Workstreams

These start the moment the site goes live. Execute in parallel.

### 1. Google Organic SEO (3-6 month traction horizon)

**What**: long-form research-context PDPs and blog posts that rank for compound names.

**Day-1 baseline**: 5 blog posts already shipped (BPC-157 mechanism, COA reading guide, GHK-Cu overview, TB-500 mechanism, Recovery Stack synergy). Each at 1500-2400 words with 6 PubMed citations.

**Operator extension**:
- Submit `https://vialchemlabs.com/sitemap.xml` to Google Search Console.
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
- Configure Resend with verified sender domain (`research@vialchemlabs.com`).
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
> I run [Outliyr / Muscle+Brawn / PepPal / Brainflow]'s peptide vendor coverage. We launched vialchemlabs this month at vialchemlabs.com with seven research peptides and per-batch independent third-party COA testing through Janoshik Analytical.
>
> Three things I'd flag for any vendor review:
>
> 1. Every batch is HPLC-tested by Janoshik; PDFs are public at vialchemlabs.com/coa.
> 2. Catalog is intentionally small (BPC-157, TB-500, GHK-Cu, Ipamorelin, CJC-1295 no DAC, MOTS-c, Selank). No GLP-1s.
> 3. Compliance posture: research-use-only, age 21+ contractual checkbox, no shipping to CA/TX/NY/FL Day 1.
>
> Affiliate program: 10% / 15% / 20% commission tiers (90-day cookie) at vialchemlabs.com/affiliate.
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
> I'm [Operator] from vialchemlabs. We supply research peptides for in-vitro and animal-model studies with per-batch independent Janoshik COAs.
>
> I noticed your work on [topic — recovery research, sleep research, longevity research]. Would you be open to a paid post + affiliate program?
>
> - $500 flat fee for one IG post / Reel / TikTok
> - 20% commission on sales via your code, 90-day cookie
> - Per-creator unique discount code (your audience saves 15%)
> - Full creative latitude with one constraint: research-use-only framing (no human-use claims, no dosing protocols on-platform). FTC #ad disclosure required.
>
> Catalog: vialchemlabs.com/shop
> Affiliate detail: vialchemlabs.com/affiliate
>
> Reply if interested and I'll send a sample for your protocol research.
>
> Thanks,
> [Operator]

**FTC compliance**: `#ad` disclosure must appear in caption AND first 3 seconds of video. Operator monitors creator posts for compliance; non-compliant posts terminate the affiliate relationship.

**Time-to-traction**: first paid order from a stranger via creator code expected weeks 2-4 if 5+ creators land.

### 5. Defensive social handle registration

**What**: register `@vialchemlabs`, `@vialchemlabs`, `@vialchemlabs.com` (where allowed) on Instagram, TikTok, X — but **do NOT actively post** Day 1.

**Why**: prevents squatters; keeps platform-policy surface minimal. Posture A doesn't compete on social-native creative; the active social presence is via Tier S creator partnerships, not first-party posting.

**Optional**: founder-personal X account (per Peptide Sciences template — research-citation hashtag-thread cadence, ~95 followers/month organic). Brand X account stays as a stub.

### 6. Founder-personal X cadence (Posture A signature)

**What**: weekly thread cadence from founder X account citing recent peptide research papers (PubMed-linked). Brand-neutral attribution.

**Cadence**: 1 thread per week. Pattern: "New paper: [study title] — [3-4 sentence summary]. [Link]. #peptide #research."

**Why**: builds technical brand reputation in the community; signals expertise; drives indirect search traffic to vialchemlabs.com.

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
4. Generate placeholder COA → replace with real Janoshik COA on first batch
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
