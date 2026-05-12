import { z } from "zod";

const requiredTrue = z.boolean().refine((value) => value, {
  message: "This acknowledgement is required."
});

const trimmedString = (min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, `Must be at least ${min} characters.`)
    .max(max, `Must be ${max} characters or fewer.`);

export const accessRequestSchema = z.object({
  fullName: trimmedString(2, 120),
  email: z.string().trim().email("Enter a valid email address.").max(180),
  company: z.string().trim().max(160).optional().default(""),
  industry: trimmedString(2, 120),
  roleTitle: trimmedString(2, 120),
  credentials: trimmedString(4, 500),
  researchEnvironment: trimmedString(10, 700),
  intendedUseSummary: trimmedString(10, 700),
  legalName: trimmedString(2, 140),
  attestations: z.object({
    age: requiredTrue,
    qualified: requiredTrue,
    ruoBoundary: requiredTrue,
    noPersonalUse: requiredTrue,
    legalReview: requiredTrue
  })
});

export type AccessRequestInput = z.infer<typeof accessRequestSchema>;

export const accessFormOptions = {
  industries: [
    "Analytical / Scientific Research",
    "Academic Research",
    "Contract Research Organization",
    "Quality / Documentation Review",
    "Other Qualified Research Environment"
  ],
  roles: [
    "Research Scientist",
    "Principal Investigator",
    "Lab Director",
    "Quality Manager",
    "Procurement / Operations"
  ]
};

export function parseAccessRequest(input: unknown) {
  return accessRequestSchema.safeParse(input);
}

export function getFieldErrors(error: z.ZodError) {
  const flattened = error.flatten();
  return {
    formErrors: flattened.formErrors,
    fieldErrors: flattened.fieldErrors
  };
}
