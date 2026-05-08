/**
 * Site-wide brand and configuration constants.
 *
 * LOCKED via DECISIONS/brand_pick.md: Vialchems Labs (Posture A clean clinical).
 * Tokens here are referenced in metadata, structured data, OG cards, and footer.
 */

export const siteConfig = {
  name: 'Vialchems Labs',
  brandStem: 'vialchems',
  domain: 'vialchems.labs',
  url: 'https://vialchems.labs',
  description:
    'Vialchems Labs supplies research peptides with per-batch independent Certificates of Analysis. Counted, weighed, verified.',
  tagline: 'Counted, weighed, verified.',
  posture: 'A' as const,
  llcName: process.env.LLC_NAME ?? 'Vialchems Labs LLC',
  llcJurisdiction: process.env.LLC_JURISDICTION ?? 'Wyoming',
  email: {
    from: process.env.ORDER_EMAIL_FROM ?? 'research@vialchems.labs',
    staff: (process.env.ORDER_STAFF_EMAILS ?? 'ops@vialchems.labs').split(','),
  },
  labPartner: {
    name: process.env.LAB_PARTNER_NAME ?? 'Janoshik Analytical',
    portalUrl: process.env.LAB_PARTNER_PORTAL_URL ?? 'https://janoshik.com',
  },
  shipping: {
    pilotUSCents: Number(process.env.PILOT_US_SHIPPING_CENTS ?? 1500),
    freeShippingThresholdCents: Number(
      process.env.FREE_SHIPPING_THRESHOLD_CENTS ?? 20000,
    ),
  },
} as const;

export type SiteConfig = typeof siteConfig;
