#!/usr/bin/env python3
"""Apply manual fixups to the auto-repaired vendor_list.csv.

The auto-repair script handles ~95% of cases. This script applies known
corrections for the residual cases the algorithm couldn't disambiguate
(directory-listed vendors without own domains, brand-suffix patterns
the regex couldn't recognize, etc.).
"""
import csv, pathlib

ROOT = pathlib.Path("/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli")
PATH = ROOT / "00_inputs" / "vendor_list.csv"

# Map slug → (new_slug, new_brand, new_domain). new_slug=None to keep slug.
FIXUPS = {
    # made-in-china.com directory listings — no own domain
    'baoding-guangsi-trading-co':            (None, None, 'unknown'),
    'guangzhou-jeep-biotechnology':          (None, None, 'unknown'),
    'hunan-miqu-health-technology-co':       (None, None, 'unknown'),
    'shanghai-huirui-chemical-technology-co':(None, None, 'unknown'),
    'shanghai-jinbei-chemical':              (None, None, 'unknown'),
    'wuhan-newtop-biotech-co':               (None, None, 'unknown'),
    'yiwu-aozuo-trading':                    (None, None, 'unknown'),
    'zhejiang-yichenkang':                   (None, None, 'unknown'),

    # onpoint.to portfolio listings — vendors hosted on a shared portfolio site
    # The actual URL form is likely onpoint.to/<vendor> per "(portfolio)" tag in source.
    'molecular-peptide':  (None, 'Molecular Peptide Store', 'onpoint.to'),
    'peptide':            ('peptide-depot', 'Peptide Depot', 'onpoint.to'),

    # MJ Peptides — Telegram/email only, no site
    'mj-peptides':                           (None, None, 'unknown'),

    # NURI is an acronym brand; algorithm couldn't disambiguate from doubled-domain
    'nurinuriclinics':    ('nuri-clinics', 'NURI Clinics', 'nuriclinics.com'),

    # Source CSV had a newline split inside "1.5K+ reviews" text that mangled
    # one row into two: pure-peptide-labs row has description fragment ending
    # at "1.", and the "5k-reviews-pure" slug is actually the start of a Pure Rawz row.
    '5k-reviews-pure':    ('pure-rawz', 'Pure Rawz', 'purerawz.co'),
}


# Additional row-level fixups beyond the slug/brand/domain triple.
ROW_FIXES = {
    # pure-peptide-labs: description text was truncated before the "5K+ reviews" suffix
    'pure-peptide-labs': {
        'tier_classification_text': 'Tier 2: Massive retail presence with 1.5K+ reviews.',
    },
    # pure-rawz: needs the full proper attributes from the misplaced source row
    'pure-rawz': {
        'country': 'USA',
        'fulfillment': 'USA',
        'ship_to': 'US-only',
        'year_est': 'Uncertain',
        'activity': 'Active',
        'lab_posture': 'On-site COAs (>95%)',
        'headline_categories': 'Research Peptides',
        'price_range': 'Uncertain',
        'review_presence': 'Y (Reddit/Forums)',
        'last_evidence': 'Dec 2025',
        'tier_assigned': '2',
        'tier_classification_text': 'Tier 2: Highly visible community-backed vendor.',
    },
}


def main():
    rows = list(csv.DictReader(open(PATH, newline='', encoding='utf-8')))
    fieldnames = list(rows[0].keys())
    fixup_count = 0

    out_rows = []
    seen_slugs = set()
    for r in rows:
        slug = r['slug']
        if slug in FIXUPS:
            new_slug, new_brand, new_domain = FIXUPS[slug]
            if new_slug:
                r['slug'] = new_slug
                slug = new_slug
            if new_brand:
                r['brand_name'] = new_brand
            if new_domain:
                r['primary_domain'] = new_domain
            fixup_count += 1
        # Apply row-level field fixes (after slug rename if any)
        if slug in ROW_FIXES:
            for k, v in ROW_FIXES[slug].items():
                r[k] = v
            fixup_count += 1
        # Slug collision check
        if slug in seen_slugs:
            base = slug
            n = 2
            while slug in seen_slugs:
                slug = f'{base}-{n}'
                n += 1
            r['slug'] = slug
            print(f'  resolved slug collision: {base} -> {slug}')
        seen_slugs.add(slug)
        out_rows.append(r)

    with open(PATH, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(out_rows)

    print(f'Applied {fixup_count} fixups to {PATH}')

    # Verify
    print('\nFinal unknown-domain vendors (will get fetch_status=failed):')
    for r in out_rows:
        if r['primary_domain'] == 'unknown':
            print(f"  {r['slug']:<40} | {r['brand_name']}")


if __name__ == '__main__':
    main()
