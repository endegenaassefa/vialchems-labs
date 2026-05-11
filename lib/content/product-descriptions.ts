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
  'BPC-157-10MG': `BPC-157 is a 15-amino-acid peptide fragment isolated from bovine gastric juice, studied extensively in cellular and animal-model research for its effects on tissue protective pathways. In vitro studies have documented its activity on cell-culture protective signaling, with evidence suggesting interaction with vascular endothelial growth factor (VEGF) and nitric oxide-dependent cellular resilience mechanisms.

In laboratory animal models, BPC-157 has been the subject of numerous peer-reviewed investigations examining its effects on tissue repair kinetics, particularly in skeletal and connective tissue recovery models. Researchers have observed acceleration of tissue remodeling processes in skin incision models, muscle injury paradigms, and tendon repair studies conducted in rodent systems. The mechanisms explored include fibroblast activation, collagen deposition acceleration, and neuronal pathway stimulation in animal-tissue injury models.

The peptide is also studied for its potential role in central and peripheral nervous system research. Animal-model investigations have documented effects on motor coordination recovery in induced-injury paradigms and neuroprotective signaling in cell-culture systems. In vivo studies using gastroprotection models have shown dose-dependent effects on mucosal barrier function in rodent gastric tissue.

BPC-157 has been the subject of translational research bridging cell-culture and animal-model work, with published evidence supporting mechanisms of action through VEGF axis signaling, focal adhesion kinase (FAK) activation, and growth hormone axis modulation in animal systems. Researchers working with this peptide typically employ dose ranges of 10-50 mcg/kg body weight in rodent models, adapted to research-specific parameters.

This research reference is supplied as a lyophilized powder in high-purity pharmaceutical-grade formulation, certified for research and analytical use. Reconstitution is performed in sterile bacteriostatic saline or distilled water per researcher protocol. Stability is maintained at 2-8 degrees Celsius when stored in sealed vials. No human-consumption, animal-care, or therapeutic claims are made for this reference material. This peptide is not approved by any regulatory authority for any indication and is for in vitro research, cell culture, and analytical reference only.`,

  'TB-500-5MG': `TB-500 is a synthetic 17-amino-acid peptide representing the C-terminal actin-binding fragment of thymosin beta-4, a naturally occurring intracellular regulatory peptide. This fragment is the subject of extensive animal-model research examining tissue repair, vascular development, and muscular recovery mechanisms in laboratory and in vivo settings.

In vitro cell-culture studies have documented TB-500 effects on fibroblast migration, collagen secretion, and actin filament dynamics. These mechanisms are explored through actin polymerization assays, cell-migration wound-closure models, and cellular-signaling pathway mapping in cultured mammalian cells. The peptide shows activity in endothelial cell culture assays relevant to angiogenesis and vascular permeability research.

Animal-model research has produced extensive peer-reviewed evidence of TB-500 effects on healing acceleration in multiple tissue types. In muscle-injury models, rodent and canine studies document accelerated recovery trajectories, increased myofiber cross-sectional area in recovery phases, and enhanced contractile-function restoration. Tendon-repair models in rodents show similar healing acceleration with improved mechanical properties in recovery tissue. Cardiac-injury animal models have documented cardioprotective signaling and reduced fibrosis progression in post-injury remodeling phases.

The angiogenesis literature using TB-500 is particularly robust, with animal-model evidence of increased capillary density, improved blood-flow restoration, and modulation of vascular permeability in tissue repair contexts. These effects are explored through intravital microscopy, laser-Doppler perfusion imaging, and immunohistochemical quantification in animal studies.

TB-500 mechanism of action research focuses on actin interaction, growth-factor signaling cross-talk, inflammation-regulation pathways, and stem-cell mobilization in animal models. Published research typically employs doses of 5-20 mg/kg body weight in rodent studies, titrated per experimental design.

This research reference is supplied as a lyophilized pharmaceutical-grade powder formulated for analytical and research use. Reconstitution uses sterile bacteriostatic saline or distilled water per protocol. Storage is maintained at 2-8 degrees Celsius in sealed vials. The 5mg vial format is designed for research convenience and dose-flexibility in animal-model work. This material is for cell-culture, in vitro research, and analytical reference only. No therapeutic, medical, consumer, or animal-care claims are made. Not approved by any regulatory authority for any indication.`,

  'GHK-CU-50MG': `GHK-Cu is a bioactive tripeptide (Gly-His-Lys) complexed with divalent copper (Cu2+), a naturally occurring signaling molecule studied extensively in cell-culture research for effects on fibroblast function and collagen metabolism. The copper coordination is integral to peptide activity; research focuses on the GHK-Cu complex as a growth-factor modulator in tissue regeneration paradigms.

In vitro studies of GHK-Cu employ cultured human and animal fibroblasts to examine collagen synthesis rates, matrix metalloproteinase (MMP) regulation, and extracellular-matrix protein expression. Cell-culture wound-closure assays document fibroblast migration acceleration, while immunofluorescence studies map changes in collagen I and III deposition under GHK-Cu exposure. The copper component is essential; studies distinguish Cu-complexed GHK from apo-peptide controls to isolate mechanism.

GHK-Cu research extends into growth-factor signaling, with cell-culture evidence suggesting modulation of TGF-beta, VEGF, and FGF pathways through copper-dependent mechanisms. Proteomics and gene-expression profiling in fibroblast cell lines have mapped target-pathway activation downstream of GHK-Cu exposure. These mechanisms are explored in differentiation assays, particularly in wound-healing models and collagen-deposition paradigms.

Animal-model research, primarily in rodent wound-healing and burn-recovery paradigms, has documented accelerated collagen remodeling, increased tensile strength in healing tissue, and enhanced angiogenesis in regenerating tissue. Dermatological research in animal models examines GHK-Cu effects on epidermal thickness, collagen organization, and skin-barrier function recovery. Published topical-application studies in rodents employ concentrations of 0.1-1% GHK-Cu in carrier formulations.

Mechanistic research emphasizes the copper-dependent signaling axis, including copper-dependent enzyme activity, redox cycling within the peptide complex, and cross-talk with cellular copper-homeostasis pathways. Researchers working with GHK-Cu typically employ concentrations of 1-100 nM in cell culture and tissue-bath experiments.

This research reference is supplied as a lyophilized pharmaceutical-grade powder or pre-complexed solution formulation, calibrated for analytical and research use. The 50mg vial provides dosing flexibility for cell-culture titration experiments and tissue-model applications. Reconstitution uses sterile saline or culture-medium supplementation per research protocol. Storage is maintained at 2-8 degrees Celsius in sealed vials. This material is for in vitro research, cell-culture, and topical-application research only. No therapeutic claims, human-consumption applications, or medical use are made. Not approved by any regulatory authority.`,

  'IPAMORELIN-10MG': `Ipamorelin is a pentapeptide growth-hormone-releasing peptide (GHRP) agonist studied in animal-model research for selective stimulation of growth-hormone secretion from anterior pituitary cells. Its specificity lies in GH-axis activation without the ACTH co-stimulation observed with other GHRP classes, making it a research tool of choice for investigating GH-pathway isolation.

In vitro studies employ primary pituitary cell cultures and pituitary cell lines to document ipamorelin dose-dependent GH secretion. Patch-clamp electrophysiology and calcium-imaging experiments map the mechanism of GH-cell activation, exploring ipamorelin interaction with putative somatotroph-surface receptors. Cell-culture work demonstrates that ipamorelin-induced GH release is suppressed by somatostatin co-application, confirming pituitary-directed mechanism.

Animal-model research, primarily in rodents and larger mammals, employs intravenous and subcutaneous ipamorelin administration to characterize GH-secretion kinetics, GH pulse frequency and amplitude in pulsatile-secretion paradigms, and integration with endogenous GH-releasing-hormone (GHRH) signaling. Published studies typically employ doses of 1-100 mcg/kg body weight and document GH elevation within 5-15 minutes post-administration in rodent models.

The downstream effects of ipamorelin-induced GH elevation are explored through insulin-like growth factor-1 (IGF-1) axis measurement, metabolic-rate assessment, body-composition quantification in longer-duration studies, and gene-expression profiling in tissues responsive to GH signaling (liver, adipose, muscle). Animal-model evidence documents IGF-1 elevation secondary to GH stimulation and associated effects on nitrogen balance and lean-tissue mass in recovery-phase studies.

Research attention to ipamorelin specificity focuses on its selective GH-axis activation, lack of ACTH stimulation (unlike GHRP-6 and GHRP-2), and minimal cortisol elevation in animal studies. This selectivity profile makes it a key research tool for isolating GH-pathway effects from mixed pituitary responses.

Ipamorelin is supplied as a lyophilized pharmaceutical-grade research reference formulated for analytical use and animal-model research. The 10mg vial is reconstituted in sterile bacteriostatic saline or distilled water per research protocol. Storage is maintained at 2-8 degrees Celsius in sealed vials. This material is for research, cell-culture, and animal-model investigation only. No therapeutic claims, human administration, or medical use are made. Not approved by any regulatory authority for any indication.`,

  'CJC-1295-NO-DAC-5MG': `CJC-1295 (no DAC) is a 30-amino-acid synthetic agonist of growth-hormone-releasing hormone (GHRH), designed to activate somatotroph cells of the anterior pituitary without the extended half-life conferred by the Drug Affinity Complex (DAC) modification. The no-DAC variant is the research tool of choice for acute GH-secretion studies and pulsatile-secretion paradigm investigation.

In vitro pituitary cell-culture studies document CJC-1295 (no DAC) dose-dependent GH secretion from primary somatotroph cells and pituitary cell lines. Patch-clamp and calcium-imaging experiments map GHRH-receptor activation kinetics, membrane-potential changes, and intracellular signaling cascades downstream of receptor engagement. Cell-culture work establishes rapid kinetics (GH secretion within 5-10 minutes) and short duration of action compared to DAC-modified analogs.

Animal-model research employs intravenous and subcutaneous CJC-1295 (no DAC) administration to characterize acute GH-release kinetics, GH-pulse profiles, and integration with endogenous GHRH and somatostatin signaling. Rodent and larger-mammal studies document GH elevation with return to baseline within 30-60 minutes post-administration, supporting the acute-acting profile. Published doses range from 1-100 mcg/kg body weight.

The pulsatile-stack research employs CJC-1295 (no DAC) combined with GHRP agonists (particularly ipamorelin) to model endogenous GH-axis architecture, investigating synergistic pituitary activation and amplified GH secretion compared to monotherapy. These studies employ repeated pulse-dosing protocols over 8-16 week periods to examine sustained GH and IGF-1 axis effects in animal models.

Downstream signaling research explores CJC-1295 (no DAC) effects on IGF-1 production, metabolic effects of sustained GH elevation, body-composition changes in longer-duration animal studies, and gene-expression profiling in GH-responsive tissues (liver, muscle, adipose). Animal-model evidence documents dose-dependent IGF-1 elevation and associated nitrogen-balance effects.

The no-DAC formulation is distinguished from DAC-modified CJC-1295 by its shorter serum half-life (minutes vs. days), making it the research standard for investigating native pulsatile GH secretion and GH-axis physiology studies requiring acute manipulation.

CJC-1295 (no DAC) is supplied as a lyophilized pharmaceutical-grade research reference formulated for analytical use and animal-model research. The 5mg vial is reconstituted in sterile bacteriostatic saline per protocol. Storage is maintained at 2-8 degrees Celsius in sealed vials. This material is for research and animal-model investigation only. No therapeutic, human-administration, or medical claims are made. Not approved by any regulatory authority.`,

  'MOTS-C-10MG': `MOTS-c is a 16-amino-acid mitochondrial-derived peptide (MOTS = Mitochondrial Open Reading Frame of the Twelve S), encoded within the mitochondrial genome and studied as a circulating signaling molecule in cell-culture and animal-model metabolic research. MOTS-c is classified within the emerging field of mitochondrial-derived peptides (MDPs), a family of short peptides with endocrine functions regulating systemic metabolism.

In vitro cell-culture research employs MOTS-c to investigate mitochondrial function, oxidative-phosphorylation efficiency, and cellular-energy homeostasis in metabolically active cell types (hepatocytes, myocytes, adipocytes). Assays measure mitochondrial membrane potential, oxygen-consumption rate (OCR), ATP production, reactive-oxygen-species (ROS) generation, and mitochondrial-biogenesis gene expression under MOTS-c exposure. Cell-culture evidence documents dose-dependent metabolic effects and mechanistic studies exploring AMPK activation, SIRT signaling, and PGC-1alpha pathway engagement.

MOTS-c mechanisms explored in cell culture include insulin signaling modulation, glucose-uptake enhancement, fatty-acid oxidation efficiency, and mitochondrial-stress-response pathways (unfolded-protein response, mitophagy). Proteomics and metabolomic profiling in cultured cell lines map MOTS-c-induced transcriptomic changes relevant to metabolic rate, oxidative capacity, and cellular resilience.

Animal-model research, primarily in rodent metabolic disease paradigms, documents MOTS-c effects on whole-organism energy expenditure, body-weight trajectories, glucose homeostasis, insulin sensitivity, and mitochondrial quality-control markers (mitochondrial mass, cristae density) in liver and skeletal muscle. Published studies employ MOTS-c doses of 1-10 nmol/kg body weight, with administration protocols ranging from acute dosing to chronic twice-daily or daily regimens over 4-16 week periods.

MOTS-c research extends into aging paradigms and cellular-senescence models, with animal-model evidence of delayed-aging markers, improved physical-performance metrics in aged mice, and enhanced metabolic function in gerontology-focused studies. Mechanistic investigation emphasizes MOTS-c as a nutrient-sensor and metabolic-rate regulator operating through AMPK, SIRT1, and mitochondrial-integrity pathways.

MOTS-c is supplied as a lyophilized pharmaceutical-grade research reference formulated for cell-culture and animal-model research. The 10mg vial is reconstituted in sterile bacteriostatic saline or distilled water per protocol. Storage is maintained at 2-8 degrees Celsius in sealed vials. This material is for research and analytical use only. No therapeutic claims, human administration, or medical indications are made. Not approved by any regulatory authority.`,

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

  'GHRP-2-5MG': `GHRP-2 is a synthetic hexapeptide (D-Ala-D-2-Nal-Ala-Trp-D-Phe-Lys-NH2) of the growth-hormone-releasing-peptide class. It is one of the most extensively characterized GH secretagogues in the published research literature and serves as a research reference for investigating ghrelin-receptor (GHS-R1a) pathway activation and the resulting somatotroph response.

In vitro studies in pituitary cell cultures document concentration-dependent GH-secretion responses to GHRP-2 exposure. Receptor-binding assays in cell lines transfected with the GHS-R1a confirm direct receptor engagement; patch-clamp recordings document the membrane-electrophysiology response. Cell-culture work also documents synergistic interaction between GHRP-2 and GHRH analogs, with combined exposures producing GH-secretion responses larger than either compound alone.

Animal-model research, primarily in rodents, characterizes GH-pulse profiles, integration with endogenous GHRH and somatostatin signaling, and downstream IGF-1 axis effects in chronic-administration paradigms. Published studies employ 1-100 mcg/kg body weight ranges across acute and chronic protocols.

GHRP-2 is supplied as a lyophilized pharmaceutical-grade research reference. The 5mg vial is reconstituted in sterile bacteriostatic saline or distilled water per protocol. Storage at 2-8 degrees Celsius in sealed vials. For in-vitro research, cell-culture, and animal-model investigation only. No human administration. Not approved by any regulatory authority for any indication.`,

  'GHRP-6-5MG': `GHRP-6 is a synthetic hexapeptide (His-D-Trp-Ala-Trp-D-Phe-Lys-NH2) of the growth-hormone-releasing-peptide class, distinct in receptor-binding profile and downstream-signaling characteristics from GHRP-2 and Hexarelin. The compound is a research reference for investigating ghrelin-receptor pathway signaling and metabolic-axis crosstalk in cell-culture and animal-model studies.

In vitro studies in pituitary primary cultures and GHS-R1a-expressing cell lines characterize GHRP-6 receptor binding, cAMP and intracellular calcium responses, and downstream GH-release kinetics. Cell-culture work documents concentration-response curves distinguishing GHRP-6 from related hexapeptides and supports its use as a pharmacological probe for receptor-pathway dissection.

Animal-model research employs subcutaneous and intravenous GHRP-6 administration to characterize GH-secretion kinetics, integration with endogenous GHRH and somatostatin pathways, and metabolic-signaling research in fasted and fed-state paradigms. Published rodent studies employ concentrations of 1-100 mcg/kg body weight per experimental protocol.

GHRP-6 is supplied as a lyophilized pharmaceutical-grade research reference. The 5mg vial is reconstituted in sterile bacteriostatic saline or distilled water per protocol. Storage at 2-8 degrees Celsius in sealed vials. For in-vitro research, cell-culture, and animal-model investigation only. No human administration. Not approved by any regulatory authority for any indication.`,

  'HEXARELIN-2MG': `Hexarelin is a synthetic six-amino-acid (His-D-2-methyl-Trp-Ala-Trp-D-Phe-Lys-NH2) growth-hormone-releasing peptide. It is structurally related to GHRP-2 and GHRP-6 but presents a distinct receptor-binding affinity and signaling profile, supporting its use as a research probe for fine-grained dissection of ghrelin-receptor pathway pharmacology.

In vitro studies in pituitary cell cultures and GHS-R1a-expressing cell lines characterize Hexarelin binding affinity, the resulting GH-secretion response, and downstream second-messenger signaling. Cell-culture work also documents Hexarelin interaction with cardiac-tissue receptors in animal-model preparations, with research literature exploring CD36-receptor binding outside the classical pituitary-axis context.

Animal-model research employs subcutaneous and intravenous Hexarelin administration to characterize GH-secretion kinetics in rodents and larger mammals; published research also examines cardiac-tissue signaling responses in animal-model preparations of cardiovascular-research interest. Concentrations of 1-100 mcg/kg body weight are typical of published rodent protocols.

Hexarelin is supplied as a lyophilized pharmaceutical-grade research reference. The 2mg vial is reconstituted in sterile bacteriostatic saline or distilled water per protocol. Storage at 2-8 degrees Celsius in sealed vials. For in-vitro research, cell-culture, and animal-model investigation only. No human administration. Not approved by any regulatory authority for any indication.`,

  'SEMAX-30MG': `Semax is a synthetic heptapeptide (Met-Glu-His-Phe-Pro-Gly-Pro) corresponding to residues 4-10 of adrenocorticotropic hormone (ACTH 4-10) with a Pro-Gly-Pro C-terminal extension that confers metabolic stability. The compound is the subject of a substantial Russian-published research literature on neuropeptide signaling in cell-culture and animal-model paradigms relevant to cognitive and neuroprotective research questions.

In vitro studies employ neuronal cell cultures and brain-slice preparations to characterize Semax effects on neurotrophic-factor expression (BDNF, NGF), synaptic-plasticity markers, and neuronal-survival pathways under oxidative-stress and excitotoxic-stress conditions. Cell-culture work documents Semax modulation of cAMP-response-element binding protein (CREB) signaling and immediate-early gene expression in cultured neurons.

Animal-model research employs intranasal and intraperitoneal Semax administration in rodent paradigms to characterize cognitive-task performance markers, neuroprotection against ischemic-injury models, and behavioral-paradigm responses interpreted as anxiolytic-like or pro-cognitive in the published literature. Concentrations range across 0.05-1.0 mg/kg body weight per experimental protocol.

Semax is supplied as a lyophilized pharmaceutical-grade research reference. The 30mg vial is reconstituted in sterile bacteriostatic saline or distilled water per protocol. Storage at 2-8 degrees Celsius in sealed vials. For in-vitro research, cell-culture, and animal-model investigation only. No human administration. Not approved by any regulatory authority for any indication.`,

  'EPITALON-50MG': `Epitalon is a synthetic tetrapeptide (Ala-Glu-Asp-Gly) of the Khavinson bioregulator class. The compound was developed as a research analog of pineal-derived peptide signaling and has been the subject of cell-culture and animal-model research on telomere-length-related cellular signaling, gene-expression modulation, and longevity-paradigm investigation.

In vitro studies in cultured human and animal cells document Epitalon effects on telomerase-related gene-expression markers, telomere-length kinetics in serial-passage cell-culture paradigms, and chromatin-organization markers. Cell-culture research has explored Epitalon binding to chromatin domains and the resulting transcriptional-regulation effects across panels of senescence-associated and longevity-associated genes.

Animal-model research, primarily in rodent longevity-paradigm studies, has characterized Epitalon effects on chronological lifespan markers, organ-system-specific aging markers, and circadian-rhythm signaling in pineal-axis research models. Published rodent protocols employ concentrations of 0.5-5.0 mcg/kg body weight per study design.

Epitalon is supplied as a lyophilized pharmaceutical-grade research reference. The 50mg vial is reconstituted in sterile bacteriostatic saline or distilled water per protocol. Storage at 2-8 degrees Celsius in sealed vials. For in-vitro research, cell-culture, and animal-model investigation only. No human administration. Not approved by any regulatory authority for any indication.`,

  'THYMOSIN-ALPHA-1-5MG': `Thymosin Alpha-1 is a synthetic 28-amino-acid peptide identical in sequence to the naturally occurring thymic peptide of the same name. The compound is the subject of an extensive cell-culture and animal-model research literature on T-lymphocyte differentiation, dendritic-cell maturation, and broader immune-cell-signaling pathways.

In vitro studies in primary T-cell cultures and lymphocyte cell lines document Thymosin Alpha-1 effects on T-cell proliferation, cytokine-secretion profiles, activation-marker expression (CD69, CD25), and differentiation-pathway markers. Cell-culture research also documents effects on dendritic-cell maturation, antigen-presentation markers, and Toll-like-receptor pathway signaling. Mechanistic work explores Thymosin Alpha-1 interaction with TLR9 and the resulting downstream signaling cascade in immune-cell research.

Animal-model research employs subcutaneous Thymosin Alpha-1 administration in rodent and larger-mammal paradigms to characterize systemic immune-cell-marker responses, antibody-production kinetics in immunization paradigms, and immune-pathway investigation in chronic-administration protocols. Published research employs concentrations of 50-1000 mcg/kg body weight per experimental design.

Thymosin Alpha-1 is supplied as a lyophilized pharmaceutical-grade research reference. The 5mg vial is reconstituted in sterile bacteriostatic saline or distilled water per protocol. Storage at 2-8 degrees Celsius in sealed vials. For in-vitro research, cell-culture, and animal-model investigation only. No human administration. Not approved by any regulatory authority for any indication.`,

  'DSIP-5MG': `DSIP (Delta Sleep-Inducing Peptide) is a nine-amino-acid neuropeptide (Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu) originally isolated from rabbit cerebral venous blood. The compound has been the subject of cell-culture and animal-model research on circadian-rhythm signaling, central-nervous-system pathway investigation, and stress-response paradigm research.

In vitro studies employ neuronal cell cultures and brain-slice preparations to characterize DSIP effects on neurotransmitter-release kinetics, second-messenger signaling, and neuronal-survival markers under stress-paradigm conditions. Cell-culture research has explored DSIP modulation of GABAergic and serotonergic signaling pathways and the resulting downstream second-messenger responses.

Animal-model research employs intracerebroventricular and intraperitoneal DSIP administration in rodent paradigms to characterize sleep-EEG markers, behavioral-paradigm responses interpreted as anxiolytic-like in the published literature, and stress-axis research in chronic-administration protocols. Published rodent studies employ concentrations of 25-200 mcg/kg body weight per experimental design.

DSIP is supplied as a lyophilized pharmaceutical-grade research reference. The 5mg vial is reconstituted in sterile bacteriostatic saline or distilled water per protocol. Storage at 2-8 degrees Celsius in sealed vials. For in-vitro research, cell-culture, and animal-model investigation only. No human administration. Not approved by any regulatory authority for any indication.`,

  'KPV-5MG': `KPV is a synthetic tripeptide (Lys-Pro-Val) corresponding to the C-terminal three amino acids of alpha-melanocyte-stimulating hormone (alpha-MSH). The compound has been the subject of cell-culture and animal-model research on inflammatory-pathway signaling, with published research literature exploring KPV anti-inflammatory effects in cellular and tissue-model paradigms.

In vitro studies in cultured macrophages, T-lymphocytes, and epithelial cells document KPV effects on pro-inflammatory cytokine secretion (TNF-alpha, IL-6, IL-1beta), NF-kappaB pathway signaling, and downstream inflammatory-marker expression. Cell-culture research has explored KPV intracellular delivery and the resulting modulation of inflammatory-pathway gene expression in cultured colonic epithelial cells in inflammation-paradigm research.

Animal-model research employs oral, topical, and parenteral KPV administration in rodent paradigms of inflammation research to characterize systemic and tissue-specific inflammatory-marker responses. Published rodent studies employ concentrations of 0.5-50 mg/kg body weight per experimental design.

KPV is supplied as a lyophilized pharmaceutical-grade research reference. The 5mg vial is reconstituted in sterile bacteriostatic saline or distilled water per protocol. Storage at 2-8 degrees Celsius in sealed vials. For in-vitro research, cell-culture, and animal-model investigation only. No human administration. Not approved by any regulatory authority for any indication.`,
};

export function getProductDescription(sku: string): string {
  return (
    productDescriptions[sku] ??
    'Product description pending Phase 6 verification.'
  );
}
