import { z } from "zod/v4";

import type { CustomerQualification } from "@/lib/types";

const otherChoice = "Other";

const qualificationSchema = z
  .object({
    institutionName: z.string().trim().min(1),
    institutionType: z.string().trim().min(1),
    institutionTypeOther: z.string().trim().default(""),
    roleTitle: z.string().trim().min(1),
    roleTitleOther: z.string().trim().default(""),
    procurementContext: z.string().trim().min(1),
    procurementContextOther: z.string().trim().default(""),
    supportingNotes: z.string().trim().default(""),
    attestationAge: z.literal(true),
    attestationRuo: z.literal(true),
    attestationNoHumanUse: z.literal(true)
  })
  .superRefine((input, ctx) => {
    if (input.institutionType === otherChoice && !input.institutionTypeOther) {
      ctx.addIssue({
        code: "custom",
        path: ["institutionTypeOther"],
        message: "Institution type detail is required."
      });
    }
    if (input.roleTitle === otherChoice && !input.roleTitleOther) {
      ctx.addIssue({
        code: "custom",
        path: ["roleTitleOther"],
        message: "Role detail is required."
      });
    }
    if (input.procurementContext === otherChoice && !input.procurementContextOther) {
      ctx.addIssue({
        code: "custom",
        path: ["procurementContextOther"],
        message: "Procurement context detail is required."
      });
    }
  })
  .transform<CustomerQualification>((input) => ({
    institutionName: input.institutionName,
    institutionType:
      input.institutionType === otherChoice
        ? input.institutionTypeOther
        : input.institutionType,
    roleTitle:
      input.roleTitle === otherChoice ? input.roleTitleOther : input.roleTitle,
    procurementContext:
      input.procurementContext === otherChoice
        ? input.procurementContextOther
        : input.procurementContext,
    supportingNotes: input.supportingNotes,
    attestationAge: input.attestationAge,
    attestationRuo: input.attestationRuo,
    attestationNoHumanUse: input.attestationNoHumanUse
  }));

export function parseCustomerQualificationForm(formData: FormData) {
  const parsed = qualificationSchema.safeParse({
    institutionName: String(formData.get("institutionName") ?? "").trim(),
    institutionType: String(formData.get("institutionType") ?? "").trim(),
    institutionTypeOther: String(formData.get("institutionTypeOther") ?? "").trim(),
    roleTitle: String(formData.get("roleTitle") ?? "").trim(),
    roleTitleOther: String(formData.get("roleTitleOther") ?? "").trim(),
    procurementContext: String(formData.get("procurementContext") ?? "").trim(),
    procurementContextOther: String(formData.get("procurementContextOther") ?? "").trim(),
    supportingNotes: String(formData.get("supportingNotes") ?? "").trim(),
    attestationAge: formData.get("attestationAge") === "on",
    attestationRuo: formData.get("attestationRuo") === "on",
    attestationNoHumanUse: formData.get("attestationNoHumanUse") === "on"
  });

  return parsed;
}

export async function upsertCustomerQualification(
  supabase: {
    from: (table: string) => any;
  },
  customerId: string,
  input: CustomerQualification
) {
  const { error } = await supabase
    .from("customer_qualifications")
    .upsert(
      {
        customer_id: customerId,
        institution_name: input.institutionName,
        institution_type: input.institutionType,
        role_title: input.roleTitle,
        credential_details: input.procurementContext,
        research_environment: input.supportingNotes,
        attestation_age: input.attestationAge,
        attestation_ruo: input.attestationRuo,
        attestation_no_human_use: input.attestationNoHumanUse
      },
      {
        onConflict: "customer_id"
      }
    );

  return error;
}

export async function updateCustomerProfileQualification(
  supabase: {
    from: (table: string) => any;
  },
  customerId: string,
  institutionName: string
) {
  const { error } = await supabase
    .from("customer_profiles")
    .update({
      organization: institutionName,
      age_verified: true,
      ruo_acknowledged: true,
      qualified: true,
      qualified_at: new Date().toISOString()
    })
    .eq("id", customerId);

  return error;
}
