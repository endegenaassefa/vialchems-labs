import "server-only";

import { siteConfig } from "@/lib/content/site";
import {
  addDemoRequest,
  getDemoStore,
  updateDemoRequestStatus
} from "@/lib/db/demo-store";
import type {
  AccessRequest,
  AccessRequestUpdate,
  AccessStatus
} from "@/lib/db/types";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import type { AccessRequestInput } from "@/lib/validation/access";

type AccessRequestRow = {
  id: string;
  full_name: string;
  email: string;
  company: string | null;
  industry: string;
  role_title: string;
  credentials: string;
  research_environment: string;
  intended_use_summary: string;
  legal_name: string;
  attestations: AccessRequestInput["attestations"];
  status: AccessStatus;
  created_at: string;
  updated_at: string;
};

function mapRow(row: AccessRequestRow): AccessRequest {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    company: row.company ?? "",
    industry: row.industry,
    roleTitle: row.role_title,
    credentials: row.credentials,
    researchEnvironment: row.research_environment,
    intendedUseSummary: row.intended_use_summary,
    legalName: row.legal_name,
    attestations: row.attestations,
    status: row.status,
    submittedAt: row.created_at,
    updatedAt: row.updated_at,
    source: "supabase"
  };
}

export async function createAccessRequest(
  input: AccessRequestInput
): Promise<AccessRequest> {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return addDemoRequest(input);
  }

  const { data, error } = await supabase
    .from("access_requests")
    .insert({
      full_name: input.fullName,
      email: input.email,
      company: input.company || null,
      industry: input.industry,
      role_title: input.roleTitle,
      credentials: input.credentials,
      research_environment: input.researchEnvironment,
      intended_use_summary: input.intendedUseSummary,
      legal_name: input.legalName,
      attestations: input.attestations,
      status: "pending"
    })
    .select("*")
    .single<AccessRequestRow>();

  if (error) {
    throw new Error(`Access request failed: ${error.message}`);
  }

  const request = mapRow(data);

  const { error: legalError } = await supabase.from("legal_acceptances").insert({
    access_request_id: request.id,
    legal_version: siteConfig.legalVersion,
    accepted_terms: input.attestations.legalReview,
    accepted_ruo_boundary: input.attestations.ruoBoundary,
    accepted_no_personal_use: input.attestations.noPersonalUse,
    signature_name: input.legalName
  });

  if (legalError) {
    throw new Error(`Legal acceptance failed: ${legalError.message}`);
  }

  return request;
}

export async function listAccessRequests(): Promise<AccessRequest[]> {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return getDemoStore().requests;
  }

  const { data, error } = await supabase
    .from("access_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)
    .returns<AccessRequestRow[]>();

  if (error) {
    throw new Error(`Could not load access requests: ${error.message}`);
  }

  return data.map(mapRow);
}

export async function updateAccessRequest(
  id: string,
  update: AccessRequestUpdate
): Promise<AccessRequest | null> {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return updateDemoRequestStatus(id, update.status);
  }

  const { data, error } = await supabase
    .from("access_requests")
    .update({ status: update.status })
    .eq("id", id)
    .select("*")
    .single<AccessRequestRow>();

  if (error) {
    throw new Error(`Could not update access request: ${error.message}`);
  }

  await supabase.from("admin_audit_log").insert({
    actor_id: update.reviewedBy,
    action: "access_request.status_changed",
    target_table: "access_requests",
    target_id: id,
    metadata: { status: update.status }
  });

  return mapRow(data);
}
