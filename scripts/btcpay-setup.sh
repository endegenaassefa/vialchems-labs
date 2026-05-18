#!/usr/bin/env bash
# Phase 10.5 (v4) — BTCPay Server self-host bootstrap.
#
# Closes deferral D11 (BTCPay Server provisioning). Operator runs this
# on a fresh VPS (Hetzner, DigitalOcean, etc.) with Docker, at least 2GB RAM,
# and a public DNS A record pointing at the VPS for pay.vialchemlabs.net or
# btcpay.<your-domain>.
#
# After the stack is up:
#   1. Visit https://btcpay.<your-domain> in a browser
#   2. Create the admin account (first registration becomes admin)
#   3. Create a store named "vialchemlabs"
#   4. Generate a Greenfield API key with Invoice + Webhook scopes
#   5. Enable BTC + (optionally) LTC payment methods
#   6. Add a webhook to https://vialchemlabs.net/api/payments/btcpay/webhook
#      with events: InvoiceCreated, InvoiceProcessing, InvoiceSettled,
#      InvoicePaymentSettled, InvoiceInvalid, InvoiceExpired
#   7. Copy the webhook secret + API key + store ID into Vercel env vars
#      per Appendix AA Section 6.
#
# Voltage Cloud alternative (managed BTCPay): skip this script entirely;
# operator signs up at https://voltage.cloud, provisions a BTCPay
# instance, and pulls credentials directly from the dashboard.
#
# Iron Law 2.22: this script never bakes in real credentials. Operator
# fills .env values via the Vercel CLI after first-run, never via this
# file.

set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required. Install: https://docs.docker.com/engine/install/"
  exit 1
fi

if [ -z "${BTCPAY_HOST:-}" ]; then
  echo "Set BTCPAY_HOST=pay.vialchemlabs.net before running."
  exit 1
fi

PUBLIC_IP="$(curl -fsS --connect-timeout 5 --max-time 10 https://api.ipify.org || true)"
RESOLVED_IPS="$(
  getent ahostsv4 "$BTCPAY_HOST" 2>/dev/null | awk '{print $1}' | sort -u || true
)"

if [ -z "$RESOLVED_IPS" ] && command -v dig >/dev/null 2>&1; then
  RESOLVED_IPS="$(
    {
      dig +short A "$BTCPAY_HOST" 2>/dev/null
      dig @1.1.1.1 +short A "$BTCPAY_HOST" 2>/dev/null
      dig @8.8.8.8 +short A "$BTCPAY_HOST" 2>/dev/null
    } | grep -E '^[0-9.]+$' | sort -u || true
  )"
fi

if [ -z "$RESOLVED_IPS" ]; then
  echo "DNS is not ready for $BTCPAY_HOST."
  echo "Create an A record pointing $BTCPAY_HOST to this server first."
  [ -n "$PUBLIC_IP" ] && echo "This server's detected public IP is: $PUBLIC_IP"
  exit 1
fi

if [ -n "$PUBLIC_IP" ] && ! printf '%s\n' "$RESOLVED_IPS" | grep -Fxq "$PUBLIC_IP"; then
  echo "DNS for $BTCPAY_HOST does not point at this server."
  echo "Resolved IPs:"
  printf '  %s\n' $RESOLVED_IPS
  echo "This server's detected public IP: $PUBLIC_IP"
  echo "Set ALLOW_DNS_MISMATCH=true only if you are intentionally running this behind a load balancer."
  if [ "${ALLOW_DNS_MISMATCH:-false}" != "true" ]; then
    exit 1
  fi
fi

for port in 80 443; do
  if ss -tulpn 2>/dev/null | grep -Eq "[[:space:]](:|0\.0\.0\.0:|\\[::\\]:)$port[[:space:]]"; then
    echo "Port $port is already in use. BTCPay's reverse proxy needs ports 80 and 443."
    echo "Set ALLOW_PORT_CONFLICT=true only if an external reverse proxy is already configured."
    if [ "${ALLOW_PORT_CONFLICT:-false}" != "true" ]; then
      exit 1
    fi
  fi
done

INSTALL_DIR=${BTCPAY_INSTALL_DIR:-/opt/btcpayserver-docker}

if [ ! -d "$INSTALL_DIR" ]; then
  echo "Cloning btcpayserver-docker into $INSTALL_DIR ..."
  git clone https://github.com/btcpayserver/btcpayserver-docker "$INSTALL_DIR"
fi

cd "$INSTALL_DIR"

export BTCPAYGEN_LIGHTNING="${BTCPAYGEN_LIGHTNING:-}"
export BTCPAYGEN_CRYPTO1="${BTCPAYGEN_CRYPTO1:-btc}"
export BTCPAYGEN_CRYPTO2="${BTCPAYGEN_CRYPTO2:-}"
export BTCPAYGEN_REVERSEPROXY="${BTCPAYGEN_REVERSEPROXY:-nginx}"
export BTCPAY_HOST="$BTCPAY_HOST"
export BTCPAYGEN_ADDITIONAL_FRAGMENTS="${BTCPAYGEN_ADDITIONAL_FRAGMENTS:-opt-save-storage-s}"
export NBITCOIN_NETWORK=mainnet
export LETSENCRYPT_EMAIL=${LETSENCRYPT_EMAIL:-ops@${BTCPAY_HOST#btcpay.}}
export BTCPAY_UPDATE_CLEAN="${BTCPAY_UPDATE_CLEAN:-false}"

echo "Running BTCPay setup against $BTCPAY_HOST ..."
set +u
. ./btcpay-setup.sh -i
set -u

echo
echo "Done. Visit https://$BTCPAY_HOST and complete the dashboard steps."
echo "Then update Vercel env vars per Appendix AA Section 6."
