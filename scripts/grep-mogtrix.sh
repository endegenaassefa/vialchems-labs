#!/usr/bin/env bash
# Iron Law 2.12: NO MOGTRIX BRANDING IN THE NEW REPO.
# Pre-commit grep test verifies the new repo source contains no occurrences of
# "Mogtrix" or "MOGTRIX". Comments referencing Mogtrix as a pattern source ARE
# allowed (one-liner attribution); the rest of the codebase must be clean.

set -euo pipefail

cd "$(git rev-parse --show-toplevel)" 2>/dev/null || { echo "Not in a git repo"; exit 1; }

# Allowed attribution comment patterns (single-line):
#   // Pattern adapted from mogtrix-website/...
#   /* Pattern adapted from mogtrix-website/... */
#   # Pattern adapted from mogtrix-website/...

# Find any occurrence of "Mogtrix" (case-insensitive) excluding allowed locations
hits=$(
  grep -rni \
    --include='*.ts' \
    --include='*.tsx' \
    --include='*.js' \
    --include='*.jsx' \
    --include='*.mjs' \
    --include='*.cjs' \
    --include='*.json' \
    --include='*.sql' \
    --include='*.css' \
    --include='*.html' \
    --exclude-dir='node_modules' \
    --exclude-dir='.next' \
    --exclude-dir='.git' \
    --exclude-dir='.vercel' \
    --exclude-dir='dist' \
    --exclude-dir='build' \
    --exclude-dir='coverage' \
    --exclude-dir='docs' \
    'mogtrix' . 2>/dev/null \
  | grep -v '// Pattern adapted from mogtrix-' \
  | grep -v '/\* Pattern adapted from mogtrix-' \
  | grep -v '# Pattern adapted from mogtrix-' \
  | grep -v 'package-lock\.json' \
  | grep -v 'grep-mogtrix' \
  || true
)

if [ -n "$hits" ]; then
  echo "ERROR: Iron Law 2.12 violation. 'Mogtrix' found in source files outside of allowed attribution comments:"
  echo "$hits"
  echo ""
  echo "Allowed attribution comment format:"
  echo "  // Pattern adapted from mogtrix-website/<path>"
  exit 1
fi

# Markdown files: only `docs/` folder is allowed to mention Mogtrix
md_hits=$(
  grep -rni 'mogtrix' \
    --include='*.md' \
    --exclude-dir='node_modules' \
    --exclude-dir='.next' \
    --exclude-dir='.git' \
    --exclude-dir='docs' \
    . 2>/dev/null || true
)

if [ -n "$md_hits" ]; then
  echo "ERROR: Iron Law 2.12 violation. 'Mogtrix' found in markdown files outside of docs/:"
  echo "$md_hits"
  exit 1
fi

echo "OK: grep-mogtrix returned 0 non-attribution hits."
exit 0
