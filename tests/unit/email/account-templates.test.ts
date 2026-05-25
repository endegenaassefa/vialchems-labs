/**
 * Tests for the customer-accounts spec §10 email templates:
 *   - account-email-confirm
 *   - account-password-reset
 *   - account-deleted
 *
 * The templates run in stub mode (sendEmail returns synthetic ID
 * when REQUIRE_RESEND=false), so we exercise the rendered HTML +
 * text + tag selection without hitting Resend.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

const sendEmailMock = vi.fn();
vi.mock("@/lib/email/resend", () => ({
  sendEmail: (...a: unknown[]) => sendEmailMock(...a),
}));

beforeEach(() => {
  sendEmailMock.mockReset();
  sendEmailMock.mockResolvedValue({ ok: true, id: "stub:ok" });
});

import { sendAccountConfirmEmail } from "@/lib/email/account-email-confirm";
import { sendPasswordResetEmail } from "@/lib/email/account-password-reset";
import { sendAccountDeletedEmail } from "@/lib/email/account-deleted";

describe("sendAccountConfirmEmail", () => {
  it("uses tag=account-email-confirm + includes the confirm URL in text + html", async () => {
    sendEmailMock.mockResolvedValueOnce({ ok: true, id: "stub:ok" });
    await sendAccountConfirmEmail({
      email: "marie@radium.lab",
      fullName: "Dr. Marie Curie",
      confirmUrl: "https://test.local/auth/confirm-email?token=abcdef.ghijkl",
    });
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const call = sendEmailMock.mock.calls[0][0];
    expect(call.tag).toBe("account-email-confirm");
    expect(call.to).toBe("marie@radium.lab");
    expect(call.text).toContain("https://test.local/auth/confirm-email?token=abcdef.ghijkl");
    expect(call.text).toContain("Dr. Marie Curie");
    expect(call.html).toContain("Confirm email");
    expect(call.html).toContain("Dr. Marie Curie");
  });

  it("escapes HTML in fullName to prevent injection", async () => {
    sendEmailMock.mockResolvedValueOnce({ ok: true, id: "stub:ok" });
    await sendAccountConfirmEmail({
      email: "x@example.com",
      fullName: "<script>alert(1)</script>",
      confirmUrl: "https://test.local/auth/confirm-email?token=x",
    });
    const call = sendEmailMock.mock.calls[0][0];
    expect(call.html).not.toContain("<script>");
    expect(call.html).toContain("&lt;script&gt;");
  });
});

describe("sendPasswordResetEmail", () => {
  it("uses tag=account-password-reset + 1-hour copy", async () => {
    sendEmailMock.mockResolvedValueOnce({ ok: true, id: "stub:ok" });
    await sendPasswordResetEmail({
      email: "marie@radium.lab",
      fullName: "Marie",
      resetUrl: "https://test.local/reset-password?token=xyz",
    });
    const call = sendEmailMock.mock.calls[0][0];
    expect(call.tag).toBe("account-password-reset");
    expect(call.text).toContain("1 hour");
    expect(call.text).toContain("https://test.local/reset-password?token=xyz");
  });

  it("renders without fullName (defaults to generic greeting)", async () => {
    sendEmailMock.mockResolvedValueOnce({ ok: true, id: "stub:ok" });
    await sendPasswordResetEmail({
      email: "marie@radium.lab",
      resetUrl: "https://test.local/reset-password?token=xyz",
    });
    const call = sendEmailMock.mock.calls[0][0];
    expect(call.text).toContain("Hi,");
  });
});

describe("sendAccountDeletedEmail", () => {
  it("uses tag=account-deleted + reassurance copy", async () => {
    sendEmailMock.mockResolvedValueOnce({ ok: true, id: "stub:ok" });
    await sendAccountDeletedEmail({
      email: "marie@radium.lab",
      fullName: "Marie",
    });
    const call = sendEmailMock.mock.calls[0][0];
    expect(call.tag).toBe("account-deleted");
    expect(call.text).toContain("Past orders remain on file");
    expect(call.text).toContain("If this wasn't you");
  });
});
