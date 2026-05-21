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
    --exclude-dir='.claude' \
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

# Markdown files: only `docs/` folder is allowed to mention Mogtrix.
# v4 allowlist (Phase 0 hygiene): three operator-handoff reference docs at repo root
# legitimately cite Mogtrix as a pattern-attribution source per Iron Law 2.12.
# These docs are referenced by absolute path in the v4 super-prompt §1.1 — moving
# them would break those cross-references. The allowlist is narrowly named.
md_hits=$(
  grep -rni 'mogtrix' \
    --include='*.md' \
    --exclude-dir='node_modules' \
    --exclude-dir='.next' \
    --exclude-dir='.git' \
    --exclude-dir='docs' \
    --exclude-dir='.claude' \
    . 2>/dev/null \
  | grep -v 'grep-mogtrix' \
  | grep -v '^\./SUPER_PROMPT_' \
  | grep -v '^\./RESEARCH_PLAN\.md' \
  | grep -v '^\./CODEBASE_UNDERSTANDING\.md' \
  || true
)

if [ -n "$md_hits" ]; then
  echo "ERROR: Iron Law 2.12 violation. 'Mogtrix' found in markdown files outside of docs/:"
  echo "$md_hits"
  exit 1
fi

echo "OK: grep-mogtrix returned 0 non-attribution hits."
exit 0
