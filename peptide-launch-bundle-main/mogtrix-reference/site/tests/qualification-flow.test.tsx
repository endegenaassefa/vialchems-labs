import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { QualificationFlow } from "@/components/qualification-flow";

describe("qualification flow", () => {
  it("moves through guided steps and reveals follow-up fields for other choices", () => {
    render(
      <QualificationFlow
        action={async () => {}}
        customerEmail="lead@example.com"
        customerName="Research Lead"
        defaultInstitutionName="Independent Research Lab"
        nextPath="/shop"
      />
    );

    expect(
      screen.getByRole("heading", { name: /confirm your account details/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^continue$/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/institution type/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^continue$/i }));

    expect(
      screen.getByRole("heading", { name: /choose the options that match your work/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/organization type/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/tell us about your organization type/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/organization type/i), {
      target: { value: "Other" }
    });

    expect(
      screen.getByLabelText(/tell us about your organization type/i)
    ).toBeInTheDocument();
  });

  it("keeps prior step answers in the final form payload", () => {
    render(
      <QualificationFlow
        action={async () => {}}
        customerEmail="lead@example.com"
        customerName="Research Lead"
        defaultInstitutionName=""
        nextPath="/shop"
      />
    );

    fireEvent.change(screen.getByLabelText(/organization or lab name/i), {
      target: { value: "Independent Research Lab" }
    });
    fireEvent.click(screen.getByRole("button", { name: /^continue$/i }));

    fireEvent.change(screen.getByLabelText(/organization type/i), {
      target: { value: "University lab" }
    });
    fireEvent.change(screen.getByLabelText(/your role/i), {
      target: { value: "Research lead" }
    });
    fireEvent.change(screen.getByLabelText(/how you plan to use the catalog/i), {
      target: { value: "Method development" }
    });
    fireEvent.change(screen.getByLabelText(/anything else we should know/i), {
      target: { value: "Need current batch documents." }
    });
    fireEvent.click(screen.getByRole("button", { name: /^continue$/i }));

    const submitButton = screen.getByRole("button", { name: /open full catalog/i });
    const form = submitButton.closest("form");

    expect(form).not.toBeNull();
    expect(Object.fromEntries(new FormData(form as HTMLFormElement).entries())).toEqual(
      expect.objectContaining({
        institutionName: "Independent Research Lab",
        institutionType: "University lab",
        roleTitle: "Research lead",
        procurementContext: "Method development",
        supportingNotes: "Need current batch documents.",
        next: "/shop"
      })
    );
  });
});
