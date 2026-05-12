(function () {
  const state = window.VBSCState;
  const storage = window.VBSCStorage;

  function pagePath() {
    return document.documentElement.dataset.page || window.location.pathname;
  }

  function logConsent(eventName, clauseRef, page, extra = {}) {
    const user = state.getUser();
    const entry = {
      event: eventName,
      timestamp: new Date().toISOString(),
      clauseRef,
      page: page || pagePath(),
      userEmail: user?.email || extra.userEmail || "",
      ...extra
    };
    const log = state.getConsentLog();
    log.push(entry);
    state.setConsentLog(log);
    window.dispatchEvent(new CustomEvent("vbsc:consent", { detail: entry }));
    return entry;
  }

  function clearGate() {
    document.body.classList.remove("gate-pending");
    document.getElementById("cookie-banner")?.setAttribute("hidden", "");
    document.getElementById("age-gate")?.setAttribute("hidden", "");
  }

  function showCookie() {
    document.getElementById("cookie-banner")?.removeAttribute("hidden");
  }

  function showAge() {
    document.getElementById("cookie-banner")?.setAttribute("hidden", "");
    document.getElementById("age-gate")?.removeAttribute("hidden");
  }

  function showSoftBlock() {
    document.getElementById("age-gate")?.setAttribute("hidden", "");
    document.getElementById("soft-block")?.removeAttribute("hidden");
  }

  function setupNewsletter() {
    document.querySelector("[data-newsletter-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const email = String(new FormData(form).get("email") || "");
      storage.setItem(state.keys.newsletter, email);
      logConsent("Newsletter signup", "marketing-newsletter", pagePath(), { userEmail: email });
      form.reset();
    });
  }

  function initGate() {
    if (!storage.isPersistent()) {
      document.getElementById("storage-warning")?.removeAttribute("hidden");
    }

    const hasCookie = Boolean(storage.getItem(state.keys.cookie));
    const hasAge = Boolean(storage.getItem(state.keys.age));

    if (!hasCookie) {
      showCookie();
    } else if (!hasAge) {
      showAge();
    } else {
      clearGate();
      logConsent("Browsewrap page load", "browsewrap", pagePath());
    }

    document.querySelectorAll("[data-cookie-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        storage.setItem(state.keys.cookie, button.dataset.cookieChoice || "essential");
        logConsent("Cookie consent", "cookies", pagePath());
        showAge();
      });
    });

    document.getElementById("age-confirm")?.addEventListener("click", () => {
      const age = document.getElementById("age-confirm-age");
      const researcher = document.getElementById("age-confirm-researcher");
      if (!age?.checked || !researcher?.checked) {
        showSoftBlock();
        return;
      }
      storage.setItem(state.keys.age, new Date().toISOString());
      logConsent("Age and researcher confirmation", "age-gate", pagePath());
      clearGate();
      logConsent("Browsewrap page load", "browsewrap", pagePath());
    });

    document.getElementById("age-deny")?.addEventListener("click", showSoftBlock);
  }

  window.VBSC = {
    ...(window.VBSC || {}),
    logConsent,
    pagePath
  };

  document.addEventListener("DOMContentLoaded", () => {
    initGate();
    setupNewsletter();
  });
})();
