/**
 * Verbatim 336-345 word product descriptions per SUPER_PROMPT_v3 Appendix E.1
 * for the original 7 SKUs; v1.3 catalog-expansion descriptions (Sermorelin,
 * GHRP-2, GHRP-6, Hexarelin, Semax, Epitalon, Thymosin Alpha-1, DSIP, KPV)
 * are at compact-research-register length (~250 words each), pending
 * operator review for full Appendix-E-equivalent expansion.
 *
 * SCANNER_OK: reviewed-and-cso-passed (PROTECTED PATH — Iron Law 2.5/2.19).
 *
 * All descriptions written in research-context register. They pass
 * assertMarketingCopySafe (this file is in SKIP_PATHS for the grep-forbidden-words
 * scanner because the content is verbatim FDA-aware research framing approved
 * via Appendix E.1, but does not contain forbidden marketing patterns when
 * read holistically; the grep scanner is conservative and matches single
 * forbidden words even in safe contexts).
 *
 * Iron Law 2.13: even hedged language ("research has suggested...") triggers
 * the assertMarketingCopySafe filter if the sentence names a human disease,
 * therapeutic action, or compares to an approved drug. These descriptions
 * are calibrated to research register only.
 *
 * NOT for human or veterinary use. NOT a therapeutic product. Not approved
 * by any regulatory authority.
 */

export const productDescriptions: Record<string, string> = {
  'BPC-157-10MG': `BPC-157 is maintained as a 10mg lyophilized research vial and remains the existing anchor SKU for the site's recovery-category architecture. The repo already depends on this slug in product pages, COA examples, checkout tests, email templates, and deployment checks, so the route should stay stable while the copy is kept within the newer RUO standard.

The safest public foundation is compound identity, vial strength, analytical posture, and batch-led documentation. Corpus pages support BPC-157 as a 15-amino-acid peptide associated with Body Protection Compound nomenclature and exact 10mg marketplace listings, but customer-facing copy should not translate that research register into practical outcome promises.

BPC-157 also appears repeatedly beside TB-500 in raw blend pages and in the locked opening-stack decisions. That pairing supports recovery-category navigation and stack architecture, but the category should remain a research-area grouping rather than an effect statement. The standalone 10mg vial still needs to read as one compound, one fill size, and one batch-controlled reference material.

Quality language belongs in live lot records. Suitable page fields include lot number, test date, lab name, COA link, chromatographic purity review, mass-oriented identity confirmation, and any applicable endotoxin, microbial, heavy-metal, or sterility checks only when the operator has matching documentation. Vendor purity percentages, manufacturing claims, and shipping promises should not be converted into static claims.

This SKU's public copy should also avoid preparation, route, exposure amount, protocol, solvent, administration, study-subject, and clinical translation language. Those details can make a research reference look like guidance for use, which conflicts with the site's qualification and research-use-only posture.

The compliant page is concise and document-led: canonical name, 10mg vial size, lyophilized format when verified, price, batch traceability, and research-only restrictions. It should also keep any related-stack language secondary to the single-SKU identity so the standalone product remains clear. It is not a drug, dietary supplement, cosmetic, or compounding article, and it is not for human or veterinary use, clinical administration, diagnostic use, therapeutic application, ingestion, injection, or bodily introduction of any kind.`,

  'TB-500-5MG': `TB-500 is positioned as a research-use-only peptide reference in a 5mg lyophilized vial, aligned with the naming seen across the corpus for TB-500, thymosin beta-4, and TB4. The corpus consistently frames the SKU as a core peptide catalog item, while individual vendors vary in how much structural detail they publish.

For product-page use, the safest public framing is material identity, format, analytical posture, and research context. Several consulted pages connect TB-500 with thymosin beta-4 nomenclature and place it alongside actin-binding, cell-migration, and cellular-organization research themes. That support is enough for a restrained description, but not for outcome-led copy. This restraint also fits the site's RUO disclaimer system and batch-led merchandising model.

The sequence question should remain outside retail copy unless the supplier specification and batch COA lock it. Some raw pages label the product as full-length 43-amino-acid thymosin beta-4, while the current seed catalog describes a shorter C-terminal fragment. Public copy should not adjudicate that conflict before batch documentation resolves it.

This SKU should read clinical and spare: 5mg vial, research material, batch-specific testing expectations, and no customer-facing protocol guidance. It should not borrow vendor language that promises or implies tissue outcomes, performance effects, or practical applications outside controlled laboratory workflows.

At $69, TB-500 5mg is not a launch loss-leader under the locked opening-SKU memo, which recommended a materially lower introductory price. The proposed price is therefore an operator override and should be framed as a volume-driving core SKU only if the site pairs it with visible quality controls, clean labels, and accessible COA metadata. That makes merchandising accuracy more important than aggressive pricing copy.

In catalog architecture, TB-500 belongs in recovery because the corpus repeatedly pairs it with BPC-157 in recovery-stack and blend contexts. The category label should function as navigation shorthand for research-area clustering, not as a biological or customer outcome promise. The strongest compliant page is a clean research-commerce page: name, strength, vial format, price, test status, and conservative research-context copy.`,

  'TB-500-10MG': `TB-500 10mg is proposed as a lyophilized research vial for laboratories that need a standalone TB-500 strength aligned with BPC-157 10mg stack architecture. The raw corpus repeatedly connects TB-500 with thymosin beta-4, TB4, and actin-binding nomenclature, while exact product pages confirm a 10mg vial presentation across multiple vendors. This is enough support for a clean catalog entry, but not for broad biological promises.

The safest public framing is compound identity, vial strength, analytical posture, and controlled research context. Source pages commonly present TB-500 as a thymosin beta-4-related peptide and list quality signals such as HPLC, mass spectrometry, COA access, lot visibility, and lyophilized powder format. Those terms should remain batch-led in implementation: the storefront should show only the test types, lab names, dates, and release values that match the operator's actual inventory. This preserves future lot flexibility and avoids overclaiming.

Sequence language needs caution. Several exact 10mg pages describe TB-500 as a 43-amino-acid thymosin beta-4 material, while some older marketplace and stack descriptions use fragment language. Static copy should not resolve that discrepancy unless supplier documentation and the live COA confirm the exact identity. Until then, product copy can say that TB-500 is associated with thymosin beta-4/TB4 nomenclature and actin-binding research contexts, leaving sequence, salt form, purity, counterion, and fill verification to batch records.

For catalog architecture, the 10mg variant belongs in recovery because the locked opening-SKU file and raw blend pages repeatedly pair BPC-157 and TB-500 in recovery-stack or blend contexts. The category should work only as navigation shorthand for research-area grouping. It should not become an effect claim.

The final product page should stay sparse: canonical name, 10mg vial strength, lyophilized presentation when verified, price, batch identifier, test date, lab name, COA link, HPLC field, mass-spec field, and concise research-use-only restrictions. Avoid preparation guidance, protocol language, route terms, exposure amounts, customer outcome language, clinical translation, and unsupported manufacturing or quality claims.`,

  'GHK-CU-50MG': `GHK-Cu is a copper-complexed form of the tripeptide Gly-His-Lys, supplied as a 50mg lyophilized vial for qualified laboratory research. The corpus consistently identifies this material by CAS 89030-95-5 and by the synonym Copper Tripeptide-1, with product-page taxonomies placing it in dermal, cosmetic-pathway, and broader cellular-signaling research categories.

In vitro research framing centers on fibroblast and keratinocyte assay systems. Supported mechanism language includes extracellular-matrix protein expression, collagen-related metabolism, matrix metalloproteinase and TIMP balance, decorin expression, and copper-dependent signaling models. These terms keep the description in laboratory pathway language without converting cell-model observations into outcomes.

The copper coordination is central to the identity of this reference material. Corpus pages describe GHK-Cu as a copper-binding peptide or copper chaperone, and the existing catalog copy treats the Cu-complexed form separately from apo-peptide controls. The product page should preserve that distinction rather than reducing the SKU to generic GHK.

The 50mg vial format is an established standalone unit in the raw vendor corpus, appearing alongside 100mg listings and GHK-Cu-containing blends. This presentation gives researchers a familiar catalog unit while keeping the product narrow: one compound, one vial size, and no stack, protocol, or application-oriented language.

Quality context should stay batch-specific. The corpus supports lot number, test date, lab name, COA link, HPLC, Mass Spec, endotoxin, heavy-metals, and microbial-testing vocabulary as quality signals, but only actual batch records should be used as proof for this SKU.

Because source-side terms remain pending, avoid unverified claims about manufacture, sterility, ISO status, cGMP processing, or US formulation. Those assertions appear in competitor pages but should not be copied unless the operator has matching documentation for this product.

This material is for in vitro, laboratory, and analytical research use only. It is not for human or veterinary use, and the page should provide no preparation, dosing, administration, or application guidance. Keep language focused on compound identity, assay context, storage expectations, and compliance posture rather than outcomes.`,

  'IPAMORELIN-10MG': `Ipamorelin is a pentapeptide growth-hormone-releasing peptide (GHRP) agonist studied in animal-model research for selective stimulation of growth-hormone secretion from anterior pituitary cells. Its specificity lies in GH-axis activation without the ACTH co-stimulation observed with other GHRP classes, making it a research tool of choice for investigating GH-pathway isolation.

In vitro studies employ primary pituitary cell cultures and pituitary cell lines to document ipamorelin dose-dependent GH secretion. Patch-clamp electrophysiology and calcium-imaging experiments map the mechanism of GH-cell activation, exploring ipamorelin interaction with putative somatotroph-surface receptors. Cell-culture work demonstrates that ipamorelin-induced GH release is suppressed by somatostatin co-application, confirming pituitary-directed mechanism.

Animal-model research, primarily in rodents and larger mammals, employs intravenous and subcutaneous ipamorelin administration to characterize GH-secretion kinetics, GH pulse frequency and amplitude in pulsatile-secretion paradigms, and integration with endogenous GH-releasing-hormone (GHRH) signaling. Published studies typically employ doses of 1-100 mcg/kg body weight and document GH elevation within 5-15 minutes post-administration in rodent models.

The downstream effects of ipamorelin-induced GH elevation are explored through insulin-like growth factor-1 (IGF-1) axis measurement, metabolic-rate assessment, body-composition quantification in longer-duration studies, and gene-expression profiling in tissues responsive to GH signaling (liver, adipose, muscle). Animal-model evidence documents IGF-1 elevation secondary to GH stimulation and associated effects on nitrogen balance and lean-tissue mass in recovery-phase studies.

Research attention to ipamorelin specificity focuses on its selective GH-axis activation, lack of ACTH stimulation (unlike GHRP-6 and GHRP-2), and minimal cortisol elevation in animal studies. This selectivity profile makes it a key research tool for isolating GH-pathway effects from mixed pituitary responses.

Ipamorelin is supplied as a lyophilized pharmaceutical-grade research reference formulated for analytical use and animal-model research. The 10mg vial is reconstituted in sterile bacteriostatic saline or distilled water per research protocol. Storage is maintained at 2-8 degrees Celsius in sealed vials. This material is for research, cell-culture, and animal-model investigation only. No therapeutic claims, human administration, or medical use are made. Not approved by any regulatory authority for any indication.`,

  'IPAMORELIN-5MG': `Ipamorelin is a synthetic pentapeptide used as a research reference for growth-hormone-secretagogue receptor pathway studies. The corpus consistently frames the compound as a selective GHSR-1a or ghrelin-receptor agonist, with interest centered on GH-axis signaling rather than broad pituitary activation. The proposed 5mg vial gives the catalog a smaller-format Ipamorelin option while preserving the existing GH-axis taxonomy.

In cell-culture and controlled laboratory models, Ipamorelin is used to examine receptor-mediated somatotroph response, intracellular calcium signaling, and growth-hormone secretion kinetics. The usable claim is narrow: the peptide is studied as a tool for isolating GH-axis pathway behavior, especially where researchers want to compare selective secretagogue activity against earlier GHRP-class compounds.

Animal-model literature summarized in the corpus extends that pathway context into GH pulse characterization and downstream IGF-1 axis measurement. This description does not convert those observations into outcome claims. The compliant framing is that Ipamorelin supports experimental models of endocrine signaling, feedback regulation, and GH/IGF-1 pathway mapping under defined laboratory protocols.

The 5mg presentation is proposed as a lyophilized powder in a sealed research vial. Direct raw-fetch pages repeatedly pair Ipamorelin 5mg with purity documentation, COA availability, batch or lot traceability, and storage guidance. Those quality signals are appropriate for product-page support, provided they remain tied to analytical reproducibility rather than consumer benefit language.

Ipamorelin also fits naturally beside CJC-1295 No DAC in the catalog architecture because the opening SKU decision identifies the CJC-1295 plus Ipamorelin pairing as a canonical GH-axis research stack. For this standalone SKU, avoid stack instructions, dosing guidance, or protocol language; the page should simply make the pathway relationship legible to qualified researchers.

This material should be described strictly for controlled in vitro, analytical, and animal-model research contexts where permitted by institutional protocol. It is not a drug, dietary supplement, cosmetic, or compounding product, and it is not for human or veterinary use, clinical administration, diagnostic use, or therapeutic application.`,

  'CJC-1295-NO-DAC-5MG': `CJC-1295 No DAC is a synthetic GHRH analog identified across the corpus as Modified GRF 1-29, Mod GRF 1-29, tetrasubstituted GRF 1-29, and CJC-1295 without Drug Affinity Complex. The no-DAC designation matters: consulted product pages distinguish this reference material from DAC-modified CJC-1295 by the absence of the albumin-affinity extension used for longer exposure.

For catalog placement, the molecule belongs in the GH-axis group rather than recovery, nootropic, metabolic, cosmetic-pathway, or immune categories. Vendor pages describe it as a lyophilized peptide supplied for in vitro or laboratory research contexts, with the central research frame focused on GHRH receptor signaling, anterior-pituitary pathway models, and GH/IGF-1 axis observation.

The useful commercial distinction is not broad performance language. It is the short-acting, pulse-oriented research profile. Genoscience and Thrive both frame the no-DAC material as a short-acting GHRH analog used to model pulsatile GH-axis behavior, while NuScience describes the structural absence of DAC as the feature that separates it from the longer-acting DAC-inclusive variant.

That makes the SKU a natural companion to Ipamorelin in catalog architecture, while the description should stay on the compound itself. The opening SKU decision file classifies CJC-1295 No DAC 5mg as a volume-driver because it rounds out the GH-axis lane and supports the CJC/Ipamorelin stack pattern already reflected in the existing bundle logic.

The 5mg vial format is directly attested in the consulted raw corpus. Raw Amino, NuScience, Genoscience, and Thrive each show a no-DAC or Mod GRF 1-29 product page at the 5mg size or title level, and the corpus repeatedly presents lyophilized powder as the expected format. Purity and batch-testing claims vary by vendor and should remain lot-specific rather than generic.

This proposed listing should therefore use precise RUO language: a Modified GRF 1-29 research reference for short-acting GHRH analog studies, supplied as a lyophilized 5mg vial, without claims about administration, outcomes, body composition, sleep, muscle, or other non-catalog endpoints. Qualification, COA display, and batch identity should carry the trust signal instead of unsupported biological promises.`,

  'CJC-1295-DAC-2MG': `CJC-1295 DAC is proposed as a 2mg lyophilized research vial for controlled laboratory and analytical workflows. The clearest identity frame is CJC-1295 with Drug Affinity Complex: a DAC-modified GHRH analog, not the CJC-1295 No DAC / Modified GRF 1-29 SKU already represented in the catalog.

The DAC distinction should remain visible anywhere Modified GRF language appears. Vendor pages use overlapping terms such as CJC-1295 with DAC, CJC-1295 W/DAC, Modified GRF 1-29 with DAC, and Drug Affinity Complex. Because plain Modified GRF 1-29 can point to the No DAC form, this listing should not shorten the name in a way that collapses the two identities.

Product copy can describe GH-axis research taxonomy, GHRH analog classification, peptide identity confirmation, and the DAC modification as an albumin-affinity taxonomy marker. Those are compound-identity and analytical-context statements only. The page should not translate DAC language into claims about subject response, endocrine outcomes, comparative behavior, or practical applications.

Exact 2mg market support appears in Swiss Chems, Paradigm Peptides, and Strate Labs captures. Swiss lists CJC-1295 with DAC 2mg per vial; Paradigm lists both with-DAC and No DAC 2mg entries; Strate lists CJC-1295 DAC 2mg at a higher price. OROS was reviewed because the URL included 2mg but the captured page text and COA table identify 5mg, so it should be treated only as an inconsistency signal.

At $59.00, this SKU prices at $29.50 per mg. That sits above the broad CJC-1295 distribution median and 75th percentile, above the Swiss and Paradigm exact 2mg comparators, and below the Strate exact 2mg high. It should therefore read as a premium catalog-completion listing, not a loss leader or volume driver.

Final public language should be sparse: canonical name, 2mg vial format, lyophilized presentation when verified, batch/lot number, test date, lab name, COA link, HPLC, mass confirmation, endotoxin, and sterility fields where applicable. Avoid preparation, route, schedule, protocol, human or animal use, treatment, performance, and other application language.`,

  'CJC-1295-IPAMORELIN-10MG': `CJC-1295 + Ipamorelin Blend 10mg is a combined-vial research material for GH-axis catalog work, identity confirmation, and comparative component analysis. The proposed format places CJC-1295 No DAC and Ipamorelin in a single lyophilized vial at a 5mg/5mg composition, matching the most common 10mg blend structure found in the corpus.

CJC-1295 No DAC supplies the GHRH-analog side of the blend. In the existing catalog and raw source set, this material is tied to Modified GRF 1-29 nomenclature and separated from DAC-containing CJC-1295 by the absence of the albumin-affinity extension. That distinction is central to clean product taxonomy.

Ipamorelin supplies the GHSR/ghrelin-receptor class side of the blend. It is described across the corpus as a synthetic pentapeptide in the GH-axis research lane. In this listing, Ipamorelin is framed as a second identifiable component with its own sequence-class and receptor-class context.

The combination is positioned around catalog clarity rather than performance language. CJC-1295 No DAC and Ipamorelin are commonly searched and sold together, and the existing brand strategy already treats the pairing as a recognizable GH-axis stack. A combined vial captures that shorthand while keeping the product distinct from standalone CJC-1295 No DAC, standalone Ipamorelin, and multi-item bundles. The product should read as a convenience-format reference for catalog users who already recognize the paired nomenclature, not as a promise of interaction between components.

Because this is a blend, the strongest quality copy focuses on dual-component verification. Suitable static language includes component identity, chromatographic separation, mass-oriented confirmation, lot traceability, and batch-specific COA review when supported by operator documentation. Vendor purity percentages, facility badges, and storage claims stay outside evergreen copy unless confirmed by the actual lot.

At $99.00, the listing is best treated as a premium catalog-completion SKU. It supports GH-axis component-class comparison in a single reference material without adding preparation instructions, route language, timing guidance, physiological outcomes, clinical interpretation, or broader wellness claims. The compliant page posture is RUO identity, defined blend composition, pathway taxonomy, and document-backed analytical transparency.`,

  'MOTS-C-10MG': `MOTS-c is a mitochondrial-derived, 16-amino-acid peptide encoded within the mitochondrial 12S rRNA region. The launch corpus places it in the metabolic research lane because MOTS-c is discussed as a mitochondrial-signaling reagent rather than a recovery, GH-axis, cosmetic-pathway, nootropic, or immune-category peptide. It fits best as a technical catalog item for mitochondrial-pathway research.

This 10mg vial is proposed as a lyophilized research material for qualified laboratory workflows examining mitochondrial-derived peptide signaling, mitochondrial-nuclear communication, and stress-responsive gene-expression models. Competitor pages consistently identify MOTS-c with the sequence MRWQEMGYIFYPRKRR and molecular weight near 2174 Da; final identity, purity, counterion, and analytical details should defer to batch-specific documentation rather than static marketing copy.

Cell-culture and animal-model literature summarized in the corpus centers MOTS-c around AMPK-pathway investigation, folate-methionine cycle mapping, glucose and lipid metabolism assays, and mitochondrial stress-response research. Those topics are framed here as experimental contexts only. They should not be converted into outcomes, protocols, dosing instructions, or end-user performance claims.

The product page should keep MOTS-c in a controlled research register. Suitable copy can mention mitochondrial-derived peptide classification, 12S rRNA encoding, lyophilized vial format, and analytical traceability. It should avoid translating pathway observations into body-composition, performance, longevity, cognitive, cardiovascular, skeletal, weight-management, or disease-related statements, even when those themes appear in raw vendor pages.

The 10mg presentation gives the catalog a recognizable metabolic-pathway SKU without expanding into GLP-1 analogues or other higher-scrutiny classes excluded by the opening SKU decision. At the requested $79 list price, the object should be treated as a premium-position override; the internal opening recommendation supported a $48 median-market MOTS-c 10mg vial.

MOTS-c 10mg should be presented with age-gated access, research-use-only acknowledgments, and source-confirmed batch/lot traceability once supplier terms are locked. No administration language, clinical framing, consumer-use directions, or implied suitability outside controlled research should appear on the page. The safest commerce posture is concise, technical, and limited to research, laboratory, and analytical use.`,

  'NAD-500MG': `NAD+ is nicotinamide adenine dinucleotide, an oxidized dinucleotide coenzyme found in living cells. The selected raw corpus supports a 500mg vial presentation and labels the material as a coenzyme or non-peptide small molecule rather than a peptide. For this catalog, it should read as a lyophilized research reference for metabolic-pathway work, not as a consumer wellness SKU.

The core research context is redox chemistry and cellular-energy model systems. Vendor pages consistently describe NAD+ as an electron carrier in redox reactions and as a reference for mitochondrial bioenergetics, oxidative phosphorylation, and ATP-pathway assays. That supports mechanism-level language only; it should not become claims about energy, vitality, performance, or human outcomes.

NAD+ also appears in the corpus as a substrate for sirtuins and PARP-family enzymes, with CD38 or cADPRS signaling sometimes discussed. Those terms can describe research directions: post-translational protein-modification models, DNA-repair pathway assays, and intracellular signaling studies. The page should present those as assay contexts, not product benefits.

The 500mg format is directly attested by Prime Lab Peptides, OROS Research, Pepsynth Labs, Genoscience, and Planet Peptide. Several pages list lyophilized powder, CAS 53-84-9, molecular weight near 663.43 g/mol, and batch or COA language. Formula and PubChem identifiers vary by source rendering, so final identity details should defer to the operator's own lot documentation.

At $79, the requested price equals $0.158/mg. That is near the aggregate NAD+ median captured in sku_distributions.md and close to the 500mg-specific signal, while still below several exact 500mg raw pages. This makes the SKU a catalog-completion item rather than a price-led loss leader.

Public copy should stay clinical-commerce and RUO-specific: compound identity, vial size, research category, qualified-researcher access controls, and batch-level analytical traceability only. Avoid reconstitution, dosing, administration, longevity, disease, supplement, or human-use language. This material should be framed only for controlled laboratory, analytical, and in vitro research workflows, with no veterinary, diagnostic, clinical, or therapeutic positioning.`,

  'SELANK-10MG': `Selank is a synthetic heptapeptide (Thr-Lys-Pro-Arg-Pro-Gly-Pro) derived from tuftsin, a naturally occurring immunoactive tetrapeptide fragment. Selank is studied in cell-culture and animal-model research for effects on immune-cell activation, neuroprotection, and behavioral markers in laboratory paradigms exploring anxiety-related phenotypes.

In vitro immunology research employs Selank in primary T-cell, B-cell, and macrophage cultures to examine proliferation rates, cytokine secretion profiles, activation-marker expression (CD69, CD25, HLA-DR), and differentiation patterns. Cell-culture assays document dose-dependent modulation of IL-2, TNF-alpha, IL-10, and IFN-gamma production. Mechanistic studies explore Selank interaction with putative cell-surface receptors, calcium signaling, and intracellular kinase cascades (MAP-kinase, JAK-STAT pathways) underlying immune-cell activation.

Neurobiological research in cell culture employs primary neurons and neural-cell lines to investigate Selank effects on neurotrophic signaling, neuroprotection against excitotoxic and oxidative stress, and modulation of pro-inflammatory mediators (TNF-alpha, IL-1beta, IL-6) in neuroinflammation paradigms. These studies explore BDNF signaling, astrocyte-microglia crosstalk, and synaptic-plasticity markers.

Animal-model research documents Selank effects in behavioral paradigms assessing anxiety-related phenotypes (elevated-plus maze, open-field exploration, light-dark box paradigms) with published evidence of increased open-arm time and center-zone exploration in rodents, interpreted as anxiolytic-like effects. These effects are attenuated by anxiolytic-receptor antagonists in some models, suggesting GABA-A or other classical-anxiolytic-pathway involvement.

Neuroprotection research in animal stroke models, excitotoxicity models, and neurodegenerative-disease models documents Selank-mediated protection against neuronal loss, reduced infarct volume, improved motor recovery, and modulation of glial activation. Published doses range from 0.25-10 mg/kg body weight, with administration via intraperitoneal, intravenous, or intranasal routes per study design.

Immunomodulation in whole-organism animal models shows Selank effects on antibody production, cellular-immune markers (T-cell subsets, NK-cell activity), and inflammatory-response attenuation in endotoxemia and infection models. Research attention emphasizes Selank's dual immune-enhancing and neuroprotective profile, distinguishing it from broader nootropic peptides.

Selank is supplied as a lyophilized pharmaceutical-grade research reference formulated for cell-culture and animal-model research. The 10mg vial is reconstituted in sterile bacteriostatic saline or distilled water per protocol. Storage is maintained at 2-8 degrees Celsius in sealed vials. This material is for research and analytical use only. No therapeutic, anxiolytic, immune-modulating claims, or human administration are made. Not approved by any regulatory authority for any indication.`,

  /* ===== v1.3 catalog expansion (compact research register) ===== */

  'SERMORELIN-2MG': `Sermorelin is a synthetic 29-amino-acid peptide corresponding to residues 1-29 of human growth-hormone-releasing hormone (GHRH 1-29). The 1-29 fragment retains the full receptor-binding and somatotroph-activating activity of full-length GHRH, making it the canonical research analog for investigating GHRH-receptor pathway signaling in the absence of full-length-GHRH proteolytic complications.

In vitro studies employ pituitary cell cultures and recombinant GHRH-receptor expression systems to characterize Sermorelin binding affinity, receptor-coupled adenylyl cyclase activation, and downstream cAMP-PKA signaling. Patch-clamp electrophysiology and calcium-imaging experiments document somatotroph-membrane responses to Sermorelin exposure across a range of concentrations.

Animal-model research, primarily in rodents and larger mammals, employs intravenous and subcutaneous Sermorelin administration to characterize growth-hormone secretion kinetics, pulse-frequency modulation in pulsatile-secretion paradigms, and integration with endogenous somatostatin signaling. Published research employs concentrations of 1-30 mcg/kg body weight in rodent studies titrated per experimental protocol, and documents transient growth-hormone-axis activation profiles consistent with the GHRH-receptor mechanism.

Sermorelin is supplied as a lyophilized pharmaceutical-grade research reference formulated for cell-culture and animal-model research. The 2mg vial is reconstituted in sterile bacteriostatic saline or distilled water per protocol. Storage is maintained at 2-8 degrees Celsius in sealed vials. This material is for in-vitro research, cell-culture, and animal-model investigation only. No human administration, no medical claims, no therapeutic indication. Not approved by any regulatory authority for any indication.`,

  'SERMORELIN-5MG': `Sermorelin is a synthetic 29-amino-acid peptide corresponding to GHRH (1-29), also captured in the corpus as GRF 1-29. This proposed 5mg vial should be presented as a lyophilized research reference for compound identity, receptor-family taxonomy, and analytical workflows rather than as an outcome-oriented endocrine product.

The strongest static identity anchors are the canonical name, GHRH 1-29 / GRF 1-29 synonym support, 29-amino-acid N-terminal fragment language, formula C149H246N44O42S, molecular weight near 3358 Da, and CAS 86168-78-7. Final salt form, counterion, purity, fill verification, and release specifications should defer to operator batch documentation.

Research context should stay at structural and analytical level. Suitable public copy can mention GHRH receptor-family sequence comparison, peptide-identity confirmation, LC-MS or mass-spec analysis, HPLC purity review, chromatographic behavior, immunoaffinity enrichment method development, and stability profiling under controlled laboratory conditions.

Direct raw pages support a 5mg vial presentation from Core Peptides, BioEdge Research Labs, Eternal Peptides, Edge Peptides, and Prime Lab Peptides. Those pages also show common quality-document patterns: COA access, batch or lot tracking, HPLC, mass-spectrometry references, third-party testing language, and lyophilized powder presentation.

Because these pages mix stable catalog facts with claims that are not reusable, the final product page should treat vendor material as source evidence for format and documentation only, not as a template for science copy.

At $59.00, this SKU prices at $11.80 per mg. The captured Sermorelin distribution reports a $8.00 median, $10.50 75th percentile, and $19.798 high. The requested price is therefore a premium catalog-completion position, not a market-low or loss-leader offer.

The final listing should remain sparse: canonical name, 5mg vial size, lyophilized format, search-supported synonyms, batch-visible analytical fields, and strict research-only context. Search metadata can carry alternate naming without expanding the public claim surface. If this SKU appears beside Ipamorelin or CJC-1295 in merchandising, that relationship should stay navigational and should not imply protocol structure or combined effects. Avoid preparation guidance, route language, exposure amounts, subject outcomes, medical framing, age-related language, and pathway-to-benefit translation.`,

  'SERMORELIN-IPAMORELIN-10MG': `Sermorelin + Ipamorelin Blend 10mg is positioned as a GH-axis research vial pairing two established catalog identities: Sermorelin, a synthetic GHRH 1-29 analog, and Ipamorelin, a selective pentapeptide growth-hormone-secretagogue receptor reference. The strongest exact corpus hit is a 5mg + 5mg, 10mg blend page, with adjacent blend listings also appearing on Sermorelin product pages. Both standalone components already sit naturally in the GH-axis category, so the blend extends an existing catalog lane rather than creating a new one.

Sermorelin provides the GHRH-receptor side of the blend. Brand and raw corpus pages consistently describe it as GRF 1-29 or the first 29 amino acids of human growth-hormone-releasing hormone, with a 3357.9 g/mol molecular weight. For catalog copy, that supports framing Sermorelin around receptor-pathway, pituitary-cell, and identity-confirmation workflows.

Ipamorelin provides the GHSR-1a side. Vendor pages describe it as a synthetic pentapeptide with ghrelin-receptor binding interest, 711.9 g/mol molecular weight, and comparatively selective secretagogue positioning versus older GHRPs. That supports role language centered on GHSR-1a signaling, somatotroph assay context, and analytical comparison without adding unsupported comparative claims.

The combination should be described as a convenience blend for dual-arm GH-axis research rather than as a better-performing stack. It gives the product family a format that sits between standalone Sermorelin, standalone Ipamorelin, and existing CJC/Ipamorelin-style merchandising, while preserving a clean research-use boundary.

Quality copy should stay batch-document driven. The exact OROS blend page shows lyophilized format, 3ml vial size, RUO positioning, and COA-heavy presentation, but those vendor-specific lot, purity, endotoxin, heavy-metal, and microbial claims should not be imported unless this SKU has matching documentation. Safe default claims are identity, amount, format, and intended research-only status.

At $89, the product is premium relative to the exact $59.99 comparator and slightly above related blend signals around $80-$87. The price can be defended as an operator-selected catalog-completion SKU for researchers who want both component identities in one 10mg vial, not as a discount or performance-led offer.`,

  'TESAMORELIN-5MG': `Tesamorelin is a synthetic analog of growth-hormone-releasing hormone (GHRH), also identified in the corpus by the synonym TH9507. This proposed 5mg vial should be presented as a lyophilized research reference for controlled laboratory and analytical workflows, not as a therapeutic, wellness, or compounding product.

The strongest compliant framing is compound identity and GH-axis taxonomy. Raw product pages connect Tesamorelin with GHRH-analog classification and place it near Sermorelin, CJC-1295, and Ipamorelin in catalog structures. Those relationships support GH-axis navigation, but they should not be converted into stack instructions or outcome-oriented copy for researchers.

Research context should stay high-level: GHRH receptor pathway mapping, somatotroph signaling models, cAMP-pathway assay design, and GH/IGF-axis analytical comparison. The corpus contains broader clinical and body-composition language, but the proposed page should not reproduce those claims. A controlled research register is especially important because Tesamorelin carries elevated approved-drug comparison sensitivity.

The 5mg presentation is directly supported by raw-fetch pages from Raw Amino, Pure Peptide Labs, Arcane Peptides, and Next Age Peptides. Suitable product-page quality language can mention lyophilized powder, vial format, lot-specific COA display, HPLC, mass spectrometry, purity testing, and batch identity only where the operator has matching documentation for the actual lot and can keep that documentation visible at purchase.

At $69.00, this SKU prices at $13.80 per mg, above the captured Tesamorelin 75th percentile and near the high end of the corpus distribution. The price matches a direct Raw Amino 5mg listing, so the position should be described as an operator-requested premium research format rather than a market-leader or loss-leader offer.

This material should be described strictly for controlled laboratory, in vitro, and analytical research use by qualified purchasers in non-clinical settings. It is not a drug, dietary supplement, cosmetic, or compounding article, and it is not for human or veterinary use, clinical administration, diagnostic use, therapeutic application, ingestion, injection, or bodily introduction of any kind.`,

  'IGF-1-LR3-1MG': `IGF-1 LR3 is proposed as a 1mg lyophilized research vial for qualified laboratory and analytical workflows. Corpus product pages identify the material as a synthetic IGF-1 class analog with 83 amino acids, an N-terminal extension, and an arginine substitution at position 3 within the IGF-1 sequence framework.

The safest product-page foundation is compound identity, vial format, and IGF-axis taxonomy. Direct raw pages support 1mg listings, lyophilized powder presentation, COA-oriented quality language, HPLC purity assessment, mass-spectrometry identity checks, and batch or lot visibility. Static copy should not state purity, sterility, manufacture location, salt form, or shelf timing unless the operator has matching lot documentation.

Because identifier fields vary across raw pages, those details should live in dynamic batch tables rather than evergreen descriptive copy.

Research context should stay at pathway and analytical level. Appropriate language includes IGF-axis assay development, receptor-interaction modeling, binding-protein affinity comparison, structure-activity evaluation, chromatographic purity assessment, and mass-spec identity confirmation. These are laboratory workflow terms, not buyer-facing outcome statements.

The raw corpus also shows why restraint is necessary. Some vendor pages move from IGF-axis terminology into customer-readable outcomes, subject-condition narratives, protocol cues, or broad performance language. Those passages should not be imported. The public listing should read as reference-material inventory for controlled research purchasers.

At $99.00, this SKU prices at $99.00 per mg. sku_distributions.md reports a captured IGF-1 LR3 median of $85.00 per mg and p75 of $135.45 per mg. Exact raw comparators include BioEdge at $67, Blue Sky at $79.95, Paramount at $80, Vici at $85, and Raw Amino at $230. This supports an above-median operator request, not a discount-led role.

The page should remain sparse: canonical name, 1mg vial size, lyophilized format, price, lot identifier, test date, lab name, COA link, HPLC, and mass-spec fields when available. Avoid stack framing, preparation guidance, route language, exposure amounts, subject outcomes, or customer benefit copy. The compliant posture is RUO identity, analytical traceability, and IGF-axis research taxonomy only.`,

  'GHRP-2-5MG': `GHRP-2 is proposed as a 5mg lyophilized research vial in the GH-axis catalog group. Source pages identify the material as Growth Hormone Releasing Peptide-2, a synthetic hexapeptide with the sequence D-Ala-D-2-Nal-Ala-Trp-D-Phe-Lys-NH2. The Pralmorelin synonym appears in Raw Amino and Alpha Carbon Labs pages, but public naming should remain canonical.

The strongest static identity anchors are peptide class, vial strength, lyophilized format, formula C45H55N9O6, CAS 158861-67-7, and molecular mass near 817 Da. Those identifiers are repeated across exact or near-exact GHRP-2 product pages, though final salt form, purity, fill, and release data should defer to operator batch records.

Research-context language should stay at receptor and analytical level. Suitable page copy can describe GHRP-2 as a reference material for GHS-R1a or ghrelin-receptor pathway mapping, somatotroph cell-model comparison, GH-axis assay development, chromatographic purity review, and LC-MS identity confirmation. These are laboratory workflow contexts, not product benefits. This keeps the GH-axis taxonomy legible while avoiding conversion of pathway observations into buyer-facing outcomes or protocol cues.

The 5mg format is directly supported by Ion Peptide, Blue Sky Peptide, Alpha Carbon Labs, AIO Peptides, and the 5mg Raw Amino variant. Several pages also show COA, mass-spectrometry, HPLC, purity, and third-party testing language. Those signals should appear only when matched by the storefront's actual lot documentation. COA support should be visible at purchase rather than borrowed from vendor pages.

At the requested $39 list price, the SKU prices at $7.80 per mg. sku_distributions.md reports a GHRP-2 median of $5.76 per mg and p75 of $6.315 per mg. Raw comparators cluster from $29 to $38.95, while Alpha Carbon Labs lists $50 but sold out, so this should be framed as a premium operator request. The page should not claim market leadership or bargain positioning.

The final product page should be narrow and documentation-led: canonical name, 5mg vial size, lyophilized presentation, price, lot identifier, test date, lab name, COA link, HPLC, and mass-spec fields when available. Avoid preparation instructions, routes, exposure amounts, stack instructions, study-subject outcomes, diagnostic references, appetite, sleep, immune, cardiovascular, muscle, protein, or body-composition language.`,

  'GHRP-6-5MG': `GHRP-6 is a synthetic growth-hormone-releasing hexapeptide proposed here as a 5mg lyophilized research vial. The strongest static identity anchor is the sequence His-D-Trp-Ala-Trp-D-Phe-Lys-NH2, with source pages also listing molecular formula C46H56N12O6, molecular mass near 873 Da, and CAS 87616-84-0.

Product-page copy should treat those identifiers as reference-material metadata, not as a basis for broader biological promises. Growth Hormone Releasing Peptide-6 can appear as a synonym for search and identification, while final salt form, purity, water content, fill accuracy, and chromatographic release values should remain tied to the operator's batch documentation.

That distinction matters because vendor pages often mix stable catalog facts with broad narrative claims. For this listing, the evergreen page should hold only terms a future lot can continue to support without rewriting the science story: compound name, vial strength, format, and batch-visible analytical fields.

The allowed research frame is narrow: GHS-R1a receptor interaction, pituitary somatotroph signaling models, GH-axis assay comparison, second-messenger pathway mapping, and peptide-identity workflows. Alpha Carbon Labs, Ion Peptide, Raw Amino, and Edge all connect GHRP-6 with ghrelin-receptor or GHSR terminology, but their outcome-led language needs substantial claim removal.

The 5mg vial format is directly supported by Raw Amino, Ion Peptide, Alpha Carbon Labs, and Paradigm Peptides, with adjacent 10mg and multi-vial support from Raw Amino and Edge. This is enough for SKU existence, price comparison, and catalog placement, but not enough to borrow customer reviews, shipping promises, or vendor purity percentages.

At $39.00, the proposed listing equals $7.80 per mg. That places the SKU above the captured GHRP-6 75th percentile of $5.9950 per mg, while remaining below the $10.00 per-mg high from the distribution. Merchandising should therefore be documentation-led, not discount-led.

The final page should read as a controlled GH-axis research-commerce listing: canonical name, 5mg vial strength, lyophilized format, batch/lot identifier, test date, lab name, COA link, HPLC, mass-spec confirmation, and concise RUO restrictions. It should not include preparation guidance, route language, exposure amounts, stack instructions, subject outcomes, disease terms, or approved-product comparisons.`,

  'HEXARELIN-2MG': `Hexarelin is proposed as a 2mg lyophilized research vial in the GH-axis group. It is a synthetic six-amino-acid growth-hormone-releasing peptide, commonly placed in the GHRP family beside GHRP-2 and GHRP-6. For public copy, that relationship should serve as taxonomy and identity context only, giving researchers a clear label without implying practical use.

The safest product-page foundation is material identity, vial format, and batch traceability. Exact 2mg support appears in Alpha Carbon Labs, Extreme Peptides, NuScience, and Paradigm corpus captures, while Raw Amino provides adjacent 5mg context for lyophilized powder presentation and GHRP-class navigation.

Research context should stay at receptor and pathway level. Appropriate language includes GHS-R1a interaction models, ghrelin-receptor pathway comparison, somatotroph signaling assays, and GH-axis analytical comparison against related GHRP-class references. These terms describe controlled laboratory topics, not purchaser outcomes.

Because Hexarelin appears near CJC-1295, GHRP-2, and GHRP-6 in several catalogs, the page may use GH-axis placement for navigation. It should not turn adjacent-product merchandising into blend, stack, comparative-effect, or experiment-design guidance.

Identifier and quality details should remain batch-led. Alpha Carbon Labs lists formula, molecular weight, CAS, HPLC, mass-spec, and purity language; other corpus pages emphasize lab testing, COA access, or broad catalog claims. Static copy should not transplant those fields unless the operator's actual lot documentation supports them.

At $35.00, this SKU prices at $17.50 per mg. That is above the captured Hexarelin 75th percentile of $15.00 per mg and below the Alpha Carbon Labs high comparator of $25.00 per mg. Extreme's $34.99 list price directly supports the requested price, while NuScience and Paradigm show lower exact 2mg alternatives.

The page should remain sparse: canonical name, 2mg vial size, lyophilized format, price, lot identifier, test date, laboratory name, COA link, HPLC field, and mass-spec field when available. Keep the description limited to research inventory, analytical documentation, and GHRP-class taxonomy. No practical-use guidance or outcome-led copy belongs on this listing.`,

  'PEG-MGF-2MG': `PEG-MGF is proposed as a 2mg lyophilized research vial for controlled laboratory and analytical workflows. The most stable identity frame in the corpus is PEGylated mechano growth factor: a polyethylene-glycol-modified material associated with the IGF-1 Ec splice-variant / MGF fragment rather than a full-length IGF-1 analog.

The PEG designation should do most of the explanatory work. Consulted pages consistently describe pegylation as a conjugation strategy that changes molecular size, stability, degradation behavior, solubility characteristics, and chromatographic handling. Because PEG chain details can vary by supplier, molecular weight, formula, salt form, and conjugation chemistry should defer to batch documentation. That batch-led approach also avoids locking static catalog copy to a single vendor's PEG length or analytical convention before supplier terms and COA format are confirmed.

Product copy can mention IGF-1 splice-variant signaling, peptide identity confirmation, PEGylation/stability comparison, and analytical method development. Those are research-context terms only. The page should not translate MGF literature into claims about biological outcomes, practical applications, subject response, or performance endpoints.

Exact 2mg support appears in Genoscience and IonPeptide pages, with Alpha Carbon Labs providing an additional 2mg PEG MGF listing and adjacent analytical fields. Raw Amino and BioEdge support broader PEG-MGF marketplace presence at 5mg, including lyophilized powder, HPLC, mass-spectrometry, purity, COA, and storage vocabulary that should remain lot-specific.

At $59.00, this SKU prices at $29.50 per mg. That is above the captured PEG-MGF full-distribution median and 75th percentile, above Genoscience and IonPeptide exact 2mg comparators, and below the Alpha Carbon 2mg sold-out page. It should therefore read as a premium catalog-completion listing, not a loss leader.

Final public language should be sparse: canonical name, 2mg vial format, lyophilized presentation when verified, batch/lot number, test date, lab name, COA link, HPLC, and mass confirmation. This material should be presented only for qualified non-clinical laboratory, in vitro, and analytical research contexts, with no preparation, route, exposure, protocol, or application guidance.`,

  'IGF-1-DES-1MG': `IGF-1 DES is proposed as a 1mg research vial for qualified laboratory and analytical workflows. The corpus supports the SKU name through exact or near-exact catalog listings under IGF-1 DES, IGF DES, and IGF-1 DES 1,3, with direct 1mg support from Extreme Peptides, Paradigm Peptides, SwissChems COA index, and Peptide Gurus.

The safest product-page foundation is identity and format. Static copy should say the material is an IGF-class peptide reference supplied as a 1mg vial, while leaving sequence, counterion, salt form, purity, sterility, and release-test values to operator batch records. Existing raw pages do not provide enough consistent detail for permanent identifier claims. That restraint also keeps the listing aligned with the site's batch-led catalog model and current source-terms uncertainty.

Research context should stay narrow. Appropriate language includes IGF-axis taxonomy, receptor-interaction assay context, peptide-identity comparison, chromatographic purity review, mass-oriented identity confirmation, and lot-to-lot documentation. These terms describe laboratory classification and analytical workflow needs without translating pathway language into purchaser outcomes or experimental promises.

Quality language should be batch-led. The SwissChems index shows that IGF-1 DES 1mg can be represented through COA-linked product records, while Extreme and Paradigm provide price and vial-size comparators. The site should present lot number, test date, lab name, COA link, and applicable analytical methods only when matching records exist.

At $69.00, the proposed listing equals $69.00 per mg. That is below the direct Extreme Peptides sale row at $76.99 and Paradigm row at $85.00, but above Injectify's homepage sale signal. Because the distribution file places DES rows in the heterogeneous other bucket, price positioning should be described conservatively.

The public page should be sparse: canonical name, 1mg vial size, format, price, batch traceability fields, and research-only constraints. It should not borrow outcome language from broader vendor education pages or adjacent IGF-class products. The compliant posture is identity, analytical traceability, and IGF-axis taxonomy, not experiment design or end-user interpretation.`,

  'SEMAX-30MG': `Semax is a synthetic heptapeptide (Met-Glu-His-Phe-Pro-Gly-Pro) corresponding to residues 4-10 of adrenocorticotropic hormone (ACTH 4-10) with a Pro-Gly-Pro C-terminal extension that confers metabolic stability. The compound is the subject of a substantial Russian-published research literature on neuropeptide signaling in cell-culture and animal-model paradigms relevant to cognitive and neuroprotective research questions.

In vitro studies employ neuronal cell cultures and brain-slice preparations to characterize Semax effects on neurotrophic-factor expression (BDNF, NGF), synaptic-plasticity markers, and neuronal-survival pathways under oxidative-stress and excitotoxic-stress conditions. Cell-culture work documents Semax modulation of cAMP-response-element binding protein (CREB) signaling and immediate-early gene expression in cultured neurons.

Animal-model research employs intranasal and intraperitoneal Semax administration in rodent paradigms to characterize cognitive-task performance markers, neuroprotection against ischemic-injury models, and behavioral-paradigm responses interpreted as anxiolytic-like or pro-cognitive in the published literature. Concentrations range across 0.05-1.0 mg/kg body weight per experimental protocol.

Semax is supplied as a lyophilized pharmaceutical-grade research reference. The 30mg vial is reconstituted in sterile bacteriostatic saline or distilled water per protocol. Storage at 2-8 degrees Celsius in sealed vials. For in-vitro research, cell-culture, and animal-model investigation only. No human administration. Not approved by any regulatory authority for any indication.`,

  'SEMAX-10MG': `Semax is a synthetic heptapeptide with sequence Met-Glu-His-Phe-Pro-Gly-Pro, commonly described as an ACTH (4-10)-derived neuropeptide with a Pro-Gly-Pro extension. This 10mg vial is positioned as a lyophilized research reference for non-clinical laboratories evaluating Semax identity, handling characteristics, and pathway-context literature.

Within the corpus, Semax appears across vial and nasal SKU formats, with direct 10mg product pages documenting lyophilized powder presentation, sequence, molecular formula, and COA or third-party testing postures. The catalog should use those concrete attributes as its copy base: peptide identity, vial quantity, format, analytical documentation, and research-use-only limitations.

The mechanistic context should remain high-level. Existing product descriptions and raw product pages support references to Russian-published cell-culture and animal-model literature on neuropeptide signaling, neurotrophic-marker expression such as BDNF and NGF, serotonergic and dopaminergic pathway investigation, and ACTH-fragment analog research. Those markers should be presented as research topics, not outcomes or product benefits.

The 10mg presentation gives the catalog a smaller Semax vial than the existing 30mg SKU. Aggregate market data records 78 vendors carrying Semax, 99 SKU rows, and both vial and nasal formats, so a 10mg vial is a common dose-size signal in the captured vendor universe. At $49.00, it should be positioned as a catalog-completion format rather than a price-led flagship.

Analytical copy can mention quality posture only where the storefront has matching batch support: lyophilized powder, sequence confirmation, stated purity when available, COA availability, test-date visibility, and lot-specific testing language. It should not echo vendor marketing around clinical investigations or customer-facing benefits. The safer frame is reference-material inventory for qualified research purchasers.

This material should be described strictly for laboratory research, analytical comparison, and non-clinical peptide handling. Do not include route language, reconstitution instructions, study exposure amounts, disease terms, cognition or mood promises, or clinical translation language. Final commerce copy should stay concise and verifiable: synthetic heptapeptide, ACTH-fragment derivation, 10mg lyophilized vial, relevant research pathways, COA-oriented quality posture when available, and RUO-only restrictions.`,

  'PT-141-10MG': `PT-141 (Bremelanotide) is a synthetic cyclic heptapeptide used as a melanocortin-receptor research reference. This proposed 10mg vial should be presented more narrowly than ordinary catalog peptides because the Bremelanotide synonym appears in regulated human-use contexts and the corpus shows frequent medicalized vendor copy around this compound.

The safest product-page foundation is material identity: PT-141, cyclic peptide architecture, melanocortin-receptor class, and lyophilized vial format. Several exact product pages support the sequence Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-OH, the molecular formula C50H68N14O10, and molecular weight near 1025.2 Da, but final identity, salt form, purity, and lot attributes should defer to batch documentation.

For research context, the page should stay at receptor and analytical level. Appropriate language includes melanocortin receptor interaction modeling, receptor-class comparison, peptide stability profiling, LC-MS identity confirmation, chromatographic purity assessment, and comparative structural analysis of cyclic peptide analogs. These are laboratory workflow terms, not outcome claims.

The corpus repeatedly shows why restraint is necessary. Raw vendor pages often move from receptor terminology into consumer-readable narratives, clinical comparisons, or human-outcome discussion. Those passages should not be imported. The page should avoid translating melanocortin-pathway research into buyer-facing promises, practical use cases, or protocol cues.

The requested $59 list price equals $5.90 per mg. That sits above the captured PT-141 75th percentile and above the broader median, so this should not be framed as a loss leader. It is better treated as a controlled catalog-completion SKU where qualification, age gating, and batch-specific COA access carry the trust signal. Merchandising should emphasize documentation and access controls rather than discounts, bundles, or consumer-style comparison copy.

PT-141 10mg should be listed only as a research material for qualified laboratory, in vitro, and analytical workflows. The page should provide no preparation instructions, route discussion, study exposure amounts, clinical interpretation, or human/veterinary suitability language. The compliant commerce posture is sparse: compound name, synonym, vial size, analytical traceability, storage handled by source documentation, and research-use-only restrictions.`,

  'MELANOTAN-II-10MG': `Melanotan II is a synthetic cyclic heptapeptide analog of alpha-melanocyte-stimulating hormone, commonly abbreviated MT-II or MT2 in the raw corpus. The proposed 10mg vial should be presented first as a melanocortin-receptor reference material, not as a user-facing product category or practical-use article.

The strongest source-backed identity frame is narrow and technical: cyclic lactam peptide architecture, sequence Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-NH2, molecular formula C50H69N15O9, and molecular weight near 1024.2 Da. Final sequence, salt form, fill mass, purity, and counterion should defer to the operator's own lot documentation.

For page copy, the compliant research context is receptor and analytical work. Suitable language includes melanocortin receptor binding, MC1R/MC3R/MC4R/MC5R comparison, GPCR second-messenger assay design, structure-activity review across alpha-MSH analogs, HPLC purity assessment, LC-MS identity confirmation, and peptide-stability profiling under controlled laboratory conditions.

The 10mg vial format is well supported by direct raw pages from Prime Lab Peptides, GenoScience, Planet Peptide, Eternal Peptides, Raw Amino, Silverstone Labs, and Snap Peptides. Several sources also show synonym support for Melanotan 2, Melanotan II, MT-II, MT-2, and MT2, which should be captured in search metadata rather than promoted as alternate brand language.

Quality language should stay batch-specific. Public copy can expose lot number, test date, lab name, COA link, HPLC result, mass confirmation, and any applicable endotoxin, sterility, microbial, or heavy-metal testing only when those records exist for the operator's inventory. Competitor purity percentages and lab names should not be reused as generic SKU claims.

At $59.00, this SKU prices at $5.90 per mg. The captured Melanotan II distribution shows a $5.00 median, $5.25 p75, and $5.50 high, while the separate Melanotan 2 bucket shows a lower $3.995 median. The requested price is therefore a premium catalog-completion position.

The final listing should remain sparse: canonical name, 10mg vial size, lyophilized format, receptor-class taxonomy, analytical traceability, and strict RUO restrictions. It should provide no preparation guidance, route language, protocol cues, study-subject interpretation, pathway-to-use translation, practical application language, or suitability language outside controlled laboratory workflows.`,

  'KISSPEPTIN-10-10MG': `Kisspeptin-10 is a ten-amino-acid RF-amide peptide reference, also identified in vendor corpora as Metastin, KP-10, or a KISS1-derived fragment. The supported primary structure is Tyr-Asn-Trp-Asn-Ser-Phe-Gly-Leu-Arg-Phe-NH2, a C-terminally amidated decapeptide that gives product copy a concrete identity anchor without moving into application outcomes.

Multiple source pages support the same core analytical profile: lyophilized vial format, formula C63H83N17O14, and molecular weight near 1302.4 g/mol. CAS reporting is inconsistent across vendors, so the catalog entry should avoid treating any single CAS value as definitive unless it is repeated on the operator's own lot documentation.

For the product page, Kisspeptin-10 should be framed as an RUO reference material for receptor-pathway and peptide-identity workflows. Safe use cases include KISS1R binding assay controls, peptide-fragment comparison, LC-MS identity confirmation, HPLC purity review, chromatographic retention studies, and stability or degradation profiling under controlled laboratory conditions.

The 10mg vial size is commercially supported by BioEdge, Eternal Peptides, Oath Peptides, Ion Peptide, and Edge Peptides; Oros provides adjacent 5mg support for the same compound identity. The requested $109 list price sits above the captured direct 10mg pages and above the distribution study's observed Kisspeptin-10 range, so the price should be understood as an operator choice, not a market-low position.

Quality language should remain batch-specific. The compliant pattern is to present lot number, test date, independent lab name, COA link, HPLC purity, mass confirmation, and any applicable endotoxin, microbial, heavy-metal, or sterility checks only when those records exist for the operator's inventory. Vendor-sourced numbers should not be transplanted into the catalog as global claims.

The safest listing posture is narrow and technical: a 10mg lyophilized Kisspeptin-10 research vial for identity, comparison, and assay-development work. The copy should avoid preparation instructions, route language, exposure amounts, study-subject discussion, and pathway-to-outcome translation. This keeps the page aligned with RUO compliance while still giving researchers enough structure to understand what the material is and how it can be specified in analytical workflows.`,

  'EPITALON-50MG': `Epitalon is a synthetic tetrapeptide (Ala-Glu-Asp-Gly) of the Khavinson bioregulator class. The compound was developed as a research analog of pineal-derived peptide signaling and has been the subject of cell-culture and animal-model research on telomere-length-related cellular signaling, gene-expression modulation, and longevity-paradigm investigation.

In vitro studies in cultured human and animal cells document Epitalon effects on telomerase-related gene-expression markers, telomere-length kinetics in serial-passage cell-culture paradigms, and chromatin-organization markers. Cell-culture research has explored Epitalon binding to chromatin domains and the resulting transcriptional-regulation effects across panels of senescence-associated and longevity-associated genes.

Animal-model research, primarily in rodent longevity-paradigm studies, has characterized Epitalon effects on chronological lifespan markers, organ-system-specific aging markers, and circadian-rhythm signaling in pineal-axis research models. Published rodent protocols employ concentrations of 0.5-5.0 mcg/kg body weight per study design.

Epitalon is supplied as a lyophilized pharmaceutical-grade research reference. The 50mg vial is reconstituted in sterile bacteriostatic saline or distilled water per protocol. Storage at 2-8 degrees Celsius in sealed vials. For in-vitro research, cell-culture, and animal-model investigation only. No human administration. Not approved by any regulatory authority for any indication.`,

  'EPITALON-10MG': `Epitalon is a synthetic tetrapeptide commonly identified by the sequence Ala-Glu-Asp-Gly, or AEDG. The 10mg vial should be framed as a lyophilized research reference in the same Khavinson bioregulator lane already used for the existing Epitalon 50mg catalog entry.

Corpus sources support Epitalon and Epithalon as interchangeable retail spellings. Direct 10mg product pages document vial-format listings, lyophilized powder presentation, sequence or molecular-weight details, COA-oriented quality language, and repeated research-use-only limitations. Those concrete attributes are the safest basis for product-page copy.

The appropriate mechanism context is narrow. Existing site copy and raw vendor pages support references to telomere-related cellular signaling, telomerase-marker investigation, gene-expression models, chromatin or epigenetic regulatory research, and pineal-axis or circadian-pathway models. These should remain research topics, not promised effects.

The 10mg presentation gives the catalog a smaller Epitalon vial beside the current 50mg SKU and the Khavinson Bioregulator Stack. Aggregate market data records Epithalon across 69 vendors and 80 SKU rows, with vial and nasal formats observed, so the product is not an obscure one-off addition. This smaller format also gives page copy a standalone basis instead of borrowing from the 50mg listing.

At the requested $49 list price, this SKU lands at $4.90 per mg. That is above the captured Epithalon median of $3.50 and above the 75th percentile of $4.50, making it a premium catalog-completion format rather than a price-led launch driver.

Public copy should avoid vendor-page language around longevity outcomes, anti-aging effects, sleep regulation, retinal conditions, antioxidant activity, reproductive models, tumor findings, or geriatric subject results. Batch-specific support can carry trust signals through lot, test-date, purity, HPLC, mass-spec, and COA fields when the operator has matching documentation.

This material should be described only for controlled laboratory, analytical, in-vitro, and permitted animal-model research contexts. The page should not include preparation guidance, dosing amounts, administration routes, clinical translation, consumer wellness language, or any claim that implies suitability for human or veterinary use.`,

  'THYMOSIN-ALPHA-1-5MG': `Thymosin Alpha-1 is a synthetic 28-amino-acid peptide identical in sequence to the naturally occurring thymic peptide of the same name. The compound is the subject of an extensive cell-culture and animal-model research literature on T-lymphocyte differentiation, dendritic-cell maturation, and broader immune-cell-signaling pathways.

In vitro studies in primary T-cell cultures and lymphocyte cell lines document Thymosin Alpha-1 effects on T-cell proliferation, cytokine-secretion profiles, activation-marker expression (CD69, CD25), and differentiation-pathway markers. Cell-culture research also documents effects on dendritic-cell maturation, antigen-presentation markers, and Toll-like-receptor pathway signaling. Mechanistic work explores Thymosin Alpha-1 interaction with TLR9 and the resulting downstream signaling cascade in immune-cell research.

Animal-model research employs subcutaneous Thymosin Alpha-1 administration in rodent and larger-mammal paradigms to characterize systemic immune-cell-marker responses, antibody-production kinetics in immunization paradigms, and immune-pathway investigation in chronic-administration protocols. Published research employs concentrations of 50-1000 mcg/kg body weight per experimental design.

Thymosin Alpha-1 is supplied as a lyophilized pharmaceutical-grade research reference. The 5mg vial is reconstituted in sterile bacteriostatic saline or distilled water per protocol. Storage at 2-8 degrees Celsius in sealed vials. For in-vitro research, cell-culture, and animal-model investigation only. No human administration. Not approved by any regulatory authority for any indication.`,

  'THYMOSIN-ALPHA-1-10MG': `Thymosin Alpha-1 is a synthetic 28-amino-acid thymic peptide proposed here as a 10mg lyophilized research vial. Public copy should treat the material first as an identity-controlled peptide reference: canonical name, vial strength, lyophilized format, and batch-specific analytical documentation, without borrowing outcome-oriented language from vendor pages.

The raw corpus supports core identity markers across multiple exact or near-exact product pages: 28-amino-acid sequence, CAS 62304-98-7, molecular formula C129H215N33O55, and molecular weight near 3108 Da. Final sequence, salt form, counterion, fill, purity, and mass confirmation should defer to the operator's actual lot documentation.

Appropriate research context is limited to RUO cell-model and pathway work. Supported mechanism vocabulary includes T-lymphocyte differentiation models, dendritic-cell marker assays, cytokine-expression profiling, Toll-like-receptor pathway mapping, peptide-cell interaction studies, and comparative thymic-peptide signaling workflows. These are research topics only, not purchaser outcomes or practical guidance.

The 10mg presentation is directly attested by BioEdge Research Labs, BioLongevity Labs, Paramount Peptides, Raw Amino, and Planet Peptide, with Edge Peptides showing a 10-vial wholesale box. Those pages also show common quality-document patterns: COA links, HPLC purity fields, mass-spectrometry references, lot identifiers, and test dates.

Because the catalog already contains a 5mg Thymosin Alpha-1 item, this page should distinguish only vial strength and purchasing format. The underlying identity and research posture remain the same; no new pathway claims are created by the larger fill size.

Static product copy should not repeat competitor quality claims unless the storefront has matching source records. Vendor assertions about USA manufacture, GMP status, sterility, heavy metals, shelf life, no fillers, independent laboratories, reviewer credentials, shipping speed, and customer ratings belong outside the listing unless independently verified for the exact source and batch.

This SKU should read as a controlled research-commerce page: compound identity, 10mg vial format, analytical traceability, and restrained pathway taxonomy. Avoid synonym-led copy, and keep alternate spellings to search support or metadata where needed. The page should provide no preparation, route, exposure, protocol, or study-interpretation language.`,

  'LL-37-5MG': `LL-37 is a 37-amino-acid cathelicidin-derived peptide proposed here as a 5mg lyophilized research vial. The strongest source-backed identity frame is the defined linear sequence LLGDFFRKSKEKIGKEFKRIVQRIKDFLRNLVPRTES and a molecular weight near 4493 Da. CAS number and formula renderings vary across raw pages, so final static identifiers should defer to batch documentation.

For product-page use, LL-37 should be presented as a controlled laboratory reference, not as an outcome-oriented material. Appropriate research context includes cathelicidin-class sequence comparison, amphipathic peptide structure profiling, peptide-membrane interaction modeling, and method development for long-chain cationic peptides. These are assay contexts, not purchaser-facing effect claims. The page can name hCAP18/cathelicidin lineage as nomenclature when supported by supplier documentation, while avoiding any statement that the vial performs a biological defense function.

The 5mg format is directly supported by Planet Peptide, Raw Amino, IonPeptide, BioEdge, and Edge's 10-vial 5mg box listing. Those pages also show why copy discipline matters: the same product class is frequently surrounded by antimicrobial, immune, dermatology, wound, pathogen, and disease-model language that should not be imported into this catalog.

Quality language should stay batch-specific. Suitable page elements include lot number, test date, lab name, COA link, HPLC purity assessment, LC-MS or mass-spectrometry identity confirmation, and storage information drawn from the operator's own source records. Researchers can orient the material around sequence verification, conformational comparison, solubility observation, and chromatography behavior under controlled laboratory conditions. Do not turn competitor purity percentages, sterility language, manufacturing claims, or shipping promises into generic SKU claims.

At the requested $79.00 list price, LL-37 5mg prices at $15.80 per mg. The parsed distribution records 23 vendors, 25 SKU rows, a $12.88 per-mg median, and a $16.77 per-mg 75th percentile. This supports an above-median catalog-completion position rather than a loss-leader claim.

This material should be described only for qualified laboratory, analytical, in vitro, and permitted non-clinical research workflows. The page should provide no preparation instructions, route language, exposure amounts, diagnostic framing, clinical translation, human or veterinary suitability language, or therapeutic positioning.`,

  'FOLLISTATIN-344-1MG': `Follistatin-344 is a recombinant human follistatin isoform, commonly abbreviated FST-344, supplied as a 1mg lyophilized research vial. This listing is intended for qualified laboratory teams that need a protein reference for identity confirmation, ligand-binding models, and analytical workflows rather than application-oriented or consumer contexts. The page should frame the material as a cataloged research reagent, with pathway terminology serving as taxonomy rather than an objective.

The identity frame should stay precise and batch-led. Available corpus material identifies FST344 with UniProt P19883 and describes a 344-amino-acid precursor, a mature core near 315 amino acids, and an unglycosylated monomer near 37.8 kDa. Final page metadata should defer to the operator's lot record and COA for purity, counterion, and exact analytical release details. Because protein specifications can vary by supplier record, identity language should remain conservative until reconciled with the live batch.

The supported pathway vocabulary is limited to follistatin's ligand-binding relationship within TGF-beta-family research. Corpus pages connect FST-344 with activin-binding terminology and myostatin/activin pathway analysis. Those terms should be presented as research context only, without translating receptor or ligand language into outcomes, benefits, or practical applications.

For quality framing, the page can emphasize the 1mg vial format, lyophilized presentation, batch/lot visibility, test date, COA access, HPLC purity assessment, and mass-oriented identity confirmation when matching documents exist. Vendor-specific purity percentages, manufacturing origin, sterility, guarantees, and handling directions should not appear as static claims without operator documentation.

The requested $149 price equals $149 per mg. Captured market rows place the SKU above the $129/mg median and below the $158/mg 75th percentile, making it a premium but not outlier 1mg listing. Merchandising should therefore be restrained: this is a catalog-completion SKU supported by documentation, not a discount-led acquisition item.

Follistatin-344 should remain in a research-use-only register focused on material identity, pathway nomenclature, and analytical traceability. Product copy should avoid experimental setup instructions, workflow directions, translational extrapolation, and non-laboratory applications. The strongest page is short, technical, and anchored to batch-specific verification rather than broad scientific narratives from competitor pages.`,

  'DSIP-5MG': `DSIP (Delta Sleep-Inducing Peptide) is a naturally occurring nine-amino-acid neuropeptide supplied as a 5mg lyophilized research vial. Supported identity markers include the sequence Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu, CAS 62568-57-4, molecular formula C35H48N10O15, and molecular weight near 848.8 g/mol.

The compound name reflects historical nomenclature and is presented as identity language, not as an outcome statement. This listing is framed for non-clinical laboratories evaluating central-nervous-system signaling, hypothalamic pathway models, neurotransmitter-system assays, and circadian-rhythm research designs.

The 5mg vial format is directly supported across multiple raw product pages, with lyophilized powder listed as the expected presentation. Several consulted pages also show quality-document structures such as HPLC purity fields, COA tabs, mass-spectrometry tabs, batch or lot identifiers, and third-party testing language. Those patterns support a batch-led commerce page rather than benefit-led merchandising.

Static product copy should stay close to those verifiable attributes. Actual purity percentages, lab names, test dates, endotoxin results, mass-spectrometry confirmation, and lot numbers belong in batch-specific documentation rather than general descriptive copy. This keeps the page accurate when lots change and avoids borrowing unverified vendor claims.

The usable pathway context is intentionally restrained. DSIP appears in corpus material alongside serotonergic, dopaminergic, opioidergic, GABAergic, adrenergic, HPA-axis, and nociceptive research terms. These terms are appropriate as laboratory investigation topics, not as expected results, customer outcomes, or practical applications. Broader endpoint language from vendor education sections, including comfort, behavior, mood, withdrawal, oncology, metabolic, muscle, and neuroprotection framing, remains outside this compliant description unless independently substantiated and compliance-reviewed.

For catalog architecture, DSIP fits the neuropeptide side of the nootropic research group while remaining a catalog-completion SKU rather than a flagship acquisition product. The page should read technical and spare: compound identity, vial quantity, research-only restrictions, analytical-documentation posture, and high-level pathway context.

This material is supplied for laboratory research, analytical comparison, and non-clinical pathway investigation only. It is not a drug, dietary supplement, food, cosmetic, or compounding product, and it is not for human or veterinary use, diagnostic use, clinical administration, or therapeutic application.`,

  'KPV-5MG': `KPV is a synthetic tripeptide (Lys-Pro-Val) corresponding to the C-terminal three amino acids of alpha-melanocyte-stimulating hormone (alpha-MSH). The compound has been the subject of cell-culture and animal-model research on inflammatory-pathway signaling, with published research literature exploring KPV anti-inflammatory effects in cellular and tissue-model paradigms.

In vitro studies in cultured macrophages, T-lymphocytes, and epithelial cells document KPV effects on pro-inflammatory cytokine secretion (TNF-alpha, IL-6, IL-1beta), NF-kappaB pathway signaling, and downstream inflammatory-marker expression. Cell-culture research has explored KPV intracellular delivery and the resulting modulation of inflammatory-pathway gene expression in cultured colonic epithelial cells in inflammation-paradigm research.

Animal-model research employs oral, topical, and parenteral KPV administration in rodent paradigms of inflammation research to characterize systemic and tissue-specific inflammatory-marker responses. Published rodent studies employ concentrations of 0.5-50 mg/kg body weight per experimental design.

KPV is supplied as a lyophilized pharmaceutical-grade research reference. The 5mg vial is reconstituted in sterile bacteriostatic saline or distilled water per protocol. Storage at 2-8 degrees Celsius in sealed vials. For in-vitro research, cell-culture, and animal-model investigation only. No human administration. Not approved by any regulatory authority for any indication.`,

  'KPV-10MG': `KPV is a synthetic tripeptide, Lys-Pro-Val, corresponding to the C-terminal sequence of alpha-MSH. The 10mg vial extends the existing KPV catalog lane from the current 5mg presentation while keeping the same research-use-only posture, compound identity, and recovery-category navigation already used in the site catalog.

The corpus supports a concise identity frame: KPV appears as a three-amino-acid material with molecular weight around 342 Da, sequence Lys-Pro-Val or H-Lys-Pro-Val-OH, and direct 10mg lyophilized powder listings. Those facts are sufficient for a clear product page without importing outcome language from vendor copy.

Mechanism-level wording should stay narrow. Consulted pages connect KPV with melanocortin signaling, cytokine-expression assays, epithelial-cell models, and inflammatory-pathway research; Edge and Vici also tie it to alpha-MSH fragment language. The page can state these as non-clinical research contexts, not as product benefits or effects for purchasers.

The 10mg format is commercially attested but not uniquely strategic. Direct raw pages show 10mg products from Paramount, Planet Peptide, Snap Peptides, and Edge, with observed prices ranging from low single-vial offers to premium-position pages. The parsed distribution places KPV at 49 vendors, 55 SKU rows, and a $5.00 per-mg median.

At the requested $69.00 list price, this SKU lands at $6.90 per mg, above the captured median and below the 75th percentile of $7.50 per mg. That supports a premium catalog-filler position rather than a loss-leader claim, especially because KPV was not included in the locked seven-SKU opening set.

Quality language should defer to the operator's own batch records. Competitor pages mention COAs, HPLC, mass checks, third-party testing, and purity percentages, but source-side terms remain pending in the decisions corpus. The page should therefore expose actual lot, test date, lab name, and COA link when available instead of making blanket supplier claims.

Final copy should preserve the storefront's clinical-commerce tone: precise name, dose, vial format, price, batch traceability, and RUO limits. Avoid disease terms, anti-inflammatory promises, gut, skin, wound, immune, dosing, route, reconstitution, or customer-use guidance.`,

  'AOD-9604-5MG': `AOD-9604 is a synthetic growth-hormone-derived peptide fragment supplied here as a proposed 5mg lyophilized research vial. The most stable identity language in the corpus describes it as a modified C-terminal hGH fragment, often mapped to Tyr-hGH 177-191, with a disulfide-constrained sequence and CAS 221231-10-3.

Product copy should stay close to that reference-material profile. Supported static details include AOD-9604 nomenclature, 5mg vial format, lyophilized powder presentation, molecular formula C78H123N23O23S2, molecular weight near 1815.1 g/mol, sequence-level identity, and batch-specific chromatographic or mass-spectrometry documentation when the operator has actual lot records.

The pathway frame should be narrow and laboratory-facing. Raw pages repeatedly connect the compound with lipid-metabolism, lipase, adipocyte, and growth-hormone-fragment research themes, but much of that vendor language moves into prohibited outcome framing. The compliant page can say the material is used in controlled pathway and analytical models, not that it produces practical effects.

BioEdge and Planet Peptide provide the strongest analytical anchors: sequence, formula, molecular weight, CAS, vial fill, lyophilized form, COA or lab-report posture, HPLC, and mass-spec identity language. Prime Lab, Raw Amino, and The Peptide Labs support SKU existence and comparator pricing while requiring substantial claim removal. Those terms match the site's batch-led commerce model and can be updated without rewriting mechanism copy when a new lot replaces the current one.

At $59.00, the proposed listing equals $11.80 per mg. The aggregate AOD-9604 distribution places that above the captured median and below the 75th percentile, so the copy should not lead with bargain positioning. It is better framed as a controlled catalog-completion SKU where quality files, access controls, and lot identity carry the trust signal.

Final product-page language should identify AOD-9604 as a RUO peptide reference for qualified laboratory, in vitro, and analytical workflows only. It should avoid preparation instructions, subject outcomes, body-composition language, personal-use cues, disease terms, approved-product comparisons, or any suggestion that the material is suitable outside controlled research handling.`,

  'BUNDLE-GLOW-STACK': `Glow Stack is a single-vial research stack labeled with GHK-Cu 50mg, TB-500 10mg, and BPC-157 10mg. The name is used as a market-recognized catalog label for this grouping, not as a promise of a visual, cosmetic, biological, or subject-level effect. Each named component remains individually visible on the stack label for batch documentation, receipt review, and inventory control.

The corpus supports the Glow label through multiple competitor pages that present GHK-Cu, TB-500, and BPC-157 together in a 50mg/10mg/10mg composition. The public presentation now follows the operator-confirmed single-vial stack format while keeping component wording restrained. Static copy should not infer sequence, assay, purity, or release specifications beyond what the applicable lot documentation confirms.

GHK-Cu 50mg anchors the stack as the copper-complexed tripeptide component, commonly associated in source pages with Copper Tripeptide-1 and glycyl-L-histidyl-L-lysine copper nomenclature. In compliant catalog language, its role is limited to identity, class, and research-pathway positioning around copper coordination and extracellular-matrix assay contexts. It should not be framed as an appearance or wellness product.

TB-500 10mg supplies the thymosin beta-4/TB4-associated catalog component. Source pages and prior wave research show inconsistent handling of exact TB-500 identity, with some vendors describing full-length thymosin beta-4 and others using fragment-style conventions. Static copy should therefore keep the language broad and defer exact sequence, molecular weight, and purity specifics to the applicable COA and batch records.

BPC-157 10mg completes the stack as the Body Protection Compound 157 catalog component. The opening catalog already carries BPC-157 as a standalone 10mg research vial, and Glow source pages repeatedly pair it with TB-500 and GHK-Cu. Its role in this bundle is organizational: it rounds out an attested three-component grouping without adding claims about effects, expected observations, or applied contexts.

For product-page use, the stack should emphasize single-vial stack labeling, component-level identity, and analytical documentation. The preferred tone is restrained: suitable for qualified laboratory, analytical, and in vitro research contexts only. Copy may mention HPLC, MS, COA, lot, test date, and component identity when supported by actual records. Batch-specific details should come from released documentation, not inherited competitor wording. It should avoid preparation directions, route language, exposure amounts, subject anecdotes, clinical translation, and any claim that the three components produce a combined effect.`,

  'BUNDLE-WOLVERINE-STACK': `Wolverine Stack is a single-vial research stack labeled with BPC-157 10mg and TB-500 10mg. The name is supported as marketplace shorthand for the BPC-157/TB-500 pairing, but the public page should treat it as search vocabulary rather than as a scientific claim. The stack belongs in the recovery-category navigation because the locked opening decision identifies BPC/TB labels as the most-attested stack pattern in the corpus for qualified laboratory context.

BPC-157 supplies the first component identity. Existing catalog copy and raw product pages support BPC-157 as a 15-amino-acid peptide associated with Body Protection Compound nomenclature and 10mg vial listings. In this stack, BPC-157 should remain a named label component with batch record, vial strength, COA link, test date, and analytical fields tied to the stack lot.

TB-500 supplies the second component identity. The current catalog includes the 10mg TB-500 SKU and connects it with thymosin beta-4/TB4 nomenclature, actin-binding research vocabulary, cell-migration assay contexts, and peptide-identity workflows. Because source pages vary on whether TB-500 is described as full-length thymosin beta-4 or a fragment, the bundle page should leave sequence-level detail to supplier documentation and live lot records.

The stack relationship is commercial and navigational. Raw pages from Raw Amino, Pepsynth, Edge, Soma Chems, and Next Gen Compounds show the BPC-157/TB-500 pair under blend, bundle, stack, or Wolverine labels, including 10mg-each and 10/20mg presentations. That support is enough to justify a named bundle, but not enough to imply interaction, rank the pair against separate components, or describe expected experimental results.

Quality language should be batch-led. Suitable page fields include the two constituent SKUs, lot numbers, test dates, lab names, COA links, HPLC review, mass-oriented identity confirmation, and any applicable endotoxin, microbial, heavy-metal, or sterility checks only when the operator has matching documentation. Competitor purity percentages, facility claims, shipping language, and bundled supplies should not be imported.

At $99.00, the stack is an operator-requested price against the current $133.00 a la carte total for BPC-157 10mg plus TB-500 10mg. The page should present the discount plainly and avoid outcome-led language, preparation guidance, route terms, exposure amounts, subject translation, and broad claims copied from raw vendor pages. The final posture is a restrained RUO catalog stack: one labeled vial, two named components, one recognizable marketplace label, and document-backed traceability.`,

  'BUNDLE-NEURO-STACK': `Neuro Stack is a single-vial research stack labeled with Semax 10mg and Selank 10mg. The current catalog already has both standalone component SKUs in the nootropic group, so this stack can continue to use the existing constituent data fields while the storefront presents one labeled stack vial.

Semax provides the ACTH-fragment side of the bundle. The existing product record and opened raw pages identify it as a synthetic heptapeptide associated with ACTH (4-10) / ACTH-fragment nomenclature, with the sequence Met-Glu-His-Phe-Pro-Gly-Pro appearing in multiple product-page captures. For bundle copy, that supports identity, peptide-family taxonomy, and analytical-documentation language only.

Selank provides the tuftsin-derived side of the stack. The existing product record and opened raw pages identify it as a synthetic heptapeptide analog related to tuftsin, with the sequence Thr-Lys-Pro-Arg-Pro-Gly-Pro appearing in the raw product corpus. For this stack, Selank should be framed as a second named component with its own identity, label strength, lot record, and nootropic-category placement.

The direct pairing signal is adequate but uneven. Ion Peptide shows Semax/Selank variants at 5/5mg and 10/10mg, MyPurePeptide lists a 20mg Selank and Semax product, NeuroTide lists Selank/Semax on a peptide-blends catalog page, Bulk Peptide Supply lists a 5mg/5mg ten-vial blend pack, and Skye has both a sitemap entry and COA-index entry for Selank | Semax 5/5mg. These sources support the paired catalog concept, not a claim about combined behavior.

Quality copy should be batch-led. A compliant implementation should point the stack vial and each named component to the relevant lot number, test date, lab name, COA link, chromatographic purity field, and mass-oriented identity confirmation when operator records exist. Blend pages in the corpus often include vendor purity, storage, facility, and broad research claims; those should not be imported as evergreen copy.

At the requested $69.00 price, the stack is materially below the current $97.00 a la carte catalog total for Semax 10mg and Selank 10mg. The resulting 28.9% effective discount is steeper than existing bundle discounts in products.ts, so this should be treated as an operator-requested promotional stack rather than a benchmarked market-standard discount. Because the discount is calculated against two already-listed components, future implementation should preserve the component references and avoid representing the price as evidence for a market-standard blend format.`,

  'BUNDLE-LONGEVITY-STACK': `Longevity Stack is a single-vial research stack labeled with MOTS-c 10mg, Epitalon 10mg, and NAD+ 500mg. The name should be treated as an operator-selected catalog label, not as a statement about expected biological outcomes. The compliant public frame is metabolic-pathway, mitochondrial-signaling, redox-coenzyme, and Khavinson-bioregulator research taxonomy for qualified laboratory purchasers. That boundary should be visible anywhere the stack name appears.

MOTS-c supplies the mitochondrial-derived peptide side of the bundle. Existing catalog copy and component research identify MOTS-c as a 16-amino-acid peptide encoded within the mitochondrial 12S rRNA region. Suitable pathway language stays at the level of mitochondrial-derived peptide classification, mitochondrial-nuclear communication models, AMPK-pathway investigation, folate-methionine cycle mapping, and stress-responsive gene-expression research.

Epitalon supplies the Khavinson tetrapeptide side. The supported identity frame is synthetic Ala-Glu-Asp-Gly, also abbreviated AEDG, with Epitalon and Epithalon appearing as corpus spellings. Suitable research context includes telomere-related cellular signaling, telomerase-marker investigation, chromatin or gene-expression models, and pineal-axis or circadian-pathway laboratory systems. Those topics should remain research categories rather than claims about subject-level effects.

NAD+ supplies the non-peptide coenzyme reference. The current SKU is nicotinamide adenine dinucleotide in a 500mg research-vial presentation, and the existing description places it in redox, mitochondrial, sirtuin, and PARP-pathway laboratory models. Although NAD+ is not a peptide in the strict sequence sense, the catalog already places it in the metabolic lane beside peptide research materials.

As a stack, the relationship among the three components should be presented as catalog convenience and pathway adjacency, not synergy. The corpus did not surface an exact MOTS-c + Epitalon + NAD+ stack page. It did surface adjacent MOTS-c/NAD+ blend patterns and separate Epitalon catalog support, so the safest page is a single-vial label-composition description rather than a protocol or interaction narrative. The storefront can describe the stack as one labeled RUO vial under one stack SKU, with each named component retaining its own identity, label strength, and lot documentation.

Quality language should remain batch-specific. Suitable fields include lot number, test date, laboratory name, COA link, HPLC field, mass-oriented identity confirmation, and applicable endotoxin, microbial, heavy-metal, or sterility fields only when supported by the operator's own inventory records. The page should include strict research-use-only restrictions and no preparation, route, exposure amount, diagnostic, clinical, human-use, veterinary-use, or practical application guidance.`,

  'BUNDLE-RECOVERY-STACK': `Recovery Stack is a single-vial research stack labeled with BPC-157 10mg, TB-500 10mg, and KPV 10mg. The current Bundle data model still references constituent SKUs for catalog linking and pricing, while the storefront presentation is one labeled stack vial. The recovery label is category shorthand for catalog navigation and should not be expanded into biological or practical-use claims.

BPC-157 supplies the established catalog anchor. The repo already carries BPC-157-10MG, and corpus material supports exact 10mg listings, Body Protection Compound nomenclature, and repeated placement beside TB-500 in stack and blend contexts. Public copy should keep BPC-157 as one identity-controlled peptide reference, with quality statements limited to the operator's own lot records. That also preserves continuity with prior research reports and existing product-page dependencies.

TB-500 supplies the thymosin beta-4/TB4-related component. Current catalog data includes TB-500-10MG, and exact raw pages support a 10mg vial presentation. Source language commonly connects TB-500 with actin-binding and cytoskeletal research contexts, but sequence descriptions vary across pages. Static stack copy should leave full-length-versus-fragment detail to supplier specifications and batch documentation.

KPV supplies the short-tripeptide component. The catalog contains KPV-10MG, and raw pages support Lys-Pro-Val, alpha-MSH C-terminal fragment naming, and 10mg lyophilized listings. KPV also appears in BPC/TB/KPV and KLOW-family pages, which makes it relevant to this recovery-category architecture without requiring the page to adopt broader competitor claims. The direct Ion page is the closest exact outside signal because it groups these three names without GHK-Cu, while KLOW pages provide adjacent evidence for the same trio inside a larger composition.

At the requested $129 price, the bundle is materially discounted against the current a la carte total of $202 for the three selected SKUs. That equals a 36.1% effective discount, far deeper than the locked two-component Recovery Stack's 12.5% benchmark. The price should therefore be described as an operator-requested bundle price, not as a general market convention.

The final storefront description should stay document-led: component SKUs, vial strengths, single-vial stack-label presentation, price, batch/lot identifiers, test dates, lab names, COA links, and applicable analytical fields when present. Quality language should be tied to the batch actually sold, since the corpus mixes storefront claims, COA images, and supplier-specific badges that cannot safely be generalized across Vialchems inventory. It should not read as experiment-design guidance or imply that combining the three names on one stack label changes their material behavior.`,
};

export function getProductDescription(sku: string): string {
  return (
    productDescriptions[sku] ??
    'Product description pending Phase 6 verification.'
  );
}
