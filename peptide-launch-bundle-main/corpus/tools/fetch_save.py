#!/usr/bin/env python3
"""Save a fetched page to 03_raw_fetches/<slug>/<page_id>.md with YAML
front matter (Rule 11 of research_directive.md), and append a
discovery_log.jsonl entry (§9.4).

The body is read from --content-file (or stdin if -).

Usage:
  fetch_save.py --slug bachem --page-id homepage \\
                --url https://bachem.com \\
                --method webfetch \\
                --status ok \\
                --content-file /tmp/fetched.txt \\
                [--notes "..."] \\
                [--http-status 200]
"""
import argparse, hashlib, json, os, datetime, pathlib, sys

ROOT = pathlib.Path("/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--slug', required=True)
    ap.add_argument('--page-id', required=True)
    ap.add_argument('--url', required=True)
    ap.add_argument('--method', required=True,
                    choices=['webfetch', 'gstack-browse', 'archive-org', 'curl', 'manual'])
    ap.add_argument('--status', required=True,
                    choices=['ok', 'partial', 'failed'])
    ap.add_argument('--content-file', required=True,
                    help='Path to file with rendered text body, or "-" for stdin')
    ap.add_argument('--notes', default='')
    ap.add_argument('--http-status', default='', help='HTTP status code if known')
    ap.add_argument('--discovery-source-url', default='00_inputs/vendor_list.csv')
    ap.add_argument('--discovery-source-quote', default='operator-supplied vendor list')
    args = ap.parse_args()

    raw_dir = ROOT / '03_raw_fetches' / args.slug
    raw_dir.mkdir(parents=True, exist_ok=True)
    out_path = raw_dir / f'{args.page_id}.md'

    if args.content_file == '-':
        body = sys.stdin.read()
    else:
        body = pathlib.Path(args.content_file).read_text(encoding='utf-8', errors='replace')
    if args.status == 'failed' and not body.strip():
        body = f'(fetch {args.status})\n'

    sha = hashlib.sha256(body.encode('utf-8')).hexdigest()
    ts = datetime.datetime.utcnow().isoformat(timespec='seconds') + 'Z'

    front_matter = (
        f"---\n"
        f"url: {args.url}\n"
        f"fetched_at: {ts}\n"
        f"fetch_method: {args.method}\n"
        f"http_status: {args.http_status}\n"
        f"sha256: {sha}\n"
        f"---\n"
    )
    out_path.write_text(front_matter + body, encoding='utf-8')

    log_entry = {
        'vendor_slug': args.slug,
        'url': args.url,
        'ts': ts,
        'fetch_method': args.method,
        'status': args.status,
        'raw_artifact': f'03_raw_fetches/{args.slug}/{args.page_id}.md',
        'discovery_source_url': args.discovery_source_url,
        'discovery_source_quote': args.discovery_source_quote,
        'sha256': sha,
        'http_status': args.http_status,
        'notes': args.notes,
    }
    log_path = ROOT / '02_claude_code_outputs' / 'discovery_log.jsonl'
    with open(log_path, 'a', encoding='utf-8') as f:
        f.write(json.dumps(log_entry, ensure_ascii=False) + '\n')

    print(out_path)


if __name__ == '__main__':
    main()
