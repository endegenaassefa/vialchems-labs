import type { User } from "@supabase/supabase-js";

import { normalizeAuthEmail, normalizeAuthText } from "@/lib/auth-helpers";
import { mapStaffProfileRow } from "@/lib/ops";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service";
import type { StaffProfile } from "@/lib/types";

const STAFF_PROFILE_SELECT =
  "id, email, full_name, organization, role, staff_active, age_verified, blacklisted";

type StaffProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  organization: string | null;
  role: StaffProfile["role"];
  staff_active: boolean;
  age_verified: boolean;
  blacklisted: boolean;
};

type AuthAdminUser = Pick<
  User,
  "id" | "email" | "email_confirmed_at" | "user_metadata"
>;

type ServiceRoleClient = NonNullable<
  ReturnType<typeof createServiceRoleSupabaseClient>
>;

export type StaffAccessAdminState = {
  configured: boolean;
  pendingProfiles: StaffProfile[];
};

export type StaffProfileMutationResult =
  | {
      ok: true;
      action: "created" | "updated";
      profile: StaffProfile;
      hadCustomerProfile: boolean;
      metadataSynced: boolean;
    }
  | {
      ok: false;
      reason: "config" | "lookup" | "not_found" | "update";
      message: string;
    };

function getServiceRoleClient() {
  return createServiceRoleSupabaseClient();
}

function getUserMetadata(user: AuthAdminUser) {
  return user.user_metadata && typeof user.user_metadata === "object"
    ? (user.user_metadata as Record<string, unknown>)
    : {};
}

function isMissingCustomerProfilesTable(message?: string | null) {
  return Boolean(message && message.includes("public.customer_profiles"));
}

async function findAuthUserByEmail(
  supabase: ServiceRoleClient,
  email: string
) {
  let page = 1;

  while (page <= 10) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 200
    });

    if (error) {
      return { user: null, error };
    }

    const users = data?.users ?? [];
    const match =
      users.find(
        (candidate) => candidate.email?.toLowerCase() === email.toLowerCase()
      ) ?? null;

    if (match) {
      return { user: match as AuthAdminUser, error: null };
    }

    if (users.length < 200) {
      break;
    }

    page += 1;
  }

  return { user: null, error: null };
}

async function loadStaffProfile(
  supabase: ServiceRoleClient,
  profileId: string
) {
  const { data, error } = await supabase
    .from("profiles")
    .select(STAFF_PROFILE_SELECT)
    .eq("id", profileId)
    .maybeSingle();

  if (error) {
    return { profile: null, error };
  }

  return {
    profile: data ? mapStaffProfileRow(data as StaffProfileRow) : null,
    error: null
  };
}

export async function listPendingStaffProfiles(): Promise<StaffAccessAdminState> {
  const supabase = getServiceRoleClient();

  if (!supabase) {
    return {
      configured: false,
      pendingProfiles: []
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(STAFF_PROFILE_SELECT)
    .in("role", ["staff", "admin"])
    .eq("staff_active", false)
    .order("email", { ascending: true });

  if (error || !data) {
    return {
      configured: true,
      pendingProfiles: []
    };
  }

  return {
    configured: true,
    pendingProfiles: data.map((row) => mapStaffProfileRow(row as StaffProfileRow))
  };
}

export async function activateStaffProfile(
  profileId: string
): Promise<StaffProfileMutationResult> {
  const supabase = getServiceRoleClient();

  if (!supabase) {
    return {
      ok: false,
      reason: "config",
      message: "Server-owned Supabase access is unavailable on this deployment."
    };
  }

  const current = await loadStaffProfile(supabase, profileId);

  if (current.error) {
    return {
      ok: false,
      reason: "lookup",
      message: "The staff profile could not be loaded."
    };
  }

  if (!current.profile) {
    return {
      ok: false,
      reason: "not_found",
      message: "That staff profile no longer exists."
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ staff_active: true })
    .eq("id", profileId)
    .select(STAFF_PROFILE_SELECT)
    .maybeSingle();

  if (error || !data) {
    return {
      ok: false,
      reason: "update",
      message: "The staff profile could not be activated."
    };
  }

  return {
    ok: true,
    action: "updated",
    profile: mapStaffProfileRow(data as StaffProfileRow),
    hadCustomerProfile: false,
    metadataSynced: true
  };
}

export async function repairStaffProfileByEmail(
  email: string,
  options: { activate?: boolean } = {}
): Promise<StaffProfileMutationResult> {
  const normalizedEmail = normalizeAuthEmail(email);
  const supabase = getServiceRoleClient();

  if (!supabase) {
    return {
      ok: false,
      reason: "config",
      message: "Server-owned Supabase access is unavailable on this deployment."
    };
  }

  const authUserResult = await findAuthUserByEmail(supabase, normalizedEmail);

  if (authUserResult.error) {
    return {
      ok: false,
      reason: "lookup",
      message: "The auth user directory could not be searched."
    };
  }

  if (!authUserResult.user) {
    return {
      ok: false,
      reason: "not_found",
      message: "No Supabase auth user exists for that email yet."
    };
  }

  const [profileResult, customerProfileResult] = await Promise.all([
    loadStaffProfile(supabase, authUserResult.user.id),
    supabase
      .from("customer_profiles")
      .select("id")
      .eq("id", authUserResult.user.id)
      .maybeSingle()
  ]);

  if (
    profileResult.error
    || (
      customerProfileResult.error
      && !isMissingCustomerProfilesTable(customerProfileResult.error.message)
    )
  ) {
    return {
      ok: false,
      reason: "lookup",
      message: "The current provisioning state could not be inspected."
    };
  }

  const metadata = getUserMetadata(authUserResult.user);
  const fullName = normalizeAuthText(
    typeof metadata.full_name === "string" ? metadata.full_name : null
  );
  const organization = normalizeAuthText(
    typeof metadata.organization === "string" ? metadata.organization : null
  );
  const currentProfile = profileResult.profile;
  const activate = Boolean(options.activate);

  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: authUserResult.user.id,
      email: authUserResult.user.email ?? normalizedEmail,
      full_name: currentProfile?.fullName ?? (fullName || null),
      organization: currentProfile?.organization ?? (organization || null),
      role: currentProfile?.role ?? "staff",
      staff_active: activate || currentProfile?.staffActive || false,
      age_verified: currentProfile?.ageVerified ?? false,
      blacklisted: currentProfile?.blacklisted ?? false
    })
    .select(STAFF_PROFILE_SELECT)
    .maybeSingle();

  if (error || !data) {
    return {
      ok: false,
      reason: "update",
      message: "The staff profile could not be created or updated."
    };
  }

  const { error: metadataError } = await supabase.auth.admin.updateUserById(
    authUserResult.user.id,
    {
      user_metadata: {
        ...metadata,
        account_type: "staff"
      }
    }
  );

  return {
    ok: true,
    action: currentProfile ? "updated" : "created",
    profile: mapStaffProfileRow(data as StaffProfileRow),
    hadCustomerProfile: Boolean(customerProfileResult.data?.id),
    metadataSynced: !metadataError
  };
}
