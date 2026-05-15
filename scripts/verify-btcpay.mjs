#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const REQUIRED = [
  "BTCPAY_SERVER_URL",
  "BTCPAY_API_KEY",
  "BTCPAY_STORE_ID",
  "BTCPAY_WEBHOOK_SECRET",
];

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const entries = {};
  const text = fs.readFileSync(filePath, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const index = line.indexOf("=");
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    entries[key] = value;
  }
  return entries;
}

function loadEnv() {
  return {
    ...parseEnvFile(path.join(ROOT, ".env")),
    ...parseEnvFile(path.join(ROOT, ".env.local")),
    ...process.env,
  };
}

function present(value) {
  const normalized = value?.trim();
  if (!normalized) return false;
  if (/^PLACEHOLDER_/i.test(normalized)) return false;
  if (/^stub_/i.test(normalized)) return false;
  if (normalized === "https://your-btcpay-server.example.com") return false;
  return true;
}

function getServerUrl(env) {
  return (env.BTCPAY_SERVER_URL || env.BTCPAY_URL || "").trim();
}

function missingCredentials(env) {
  return REQUIRED.filter((key) => {
    if (key === "BTCPAY_SERVER_URL") return !present(getServerUrl(env));
    return !present(env[key]);
  });
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

const env = loadEnv();
const missing = missingCredentials(env);
if (missing.length > 0) {
  fail(`Missing required credential: ${missing[0]}`);
}

let server;
try {
  server = new URL(getServerUrl(env));
} catch {
  fail("BTCPAY_SERVER_URL must be a valid absolute URL.");
}

if (server.protocol !== "https:" && server.protocol !== "http:") {
  fail("BTCPAY_SERVER_URL must use https:// or http://.");
}

const endpoint = `${server.origin}/api/v1/stores/${encodeURIComponent(
  env.BTCPAY_STORE_ID,
)}`;

console.log(`Checking BTCPay store access: ${endpoint}`);

const response = await fetch(endpoint, {
  method: "GET",
  headers: {
    Authorization: `token ${env.BTCPAY_API_KEY}`,
    "Content-Type": "application/json",
  },
});

if (response.status === 401) {
  fail("BTCPay verification failed: API key was rejected with HTTP 401.");
}

if (response.status === 403) {
  fail(
    "BTCPay verification failed: API key lacks store access. Grant store-scoped btcpay.store.canviewstoresettings plus invoice permissions.",
  );
}

if (!response.ok) {
  const text = await response.text().catch(() => "");
  fail(
    `BTCPay verification failed: HTTP ${response.status} ${text.slice(0, 300)}`,
  );
}

const store = await response.json().catch(() => ({}));
console.log(
  JSON.stringify(
    {
      ok: true,
      server: server.origin,
      storeId: env.BTCPAY_STORE_ID,
      storeName: store.name ?? null,
      message:
        "BTCPay API key can reach the configured store. Create-invoice permission is exercised by the checkout route.",
    },
    null,
    2,
  ),
);
