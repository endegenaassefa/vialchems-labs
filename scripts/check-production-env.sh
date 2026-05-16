#!/usr/bin/env bash
set -euo pipefail

ENV_FILE=${1:-.env.production.local}

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a

required=(
  VERCEL_TOKEN
  VERCEL_ORG_ID
  VERCEL_PROJECT_ID
  SITE_URL
  NEXT_PUBLIC_SITE_URL
  BRAND_DOMAIN
  AGE_GATE_SECRET
  REQUIRE_SUPABASE
  ALLOW_SUPABASE_OPTIONAL_IN_PRODUCTION
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
  SUPABASE_DB_URL
  PAYMENT_PROVIDER
  ALLOW_STUB_PAYMENTS_IN_PRODUCTION
  NEXT_PUBLIC_ENABLE_BITCOIN_CHECKOUT
  REQUIRE_RESEND
  ALLOW_RESEND_OPTIONAL_IN_PRODUCTION
  RESEND_API_KEY
  ORDER_EMAIL_FROM
  ORDER_STAFF_EMAILS
)

missing=0
for key in "${required[@]}"; do
  value=${!key:-}
  if [ -z "$value" ]; then
    echo "missing: $key"
    missing=$((missing + 1))
  else
    echo "set: $key"
  fi
done

if [ "${NEXT_PUBLIC_ENABLE_BITCOIN_CHECKOUT:-false}" = "true" ] || [ "${PAYMENT_PROVIDER:-}" = "btcpay" ]; then
  if [ -z "${BTCPAY_SERVER_URL:-}" ] && [ -z "${BTCPAY_URL:-}" ]; then
    echo "missing: BTCPAY_SERVER_URL"
    missing=$((missing + 1))
  else
    echo "set: BTCPAY_SERVER_URL"
  fi

  for key in BTCPAY_API_KEY BTCPAY_STORE_ID BTCPAY_WEBHOOK_SECRET; do
    value=${!key:-}
    if [ -z "$value" ]; then
      echo "missing: $key"
      missing=$((missing + 1))
    else
      echo "set: $key"
    fi
  done
fi

if [ "$missing" -gt 0 ]; then
  echo
  echo "Production env is incomplete: $missing missing value(s)."
  exit 1
fi

echo
echo "Production env file has all required values."
