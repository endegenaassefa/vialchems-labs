import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from "@testing-library/react";

import { QualificationFlow } from "@/components/qualification-flow";
import {
  ATTESTATIONS,
  QualificationRoles,
  qualificationRoleLabels,
} from "@/lib/customer-qualification";

/**
 * Phase 7 G1 (v5) — QualificationFlow component coverage.
 *
 * Iron Law 2.39: compliance-UI surfaces tested. The qualification flow is the
 * second-highest-priority compliance UI: 21+ + RUO + jurisdiction + 7-attestation
 * submission. Data validation is covered in
 * `tests/unit/customer-qualification.test.ts`; this file locks the UI layer:
 *   - all 7 verbatim Appendix A.5 attestations render
 *   - all 6 institutional roles appear in the role selector
 *   - the form does NOT invoke onSubmit until every requirement is met
 *   - validation errors surface inline with role="alert"
 *   - marketing-copy violations on the research-purpose textarea surface as
 *     field errors (Iron Law 2.4 + 2.13 coverage)
 */

const VALID_RESEARCH_PURPOSE =
  "In-vitro studies on fibroblast migration in cell-culture wound-closure assays.";

function fillValidForm() {
  fireEvent.change(screen.getByLabelText(/^email/i), {
    target: { value: "researcher@example.edu" },
  });
  fireEvent.change(screen.getByLabelText(/institution\s*\/\s*role/i), {
    target: { value: "academic-researcher" },
  });
  fireEvent.change(screen.getByLabelText(/research purpose/i), {
    target: { value: VALID_RESEARCH_PURPOSE },
  });
  // Three acknowledgment toggles + one attestations toggle
  const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
  for (const checkbox of checkboxes) {
    if (!checkbox.checked) {
      fireEvent.click(checkbox);
    }
  }
}

describe("QualificationFlow", () => {
  beforeEach(() => {
    // No global fetch use; the component is a controlled form with onSubmit
    // callback. Component-internal validation runs synchronously.
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders the 4 required fields: email, role, research purpose, and 4 checkboxes", () => {
    render(<QualificationFlow onSubmit={() => {}} />);
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/institution\s*\/\s*role/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/research purpose/i)).toBeInTheDocument();
    // 3 acknowledgments + 1 attestations affirmation = 4 checkboxes
    expect(screen.getAllByRole("checkbox")).toHaveLength(4);
  });

  it("renders every QualificationRole as an <option> with the labelled display name", () => {
    render(<QualificationFlow onSubmit={() => {}} />);
    const select = screen.getByLabelText(
      /institution\s*\/\s*role/i,
    ) as HTMLSelectElement;
    const optionValues = Array.from(select.options).map((o) => o.value);
    for (const role of QualificationRoles) {
      expect(optionValues).toContain(role);
    }
    // Labels shown match the locked Appendix A.5 role labels
    for (const role of QualificationRoles) {
      expect(
        screen.getByText(qualificationRoleLabels[role]),
      ).toBeInTheDocument();
    }
  });

  it("renders all 7 verbatim Appendix A.5 attestations inside the Attestations fieldset", () => {
    render(<QualificationFlow onSubmit={() => {}} />);
    // The fieldset legend is the only <legend> with "Attestations" — match it
    // there (the affirm-all-7 label also contains the word).
    const legend = Array.from(document.querySelectorAll("legend")).find(
      (el) => el.textContent?.trim().toLowerCase() === "attestations",
    );
    expect(legend).toBeDefined();
    const attestationsFieldset = legend!.closest(
      "fieldset",
    ) as HTMLFieldSetElement;
    const scoped = within(attestationsFieldset);
    expect(ATTESTATIONS).toHaveLength(7);
    for (const line of ATTESTATIONS) {
      expect(scoped.getByText(line)).toBeInTheDocument();
    }
    // 7 ordered list items rendered for the 7 attestations
    expect(scoped.getAllByRole("listitem")).toHaveLength(7);
  });

  it("renders the affirmation prompt and the consolidated affirm-all-7 checkbox", () => {
    render(<QualificationFlow onSubmit={() => {}} />);
    expect(
      screen.getByText(/i affirm all 7 attestations above/i),
    ).toBeInTheDocument();
  });

  it("does NOT call onSubmit when required acknowledgments are missing", () => {
    const onSubmit = vi.fn();
    render(<QualificationFlow onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: "researcher@example.edu" },
    });
    fireEvent.change(screen.getByLabelText(/research purpose/i), {
      target: { value: VALID_RESEARCH_PURPOSE },
    });
    // No checkboxes ticked
    fireEvent.submit(
      screen
        .getByRole("button", { name: /submit/i })
        .closest("form") as HTMLFormElement,
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with the parsed payload when every required field is valid", () => {
    const onSubmit = vi.fn();
    render(<QualificationFlow onSubmit={onSubmit} />);
    fillValidForm();
    fireEvent.submit(
      screen
        .getByRole("button", { name: /submit/i })
        .closest("form") as HTMLFormElement,
    );
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const payload = onSubmit.mock.calls[0][0];
    expect(payload).toEqual({
      email: "researcher@example.edu",
      role: "academic-researcher",
      researchPurpose: VALID_RESEARCH_PURPOSE,
      ageAcknowledgment: true,
      ruoAcknowledgment: true,
      jurisdictionAcknowledgment: true,
      attestationsAcknowledged: true,
    });
  });

  it("blocks submission and surfaces an inline error for invalid email", () => {
    const onSubmit = vi.fn();
    render(<QualificationFlow onSubmit={onSubmit} />);
    fillValidForm();
    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: "not-an-email" },
    });
    fireEvent.submit(
      screen
        .getByRole("button", { name: /submit/i })
        .closest("form") as HTMLFormElement,
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("surfaces a research-purpose error when the text is under 20 characters", () => {
    const onSubmit = vi.fn();
    render(<QualificationFlow onSubmit={onSubmit} />);
    fillValidForm();
    fireEvent.change(screen.getByLabelText(/research purpose/i), {
      target: { value: "too short" },
    });
    fireEvent.submit(
      screen
        .getByRole("button", { name: /submit/i })
        .closest("form") as HTMLFormElement,
    );
    expect(onSubmit).not.toHaveBeenCalled();
    const purposeError = screen.getByRole("alert");
    expect(purposeError.textContent ?? "").toMatch(/20 characters/i);
    // Textarea is marked aria-invalid when the error is present
    const textarea = screen.getByLabelText(
      /research purpose/i,
    ) as HTMLTextAreaElement;
    expect(textarea.getAttribute("aria-invalid")).toBe("true");
    expect(textarea.getAttribute("aria-describedby")).toBe(
      "qual-purpose-error",
    );
  });

  it("surfaces a marketing-copy violation as a research-purpose error (Iron Law 2.4)", () => {
    const onSubmit = vi.fn();
    render(<QualificationFlow onSubmit={onSubmit} />);
    fillValidForm();
    fireEvent.change(screen.getByLabelText(/research purpose/i), {
      target: { value: "Studying weight loss for our patients in our clinic." },
    });
    fireEvent.submit(
      screen
        .getByRole("button", { name: /submit/i })
        .closest("form") as HTMLFormElement,
    );
    expect(onSubmit).not.toHaveBeenCalled();
    const purposeError = screen.getByRole("alert");
    expect(purposeError.textContent ?? "").toMatch(
      /research-use-only framing|research-context vocabulary/i,
    );
  });

  it("blocks submission if age acknowledgment is unchecked", () => {
    const onSubmit = vi.fn();
    render(<QualificationFlow onSubmit={onSubmit} />);
    fillValidForm();
    const ageCheckbox = screen.getByLabelText(
      /i confirm that i am 21\+ years of age/i,
    );
    fireEvent.click(ageCheckbox); // un-check
    fireEvent.submit(
      screen
        .getByRole("button", { name: /submit/i })
        .closest("form") as HTMLFormElement,
    );
    expect(onSubmit).not.toHaveBeenCalled();
    // The age-acknowledgment error is rendered inline
    const ackError = screen
      .getAllByRole("alert")
      .find((el) => (el.textContent ?? "").toLowerCase().includes("21+ age"));
    expect(ackError).toBeDefined();
  });

  it("blocks submission if RUO acknowledgment is unchecked", () => {
    const onSubmit = vi.fn();
    render(<QualificationFlow onSubmit={onSubmit} />);
    fillValidForm();
    const ruoCheckbox = screen.getByLabelText(/research-use-only framing/i);
    fireEvent.click(ruoCheckbox);
    fireEvent.submit(
      screen
        .getByRole("button", { name: /submit/i })
        .closest("form") as HTMLFormElement,
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("blocks submission if jurisdiction acknowledgment is unchecked", () => {
    const onSubmit = vi.fn();
    render(<QualificationFlow onSubmit={onSubmit} />);
    fillValidForm();
    const jCheckbox = screen.getByLabelText(/jurisdiction/i);
    fireEvent.click(jCheckbox);
    fireEvent.submit(
      screen
        .getByRole("button", { name: /submit/i })
        .closest("form") as HTMLFormElement,
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("blocks submission if the 7-attestation affirmation is unchecked", () => {
    const onSubmit = vi.fn();
    render(<QualificationFlow onSubmit={onSubmit} />);
    fillValidForm();
    const attCheckbox = screen.getByLabelText(
      /i affirm all 7 attestations above/i,
    );
    fireEvent.click(attCheckbox);
    fireEvent.submit(
      screen
        .getByRole("button", { name: /submit/i })
        .closest("form") as HTMLFormElement,
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("clears errors on a subsequent successful submit", () => {
    const onSubmit = vi.fn();
    render(<QualificationFlow onSubmit={onSubmit} />);
    fillValidForm();
    fireEvent.change(screen.getByLabelText(/research purpose/i), {
      target: { value: "x" },
    });
    fireEvent.submit(
      screen
        .getByRole("button", { name: /submit/i })
        .closest("form") as HTMLFormElement,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/research purpose/i), {
      target: { value: VALID_RESEARCH_PURPOSE },
    });
    fireEvent.submit(
      screen
        .getByRole("button", { name: /submit/i })
        .closest("form") as HTMLFormElement,
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("respects defaultEmail prop and prefills the email field", () => {
    render(
      <QualificationFlow
        onSubmit={() => {}}
        defaultEmail="prefilled@example.edu"
      />,
    );
    const email = screen.getByLabelText(/^email/i) as HTMLInputElement;
    expect(email.value).toBe("prefilled@example.edu");
  });

  it("textarea has minLength=20 + maxLength=2000 + required attributes", () => {
    render(<QualificationFlow onSubmit={() => {}} />);
    const textarea = screen.getByLabelText(
      /research purpose/i,
    ) as HTMLTextAreaElement;
    expect(textarea.getAttribute("minlength")).toBe("20");
    expect(textarea.getAttribute("maxlength")).toBe("2000");
    expect(textarea.required).toBe(true);
  });

  it("submits with a non-default role selection", () => {
    const onSubmit = vi.fn();
    render(<QualificationFlow onSubmit={onSubmit} />);
    fillValidForm();
    fireEvent.change(screen.getByLabelText(/institution\s*\/\s*role/i), {
      target: { value: "biotech-researcher" },
    });
    fireEvent.submit(
      screen
        .getByRole("button", { name: /submit/i })
        .closest("form") as HTMLFormElement,
    );
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ role: "biotech-researcher" }),
    );
  });
});
