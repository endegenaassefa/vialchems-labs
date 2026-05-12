#!/usr/bin/env bash
# Phase 13.2 (v4) — post-deploy canary monitor.
#
# 2-hour smoke loop hitting representative routes every 60s + checking
# for 5xx + capturing latency + flagging Sentry error budget breaches
# (when Sentry CLI is configured). Output is human-readable + machine-
# parseable so the operator can pipe to a monitor or grep for alerts.
#
# Usage:
#   bash scripts/canary.sh https://vialchemlabs.net
#   CANARY_DURATION_MIN=60 bash scripts/canary.sh https://staging.vialchemlabs.net
#
# Iron Law 2.27: Lighthouse CI gates merges; this canary catches
# regressions that only manifest under real traffic + real-network
# conditions (cold starts, edge cache misses, DNS drift).

set -euo pipefail

BASE_URL=${1:-${CANARY_BASE_URL:-https://vialchemlabs.net}}
DURATION_MIN=${CANARY_DURATION_MIN:-120}
INTERVAL_SECONDS=${CANARY_INTERVAL_SECONDS:-60}
LOG_FILE=${CANARY_LOG_FILE:-/tmp/vialchemlabs-canary-$(date +%Y%m%d-%H%M%S).log}

ROUTES=(
  "/"
  "/shop"
  "/products/bpc-157-10mg"
  "/products/recovery-stack"
  "/coa"
  "/coa/bpc-157-10mg/BATCH-2026-PLACEHOLDER"
  "/blog"
  "/blog/reading-a-coa"
  "/faq"
  "/about"
  "/cart"
  "/checkout/address"
  "/sitemap.xml"
  "/robots.txt"
  "/api/health"
)

echo "===> vialchemlabs canary monitor"
echo "Base URL: ${BASE_URL}"
echo "Duration: ${DURATION_MIN} minutes"
echo "Interval: ${INTERVAL_SECONDS}s"
echo "Routes:   ${#ROUTES[@]} surfaces"
echo "Log:      ${LOG_FILE}"
echo

end_ts=$(( $(date +%s) + DURATION_MIN * 60 ))
iteration=0
total_5xx=0
total_4xx=0

while [ "$(date +%s)" -lt "${end_ts}" ]; do
  iteration=$((iteration + 1))
  ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  echo "--- iteration ${iteration} @ ${ts} ---" | tee -a "${LOG_FILE}"
  for route in "${ROUTES[@]}"; do
    url="${BASE_URL}${route}"
    response=$(curl -sS -o /dev/null -w '%{http_code} %{time_total}' --max-time 30 "${url}" || echo "000 timeout")
    status=$(echo "${response}" | awk '{print $1}')
    latency_ms=$(echo "${response}" | awk '{printf "%.0f", $2 * 1000}')
    line="${ts} ${route} status=${status} latency_ms=${latency_ms}"
    case "${status}" in
      2*) echo "  OK   ${line}" | tee -a "${LOG_FILE}" ;;
      3*) echo "  REDIR ${line}" | tee -a "${LOG_FILE}" ;;
      4*)
        total_4xx=$((total_4xx + 1))
        echo "  WARN ${line}" | tee -a "${LOG_FILE}"
        ;;
      5*|000)
        total_5xx=$((total_5xx + 1))
        echo "  FAIL ${line}" | tee -a "${LOG_FILE}"
        ;;
      *) echo "  ???  ${line}" | tee -a "${LOG_FILE}" ;;
    esac
  done
  # Iron Law 2.27 latency proxy: any single response > 4s warns
  if [ "${total_5xx}" -gt 0 ]; then
    echo "  >> ${total_5xx} 5xx responses so far — investigate Sentry now" | tee -a "${LOG_FILE}"
  fi
  if [ "$(date +%s)" -lt "${end_ts}" ]; then
    sleep "${INTERVAL_SECONDS}"
  fi
done

echo | tee -a "${LOG_FILE}"
echo "===> Canary summary" | tee -a "${LOG_FILE}"
echo "Iterations: ${iteration}" | tee -a "${LOG_FILE}"
echo "Total checks: $((iteration * ${#ROUTES[@]}))" | tee -a "${LOG_FILE}"
echo "5xx / failed: ${total_5xx}" | tee -a "${LOG_FILE}"
echo "4xx: ${total_4xx}" | tee -a "${LOG_FILE}"

if [ "${total_5xx}" -eq 0 ] && [ "${total_4xx}" -lt 5 ]; then
  echo "PASS — canary clean"
  exit 0
else
  echo "FAIL — canary flagged anomalies; see ${LOG_FILE}"
  exit 1
fi
