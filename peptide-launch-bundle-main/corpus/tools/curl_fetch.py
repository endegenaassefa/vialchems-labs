#!/usr/bin/env python3
"""Fetch a URL via curl, convert HTML to readable markdown text via html2text.

Output: prints the rendered text to stdout. Exit 0 on success, non-zero on
any HTTP/network error (with stderr message).

Why not WebFetch: WebFetch routes through a small model that summarizes
the page. Per research_directive.md Rule 6, summaries cannot serve as
evidence — quotes must come from the actual rendered text.

Usage:
  curl_fetch.py <url> [--user-agent UA] [--timeout 30]
"""
import sys, subprocess, argparse, html2text, re


DEFAULT_UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('url')
    ap.add_argument('--user-agent', default=DEFAULT_UA)
    ap.add_argument('--timeout', type=int, default=30)
    ap.add_argument('--max-bytes', type=int, default=2_000_000,
                    help='Truncate body to this many bytes (default 2MB)')
    args = ap.parse_args()

    try:
        result = subprocess.run(
            ['curl', '-sSL',
             '--max-time', str(args.timeout),
             '--max-redirs', '5',
             '-A', args.user_agent,
             '-w', '\n[HTTP_STATUS:%{http_code}]\n[FINAL_URL:%{url_effective}]\n',
             args.url],
            capture_output=True, text=True, errors='replace',
            timeout=args.timeout + 10)
    except subprocess.TimeoutExpired:
        print(f'ERROR: curl timed out after {args.timeout}s', file=sys.stderr)
        sys.exit(2)
    except Exception as e:
        print(f'ERROR: curl failed: {e}', file=sys.stderr)
        sys.exit(2)

    if result.returncode != 0:
        print(f'ERROR: curl exit code {result.returncode}: {result.stderr.strip()}', file=sys.stderr)
        sys.exit(result.returncode)

    body = result.stdout
    # Extract trailing curl meta
    http_match = re.search(r'\[HTTP_STATUS:(\d+)\]', body)
    final_url_match = re.search(r'\[FINAL_URL:([^\]]+)\]', body)
    http_status = http_match.group(1) if http_match else 'unknown'
    final_url = final_url_match.group(1) if final_url_match else args.url
    # Strip the meta tail
    body = re.sub(r'\n?\[HTTP_STATUS:\d+\]\n\[FINAL_URL:[^\]]+\]\n?$', '', body)

    if int(http_status) >= 400:
        print(f'ERROR: HTTP {http_status} for {args.url}', file=sys.stderr)
        sys.exit(3)

    # Truncate huge bodies
    if len(body) > args.max_bytes:
        body = body[:args.max_bytes] + '\n[TRUNCATED — body exceeded ' + str(args.max_bytes) + ' bytes]\n'

    # Convert HTML to text
    h = html2text.HTML2Text()
    h.body_width = 0  # don't word-wrap
    h.ignore_links = False
    h.ignore_images = True
    h.ignore_emphasis = False
    h.skip_internal_links = True
    h.unicode_snob = True
    text = h.handle(body)

    # Print fetch metadata header (informational, not part of the saved body)
    print(f'[FETCH_META] http_status={http_status} final_url={final_url}', file=sys.stderr)

    sys.stdout.write(text)


if __name__ == '__main__':
    main()
