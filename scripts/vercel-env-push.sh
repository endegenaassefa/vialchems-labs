#!/usr/bin/env bash
set -euo pipefail

ENV_FILE=${1:-.env.production.local}
ENVIRONMENT=${2:-production}

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a

local_required=(
  VERCEL_TOKEN
  VERCEL_ORG_ID
  VERCEL_PROJECT_ID
)

for key in "${local_required[@]}"; do
  value=${!key:-}
  if [ -z "$value" ]; then
    echo "Set $key in $ENV_FILE before pushing Vercel env vars."
    exit 1
  fi
done

if [ ! -f ".vercel/project.json" ] && [ ! -f ".vercel/repo.json" ]; then
  echo "Project is not linked. Run: npx vercel@latest link"
  exit 1
fi

linked_org_id=$(node -e "
const fs = require('fs');
let project = {};
if (fs.existsSync('./.vercel/project.json')) {
  project = require('./.vercel/project.json');
} else {
  const repo = require('./.vercel/repo.json');
  project = (repo.projects || []).find((entry) => entry.directory === '.') || (repo.projects || [])[0] || {};
}
console.log(project.orgId || '');
")

linked_project_id=$(node -e "
const fs = require('fs');
let project = {};
if (fs.existsSync('./.vercel/project.json')) {
  project = require('./.vercel/project.json');
} else {
  const repo = require('./.vercel/repo.json');
  project = (repo.projects || []).find((entry) => entry.directory === '.') || (repo.projects || [])[0] || {};
}
console.log(project.projectId || project.id || '');
")

if [ "$linked_org_id" != "$VERCEL_ORG_ID" ]; then
  echo "VERCEL_ORG_ID does not match the linked Vercel project."
  exit 1
fi

if [ "$linked_project_id" != "$VERCEL_PROJECT_ID" ]; then
  echo "VERCEL_PROJECT_ID does not match the linked Vercel project."
  exit 1
fi

if ! npx --yes vercel@latest --version >/dev/null 2>&1; then
  echo "Unable to run Vercel CLI via npx."
  exit 1
fi

required=(
  SITE_URL
  NEXT_PUBLIC_SITE_URL
  BRAND_DOMAIN
  AGE_GATE_SECRET
  REQUIRE_SUPABASE
  ALLOW_SUPABASE_OPTIONAL_IN_PRODUCTION
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
  PAYMENT_PROVIDER
  ALLOW_STUB_PAYMENTS_IN_PRODUCTION
  BTCPAY_URL
  BTCPAY_API_KEY
  BTCPAY_STORE_ID
  BTCPAY_WEBHOOK_SECRET
  REQUIRE_RESEND
  ALLOW_RESEND_OPTIONAL_IN_PRODUCTION
  RESEND_API_KEY
  ORDER_EMAIL_FROM
  ORDER_STAFF_EMAILS
)

optional=(
  NEXT_PUBLIC_SENTRY_DSN
  SENTRY_AUTH_TOKEN
  SENTRY_ORG
  SENTRY_PROJECT
)

for key in "${required[@]}"; do
  value=${!key:-}
  if [ -z "$value" ]; then
    echo "Refusing to push empty value for $key"
    exit 1
  fi
done

for key in "${required[@]}"; do
  value=${!key}
  echo "Setting $key for $ENVIRONMENT"
  printf '%s' "$value" | npx --yes vercel@latest env add "$key" "$ENVIRONMENT" --force --token "$VERCEL_TOKEN"
done

for key in "${optional[@]}"; do
  value=${!key:-}
  if [ -z "$value" ]; then
    echo "Skipping optional empty value for $key"
    continue
  fi
  echo "Setting optional $key for $ENVIRONMENT"
  printf '%s' "$value" | npx --yes vercel@latest env add "$key" "$ENVIRONMENT" --force --token "$VERCEL_TOKEN"
done

echo
echo "Vercel env push complete. Trigger a new production deploy after this."
