#!/usr/bin/env bash
# Mogtrix post-deploy smoke test.
# Usage: bash site/scripts/smoke-test.sh https://your-domain.example
set -u

BASE="${1:-}"
if [ -z "$BASE" ]; then
  echo "usage: $0 <base-url>" >&2
  exit 2
fi
BASE="${BASE%/}"

BYPASS_HEADER=()
if [ -n "${VERCEL_AUTOMATION_BYPASS_SECRET:-}" ]; then
  BYPASS_HEADER=(-H "x-vercel-protection-bypass: ${VERCEL_AUTOMATION_BYPASS_SECRET}")
fi

PASS=0
FAIL=0

check() {
  local name="$1"
  local actual="$2"
  local expected="$3"
  if [[ "$actual" == *"$expected"* ]]; then
    echo "  ok    $name"
    PASS=$((PASS + 1))
  else
    echo "  FAIL  $name (expected=$expected got=$actual)"
    FAIL=$((FAIL + 1))
  fi
}

check_exact() {
  local name="$1"
  local actual="$2"
  local expected="$3"
  if [ "$actual" = "$expected" ]; then
    echo "  ok    $name"
    PASS=$((PASS + 1))
  else
    echo "  FAIL  $name (expected=$expected got=$actual)"
    FAIL=$((FAIL + 1))
  fi
}

echo "==> $BASE"

for path in "/" "/shop" "/legal" "/legal/ruo" "/sitemap.xml" "/robots.txt"; do
  code=$(curl -s "${BYPASS_HEADER[@]}" -o /dev/null -w "%{http_code}" "$BASE$path")
  check "GET $path" "$code" "200"
done

code=$(curl -s "${BYPASS_HEADER[@]}" -o /dev/null -w "%{http_code}" "$BASE/this-page-does-not-exist")
check "GET /this-page-does-not-exist" "$code" "404"

echo "==> security headers"
headers=$(curl -sI "${BYPASS_HEADER[@]}" "$BASE/")
check "Strict-Transport-Security present" "$headers" "Strict-Transport-Security"
check "Content-Security-Policy present" "$headers" "Content-Security-Policy"
check "X-Frame-Options DENY" "$headers" "X-Frame-Options: DENY"
check "X-Content-Type-Options nosniff" "$headers" "X-Content-Type-Options: nosniff"
check "Referrer-Policy set" "$headers" "Referrer-Policy"
check "Permissions-Policy set" "$headers" "Permissions-Policy"

robots=$(curl -s "${BYPASS_HEADER[@]}" "$BASE/robots.txt")
check "robots disallows /api" "$robots" "Disallow: /api"
check "robots disallows /ops" "$robots" "Disallow: /ops"
sitemap=$(curl -s "${BYPASS_HEADER[@]}" "$BASE/sitemap.xml")
check "sitemap is XML" "$sitemap" "<urlset"
check "sitemap includes /shop" "$sitemap" "/shop"

echo "==> catalog and request API"
catalog_code=$(curl -s "${BYPASS_HEADER[@]}" -o /dev/null -w "%{http_code}" "$BASE/api/catalog")
check "GET /api/catalog requires sign-in" "$catalog_code" "401"

api_options=$(curl -s "${BYPASS_HEADER[@]}" -o /dev/null -w "%{http_code}" -X OPTIONS "$BASE/api/research-requests")
check "OPTIONS /api/research-requests responds" "$api_options" "200"

api_empty=$(curl -s "${BYPASS_HEADER[@]}" -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" --data "{}" "$BASE/api/research-requests")
check "POST {} -> 400" "$api_empty" "400"

api_junk=$(curl -s "${BYPASS_HEADER[@]}" -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" --data "not json" "$BASE/api/research-requests")
check "POST junk -> 400" "$api_junk" "400"

if [ "${SMOKE_SUBMIT:-}" = "1" ]; then
  payload=$(node -e 'const id = crypto.randomUUID(); process.stdout.write(JSON.stringify({ clientRequestId: id, contactName: "Smoke Test", organization: "Mogtrix Pilot Verification", email: `smoke+${id}@example.com`, projectSummary: "Pilot smoke test request verifying production Supabase persistence.", attestationIds: ["age-qualified", "research-only", "no-guidance", "affiliation"], items: [{ productId: "bpc-157-5mg", quantity: 1 }] }));')
  submit=$(curl -s "${BYPASS_HEADER[@]}" -X POST -H "Content-Type: application/json" --data "$payload" "$BASE/api/research-requests")
  check "valid request writes through Supabase" "$submit" '"mode":"supabase"'
  check "valid request starts pending review" "$submit" '"status":"pending_review"'
fi

echo
echo "==> PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
