export type Category = {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  detail: string;
  visual: string;
  controls: string[];
};

export const categories: Category[] = [
  {
    slug: "recovery-research-references",
    eyebrow: "Private catalog",
    title: "Recovery Research References",
    summary:
      "BPC-157 and TB-500 blend records structured for qualified laboratory review.",
    detail:
      "Exact availability, lot documents, and transfer discussions remain gated behind access review.",
    visual: "/visuals/category-reference-v2.png",
    controls: ["COA-ready records", "Lot traceability", "Access review required"]
  },
  {
    slug: "gh-pathway-references",
    eyebrow: "Research-use boundary",
    title: "GH Pathway References",
    summary:
      "CJC-1295, Ipamorelin, and paired pathway reference records with conservative public copy.",
    detail:
      "Public pages avoid preparation guidance, consumer claims, and prices. Qualified users can request additional record access.",
    visual: "/visuals/category-control-v2.png",
    controls: ["Identity review", "Handling documentation", "No public ordering"]
  },
  {
    slug: "neuro-peptide-references",
    eyebrow: "Documentation support",
    title: "Neuro Peptide References",
    summary:
      "Semax, Selank, and Dihexa records organized for controlled analytical review.",
    detail:
      "The first release keeps the customer journey centered on qualification, hosted payment handoff, and staff-managed fulfillment updates.",
    visual: "/visuals/category-records-v2.png",
    controls: ["Batch lookup", "Document status", "Review history"]
  },
  {
    slug: "copper-matrix-records",
    eyebrow: "Private catalog",
    title: "Copper Matrix Records",
    summary:
      "GHK-Cu and multi-peptide blend records presented as private-catalog entries with gated pricing.",
    detail:
      "Public pages preserve catalog context without public commerce, preparation guidance, or personal-use positioning.",
    visual: "/visuals/category-reference-v2.png",
    controls: ["Variant records", "COA routing", "Access review required"]
  },
  {
    slug: "metabolic-longevity-references",
    eyebrow: "Research-use boundary",
    title: "Metabolic and Longevity References",
    summary:
      "HGH Frag, Mazdutide, MOTS-c, FOXO4-DRI, and Humanin records for qualified research review.",
    detail:
      "Availability and documentation remain private until qualification and legal acknowledgement are complete.",
    visual: "/visuals/category-control-v2.png",
    controls: ["Private pricing", "Lot documentation", "No public ordering"]
  }
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export const publicClaimGuardTerms = [
  "weight loss",
  "dosing",
  "inject",
  "injection",
  "treat",
  "treatment",
  "cure",
  "disease"
];
