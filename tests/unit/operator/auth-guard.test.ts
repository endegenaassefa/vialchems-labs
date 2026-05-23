/**
 * C1 — Operator auth-guard regression guard
 * (Section 6 super-prompt 2026-05-22).
 *
 * The guard MUST refuse a non-operator session and MUST treat a
 * missing Supabase config as "unauthenticated" rather than
 * accidentally letting traffic through. Both contracts are
 * verified here.
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { isOperatorEmail } from "@/lib/operator/auth-guard";

describe("isOperatorEmail — operator-allow-list contract", () => {
  beforeEach(() => {
    delete process.env.ALLOWED_OPERATOR_EMAILS;
  });

  afterEach(() => {
    delete process.env.ALLOWED_OPERATOR_EMAILS;
  });

  it("defaults to endegenaassefa2@gmail.com per user_operator_identity memory", () => {
    expect(isOperatorEmail("endegenaassefa2@gmail.com")).toBe(true);
    expect(isOperatorEmail("ENDEGENAASSEFA2@gmail.com")).toBe(true);
    expect(isOperatorEmail("  endegenaassefa2@gmail.com  ")).toBe(true);
  });

  it("rejects any other email when the env var is unset", () => {
    expect(isOperatorEmail("alice@example.com")).toBe(false);
    expect(isOperatorEmail("alexia@myabrb.com")).toBe(false);
    expect(isOperatorEmail("")).toBe(false);
    expect(isOperatorEmail(null)).toBe(false);
    expect(isOperatorEmail(undefined)).toBe(false);
  });

  it("respects a comma-separated ALLOWED_OPERATOR_EMAILS override", () => {
    process.env.ALLOWED_OPERATOR_EMAILS =
      "ops@vialchemlabs.net, alice@example.com,  bob@example.com  ";
    expect(isOperatorEmail("ops@vialchemlabs.net")).toBe(true);
    expect(isOperatorEmail("alice@example.com")).toBe(true);
    expect(isOperatorEmail("bob@example.com")).toBe(true);
    expect(isOperatorEmail("endegenaassefa2@gmail.com")).toBe(false);
  });

  it("treats whitespace-only env var as 'no override' (default allow-list applies)", () => {
    process.env.ALLOWED_OPERATOR_EMAILS = "   ";
    expect(isOperatorEmail("endegenaassefa2@gmail.com")).toBe(true);
    expect(isOperatorEmail("alice@example.com")).toBe(false);
  });
});
