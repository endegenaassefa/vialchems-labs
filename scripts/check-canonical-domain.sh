#!/usr/bin/env bash
# Iron Law 2.28 — single canonical domain (no DNS-vs-code drift).
#
# Enforces that the source-tree does NOT contain stale references to
# legacy/dead brand domains. Per docs/DECISIONS/locked_override_2026-05-20.md,
# the v5 LOCKED canonical domain is vialchemlabs.net.
#
# Audit C1 (resolved by f164f60f) drove this script into existence; it locks
# the resolved state so regression cannot reintroduce drift.
#
# Allowed locations for legacy-domain references:
#   - docs/audit/                  (audit reports describe historical state)
#   - docs/DECISIONS/              (LOCKED_OVERRIDE docs describe transitions)
#   - docs/superpowers/            (super-prompt corpus references audit anchor)
#   - CHANGELOG.md historical sections
#
# Anywhere else, legacy domain references are a CRITICAL preflight failure.
#
# Exit codes:
#   0 — clean
#   1 — drift detected (refuses to allow commit)

set -euo pipefail

cd "$(git rev-parse --show-toplevel)" 2>/dev/null || { echo "Not in a git repo"; exit 1; }

# Resolve the canonical domain from .env.example (the LOCKED default).
CANONICAL_DOMAIN="${BRAND_DOMAIN:-$(grep -E '^BRAND_DOMAIN=' .env.example 2>/dev/null | head -1 | cut -d= -f2 | tr -d '"' | tr -d "'" || echo "vialchemlabs.net")}"

if [ -z "$CANONICAL_DOMAIN" ] || [ "$CANONICAL_DOMAIN" = "" ]; then
  echo "ERROR: Could not resolve canonical BRAND_DOMAIN from env or .env.example"
  exit 1
fi

# Legacy / dead domains that must not appear in source.
LEGACY_DOMAINS=(
  "vialchemlabs.com"
  "vialchems.labs"
  "vialchemslabs.net"
  "vialchemslabs.com"
)

hits_any=0

for legacy in "${LEGACY_DOMAINS[@]}"; do
  # Skip if the legacy domain happens to BE the current canonical (defensive).
  if [ "$legacy" = "$CANONICAL_DOMAIN" ]; then
    continue
  fi

  # Search source-tree files for the legacy domain, excluding allowed locations.
  hits=$(
    grep -rIn \
      --include='*.ts' \
      --include='*.tsx' \
      --include='*.js' \
      --include='*.jsx' \
      --include='*.mjs' \
      --include='*.cjs' \
      --include='*.json' \
      --include='*.txt' \
      --include='*.html' \
      --include='*.css' \
      --include='*.scss' \
      --include='*.sql' \
      --include='*.yml' \
      --include='*.yaml' \
      --include='*.example' \
      --exclude-dir='node_modules' \
      --exclude-dir='.next' \
      --exclude-dir='.git' \
      --exclude-dir='.vercel' \
      --exclude-dir='dist' \
      --exclude-dir='build' \
      --exclude-dir='coverage' \
      --exclude-dir='.lighthouseci' \
      --exclude-dir='playwright-report' \
      --exclude-dir='test-results' \
      --exclude-dir='audit' \
      --exclude-dir='test-reports' \
      "$legacy" . 2>/dev/null \
    | grep -v 'package-lock\.json' \
    | grep -v 'pnpm-lock\.yaml' \
    | grep -v 'yarn\.lock' \
    | grep -v 'tests/unit/site/canonical-domain\.test\.ts' \
    | grep -v 'scripts/check-canonical-domain\.sh' \
    | grep -v 'scripts/check-dns-resolution\.sh' \
    || true
  )

  if [ -n "$hits" ]; then
    echo "ERROR: Iron Law 2.28 violation. Legacy domain '$legacy' found in source-tree (excluding docs/, audit/, test-reports/):"
    echo "$hits"
    echo ""
    hits_any=1
  fi
done

if [ "$hits_any" -ne 0 ]; then
  echo ""
  echo "Iron Law 2.28: every source-tree reference must use the canonical domain '$CANONICAL_DOMAIN'."
  echo "Legacy domain references are allowed ONLY in docs/audit/, docs/DECISIONS/, docs/superpowers/, CHANGELOG.md historical sections."
  echo "Fix: replace legacy domain with '$CANONICAL_DOMAIN' OR move the reference to an allowed location."
  exit 1
fi

echo "OK: check-canonical-domain found 0 legacy-domain references in source-tree."
echo "  Canonical domain: $CANONICAL_DOMAIN"
exit 0
