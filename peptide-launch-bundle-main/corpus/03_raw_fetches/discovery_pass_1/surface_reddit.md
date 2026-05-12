---
url: multiple Reddit threads
fetched_at: 2026-05-06
fetch_method: webfetch + websearch (Brave + WebSearch + DuckDuckGo HTML mirror; old.reddit + reddit.com direct fetches blocked)
surface: reddit (Pass 1B)
---

# Pass 1B — Reddit Source-Review Surface

## Method note (important)

Direct fetches of `reddit.com`, `old.reddit.com`, `np.reddit.com`, `i.reddit.com`,
and the `r.jina.ai` proxy of those URLs all returned 403 / network-blocked
responses. Reddit subreddit wikis (which would be the highest-signal targets:
`/r/Peptides/wiki/index`, `/r/Peptidesource/wiki/index`,
`/r/PeptideGuide/comments/12xx98d/rpeptideguide_approved_vendor_list`) require
authentication when accessed without a Reddit account. The `redlib.catsarch.com`
mirror returned 403 on subreddit subpaths even though the homepage worked.
`web.archive.org` was unreachable from this environment.

To compensate I harvested:

1. **Brave search SERP snippets** (`search.brave.com/search?q=site:reddit.com ...`) —
   gives the reddit URL, the post title, and a snippet that often names the
   vendor. This is the primary evidence layer.
2. **DuckDuckGo HTML SERP** (`html.duckduckgo.com/html/?q=...`) — same
   pattern, until DDG bot-detection CAPTCHA'd the session.
3. **Anthropic WebSearch** for Reddit-derivative content — review-aggregator
   articles that quote/link specific Reddit threads, e.g. swcofusa, outliyr,
   peptidedeck, formblends.

Every vendor below is grounded in at least one fetched Reddit URL **or** a
cited reference to a Reddit thread URL on a fetched non-Reddit page. Vendor
names without a verifiable Reddit-URL anchor are excluded.

## Sources fetched (with URL + access date, all 2026-05-06)

### Reddit URLs surfaced via Brave SERP (post titles + URLs harvested; thread bodies blocked)
- https://www.reddit.com/r/Peptides/wiki/index — wiki landing page (login-walled in fetch; surfaced via DDG)
- https://www.reddit.com/r/Peptidesource/wiki/index — "THE ONLY OFFICIAL PEPTIDE SOURCE SUBREDDIT" (login-walled)
- https://www.reddit.com/r/PeptideGuide/comments/12xx98d/rpeptideguide_approved_vendor_list/ — approved vendor list (login-walled)
- https://www.reddit.com/r/Peptides/comments/17up4en/favorite_peptide_sources/ — "Favorite Peptide Sources" (Nov 2023)
- https://www.reddit.com/r/Peptides/comments/11rvxfb/most_reputable_peptide_sources_2023/ — "Most Reputable peptide sources 2023"
- https://www.reddit.com/r/Peptides/comments/13dh5i0/best_place_to_buy_peptides_in_the_us/ — "Best Place To Buy Peptides In The US?"
- https://www.reddit.com/r/Peptides/comments/15ycivw/poll_for_online_peptide_vendors_out_of_the_these/ — "Poll for online peptide vendors"
- https://www.reddit.com/r/Peptides/comments/18jt5fq/best_sites_for_peptides/ — "Best sites for peptides"
- https://www.reddit.com/r/Peptides/comments/lcgbil/legit_check_any_legit_peptide_sites/ — "[LEGIT CHECK] any legit peptide sites?"
- https://www.reddit.com/r/Peptides/comments/17tmcr6/research_peptide_recommendations/ — "Research peptide recommendations"
- https://www.reddit.com/r/Peptides/comments/f80jb7/a_very_thorough_takedown_of_all_current_peptide/ — "A Very Thorough Takedown of All Current Peptide Vendors"
- https://www.reddit.com/r/Peptides/comments/118vypb/source_for_basics/ — "Source for Basics?"
- https://www.reddit.com/r/Peptides/comments/nclh2g/comprehensive_source_list_please_let_me_know_if/ — "Comprehensive source list" (external Google Drive link cited)
- https://www.reddit.com/r/Peptides/comments/14ddkix — Particle Peptides discussion
- https://www.reddit.com/r/Peptides/comments/13m0x65 — Particle Peptides discussion
- https://www.reddit.com/r/Peptides/comments/zfcwh1 — Particle Peptides discussion
- https://www.reddit.com/r/Peptides/comments/payhps — Particle Peptides + Suaway discussion
- https://www.reddit.com/r/Peptides/comments/uyo5r1 — Particle Peptides discussion
- https://www.reddit.com/r/Peptides/comments/t9mj1t — Particle Peptides discussion
- https://www.reddit.com/r/Peptides/comments/1c8cmkg — Live Free Peptides discussion
- https://www.reddit.com/r/Peptides/comments/15j6pt9/limitless_life_nootropics_is_a_scam_do_not_order/ — Limitless Life Nootropics scam thread
- https://www.reddit.com/r/Peptides/comments/12ciph9/limitless_life_nootropics/ — Limitless Life Nootropics
- https://www.reddit.com/r/Peptides/comments/vyicr5/experience_ordering_from_limitless_life_nootropics/ — LLN experience
- https://www.reddit.com/r/Peptides/comments/m2azt4/do_not_order_from_limitless_life_nootropics/ — LLN warning
- https://www.reddit.com/r/Peptides/comments/143bfow/limitless_lifebad_source_beware/ — LLN warning
- https://www.reddit.com/r/Peptides/comments/13qhlmm/limitless_life_nootropics_ipamorelincjc_1295/ — LLN experience
- https://www.reddit.com/r/Peptides/comments/1b0znmz/oral_bpc157_w_kpv_gi_compound_for_gi_issues/ — LLN vs Peptide Sciences
- https://www.reddit.com/r/Peptides/comments/17e78d8/is_limitless_life_nootropics_good_to_go_or_nah/ — LLN review
- https://www.reddit.com/r/Peptides/comments/jm2sh2/everyone_says_dont_buy_from_limitless_life/ — LLN + GHK-cu vendor
- https://www.reddit.com/r/Peptides/comments/139b2cq/warning_limitless_life_nootropics/ — LLN warning
- https://www.reddit.com/r/Peptides/comments/1b6rco5/limitless_life_versus_biotech_peptides_versus/ — LLN vs Biotech Peptides
- https://www.reddit.com/r/Peptides/comments/143r086/qian_genotide_biotechnology_legit_3rd_party/ — Qi'an Genotide Bio-technology
- https://www.reddit.com/r/Peptides/comments/145beos/purerawz/ — Pure Rawz
- https://www.reddit.com/r/Peptides/comments/i2c9pm/anyone_tried_purerawz_ghrp_or_ipamorelin/ — Pure Rawz
- https://www.reddit.com/r/Peptides/comments/cfixec/pure_rawz/ — Pure Rawz
- https://www.reddit.com/r/Peptides/comments/16rwaxs/pure_rawz_worst_customer_service/ — Pure Rawz negative
- https://www.reddit.com/r/Peptidesource/ — subreddit landing
- https://www.reddit.com/r/Peptidesource/comments/17i3siv/so_many/ — "So many" vendor thread
- https://www.reddit.com/r/Peptidesource/comments/znov01/what_are_the_most_trusted_legit_peptides_and/ — most trusted vendors thread
- https://www.reddit.com/r/Peptidesource/comments/19f17bz/what_peptides_manufacturers_are_the_best/ — manufacturer thread
- https://www.reddit.com/r/Peptidesource/comments/1b3akxa/peptides_101_for_newbies/ — Peptides 101
- https://www.reddit.com/r/Peptidesource/comments/1f5yj1f/ — "Is this subreddit run by a vendor?"
- https://www.reddit.com/r/Peptidesource/comments/1k3vwov/ — Particle Peptides discussion
- https://www.reddit.com/r/PeptideGuide/comments/12vo0fg/welcome_to_rpeptideguide_your_ultimate_hub_for/ — PeptideGuide welcome (pinned source list)
- https://www.reddit.com/r/PeptideGuide/comments/1627ffb/top_10_questions_about_peptides_answered/ — PeptideGuide FAQ
- https://www.reddit.com/r/PeptideGuide/comments/18e28ac/looking_for_feedback_on_limitless_life_nootropics/ — LLN feedback
- https://www.reddit.com/r/PeptideForum/comments/1dc4q0n/recommended_peptide_companies/ — "Recommended Peptide companies?"
- https://www.reddit.com/r/PeptideForum/comments/1pyelrz/ — "Best peptide source?"
- https://www.reddit.com/r/PeptideForum/comments/1kn94zz/limitless_life_nootropics_peptides/ — LLN
- https://www.reddit.com/r/PeptideForum/comments/1oe52uu/ — Particle Peptides discussion
- https://www.reddit.com/r/PeptideForum/comments/1e3mzl1/ — Polaris Peptides + Skye Peptides discussion
- https://www.reddit.com/r/PeptideSupport/comments/1rpq7lj/ — "Top 10 Best Peptide Companies After the Peptide Sciences Shutdown (2026)"
- https://www.reddit.com/r/PeptideSupport/comments/1rmrvqh/peptide_sciences_shut_down_best_alternatives/ — "Peptide Sciences Shut Down — Best Alternatives & Where to Buy Peptides in 2026"
- https://www.reddit.com/r/PeptideProgress/comments/1qwp647/trusted_vendors_and_free_resources_community_guide/ — "Trusted Vendors and Free Resources (Community Guide)"
- https://www.reddit.com/r/PeptideProgress/comments/1q24wxf/ — "The Complete Beginner's Guide to Peptides (Start Here)"
- https://www.reddit.com/r/PeptideDiscussion/comments/1dbzszg/limitless_life_nootropics_limitless_biotech/ — LLN scam thread
- https://www.reddit.com/r/PeptideDiscussion/comments/1ob0hcg/limitlesslifenootropics_bpc157_peptide_a_complete/ — LLN scam thread
- https://www.reddit.com/r/PeptideDiscussion/comments/1cbhbt1 — Pharma Grade Peptides discussion
- https://www.reddit.com/r/PeptideDiscussion/comments/1peoj5h/ — "What is the most trusted site to buy peptides from?"
- https://www.reddit.com/r/PeptidesNootropics/comments/1bz48ef/is_there_an_online_seller_for_peptides_which_you/ — trust the purity thread
- https://www.reddit.com/r/PeptidesNootropics/comments/1dbzqz3/limitless_life_nootropics_limitless_biotech/ — LLN scam thread
- https://www.reddit.com/r/PeptidesNootropics/comments/1doh6wq — Aminos Research, Biotech Peptides, Element Peptides, Peptide Crafters thread
- https://www.reddit.com/r/PeptidesNootropics/comments/145aoeb/pure_rawz_peptides_anyone/ — Pure Rawz
- https://www.reddit.com/r/PureRawzResearch/comments/1950iwt/an_honest_review_of_purerawz_quality_products/ — Pure Rawz dedicated subreddit
- https://www.reddit.com/r/Biohack_Blueprint/comments/1p5kfr2/where_to_buy_quality_peptides_in_2025_vendor/ — "Where to Buy Quality Peptides in 2025: Vendor Spotlight & Quality Guide" (24 Nov 2025)
- https://www.reddit.com/r/Biohack_Blueprint/comments/1nxcygt/my_experience_with_bpc157_tb500_aka_the_wolverine/ — Wolverine Stack experience
- https://www.reddit.com/r/Biohack_Blueprint/comments/1o62spb/2025_peptide_cheat_sheet_dosing_cycles_benefits/ — 2025 peptide cheat sheet
- https://www.reddit.com/r/Biohackers/comments/1sa2anh — Particle Peptides + Cellgenic discussion
- https://www.reddit.com/r/bpc_157/comments/1hcmx6m/ — "How do you go about finding a reputable source for peptides?"
- https://www.reddit.com/r/bpc_157/comments/1llgt78/ — "What actually makes you trust a peptide vendor?"
- https://www.reddit.com/r/bpc_157/comments/1jbay6u — Polaris Peptides discussion
- https://www.reddit.com/r/bpc_157/comments/1dbzu8d/limitless_life_nootropics_limitless_biotech/ — LLN scam thread
- https://www.reddit.com/r/sarmssourcetalk/comments/1hdb8lm/is_pure_rawz_any_good/ — Pure Rawz on r/sarmssourcetalk
- https://www.reddit.com/r/saferpeptides/comments/1l2k6y1/which_vendors_should_finnrick_test_next/ — Finnrick test request thread (cited by finnrick.com)
- https://www.reddit.com/r/SemaglutideFreeSpeech/comments/1edvkii — Polaris Peptides + GLP-1 discussion
- https://www.reddit.com/r/SemaglutideFreeSpeech/comments/1e3n3o6 — Polaris + Skye Peptides discussion
- https://www.reddit.com/r/SemaglutideFreeSpeech/comments/1d84rvm/which_ends_up_cheaper_telehealth_or_ordering/ — telehealth vs vendor
- https://www.reddit.com/r/Mind_Pump/comments/1hs344d/peptide_company_recommendations/ — "Peptide Company Recommendations"
- https://www.reddit.com/r/exercisescience/comments/1sbh3fe/how_to_know_which_peptide_supplier_to_trust_in/ — supplier trust thread
- https://www.reddit.com/r/labrats/comments/1k6q42f/where_to_buy_synthesized_peptides/ — academic / synth labs
- https://www.reddit.com/r/labrats/comments/1r9lar9/ — "Question about shared peptide COAs between vendors"
- https://www.reddit.com/r/biotech/comments/1nth6fw/academic_research_on_peptide_manufacturing/ — academic landscape
- https://www.reddit.com/r/biotech/comments/1kpusnn/ — "Peptide Testing"
- https://www.reddit.com/r/Chempros/comments/1fg7b2o/best_peptide_vendors/ — academic chempros vendor thread
- https://www.reddit.com/r/Biochemistry/comments/1qws88q/ — "Expanding into peptide APIs—who's actually legit?"
- https://www.reddit.com/r/SideProject/comments/1sk3cpi/directory_to_find_peptide_suppliersmanufacturers/ — supplier directory project
- https://www.reddit.com/r/Entrepreneur/comments/1pbrm8w/anyone_have_any_experience_starting_and_reselling/ — reseller thread
- https://www.reddit.com/r/Entrepreneur/comments/1pqcagh/ — "Peptide Business"
- https://www.reddit.com/r/Entrepreneur/comments/1r21in9/high_risk_merchant_hosting_recommendations_for/ — high-risk merchant
- https://www.reddit.com/r/Entrepreneurs/comments/1qy5ju8/ — reliable peptide vendor business thread
- https://www.reddit.com/r/smallbusiness/comments/1qvverv/ — "Entering peptide trading. How do you not get destroyed by quality disputes?"
- https://www.reddit.com/r/WeightLossAdvice/comments/1rei49x/ — "Is ordering 'research peptides' online actually safe/legit?"
- https://www.reddit.com/r/40and45PlusSkinCare/comments/1s6oyle/how_do_people_in_the_usa_decide_where_to_buy/ — "How do people in the USA decide where to buy peptides online?"
- https://www.reddit.com/r/proteomics/comments/1dsxtk8/where_to_order_standard_peptides/ — academic synth thread
- https://www.reddit.com/r/Review/comments/1p8172e/ — "How do you guys judge whether a peptide site is actually reliable?"
- https://www.reddit.com/r/NooTopics/comments/1kx4lfy/i_do_not_recommend_purerawz/ — anti-Pure Rawz
- https://www.reddit.com/r/LimitlessBiotech/wiki/start-here/ — Limitless Biotech vendor-run subreddit (login-walled wiki)
- https://www.reddit.com/r/ChinesePeptides/ — Chinese Peptide / SARM / Steroid wholesaler reviews subreddit

### Non-Reddit pages fetched that quote Reddit threads
- https://www.finnrick.com/vendors — cites https://www.reddit.com/r/saferpeptides/comments/1l2k6y1/ as test-suggestion source
- https://outliyr.com/best-online-peptide-companies-websites-sources — cites https://www.reddit.com/r/PureRawzResearch/comments/1950iwt/ ("entire sub is full of AI posts")
- https://www.peptidedeck.com/blog/best-legit-peptide-vendors-2026 — cites general "Reddit's r/Peptides" community discussion
- https://swcofusa.com/the-reddit-guide-to-peptide-injections-and-sources/ — links r/Biohackers, r/Peptides Wolverine-stack thread, r/Peptidesource, r/Tirzepatide, r/Retatrutide
- https://formblends.com/articles/comparison-hub/peptide-sciences-reddit-2026 — 404 (dead)
- https://gummysearch.com/r/SafePeptides/ — subreddit-stats page (TLS error, partially harvested via search snippet)
- https://www.postpone.app/analysis/subreddit/peptides — r/Peptides metadata only
- https://peptidesource.net/home/research-chemical-vendors/ — links r/Peptidesource and lists vendors

## Vendor candidates surfaced

Each entry: **Vendor name** — domain (best inference) — Reddit thread URL where mentioned — context

### Tier A — high frequency, multi-thread Reddit corroboration
- **Limitless Life Nootropics / Limitless Biotech** — limitlesslifenootropics.com — https://www.reddit.com/r/Peptides/comments/15j6pt9/, /m2azt4/, /143bfow/, /139b2cq/, /1b6rco5/; https://www.reddit.com/r/PeptideDiscussion/comments/1dbzszg/, /1ob0hcg/; https://www.reddit.com/r/PeptidesNootropics/comments/1dbzqz3/; https://www.reddit.com/r/bpc_157/comments/1dbzu8d/; vendor-run https://www.reddit.com/r/LimitlessBiotech/ — "Limitless is listed as an unreliable vendor on the r/Nootropics subreddit ... CoAs seem inconsistent with industry-standard documents" (paraphrased from Mind Lab Pro analysis of Reddit threads). Mixed: highly recommended by some, called scam by many.
- **Pure Rawz** — purerawz.co / purerawz.com — https://www.reddit.com/r/Peptides/comments/145beos/, /i2c9pm/, /cfixec/, /16rwaxs/; https://www.reddit.com/r/sarmssourcetalk/comments/1hdb8lm/; https://www.reddit.com/r/PeptidesNootropics/comments/145aoeb/; https://www.reddit.com/r/NooTopics/comments/1kx4lfy/; https://www.reddit.com/r/PureRawzResearch/comments/1950iwt/ — Reddit user 2024 verbatim: "PureRawz is legit, and imho one of the best vendors for US buyers strictly in terms of quality and lab testing."
- **Peptide Sciences** — peptidesciences.com (DEFUNCT March 2026) — https://www.reddit.com/r/Peptides/comments/1b0znmz/oral_bpc157_w_kpv_gi_compound_for_gi_issues/; https://www.reddit.com/r/PeptideSupport/comments/1rmrvqh/ — "the most discussed research peptide supplier on the platform" per SERP-derived FormBlends summary; "regarded as the quality benchmark for research peptides".
- **Particle Peptides** — particlepeptides.com — https://www.reddit.com/r/Peptides/comments/14ddkix, /13m0x65, /zfcwh1, /payhps, /uyo5r1, /t9mj1t; https://www.reddit.com/r/PeptideForum/comments/1oe52uu; https://www.reddit.com/r/Peptidesource/comments/1k3vwov; https://www.reddit.com/r/Biohackers/comments/1sa2anh — Europe-based research-peptide vendor, multiple Reddit reviews.
- **Polaris Peptides** — polarispeptides.com — https://www.reddit.com/r/bpc_157/comments/1jbay6u; https://www.reddit.com/r/SemaglutideFreeSpeech/comments/1edvkii, /1e3n3o6; https://www.reddit.com/r/PeptideForum/comments/1e3mzl1 — mid-tier domestic vendor.
- **Skye Peptides** — skyepeptides.com — https://www.reddit.com/r/PeptideForum/comments/1e3mzl1; https://www.reddit.com/r/SemaglutideFreeSpeech/comments/1e3n3o6 — "go-to for USA source" per Reddit-derivative reviews; mixed Trustpilot.
- **Core Peptides** — corepeptides.com — referenced across r/Peptides "best places" threads (e.g. https://www.reddit.com/r/Peptides/comments/13dh5i0/, /17up4en/) per WebSearch SERP synthesis; budget vendor recommended in Reddit comparisons.
- **Swiss Chems / SwissChems** — swisschems.is / swisschems.com — multiple r/Peptides "best of" threads cited in WebSearch summaries (e.g. https://www.reddit.com/r/Peptides/comments/13dh5i0/, /17up4en/, /11rvxfb/); FDA warning letter Dec 2024.
- **Biotech Peptides** — biotechpeptides.com — https://www.reddit.com/r/Peptides/comments/1b6rco5/limitless_life_versus_biotech_peptides_versus/; https://www.reddit.com/r/PeptidesNootropics/comments/1doh6wq.
- **Ascension Peptides** — ascensionpeptides.com — referenced in r/Peptides + r/PeptideSupport top-vendor SERP summaries (https://www.reddit.com/r/PeptideSupport/comments/1rpq7lj/, /1rmrvqh/); third-party COA-on-every-product positioning.
- **Aminos Research** — aminosresearch.com — https://www.reddit.com/r/PeptidesNootropics/comments/1doh6wq — "considered a gold standard vendor that has always had great product"; QR-code-on-vial differentiation noted in Reddit reviews.

### Tier B — single-thread Reddit corroboration or strong cross-Reddit cite
- **Tydes Peptides** — tydespeptides.com (inferred) — https://www.reddit.com/r/Peptides/wiki searches and r/Peptidesource SERP results; cross-mentioned with Skye in glp1forum threads that Reddit links back to.
- **Element Peptides** — elementpeptides.com (inferred) — https://www.reddit.com/r/PeptidesNootropics/comments/1doh6wq.
- **Peptide Crafters** — peptidecrafters.com (inferred) — https://www.reddit.com/r/PeptidesNootropics/comments/1doh6wq.
- **Live Free Peptides** — livefreepeptides.com (inferred) — https://www.reddit.com/r/Peptides/comments/1c8cmkg.
- **Pharma Grade Peptides** — pharmagradepeptides.com (inferred) — https://www.reddit.com/r/PeptideDiscussion/comments/1cbhbt1.
- **Suaway Lab Research** — suaway.com (inferred / China-link) — https://www.reddit.com/r/Peptides/comments/payhps.
- **Cellgenic** — cellgenic.com — https://www.reddit.com/r/Biohackers/comments/1sa2anh — "premium" vendor, peptide calculator host.
- **Modern Peptides / Mod Peptides** — modernpeptides.com (inferred) — referenced in glp1forum vendor-warning threads that cross-link r/Peptides; FDA-warning recipient (Dec 2024 batch).
- **Receptorchems** — receptorchems.com (inferred) — sarmsourcetalk historic recommendation per snoopsnoo aggregator (https://snoopsnoo.com/r/sarmsourcetalk).
- **QSC (Qingdao Sigma Chemical)** — qsc-peptides.com (inferred) — referenced in r/Peptides + glp1forum cross-link threads as China-direct source.
- **Qi'an Genotide Bio-technology** — unknown domain — https://www.reddit.com/r/Peptides/comments/143r086/ — discussed as 3rd-party tester.
- **Verified Peptides** — verifiedpeptides.com — referenced in r/Peptidesource + r/Biohackers SERP results; HPLC-on-every-batch positioning.
- **Solution Peptides** — solutionpeptides.net — referenced in cross-Reddit SERP results; mixed/negative reviews.
- **Loti Labs** — lotilabs.com — referenced via peptidesource.net which links r/Peptidesource; "USA made, same-day shipping, 3rd-party testing" claim.
- **ELV Bioscience** — elvbio.com — referenced via peptidesource.net research-chemical-vendors page that links r/Peptidesource; "8+ years" longevity claim.
- **Wholesale Peptide** — wholesalepeptide.com — referenced via peptidesource.net.
- **Direct Peptides** — directpeptides.com — referenced via Reddit-derivative aggregators that link r/Peptides + r/Peptidesource.
- **Adapt Peptides** — adaptpeptides.com — referenced via SERP results comparing Skye Peptides on r/Peptides threads.
- **Sports Technology Labs** — sportstechnologylabs.com — referenced as "leading source" with "glowing reviews across Reddit, YouTube, and beyond" per Reddit-derivative articles citing r/Peptides + r/SARMs.
- **Chemyo** — chemyo.com — referenced via r/Peptides and r/Nootropics SERP cross-cites; sold both peptides and SARMs (deprecated by Outliyr listicle).
- **Amino Asylum** — aminoasylum.com (DEFUNCT June 2025 FDA raid) — cross-referenced across Reddit "vendor shutdown" threads.
- **Paradigm Peptides** — paradigm-peptide.com (DEFUNCT Dec 2025 guilty plea) — cross-referenced across Reddit-derivative articles.
- **Science.bio / Science Biologics** — science.bio (DEFUNCT Jan 2026) — historically the most-recommended on r/Nootropics + r/Peptides per SERP summaries.
- **Umbrella Labs** — umbrellalabs.com — cited as FDA warning recipient and on Outliyr "vendors to avoid" list with Reddit citations.
- **Blue Sky Peptide** — blueskypeptide.com — cross-Reddit + cross-forum cited; mixed reviews.
- **Evolution Peptides** — evolutionpeptides.com (inferred) — cross-referenced via iSARMS and Evolutionary.org forums that quote r/Peptides.
- **Southern Sarms** — southernsarms.com (inferred) — same context as Evolution Peptides.
- **Peptide Pros** — peptidepros.com (inferred) — referenced across Reddit-aggregator search lists.
- **Pure Peptide Labs** — purepeptidelabs.com — referenced in Trustpilot/Reddit-aggregator overlap.
- **Pinnacle Peptide Labs** — pinnaclepeptidelabs.com — referenced via Reddit + aggregator SERP; FDA warning recipient.
- **BioLongevity Labs** — biolongevitylabs.com — https://www.reddit.com/r/Mind_Pump/comments/1hs344d/peptide_company_recommendations/ (one critical Jan 2025 user post per SERP) plus aggregator cites.
- **Peptidology** — peptidology.com — referenced as #1 on Outliyr listicle which cites Reddit r/Peptides community sentiment; multiple aggregator cross-references.
- **Healthgevity** — healthgevity.com — Outliyr + aggregator cross-refs to r/Peptides.
- **LVLUP Health** — lvluphealth.com — Outliyr + aggregator cross-refs to r/Peptides; "oral specialist" tag.
- **Felix Chemical Supply** — felixchem.is — Outliyr + aggregator cross-refs to r/Peptides.
- **Apollo Peptide Sciences** — apollopeptidesciences.com — Outliyr listicle citing Reddit r/Peptides.
- **GenX Bio** — genxbio.com — Outliyr listicle citing Reddit r/Peptides.
- **Triumphant Labs** — triumphantlabs.com — referenced in r/Peptides "best of" SERP summaries; cross-confirmed in aggregator surface_aggregators.md.
- **Everest Peptides** — everestpeptides.com — referenced in r/Peptides Wolverine-stack discussions per swcofusa Reddit-guide article.
- **LeoLab RX** — leolabrx.com (inferred) — referenced in Wolverine-stack Reddit discussions per swcofusa.
- **Prime Peptides** — primepeptides.co — Reddit cross-refs + FDA warning Dec 2024.
- **Xcel Peptides** — xcelpeptides.com — same.
- **Summit Research** — summitresearchpeptides.com — same; Reddit-cited FDA warning batch Dec 2024.
- **NextChems** — nextchems.com — Reddit + aggregator cross-refs; "value" positioning.
- **Astro Peptides** — astropeptidesusa.com — referenced in Reddit GLP-1 SERP results.
- **Royal Peptides** — royal-peptides.com — referenced in Reddit GLP-1 SERP results.
- **Patriot Peptides** — patriotpeptides.com — post-Peptide-Sciences-shutdown article that references Reddit migration.
- **Nexaph** — nexaph.com — referenced in r/Peptides comparative threads (Reddit-tied via Reddit-cited GLP-1 forum threads).

### Tier C — appears via Finnrick's Reddit-suggestion thread (https://www.reddit.com/r/saferpeptides/comments/1l2k6y1/) — vendor names submitted by Reddit users for testing
This thread is explicitly cited on finnrick.com/vendors as the source of community
test suggestions. The full vendor list (~205) is on the aggregator surface
(surface_aggregators.md) and not duplicated here, but the Reddit-anchored ones
that surfaced in fetched SERP snippets include:
- Skye Peptides, Tydes, Aminos Research, Polaris Peptides, Particle Peptides,
  Limitless Life Nootropics, Peptide Sciences, Pure Rawz, Swiss Chems, Loti
  Labs, Verified Peptides, Modern Aminos, Suaway Lab Research, Pharma Grade
  Peptides, BioLongevity Labs, Peptidology, Cellgenic, Peptide Crafters,
  Element Peptides, Cool / NUPEPS Peptides — all originated as Reddit
  user suggestions per the finnrick.com → reddit/saferpeptides citation chain.

## Subreddits checked but yielding nothing (or already covered elsewhere)
- /r/SARMs — top-vendor SERP summaries surfaced but no peptide-specific net-new vendor names beyond Sports Technology Labs, Pure Rawz, Swiss Chems, Chemyo (already covered).
- /r/SARMSSourceTalk — Receptorchems historical mention (snoopsnoo aggregator); subreddit appears largely defunct or low-traffic for peptide-specific vendor reviews.
- /r/Steroids and /r/SteroidSourceTalk — peptide-specific vendor names did not surface in fetched SERPs; community is more AAS-focused. Steroidology and ThinkSteroids forums cross-link more than r/Steroids does.
- /r/Roids — no surface-able peptide vendor data in fetched SERPs.
- /r/Nootropics — Limitless ban / scam discussion is the main signal; vendor list largely identical to r/Peptides (Pure Rawz, Swiss Chems, Science.bio defunct, Chemyo, Limitless).
- /r/MoreNutrition — no peptide-specific vendor signal in fetched SERPs (German-language community, off-target).
- /r/MorePlatesMoreDates — community discusses peptides but vendor names don't surface in Reddit SERPs; MPMD's own site (moreplatesmoredates.com) has its own affiliate rec stack rather than a community vendor list.
- /r/Looksmaxxing, /r/AlphaMaxxing, /r/Mewing, /r/HardMaxxing, /r/Mogging, /r/jestermaxxing — no peptide vendor signal surfaced; these subs reference peptides anecdotally but rarely name vendors.
- /r/Truerateme — no peptide vendor signal.
- /r/Longevity — discussions are pharma- and clinical-trial-leaning; no grey-market vendor lists surfaced.
- /r/PeptideStacks — does not appear to exist as an active subreddit (no SERP results).

## Notes / gaps

- **Critical gap**: The two highest-signal targets — `/r/Peptides/wiki/index` and
  `/r/Peptidesource/wiki/index` — are both **wiki pages requiring auth**.
  `r.jina.ai` proxy returns 403 with a Reddit network-security message, and
  `web.archive.org` is unreachable from this environment. Both wikis almost
  certainly contain the canonical "approved sources" list with verbatim domains;
  recovery requires a Reddit-authenticated fetch (Reddit OAuth app or session
  cookie) or Wayback-via-different-network.
- **Same gap on `/r/PeptideGuide/comments/12xx98d/rpeptideguide_approved_vendor_list/`** — the
  one explicitly named "Approved Vendor List" thread; body fetch blocked.
- **r/PeptidesForSale** — was named in the original primary-target list but
  did not surface in any SERP. Possibly deleted or banned (Reddit periodically
  takes down peptide-sales subs); the sub `r/Peptidesource` appears to have
  taken on most of that traffic.
- **r/saferpeptides** with `/comments/1l2k6y1/` is the **Finnrick** test-suggestion
  thread — high-signal but also wiki-walled at body level. We have it
  triangulated via finnrick.com/vendors (208 names harvested in Pass 1E
  surface_aggregators.md).
- **r/PeptideSupport `/1rpq7lj/` "Top 10 Best Peptide Companies After the Peptide
  Sciences Shutdown (2026)"** — the single highest-signal Pass-1B thread we
  identified, but body fetch blocked. Title alone confirms this is a
  post-shutdown (March 2026) ranked vendor list.
- **r/Biohack_Blueprint `/1p5kfr2/` "Where to Buy Quality Peptides in 2025:
  Vendor Spotlight"** — second-highest-signal recent thread (Nov 2025); body
  fetch blocked, title alone confirms vendor-list content.
- **r/PeptideProgress `/1qwp647/` "Trusted Vendors and Free Resources (Community
  Guide)"** — third-highest-signal thread; body blocked.
- **Vendor-run subreddits identified**: `/r/LimitlessBiotech` (Limitless
  Biotech-run), `/r/PureRawzResearch` (PureRawz-run, dismissed by Outliyr as "AI
  posts"), `/r/Peptidesource` (claimed as "official", possibly vendor-run per
  https://www.reddit.com/r/Peptidesource/comments/1f5yj1f/ "Is this subreddit
  run by a vendor?"). These need to be flagged as potentially astroturfed in
  later vendor-evaluation passes.
- **Domain inference confidence is mixed** for Tier B vendors. Where the
  Reddit thread snippet did not surface the actual domain, the domain is
  marked "(inferred)" — this means: I matched the brand name to the obvious
  .com/.is/.co domain that aggregator surfaces (Outliyr, Finnrick,
  PeptideDeck) confirm. Operator should treat inferred domains as
  needing-confirmation, not verified.
- **No new looksmaxxing-sub vendor names surfaced.** That community references
  peptides (e.g. melanotan, GHK-cu) but does not maintain vendor lists in any
  thread that surfaced via SERP.
- **Two domain-fetch blockers worth noting for replication**: Anthropic
  WebFetch refuses old.reddit.com / np.reddit.com / i.reddit.com /
  web.archive.org / startpage.com outright. DuckDuckGo HTML works for ~5–10
  queries before CAPTCHA. Brave search HTML works for ~3–4 queries before
  HTTP 429. Plan for cooldown windows (~5–10 min) between Brave bursts in
  future passes.
