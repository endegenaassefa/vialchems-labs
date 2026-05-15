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
): boolean {
  if (!origin) return true;

  const allowedOrigins = new Set<string>();
  const primaryOrigin = normalizeOrigin(siteUrl);

  if (primaryOrigin) {
    allowedOrigins.add(primaryOrigin);
  }

  for (const entry of extraOrigins.split(",")) {
    const normalized = normalizeOrigin(entry.trim());
    if (normalized) {
      allowedOrigins.add(normalized);
    }
  }

  return allowedOrigins.has(origin);
}
