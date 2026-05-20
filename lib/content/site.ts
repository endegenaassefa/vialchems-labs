/**
 * Site-wide brand and configuration constants.
 *
 * v5 LOCKED state (per docs/DECISIONS/locked_override_2026-05-20.md):
 *   - Name: "VialChem Labs" (proper case, capital VC + L)
 *   - Tagline: "Counted, weighed, verified." (v3/v4 LOCKED retained;
 *     supersedes the deprecated "Research-grade peptides, shipped with
 *     the COA." that briefly shipped post-anchor)
 *   - Domain: vialchemlabs.net (operator commit f164f60f)
 *   - Theme: light clinical (--bg #fafaf7, --accent #0f3a5f navy,
 *     --accent-glow #06b6d4 cyan, --text #0a0e14)
 *   - Posture: A (Clean Clinical — LIGHT variant in v5)
 *
 * Iron Law 2.26 — brand expression LOCKED until explicit operator
 * override via docs/DECISIONS/locked_override_<YYYY-MM-DD>.md.
 *
 * SCANNER_OK: reviewed-and-cso-passed (PROTECTED PATH — Iron Law 2.5/2.19
 * + 2.26 + 2.37).
 */

const brandDomain = process.env.BRAND_DOMAIN ?? "vialchemlabs.net";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.SITE_URL ??
  `https://${brandDomain}`;

export const siteConfig = {
  name: "VialChem Labs",
  brandStem: "vialchemlabs",
  domain: brandDomain,
  url: siteUrl,
  description:
    "VialChem Labs ships research-grade peptides with the Certificate of Analysis for every vial. For verified laboratories and qualified research organizations only.",
  tagline: "Counted, weighed, verified.",
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
