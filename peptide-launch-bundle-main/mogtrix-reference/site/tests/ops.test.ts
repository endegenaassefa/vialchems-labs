import { describe, expect, it } from "vitest";
import {
  canAutoAdvanceOrderToShipped,
  getStaffSessionState,
  mapStaffProfileRow,
  normalizeOpsNextPath,
  validateOrderShipmentInput,
  validateOrderStatusTransitionInput,
  validateRequestStatusTransitionInput,
  validateStaffNoteInput
} from "@/lib/ops";

describe("ops helpers", () => {
  it("maps staff profile rows into app types", () => {
    expect(mapStaffProfileRow({
      id: "profile_1",
      email: "lead@example.com",
      full_name: "Research Lead",
      organization: "Independent Research Lab",
      role: "admin",
      staff_active: true,
      age_verified: false,
      blacklisted: false
    })).toEqual({
      id: "profile_1",
      email: "lead@example.com",
      fullName: "Research Lead",
      organization: "Independent Research Lab",
      role: "admin",
      staffActive: true,
      ageVerified: false,
      blacklisted: false
    });
  });

  it("validates request status changes and trims the optional note", () => {
    expect(validateRequestStatusTransitionInput({
      nextStatus: "approved",
      note: "  Ready for manual follow-up.  "
    })).toEqual({
      ok: true,
      errors: [],
      input: {
        nextStatus: "approved",
        note: "Ready for manual follow-up."
      }
    });

    expect(validateRequestStatusTransitionInput({ nextStatus: "shipped" })).toEqual({
      ok: false,
      errors: ["Choose a valid request status."],
      input: null
    });
  });

  it("rejects blank staff notes", () => {
    expect(validateStaffNoteInput({ body: "  Need follow-up documents. " })).toEqual({
      ok: true,
      errors: [],
      input: { body: "Need follow-up documents." }
    });

    expect(validateStaffNoteInput({ body: "   " })).toEqual({
      ok: false,
      errors: ["Enter a note before saving."],
      input: null
    });
  });

  it("validates paid-order transitions and trims optional notes", () => {
    expect(
      validateOrderStatusTransitionInput({
        nextStatus: "processing",
        note: "  Picking and packing. "
      })
    ).toEqual({
      ok: true,
      errors: [],
      input: {
        nextStatus: "processing",
        note: "Picking and packing."
      }
    });

    expect(validateOrderStatusTransitionInput({ nextStatus: "approved" })).toEqual({
      ok: false,
      errors: ["Choose a valid order status."],
      input: null
    });
  });

  it("validates shipment updates for the new ops order detail", () => {
    expect(
      validateOrderShipmentInput({
        trackingReference: " 1Z999AA10123456784 ",
        trackingUrl: "https://track.example/1Z999AA10123456784",
        shipmentNote: "  Left dock at 4 PM. "
      })
    ).toEqual({
      ok: true,
      errors: [],
      input: {
        trackingReference: "1Z999AA10123456784",
        trackingUrl: "https://track.example/1Z999AA10123456784",
        shipmentNote: "Left dock at 4 PM."
      }
    });

    expect(validateOrderShipmentInput({ trackingUrl: "notaurl" })).toEqual({
      ok: false,
      errors: ["Enter a valid tracking URL."],
      input: null
    });
  });

  it("only auto-advances shipment for paid fulfillment-ready orders", () => {
    expect(
      canAutoAdvanceOrderToShipped({
        status: "paid",
        paymentStatus: "succeeded"
      })
    ).toBe(true);

    expect(
      canAutoAdvanceOrderToShipped({
        status: "processing",
        paymentStatus: "succeeded"
      })
    ).toBe(true);

    expect(
      canAutoAdvanceOrderToShipped({
        status: "draft",
        paymentStatus: "pending"
      })
    ).toBe(false);

    expect(
      canAutoAdvanceOrderToShipped({
        status: "payment_requested",
        paymentStatus: "pending"
      })
    ).toBe(false);

    expect(
      canAutoAdvanceOrderToShipped({
        status: "issue",
        paymentStatus: "failed"
      })
    ).toBe(false);

    expect(
      canAutoAdvanceOrderToShipped({
        status: "cancelled",
        paymentStatus: "cancelled"
      })
    ).toBe(false);

    expect(
      canAutoAdvanceOrderToShipped({
        status: "refunded",
        paymentStatus: "refunded"
      })
    ).toBe(false);
  });

  function buildSupabase(profileRow: unknown, user = { id: "profile_1", email: "lead@example.com" }) {
    const maybeSingle = async () => ({
      data: profileRow,
      error: null
    });

    const supabase = {
      auth: {
        getUser: async () => ({
          data: { user },
          error: null
        })
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle
          })
        })
      })
    };

    return supabase;
  }

  it("keeps anonymous visitors outside the protected ops workspace", async () => {
    const supabase = {
      auth: {
        getUser: async () => ({
          data: { user: null },
          error: null
        })
      }
    };

    await expect(getStaffSessionState(supabase as never)).resolves.toMatchObject({
      kind: "anonymous"
    });
  });

  it("maps missing staff profiles to the explicit forbidden state", async () => {
    await expect(getStaffSessionState(buildSupabase(null) as never)).resolves.toMatchObject({
      kind: "forbidden",
      reason: "missing_profile"
    });
  });

  it("keeps inactive staff profiles out of the protected ops workspace", async () => {
    const supabase = buildSupabase({
      id: "profile_1",
      email: "lead@example.com",
      full_name: "Research Lead",
      organization: "Independent Research Lab",
      role: "staff",
      staff_active: false,
      age_verified: false,
      blacklisted: false
    });

    await expect(getStaffSessionState(supabase as never)).resolves.toMatchObject({
      kind: "forbidden",
      reason: "inactive",
      profile: {
        email: "lead@example.com",
        staffActive: false
      }
    });
  });

  it("treats blacklisted and role-mismatched profiles as inactive", async () => {
    await expect(getStaffSessionState(buildSupabase({
      id: "profile_1",
      email: "lead@example.com",
      full_name: "Research Lead",
      organization: "Independent Research Lab",
      role: "staff",
      staff_active: true,
      age_verified: false,
      blacklisted: true
    }) as never)).resolves.toMatchObject({
      kind: "forbidden",
      reason: "inactive"
    });

    await expect(getStaffSessionState(buildSupabase({
      id: "profile_1",
      email: "lead@example.com",
      full_name: "Research Lead",
      organization: "Independent Research Lab",
      role: "viewer" as never,
      staff_active: true,
      age_verified: false,
      blacklisted: false
    }) as never)).resolves.toMatchObject({
      kind: "forbidden",
      reason: "inactive"
    });
  });

  it("admits active staff profiles and normalizes safe next paths", async () => {
    await expect(getStaffSessionState(buildSupabase({
      id: "profile_1",
      email: "lead@example.com",
      full_name: "Research Lead",
      organization: "Independent Research Lab",
      role: "admin",
      staff_active: true,
      age_verified: false,
      blacklisted: false
    }) as never)).resolves.toMatchObject({
      kind: "ready",
      profile: {
        email: "lead@example.com",
        role: "admin",
        staffActive: true
      }
    });

    expect(normalizeOpsNextPath("/ops/requests/request_1")).toBe("/ops/requests/request_1");
    expect(normalizeOpsNextPath("/ops/login?next=/ops")).toBe("/ops");
    expect(normalizeOpsNextPath("https://mogtrix.test/ops/requests/request_1")).toBe("/ops/requests/request_1");
    expect(normalizeOpsNextPath("/shop")).toBe("/ops");
  });
});
