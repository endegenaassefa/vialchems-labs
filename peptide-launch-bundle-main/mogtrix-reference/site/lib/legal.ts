export const legalPages = [
  {
    slug: "ruo",
    title: "RUO Disclaimer",
    summary: "Research-use-only boundary and requester responsibility.",
    sections: [
      {
        heading: "Research boundary",
        body: "Mogtrix catalog materials are presented for qualified laboratory research workflows only. Requesters are responsible for lawful procurement, storage, handling, and documentation."
      },
      {
        heading: "No advice",
        body: "Mogtrix does not provide preparation instructions, application guidance, or research protocol design. Requests suggesting consumer or subject-directed use may be refused."
      }
    ]
  },
  {
    slug: "terms",
    title: "Terms",
    summary: "Manual review, request acceptance, and prohibited communications.",
    sections: [
      {
        heading: "Manual review",
        body: "Submitting a request does not create an accepted order. Mogtrix may approve, reject, or request additional qualification details before any next step."
      },
      {
        heading: "Refusal rights",
        body: "Mogtrix may refuse requests, block accounts, or stop communication when requester intent appears inconsistent with research-only procurement."
      }
    ]
  },
  {
    slug: "privacy",
    title: "Privacy",
    summary: "Contact, affiliation, request, and consent records.",
    sections: [
      {
        heading: "Records collected",
        body: "Mogtrix stores contact details, organization details, requested catalog items, and attestation snapshots needed to review research requests."
      },
      {
        heading: "Operational use",
        body: "Records are used for request review, compliance documentation, support, and security monitoring."
      }
    ]
  },
  {
    slug: "refusal",
    title: "Refusal Policy",
    summary: "Zero-tolerance boundary for unsafe requester intent.",
    sections: [
      {
        heading: "Refusal triggers",
        body: "Requests may be refused when messages ask for subject-use advice, preparation directions, consumer outcomes, or other non-research handling."
      },
      {
        heading: "Audit trail",
        body: "Attestation text and acceptance timestamps are stored with each research request to preserve the review record."
      }
    ]
  }
];

export function getLegalPage(slug: string) {
  return legalPages.find((page) => page.slug === slug);
}
