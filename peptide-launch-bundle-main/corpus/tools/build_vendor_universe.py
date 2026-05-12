#!/usr/bin/env python3
"""Build vendor_universe.csv with provenance per research_directive.md §7.3.

Columns:
  slug, brand_name, primary_domain, first_seen_pass,
  discovery_source_url, discovery_source_quote, assigned_tier,
  tier_rationale, profile_status

profile_status starts as 'pending'. The per-vendor self-audit (§5 step 14)
flips it to 'ok'/'partial'/'failed' on completion.
"""
import csv, pathlib

ROOT = pathlib.Path("/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli")
SRC = ROOT / "00_inputs" / "vendor_list.csv"
DST = ROOT / "02_claude_code_outputs" / "vendor_universe.csv"

OUT_COLS = [
    'slug', 'brand_name', 'primary_domain',
    'first_seen_pass', 'discovery_source_url', 'discovery_source_quote',
    'assigned_tier', 'tier_rationale', 'profile_status'
]


def main():
    rows = list(csv.DictReader(open(SRC, newline='', encoding='utf-8')))
    out = []
    for r in rows:
        out.append({
            'slug': r['slug'],
            'brand_name': r['brand_name'],
            'primary_domain': r['primary_domain'],
            'first_seen_pass': '0',  # seed list, not from a discovery pass
            'discovery_source_url': '00_inputs/vendor_list.csv',
            'discovery_source_quote': f"row from operator-supplied vendor list, classified as {r['tier_classification_text']}",
            'assigned_tier': r['tier_assigned'],
            'tier_rationale': 'as-assigned (operator seed)',
            'profile_status': 'pending',
        })

    DST.parent.mkdir(parents=True, exist_ok=True)
    with open(DST, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=OUT_COLS)
        w.writeheader()
        w.writerows(out)

    print(f'Wrote {DST} with {len(out)} rows')

    from collections import Counter
    print(f'Tier counts: {dict(Counter(r["assigned_tier"] for r in out))}')


if __name__ == '__main__':
    main()
