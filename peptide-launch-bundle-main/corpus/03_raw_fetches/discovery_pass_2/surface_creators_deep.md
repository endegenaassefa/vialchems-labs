---
fetched_at: 2026-05-06
fetch_method: yt-dlp + curl + bash
surface: pass2c-creator-descriptions
agent: discovery_pass_2c (Pass 2C creator deep extract)
notes: yt-dlp installed via pip in this session. All YouTube descriptions extracted via `yt-dlp --skip-download --print description`. TikTok bios extracted via curl + grep on JSON-rendered profile pages. Linktree pages extracted via curl with browser-spoofed headers + Python __NEXT_DATA__ JSON walker (initial naive curl returned 85-byte stubs; adjusted UA + Referer fixed it). 216 raw artifact files saved.
---

# Pass 2C — Creator Description / TikTok Bio Deep Extract

## Tools used
- yt-dlp: **available** (v2026.03.17, installed via `pip install yt-dlp` at task start)
- curl: GET-only, browser UA + Referer header for linktree
- python3: HTML/JSON walker for linktree `__NEXT_DATA__` payload
- fallback: `curl + grep "shortDescription"` (not needed — yt-dlp worked for every video except one community-removed channel)

## Videos / handles processed

### YouTube watch pages (descriptions extracted in full)
- https://www.youtube.com/watch?v=ia0qXSVU1oI — extracted — 2 vendor URLs (Can Lab Sciences, Limitless Life Nootropics) + code Biohacked15
- https://www.youtube.com/watch?v=7NZNNpLzB_A — extracted — DrMoeller linktr.ee linkout, no direct vendor in this descrip (signal lives in linktree)
- https://www.youtube.com/watch?v=g-W8DIdtBRs — extracted — InfiniWell BPC-157 + RP20 code via regenerativeperformance.com
- https://www.youtube.com/watch?v=k09KmNp66cg — extracted — full Vigorous Steve affiliate stack (Gorilla Mind, Intelligent Shop, Marek Health, Marek Diagnostics, iHerb)
- https://www.youtube.com/watch?v=W1cTqyvDlBg — extracted — same Vigorous Steve stack on latest video, confirms still-live codes
- https://www.youtube.com/watch?v=tDTKhTIl0Hk — extracted — Leo and Longevity affiliate stack (LA Pump, Nurosym, CosmicNootropic)
- https://www.youtube.com/watch?v=Kfz_9xDyjL4 — extracted — Gary Brecka's full 16-partner stack including PEPTUAL TUH10
- https://www.youtube.com/watch?v=TPNkwrCwSRU — extracted — **NEW**: BioLongevity Labs code "BPak" 15% (Ben Pakulski)
- https://www.youtube.com/watch?v=TYArMpP3BQ8 — extracted — biolongevitylabs.com confirmed
- https://www.youtube.com/watch?v=Sap0rpYWTUE — extracted — Jay Campbell affiliate, no direct code (talk-show format)
- https://www.youtube.com/watch?v=ioQ1cvndrgA — extracted — Greg Doucette → transcendcompany.com/coachgreg + HTLT
- https://www.youtube.com/watch?v=qTcVGtmC9EY (latest Greg Doucette) — extracted — **NEW**: algorx.ai code "Greg" 10% off "lab tests and medications"
- https://www.youtube.com/watch?v=9uaQivbRJCg — extracted — algorx.ai again
- https://www.youtube.com/watch?v=Y7UTexhX3JM — extracted — algorx.ai again
- https://www.youtube.com/watch?v=DVo0hD-m7VM — extracted — HTLT code "ERIC" (Eric Janicki)
- https://www.youtube.com/watch?v=OjrtoO5JQp4 (latest MPMD Derek) — extracted — full MPMD code stack: gorillamind.com/derek, intelligent.shop/derek (code MPMD 10% off)
- https://www.youtube.com/watch?v=Y3lm2sB-zH4 — extracted — same MPMD stack
- https://www.youtube.com/watch?v=ve3PbGCs-yc — extracted — same MPMD stack
- https://www.youtube.com/watch?v=VJmSiWHSE6o — extracted — same MPMD stack
- https://www.youtube.com/watch?v=x40JEV0A5cY — extracted — same MPMD stack
- https://www.youtube.com/watch?v=hkNsQAY_z1A (Connor Murphy) — extracted — looksmaxxing satire, no vendor
- https://www.youtube.com/watch?v=-6zHEFszdRw (Connor Murphy "Bigger Stronger Longer") — extracted — **NEW**: Enhanced Labs (PLUS), Next Chems (PLUS), SwissChems (PLUS) + Tony Huge collab
- https://www.youtube.com/watch?v=B2d4QyNt97Y (Connor Murphy) — extracted — minor signal
- https://www.youtube.com/watch?v=lI4am0U49N4 (Peptide Critic latest) — extracted — peptidecritic.com/store
- https://www.youtube.com/watch?v=5Hw4ND_--Ws — extracted — Certified-Pep https://Certified-pep.com, Prime Lab https://primelabpeptides.com/, **NEW**: Pure Lab Peptides https://purelabpeptides.com/
- https://www.youtube.com/watch?v=MsXknz5azkA — extracted — **NEW**: Warrior Makers https://warrior-makers.com (Spa and Tell, code NK)
- https://www.youtube.com/watch?v=HOgbD1kdgrE — extracted — Spa and Tell again, blog at naturalkaos.com
- https://www.youtube.com/watch?v=LtPbEW9zPNg — extracted — RevitalyzeMD, no peptide vendor in description
- https://www.youtube.com/watch?v=_c8eMtNePu0 — extracted — RevitalyzeMD, melanotan content
- https://www.youtube.com/watch?v=hL_dQCsWZgQ — extracted — **NEW**: Ergopep https://Ergopep.com (older 2013 video, may be defunct)
- https://www.youtube.com/watch?v=jOm692bfR9M — extracted — limitlesslifenootropics.com?ref=mdi2zgn (affiliate link)
- https://www.youtube.com/watch?v=p1CnfTzK5tQ — extracted — Josh Holyfield, peptide-supply-chain expose, no direct vendor named
- https://www.youtube.com/watch?v=XybdF6tlTKw — extracted — **NEW**: NP LABS https://admin.nplabs.online, sells PEPTIDES with affiliate-style link, code 5% off (Greg Doucette adjacent channel)
- https://www.youtube.com/watch?v=DUwmYRCL6D8 (Lyle McDonald) — extracted — store.bodyrecomposition.com (his own products) — NOT a peptide vendor
- https://www.youtube.com/watch?v=OPdTsPHJOiY (transcendcompany) — extracted — shop.transcendcompany.com
- https://www.youtube.com/watch?v=oKoxG06hPS0 — extracted — same
- https://www.youtube.com/watch?v=TeO8BHtIdbc — extracted — same
- https://www.youtube.com/watch?v=fZRwiBy2gc4 — extracted — same
- https://www.youtube.com/watch?v=lih1KCgdXfM (Peptidesco) — extracted — Russian-language Khavinson research (out of US scope)
- ~50 other videos (full inventory in raw/yt_*.txt)

### YouTube — failed extractions
- https://www.youtube.com/watch?v=uzlIoVC5-uE — "Video unavailable" (deleted by uploader)
- https://www.youtube.com/channel/UCHKwFP3bZwPJTqKXkF4cMOA (Connor Murphy "Natty+ Protocol") — **CHANNEL REMOVED for Community Guidelines violation**. Important finding — primary Natty+ creator-channel is dead; their content lives on TikTok @nattyplusprotocol now.
- https://www.youtube.com/@LimitlessBiotech/videos — "This channel does not have a videos tab" (channel exists but is dormant)
- https://www.youtube.com/@thepeptideguy/videos — channel listing 404 (the @ alias doesn't resolve a video tab); content reachable via custom URL.

### TikTok bios harvested
- @nathanbaarss — "BASED CODE: nathan" → bio link linktr.ee/nathanbaarss → resolves to **basedbodyworks.com** (NEW vendor candidate, code NATHAN 10%)
- @garybreckaofficial — sig "The Official TikTok Account of Gary Brecka" → bioLink link.me/garybrecka (linkout aggregator)
- @noahjay — sig "23 Detroit ✈️ CALI Singer/songwriter" — NOT a peptide creator (different Noah Jay than the one referenced in Pass 1; that handle was a misattribution)
- @coachgregtiptok — sig "RUTHLESSLY Seeking TRUTH in Health" → bioLink htltsupps.com (Greg Doucette's own brand)
- @moreplates — sig "Derek/MPMD\nOwner: 🧠 @Gorilla Mind | 💡 @intelligent.shop | 🥼 @MarekHealth" — confirms ownership of all three brands
- @leoandlongevity — sig "Legacy Account ♥️" (Leo died, account memorialized)
- @josh_holyfield — no signature/bioLink visible in JSON
- @revitalyzemd — sig "🏆 2025 Inc. 5000" → bioLink linktr.ee/revitalyzemd
- @transcend.hrt — sig "Personalized Telehealth Care" → bioLink linktr.ee/Transcend.Company.hrt
- @thepeptideguy — no extractable signature in JSON; main signal lives on linktr.ee/ThePeptideGuy
- @peptidecritic — sig "PeptideCritic.com Independent, community-driven research reviews"
- @misha_tsoi — sig "Блаблабла" (no vendor signal)
- @clavicular — no signature
- @nattyplusprotocol — sig "The Midddle Way between Natural and Not\n📄⬇️ Natty Plus Cheat Sheet ⬇️ 📄" → bioLink Google Doc (extracted full vendor cheat sheet — see below)
- @elonmuskular_ — sig "Christian Duarte\nThe Hybrid Athlete\nTeam BPN" — no peptide vendor in bio
- @tony.huge — empty signature in JSON

### Linktree pages parsed (Python __NEXT_DATA__ walker)
- linktr.ee/MorePlatesMoreDates (Derek MPMD) — parsed
- linktr.ee/dr.michaelmoeller (DrMoe) — parsed (high-yield)
- linktr.ee/jaycampbell333 — parsed (high-yield)
- linktr.ee/biolongevitylabs — parsed
- linktr.ee/lvluphealth (LVLUP Health own linktree) — parsed (full product line)
- linktr.ee/CoachGreg — parsed (mostly Kids Sports business links — different "Coach Greg")
- linktr.ee/connormurphy — parsed (only points back to itself; bare profile)
- linktr.ee/syrianpsycho (K. Shami / @syrianpsych0) — parsed → ascendlabs.store, mogwarts.net
- linktr.ee/ThePeptideGuy — parsed (originlabsresearch + edenscientific codes)
- linktr.ee/transcendcompany — parsed
- linktr.ee/Transcend.Company.hrt — parsed → transcendcompany.com/collections/supplements
- linktr.ee/ultimatehuman — parsed (10x Health Network supplements)
- linktr.ee/nathanbaarss — parsed → **basedbodyworks.com** confirmed
- linktr.ee/revitalyzemd — parsed (Berkeley Life NO booster)
- linktr.ee/limitlessbiotech — parsed (sparse; private telegram channel)

### Linktree pages where the user-supplied handle does not resolve (404 / empty redirect)
- linktr.ee/drdebradurst, linktr.ee/peptual, linktr.ee/peptidecritic, linktr.ee/peptideguy, linktr.ee/peptideprofessor, linktr.ee/genxbio, linktr.ee/josh_holyfield, linktr.ee/limitlesslifenootropics — all returned 6904-byte error stubs (these are not the canonical linktree handles for these creators, or the creator does not use linktree)

## Vendor + discount-code mappings (verbatim from descriptions / linktree)

| Creator | Vendor | Domain | Code | Source URL (verbatim) |
|---------|--------|--------|------|-----------|
| Project Biohacked Jeff Robinson | Limitless Life Nootropics | limitlesslifenootropics.com | Biohacked15 | https://www.youtube.com/watch?v=ia0qXSVU1oI |
| Project Biohacked Jeff Robinson | Can Lab Sciences | (URL not in description) | Biohacked15 | https://www.youtube.com/watch?v=ia0qXSVU1oI |
| Vigorous Steve | Gorilla Mind | gorillamind.com/vigorous | VIGOROUS (10%) | https://www.youtube.com/watch?v=k09KmNp66cg, =W1cTqyvDlBg |
| Vigorous Steve | Intelligent Shop | intelligent.shop/vigorous | VIGOROUS (10%) | same |
| Vigorous Steve | Marek Health | marekhealth.sjv.io/xLx3LA | VIGOROUS (10%) | same |
| Vigorous Steve | Marek Diagnostics | marekdiagnosis.pxf.io/AgP5Ex | VIGOROUS (10%) | same |
| Vigorous Steve | iHerb | iherb.prf.hn/l/p3jlQOk/ | VIGOROUS or DTV967 (5%) | same |
| Vigorous Steve | Anabolic Pharmacist | anabolicpharmacist.to | VIGOROUS (10%) | https://vigoroussteve.com/the-ultimate-ctrlf-source-list/ |
| Vigorous Steve | Anabolic Pharmacist Bulk Peptide Warehouse | (subpath) | VIGOROUS (10%) | same |
| Vigorous Steve | Omegamino | omegamino.net | VIGOROUS (10%) | same |
| Vigorous Steve | Soma Chems (Amino Asylum) | somachems.com | VIGOROUS (20%) | same |
| Vigorous Steve | Amino Tech (Amino Asylum) | aminotech.shop | VIGOROUS (15%) | same |
| Vigorous Steve | Canadian Peptides | canadianpeptides.ca | VIGOROUS (10%) | same |
| Vigorous Steve | Disguised Research | disguisedresearch.shop | VIGOROUS (10%) | same |
| Vigorous Steve | Official Beligas Pharmacy | beligaspharmacy.biz | VIGOROUS (10%) | same |
| Vigorous Steve | 5AR Society | 5arsociety.com | VIGOROUS (5%) | same |
| Vigorous Steve | Stada Labs RX | (proton email) | VIGOROUS (5%, via stadaxvigorous@proton.me) | same |
| Vigorous Steve | PCT Mart | pctmart.com | VIGOROUS (10%) | same |
| Vigorous Steve | RU Pharma | rupharma.com | VIGOROUS5 (5%) | same |
| Derek MPMD | Gorilla Mind | gorillamind.com/derek | MPMD (10%) | https://www.youtube.com/watch?v=OjrtoO5JQp4 (latest), linktr.ee/MorePlatesMoreDates |
| Derek MPMD | Intelligent Shop | intelligent.shop/derek | MPMD (10%) | same |
| Derek MPMD | Marek Health | bit.ly/2wI3k9J | MPMD (10%) | same |
| Derek MPMD | "Best Hair Loss Prevention Shampoo" | bit.ly/3pXu5UB | MPMD (10%) | same |
| Derek MPMD | Intelligent Minoxidil | bit.ly/3owib2i | MPMD (10%) | same |
| Derek MPMD | "Fitness & Lifestyle Clothing" (YoungLA) | bit.ly/4dmGKqW | MPMD (15%) | same |
| Gary Brecka (Ultimate Human) | Peptual | bit.ly/4mKxgcn | TUH10 (10%) | https://www.youtube.com/watch?v=Kfz_9xDyjL4 |
| Gary Brecka | H2TABS | bit.ly/4hMNdgg | ULTIMATE10 (10%) | same |
| Gary Brecka | BodyHealth | bit.ly/4e5IjsV | ULTIMATE20 (20%) | same |
| Gary Brecka | Baja Gold | bit.ly/3WSBqUa | ULTIMATE10 (10%) | same |
| Gary Brecka | AION | bit.ly/4h6KHAD | ULTIMATE10 (10%) | same |
| Gary Brecka | A-Game | bit.ly/4kek1ij | ULTIMATE15 (15%) | same |
| Gary Brecka | Caraway | bit.ly/3Q1VmkC | ULTIMATE (10%) | same |
| Gary Brecka | Rho Nutrition | bit.ly/44fFza0 | ULTIMATE15 (15%) | same |
| Ben Pakulski (re Jay Campbell) | BioLongevity Labs | biolongevitylabs.com | BPak (15%) | https://www.youtube.com/watch?v=TPNkwrCwSRU |
| Eric Janicki | HTLT Supplements | htltsupps.com | ERIC | https://www.youtube.com/watch?v=DVo0hD-m7VM |
| Greg Doucette | Transcend Company | transcendcompany.com/coachgreg | (no code in desc) | https://www.youtube.com/watch?v=ioQ1cvndrgA |
| Greg Doucette | algorx.ai (labs + meds) | algorx.ai | Greg (10%) | https://www.youtube.com/watch?v=qTcVGtmC9EY, =9uaQivbRJCg, =Y7UTexhX3JM (across his last 5 videos) |
| Greg Doucette | HTLT Supplements | htltsupps.com | (own brand) | same |
| Drew Timmermans / Regenerative Performance | InfiniWell BPC-157 | regenerativeperformance.com/supplements | RP20 (20%) | https://www.youtube.com/watch?v=g-W8DIdtBRs |
| Lester | vitaminversand24 | (German aggregator) | LESTER (10%) | https://www.youtube.com/shorts/QBt1As2rkDc (out of US scope) |
| Spa and Tell (Kim @ NaturalKaos) | Warrior Makers | warrior-makers.com/code/NK | NK (per URL slug) | https://www.youtube.com/watch?v=MsXknz5azkA |
| Lucie (Leo and Longevity) | LA Pump | lapump.com | LONGLEO (10%) | https://www.youtube.com/watch?v=tDTKhTIl0Hk |
| Lucie | Nurosym | nurosym.com | LucieC5 | same |
| Lucie | CosmicNootropic | cosmicnootropic.com?coupon-code=319 | LUCIE (10%) | same |
| Connor Murphy | Enhanced Labs | enhancedlabs.com/?ref=Do7P0F5-E_wlsC | PLUS | https://www.youtube.com/watch?v=-6zHEFszdRw |
| Connor Murphy | Next Chems | nextchems.com/ref/12 | PLUS | same + https://docs.google.com/document/d/1UM7tL5WuReSXY7NRtOOc82zFCPTqwMp9-Kj_yuZvrQo (Natty+ Cheat Sheet) |
| Connor Murphy | Swiss Chems | swisschems.is/ref/1605 | PLUS | same |
| Dr. Michael Moeller | LVLUP Health | lvluphealth.com/?ref=DrMoe | DrMoe15 | linktr.ee/dr.michaelmoeller (link title: "Peptide Combos | Use Code DrMoe15 for discount") |
| Dr. Michael Moeller | Gorilla Mind | gorillamind.com/DRMOE | DRMOE (10%) | same (link title: "Workout Supplements I Use Code DRMOE 10% OFF") |
| Dr. Michael Moeller | Private MD Labs | privatemdlabs.com?partnerid=S6588 | DRMOE15 (15%) | same (link title: "Book blood testing on Private MD Labs | 15% off code DRMOE15") |
| Dr. Michael Moeller | CosmicNootropic | cosmicnootropic.com?coupon-code=512 | DrMoe (10%) | same (link title: "Cosmic Nootropic | Use Coupon Code: DrMoe 10% off") |
| Dr. Michael Moeller | Troscriptions (methylene blue troches) | bit.ly/4hoBB1N | DRMOE | same |
| Dr. Michael Moeller | InfiniWell BPC | bit.ly/3UxXMc2 | (no code, affiliate link) | same |
| Jay Campbell | BioLongevity Labs | biolongevitylabs.com | (page recommends, no explicit code on jay-recommends page) | https://jaycampbell.com/jay-recommends/ |
| Jay Campbell | Nutrition Solutions | (linked on Jay Recommends) | JAYC (20%) | same |
| Jay Campbell | Private MD Labs | (link on Jay Recommends) | JayC (15%) | same |
| Jay Campbell | N1O1 / NO2U | n1o1.com / no2u.com | JAYC (10%) | same |
| Jay Campbell | Oxford Healthspan (Primeadine) | (link on Jay Recommends) | JAY15 (15%) | same |
| Jay Campbell | MyVitalC | (link) | $35 off | same |
| Jay Campbell | BioStack Labs | (link) | (no code in copy) | same |
| Jay Campbell | Calocurb | (link) | (no code in copy) | same |
| Jay Campbell | Bimini Hydrotherapy | (link) | (no code in copy) | same |
| Jay Campbell | Trifecta Light | (link) | (no code in copy) | same |
| Jay Campbell | Blushield (EMF) | (link) | (no code in copy) | same |
| Jay Campbell | The Peptides Course | thepeptidescourse.com | (own info product) | linktr.ee/jaycampbell333 |
| Jay Campbell | TOT Decoded course | totdecoded.com | (own info product) | same |
| The Peptide Guy (Noah Sailer) | Origin Labs Research | originlabsresearch.com | TPG10 (10%, "GLOBAL SHIPPING") | linktr.ee/ThePeptideGuy |
| The Peptide Guy | Eden Scientific | edenscientific.com | TPG (10%, "US Peptides") | same |
| Spa and Tell / NaturalKaos | Maysama LED Belt | (urlgeni.us redirect) | NKAOS10 | https://www.youtube.com/watch?v=HOgbD1kdgrE |
| Spa and Tell | DR PEN MS / DR PEN USA | drpen-usa.com | KAOS10 / KAOS15 | same |
| Spa and Tell | Channel Pro Pen | (urlgeni.us) | KAOS25 | same |
| Spa and Tell | Laduora Lumeo | laduora.com | KAOS15 | same |
| Spa and Tell | Lumara LED Mask | lumarasystems.com/KAOS50 | KAOS50 ($50 off) | same |
| Spa and Tell | Makeup Artists' Choice (peels) | makeupartistschoice.com | KAOS20 | same |
| TRT and Hormone Optimization (Greg Doucette adjacent) | NP Labs | admin.nplabs.online (affid=2a38a4a9316c49e5a833517c45d31070) | (5% off via affiliate link, no manual code) | https://www.youtube.com/watch?v=XybdF6tlTKw |
| Mike Israetel (RP) | Versagripps Hyperbelt | versagripps.com/products/hyperbelt | DRMIKE10 | (across many RP videos) |
| Lyle McDonald | Body Recomposition (own store) | store.bodyrecomposition.com | mikehasnotan (10%) | https://www.youtube.com/watch?v=DUwmYRCL6D8 (NOT a peptide vendor — own info products) |
| Thomas DeLauer | SEED probiotic | seed.com/thomasyt | THOMAS25 (25%) | https://www.youtube.com/watch?v=12b9XkCzhb0 (NOT a peptide vendor) |
| Ryan Hanley (re Jay Campbell) | (no peptide vendor offered) | — | — | https://www.youtube.com/watch?v=TYArMpP3BQ8 |
| Bryan Johnson | Blueprint (own brand) | blueprint.bryanjohnson.com | (own product line — peptide hair serum, collagen) | (cross-pass) |

## Vendor candidates net-new vs Pass 1

These were **not** in Pass 1's surface_youtube_influencer.md vendor list. Each is anchored by verbatim creator-side evidence harvested in Pass 2C.

- **Pure Lab Peptides** — https://purelabpeptides.com/ — named in https://www.youtube.com/watch?v=5Hw4ND_--Ws Peptide Critic exposé "Pure Lab Peptides & Prime Lab Peptides Exposed" (alongside Prime Lab + Certified-Pep). Distinct vendor not in Pass 1.
- **BasedBodyWorks** — https://basedbodyworks.com/?ref=yystdtfe — Nathan Baarss linktree title "BASED CODE: NATHAN 10% OFF". Confirmed via TikTok bio "BASED CODE: nathan" → linktr.ee/nathanbaarss. Looksmaxxing-targeted; net-new.
- **Origin Labs Research** — https://originlabsresearch.com — The Peptide Guy code "TPG10" 10% off, "GLOBAL SHIPPING". Sister/preferred vendor of Eden Scientific.
- **Eden Scientific** — https://edenscientific.com — The Peptide Guy code "TPG" 10% off, "US Peptides".
- **Warrior Makers** — https://warrior-makers.com/ — Spa and Tell Melanotan vendor; UK + Canada shipping noted; code path /code/NK.
- **Ergopep** — https://Ergopep.com — Bios3Training "Peptides Source!!!!!" video (Aug 2013). Older mention; status unverified.
- **algorx.ai** — https://algorx.ai — Greg Doucette current preferred "labs + medications" platform; code "Greg" 10%. Self-described "performance medicine" telehealth (medications + labs). Sells GLP-1 + ancillaries; would need a peptide-product check to confirm peptide listing, but Greg's audience demand vector is peptide-adjacent.
- **NP Labs** — https://admin.nplabs.online (affid=2a38a4a9316c49e5a833517c45d31070) — explicitly markets "PEPTIDES" alongside testosterone, DHEA, tadalafil; Greg Doucette adjacent TRT and Hormone Optimization channel. 5% first-order via affiliate link.
- **Enhanced Labs** — https://enhancedlabs.com/?ref=Do7P0F5-E_wlsC — Connor Murphy + Tony Huge + Elon Muskular; code PLUS. Distinct from "Enhanced Athlete" (defunct/criminal); current operator.
- **Next Chems** — https://nextchems.com/ref/12 — Connor Murphy / Natty+ Protocol; code PLUS; sells Tadalafil, Retatrutide, RU58841, MK-677, GW501516, etc. Per Natty+ Cheat Sheet — direct vendor referral path.
- **Bimini Hydrotherapy** — referenced on Jay Campbell's "Jay Recommends"; oxygen therapy device, NOT a peptide vendor (excluded from candidate list but flagged for the brand-cluster dedup).
- **Calocurb** — referenced on Jay Recommends; tirzepatide-alternative oral capsule supplement (botanical). Not a research peptide vendor; flag as adjacent.
- **BioStack Labs** — referenced on Jay Recommends; "longevity supplements"; not a research peptide vendor in strict sense. Flag adjacent.
- **MyVitalC** — referenced on Jay Recommends; carbon-60 antioxidant; flag adjacent.
- **Trifecta Light** — referenced on Jay Recommends; 450 PRO LED bed; not peptide.
- **Blushield** — referenced on Jay Recommends; EMF protection; not peptide.
- **N1O1 / NO2U** — n1o1.com, no2u.com — Jay Campbell affiliate, code JAYC 10%; nitric oxide booster; not peptide vendor strictly but adjacent supplement.
- **Oxford Healthspan (Primeadine)** — Jay Campbell code JAY15 15%; spermidine; not peptide.
- **Nutrition Solutions** — Jay Campbell code JAYC 20%; meal delivery; not peptide.
- **The Peptides Course** — https://www.thepeptidescourse.com/ — Jay Campbell paid info product (course, not vendor).
- **TOT Decoded** — https://www.totdecoded.com/ — Jay Campbell paid info product (course on testosterone optimization).
- **fullyoptimizedhealth.com** — Jay Campbell premium coaching group ($/membership), referenced on linktr.ee/jaycampbell333.
- **mogwarts.net** — Syrian Psycho (K. Shami) facial-rating + community service; not a peptide vendor.
- **ascendlabs.store** — Syrian Psycho's "MY SUPPLEMENTS" linktree primary; appears to be his own brand storefront. Domain returned 200 OK. Should be checked downstream for peptide product line.
- **Origin Labs Research vs originlabs.com** — verify these are distinct domains; the domain originlabsresearch.com appears net-new to the universe.
- **HTLT Supps** — htltsupps.com — Greg Doucette + Eric Janicki own/affiliate; protein, supplements; not a peptide vendor.
- **Peptide Critic store** — https://peptidecritic.com/store — sells research supplies (pens, filters, vials), NOT peptides themselves.
- **Connor Murphy / Natty+ Cheat Sheet vendor refs** — confirmed Connor Murphy steers Natty+ audience to swisschems.is + nextchems.com via /ref/1605 + /ref/12 partner codes (not just generic affiliate, deep-product cherry-picked links). This re-anchors SwissChems and NextChems with extra creator evidence beyond Pass 1.

## Failed extractions

- https://www.youtube.com/watch?v=uzlIoVC5-uE — Video unavailable (uploader-deleted).
- https://www.youtube.com/channel/UCHKwFP3bZwPJTqKXkF4cMOA — **Connor Murphy "Natty+ Protocol" channel was REMOVED for violating YouTube Community Guidelines.** Important enforcement / reputational signal — this was the highest-volume Natty+ creator surface and is now wiped from YouTube. Their content has migrated to TikTok @nattyplusprotocol + Connor Murphy's main channel + a Google Doc cheat sheet.
- https://www.youtube.com/@LimitlessBiotech/videos — channel exists but has no Videos tab; vendor-operated dormancy. About-page extraction also empty.
- https://www.youtube.com/@thepeptideguy/videos — alias does not resolve (handle clash). Content reachable via linktr.ee/ThePeptideGuy + thepeptideguyy.com.
- https://snipfeed.co/connormurphy — "store under construction" (Connor Murphy snipfeed deactivated).
- https://direct.me/nattyplusprotocol — Cloudflare challenge ("Enable JavaScript and cookies to continue"). Did not bypass.
- linktr.ee/drdebradurst, linktr.ee/peptual, linktr.ee/peptidecritic, linktr.ee/peptideguy, linktr.ee/peptideprofessor, linktr.ee/genxbio, linktr.ee/josh_holyfield, linktr.ee/limitlesslifenootropics — all returned 6904-byte error stubs. These are not the actual handles in use by these creators (they may use sites other than Linktree).
- TikTok bio extraction failed on @clavicular, @noahjay (different person than Pass 1 referenced), @misha_tsoi (no vendor signal in bio — just a Russian phrase), @josh_holyfield (no signature in JSON), @thepeptideguy (no signature in JSON), @tony.huge (empty signature).
- Google Doc fetch (`docs.google.com`) returned a JS-required stub but the URL list embedded in the HTML revealed all the inline links (swisschems.is/ref/1605, nextchems.com/ref/12, enhancedlabs.com refs, etc.) — sufficient to extract the vendor cheat sheet without rendering.
- Vigorous Steve's source list (`vigoroussteve.com/the-ultimate-ctrlf-source-list/`) — fetched 598KB OK, all 18+ vendor codes confirmed. No new codes beyond Pass 1's harvest.

## Top 5 verbatim discount-code mappings (highest signal)

1. `Save 15% at Biolongevity Labs with code "BPak"!` — Ben Pakulski / Muscle Intelligence Podcast — https://www.youtube.com/watch?v=TPNkwrCwSRU. **NEW code** for BioLongevity Labs (Pass 1 only had JayC).
2. `For affordable lab tests and medications delivered to your door: CODE Greg 10% Off https://algorx.ai` — Greg Doucette repeats this exact line in his last 3+ videos (qTcVGtmC9EY, 9uaQivbRJCg, Y7UTexhX3JM). NET-NEW vendor: algorx.ai.
3. `Buy Peptides | GLOBAL SHIPPING | "TPG10" - 10% Discount` → https://originlabsresearch.com / `US Peptides - "TPG" - 10% Discount` → https://edenscientific.com — The Peptide Guy linktree.
4. `Peptide Combos | Use Code "DrMoe15" for discount` → https://lvluphealth.com/?ref=DrMoe — Dr Michael Moeller linktree (anchor for the Pass 1 "DrMoe15" claim that was sourced from search snippets).
5. `💊Enhanced Labs💊 (Code: PLUS) https://enhancedlabs.com/?ref=Do7P0F5-E_wlsC ... 🧪Next Chems🧪 and 🧪SwissChems🧪 (Code: PLUS)` — Connor Murphy "Bigger Stronger Longer" video. Triple-vendor PLUS code anchor for Connor Murphy + Tony Huge + Natty+ Protocol cluster.

## Cross-surface notes for the dedupe agent

- **The Natty+ Protocol creator cluster is one operator with multiple front-ends.** Connor Murphy + Tony Huge + Elon Muskular + Natty+ Protocol all push the same `Code: PLUS` to SwissChems + NextChems + Enhanced Labs. The Natty+ Cheat Sheet (Google Doc) cherry-picks specific products with `/ref/1605` (swisschems) and `/ref/12` (nextchems) parameters — i.e. Connor Murphy IS affiliate ID 1605 on SwissChems and ID 12 on NextChems.
- **Peptual / Ultimate Human (Gary Brecka)** — Brecka's TUH10 code threads across his entire 16-partner stack (peptides + non-peptides). Treat Peptual as the only peptide-relevant entry.
- **Greg Doucette pivoted vendors.** The 2024 "TIER LIST PEPTIDE EDITION" video sent traffic to transcendcompany.com/coachgreg, but his last 5 videos (May 2026) all push **algorx.ai** with code "Greg". This is a meaningful migration — Pass 1 flagged the Transcend connection as "uncertain"; Pass 2C confirms Transcend used to be the relationship and algorx.ai is the current one. Marek Health-style pattern: Greg may now be on algorx's affiliate / co-founder structure rather than Transcend.
- **Connor Murphy's Natty+ Protocol YouTube channel was removed by YouTube for Community Guidelines violation.** This is the single most consequential platform-enforcement signal in this pass — the entire YouTube creator-side of the Natty+ Protocol ecosystem has been deplatformed. They have rerouted to TikTok + Google Doc + Connor's main channel.
- **Peptide Critic + Pure Lab Peptides + Prime Lab Peptides + Certified-Pep** form a "fake COA" cluster that Peptide Critic the platform calls out by name. Useful for the "scam vs legit" dimension.
- **Dr. Michael Moeller IS the "DrMoe" code** referenced in Pass 1's lvluphealth code. His linktree formalizes the relationship: he's an affiliate channel for LVLUP, Gorilla Mind (DRMOE), Private MD Labs (DRMOE15), Cosmic Nootropic (DrMoe), Troscriptions (DRMOE).
- **Vigorous Steve's source list is now confirmed as the canonical 18-vendor "VIGOROUS"-code aggregator.** No new vendors discovered beyond Pass 1's enumeration. Stable.
- **Gary Brecka's bioLink** points to link.me/garybrecka (link.me is a TikTok-native linkout — distinct from Linktree). May be worth a separate fetch in a future pass for additional vendor coverage.
- **"Noah Jay" disambiguation**: the @noahjay TikTok handle is a singer/songwriter from Detroit, NOT the looksmaxxing peptide creator referenced in Pass 1. Pass 1's reference may have been a misattribution; the actual looksmaxxing handle is unconfirmed and should be re-derived from the Pass 1 source.
- **Khavinson / Peptidesco / @Peptidesco** is a Russian-language scientific community for bioregulator research (St. Petersburg Institute of Phthisiopulmonology). Out of US research-peptide-vendor scope; should be excluded from the vendor universe.

## Raw artifacts saved

All raw artifacts at `/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/03_raw_fetches/discovery_pass_2/raw/`:
- `yt_<videoid>.txt` — yt-dlp print output (94 video files)
- `linktree_<handle>.txt` — full linktree HTML (21 files)
- `tiktok_<handle>.txt` — full TikTok profile JSON+HTML (15 files)
- `vigoroussteve_sourcelist.txt` — full Vigorous Steve Ctrl+F page (598KB)
- `jay_recommends.txt` — full Jay Campbell recommendation page
- `transcend_coachgreg.txt` — Transcend Greg Doucette page
- `algorx_homepage.txt` — algorx.ai homepage
- `warriormakers_nk.txt` — Warrior Makers /code/NK landing page
- `nplabs_register.txt` — NP Labs patient registration page
- `regenerativeperformance.txt` — Drew Timmermans clinic supplement page
- `natty_cheat_sheet.txt` — Natty+ Protocol Google Doc (581KB, JS-rendered stub but with all inline URLs visible)
- `directme_nattyplusprotocol.txt` — Cloudflare challenge stub (Cloudflare-blocked)
- `snipfeed_connormurphy.txt` — Connor Murphy snipfeed (deactivated)
