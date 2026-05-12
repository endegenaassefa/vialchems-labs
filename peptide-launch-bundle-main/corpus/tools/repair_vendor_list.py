#!/usr/bin/env python3
"""Repair the mangled vendor list CSV.

Source CSV columns 1-2 have mangled brand/domain. Patterns observed:
  - "Bachembachem,Bachembachem.com" → brand="Bachem", domain="bachem.com"
  - "Aavant,Researchaavantresearch.com" → brand="Aavant Research", domain="aavantresearch.com"
  - "10biosystems10biosystems,10BioSystems10biosystems.com" → brand="10BioSystems", domain="10biosystems.com"
  - "Aileron Therapeutics (Rein Therapeutics),reintx.com" → brand=col1, domain=col2

Algorithm:
  1. Dedupe col1 if all-lowercase doubled.
  2. Find TLD at end of col2 via regex.
  3. Strategy A: if pre-TLD ends with c1_lower + c1_lower (single-word doubled),
     take first half as brand (preserves camelCase from col2).
  4. Strategy B: find c1_lower (no spaces) in pre-TLD; brand = c1 + col2's prefix.
  5. Strategy C: walk back from TLD, take lowercase tail as domain root.
"""
import csv, re, sys, pathlib

ROOT = pathlib.Path("/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli")
SRC = pathlib.Path("/mnt/c/Users/endeg/Downloads/01_chatgpt_outputs_vendor_list.csv")
DST = ROOT / "00_inputs" / "vendor_list.csv"


def slugify(s: str) -> str:
    s = re.sub(r'[^a-zA-Z0-9]+', '-', s).strip('-').lower()
    return s or 'unknown'


def dedupe(s: str) -> str:
    if len(s) >= 4 and len(s) % 2 == 0:
        h = len(s) // 2
        if s[:h].lower() == s[h:].lower():
            return s[:h]
    return s


def repair(col1: str, col2: str):
    # Strip parenthetical annotations: (uncertain), (directory), (portfolio), (No Site), etc.
    col2 = re.sub(r'\s*\([^)]*\)\s*', ' ', col2).strip()
    c1 = dedupe(col1.strip())
    c1_lower = c1.lower()
    c1_nospace = re.sub(r'[^a-z0-9]', '', c1_lower)

    tld_m = re.search(r'\.([a-z]{2,5}(?:\.[a-z]{2,5})?)\s*$', col2)
    if not tld_m:
        return c1, 'unknown'
    tld = tld_m.group(1)
    pre_tld = col2[:tld_m.start()]
    pre_tld_lower = pre_tld.lower()
    pre_clean = re.sub(r'[^a-z0-9-]', '', pre_tld_lower)

    # Strategy A2: full pre_tld is doubled (e.g., "lanyunlanyun", "10biosystems10biosystems",
    # "bachembachem"). Independent of col1.
    if len(pre_clean) >= 4 and len(pre_clean) % 2 == 0:
        h = len(pre_clean) // 2
        if pre_clean[:h] == pre_clean[h:]:
            domain_root = pre_clean[:h]
            idx = pre_tld_lower.find(domain_root)
            if idx >= 0:
                brand_part = pre_tld[idx:idx + len(domain_root)]
                bp_lower = brand_part.lower()
                if bp_lower == c1_lower or bp_lower == c1_nospace:
                    brand = brand_part
                else:
                    brand = f"{c1} {brand_part}".strip() if brand_part else c1
                return brand, f"{domain_root}.{tld}"

    # Strategy B: try full c1, then individual words of c1, as the start-of-domain anchor
    candidates = []
    if c1_nospace and len(c1_nospace) >= 2:
        candidates.append(c1_nospace)
    for w in re.split(r'[\s\(\)]+', c1_lower):
        wc = re.sub(r'[^a-z0-9]', '', w)
        if wc and len(wc) >= 2 and wc not in candidates:
            candidates.append(wc)

    for cand in candidates:
        idx = pre_tld_lower.find(cand)
        if idx >= 0:
            # Domain root includes the candidate plus any lowercase/digit/hyphen tail
            i = idx + len(cand)
            while i < len(pre_tld) and (pre_tld[i].islower() or pre_tld[i].isdigit() or pre_tld[i] == '-'):
                i += 1
            domain_root = pre_tld[idx:i].lower()
            prefix = pre_tld[:idx].strip(' .-_')
            if prefix:
                brand = f"{c1} {prefix}".strip()
            else:
                brand = c1
            return brand, f"{domain_root}.{tld}"

    # Strategy C: walk back from end of pre_tld
    i = len(pre_tld)
    while i > 0 and (pre_tld[i-1].islower() or pre_tld[i-1].isdigit() or pre_tld[i-1] == '-'):
        i -= 1
    domain_root = pre_tld[i:].lower()
    prefix = pre_tld[:i].strip(' .-_')

    # Heuristic: if the walk-back stripped only a 1-2 char prefix (likely a single
    # leading capital from a brand like "Storeonpoint" that's actually a known word),
    # treat the whole pre_tld as the domain root. The fetch will validate.
    if 0 < len(prefix) <= 2 and not any(ch.isupper() for ch in prefix[1:]):
        domain_root = re.sub(r'[^a-z0-9-]', '', pre_tld_lower)
        prefix = ''

    if not domain_root:
        return c1, 'unknown'
    if prefix:
        brand = f"{c1} {prefix}".strip()
    else:
        brand = c1
    return brand, f"{domain_root}.{tld}"


def main():
    rows_out = []
    with open(SRC, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        # Original columns: Brand Name, Primary Domain, Apparent Country, Fulfillment Country,
        # Ship-to Scope, Year Est., Apparent Activity Status, Public Lab-Testing Posture,
        # Headline Product Categories, Headline Price Range, Source-Review Presence,
        # Last Evidence of Activity, Tier Classification & Justification
        seen_slugs = set()
        for row in reader:
            if len(row) < 13:
                # Some rows have commas inside quoted fields that broke the parse
                # Try to recover; for now skip with warning
                print(f'WARN malformed (skipping): {row[:3]!r}', file=sys.stderr)
                continue
            brand, domain = repair(row[0], row[1])
            slug = slugify(brand)
            # Handle slug collisions
            if slug in seen_slugs:
                base = slug
                n = 2
                while slug in seen_slugs:
                    slug = f'{base}-{n}'
                    n += 1
            seen_slugs.add(slug)

            # Parse tier from last column
            tier_text = row[12] if len(row) > 12 else ''
            tier_match = re.search(r'Tier\s+([123])', tier_text)
            tier = tier_match.group(1) if tier_match else '3'

            rows_out.append({
                'slug': slug,
                'brand_name': brand,
                'primary_domain': domain,
                'country': row[2],
                'fulfillment': row[3],
                'ship_to': row[4],
                'year_est': row[5],
                'activity': row[6],
                'lab_posture': row[7],
                'headline_categories': row[8],
                'price_range': row[9],
                'review_presence': row[10],
                'last_evidence': row[11],
                'tier_assigned': tier,
                'tier_classification_text': tier_text,
            })

    DST.parent.mkdir(parents=True, exist_ok=True)
    with open(DST, 'w', newline='', encoding='utf-8') as g:
        writer = csv.DictWriter(g, fieldnames=list(rows_out[0].keys()))
        writer.writeheader()
        writer.writerows(rows_out)

    print(f'Wrote {DST} with {len(rows_out)} rows')

    # Tier distribution
    from collections import Counter
    tier_counts = Counter(r['tier_assigned'] for r in rows_out)
    print(f'Tier distribution: {dict(tier_counts)}')

    # Print first 20 for spot check
    print('\nFirst 20 rows (slug | brand | domain):')
    for r in rows_out[:20]:
        print(f"  {r['slug']:<35} | {r['brand_name']:<40} | {r['primary_domain']}")
    print('\nLast 10 rows:')
    for r in rows_out[-10:]:
        print(f"  {r['slug']:<35} | {r['brand_name']:<40} | {r['primary_domain']}")


if __name__ == '__main__':
    main()
