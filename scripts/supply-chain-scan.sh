#!/usr/bin/env bash
# Iron Law 2.16: PRE-COMMIT SUPPLY-CHAIN SCANNER MANDATORY.
# Scans for hidden unicode, prompt-injection patterns, dangerous infrastructure
# patterns, and credential leaks. Fail-fast on any hit.
# Patterns from SUPER_PROMPT_v3 Appendix U.

set -euo pipefail

cd "$(git rev-parse --show-toplevel)" 2>/dev/null || { echo "Not in a git repo"; exit 1; }

violations=0

# 1. Hidden unicode (zero-width, bidi override)
echo "[1/6] Hidden unicode scan..."
unicode_hits=$(
  grep -rnP \
    --include='*.ts' \
    --include='*.tsx' \
    --include='*.md' \
    --include='*.json' \
    --include='*.html' \
    --exclude-dir='node_modules' \
    --exclude-dir='.next' \
    --exclude-dir='.git' \
    --exclude-dir='peptide-launch-bundle-main' \
    '[\x{200B}\x{200C}\x{200D}\x{2060}\x{FEFF}\x{202A}-\x{202E}]' . 2>/dev/null \
  | grep -v 'scripts/supply-chain-scan.sh' || true
)
if [ -n "$unicode_hits" ]; then
  echo "ERROR: Hidden unicode characters detected:"
  echo "$unicode_hits"
  violations=$((violations + 1))
fi

# 2. Forbidden infrastructure keywords
echo "[2/6] Infrastructure keyword scan..."
infra_patterns=(
  'curl[[:space:]]*\|[[:space:]]*bash'
  'wget[[:space:]]*\|[[:space:]]*bash'
  'curl[[:space:]]*\|[[:space:]]*sh'
  'enableAllProjectMcpServers'
  'ANTHROPIC_BASE_URL'
  '--dangerously-skip-permissions'
  '--no-verify'
)
for pattern in "${infra_patterns[@]}"; do
  hits=$(
    grep -rnE \
      --include='*.ts' \
      --include='*.tsx' \
      --include='*.sh' \
      --include='*.json' \
      --include='*.yaml' \
      --include='*.yml' \
      --exclude-dir='node_modules' \
      --exclude-dir='.next' \
      --exclude-dir='.git' \
      --exclude-dir='peptide-launch-bundle-main' \
      "$pattern" . 2>/dev/null \
    | grep -v 'scripts/supply-chain-scan.sh' \
    | grep -v 'docs/' \
    || true
  )
  if [ -n "$hits" ]; then
    echo "ERROR: Forbidden infrastructure keyword '$pattern':"
    echo "$hits"
    violations=$((violations + 1))
  fi
done

# 3. File-permission violations (committed credentials)
echo "[3/6] Credential file scan..."
cred_files=$(
  find . \
    -path ./node_modules -prune -o \
    -path ./.next -prune -o \
    -path ./.git -prune -o \
    -path ./peptide-launch-bundle-main -prune -o \
    \( -name '.env' -o -name '.env.local' -o -name '.env.*.local' -o -name 'id_rsa*' -o -name '*.pem' -o -iname '*credentials*' \) \
    -print 2>/dev/null \
  | grep -v '.env.example' \
  || true
)
# Check if any are tracked in git
if [ -n "$cred_files" ]; then
  for f in $cred_files; do
    if git ls-files --error-unmatch "$f" 2>/dev/null; then
      echo "ERROR: Credential file tracked in git: $f"
      violations=$((violations + 1))
    fi
  done
fi

# 4. Console.log / debugger / TODO-without-issue in production source
echo "[4/6] Production-source debug-leftover scan..."
debug_patterns=(
  'console\.log'
  '\bdebugger\b'
)
for pattern in "${debug_patterns[@]}"; do
  hits=$(
    grep -rnE \
      --include='*.ts' \
      --include='*.tsx' \
      "$pattern" app lib components 2>/dev/null \
    | grep -v '\.test\.' \
    | grep -v '\.spec\.' \
    | grep -v 'tests/' \
    || true
  )
  if [ -n "$hits" ]; then
    echo "WARNING: Debug-leftover pattern '$pattern' (not blocking):"
    echo "$hits"
  fi
done

# 5. HTML comment patterns suggesting prompt injection
echo "[5/6] Prompt-injection comment scan..."
inject_hits=$(
  grep -rnPE \
    --include='*.md' \
    --include='*.html' \
    --include='*.tsx' \
    --include='*.ts' \
    --exclude-dir='node_modules' \
    --exclude-dir='.next' \
    --exclude-dir='.git' \
    --exclude-dir='peptide-launch-bundle-main' \
    --exclude-dir='docs' \
    '<!--.*[A-Z]{4,}|data:text/html|<script' . 2>/dev/null \
  | grep -v 'scripts/supply-chain-scan.sh' \
  || true
)
if [ -n "$inject_hits" ]; then
  echo "ERROR: Potential prompt-injection comment pattern:"
  echo "$inject_hits"
  violations=$((violations + 1))
fi

# 6. Suspicious base64 blobs (>200 chars in source)
echo "[6/6] Suspicious base64 blob scan..."
b64_hits=$(
  grep -rnPE \
    --include='*.ts' \
    --include='*.tsx' \
    --include='*.json' \
    --exclude-dir='node_modules' \
    --exclude-dir='.next' \
    --exclude-dir='.git' \
    --exclude-dir='peptide-launch-bundle-main' \
    --exclude-dir='tests' \
    '[A-Za-z0-9+/]{200,}={0,2}' . 2>/dev/null \
  | grep -v 'scripts/supply-chain-scan.sh' \
  | grep -v '\.svg' \
  || true
)
if [ -n "$b64_hits" ]; then
  echo "WARNING: Long base64 blob (>200 chars, not blocking; review):"
  echo "$b64_hits" | head -5
fi

if [ "$violations" -gt 0 ]; then
  echo ""
  echo "Total violations: $violations"
  echo "See SUPER_PROMPT_v3 Appendix U for full supply-chain-scanner spec."
  exit 1
fi

echo "OK: supply-chain-scan returned 0 violations."
exit 0
