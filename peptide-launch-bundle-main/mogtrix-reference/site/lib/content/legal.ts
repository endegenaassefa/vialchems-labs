import { siteConfig } from "@/lib/content/site";

export type LegalSection = {
  heading: string;
  body: string[];
};

export type LegalPage = {
  slug: string;
  title: string;
  summary: string;
  sections: LegalSection[];
};

export const legalPages: LegalPage[] = [
  {
    slug: "terms",
    title: "Terms of Service",
    summary:
      "Draft account, access, acceptable-use, and dispute rules for the controlled-access site.",
    sections: [
      {
        heading: "Attorney review required",
        body: [siteConfig.attorneyNotice]
      },
      {
        heading: "Controlled access",
        body: [
          "Access to non-public catalog details requires sign-in, email verification, age attestation, and agreement to current site terms.",
          "MOGTRIX may deny, pause, or revoke access when submitted information is incomplete, inconsistent, or outside the intended research-use scope."
        ]
      },
      {
        heading: "Private checkout",
        body: [
          "Public visitors can browse product previews, but pricing and ordering stay inside verified and qualified customer accounts.",
          "Qualified customers may purchase selected pilot SKUs through hosted offsite payment, with final US shipping and applicable tax shown in the payment window before submission.",
          "Products outside the live checkout pilot continue through the manual request path."
        ]
      },
      {
        heading: "Research-use boundary",
        body: [
          "Materials and documentation referenced by this site are framed for qualified research settings only.",
          "The site must not be used to request medical advice, personal-use instructions, dosing guidance, or consumer treatment recommendations."
        ]
      }
    ]
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    summary:
      "Draft privacy language for access requests, administrative review, verification lookup, and site analytics.",
    sections: [
      {
        heading: "Attorney review required",
        body: [siteConfig.attorneyNotice]
      },
      {
        heading: "Information collected",
        body: [
          "The access form may collect name, email, company or lab name, role, credentials, research environment description, attestations, and typed legal name.",
          "Qualified checkout orders may collect shipping details, line items, order-status history, and hosted payment references, while card details remain with the payment provider.",
          "The verification page may record lookup activity if analytics are enabled in a future release."
        ]
      },
      {
        heading: "Use of information",
        body: [
          "Submitted information is used to review access eligibility, maintain account records, and preserve legal acceptance history.",
          "Administrative users should only access submitted data for qualification review, support, security, or compliance purposes."
        ]
      }
    ]
  },
  {
    slug: "shipping",
    title: "Shipping, Refunds & Returns",
    summary:
      "Draft pilot policy shell for US-only hosted checkout, manual fulfillment review, and account-based follow-up.",
    sections: [
      {
        heading: "Attorney review required",
        body: [siteConfig.attorneyNotice]
      },
      {
        heading: "Pilot shipping scope",
        body: [
          "The first-sale hosted checkout pilot is limited to selected live SKUs shipping to US destinations.",
          "Qualified customers can complete hosted payment, then track payment, review, and shipment updates from their account order timeline."
        ]
      },
      {
        heading: "Payment failure and follow-up",
        body: [
          "If payment fails, expires, or remains pending, the order stays visible in the customer account with a retry or follow-up path instead of disappearing silently.",
          "Orders remain subject to access status, documentation requirements, payment confirmation, and internal operational review before shipment."
        ]
      },
      {
        heading: "Refunds, cancellations, and disputes",
        body: [
          "Customers should use the account order page or support channel to request cancellation, replacement, refund review, or dispute follow-up.",
          "Refund, replacement, and chargeback outcomes may depend on shipment state, provider records, and internal review, and final wording still requires attorney review before wider rollout."
        ]
      }
    ]
  },
  {
    slug: "mta",
    title: "Material Transfer Agreement",
    summary:
      "Draft MTA-style shell for future transfer terms, incorporated only after legal review.",
    sections: [
      {
        heading: "Attorney review required",
        body: [siteConfig.attorneyNotice]
      },
      {
        heading: "Intended recipient",
        body: [
          "The recipient should be a qualified organization or individual acting within a documented research environment.",
          "The recipient should maintain records that support role, facility, training, and intended research-use representations."
        ]
      },
      {
        heading: "Documentation trail",
        body: [
          "Future material transfers should preserve request, approval, legal acceptance, batch, and shipment records in a traceable audit history.",
          "This draft does not authorize transfers or replace a lawyer-reviewed agreement."
        ]
      }
    ]
  },
  {
    slug: "qualification",
    title: "Qualification & Access Rules",
    summary:
      "Draft rules for access review, attestations, revocation, and administrative oversight.",
    sections: [
      {
        heading: "Attorney review required",
        body: [siteConfig.attorneyNotice]
      },
      {
        heading: "Required attestations",
        body: [
          "Requesters should confirm they are at least 21 years old, trained for research-use material handling, and acting within a qualified environment.",
          "Requesters should agree not to seek personal-use, medical-use, or consumer-use guidance through the site."
        ]
      },
      {
        heading: "Administrative review",
        body: [
          "Private catalog access depends on sign-in, email verification, and qualification attestations recorded on the account.",
          "MOGTRIX may still deny or revoke access when information cannot be verified or the request falls outside the site boundary."
        ]
      }
    ]
  }
];

export function getLegalPage(slug: string) {
  return legalPages.find((page) => page.slug === slug);
}

export const legalNav = legalPages.map(({ slug, title }) => ({
  href: `/legal/${slug}`,
  label: title
}));
