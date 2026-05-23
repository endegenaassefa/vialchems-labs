#!/usr/bin/env node
/**
 * M2 (super-prompt 2026-05-22) — Production load test.
 *
 * Simple fetch-loop driver. Default scenario: 100 concurrent virtual
 * users for 5 minutes against /, /shop, /products/bpc-157-10mg.
 * Verifies P95 latency under 3000ms and zero 5xx responses.
 *
 * Usage:
 *   node scripts/load-test.mjs                                  # defaults: prod, 100 VU, 5 min
 *   BASE_URL=https://vialchemlabs.net VU=100 DURATION_S=300 node scripts/load-test.mjs
 *   BASE_URL=http://127.0.0.1:3200 VU=20 DURATION_S=60 node scripts/load-test.mjs
 *
 * Outputs JSON to stdout and a copy under .gstack/load-tests/<ts>.json.
 *
 * NOT for use against the live site without operator coordination —
 * spinning 100 VU for 5 minutes against prod will trigger Vercel
 * rate-limits and Sentry alerts. Run against a Vercel preview deploy
 * or a local `npm run dev` server unless you've coordinated.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = process.env.BASE_URL ?? "https://vialchemlabs.net";
const VU = Number(process.env.VU ?? "100");
const DURATION_S = Number(process.env.DURATION_S ?? "300");
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS ?? "10000");

const ROUTES = (
  process.env.ROUTES?.split(",") ?? [
    "/",
    "/shop",
    "/products/bpc-157-10mg",
    "/products/tb-500-10mg",
    "/products/ghk-cu-50mg",
    "/coa",
    "/faq",
  ]
).map((r) => r.trim()).filter(Boolean);

const P95_TARGET_MS = Number(process.env.P95_TARGET_MS ?? "3000");
const SUCCESS_TARGET = Number(process.env.SUCCESS_TARGET ?? "0.995");

const stats = {
  total: 0,
  success: 0,
  errors: { network: 0, "5xx": 0, "4xx": 0, timeout: 0 },
  latenciesMs: [],
  perRoute: {},
  start: Date.now(),
};

for (const route of ROUTES) {
  stats.perRoute[route] = { total: 0, success: 0, latencies: [] };
}

function pickRoute() {
  return ROUTES[Math.floor(Math.random() * ROUTES.length)];
}

async function fireOne() {
  const route = pickRoute();
  const t0 = performance.now();
  const ac = new AbortController();
  const to = setTimeout(() => ac.abort(), REQUEST_TIMEOUT_MS);

  stats.total += 1;
  stats.perRoute[route].total += 1;

  try {
    const res = await fetch(`${BASE_URL}${route}`, {
      method: "GET",
      headers: {
        "user-agent": "vialchemlabs-load-test/1.0",
        accept: "text/html,*/*",
      },
      signal: ac.signal,
      redirect: "manual",
    });
    const elapsed = performance.now() - t0;
    stats.latenciesMs.push(elapsed);
    stats.perRoute[route].latencies.push(elapsed);

    if (res.status >= 500) {
      stats.errors["5xx"] += 1;
    } else if (res.status >= 400) {
      stats.errors["4xx"] += 1;
    } else {
      stats.success += 1;
      stats.perRoute[route].success += 1;
    }
  } catch (err) {
    const elapsed = performance.now() - t0;
    stats.latenciesMs.push(elapsed);
    stats.perRoute[route].latencies.push(elapsed);
    if (err.name === "AbortError") {
      stats.errors.timeout += 1;
    } else {
      stats.errors.network += 1;
    }
  } finally {
    clearTimeout(to);
  }
}

let stop = false;

async function vu() {
  while (!stop) {
    await fireOne();
    // Tiny jitter so 100 VUs don't synchronize.
    await new Promise((r) => setTimeout(r, 10 + Math.random() * 50));
  }
}

function percentile(arr, p) {
  if (arr.length === 0) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor(sorted.length * p));
  return sorted[idx];
}

function printProgress() {
  const elapsed = ((Date.now() - stats.start) / 1000).toFixed(0);
  const rps = (stats.total / Math.max(elapsed, 1)).toFixed(1);
  const p95 = percentile(stats.latenciesMs, 0.95)?.toFixed(0) ?? "—";
  process.stderr.write(
    `[${elapsed}s] total=${stats.total} rps=${rps} success=${stats.success} ` +
      `4xx=${stats.errors["4xx"]} 5xx=${stats.errors["5xx"]} ` +
      `network=${stats.errors.network} timeout=${stats.errors.timeout} ` +
      `p95=${p95}ms\n`,
  );
}

async function main() {
  console.error(
    `Load test: ${BASE_URL} | ${VU} VU | ${DURATION_S}s | routes=${ROUTES.length}`,
  );
  console.error(
    `Target: P95<${P95_TARGET_MS}ms, success rate>${(SUCCESS_TARGET * 100).toFixed(1)}%, zero 5xx`,
  );

  const progressInterval = setInterval(printProgress, 5000);
  const vus = Array.from({ length: VU }, () => vu());

  await new Promise((r) => setTimeout(r, DURATION_S * 1000));
  stop = true;
  clearInterval(progressInterval);

  await Promise.allSettled(vus);
  printProgress();

  const p50 = percentile(stats.latenciesMs, 0.5);
  const p95 = percentile(stats.latenciesMs, 0.95);
  const p99 = percentile(stats.latenciesMs, 0.99);
  const successRate = stats.success / Math.max(stats.total, 1);

  const report = {
    config: {
      baseUrl: BASE_URL,
      virtualUsers: VU,
      durationSeconds: DURATION_S,
      routes: ROUTES,
      p95TargetMs: P95_TARGET_MS,
      successTarget: SUCCESS_TARGET,
    },
    summary: {
      totalRequests: stats.total,
      success: stats.success,
      successRate,
      errors: stats.errors,
      latency: { p50, p95, p99 },
      durationActualS: (Date.now() - stats.start) / 1000,
    },
    perRoute: Object.fromEntries(
      Object.entries(stats.perRoute).map(([route, data]) => [
        route,
        {
          total: data.total,
          success: data.success,
          successRate: data.success / Math.max(data.total, 1),
          p50: percentile(data.latencies, 0.5),
          p95: percentile(data.latencies, 0.95),
        },
      ]),
    ),
    verdict: {
      p95Pass: (p95 ?? Infinity) <= P95_TARGET_MS,
      successRatePass: successRate >= SUCCESS_TARGET,
      no5xx: stats.errors["5xx"] === 0,
      overall:
        (p95 ?? Infinity) <= P95_TARGET_MS &&
        successRate >= SUCCESS_TARGET &&
        stats.errors["5xx"] === 0,
    },
  };

  mkdirSync(resolve(".gstack/load-tests"), { recursive: true });
  const ts = new Date().toISOString().replaceAll(":", "-").slice(0, 19);
  const outPath = resolve(`.gstack/load-tests/${ts}.json`);
  writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  console.error(`\nReport written to ${outPath}`);
  process.exit(report.verdict.overall ? 0 : 1);
}

main().catch((err) => {
  console.error("FATAL", err);
  process.exit(2);
});
