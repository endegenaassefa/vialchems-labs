(function () {
  const state = window.VBSCState;
  const storage = window.VBSCStorage;

  function setupSignaturePad(canvas, onChange) {
    if (!canvas) {
      return { hasStrokes: () => false, dataUrl: () => "", clear: () => {} };
    }
    const ctx = canvas.getContext("2d");
    let drawing = false;
    let stroked = false;

    function point(event) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) / rect.width) * canvas.width,
        y: ((event.clientY - rect.top) / rect.height) * canvas.height
      };
    }

    function markStroke() {
      stroked = true;
      onChange?.(true);
    }

    function start(event) {
      event.preventDefault();
      drawing = true;
      const p = point(event);
      ctx.fillStyle = "#0F2A47";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      markStroke();
    }

    function move(event) {
      if (!drawing) return;
      event.preventDefault();
      const p = point(event);
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#0F2A47";
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      markStroke();
    }

    function end() {
      drawing = false;
    }

    canvas.addEventListener("pointerdown", start);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointerleave", end);

    return {
      hasStrokes: () => stroked,
      dataUrl: () => (stroked ? canvas.toDataURL("image/png") : ""),
      clear: () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stroked = false;
        onChange?.(false);
      }
    };
  }

  function setupRegister() {
    const form = document.getElementById("register-form");
    if (!form) return;

    const error = form.querySelector("[data-register-error]");
    const stages = [...form.querySelectorAll("[data-stage]")];
    const submit = document.getElementById("create-account");
    const signature = setupSignaturePad(document.getElementById("sig-pad"), update);

    document.getElementById("clear-signature")?.addEventListener("click", () => signature.clear());
    form.addEventListener("input", update);
    form.addEventListener("change", update);

    function value(name) {
      return String(new FormData(form).get(name) || "").trim();
    }

    function stage1Ready() {
      return (
        value("firstName") &&
        value("lastName") &&
        /\S+@\S+\.\S+/.test(value("email")) &&
        value("password").length >= 8 &&
        value("password") === value("confirmPassword")
      );
    }

    function update() {
      const industry = value("industry");
      const credential = value("credential");
      const stage2 = stage1Ready();
      const stage3 = stage2 && industry;
      const stage4 = stage3 && credential;
      const stage5 = stage4 && form.elements.attestation.checked;
      stages[1].hidden = !stage2;
      stages[2].hidden = !stage3;
      stages[3].hidden = !stage4;
      stages[4].hidden = !stage5;
      const attestation = document.getElementById("attestation-text");
      if (attestation) {
        attestation.textContent = `I, ${value("firstName")} ${value("lastName")}, affirm that I hold the position of ${credential || "[credential]"} in the ${industry || "[industry]"} sector. I am 21 years of age or older, trained in handling Research Use Only (RUO) materials, and work in a qualified research environment equipped with appropriate personal protective equipment (PPE). I have read and agree to the Terms of Service, Privacy Policy, Material Transfer Agreement, and Refund Policy.`;
      }
      submit.disabled = !(stage5 && signature.hasStrokes());
      if (error) error.textContent = "";
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = value("email").toLowerCase();
      if (!stage1Ready() || !value("industry") || !value("credential") || !form.elements.attestation.checked || !signature.hasStrokes()) {
        error.textContent = "Complete all stages and draw your signature.";
        return;
      }
      if (state.isBlacklisted(email)) {
        error.textContent = "We are unable to process your registration at this time. Please contact compliance@vectorbiosupply.co.";
        return;
      }
      const user = {
        firstName: value("firstName"),
        lastName: value("lastName"),
        email,
        hashedPassword: window.btoa(`${value("password")}salt`),
        industry: value("industry"),
        credential: value("credential"),
        signatureDataUrl: signature.dataUrl(),
        registeredAt: new Date().toISOString()
      };
      state.setUser(user);
      window.VBSC.logConsent("Registration completed", "tos-customer-representations", "/register.html", { userEmail: email });
      window.VBSC.logConsent("Bundled attestation accepted", "tos-bundled-attestation", "/register.html", { userEmail: email });
      window.VBSC.logConsent("Signature captured", "tos-signature", "/register.html", { userEmail: email });
      console.log("[EMAIL]", "Welcome email", { to: email, firstName: user.firstName });
      window.location.href = state.url("/account.html?welcome=1");
    });
  }

  function setupLogin() {
    const form = document.getElementById("login-form");
    if (!form) return;
    const error = form.querySelector("[data-login-error]");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const email = String(data.get("email") || "").trim().toLowerCase();
      const password = String(data.get("password") || "");
      const user = state.getUser();
      if (user?.email === email && user?.hashedPassword === window.btoa(`${password}salt`)) {
        const next = new URL(window.location.href).searchParams.get("next") || "/account.html";
        window.location.href = state.url(next);
      } else {
        error.textContent = "Email or password not recognized. If you have not registered, please complete the Researcher Registration.";
      }
    });

    document.querySelector("[data-forgot-password]")?.addEventListener("click", () => {
      error.textContent = "Email password-reset@vectorbiosupply.co";
    });
  }

  function setupMta() {
    const form = document.getElementById("mta-form");
    if (!form) return;
    const error = form.querySelector("[data-mta-error]");
    const submit = document.getElementById("sign-mta");
    const signature = setupSignaturePad(document.getElementById("mta-sig-pad"), update);

    function typedName() {
      return String(new FormData(form).get("typedName") || "").trim();
    }

    function update() {
      submit.disabled = !(typedName().length > 1 && signature.hasStrokes());
      if (error) error.textContent = "";
    }

    form.addEventListener("input", update);
    document.getElementById("clear-mta-signature")?.addEventListener("click", () => signature.clear());
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!typedName() || !signature.hasStrokes()) {
        error.textContent = "Typed legal name and signature are required.";
        return;
      }
      const signed = {
        name: typedName(),
        signatureDataUrl: signature.dataUrl(),
        signedAt: new Date().toISOString()
      };
      storage.setJSON(state.keys.mta, signed);
      window.VBSC.logConsent("Material Transfer Agreement signed", "mta", "/mta.html");
      const next = new URL(window.location.href).searchParams.get("next") || "/account.html#mta-status";
      window.location.href = state.url(next);
    });
  }

  function clauseHref(ref) {
    if (ref === "mta") return state.url("/mta.html");
    if (ref.startsWith("shipping")) return state.url("/shipping-and-returns.html");
    if (ref.startsWith("privacy")) return state.url("/privacy.html");
    if (ref.startsWith("marketing")) return state.url("/privacy.html");
    return state.url("/terms.html");
  }

  function renderAccount() {
    if (!document.getElementById("consent-record")) return;
    const user = state.getUser();
    const orders = state.getOrders();
    const mta = storage.getJSON(state.keys.mta, null);
    const log = state.getConsentLog();

    document.getElementById("orders").innerHTML = `<h2>Orders</h2>${
      orders.length
        ? orders.map((order) => `<article class="order-line"><span><strong>${order.id}</strong><br>${order.createdAt}</span><span>${state.money(order.total)} · Confirmed - Awaiting Shipment</span></article>`).join("")
        : '<p class="subtle">No orders yet.</p>'
    }`;

    document.getElementById("profile").innerHTML = `<h2>Profile</h2>${
      user
        ? `<dl class="spec-list"><dt>Name</dt><dd>${user.firstName} ${user.lastName}</dd><dt>Email</dt><dd>${user.email}</dd><dt>Industry</dt><dd>${user.industry}</dd><dt>Credential</dt><dd>${user.credential}</dd></dl><a class="button button-secondary" href="mailto:privacy@vectorbiosupply.co?subject=Profile%20deletion%20request">Request Profile Deletion</a>`
        : `<p>No local demo user found.</p><a class="button button-primary" href="${state.url("/register.html")}">Register</a>`
    }`;

    document.getElementById("mta-status").innerHTML = `<h2>MTA Status</h2>${
      mta
        ? `<p>Signed by ${mta.name} on ${mta.signedAt}.</p><a class="button button-secondary" href="${state.url("/mta.html")}">Re-sign</a>`
        : `<p>You have not yet signed the Material Transfer Agreement. You must sign before placing orders.</p><a class="button button-primary" href="${state.url("/mta.html")}">Sign MTA</a>`
    }`;

    document.getElementById("consent-record").innerHTML = `<h2>Your Consent Record</h2><button class="button button-secondary" onclick="window.print()" type="button">Export as PDF</button>${
      log.length
        ? `<div class="legal-document">${log
            .map((entry) => `<article class="legal-block"><strong>${entry.event}</strong><br><span class="subtle">${entry.timestamp}</span><br>Clause: <a href="${clauseHref(entry.clauseRef)}">${entry.clauseRef}</a><br>Source page: ${entry.page}${entry.orderId ? `<br>Order: ${entry.orderId}` : ""}</article>`)
            .join("")}</div>`
        : '<p class="subtle">No consent events recorded yet.</p>'
    }`;

    document.getElementById("affiliate").innerHTML = `<h2>Affiliate</h2><p>Referral link: vectorbiosupply.co?ref=${user ? user.email.split("@")[0].toUpperCase() : "USER_ID"}</p><p>Commission balance: $0.00</p><a href="${state.url("/affiliate.html")}">Affiliate terms</a>`;
  }

  function setupAffiliate() {
    document.querySelector("[data-affiliate-enroll]")?.addEventListener("click", () => {
      const user = state.getUser();
      if (!user) {
        window.location.href = state.url("/login.html");
        return;
      }
      user.affiliate_enrolled = true;
      state.setUser(user);
      window.VBSC.logConsent("Affiliate enrollment", "affiliate-terms", "/affiliate.html");
      alert("Affiliate enrollment recorded in local demo state.");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupRegister();
    setupLogin();
    setupMta();
    renderAccount();
    setupAffiliate();
  });
})();
