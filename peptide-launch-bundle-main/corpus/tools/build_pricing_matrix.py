#!/usr/bin/env python3
"""Aggregate every SKU from every vendor profile JSON into pricing_matrix.csv.

One row per SKU. Per directive §9 / Pillar C plan: no re-fetching in this phase —
we read 02_claude_code_outputs/vendors/*.json and emit rows.

Usage: python3 tools/build_pricing_matrix.py
Output: 02_claude_code_outputs/pricing_matrix.csv
"""
import csv, json, pathlib, sys

ROOT = pathlib.Path('/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli')
VENDOR_DIR = ROOT / '02_claude_code_outputs' / 'vendors'
OUT = ROOT / '02_claude_code_outputs' / 'pricing_matrix.csv'

COLS = [
    'sku_id', 'vendor_slug', 'vendor_brand', 'vendor_tier', 'vendor_status',
    'name', 'peptide_canonical', 'peptide_variant',
    'dose_value', 'dose_unit', 'format', 'concentration', 'bottle_size',
    'list_price_usd', 'sale_price_usd', 'sale_observed_at', 'per_mg_price_usd',
    'volume_tier_label', 'bundle_membership', 'crypto_discount_pct',
    'subscription_price_usd', 'out_of_stock', 'url', 'raw_artifact', 'evidence_entry_id',
]

def safe(d, *path, default=''):
    cur = d
    for k in path:
        if isinstance(cur, dict) and k in cur:
            cur = cur[k]
        else:
            return default
    if cur is None: return default
    if isinstance(cur, (list, dict)):
        return json.dumps(cur, ensure_ascii=False)
    return cur

def main():
    rows = []
    vendor_count = 0
    sku_count = 0
    skipped_no_skus = 0
    for jp in sorted(VENDOR_DIR.glob('*.json')):
        try:
            p = json.load(open(jp, encoding='utf-8'))
        except Exception as e:
            print(f'SKIP parse-error {jp.name}: {e}', file=sys.stderr)
            continue
        vendor_count += 1
        skus = p.get('skus', [])
        if not skus:
            skipped_no_skus += 1
            continue
        for sku in skus:
            if not isinstance(sku, dict):
                continue
            row = {
                'sku_id': safe(sku, 'sku_id'),
                'vendor_slug': p.get('vendor_slug', jp.stem),
                'vendor_brand': p.get('brand_name', ''),
                'vendor_tier': p.get('tier', ''),
                'vendor_status': p.get('fetch_status', ''),
                'name': safe(sku, 'name'),
                'peptide_canonical': safe(sku, 'peptide_canonical'),
                'peptide_variant': safe(sku, 'peptide_variant'),
                'dose_value': safe(sku, 'dose_value'),
                'dose_unit': safe(sku, 'dose_unit'),
                'format': safe(sku, 'format'),
                'concentration': safe(sku, 'concentration'),
                'bottle_size': safe(sku, 'bottle_size'),
                'list_price_usd': safe(sku, 'list_price_usd'),
                'sale_price_usd': safe(sku, 'sale_price_usd'),
                'sale_observed_at': safe(sku, 'sale_observed_at'),
                'per_mg_price_usd': safe(sku, 'per_mg_price_usd'),
                'volume_tier_label': safe(sku, 'volume_tier_label'),
                'bundle_membership': safe(sku, 'bundle_membership'),
                'crypto_discount_pct': safe(sku, 'crypto_discount_pct'),
                'subscription_price_usd': safe(sku, 'subscription_price_usd'),
                'out_of_stock': safe(sku, 'out_of_stock'),
                'url': safe(sku, 'url'),
                'raw_artifact': safe(sku, 'raw_artifact'),
                'evidence_entry_id': safe(sku, 'evidence_entry_id'),
            }
            rows.append(row)
            sku_count += 1
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=COLS)
        w.writeheader()
        w.writerows(rows)
    print(f'Wrote {OUT}')
    print(f'Vendors processed: {vendor_count}')
    print(f'Vendors with no skus: {skipped_no_skus}')
    print(f'Total SKU rows: {sku_count}')

if __name__ == '__main__':
    main()
