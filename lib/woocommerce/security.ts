function normalizeOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function isAllowedHandoffOrigin(
  origin: string | null | undefined,
  siteUrl: string,
  extraOrigins = "",
  options: { allowLocalhost?: boolean } = {},
): boolean {
  if (!origin) return true;

  const allowedOrigins = new Set<string>();
  const primaryOrigin = normalizeOrigin(siteUrl);
  const requestOrigin = normalizeOrigin(origin);

  if (!requestOrigin) return false;

  if (primaryOrigin) {
    allowedOrigins.add(primaryOrigin);
  }

  for (const entry of extraOrigins.split(",")) {
    const normalized = normalizeOrigin(entry.trim());
    if (normalized) {
      allowedOrigins.add(normalized);
    }
  }

  if (options.allowLocalhost) {
    const { hostname } = new URL(requestOrigin);
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return true;
    }
  }

  return allowedOrigins.has(requestOrigin);
}
