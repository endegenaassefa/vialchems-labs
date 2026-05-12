import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createServiceRoleSupabaseClient,
  listUsers,
  profileLookup,
  pendingProfilesOrder,
  customerProfileLookup,
  profileUpsert,
  profileUpdate,
  updateUserById,
  upsertPayloads,
  updatePayloads
} = vi.hoisted(() => {
  const upsertPayloads: unknown[] = [];
  const updatePayloads: Array<{ payload: unknown; id: string }> = [];

  return {
    createServiceRoleSupabaseClient: vi.fn(),
    listUsers: vi.fn(),
    profileLookup: vi.fn(),
    pendingProfilesOrder: vi.fn(),
    customerProfileLookup: vi.fn(),
    profileUpsert: vi.fn(),
    profileUpdate: vi.fn(),
    updateUserById: vi.fn(),
    upsertPayloads,
    updatePayloads
  };
});

vi.mock("@/lib/supabase/service", () => ({
  createServiceRoleSupabaseClient
}));

vi.mock("server-only", () => ({}));

import {
  activateStaffProfile,
  listPendingStaffProfiles,
  repairStaffProfileByEmail
} from "@/lib/staff-access-admin";

function buildServiceClient() {
  return {
    auth: {
      admin: {
        listUsers,
        updateUserById
      }
    },
    from(table: string) {
      if (table === "profiles") {
        return {
          select() {
            return {
              eq(_column: string, id: string) {
                return {
                  maybeSingle() {
                    return profileLookup(id);
                  }
                };
              },
              in() {
                return {
                  eq() {
                    return {
                      order() {
                        return pendingProfilesOrder();
                      }
                    };
                  }
                };
              }
            };
          },
          upsert(payload: unknown) {
            upsertPayloads.push(payload);
            return {
              select() {
                return {
                  maybeSingle() {
                    return profileUpsert();
                  }
                };
              }
            };
          },
          update(payload: unknown) {
            return {
              eq(_column: string, id: string) {
                updatePayloads.push({ payload, id });
                return {
                  select() {
                    return {
                      maybeSingle() {
                        return profileUpdate();
                      }
                    };
                  }
                };
              }
            };
          }
        };
      }

      if (table === "customer_profiles") {
        return {
          select() {
            return {
              eq(_column: string, id: string) {
                return {
                  maybeSingle() {
                    return customerProfileLookup(id);
                  }
                };
              }
            };
          }
        };
      }

      throw new Error(`Unexpected table ${table}`);
    }
  };
}

describe("staff access admin helpers", () => {
  beforeEach(() => {
    createServiceRoleSupabaseClient.mockReset();
    listUsers.mockReset();
    profileLookup.mockReset();
    pendingProfilesOrder.mockReset();
    customerProfileLookup.mockReset();
    profileUpsert.mockReset();
    profileUpdate.mockReset();
    updateUserById.mockReset();
    upsertPayloads.length = 0;
    updatePayloads.length = 0;
  });

  it("reports staff admin access as unavailable without a service client", async () => {
    createServiceRoleSupabaseClient.mockReturnValue(null);

    await expect(listPendingStaffProfiles()).resolves.toEqual({
      configured: false,
      pendingProfiles: []
    });

    await expect(repairStaffProfileByEmail("lead@example.com", { activate: true })).resolves.toMatchObject({
      ok: false,
      reason: "config"
    });
  });

  it("lists pending inactive staff profiles", async () => {
    createServiceRoleSupabaseClient.mockReturnValue(buildServiceClient());
    pendingProfilesOrder.mockResolvedValue({
      data: [{
        id: "user_1",
        email: "lead@example.com",
        full_name: "Research Lead",
        organization: "Independent Research Lab",
        role: "staff",
        staff_active: false,
        age_verified: false,
        blacklisted: false
      }],
      error: null
    });

    await expect(listPendingStaffProfiles()).resolves.toEqual({
      configured: true,
      pendingProfiles: [{
        id: "user_1",
        email: "lead@example.com",
        fullName: "Research Lead",
        organization: "Independent Research Lab",
        role: "staff",
        staffActive: false,
        ageVerified: false,
        blacklisted: false
      }]
    });
  });

  it("repairs and activates a manually created auth user without a staff profile", async () => {
    createServiceRoleSupabaseClient.mockReturnValue(buildServiceClient());
    listUsers.mockResolvedValue({
      data: {
        users: [{
          id: "user_1",
          email: "lead@example.com",
          email_confirmed_at: "2026-05-03T00:00:00.000Z",
          user_metadata: {
            full_name: "Research Lead",
            organization: "Independent Research Lab"
          }
        }]
      },
      error: null
    });
    profileLookup.mockResolvedValue({ data: null, error: null });
    customerProfileLookup.mockResolvedValue({ data: { id: "user_1" }, error: null });
    profileUpsert.mockResolvedValue({
      data: {
        id: "user_1",
        email: "lead@example.com",
        full_name: "Research Lead",
        organization: "Independent Research Lab",
        role: "staff",
        staff_active: true,
        age_verified: false,
        blacklisted: false
      },
      error: null
    });
    updateUserById.mockResolvedValue({ data: {}, error: null });

    await expect(
      repairStaffProfileByEmail(" LEAD@example.com ", { activate: true })
    ).resolves.toMatchObject({
      ok: true,
      action: "created",
      hadCustomerProfile: true,
      metadataSynced: true,
      profile: {
        email: "lead@example.com",
        staffActive: true
      }
    });

    expect(upsertPayloads).toEqual([{
      id: "user_1",
      email: "lead@example.com",
      full_name: "Research Lead",
      organization: "Independent Research Lab",
      role: "staff",
      staff_active: true,
      age_verified: false,
      blacklisted: false
    }]);
    expect(updateUserById).toHaveBeenCalledWith("user_1", {
      user_metadata: {
        full_name: "Research Lead",
        organization: "Independent Research Lab",
        account_type: "staff"
      }
    });
  });

  it("returns an exact not-found state when no auth user exists for the email", async () => {
    createServiceRoleSupabaseClient.mockReturnValue(buildServiceClient());
    listUsers.mockResolvedValue({
      data: { users: [] },
      error: null
    });

    await expect(repairStaffProfileByEmail("missing@example.com")).resolves.toMatchObject({
      ok: false,
      reason: "not_found"
    });
  });

  it("repairs staff access even when the older database does not have customer_profiles", async () => {
    createServiceRoleSupabaseClient.mockReturnValue(buildServiceClient());
    listUsers.mockResolvedValue({
      data: {
        users: [{
          id: "user_1",
          email: "lead@example.com",
          email_confirmed_at: "2026-05-03T00:00:00.000Z",
          user_metadata: {
            full_name: "Research Lead"
          }
        }]
      },
      error: null
    });
    profileLookup.mockResolvedValue({ data: null, error: null });
    customerProfileLookup.mockResolvedValue({
      data: null,
      error: {
        message: "Could not find the table 'public.customer_profiles' in the schema cache"
      }
    });
    profileUpsert.mockResolvedValue({
      data: {
        id: "user_1",
        email: "lead@example.com",
        full_name: "Research Lead",
        organization: null,
        role: "staff",
        staff_active: true,
        age_verified: false,
        blacklisted: false
      },
      error: null
    });
    updateUserById.mockResolvedValue({ data: {}, error: null });

    await expect(
      repairStaffProfileByEmail("lead@example.com", { activate: true })
    ).resolves.toMatchObject({
      ok: true,
      hadCustomerProfile: false,
      profile: {
        email: "lead@example.com",
        staffActive: true
      }
    });
  });

  it("activates an existing pending staff profile", async () => {
    createServiceRoleSupabaseClient.mockReturnValue(buildServiceClient());
    profileLookup.mockResolvedValue({
      data: {
        id: "user_1",
        email: "lead@example.com",
        full_name: "Research Lead",
        organization: "Independent Research Lab",
        role: "staff",
        staff_active: false,
        age_verified: false,
        blacklisted: false
      },
      error: null
    });
    profileUpdate.mockResolvedValue({
      data: {
        id: "user_1",
        email: "lead@example.com",
        full_name: "Research Lead",
        organization: "Independent Research Lab",
        role: "staff",
        staff_active: true,
        age_verified: false,
        blacklisted: false
      },
      error: null
    });

    await expect(activateStaffProfile("user_1")).resolves.toMatchObject({
      ok: true,
      profile: {
        email: "lead@example.com",
        staffActive: true
      }
    });

    expect(updatePayloads).toEqual([{
      id: "user_1",
      payload: { staff_active: true }
    }]);
  });
});
