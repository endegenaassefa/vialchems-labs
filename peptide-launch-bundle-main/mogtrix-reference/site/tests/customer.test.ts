import { describe, expect, it } from "vitest";
import { getCustomerAccessState, getCustomerRouteDecision, normalizeCustomerNextPath, type CustomerSessionState } from "@/lib/customer";

describe("customer access helpers", () => {
  it("normalizes next paths to customer-safe routes", () => {
    expect(normalizeCustomerNextPath("/shop")).toBe("/shop");
    expect(normalizeCustomerNextPath("/products/bpc-157-5mg")).toBe("/products/bpc-157-5mg");
    expect(normalizeCustomerNextPath("/ops")).toBe("/shop");
    expect(normalizeCustomerNextPath("https://mogtrix.test/ops")).toBe("/shop");
  });

  it("classifies anonymous sessions cleanly", async () => {
    const supabase = {
      auth: {
        getUser: async () => ({
          data: { user: null },
          error: null
        })
      }
    };

    await expect(getCustomerAccessState(supabase as never)).resolves.toMatchObject({
      kind: "anonymous"
    });
  });

  it("requires email verification before gated browse", async () => {
    const maybeSingle = async () => ({
      data: {
        id: "customer_1",
        email: "lead@example.com",
        full_name: "Research Lead",
        organization: "Independent Research Lab",
        age_verified: false,
        ruo_acknowledged: false,
        blacklisted: false
      },
      error: null
    });
    const supabase = {
      auth: {
        getUser: async () => ({
          data: {
            user: {
              id: "customer_1",
              email: "lead@example.com",
              email_confirmed_at: null
            }
          },
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

    const state = await getCustomerAccessState(supabase as never);
    expect(state).toMatchObject({ kind: "unverified" });
    expect(getCustomerRouteDecision("/shop", state)).toEqual({
      action: "allow"
    });
    expect(getCustomerRouteDecision("/checkout", state)).toEqual({
      action: "redirect",
      location: "/login?error=verify&next=%2Fcheckout"
    });
  });

  it("routes verified but unqualified customers into the qualification checkpoint", async () => {
    const maybeSingle = async () => ({
      data: {
        id: "customer_1",
        email: "lead@example.com",
        full_name: "Research Lead",
        organization: "Independent Research Lab",
        age_verified: true,
        ruo_acknowledged: false,
        blacklisted: false
      },
      error: null
    });
    const supabase = {
      auth: {
        getUser: async () => ({
          data: {
            user: {
              id: "customer_1",
              email: "lead@example.com",
              email_confirmed_at: "2026-05-02T12:00:00.000Z"
            }
          },
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

    const state = await getCustomerAccessState(supabase as never);
    expect(state).toMatchObject({ kind: "unqualified" });
    expect(getCustomerRouteDecision("/products/bpc-157-5mg", state)).toEqual({
      action: "allow"
    });
    expect(getCustomerRouteDecision("/checkout", state)).toEqual({
      action: "redirect",
      location: "/qualify?next=%2Fcheckout"
    });
  });

  it("lets anonymous visitors browse catalog pages but protects checkout", () => {
    const state = {
      kind: "anonymous",
      supabase: {}
    } as unknown as CustomerSessionState;

    expect(getCustomerRouteDecision("/shop", state)).toEqual({ action: "allow" });
    expect(getCustomerRouteDecision("/products/bpc-157-5mg", state)).toEqual({
      action: "allow"
    });
    expect(getCustomerRouteDecision("/checkout", state)).toEqual({
      action: "redirect",
      location: "/login?next=%2Fcheckout"
    });
  });

  it("does not redirect forbidden sessions away from the customer login page", () => {
    const state = {
      kind: "forbidden",
      reason: "missing_profile",
      user: { id: "staff_1", email: "prodbykalebb@proton.me" },
      supabase: {}
    } as unknown as CustomerSessionState;

    expect(getCustomerRouteDecision("/login", state)).toEqual({
      action: "allow"
    });
    expect(getCustomerRouteDecision("/checkout", state)).toEqual({
      action: "redirect",
      location: "/login?error=access&next=%2Fshop"
    });
  });

  it("lets qualified customers into gated routes and keeps them out of auth pages", async () => {
    const state = {
      kind: "ready",
      user: { id: "customer_1", email: "lead@example.com" },
      profile: {
        id: "customer_1",
        email: "lead@example.com",
        fullName: "Research Lead",
        organization: "Independent Research Lab",
        ageVerified: true,
        ruoAcknowledged: true,
        blacklisted: false
      },
      supabase: {}
    } as unknown as CustomerSessionState;

    expect(getCustomerRouteDecision("/shop", state)).toEqual({ action: "allow" });
    expect(getCustomerRouteDecision("/login", state)).toEqual({
      action: "redirect",
      location: "/shop"
    });
  });
});
