#!/usr/bin/env bash
# Iron Law 2.38 — DNS resolution preflight check.
#
# Verifies that the canonical BRAND_DOMAIN actually resolves and responds at the
# network layer. Catches Iron Law 2.28 drift at preflight (i.e., the codebase
# claims to canonicalize a domain that does not exist in DNS).
#
# Skip in test/CI when no real network is available:
#   SKIP_DNS_CHECK=true bash scripts/check-dns-resolution.sh
#
# Exit codes:
#   0 — domain resolves to 2xx/3xx
#   1 — domain does not resolve OR returns 4xx/5xx
#   2 — config error (no domain available)

set -euo pipefail

# Skip in test/CI environments where outbound network is unavailable.
if [ "${SKIP_DNS_CHECK:-false}" = "true" ]; then
  echo "OK: check-dns-resolution skipped (SKIP_DNS_CHECK=true)"
  exit 0
fi

cd "$(git rev-parse --show-toplevel)" 2>/dev/null || { echo "Not in a git repo"; exit 1; }

# Resolve the canonical domain from .env.local first, then .env.example default.
if [ -f .env.local ]; then
  BRAND_DOMAIN_ENV=$(grep -E '^BRAND_DOMAIN=' .env.local 2>/dev/null | head -1 | cut -d= -f2 | tr -d '"' | tr -d "'" || true)
fi

if [ -z "${BRAND_DOMAIN_ENV:-}" ] && [ -f .env.example ]; then
  BRAND_DOMAIN_ENV=$(grep -E '^BRAND_DOMAIN=' .env.example 2>/dev/null | head -1 | cut -d= -f2 | tr -d '"' | tr -d "'" || true)
fi

CANONICAL_DOMAIN="${BRAND_DOMAIN:-${BRAND_DOMAIN_ENV:-vialchemlabs.net}}"

if [ -z "$CANONICAL_DOMAIN" ] || [ "$CANONICAL_DOMAIN" = "" ]; then
  echo "ERROR: Could not resolve BRAND_DOMAIN from env or .env.example or .env.local"
  exit 2
fi

# Probe the domain with a HEAD-like fetch (--max-time 8 to avoid hanging CI).
status=$(
  curl -fsS -o /dev/null \
    --max-time 8 \
    -w "%{http_code}" \
    -L \
    "https://${CANONICAL_DOMAIN}/" 2>/dev/null || echo "000"
)

# Accept any 2xx/3xx; reject 4xx/5xx/000 (unresolvable).
case "$status" in
  2*|3*)
    echo "OK: check-dns-resolution — https://${CANONICAL_DOMAIN}/ resolved $status"
    exit 0
    ;;
  4*|5*)
    echo "ERROR: Iron Law 2.38 violation. https://${CANONICAL_DOMAIN}/ returned $status (4xx/5xx — site is broken)."
    echo "Fix: investigate deployment at $CANONICAL_DOMAIN, OR update BRAND_DOMAIN to a working domain."
    exit 1
    ;;
  *)
    echo "ERROR: Iron Law 2.38 violation. https://${CANONICAL_DOMAIN}/ does not resolve (curl returned '$status')."
    echo "Either:"
    echo "  - DNS is not configured for $CANONICAL_DOMAIN — fix in your registrar."
    echo "  - BRAND_DOMAIN is wrong — update .env.local or .env.example to match the live host."
    echo "  - Network is unreachable in this environment — set SKIP_DNS_CHECK=true to bypass."
    exit 1
    ;;
esac
