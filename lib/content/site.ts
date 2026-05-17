/**
 * Site-wide brand and configuration constants.
 *
 * v5 rebrand (2026-05-10): operator spec → vialchemlabs.net (clinical-minimal
 * light theme, cyan-navy accent, storefront typography, "Research-grade peptides,
 * shipped with the COA." tagline).
 */

const brandDomain = process.env.BRAND_DOMAIN ?? "vialchemlabs.net";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.SITE_URL ??
  `https://${brandDomain}`;

export const siteConfig = {
  name: "vialchemlabs.net",
  brandStem: "vialchemlabs.net",
  domain: brandDomain,
  url: siteUrl,
  description:
    "vialchemlabs.net ships research-grade peptides with the Certificate of Analysis for every vial. For verified laboratories and qualified research organizations only.",
  tagline: "Research-grade peptides, shipped with the COA.",
  posture: "A" as const,
  // Public legal identity appears in client-rendered pages, so these must use
  // public env keys to keep SSR and hydration output identical.
  llcName: process.env.NEXT_PUBLIC_LLC_NAME ?? "VialChem Labs LLC",
  llcJurisdiction: process.env.NEXT_PUBLIC_LLC_JURISDICTION ?? "Wyoming",
  email: {
    from: process.env.ORDER_EMAIL_FROM ?? `research@${brandDomain}`,
    staff: (process.env.ORDER_STAFF_EMAILS ?? `ops@${brandDomain}`).split(","),
  },
  /* v1.3 — operator override per Iron Law 2.26: previously defaulted to a
   * specific named partner ("Janoshik Analytical"). Operator chose to remove
   * any specific lab affiliation from public UI and present testing as
   * "independent" / "third-party verified" without naming the lab. The
   * generic default below is what renders in copy. The actual contractual
   * partner is operator-side / private. To re-enable a named partner in the
   * future, set LAB_PARTNER_NAME + LAB_PARTNER_PORTAL_URL env vars. */
  labPartner: {
    name:
      process.env.LAB_PARTNER_NAME ?? "an independent third-party laboratory",
    /** Short form for inline references where the long phrase is awkward. */
    shortName: process.env.LAB_PARTNER_SHORT_NAME ?? "Independent Lab",
    portalUrl: process.env.LAB_PARTNER_PORTAL_URL ?? null,
  },
  shipping: {
    pilotUSCents: Number(process.env.PILOT_US_SHIPPING_CENTS ?? 1500),
    freeShippingThresholdCents: Number(
      process.env.FREE_SHIPPING_THRESHOLD_CENTS ?? 20000,
    ),
  },
} as const;

export type SiteConfig = typeof siteConfig;
