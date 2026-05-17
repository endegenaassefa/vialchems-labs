#!/usr/bin/env node
import dns from "node:dns/promises";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import tls from "node:tls";

const ROOT = process.cwd();
const TIMEOUT_MS = 10_000;

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

function getServerUrl(env) {
  return (env.BTCPAY_SERVER_URL || env.BTCPAY_URL || "").trim();
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

async function getPublicIp() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const response = await fetch("https://api.ipify.org", {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response.ok ? (await response.text()).trim() : null;
  } catch {
    return null;
  }
}

function checkTcp(hostname, port) {
  return new Promise((resolve) => {
    const socket = net.connect({ host: hostname, port });
    const timeout = setTimeout(() => {
      socket.destroy();
      resolve({ ok: false, message: "timeout" });
    }, TIMEOUT_MS);

    socket.once("connect", () => {
      clearTimeout(timeout);
      socket.destroy();
      resolve({ ok: true });
    });
    socket.once("error", (error) => {
      clearTimeout(timeout);
      resolve({ ok: false, message: error.message });
    });
  });
}

function checkTls(hostname, port) {
  return new Promise((resolve) => {
    const socket = tls.connect({
      host: hostname,
      port,
      servername: hostname,
      rejectUnauthorized: true,
    });
    const timeout = setTimeout(() => {
      socket.destroy();
      resolve({ ok: false, message: "timeout" });
    }, TIMEOUT_MS);

    socket.once("secureConnect", () => {
      const cert = socket.getPeerCertificate();
      clearTimeout(timeout);
      socket.destroy();
      resolve({
        ok: true,
        protocol: socket.getProtocol(),
        subject: cert.subject?.CN ?? null,
        validTo: cert.valid_to ?? null,
      });
    });
    socket.once("error", (error) => {
      clearTimeout(timeout);
      resolve({ ok: false, message: error.message });
    });
  });
}

async function checkHttp(origin) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const response = await fetch(origin, {
      method: "GET",
      redirect: "manual",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return {
      ok: response.status < 500,
      status: response.status,
      location: response.headers.get("location"),
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "unknown error",
    };
  }
}

const env = loadEnv();
const rawServerUrl = getServerUrl(env);
if (!rawServerUrl) {
  fail("Missing BTCPAY_SERVER_URL.");
  process.exit();
}

let serverUrl;
try {
  serverUrl = new URL(rawServerUrl);
} catch {
  fail("BTCPAY_SERVER_URL must be a valid absolute URL.");
  process.exit();
}

const hostname = serverUrl.hostname;
const port = Number(
  serverUrl.port || (serverUrl.protocol === "https:" ? 443 : 80),
);

console.log(`BTCPay endpoint: ${serverUrl.origin}`);
const publicIp = await getPublicIp();
if (publicIp) console.log(`This server public IP: ${publicIp}`);

try {
  const records = await dns.lookup(hostname, { all: true });
  console.log(`DNS: ${records.map((record) => record.address).join(", ")}`);
} catch (error) {
  fail(
    `DNS failed for ${hostname}: ${
      error instanceof Error ? error.message : "unknown error"
    }`,
  );
}

const tcp = await checkTcp(hostname, port);
if (tcp.ok) {
  console.log(`TCP ${hostname}:${port}: ok`);
} else {
  fail(`TCP ${hostname}:${port}: failed (${tcp.message})`);
}

if (serverUrl.protocol === "https:") {
  const tlsResult = await checkTls(hostname, port);
  if (tlsResult.ok) {
    console.log(
      `TLS: ok (${tlsResult.protocol}, subject=${tlsResult.subject}, validTo=${tlsResult.validTo})`,
    );
  } else {
    fail(`TLS: failed (${tlsResult.message})`);
  }
}

const http = await checkHttp(serverUrl.origin);
if (http.ok) {
  console.log(
    `HTTP: ${http.status}${http.location ? ` -> ${http.location}` : ""}`,
  );
} else {
  fail(`HTTP: failed (${http.message})`);
}

if (process.exitCode) {
  console.error(
    "Endpoint is not launch-ready. Use a reachable BTCPay host before enabling Bitcoin checkout.",
  );
} else {
  console.log("Endpoint preflight passed. Run npm run verify:btcpay next.");
}
