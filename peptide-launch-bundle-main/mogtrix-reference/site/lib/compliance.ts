const unsafeMarketingPatterns = [
  /weight\s*loss/i,
  /bodybuilding/i,
  /human\s*use/i,
  /human\s*consumption/i,
  /\bdiagnos(?:e|is)\b/i,
  /\btreat(?:s|ment|ing)?\b/i,
  /\bcure\b/i,
  /\bprevent disease\b/i,
  /\bdose|dosing\b/i,
  /\bprotocol\b/i
];

export function assertMarketingCopySafe(copy: string) {
  const match = unsafeMarketingPatterns.find((pattern) => pattern.test(copy));
  if (match) {
    throw new Error(`Unsafe marketing copy matched ${match.toString()}`);
  }
}
