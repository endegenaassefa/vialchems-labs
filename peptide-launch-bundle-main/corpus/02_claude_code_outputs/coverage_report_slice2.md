---
generated_at: 2026-05-06
slice: 2 (search + vendor-owned channels)
generator: claude-code lead agent
---

# Coverage Report — Slice 2

## Slice scope and what is NOT covered

This slice covers ONLY: Google organic, Google Ads, Bing/DuckDuckGo, third-party SEO content marketing, vendor-owned blogs, vendor-owned YouTube/Instagram/TikTok/X, email marketing, SMS marketing.

**Out of scope for this slice (will require subsequent runs):**

- Third-party YouTube creators (independent fitness/biohacking/longevity channels who promote vendors).
- Reddit (r/Peptides, r/PeptideTalk, r/MoreNutrition, r/MorePlatesMoreDates, r/SARMSourceTalk, looksmaxxing subs, biohacking subs).
- Specialized forums (Meso-Rx, Anabolic Steroid Forums, Anabolic Minds, EliteFitness, Evolutionary.org, MuscleGurus, Peptide Underground, longevity forums).
- Telegram, Discord, private groups.
- Influencer/creator economy proper (sponsorship structures, compensation ranges, FTC disclosure handling). Note: creator-driven affiliate-code economy is partially covered in Posture B Rank 2 of the synthesis, but full creator-economy mapping is a separate slice.
- Podcasts and newsletters.
- Adjacent paid platforms (crypto-adjacent ad networks, fitness-vertical programmatic, harm-reduction adjacent).
- Word of mouth and community embedding mechanics.
- In-person (expos, conferences, gym-scene, sponsored athletes).
- Indirect/gray-channel framing (longevity-adjacency funnel, compounding-pharmacy legitimacy plays).

The full vendor-universe convergence pass per `research_directive.md` §7.2 was NOT performed in this slice. A single anchor list (10 mainline + 10 posture-reference) was used as the starting set, with subagents free to surface additional vendors during channel research. A future slice should perform the formal §7.2 convergence loop before final acquisition recommendations are locked.

---

## Per-channel coverage status

| # | Channel | Status | Vendor examples reached | Notes |
|---|---------|--------|--------------------------|-------|
| 1 | google-organic-search | ok | ≥10 named + posture-vendor disconfirmation | 17 raw fetches; archive.org blocked from environment |
| 2 | google-ads | ok (with documented gap) | ≥7 named (negative-presence findings) + LegitScript triangulation | ATC SPA unparseable via WebFetch; Similarweb/Semrush triangulation substituted |
| 3 | bing-ddg-search | ok | ≥6 named with comparative analysis | Microsoft Ads policy verbatim required third-party paraphrase due to JS-SPA; Brave/Yandex/Kagi covered |
| 4 | seo-content-marketing | ok | ≥5 named content sites + ≥10 affiliate-router patterns | Encyclopedia-hub monetization model opaque; per-influencer affiliate mapping deferred |
| 5 | vendor-blogs | ok | 7 of 10 anchors have detectable blog | 3 anchors (Swiss Chems, Peptide Guys, Amino Asylum) confirmed absent or post-enforcement; schema validation by inference |
| 6 | vendor-youtube | ok (absence pattern is the finding) | 5 of 10 anchors with detectable channel | Sports Technology Labs YouTube terminated; 4 anchors no detectable channel; namespace collisions documented |
| 7 | vendor-instagram | ok | 7 of 10 anchors with detectable IG | Anti-bot fetch blocks reduced numeric metric capture; reincarnation-handle pattern documented |
| 8 | vendor-tiktok | ok (structural non-channel finding) | 2 of 10 anchors with corroborated handles | Anti-bot blocks profile-level metrics; TikTok Shop ban documented verbatim |
| 9 | vendor-x | ok (organic-only finding) | ≥7 named handles | All x.com profile fetches HTTP 402 anti-bot blocked; reconstructed from search snippets |
| 10 | email-marketing | ok | ≥9 named with ESP fingerprints | Welcome-sequence content not exercised (per ethical brief); DMARC/SPF/DKIM evidence captured per-vendor |
| 11 | sms-marketing | ok (widespread absence finding) | ≥10 named with negative-presence + 2 contractual-mention | Carrier per-vertical policies not publicly hosted; CTIA Handbook v1.9 captured verbatim |

---

## Failed fetches (aggregate)

The following sources were repeatedly inaccessible across multiple subagents and channels:

- **archive.org / web.archive.org** — Claude Code environment cannot fetch from web.archive.org; this blocks all "taken-down page" recovery. Affects: Peptide Sciences post-shutdown PDPs, removed YouTube channel snapshots, removed IG accounts, defunct vendor sites. **Recommended remediation:** A future run should use a real-browser tool with archive.org access to fill these gaps, particularly for Peptide Sciences' historical content given that vendor's shutdown is the largest landscape event in this slice.
- **peptidesciences.com** — Cloudflare 403 to non-browser clients across multiple subagents. Live-site evidence reconstructed from Wayback (where snapshots existed) and third-party reporting.
- **purerawz.co / purerawz.com** — HTTP 403 anti-bot to direct WebFetch.
- **swisschems.is** — Cloudflare bot-protection blocks automated fetches.
- **x.com profile pages** — HTTP 402 anti-bot across all subagents that attempted profile-level fetches.
- **TikTok profile and hashtag pages** — generic "TikTok - Make Your Day" returned for all profile URLs; structural anti-bot block.
- **Instagram profile pages** — Meta blocks reduced profile-data capture; bio + recent post observation works partially via search snippets only.
- **Google Ads Transparency Center** — JS-rendered SPA unparseable via WebFetch.
- **Microsoft Advertising help.ads.microsoft.com policy URLs** — 301-redirect to hash-routed JS SPA; verbatim policy capture not possible without real browser.
- **peptide.guys / peptideguys.com** — Domain returned ECONNREFUSED / 114-byte JS-redirect to /lander; possibly defunct or wrong canonical domain. Confirmed not active vendor in this slice's window.
- **Various authenticated SMS-platform pages** (10dlc.org details, T-Mobile per-vertical policy) — JS-rendered behind authentication.

**No subagent attempted bypass** of any anti-bot mechanism per Rule 9 of the anti-cheat covenant. All blocks are honestly documented as "uncertain" with reason in the relevant per-channel evidence files.

---

## Aggregate uncertainty patterns

Schema fields most often marked `uncertain` across the slice:

1. **Numeric follower counts on social platforms** (IG, TikTok, X) — anti-bot blocks across all three platforms restrict numeric metric capture.
2. **Welcome-email and abandoned-cart sequence content** — gated behind sign-up flows, not exercised per ethical rule (no fake-signup harvesting across competitors).
3. **Schema markup verification** — WebFetch returns processed markdown, not raw HTML; JSON-LD blocks are inferred from rendered surface evidence (Aggregate Rating displayed, Product schema-typical descriptions). Operator should run pages through Google Rich Results Test for ground truth.
4. **Cookie durations across affiliate programs** — only one vendor (Apollo Peptide Sciences at 120 days) surfaced explicitly.
5. **X Premium / blue-check verification status** — UI element not captured in search snippets.
6. **Specific affiliate-revenue volume per content site** — only routing patterns and code structures are public.
7. **Live ad-platform de-facto enforcement** — observable only via account submission; analyses rest on published policy + Similarweb/Semrush triangulation.

---

## Posture-reference vendor disposition

All 10 posture-reference vendors named in `combined_context.md` §1.5 (cited as orientation only, not as evidence) were investigated by the relevant channel subagents:

- **Hunter Eyes Labs, NZT Peptides, LAR Labs, Adam Labs, Land Bio, Structure Labs** (Posture A reference set): no channel surface confirms any of these as a real research-peptide vendor. All confirmed-hypothetical operator brand-name brainstorms.
- **Jester Labs, Psycho Labs / Psychopeptides, Chad Labs, LARP Labs** (Posture B reference set): no channel surface confirms any of these as a real research-peptide vendor. All confirmed-hypothetical.

This is itself a slice-level finding: there is no real reference brand the operator can imitate aesthetically for either posture exactly as conceived. Posture A has reference-class incumbents (Limitless Biotech, Biotech Peptides, Core Peptides, Peptide Sciences before shutdown) but the visual/naming register the operator brainstormed is empty. Posture B has no reference-class incumbent at all in the surveyed channels.

---

## Anomalies and high-leverage findings worth re-investigating

1. **Peptide Sciences shutdown March 6, 2026** — third-party reporting (adaptpeptides.com, news mentions) is consistent; PeptideProtocolWiki shows Last Verified 2026-02-09 with brand listed as operating; Wayback April 17, 2026 snapshot at HTTP 200. Status is partially conflicting; the email-marketing subagent concluded "shutdown claim is more likely third-party advocacy than fact." Operator should confirm current status before relying on the "Peptide Sciences alternatives" SEO opportunity.
2. **Pure Rawz and Behemoth Labz appear to share ownership** per industry-side reporting (single-source, plausible). The grey-market vendor cluster is more concentrated than public branding suggests. Implications for competitive analysis significant; warrants further research.
3. **Limitless Life Nootropics' 20.39% paid-keyword share on Similarweb** is the only non-zero anchor-vendor paid signal. Top keywords are branded — most consistent with branded-defensive bidding or affiliate/competitor bidding. Worth a 30-minute direct-browser SERP verification before treating Google Ads as fully closed for branded queries.
4. **Limitless Life Nootropics review-incentive scandal** (offered "25% off coupon for honest reviews on Trustpilot and SiteJabber") — Trustpilot policy violation. Operator should treat this as a cautionary on email + review-acquisition coupling.
5. **Behemoth Labz title pattern** "Cortagen Peptide: Uses, Benefits, Side Effects, and Dosage" is a structural mismatch between academic-disclaimer language and Q&A consumer-search-bait register. Possibly an emerging template, possibly a regulatory hazard — worth observing whether FDA cites Behemoth in next round of warning letters.
6. **Sports Technology Labs YouTube termination** despite the cleanest-compliance posture in the broader universe — verbatim Community Guidelines removal notice. Evidence that platform-policy enforcement is not predictable based on compliance posture alone.
7. **Reddit URLs do not appear in any top-10 SERP captured for commercial peptide queries** — instead, articles ABOUT Reddit ("Top 5 Peptide Injections Reddit Guide") rank in the slot. Major arbitrage opportunity for any vendor willing to host community-style content on its own domain.

---

## Skill / tooling gaps observed during this slice

- **archive.org access** — environment block; needed for taken-down-page recovery.
- **Real-browser SERP capture** — needed for SERP features (featured snippets, AI Overviews, People Also Ask, knowledge panels) that WebSearch's API-level result set does not surface.
- **Schema validation tooling** — Google Rich Results Test or schema.org validator access for JSON-LD ground truth.
- **Headless Chromium with stealth (gstack browse)** — would close anti-bot gaps on PureRawz, SwissChems, Peptide Sciences, X profiles, TikTok profiles, Instagram profiles, Google ATC, Microsoft Ads policy SPA.
- **Ahrefs / Semrush API access** — for keyword volume per compound term, indexed-page counts, backlink profiles. All inferred in this slice.
- **Klaviyo/Omnisend public profile API drilldowns** — partially used for ESP fingerprinting; could go deeper for SMS module activation status confirmation.

---

## Identified follow-ups for subsequent slices

1. Reddit subreddit map + source-list mining (forum acquisition is the missing trust-signaling layer per the synthesis recommendation).
2. Specialized forum coverage (Meso-Rx, EliteFitness, Anabolic Minds — vendor-sponsorship structures, paid forum ads).
3. Influencer/creator economy proper — sponsorship structures + compensation ranges + named tiers in fitness/looksmaxxing/biohacking.
4. Telegram/Discord channel mapping (Amino Asylum's t.me/aminoasylums redirect is evidence this is a meaningful channel for the category).
5. Adjacent paid platforms (crypto-ad networks, fitness-vertical programmatic, native ads).
6. Indirect framing slice — longevity-adjacency funnel, compounding-pharmacy legitimacy plays, nootropics adjacency as funnel entry.
7. Re-fetch peptidesciences.com / purerawz.co / swisschems.is with `gstack browse` to confirm schema markup, exact disclaimer language, and operational status.
8. Direct ATC observation per anchor vendor with real browser to confirm zero-paid-search state with high confidence.
9. Per-influencer affiliate-code mapping (TikTok/Instagram peptide influencers, MPMD, Jay Campbell network) — overlaps both SEO content slice and this future creator slice.
10. Vendor-universe convergence loop per `research_directive.md` §7.2 (≥5 passes + zero-add proof pass).

---

## Accelaminos Tier 3 Profile — Audit Notes (2026-05-07)

**5-gram overlap finding:** accelaminos vs core-peptides shows 26.88% Jaccard overlap on the 4-field set (hero_copy_excerpt, footer_disclaimers, exact_disclaimer_language, description_copy_excerpt). Investigation confirms the overlap is **entirely in the FDA 503A/503B boilerplate footer disclaimer** — industry-standard legal language used verbatim by multiple vendors. When footer_disclaimers is excluded from the gram set, overlap drops to 0.00%. Both profiles independently fetched their content from live sites. This is NOT a copy-paste violation — it is an industry-wide pattern of identical statutory disclaimer language. Logged per Rule 15 adjudication requirement. No re-fetch required.

**Trustpilot fetch failure:** HTTP 403 from curl; gstack:browse unavailable in WSL environment (Chromium binaries not installed). Trustpilot presence confirmed via on-site footer link and WordPress trustpilot-reviews plugin in source. Review count and aggregate rating marked uncertain.

**Checkout walk skipped:** Per §11 bounds, no account creation, no fake payment info. Payment methods, shipping carriers, account requirements all marked uncertain.

---

## Failed Fetch: exploratory-lab (Exploratory Lab)

### exploratory-lab (Exploratory Lab) — failed

- **Primary domain:** suppliescheaperpeptides.com
- **Discovered via:** Operator-supplied vendor list (00_inputs/vendor_list.csv), Tier 3 assignment
- **Attempts:**
  - 2026-05-07 — curl — Exit code 6: curl: (6) Could not resolve host: suppliescheaperpeptides.com
  - 2026-05-07 — curl (www prefix) — Exit code 6: curl: (6) Could not resolve host: www.suppliescheaperpeptides.com
  - 2026-05-07 — gstack:browse — net::ERR_NAME_NOT_RESOLVED at https://suppliescheaperpeptides.com/
  - 2026-05-07 — archive.org — Wayback Machine calendar page loaded; confirmed "Wayback Machine has not archived that URL." No snapshots ever indexed.
  - 2026-05-07 — ICANN RDAP — "The requested domain was not found in the Registry or Registrar's RDAP server." Domain is unregistered.
- **Web search findings:** No forum mentions, no Trustpilot reviews, no Reddit threads, no vendor listings on any aggregator for this domain or brand name in a peptide vendor context.
- **Conclusion:** Domain suppliescheaperpeptides.com is unregistered and has never been crawled. The vendor "Exploratory Lab" at this domain either never launched, was extremely short-lived before any crawler indexed it, or the domain assignment in the operator seed list may be incorrect. Recommend operator manual investigation to verify intended domain.
- **Profile status:** fetch_status: failed. field_completion_ratio: 0.09. All schema fields except identity are uncertain.
- **Raw artifacts:** 03_raw_fetches/exploratory-lab/ (3 files: homepage.md, wayback_attempt.md, icann_whois.md)

---

## Failed Fetches

### m-peptides (M-Peptides) — failed

- Discovered via: 00_inputs/vendor_list.csv (operator seed, Tier 3)
- Attempts:
  - 2026-05-07T19:51:00Z — curl_fetch.py — HTTP 436 (non-standard; empty body returned)
  - 2026-05-07T19:52:00Z — gstack-browse — Domain parked; browser redirected to http://resultearchnow.com/?dn=m-peptides.com&sksubid=35961519&_slsen=0. No vendor content served.
  - 2026-05-07T19:54:00Z — archive-org — CDX API returns 7 snapshots: only 2018 snapshot (200) contains content, which is a Polish web hosting placeholder page from home.pl ("Opcje dostepne dla administratora"). 2021 shows 404. 2024 shows 403/406. 2025 snapshot redirects to unrelated lilipeptide.com parking page. No peptide vendor content was ever archived at this domain.
- Conclusion: m-peptides.com was registered in Poland (home.pl hosting infrastructure) but never activated as a functioning peptide vendor. The domain is now a DNS parking redirect. No baseline vendor profile is recoverable. The domain name appears in the seed CSV with no further corroborating forum or review trail. Recommend operator confirm whether M-Peptides operated under a different domain.

---

### uther (Uther) — failed

- Discovered via: 00_inputs/vendor_list.csv (operator seed, Tier 3); described as "Chinese B2B API supplier" with Finnrick as third-party intermediary
- Attempts:
  - 2026-05-08T04:43:00Z — curl — Exit code 6: Could not resolve host: uther.com. DNS confirms: no A record exists. Domain has Cloudflare NS (maria.ns.cloudflare.com, rajeev.ns.cloudflare.com) and ProtonMail MX records (mail.protonmail.ch, mailsec.protonmail.ch), and a Keybase site verification TXT record — domain is registered and has email infrastructure, but no web server is pointed at it.
  - 2026-05-08T04:44:00Z — gstack:browse — Chromium sandbox failure in this environment (running as root without --no-sandbox). Browser could not launch. This is an environment-level limitation, not a site-level block. Method counts as exhausted for this vendor.
  - 2026-05-08T04:44:00Z — archive.org CDX API — Confirmed: only 3 snapshots exist for uther.com across all time (2007 robots.txt, 2007 robots.txt, 2009 homepage). The 2009 snapshot is a GoDaddy parked-domain page ("What's a Domain?"). No peptide vendor content has ever been indexed at uther.com.
- DNS supplemental findings: TXT record contains "keybase-site-verification=VpGJS4X2JJ12r32SSRBGy56xKGbDXqCNe0AnBtoOfY0" suggesting domain may be used for identity verification by a private individual. SPF record "v=spf1 include:_spf.protonmail.ch mx ~all" confirms ProtonMail email is actively configured.
- Conclusion: uther.com has never served a public website at any archived point and currently has no web server. The domain appears to belong to a private individual or internal entity using ProtonMail for email. No public peptide vendor storefront, product catalog, pricing, or compliance documentation is recoverable by any public-web means. The "Finnrick" third-party reference in the seed CSV suggests this vendor may operate only through an intermediary platform, not via a public direct domain. Recommend operator contact Finnrick directly for Uther product data.
- Profile status: fetch_status: failed. field_completion_ratio: 0.10. All content schema fields are uncertain.
- Raw artifacts: 03_raw_fetches/uther/ (3 files: homepage.md, homepage_attempt2_browse.md, homepage_attempt3_archive.md)
