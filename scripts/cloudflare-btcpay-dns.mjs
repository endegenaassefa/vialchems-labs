#!/usr/bin/env node
const DEFAULT_ZONE = "vialchemlabs.net";
const DEFAULT_HOST = "pay.vialchemlabs.net";
const API_BASE = "https://api.cloudflare.com/client/v4";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function normalizeHost(value) {
  return value.trim().replace(/\.$/, "").toLowerCase();
}

async function getPublicIp() {
  const configured = process.env.BTCPAY_PUBLIC_IP?.trim();
  if (configured) return configured;

  const response = await fetch("https://api.ipify.org", {
    headers: { Accept: "text/plain" },
  });
  if (!response.ok) {
    fail(`Could not detect public IP: HTTP ${response.status}`);
  }
  return (await response.text()).trim();
}

async function cloudflareFetch(path, init = {}) {
  const token = process.env.CLOUDFLARE_API_TOKEN?.trim();
  if (!token) {
    fail("Missing CLOUDFLARE_API_TOKEN.");
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok || json.success === false) {
    const reason = json.errors?.[0]?.message ?? `HTTP ${response.status}`;
    fail(`Cloudflare API request failed: ${reason}`);
  }
  return json;
}

async function getZoneId(zoneName) {
  const configured = process.env.CLOUDFLARE_ZONE_ID?.trim();
  if (configured) return configured;

  const json = await cloudflareFetch(
    `/zones?name=${encodeURIComponent(zoneName)}&status=active`,
  );
  const zone = json.result?.[0];
  if (!zone?.id) {
    fail(`Could not find active Cloudflare zone for ${zoneName}.`);
  }
  return zone.id;
}

async function main() {
  const zoneName = normalizeHost(process.env.CLOUDFLARE_ZONE ?? DEFAULT_ZONE);
  const host = normalizeHost(process.env.BTCPAY_HOST ?? DEFAULT_HOST);
  const publicIp = await getPublicIp();
  const zoneId = await getZoneId(zoneName);

  if (!host.endsWith(`.${zoneName}`) && host !== zoneName) {
    fail(`BTCPAY_HOST must be inside ${zoneName}; got ${host}.`);
  }

  const list = await cloudflareFetch(
    `/zones/${zoneId}/dns_records?type=A&name=${encodeURIComponent(host)}`,
  );
  const existing = list.result?.[0];
  const body = JSON.stringify({
    type: "A",
    name: host,
    content: publicIp,
    ttl: 300,
    proxied: false,
    comment: "Self-hosted BTCPay Server for vialchemlabs.net Bitcoin checkout",
  });

  if (existing?.id) {
    await cloudflareFetch(`/zones/${zoneId}/dns_records/${existing.id}`, {
      method: "PUT",
      body,
    });
    console.log(`Updated ${host} A record to ${publicIp} (DNS only).`);
  } else {
    await cloudflareFetch(`/zones/${zoneId}/dns_records`, {
      method: "POST",
      body,
    });
    console.log(`Created ${host} A record to ${publicIp} (DNS only).`);
  }
}

main().catch((error) => {
  fail(
    error instanceof Error ? error.message : "Unknown Cloudflare DNS error.",
  );
});
