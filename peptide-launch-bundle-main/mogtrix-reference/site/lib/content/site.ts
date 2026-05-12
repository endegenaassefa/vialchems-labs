export const siteConfig = {
  name: "MOGTRIX",
  domain: "mogtrix.bio",
  description:
    "Private research-use-only storefront for qualified peptide buyers, with public catalog preview, gated pricing, batch lookup, and a hosted US pilot checkout.",
  legalVersion: "2026-04-draft-1",
  attorneyNotice:
    "Draft legal language for product and engineering review only. Final wording must be reviewed by qualified counsel before launch."
};

export const sharedResearchLinks = [
  { href: "/coa", label: "COA Library" },
  { href: "/testing", label: "Testing" },
  { href: "/faq", label: "FAQ" }
];

export const publicNav = [
  { href: "/categories", label: "Shop Preview" },
  ...sharedResearchLinks,
  { href: "/access", label: "Request Access" },
  { href: "/legal", label: "Policies" }
];

export const footerExploreLinks = [
  { href: "/shop", label: "Shop" },
  ...sharedResearchLinks
];

export const footerPolicyLinks = [
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/shipping", label: "Shipping, Refunds & Returns" },
  { href: "/legal/mta", label: "Material Transfer Agreement" },
  { href: "/legal/qualification", label: "Qualification & Access Rules" }
];

export const adminNav = [{ href: "/admin", label: "Admin" }];

export const privateNav = [
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Cart" }
];
