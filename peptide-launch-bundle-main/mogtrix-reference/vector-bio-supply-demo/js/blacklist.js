(function () {
  const state = window.VBSCState;
  const keywords = [
    "dosage",
    "how much",
    "how to inject",
    "for myself",
    "weight loss",
    "lose weight",
    "diabetes",
    "blood sugar",
    "appetite",
    "for me to take",
    "personal use",
    "self-administer"
  ];

  function hit(text) {
    const normalized = String(text || "").toLowerCase();
    return keywords.some((keyword) => normalized.includes(keyword));
  }

  function setupContactForm() {
    const form = document.getElementById("contact-form");
    const modal = document.getElementById("refusal-modal");
    if (!form || !modal) return;
    let pendingEmail = "";

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const subject = String(data.get("subject") || "");
      const message = String(data.get("message") || "");
      pendingEmail = String(data.get("email") || "").trim().toLowerCase();
      if (hit(`${subject} ${message}`)) {
        modal.removeAttribute("hidden");
        window.VBSC.logConsent("Refusal modal triggered", "tos-blacklist", "/contact.html", { userEmail: pendingEmail });
        return;
      }
      window.VBSC.logConsent("Contact form submitted", "contact", "/contact.html", { userEmail: pendingEmail });
      form.reset();
    });

    modal.querySelector("[data-refusal-close]")?.addEventListener("click", () => {
      state.addBlacklist(pendingEmail);
      console.log("[EMAIL]", "Blacklist notice email", { to: pendingEmail });
      window.location.href = state.url("/faq.html#dosing-question");
    });
  }

  window.VBSCBlacklist = { hit, keywords };
  document.addEventListener("DOMContentLoaded", setupContactForm);
})();
