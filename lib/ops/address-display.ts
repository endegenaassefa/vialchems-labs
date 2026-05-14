// The shipping address snapshot is persisted as a loose JSON blob whose
// exact key names have drifted across checkout versions. fmtAddress pulls
// the known fields (with fallback key names) into human-readable lines so
// ops staff can read an address to pack a box — never raw JSON.

export function fmtAddress(snapshot: Record<string, unknown>): string[] {
  const pick = (...keys: string[]): string => {
    for (const key of keys) {
      const value = snapshot[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
    return "";
  };
  const name = pick("name", "recipientName", "fullName");
  const street = pick("street", "street1", "line1");
  const street2 = pick("street2", "line2");
  const city = pick("city");
  const state = pick("stateCode", "state");
  const zip = pick("zip", "postalCode", "postal_code");
  const country = pick("countryCode", "country");
  const cityLine = [[city, state].filter(Boolean).join(", "), zip]
    .filter(Boolean)
    .join(" ");
  return [name, street, street2, cityLine, country].filter(Boolean);
}
