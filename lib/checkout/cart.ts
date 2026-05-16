import { siteConfig } from "@/lib/content/site";
import { getBundleBySlug, getProductBySlug } from "@/lib/content/products";

export const CHECKOUT_VERIFICATION_SKU = "CHECKOUT-VERIFY-1USD";

export interface CheckoutCartInputLine {
  sku: string;
  slug: string;
  qty: number;
}

export interface CheckoutCartLine extends CheckoutCartInputLine {
  name: string;
  unitPriceCents: number;
}

export interface CheckoutTotals {
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}

export function resolveCheckoutCartLines(
  lines: CheckoutCartInputLine[],
): { ok: true; lines: CheckoutCartLine[] } | { ok: false; message: string } {
  const resolved: CheckoutCartLine[] = [];

  for (const line of lines) {
    const product = getProductBySlug(line.slug);
    const bundle = product ? undefined : getBundleBySlug(line.slug);
    const item = product ?? bundle;

    if (!item || item.sku !== line.sku) {
      return {
        ok: false,
        message: `Unknown or mismatched catalog line: ${line.sku}`,
      };
    }

    resolved.push({
      sku: item.sku,
      slug: item.slug,
      name: item.name,
      unitPriceCents: item.listPriceCents,
      qty: line.qty,
    });
  }

  return { ok: true, lines: resolved };
}

export function calculateCheckoutShippingCents(
  subtotalCents: number,
  lines: Pick<CheckoutCartLine, "sku">[],
): number {
  const verificationOnly =
    lines.length > 0 &&
    lines.every((line) => line.sku === CHECKOUT_VERIFICATION_SKU);

  if (verificationOnly) return 0;
  if (subtotalCents >= siteConfig.shipping.freeShippingThresholdCents) return 0;
  return siteConfig.shipping.pilotUSCents;
}

export function calculateCheckoutTotals(
  lines: CheckoutCartLine[],
): CheckoutTotals {
  const subtotalCents = lines.reduce(
    (sum, line) => sum + line.unitPriceCents * line.qty,
    0,
  );
  const shippingCents = calculateCheckoutShippingCents(subtotalCents, lines);

  return {
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
  };
}

export function safeCheckoutReturnPath(path: string | undefined): string {
  if (!path?.startsWith("/")) return "/cart";
  if (path.startsWith("//")) return "/cart";
  return path;
}

export function getLocalPreviewSiteUrl(
  origin: string | null,
  fallbackSiteUrl: string,
): string {
  if (process.env.NODE_ENV === "production" || !origin) return fallbackSiteUrl;

  try {
    const originUrl = new URL(origin);
    if (
      originUrl.hostname === "localhost" ||
      originUrl.hostname === "127.0.0.1"
    ) {
      return originUrl.origin;
    }
  } catch {
    return fallbackSiteUrl;
  }

  return fallbackSiteUrl;
}

export function generateMainSiteOrderReference(
  now = new Date(),
  randomId = crypto.randomUUID(),
): string {
  const ymd = now.toISOString().slice(2, 10).replace(/-/g, "");
  const suffix = randomId.replace(/-/g, "").slice(0, 8).toUpperCase();
  return `VC-${ymd}-${suffix}`;
}
