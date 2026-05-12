#!/usr/bin/env bash
set -euo pipefail

ENV_FILE=${1:-.env.production.local}
MIGRATIONS_DIR=${2:-supabase/migrations}

if ! command -v psql >/dev/null 2>&1; then
  echo "psql is required. Install PostgreSQL client tools first."
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a

if [ -z "${SUPABASE_DB_URL:-}" ]; then
  echo "Set SUPABASE_DB_URL in $ENV_FILE before applying migrations."
  echo "Use the Supabase dashboard Connect panel. Session pooler is safest on IPv4-only networks."
  exit 1
fi

existing=$(psql "$SUPABASE_DB_URL" -Atqc "select to_regclass('public.orders')" 2>/dev/null || true)
if [ "$existing" = "orders" ]; then
  echo "public.orders already exists. Refusing to re-run the initial schema."
  echo "If this was a partial failed migration, inspect Supabase before retrying."
  exit 1
fi

for migration in "$MIGRATIONS_DIR"/*.sql; do
  echo "Applying $migration"
  psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$migration"
done

echo
echo "Verifying required tables and RLS..."
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 <<'SQL'
select tablename
from pg_tables
where schemaname = 'public'
and tablename in (
  'customers',
  'customer_qualifications',
  'attestations_audit',
  'orders',
  'order_items',
  'order_status_history',
  'payments',
  'audit_log',
  'email_subscriptions',
  'promo_codes'
)
order by tablename;

select relname as table_name, relrowsecurity as rls_enabled
from pg_class
where relnamespace = 'public'::regnamespace
and relkind = 'r'
and relname in (
  'customers',
  'customer_qualifications',
  'attestations_audit',
  'orders',
  'order_items',
  'order_status_history',
  'payments',
  'audit_log',
  'email_subscriptions',
  'promo_codes'
)
order by relname;
SQL

echo
echo "Supabase schema applied."
