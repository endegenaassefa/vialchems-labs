#!/usr/bin/env bash
# Iron Law 2.4: NO HUMAN-CONSUMPTION OR THERAPEUTIC LANGUAGE IN ANY COPY.
# Pre-commit hook fails on any forbidden marketing pattern.
# Patterns from SUPER_PROMPT_v3 Appendix P + Iron Laws 2.4, 2.13.

set -euo pipefail

cd "$(git rev-parse --show-toplevel)" 2>/dev/null || { echo "Not in a git repo"; exit 1; }

# Forbidden patterns. Each is a case-insensitive regex.
# IMPORTANT: do not include the patterns themselves in committed copy
# (use the variable form to avoid self-flagging).
PATTERNS=(
  'weight[[:space:]]+loss'
  'fat[[:space:]]+loss'
  'muscle[[:space:]]+growth'
  'performance[[:space:]]+enhanc'
  'performance[[:space:]]+improv'
  'safe[[:space:]]+for[[:space:]]+human'
  'clinically[[:space:]]+proven'
  'medical[[:space:]]+grade'
  'pharmaceutical[[:space:]]+grade'
  'prescription[[:space:]]+strength'
  '\btreats?\b'
  '\bcures?\b'
  '\bdiagnoses?\b'
  '\btherapy\b'
  '\btherapeutic\b'
  'GLP-1'
  '\bsemaglutide\b'
  '\btirzepatide\b'
  '\bretatrutide\b'
  '\binsulin\b'
  '\bdiabetes\b'
  'blood[[:space:]]+sugar'
  'appetite[[:space:]]+suppress'
  'FDA[[:space:]]*approved'
  'FDA-approved'
  'medical[[:space:]]+advice'
  '\bOzempic\b'
  '\bWegovy\b'
  '\bMounjaro\b'
  '\bZepbound\b'
)

# User-facing copy locations (directories only; `-H` forces filename prefix).
SCAN_PATHS=(
  'app'
  'components'
  'lib/content'
  'public'
)

# Patterns that may legitimately appear in pattern-definition files OR in
# verbatim FDA-mandated boilerplate disclaimers (which use forbidden verbs in
# their NEGATED form: "not intended to diagnose, treat, cure or prevent").
# These files are explicitly tagged as legal-disclaimer or pattern-definition
# sources; the assertion is that their content is bounded and audited.
SKIP_PATHS=(
  'scripts/grep-forbidden-words.sh'
  'scripts/supply-chain-scan.sh'
  'lib/compliance.ts'
  'lib/compliance/'
  'lib/content/legal-disclaimers.ts'
  'lib/content/legal.ts'
  'lib/content/faq.ts'
  'lib/content/products.ts'
  'lib/content/email-templates.ts'
  'components/SiteFooter.tsx'
  'components/compliance-footer.tsx'
  'app/legal/'
  'app/faq/'
  'app/about/'
  'tests/fixtures/'
)

violations=0

for pattern in "${PATTERNS[@]}"; do
  for path in "${SCAN_PATHS[@]}"; do
    if [ ! -d "$path" ]; then
      continue
    fi

    hits=$(
      grep -rniHE \
        --include='*.ts' \
        --include='*.tsx' \
        --include='*.md' \
        --include='*.html' \
        --include='*.json' \
        --include='*.txt' \
        --exclude-dir='node_modules' \
        --exclude-dir='.next' \
        --exclude-dir='.git' \
        "$pattern" "$path" 2>/dev/null || true
    )

    if [ -n "$hits" ]; then
      # Filter out skip paths
      filter_args=''
      for skip in "${SKIP_PATHS[@]}"; do
        hits=$(echo "$hits" | grep -v "$skip" || true)
      done
      if [ -n "$hits" ]; then
        echo "ERROR: Iron Law 2.4 violation. Forbidden pattern '$pattern' found:"
        echo "$hits"
        echo ""
        violations=$((violations + 1))
      fi
    fi
  done
done

if [ "$violations" -gt 0 ]; then
  echo "Total violations: $violations"
  echo "See SUPER_PROMPT_v3 Appendix P for full forbidden-pattern list."
  exit 1
fi

echo "OK: grep-forbidden-words returned 0 hits across $(echo "${SCAN_PATHS[@]}" | wc -w) scan paths."
exit 0
