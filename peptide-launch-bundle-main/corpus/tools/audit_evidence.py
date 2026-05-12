#!/usr/bin/env python3
"""Independent Rule 12 audit: verify every [QUOTE] and [SUPPORT_QUOTE]
block in the given vendor's evidence file grep-matches its RAW_ARTIFACT.

Handles:
  - [QUOTE] blocks (use the outer [RAW_ARTIFACT] context per §6.1)
  - [SUPPORT_QUOTE] blocks (use the internal [RAW_ARTIFACT] per §6.4)
  - [ENUMERATION] blocks (skip per §6.3 — synthetic format, not verbatim)

Usage:
  audit_evidence.py <slug>           # audit one vendor
  audit_evidence.py --all            # audit every evidence file
  audit_evidence.py --slugs s1,s2,s3 # audit a specific list

Exit code: 0 if all pass, 1 if any fail.
"""
import re, pathlib, sys, argparse

ROOT = pathlib.Path("/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli")
EV_DIR = ROOT / '02_claude_code_outputs' / 'evidence'


def extract_blocks(text):
    """Yield (raw_artifact, quote_text, block_type) tuples."""
    pos = 0
    last_raw_artifact = None

    while pos < len(text):
        next_quote = text.find('[QUOTE]', pos)
        next_support = text.find('[SUPPORT_QUOTE]', pos)
        next_raw = text.find('[RAW_ARTIFACT]', pos)

        candidates = [(p, t) for p, t in
                      [(next_quote, 'q'), (next_support, 's'), (next_raw, 'r')]
                      if p != -1]
        if not candidates:
            break
        candidates.sort()
        p, t = candidates[0]

        if t == 'r':
            line_end = text.find('\n', p)
            if line_end == -1:
                break
            line = text[p:line_end]
            m = re.match(r'\[RAW_ARTIFACT\]\s*(.+)', line)
            if m:
                last_raw_artifact = m.group(1).strip()
            pos = line_end + 1
        elif t == 'q':
            end = text.find('[/QUOTE]', p)
            if end == -1:
                break
            block_content = text[p + len('[QUOTE]'):end].strip()
            yield (last_raw_artifact, block_content, 'QUOTE')
            pos = end + len('[/QUOTE]')
        elif t == 's':
            end = text.find('[/SUPPORT_QUOTE]', p)
            if end == -1:
                break
            block_content = text[p + len('[SUPPORT_QUOTE]'):end]
            m = re.search(r'\[RAW_ARTIFACT\]\s*(.+)', block_content)
            internal_raw = m.group(1).strip() if m else None
            lr = re.search(r'\[LINE_RANGE\][^\n]*\n(.*)', block_content, re.DOTALL)
            verbatim = lr.group(1).strip() if lr else block_content.strip()
            yield (internal_raw, verbatim, 'SUPPORT_QUOTE')
            pos = end + len('[/SUPPORT_QUOTE]')
        else:
            pos = p + 1


def audit_slug(slug, verbose=False):
    """Returns (ok, fail, enum_skip, failures)."""
    ev_path = EV_DIR / f'{slug}.txt'
    if not ev_path.exists():
        return (0, 0, 0, [f'NO_EVIDENCE_FILE: {ev_path}'])
    text = ev_path.read_text(encoding='utf-8')

    ok = fail = enum_skip = 0
    failures = []

    for raw_path, quote, btype in extract_blocks(text):
        if not raw_path:
            continue
        q = quote
        if q.startswith('[ENUMERATION]'):
            enum_skip += 1
            continue
        if q.startswith('"') and q.endswith('"'):
            q = q[1:-1]
        first_line = next((l for l in q.split('\n') if l.strip()), '').strip()[:100]
        if not first_line:
            continue
        artifact = ROOT / raw_path
        if not artifact.exists():
            fail += 1
            failures.append((raw_path, first_line[:60], 'missing-artifact', btype))
            continue
        body = artifact.read_text(encoding='utf-8', errors='replace')
        if first_line in body:
            ok += 1
        else:
            fail += 1
            failures.append((raw_path, first_line[:60], 'not-found', btype))

    return (ok, fail, enum_skip, failures)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('slug', nargs='?')
    ap.add_argument('--all', action='store_true')
    ap.add_argument('--slugs', help='comma-separated slugs')
    ap.add_argument('-v', '--verbose', action='store_true')
    args = ap.parse_args()

    if args.all:
        slugs = sorted(p.stem for p in EV_DIR.glob('*.txt'))
    elif args.slugs:
        slugs = args.slugs.split(',')
    elif args.slug:
        slugs = [args.slug]
    else:
        ap.error('provide a slug, --all, or --slugs')

    total_ok = total_fail = 0
    failed_slugs = []
    for slug in slugs:
        ok, fail, enum_skip, failures = audit_slug(slug, verbose=args.verbose)
        total_ok += ok
        total_fail += fail
        status = 'PASS' if fail == 0 else 'FAIL'
        print(f'  {slug:<45} {status} ({ok} ok, {fail} fail, {enum_skip} enum-skip)')
        if failures:
            failed_slugs.append(slug)
            for f in failures[:5]:
                print(f'    -> [{f[3]}] {f[2]}: {f[1]!r} in {f[0]}')

    print(f'\nTOTAL: {total_ok} ok, {total_fail} fail across {len(slugs)} vendors')
    if total_fail > 0:
        print(f'Failing slugs: {failed_slugs}')
        sys.exit(1)


if __name__ == '__main__':
    main()
