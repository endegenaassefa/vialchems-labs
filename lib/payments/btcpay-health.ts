import {
  getBtcpayServerUrl,
  getMissingBtcpayCredentials,
  type RuntimeEnv,
} from "@/lib/checkout/direct-payment";

export type BtcpayHealthReason =
  | "ok"
  | "missing_credential"
  | "invalid_url"
  | "api_rejected"
  | "permission_denied"
  | "http_error"
  | "network_error";

export interface BtcpayHealthResult {
  ok: boolean;
  configured: boolean;
  reachable: boolean;
  reason: BtcpayHealthReason;
  message: string;
  serverUrl?: string;
  storeId?: string;
  storeName?: string | null;
}

interface BtcpayHealthOptions {
  env?: RuntimeEnv;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

interface BtcpayStoreResponse {
  name?: string | null;
}

function healthResult(
  result: Omit<BtcpayHealthResult, "ok"> & { ok?: boolean },
): BtcpayHealthResult {
  return {
    ok: result.ok ?? false,
    configured: result.configured,
    reachable: result.reachable,
    reason: result.reason,
    message: result.message,
    serverUrl: result.serverUrl,
    storeId: result.storeId,
    storeName: result.storeName,
  };
}

function getAbortSignal(timeoutMs: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs).unref?.();
  return controller.signal;
}

export async function checkBtcpayHealth(
  options: BtcpayHealthOptions = {},
): Promise<BtcpayHealthResult> {
  const env = options.env ?? process.env;
  const missing = getMissingBtcpayCredentials(env);
  const serverUrl = getBtcpayServerUrl(env);
  const storeId = env.BTCPAY_STORE_ID?.trim();

  if (missing.length > 0) {
    return healthResult({
      configured: false,
      reachable: false,
      reason: "missing_credential",
      message: `Missing required credential: ${missing[0]}`,
      serverUrl: serverUrl || undefined,
      storeId,
    });
  }

  let server: URL;
  try {
    server = new URL(serverUrl);
  } catch {
    return healthResult({
      configured: false,
      reachable: false,
      reason: "invalid_url",
      message: "BTCPAY_SERVER_URL must be a valid absolute URL.",
      serverUrl,
      storeId,
    });
  }

  if (server.protocol !== "https:" && server.protocol !== "http:") {
    return healthResult({
      configured: false,
      reachable: false,
      reason: "invalid_url",
      message: "BTCPAY_SERVER_URL must use https:// or http://.",
      serverUrl: server.origin,
      storeId,
    });
  }

  const endpoint = `${server.origin}/api/v1/stores/${encodeURIComponent(
    storeId!,
  )}`;
  let response: Response;
  try {
    response = await (options.fetchImpl ?? fetch)(endpoint, {
      method: "GET",
      headers: {
        Authorization: `token ${env.BTCPAY_API_KEY}`,
        "Content-Type": "application/json",
      },
      signal: getAbortSignal(options.timeoutMs ?? 8_000),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "unknown network error";
    return healthResult({
      configured: true,
      reachable: false,
      reason: "network_error",
      message: `BTCPay endpoint is unreachable: ${message}`,
      serverUrl: server.origin,
      storeId,
    });
  }

  if (response.status === 401) {
    return healthResult({
      configured: true,
      reachable: true,
      reason: "api_rejected",
      message: "BTCPay API key was rejected with HTTP 401.",
      serverUrl: server.origin,
      storeId,
    });
  }

  if (response.status === 403) {
    return healthResult({
      configured: true,
      reachable: true,
      reason: "permission_denied",
      message:
        "BTCPay API key lacks store access. Grant btcpay.store.canviewstoresettings plus invoice permissions.",
      serverUrl: server.origin,
      storeId,
    });
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    return healthResult({
      configured: true,
      reachable: true,
      reason: "http_error",
      message: `BTCPay store check failed with HTTP ${response.status} ${text.slice(
        0,
        180,
      )}`,
      serverUrl: server.origin,
      storeId,
    });
  }

  const store = (await response
    .json()
    .catch(() => ({}))) as BtcpayStoreResponse;
  return healthResult({
    ok: true,
    configured: true,
    reachable: true,
    reason: "ok",
    message: "BTCPay endpoint is reachable and the API key can read the store.",
    serverUrl: server.origin,
    storeId,
    storeName: store.name ?? null,
  });
}
