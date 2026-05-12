import type { Product, ProductCategory } from "../types";

export type StorefrontSpecification = {
  label: string;
  value: string;
};

export type StorefrontPanel = {
  id: "description" | "specifications" | "coa-testing" | "shipping";
  label: string;
  paragraphs: string[];
};

type StorefrontSeed = {
  slug: string;
  name: string;
  catalogCode: string;
  category: ProductCategory;
  categorySlug: string;
  categoryTitle: string;
  descriptor: string;
  short: string;
  purity: string;
  form: string;
  vialSize: string;
  batchId: string;
  documentation: string;
  researchFocus: string;
  handlingNote: string;
  storage: string;
  basePriceCents: number;
  description: string[];
  supportingDocuments: string[];
  testingNote: string;
  shippingNote: string;
};

export type StorefrontProductContent = StorefrontSeed & {
  productLine: string;
  trustBadges: string[];
  specifications: StorefrontSpecification[];
  panels: StorefrontPanel[];
  relatedSlugs: string[];
};

export type StorefrontProduct = Product & {
  categorySlug: string;
  categoryTitle: string;
  catalogCode: string;
  descriptor: string;
  short: string;
  purity: string;
  vialSize: string;
  batchId: string;
  documentation: string;
  researchFocus: string;
  handlingNote: string;
  productLine: string;
  displayPrice: string;
  supportingDocuments: string[];
  trustBadges: string[];
  specifications: StorefrontSpecification[];
  panels: StorefrontPanel[];
  relatedSlugs: string[];
};

export type ProductPreview = {
  slug: string;
  name: string;
  catalogCode: string;
  categorySlug: string;
  categoryTitle: string;
  descriptor: string;
  short: string;
  purity: string;
  form: string;
  vialSize: string;
  batchId: string;
  documentation: string;
  researchFocus: string;
  handlingNote: string;
  description: string[];
  documents: string[];
};

const storefrontSeeds: StorefrontSeed[] = [
  {
    slug: "bpc-157-5mg",
    name: "BPC-157 5mg",
    catalogCode: "MGX-REC-BPC-005",
    category: "reference",
    categorySlug: "recovery-research-references",
    categoryTitle: "Recovery Research References",
    descriptor:
      "Pentadecapeptide reference material with batch-level verification context.",
    short:
      "Recovery-line peptide record with visible lot context, quality framing, and signed-in catalog pricing.",
    purity: "COA-ready review",
    form: "Lyophilized powder",
    vialSize: "5mg",
    batchId: "MGX-BPC-2604",
    documentation: "COA-ready record",
    researchFocus: "Cytoprotective signaling review",
    handlingNote: "Qualified research environment and internal SOPs required.",
    storage: "2-8 C unopened. Controlled cold storage after intake.",
    basePriceCents: 4900,
    supportingDocuments: ["Identity summary", "Lot COA status", "Handling note"],
    description: [
      "BPC-157 is surfaced as a controlled reference material for documentation-led signaling review and lot-level verification.",
      "Signed-in customers can inspect the batch code, supporting record status, and storage framing before they move into hosted payment checkout."
    ],
    testingNote:
      "Identity review, purity confirmation, and document release stay tied to the current batch record in the Mogtrix COA Library.",
    shippingNote:
      "Qualified customers can move from cart into hosted payment, then track payment confirmation and fulfillment updates from their account."
  },
  {
    slug: "bpc-157-tb-500-5mg-5mg",
    name: "BPC-157 + TB-500 5mg/5mg",
    catalogCode: "MGX-REC-BT5-010",
    category: "reference",
    categorySlug: "recovery-research-references",
    categoryTitle: "Recovery Research References",
    descriptor:
      "Dual peptide blend record for controlled identity and batch review.",
    short:
      "Blend reference entry with visible pricing, conservative copy, and gated document release.",
    purity: "Document review",
    form: "Lyophilized powder",
    vialSize: "5mg / 5mg",
    batchId: "MGX-BT5-2604",
    documentation: "Document review",
    researchFocus: "Blend identity and stability review",
    handlingNote: "Blend documentation is released only after sign-in and qualification.",
    storage: "2-8 C unopened. Cold-chain logging required after receipt.",
    basePriceCents: 7900,
    supportingDocuments: ["Identity summary", "Blend record", "Storage note"],
    description: [
      "This paired recovery blend is listed for qualified buyers who need a clearer storefront view without opening public-use language or public checkout.",
      "The storefront keeps the blend framed around documentation status, cold-storage expectations, and review-ready batch context."
    ],
    testingNote:
      "Blend lots remain in document-review status until the current identity package and verification memo are cleared for release.",
    shippingNote:
      "Blend orders move through the same hosted payment handoff and staff fulfillment lane as the rest of the private catalog."
  },
  {
    slug: "cjc-1295-no-dac-5mg",
    name: "CJC-1295 No DAC 5mg",
    catalogCode: "MGX-GH-CJC-005",
    category: "analytical",
    categorySlug: "gh-pathway-references",
    categoryTitle: "GH Pathway References",
    descriptor:
      "CJC-1295 reference material record for pathway and identity review.",
    short:
      "GH-pathway peptide listing with visible pricing, batch code, and conservative research framing.",
    purity: "COA-ready review",
    form: "Lyophilized powder",
    vialSize: "5mg",
    batchId: "MGX-CJC-2604",
    documentation: "COA-ready record",
    researchFocus: "GH pathway reference review",
    handlingNote:
      "Private documentation review required before any transfer discussion.",
    storage: "2-8 C unopened. Protect from heat and uncontrolled rehandling.",
    basePriceCents: 6900,
    supportingDocuments: ["Identity summary", "Lot COA status", "Review memo"],
    description: [
      "CJC-1295 No DAC stays framed as a pathway reference record for qualified laboratory buyers browsing the signed-in storefront.",
      "The page emphasizes lot visibility, conservative catalog language, and the current state of verification rather than public-order pressure."
    ],
    testingNote:
      "Current batch release links the peptide listing to the verification index, purity summary, and internal review memo.",
    shippingNote:
      "Cart pricing is visible to qualified customers, and payment moves through the hosted offsite handoff before fulfillment begins."
  },
  {
    slug: "cjc-1295-ipamorelin-5mg-5mg",
    name: "CJC-1295 + Ipamorelin 5mg/5mg",
    catalogCode: "MGX-GH-CJI-010",
    category: "analytical",
    categorySlug: "gh-pathway-references",
    categoryTitle: "GH Pathway References",
    descriptor:
      "Paired peptide blend record for gated identity and documentation review.",
    short:
      "Signed-in blend listing with visible price, blend record status, and conservative transfer language.",
    purity: "Document review",
    form: "Lyophilized powder",
    vialSize: "5mg / 5mg",
    batchId: "MGX-CJI-2604",
    documentation: "Document review",
    researchFocus: "Paired pathway blend review",
    handlingNote:
      "Blend documents and availability are released only after sign-in and qualification.",
    storage: "2-8 C unopened. Maintain internal blend handling logs.",
    basePriceCents: 8200,
    supportingDocuments: ["Identity summary", "Blend record", "Storage note"],
    description: [
      "This paired GH-pathway listing is tuned for a fuller storefront feel while preserving Mogtrix's private-catalog boundaries.",
      "Qualified customers can understand the blend, lot state, and record posture before moving the item into the cart."
    ],
    testingNote:
      "Blend verification stays tied to the batch record and document-release status shown in the library and lookup surfaces.",
    shippingNote:
      "Manual review still stands between the cart and any downstream fulfillment decision."
  },
  {
    slug: "ipamorelin-5mg",
    name: "Ipamorelin 5mg",
    catalogCode: "MGX-GH-IPA-005",
    category: "analytical",
    categorySlug: "gh-pathway-references",
    categoryTitle: "GH Pathway References",
    descriptor:
      "Ipamorelin reference material record for controlled analytical review.",
    short:
      "GH-pathway single-compound listing with clear pricing, specs, and batch lookup context.",
    purity: "COA-ready review",
    form: "Lyophilized powder",
    vialSize: "5mg",
    batchId: "MGX-IPA-2604",
    documentation: "COA-ready record",
    researchFocus: "Ipamorelin analytical review",
    handlingNote: "Documentation access is gated to approved researchers.",
    storage: "2-8 C unopened. Controlled laboratory storage required.",
    basePriceCents: 6300,
    supportingDocuments: ["Identity summary", "Lot COA status", "Review note"],
    description: [
      "Ipamorelin is presented as a signed-in catalog record with visible price, batch framing, and a straightforward route into verification surfaces.",
      "The listing stays explicit about research-only handling and avoids public-facing order or usage language."
    ],
    testingNote:
      "Batch lookup connects the storefront listing to the current document set and review note without exposing unsafe guidance.",
    shippingNote:
      "Checkout creates the order first, then payment confirmation returns by webhook before staff fulfillment starts."
  },
  {
    slug: "semax-5mg",
    name: "Semax 5mg",
    catalogCode: "MGX-NEU-SMX-005",
    category: "reference",
    categorySlug: "neuro-peptide-references",
    categoryTitle: "Neuro Peptide References",
    descriptor:
      "Semax reference material record with gated analytical documentation.",
    short:
      "Neuropeptide listing with visible price, archive-friendly batch info, and private-catalog tone.",
    purity: "COA-ready review",
    form: "Lyophilized powder",
    vialSize: "5mg",
    batchId: "MGX-SMX-2604",
    documentation: "COA-ready record",
    researchFocus: "Semax analytical review",
    handlingNote: "Batch documents are released only after sign-in and qualification.",
    storage: "2-8 C unopened. Light-sensitive storage controls recommended.",
    basePriceCents: 5900,
    supportingDocuments: ["Identity summary", "Lot COA status", "Storage note"],
    description: [
      "Semax appears in the storefront as a fuller neuropeptide record with catalog pricing, document framing, and verification-ready batch copy.",
      "The signed-in page gives qualified buyers enough context to compare records without turning the site into a public order surface."
    ],
    testingNote:
      "Current lot status, supporting documents, and release timing remain visible through the lookup and library surfaces.",
    shippingNote:
      "Hosted payment keeps the order tied to your account and gives staff a single fulfillment lane after payment confirmation."
  },
  {
    slug: "selank-5mg",
    name: "Selank 5mg",
    catalogCode: "MGX-NEU-SEL-005",
    category: "reference",
    categorySlug: "neuro-peptide-references",
    categoryTitle: "Neuro Peptide References",
    descriptor:
      "Selank reference material record for identity and documentation review.",
    short:
      "Neuropeptide storefront listing with lot context, pricing, and conservative documentation language.",
    purity: "Document review",
    form: "Lyophilized powder",
    vialSize: "5mg",
    batchId: "MGX-SEL-2604",
    documentation: "Document review",
    researchFocus: "Selank analytical review",
    handlingNote: "Qualified research environment and internal SOPs required.",
    storage: "2-8 C unopened. Track secondary containment after receipt.",
    basePriceCents: 6100,
    supportingDocuments: ["Identity summary", "Lot COA status", "Review note"],
    description: [
      "Selank is shown with the richer signed-in storefront presentation: clearer specs, visible pricing, and batch status without public checkout.",
      "The copy stays inside Mogtrix's private-catalog voice and emphasizes documentation over hype."
    ],
    testingNote:
      "This lot remains in document-review status until the current memo and archive packet are cleared for customer release.",
    shippingNote:
      "Fulfillment updates stay inside the signed-in storefront, with shipment updates returning to the customer account after staff action."
  },
  {
    slug: "dihexa-5mg",
    name: "Dihexa 5mg",
    catalogCode: "MGX-NEU-DHX-005",
    category: "reference",
    categorySlug: "neuro-peptide-references",
    categoryTitle: "Neuro Peptide References",
    descriptor:
      "Dihexa reference material record with private documentation review.",
    short:
      "Batch-coded neuropeptide listing with visible pricing, support docs, and verification framing.",
    purity: "COA-ready review",
    form: "Lyophilized powder",
    vialSize: "5mg",
    batchId: "MGX-DHX-2604",
    documentation: "COA-ready record",
    researchFocus: "Dihexa analytical review",
    handlingNote:
      "Private documentation review required before any transfer discussion.",
    storage: "2-8 C unopened. Monitor storage state through internal lab logs.",
    basePriceCents: 9500,
    supportingDocuments: ["Identity summary", "Lot COA status", "Review memo"],
    description: [
      "Dihexa is positioned as a fuller private-catalog listing with a visible batch record, resource links, and signed-in pricing.",
      "The storefront avoids public-order pressure while giving qualified buyers a more complete peptide page."
    ],
    testingNote:
      "Verification stays tied to the lot summary, document release packet, and library-facing lookup state.",
    shippingNote:
      "The item can be carted today, but non-pilot SKUs still move through the manual request path rather than hosted payment."
  },
  {
    slug: "ghk-cu-50mg-100mg",
    name: "GHK-Cu 50mg / 100mg",
    catalogCode: "MGX-COP-GHK-050100",
    category: "handling",
    categorySlug: "copper-matrix-records",
    categoryTitle: "Copper Matrix Records",
    descriptor:
      "Copper peptide variant record with gated documentation and batch review.",
    short:
      "Variant storefront listing with visible pricing, multi-strength context, and lot-linked documentation.",
    purity: "COA-ready review",
    form: "Lyophilized powder",
    vialSize: "50mg / 100mg",
    batchId: "MGX-GHK-2604",
    documentation: "COA-ready record",
    researchFocus: "Copper peptide variant review",
    handlingNote:
      "Variant-specific documents are released only after sign-in and qualification.",
    storage: "2-8 C unopened. Track variant handling under the same batch log.",
    basePriceCents: 7200,
    supportingDocuments: ["Identity summary", "Variant record", "Storage note"],
    description: [
      "GHK-Cu is shown as a stronger signed-in storefront record with variant context, pricing, and a direct path into lookup surfaces.",
      "The page keeps the language rooted in qualification, batch traceability, and document release."
    ],
    testingNote:
      "Variant records stay linked to the batch summary, support documents, and verification status shown in the library.",
    shippingNote:
      "The cart preserves selected variants, then hands payment offsite before staff fulfillment picks up the order."
  },
  {
    slug: "ghk-cu-bpc-157-tb-500-blend",
    name: "GHK-Cu + BPC-157 + TB-500 Blend",
    catalogCode: "MGX-COP-GBT-TRI",
    category: "handling",
    categorySlug: "copper-matrix-records",
    categoryTitle: "Copper Matrix Records",
    descriptor:
      "Three-component peptide blend record for controlled identity review.",
    short:
      "Tri-blend storefront record with visible price, lot framing, and conservative review language.",
    purity: "Document review",
    form: "Lyophilized powder",
    vialSize: "Blend record",
    batchId: "MGX-GBT-2604",
    documentation: "Document review",
    researchFocus: "Multi-peptide blend documentation review",
    handlingNote:
      "Blend documentation and availability remain gated behind access review.",
    storage: "2-8 C unopened. Maintain blend-specific intake records.",
    basePriceCents: 10900,
    supportingDocuments: ["Identity summary", "Blend record", "Lot COA status"],
    description: [
      "This tri-blend record is tuned for the hybrid storefront pass: fuller detail, clearer pricing, and batch-linked support context.",
      "Qualified customers see a denser peptide page without any shift into public checkout or public-use guidance."
    ],
    testingNote:
      "Blend verification remains in document review until the current packet is cleared for customer release.",
    shippingNote:
      "Checkout preserves the line item, hands payment offsite, and returns staff-confirmed order updates in the same account timeline."
  },
  {
    slug: "hgh-frag-176-191-5mg",
    name: "HGH Frag 176-191 5mg",
    catalogCode: "MGX-ML-HGF-005",
    category: "analytical",
    categorySlug: "metabolic-longevity-references",
    categoryTitle: "Metabolic and Longevity References",
    descriptor:
      "HGH fragment reference material record for controlled analytical review.",
    short:
      "Metabolic-line listing with pricing, specs, and batch-level verification context.",
    purity: "COA-ready review",
    form: "Lyophilized powder",
    vialSize: "5mg",
    batchId: "MGX-HGF-2604",
    documentation: "COA-ready record",
    researchFocus: "Fragment analytical review",
    handlingNote: "Documentation access is gated to approved researchers.",
    storage: "2-8 C unopened. Record cold storage after laboratory intake.",
    basePriceCents: 6800,
    supportingDocuments: ["Identity summary", "Lot COA status", "Review note"],
    description: [
      "HGH Frag 176-191 is presented with the same fuller storefront presentation: visible price, batch code, and a clearer verification path.",
      "The signed-in page stays explicit about private-catalog boundaries and manual downstream review."
    ],
    testingNote:
      "Verification stays tied to the current lot release and support packet, surfaced through the library and lookup interfaces.",
    shippingNote:
      "The cart-to-checkout step hands payment offsite and returns fulfillment status updates to the same customer order timeline."
  },
  {
    slug: "mazdutide-10mg",
    name: "Mazdutide 10mg",
    catalogCode: "MGX-ML-MAZ-010",
    category: "analytical",
    categorySlug: "metabolic-longevity-references",
    categoryTitle: "Metabolic and Longevity References",
    descriptor:
      "Mazdutide analog reference record with gated analytical documentation.",
    short:
      "Metabolic-line storefront listing with visible pricing, lot context, and conservative catalog copy.",
    purity: "Document review",
    form: "Lyophilized powder",
    vialSize: "10mg",
    batchId: "MGX-MAZ-2604",
    documentation: "Document review",
    researchFocus: "Mazdutide analog pathway review",
    handlingNote:
      "Batch documents and availability are released only after sign-in and qualification.",
    storage: "2-8 C unopened. Protect from uncontrolled thaw cycles.",
    basePriceCents: 9800,
    supportingDocuments: ["Identity summary", "Lot COA status", "Review memo"],
    description: [
      "Mazdutide is shown as a richer signed-in peptide record with visible pricing, category context, and the current document status.",
      "The storefront keeps the page practical for qualified buyers without opening public sales language."
    ],
    testingNote:
      "This listing stays in document review until the current support packet clears release checks in the library workflow.",
    shippingNote:
      "Qualified customers can hold the item in cart, request hosted payment at checkout, and then follow fulfillment progress from their account."
  },
  {
    slug: "mots-c-10mg-40mg",
    name: "MOTS-c 10mg / 40mg",
    catalogCode: "MGX-ML-MOT-010040",
    category: "analytical",
    categorySlug: "metabolic-longevity-references",
    categoryTitle: "Metabolic and Longevity References",
    descriptor:
      "Mitochondrial peptide variant record with private documentation review.",
    short:
      "Variant metabolic listing with visible price, two-strength context, and batch-linked support detail.",
    purity: "COA-ready review",
    form: "Lyophilized powder",
    vialSize: "10mg / 40mg",
    batchId: "MGX-MOT-2604",
    documentation: "COA-ready record",
    researchFocus: "MOTS-c variant identity review",
    handlingNote:
      "Variant-specific documents remain private until sign-in and qualification.",
    storage: "2-8 C unopened. Record variant selection before downstream handling.",
    basePriceCents: 8900,
    supportingDocuments: ["Identity summary", "Variant record", "Storage note"],
    description: [
      "MOTS-c is surfaced with fuller storefront density so customers can compare strengths, document posture, and batch context in one place.",
      "The page stays inside the private Mogtrix voice while routing next steps into hosted payment rather than a public purchase flow."
    ],
    testingNote:
      "Batch lookup links each strength variant back to the shared record set and release status.",
    shippingNote:
      "The hosted payment handoff preserves the selected variant and returns fulfillment updates through the customer account timeline."
  },
  {
    slug: "foxo4-dri-10mg",
    name: "FOXO4-DRI 10mg",
    catalogCode: "MGX-ML-FOX-010",
    category: "analytical",
    categorySlug: "metabolic-longevity-references",
    categoryTitle: "Metabolic and Longevity References",
    descriptor:
      "FOXO4-DRI reference material record for controlled identity review.",
    short:
      "Longevity-line storefront listing with visible price, clear specs, and review-driven batch framing.",
    purity: "Document review",
    form: "Lyophilized powder",
    vialSize: "10mg",
    batchId: "MGX-FOX-2604",
    documentation: "Document review",
    researchFocus: "FOXO4-DRI analytical review",
    handlingNote:
      "Private documentation review required before any transfer discussion.",
    storage: "2-8 C unopened. Keep storage logs with the batch record.",
    basePriceCents: 11900,
    supportingDocuments: ["Identity summary", "Lot COA status", "Review note"],
    description: [
      "FOXO4-DRI is listed with the fuller signed-in storefront presentation: visible pricing, detailed spec rows, and document-aware batch context.",
      "The page remains careful about its research-only framing and downstream review posture."
    ],
    testingNote:
      "Release status remains tied to the current review note, lot record, and COA library surface.",
    shippingNote:
      "No online payment is collected. Checkout hands the cart into review for qualification and follow-up."
  },
  {
    slug: "humanin-10mg",
    name: "Humanin 10mg",
    catalogCode: "MGX-ML-HUM-010",
    category: "analytical",
    categorySlug: "metabolic-longevity-references",
    categoryTitle: "Metabolic and Longevity References",
    descriptor:
      "Humanin reference material record with gated analytical documentation.",
    short:
      "Signed-in longevity-line listing with pricing, batch context, and verification-aware copy.",
    purity: "COA-ready review",
    form: "Lyophilized powder",
    vialSize: "10mg",
    batchId: "MGX-HUM-2604",
    documentation: "COA-ready record",
    researchFocus: "Humanin analytical review",
    handlingNote: "Documentation access is gated to approved researchers.",
    storage: "2-8 C unopened. Preserve chain-of-custody records after receipt.",
    basePriceCents: 7600,
    supportingDocuments: ["Identity summary", "Lot COA status", "Storage note"],
    description: [
      "Humanin rounds out the signed-in storefront with a fuller peptide page built around pricing, support documents, and batch-level review.",
      "The copy stays practical for qualified buyers while preserving Mogtrix's private-catalog boundaries."
    ],
    testingNote:
      "The library and lookup surfaces expose the current release date, support documents, and batch status for this record.",
    shippingNote:
      "The cart can hold the item today, but the checkout boundary still routes into review before any operational next step."
  }
];

function createSpecifications(product: StorefrontSeed): StorefrontSpecification[] {
  return [
    { label: "Catalog code", value: product.catalogCode },
    { label: "Batch code", value: product.batchId },
    { label: "Purity / record", value: product.purity },
    { label: "Format", value: product.form },
    { label: "Vial size", value: product.vialSize },
    { label: "Storage", value: product.storage }
  ];
}

function createPanels(product: StorefrontSeed): StorefrontPanel[] {
  return [
    {
      id: "description",
      label: "Description",
      paragraphs: [
        ...product.description,
        `${product.name} stays framed for qualified research settings only. Mogtrix does not surface public-use guidance through signed-in product pages.`
      ]
    },
    {
      id: "specifications",
      label: "Specifications",
      paragraphs: [
        `This lot is tracked under ${product.documentation.toLowerCase()} and is surfaced with the current batch code, storage note, and catalog identifier for qualified review.`
      ]
    },
    {
      id: "coa-testing",
      label: "COA & Testing",
      paragraphs: [
        product.testingNote,
        `Supporting record sets may include ${product.supportingDocuments.join(", ").toLowerCase()}. Use the COA Library and batch lookup to review current release status.`
      ]
    },
    {
      id: "shipping",
      label: "Shipping",
      paragraphs: [
        "Qualified customers can move from cart into protected checkout with shipping, payment, and account-based order tracking kept inside the storefront.",
        "After payment succeeds, order status, shipment context, and the next operational step stay visible from the account order detail page."
      ]
    }
  ];
}

function createTrustBadges(product: StorefrontSeed) {
  return [
    "Research-use-only private catalog",
    "Third-party record review",
    product.documentation
  ];
}

function formatStorefrontPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100);
}

function buildRelatedSlugs(
  product: StorefrontSeed,
  seeds: StorefrontSeed[]
): string[] {
  const sameCategory = seeds
    .filter(
      (candidate) =>
        candidate.slug !== product.slug &&
        candidate.categorySlug === product.categorySlug
    )
    .map((candidate) => candidate.slug);
  const others = seeds
    .filter(
      (candidate) =>
        candidate.slug !== product.slug &&
        candidate.categorySlug !== product.categorySlug
    )
    .map((candidate) => candidate.slug);

  return [...sameCategory, ...others].slice(0, 3);
}

export const storefrontProducts: StorefrontProductContent[] = storefrontSeeds.map(
  (product) => ({
    ...product,
    productLine: product.categoryTitle,
    trustBadges: createTrustBadges(product),
    specifications: createSpecifications(product),
    panels: createPanels(product),
    relatedSlugs: buildRelatedSlugs(product, storefrontSeeds)
  })
);

export const productPreviews: ProductPreview[] = storefrontProducts.map(
  (product) => ({
    slug: product.slug,
    name: product.name,
    catalogCode: product.catalogCode,
    categorySlug: product.categorySlug,
    categoryTitle: product.categoryTitle,
    descriptor: product.descriptor,
    short: product.short,
    purity: product.purity,
    form: product.form,
    vialSize: product.vialSize,
    batchId: product.batchId,
    documentation: product.documentation,
    researchFocus: product.researchFocus,
    handlingNote: product.handlingNote,
    description: product.description,
    documents: product.supportingDocuments
  })
);

export const featuredProductPreviews = productPreviews.slice(0, 4);

export function getProductPreview(slug: string) {
  return productPreviews.find((product) => product.slug === slug);
}

export function getStorefrontProductContent(slug: string) {
  return storefrontProducts.find((product) => product.slug === slug);
}

const productVialVisuals: Record<string, string> = {
  "bpc-157-5mg": "/visuals/products/mogtrix-vials-photo-v1/bpc-157-5mg.png",
  "bpc-157-tb-500-5mg-5mg":
    "/visuals/products/mogtrix-vials-photo-v1/bpc-157-tb-500-5mg-5mg.png",
  "cjc-1295-no-dac-5mg":
    "/visuals/products/mogtrix-vials-photo-v1/cjc-1295-no-dac-5mg.png",
  "cjc-1295-ipamorelin-5mg-5mg":
    "/visuals/products/mogtrix-vials-photo-v1/cjc-1295-ipamorelin-5mg-5mg.png",
  "ipamorelin-5mg": "/visuals/products/mogtrix-vials-photo-v1/ipamorelin-5mg.png",
  "semax-5mg": "/visuals/products/mogtrix-vials-photo-v1/semax-5mg.png",
  "selank-5mg": "/visuals/products/mogtrix-vials-photo-v1/selank-5mg.png",
  "dihexa-5mg": "/visuals/products/mogtrix-vials-photo-v1/dihexa-5mg.png",
  "ghk-cu-50mg-100mg":
    "/visuals/products/mogtrix-vials-photo-v1/ghk-cu-50mg-100mg.png",
  "ghk-cu-bpc-157-tb-500-blend":
    "/visuals/products/mogtrix-vials-photo-v1/ghk-cu-bpc-157-tb-500-blend.png",
  "hgh-frag-176-191-5mg":
    "/visuals/products/mogtrix-vials-photo-v1/hgh-frag-176-191-5mg.png",
  "mazdutide-10mg": "/visuals/products/mogtrix-vials-photo-v1/mazdutide-10mg.png",
  "mots-c-10mg-40mg":
    "/visuals/products/mogtrix-vials-photo-v1/mots-c-10mg-40mg.png",
  "foxo4-dri-10mg": "/visuals/products/mogtrix-vials-photo-v1/foxo4-dri-10mg.png",
  "humanin-10mg": "/visuals/products/mogtrix-vials-photo-v1/humanin-10mg.png"
};

export function getProductVialVisual(product: { slug: string }) {
  return (
    productVialVisuals[product.slug] ??
    "/visuals/products/mogtrix-vials-photo-v1/mazdutide-10mg.png"
  );
}

export function mergeProductWithStorefrontContent(
  product: Product
): StorefrontProduct | null {
  const content = getStorefrontProductContent(product.slug);

  if (!content) return null;

  const priceCents = product.priceCents || content.basePriceCents;

  return {
    ...product,
    name: content.name,
    summary: content.short,
    format: content.form,
    storage: product.storage || content.storage,
    priceCents,
    categorySlug: content.categorySlug,
    categoryTitle: content.categoryTitle,
    catalogCode: content.catalogCode,
    descriptor: content.descriptor,
    short: content.short,
    purity: content.purity,
    vialSize: content.vialSize,
    batchId: content.batchId,
    documentation: content.documentation,
    researchFocus: content.researchFocus,
    handlingNote: content.handlingNote,
    productLine: content.productLine,
    displayPrice: `${formatStorefrontPrice(priceCents)} / vial`,
    supportingDocuments: content.supportingDocuments,
    trustBadges: content.trustBadges,
    specifications: content.specifications,
    panels: content.panels,
    relatedSlugs: content.relatedSlugs
  };
}

export function mergeProductsWithStorefrontContent(products: Product[]) {
  return products
    .map((product) => mergeProductWithStorefrontContent(product))
    .filter((product): product is StorefrontProduct => Boolean(product));
}
