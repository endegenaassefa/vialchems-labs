/**
 * Tests for lib/validation/customer.ts — single source of truth for
 * registration / profile-edit / address-edit zod schemas + password
 * policy used on both client and server.
 *
 * Spec §9 (validation rules) is the source of truth. The schemas
 * must enforce every constraint identically on client + server so a
 * tampered POST body can never bypass a client-only check.
 */
import { describe, it, expect } from "vitest";
import {
  fullNameSchema,
  emailSchema,
  phoneSchema,
  dobSchema,
  orgTypeSchema,
  orgOtherSchema,
  researchFocusSchema,
  passwordSchema,
  addressSchema,
  registrationSchema,
  profileEditSchema,
  evaluatePasswordStrength,
  ResearchOrgType,
} from "@/lib/validation/customer";

describe("fullNameSchema", () => {
  it("accepts a 2-120 char name", () => {
    expect(fullNameSchema.safeParse("Dr. María González").success).toBe(true);
  });
  it("trims surrounding whitespace", () => {
    const r = fullNameSchema.safeParse("  Bo  ");
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toBe("Bo");
  });
  it("rejects a 1-char name", () => {
    expect(fullNameSchema.safeParse("A").success).toBe(false);
  });
  it("rejects a 121-char name", () => {
    expect(fullNameSchema.safeParse("a".repeat(121)).success).toBe(false);
  });
  it("accepts hyphenated + unicode names", () => {
    expect(fullNameSchema.safeParse("Jean-Luc Picard").success).toBe(true);
    expect(fullNameSchema.safeParse("辰巳 隆之").success).toBe(true);
  });
});

describe("emailSchema", () => {
  it("accepts a valid email + lowercases it", () => {
    const r = emailSchema.safeParse("Researcher@Example.COM");
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toBe("researcher@example.com");
  });
  it("rejects malformed emails", () => {
    expect(emailSchema.safeParse("not-an-email").success).toBe(false);
    expect(emailSchema.safeParse("@example.com").success).toBe(false);
    expect(emailSchema.safeParse("user@").success).toBe(false);
  });
  it("rejects emails over 254 chars", () => {
    const long = `${"a".repeat(250)}@b.co`;
    expect(emailSchema.safeParse(long).success).toBe(false);
  });
});

describe("phoneSchema", () => {
  it("accepts an E.164 number", () => {
    expect(phoneSchema.safeParse("+14155552671").success).toBe(true);
  });
  it("accepts a domestic-style number without leading +", () => {
    expect(phoneSchema.safeParse("14155552671").success).toBe(true);
  });
  it("rejects too-short numbers", () => {
    expect(phoneSchema.safeParse("+1234").success).toBe(false);
  });
  it("rejects numbers with letters", () => {
    expect(phoneSchema.safeParse("+1-CALL-NOW").success).toBe(false);
  });
  it("optional: undefined parses to undefined", () => {
    const r = phoneSchema.safeParse(undefined);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toBeUndefined();
  });
  it("optional: empty string parses to undefined", () => {
    const r = phoneSchema.safeParse("");
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toBeUndefined();
  });
});

describe("dobSchema", () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const dobFor = (yearsAgo: number) => `${yyyy - yearsAgo}-${mm}-${dd}`;

  it("accepts a 22-years-ago birthdate", () => {
    expect(dobSchema.safeParse(dobFor(22)).success).toBe(true);
  });
  it("accepts a birthdate exactly 21 years ago today", () => {
    expect(dobSchema.safeParse(dobFor(21)).success).toBe(true);
  });
  it("rejects a birthdate from 20 years ago today (under 21)", () => {
    expect(dobSchema.safeParse(dobFor(20)).success).toBe(false);
  });
  it("rejects a future birthdate", () => {
    expect(dobSchema.safeParse(`${yyyy + 1}-01-01`).success).toBe(false);
  });
  it("rejects malformed date strings", () => {
    expect(dobSchema.safeParse("2001/04/01").success).toBe(false);
    expect(dobSchema.safeParse("not-a-date").success).toBe(false);
  });
});

describe("orgTypeSchema", () => {
  it("accepts every spec enum value", () => {
    const values: ResearchOrgType[] = [
      "university",
      "biotech",
      "independent_research",
      "cro",
      "government",
      "individual",
      "other",
    ];
    for (const v of values) {
      expect(orgTypeSchema.safeParse(v).success).toBe(true);
    }
  });
  it("rejects unknown values", () => {
    expect(orgTypeSchema.safeParse("hospital").success).toBe(false);
  });
});

describe("orgOtherSchema", () => {
  it("accepts a 2-120 char description", () => {
    expect(orgOtherSchema.safeParse("Citizen-science co-op").success).toBe(
      true,
    );
  });
  it("optional: undefined parses to undefined", () => {
    const r = orgOtherSchema.safeParse(undefined);
    expect(r.success).toBe(true);
  });
  // Regression (2026-06-12): a curl/SDK caller that sends explicit JSON
  // null for unused optional fields was tripping the bare `.optional()`
  // (which rejects null with invalid_type) and the /api/auth/register
  // route's anti-enum design swallowed the resulting validation
  // failure — silent registration failure. Preprocessor now normalises
  // null → undefined so the field accepts both shapes.
  it("normalises explicit null to undefined", () => {
    const r = orgOtherSchema.safeParse(null);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toBeUndefined();
  });
  it("normalises empty string to undefined", () => {
    const r = orgOtherSchema.safeParse("");
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toBeUndefined();
  });
});

describe("researchFocusSchema", () => {
  it("accepts 10-500 chars", () => {
    expect(
      researchFocusSchema.safeParse("Studying mitochondrial signalling.")
        .success,
    ).toBe(true);
  });
  it("rejects 9 chars", () => {
    expect(researchFocusSchema.safeParse("too short").success).toBe(false);
  });
  it("rejects 501 chars", () => {
    expect(researchFocusSchema.safeParse("a".repeat(501)).success).toBe(false);
  });
});

describe("addressSchema", () => {
  const base = {
    street1: "123 Lab Way",
    city: "Cambridge",
    region: "MA",
    postal_code: "02139",
    country: "US",
  };
  it("accepts a US address", () => {
    expect(addressSchema.safeParse(base).success).toBe(true);
  });
  it("accepts street2 as optional", () => {
    expect(
      addressSchema.safeParse({ ...base, street2: "Suite 4" }).success,
    ).toBe(true);
  });
  // Regression (2026-06-12): see orgOtherSchema regression note.
  it("normalises street2 null to undefined", () => {
    const r = addressSchema.safeParse({ ...base, street2: null });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.street2).toBeUndefined();
  });
  it("normalises street2 empty string to undefined", () => {
    const r = addressSchema.safeParse({ ...base, street2: "" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.street2).toBeUndefined();
  });
  it("rejects empty street1", () => {
    expect(addressSchema.safeParse({ ...base, street1: "" }).success).toBe(
      false,
    );
  });
  it("rejects 1-char country code", () => {
    expect(addressSchema.safeParse({ ...base, country: "U" }).success).toBe(
      false,
    );
  });
  it("uppercases the country code", () => {
    const r = addressSchema.safeParse({ ...base, country: "us" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.country).toBe("US");
  });
});

describe("evaluatePasswordStrength", () => {
  it("rejects a very common password (score < 3)", () => {
    const r = evaluatePasswordStrength("Password1234");
    expect(r.acceptable).toBe(false);
    expect(r.score).toBeLessThan(3);
  });
  it("accepts a long random-looking password", () => {
    // Random non-dictionary phrase with mixed-case + digits; far above
    // the score-3 threshold without being a famous example.
    const r = evaluatePasswordStrength("Quartz-Plinth!Marigold-Whisper7");
    expect(r.acceptable).toBe(true);
    expect(r.score).toBeGreaterThanOrEqual(3);
  });
  it("returns a feedback message on weak passwords", () => {
    const r = evaluatePasswordStrength("aaaaaaaaaaaa");
    expect(r.acceptable).toBe(false);
    expect(r.feedback.length).toBeGreaterThan(0);
  });
});

describe("passwordSchema", () => {
  it("accepts a 12-char password with upper+lower+digit and zxcvbn >= 3", () => {
    expect(passwordSchema.safeParse("Vialchem!Lab42-mainline").success).toBe(
      true,
    );
  });
  it("rejects a < 12 char password", () => {
    expect(passwordSchema.safeParse("Short1A").success).toBe(false);
  });
  it("rejects a > 128 char password", () => {
    expect(
      passwordSchema.safeParse(`${"A".repeat(70)}${"b".repeat(60)}1`).success,
    ).toBe(false);
  });
  it("rejects a password with no uppercase", () => {
    expect(passwordSchema.safeParse("nouppercase123456").success).toBe(false);
  });
  it("rejects a password with no lowercase", () => {
    expect(passwordSchema.safeParse("NOLOWERCASE123456").success).toBe(false);
  });
  it("rejects a password with no digit", () => {
    expect(passwordSchema.safeParse("NoDigitsHereAtAll").success).toBe(false);
  });
  it("rejects a weak (common) password even if it meets complexity rules", () => {
    expect(passwordSchema.safeParse("Password12345").success).toBe(false);
  });
});

describe("registrationSchema", () => {
  const dobFor = (yearsAgo: number) => {
    const t = new Date();
    return `${t.getFullYear() - yearsAgo}-01-01`;
  };

  const validRegistration = {
    full_name: "Dr. Marie Curie",
    email: "marie@radium.lab",
    phone: "+14155552671",
    date_of_birth: dobFor(50),
    research_org_type: "university" as ResearchOrgType,
    research_focus: "Investigating radioactive decay across heavy nuclei.",
    password: "Vialchem!Lab42-mainline",
    confirm_password: "Vialchem!Lab42-mainline",
    terms_accepted: true as const,
    mailing_address: {
      street1: "1 Radium Lane",
      city: "Paris",
      region: "Île-de-France",
      postal_code: "75005",
      country: "FR",
    },
    shipping_same_as_mailing: true as const,
  };

  it("accepts a fully valid registration", () => {
    expect(registrationSchema.safeParse(validRegistration).success).toBe(true);
  });

  it("rejects when password + confirm_password don't match", () => {
    const r = registrationSchema.safeParse({
      ...validRegistration,
      confirm_password: "Mismatch!Lab42-mainline",
    });
    expect(r.success).toBe(false);
  });

  it("rejects when org_type=other but research_org_other is missing", () => {
    const r = registrationSchema.safeParse({
      ...validRegistration,
      research_org_type: "other" as ResearchOrgType,
    });
    expect(r.success).toBe(false);
  });

  it("accepts when org_type=other and research_org_other is provided", () => {
    const r = registrationSchema.safeParse({
      ...validRegistration,
      research_org_type: "other" as ResearchOrgType,
      research_org_other: "Citizen-science co-op",
    });
    expect(r.success).toBe(true);
  });

  it("rejects when terms_accepted is false", () => {
    const r = registrationSchema.safeParse({
      ...validRegistration,
      terms_accepted: false,
    });
    expect(r.success).toBe(false);
  });

  it("requires shipping_address when shipping_same_as_mailing is false", () => {
    const r = registrationSchema.safeParse({
      ...validRegistration,
      shipping_same_as_mailing: false,
    });
    expect(r.success).toBe(false);
  });

  it("accepts a distinct shipping_address when shipping_same_as_mailing is false", () => {
    const r = registrationSchema.safeParse({
      ...validRegistration,
      shipping_same_as_mailing: false,
      shipping_address: {
        street1: "2 Faraday Way",
        city: "London",
        region: "England",
        postal_code: "WC1E 6BT",
        country: "GB",
      },
    });
    expect(r.success).toBe(true);
  });

  it("rejects an under-21 DOB even if everything else is valid", () => {
    const r = registrationSchema.safeParse({
      ...validRegistration,
      date_of_birth: dobFor(18),
    });
    expect(r.success).toBe(false);
  });
});

describe("profileEditSchema", () => {
  it("accepts a subset of fields (every field optional)", () => {
    expect(profileEditSchema.safeParse({ phone: "+14155552671" }).success).toBe(
      true,
    );
    expect(profileEditSchema.safeParse({ full_name: "New Name" }).success).toBe(
      true,
    );
    expect(profileEditSchema.safeParse({}).success).toBe(true);
  });
  it("rejects DOB edits entirely (immutable per spec §3.5)", () => {
    // No date_of_birth key on the schema means the strict version
    // strips it; in lenient mode we just don't allow it explicitly.
    const r = profileEditSchema.safeParse({ date_of_birth: "1980-01-01" });
    expect(r.success).toBe(true);
    if (r.success) {
      expect((r.data as Record<string, unknown>).date_of_birth).toBeUndefined();
    }
  });
});
