import { describe, it, expect } from "vitest";
import { fmtAddress } from "@/lib/ops/address-display";

describe("fmtAddress", () => {
  it("formats a standard checkout address snapshot", () => {
    expect(
      fmtAddress({
        name: "Jane Researcher",
        street: "123 Lab St",
        street2: "Suite 4",
        city: "Madison",
        stateCode: "WI",
        zip: "53703",
        countryCode: "US",
      }),
    ).toEqual([
      "Jane Researcher",
      "123 Lab St",
      "Suite 4",
      "Madison, WI 53703",
      "US",
    ]);
  });

  it("falls back to alternate key names (line1/postalCode/state/country)", () => {
    expect(
      fmtAddress({
        recipientName: "Sam Buyer",
        line1: "9 Vial Ave",
        city: "Cheyenne",
        state: "WY",
        postalCode: "82001",
        country: "US",
      }),
    ).toEqual(["Sam Buyer", "9 Vial Ave", "Cheyenne, WY 82001", "US"]);
  });

  it("drops empty, whitespace, and missing fields", () => {
    expect(
      fmtAddress({
        name: "  Trimmed Name  ",
        street: "  ",
        city: "Austin",
        stateCode: "TX",
        zip: "",
      }),
    ).toEqual(["Trimmed Name", "Austin, TX"]);
  });

  it("returns an empty array for an empty or junk snapshot", () => {
    expect(fmtAddress({})).toEqual([]);
    expect(fmtAddress({ note: 123, extra: null })).toEqual([]);
  });

  it("handles a city with no state or zip", () => {
    expect(fmtAddress({ name: "A", city: "Lonelytown" })).toEqual([
      "A",
      "Lonelytown",
    ]);
  });
});
