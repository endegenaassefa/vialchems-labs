#!/usr/bin/env bash
# Phase 10.5 (v4) — BTCPay Server self-host bootstrap.
#
# Closes deferral D11 (BTCPay Server provisioning). Operator runs this
# on a fresh VPS (Hetzner, DigitalOcean, etc.) with at least 2GB RAM +
# 40GB SSD + a public DNS A record pointing at the VPS for
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
#      InvoiceInvalid, InvoiceExpired
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
  echo "Set BTCPAY_HOST=btcpay.<your-domain> before running."
  exit 1
fi

INSTALL_DIR=${BTCPAY_INSTALL_DIR:-/opt/btcpayserver-docker}

if [ ! -d "$INSTALL_DIR" ]; then
  echo "Cloning btcpayserver-docker into $INSTALL_DIR ..."
  git clone https://github.com/btcpayserver/btcpayserver-docker "$INSTALL_DIR"
fi

cd "$INSTALL_DIR"

export BTCPAYGEN_LIGHTNING="${BTCPAYGEN_LIGHTNING:-clightning}"
export BTCPAYGEN_CRYPTO1="${BTCPAYGEN_CRYPTO1:-btc}"
export BTCPAYGEN_CRYPTO2="${BTCPAYGEN_CRYPTO2:-ltc}"
export BTCPAYGEN_REVERSEPROXY="${BTCPAYGEN_REVERSEPROXY:-nginx}"
export BTCPAY_HOST="$BTCPAY_HOST"
export BTCPAYGEN_ADDITIONAL_FRAGMENTS="${BTCPAYGEN_ADDITIONAL_FRAGMENTS:-opt-save-storage-s}"
export NBITCOIN_NETWORK=mainnet
export LETSENCRYPT_EMAIL=${LETSENCRYPT_EMAIL:-ops@${BTCPAY_HOST#btcpay.}}

echo "Running BTCPay setup against $BTCPAY_HOST ..."
. ./btcpay-setup.sh -i

echo
echo "Done. Visit https://$BTCPAY_HOST and complete the dashboard steps."
echo "Then update Vercel env vars per Appendix AA Section 6."
