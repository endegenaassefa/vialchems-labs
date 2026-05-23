/**
 * D4 — Server-side Plausible event proxy
 * (Section 6 super-prompt 2026-05-22).
 *
 * Plausible's `script.outbound-links.js` snippet attaches a global
 * `window.plausible` function that fires events from the browser. For
 * events that originate server-side — order_placed in
 * /api/checkout/orders, order_paid in lib/payments/reconciliation —
 * there is no `window`. This helper POSTs directly to Plausible's
 * Events API instead.
 *
 * Stays stub-safe when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is not set
 * (Day-1 default): returns { ok: false, code: "plausible_disabled" }
 * without making any network call. Never throws — analytics must
 * not bubble into credit-bearing code paths.
 */
import { siteConfig } from "@/lib/content/site";

export interface ServerTrackInput {
  event: string;
  /** Optional structured props attached to the Plausible event. */
  props?: Record<string, string | number | boolean>;
  /**
   * The URL the event is associated with. Plausible uses this to
   * attribute the event to a page in the dashboard. Defaults to the
   * site root.
   */
  url?: string;
  /**
   * Visitor IP, forwarded to Plausible so the event counts toward
   * unique-visitor stats correctly. Pass the original client's
   * X-Forwarded-For header value, NOT the server IP. Omit for
   * webhook-driven events that have no associated visitor.
   */
  visitorIp?: string;
  /** Visitor User-Agent, for device-class attribution. */
  userAgent?: string;
}

export interface ServerTrackResult {
  ok: boolean;
  code?: "plausible_disabled" | "network_error" | "non_2xx" | "sent";
  status?: number;
}

const PLAUSIBLE_EVENTS_URL = "https://plausible.io/api/event";

export async function trackServerEvent(
  input: ServerTrackInput,
): Promise<ServerTrackResult> {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();
  if (!domain) {
    return { ok: false, code: "plausible_disabled" };
  }

  const body = {
    name: input.event,
    url: input.url ?? siteConfig.url,
    domain,
    props: input.props,
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (input.visitorIp) headers["X-Forwarded-For"] = input.visitorIp;
    // Plausible needs a User-Agent header — without one it ignores the event.
    headers["User-Agent"] = input.userAgent ?? "VialChemLabs/1.0 (server-event)";

    const res = await fetch(PLAUSIBLE_EVENTS_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return { ok: false, code: "non_2xx", status: res.status };
    }
    return { ok: true, code: "sent", status: res.status };
  } catch {
    return { ok: false, code: "network_error" };
  }
}
