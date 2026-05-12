type NextPathOptions = {
  fallback: string;
  isAllowedPath: (value: string) => boolean;
  disallowedPrefixes?: string[];
};

type AuthUrlOptions = {
  error?: string | null;
  status?: string | null;
  next?: string | null;
  normalizeNextPath?: (value: string | null | undefined) => string;
  extra?: Record<string, string | null | undefined>;
};

export function normalizeAuthText(value: FormDataEntryValue | string | null | undefined) {
  return String(value ?? "").trim();
}

export function normalizeAuthEmail(value: FormDataEntryValue | string | null | undefined) {
  return normalizeAuthText(value).toLowerCase();
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function normalizeSafeNextPath(
  value: string | null | undefined,
  options: NextPathOptions
) {
  let nextPath = normalizeAuthText(value);

  if (!nextPath) {
    return options.fallback;
  }

  try {
    if (nextPath.startsWith("http://") || nextPath.startsWith("https://")) {
      nextPath = new URL(nextPath).pathname;
    }
  } catch {
    return options.fallback;
  }

  if (!nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return options.fallback;
  }

  if (options.disallowedPrefixes?.some((prefix) => nextPath.startsWith(prefix))) {
    return options.fallback;
  }

  return options.isAllowedPath(nextPath) ? nextPath : options.fallback;
}

export function buildAuthUrl(pathname: string, options: AuthUrlOptions = {}) {
  const query = new URLSearchParams();

  if (options.error) query.set("error", options.error);
  if (options.status) query.set("status", options.status);
  if (options.next) {
    query.set(
      "next",
      options.normalizeNextPath
        ? options.normalizeNextPath(options.next)
        : options.next
    );
  }

  Object.entries(options.extra ?? {}).forEach(([key, value]) => {
    if (value) {
      query.set(key, value);
    }
  });

  const suffix = query.toString();
  return suffix ? `${pathname}?${suffix}` : pathname;
}

export function getAuthEmailRedirectUrl(pathname: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return new URL(pathname, siteUrl).toString();
}
