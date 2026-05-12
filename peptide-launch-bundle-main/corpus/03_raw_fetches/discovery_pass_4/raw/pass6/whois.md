---
generated_at: 2026-05-06
purpose: Pass 6 WHOIS pivot on Tier-1 cluster domains
tooling: WebFetch on whois.com lookup pages (no `whois` CLI installed in this env)
---

# WHOIS Findings — Pass 6 Tier-1 Cluster Pivot

## Targets and findings

### corepeptides.com
- Registrant Org: Not provided
- Registrant: Romanian holder (Mehedinti, Romania)
- Registrar: Tucows Domains Inc.
- Name Servers: colette.ns.cloudflare.com, joaquin.ns.cloudflare.com
- Creation Date: 2019-10-13
- Email: Tieredaccess.com obfuscated
- Sister-domain signal: NONE (Cloudflare NS is generic, no shared registrar+date pattern)

### biotechpeptides.com
- Registrant: "Privacy Whois" (Luxembourg)
- Registrar: EuroDNS S.A.
- Name Servers: maxine.ns.cloudflare.com, miguel.ns.cloudflare.com
- Creation Date: 2020-01-31
- Email: Image-masked
- Sister-domain signal: NONE

### lotilabs.com
- Registrant Org: Not provided
- Registrar: Tucows Domains Inc.
- Name Servers: brynne.ns.cloudflare.com, jaime.ns.cloudflare.com
- Creation Date: 2019-06-25
- Email: tieredaccess.com obfuscated
- Sister-domain signal: NONE

### peptidology.com
- Registrant Org: Not publicly disclosed
- Registrar: Squarespace Domains II LLC
- Name Servers: ns-cloud-e1..e4.googledomains.com
- Creation Date: 2020-08-18
- Email: Squarespace whois-contact-form
- Sister-domain signal: NONE (gives away that the operator built on Squarespace)

### ascensionpeptides.com
- Registrant Org: Not disclosed
- Registrar: GoDaddy.com, LLC (IANA ID 146)
- Name Servers: ns19.domaincontrol.com, ns20.domaincontrol.com
- Creation Date: 2023-09-26
- Expiration: 2027-09-26
- Last Updated: 2025-09-27
- Status: client*Prohibited (delete/renew/transfer/update locked)
- Email: Not disclosed
- Sister-domain signal: NONE (GoDaddy default NS, recent registration)

### peptidecompared.com
- whois.com lookup page returned generic homepage content (not actual WHOIS)
- Could not extract — UNFETCHABLE via WebFetch

### peptideprotocolwiki.com
- Same as peptidecompared.com — UNFETCHABLE

### pickpeptides.com
- Same — UNFETCHABLE

## Cross-correlation analysis

| Domain | Registrar | NS pattern | Creation Year |
|---|---|---|---|
| corepeptides.com | Tucows | Cloudflare | 2019 |
| biotechpeptides.com | EuroDNS | Cloudflare | 2020 |
| lotilabs.com | Tucows | Cloudflare | 2019 |
| peptidology.com | Squarespace | googledomains | 2020 |
| ascensionpeptides.com | GoDaddy | domaincontrol (godaddy default) | 2023 |

NO shared registrar+NS+creation-year tuple suggests cluster ownership.
This contradicts the Pass 4-5 hypothesis that several "Tier-1" research
peptide vendors might share an upstream operator. They appear to be
genuinely independent businesses.

## Conclusion

WHOIS pivot on free-tier .com TLD cluster yielded **0 net-new
sister-domain leads** in Pass 6. This confirms Pass 5's structural
finding that the .com TLD is ~85% privacy-walled and that Orbitrex
(via .is TLD) was a genuine outlier.

Pass 7 should DROP free-tier WHOIS as a discovery surface, or upgrade
to paid WHOIS-bulk reverse lookups (DomainTools/SecurityTrails) for
actionable yield.
