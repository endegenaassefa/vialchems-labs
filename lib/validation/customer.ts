/**
 * Customer-account validation schemas (single source of truth).
 *
 * Spec §9 — all client + server validation for registration,
 * profile editing, address editing, and password policy lives in
 * this module so a tampered POST body cannot bypass a client-only
 * check.
 *
 * Schemas:
 *   • fullNameSchema / emailSchema / phoneSchema / dobSchema
 *   • orgTypeSchema / orgOtherSchema / researchFocusSchema
 *   • passwordSchema (NIST 800-63B aligned + zxcvbn-ts >= 3)
 *   • addressSchema
 *   • registrationSchema (composed)
 *   • profileEditSchema (subset of registration; DOB explicitly
 *     excluded — spec §3.5 immutability)
 *
 * Iron Law: every check here runs on BOTH the client form
 * (eager UX) and the server route (authoritative gate). The
 * registration route discards the parsed shape if `safeParse`
 * fails — no field-level coercion outside the schema.
 */
import { z } from "zod";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommon from "@zxcvbn-ts/language-common";
import * as zxcvbnEn from "@zxcvbn-ts/language-en";

// Configure zxcvbn-ts ONCE at module load. The dictionaries combine
// the language-common (numeric sequences, keyboards) + language-en
// (top-N common English passwords). This pulls in the ~10k common
// passwords list mandated by spec §3.1 without us shipping a
// hand-rolled blocklist.
zxcvbnOptions.setOptions({
  translations: zxcvbnEn.translations,
  graphs: zxcvbnCommon.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommon.dictionary,
    ...zxcvbnEn.dictionary,
  },
});

// ---------------------------------------------------------------------------
// Primitive schemas
// ---------------------------------------------------------------------------

export const fullNameSchema = z
  .string()
  .trim()
  .min(2, "Full name must be at least 2 characters")
  .max(120, "Full name must be 120 characters or fewer");

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address")
  .max(254, "Email is too long");

/**
 * Optional E.164-ish phone. Accepts numbers with or without a
 * leading `+`. Digits-only after the optional `+`, 7-15 digits
 * total (E.164 max length is 15; we permit 7 minimum to cover
 * shorter international formats). Empty string is coerced to
 * undefined so an optional UI field that was never filled doesn't
 * trigger a regex failure.
 */
export const phoneSchema = z.preprocess(
  (value) => {
    if (value === null) return undefined;
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    }
    return value;
  },
  z
    .string()
    .regex(
      /^\+?[1-9]\d{6,14}$/,
      "Enter a phone number with 7-15 digits (international format).",
    )
    .optional(),
);

/**
 * Date-of-birth — YYYY-MM-DD string. Enforces age >= 21 at
 * validation time. The DB has the same `age_at_least_21` check
 * constraint as a defence in depth. We intentionally re-implement
 * the calendar arithmetic here (rather than naive `currentYear -
 * birthYear`) so a birthdate of 2005-12-31 evaluated on 2026-01-01
 * correctly rejects (would-be 20 years old).
 */
export const dobSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format")
  .refine(
    (value) => {
      const [y, m, d] = value.split("-").map((n) => Number.parseInt(n, 10));
      if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d))
        return false;
      const dob = new Date(Date.UTC(y, m - 1, d));
      if (Number.isNaN(dob.getTime())) return false;
      if (dob.getUTCFullYear() !== y || dob.getUTCMonth() !== m - 1)
        return false;
      const today = new Date();
      const todayUtc = Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
      );
      if (dob.getTime() > todayUtc) return false;
      // Age in years, calendar-correct.
      let age = today.getUTCFullYear() - y;
      const beforeBirthday =
        today.getUTCMonth() < m - 1 ||
        (today.getUTCMonth() === m - 1 && today.getUTCDate() < d);
      if (beforeBirthday) age -= 1;
      return age >= 21;
    },
    {
      message:
        "You must be at least 21 years old to register a research account.",
    },
  );

export const RESEARCH_ORG_TYPES = [
  "university",
  "biotech",
  "independent_research",
  "cro",
  "government",
  "individual",
  "other",
] as const;
export type ResearchOrgType = (typeof RESEARCH_ORG_TYPES)[number];

export const orgTypeSchema = z.enum(RESEARCH_ORG_TYPES);

export const orgOtherSchema = z.preprocess((value) => {
  // Normalise null → undefined so an API client that sends explicit JSON
  // null for an unused optional field doesn't trip `.optional()` (which
  // accepts undefined but rejects null with invalid_type). The browser
  // form already sends undefined for non-"other" org types; this widens
  // the gate for SDK / curl callers as defence in depth.
  if (value === null) return undefined;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  }
  return value;
}, z.string().min(2).max(120).optional());

// Optional now (2026-06-12): operator removed the mandatory-writing
// requirement from registration after customer feedback that a
// 10-character minimum was friction without clear value. Accepts
// undefined, null, empty string, or 1-500 chars. The form still
// shows it as an optional field, just no longer required to submit.
export const researchFocusSchema = z.preprocess((value) => {
  if (value === null) return undefined;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  }
  return value;
}, z.string().max(500, "Keep the research description under 500 characters").optional());

// ---------------------------------------------------------------------------
// Password policy — NIST 800-63B aligned (length-first, complexity light,
// blocklist via zxcvbn-ts).
// ---------------------------------------------------------------------------

export interface PasswordStrengthResult {
  /** zxcvbn-ts score, 0 (weak) to 4 (strong). */
  score: number;
  /** True iff length / complexity rules met AND zxcvbn score >= 3. */
  acceptable: boolean;
  /** Human-readable feedback (warning + first suggestion) for the UI. */
  feedback: string[];
}

const RULE_LENGTH_MIN = 12;
const RULE_LENGTH_MAX = 128;
const RULE_UPPER = /[A-Z]/;
const RULE_LOWER = /[a-z]/;
const RULE_DIGIT = /\d/;

export function evaluatePasswordStrength(
  password: string,
): PasswordStrengthResult {
  const reasons: string[] = [];
  if (typeof password !== "string") {
    return { score: 0, acceptable: false, feedback: ["Password is required."] };
  }
  if (password.length < RULE_LENGTH_MIN) {
    reasons.push(`Use at least ${RULE_LENGTH_MIN} characters.`);
  }
  if (password.length > RULE_LENGTH_MAX) {
    reasons.push(`Keep it under ${RULE_LENGTH_MAX} characters.`);
  }
  if (!RULE_UPPER.test(password)) {
    reasons.push("Include at least one uppercase letter.");
  }
  if (!RULE_LOWER.test(password)) {
    reasons.push("Include at least one lowercase letter.");
  }
  if (!RULE_DIGIT.test(password)) {
    reasons.push("Include at least one digit.");
  }

  // zxcvbn-ts can crash on extreme inputs in older versions; guard it
  // so password validation never throws an uncaught exception that
  // would surface as a 500 on the registration route.
  let score = 0;
  let zxcvbnFeedback: string[] = [];
  try {
    const result = zxcvbn(password.slice(0, RULE_LENGTH_MAX + 1));
    score = result.score;
    if (result.feedback.warning) zxcvbnFeedback.push(result.feedback.warning);
    if (result.feedback.suggestions?.[0])
      zxcvbnFeedback.push(result.feedback.suggestions[0]);
  } catch {
    score = 0;
    zxcvbnFeedback = [
      "Password could not be evaluated; choose a different one.",
    ];
  }

  if (score < 3) {
    reasons.push(
      "Choose a less common password (add length or unique words instead of substitutions).",
    );
  }

  const acceptable = reasons.length === 0;
  const feedback = acceptable ? [] : [...reasons, ...zxcvbnFeedback];
  return { score, acceptable, feedback };
}

export const passwordSchema = z.string().superRefine((value, ctx) => {
  const evaluation = evaluatePasswordStrength(value);
  if (!evaluation.acceptable) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: evaluation.feedback[0] ?? "Password does not meet policy.",
    });
  }
});

// ---------------------------------------------------------------------------
// Address
// ---------------------------------------------------------------------------

export const addressSchema = z.object({
  street1: z.string().trim().min(1, "Street address is required").max(200),
  street2: z.preprocess((value) => {
    // Normalise null → undefined (same defence-in-depth treatment as
    // orgOtherSchema / phoneSchema). The browser form sends "" for empty
    // street2 which the trim path already handles; SDK / curl callers that
    // send explicit JSON null would otherwise trip `.optional()`.
    if (value === null) return undefined;
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    }
    return value;
  }, z.string().max(200).optional()),
  city: z.string().trim().min(1, "City is required").max(100),
  region: z.string().trim().min(1, "State/region is required").max(100),
  postal_code: z.string().trim().min(2, "Postal code is required").max(20),
  country: z
    .preprocess(
      (value) => {
        if (typeof value === "string") return value.trim().toUpperCase();
        return value;
      },
      z.string().length(2, "Use a 2-letter country code"),
    )
    .default("US"),
});

export type AddressInput = z.infer<typeof addressSchema>;

// ---------------------------------------------------------------------------
// Registration (composed)
// ---------------------------------------------------------------------------

/**
 * Shared base object used by `registrationSchema` and the legacy
 * `completeProfileSchema` (no password — legacy magic-link customers
 * keep magic-link as their auth method). Defined as an unrefined
 * `z.object` so each composed schema can omit / extend before
 * attaching its own `.superRefine` (zod v4 detaches refinements
 * from `.extend`).
 */
const registrationBaseSchema = z.object({
  full_name: fullNameSchema,
  email: emailSchema,
  phone: phoneSchema,
  date_of_birth: dobSchema,
  research_org_type: orgTypeSchema,
  research_org_other: orgOtherSchema,
  research_focus: researchFocusSchema,
  password: passwordSchema,
  confirm_password: z.string(),
  terms_accepted: z.literal(true, {
    message: "You must confirm you are 21+ and acknowledge research-use-only.",
  }),
  mailing_address: addressSchema,
  shipping_same_as_mailing: z.boolean(),
  shipping_address: addressSchema.optional(),
});

export const registrationSchema = registrationBaseSchema.superRefine(
  (data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirm_password"],
        message: "Passwords do not match.",
      });
    }
    if (data.research_org_type === "other" && !data.research_org_other) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["research_org_other"],
        message: "Describe your organization since you selected Other.",
      });
    }
    if (!data.shipping_same_as_mailing && !data.shipping_address) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["shipping_address"],
        message: "Provide a shipping address or check Same as mailing.",
      });
    }
  },
);

export type RegistrationInput = z.infer<typeof registrationSchema>;

// ---------------------------------------------------------------------------
// Profile edit (subset; DOB explicitly excluded — immutable per spec §3.5)
// ---------------------------------------------------------------------------

export const profileEditSchema = z
  .object({
    full_name: fullNameSchema.optional(),
    phone: phoneSchema,
    research_org_type: orgTypeSchema.optional(),
    research_org_other: orgOtherSchema,
    research_focus: researchFocusSchema.optional(),
  })
  // strict() would error on date_of_birth — instead we silently strip
  // it so a stale client form can still submit a partial edit without
  // pretending to also let the user change their birthdate.
  .strip();

export type ProfileEditInput = z.infer<typeof profileEditSchema>;

// ---------------------------------------------------------------------------
// Sign-in / forgot / reset payloads
// ---------------------------------------------------------------------------

export const signInWithPasswordSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password").max(RULE_LENGTH_MAX),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required").max(2048),
    password: passwordSchema,
    confirm_password: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirm_password"],
        message: "Passwords do not match.",
      });
    }
  });

export const completeProfileSchema = registrationBaseSchema
  .omit({ password: true, confirm_password: true })
  .superRefine((data, ctx) => {
    if (data.research_org_type === "other" && !data.research_org_other) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["research_org_other"],
        message: "Describe your organization since you selected Other.",
      });
    }
    if (!data.shipping_same_as_mailing && !data.shipping_address) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["shipping_address"],
        message: "Provide a shipping address or check Same as mailing.",
      });
    }
  });

export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;
