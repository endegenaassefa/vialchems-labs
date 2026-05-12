(function () {
  const state = window.VBSCState;
  const storage = window.VBSCStorage;

  function shippingFor(total) {
    return window.VBSCCart?.shippingFor(total) ?? (total >= 250 || total === 0 ? 0 : 9.99);
  }

  function totals(cart = state.getCart()) {
    const subtotal = state.getCartTotal(cart);
    const shipping = shippingFor(subtotal);
    return { subtotal, shipping, total: subtotal + shipping };
  }

  function renderSummary(container) {
    if (!container) return;
    const cart = state.getCart();
    const total = totals(cart);
    container.innerHTML = `${
      cart.length
        ? cart.map((item) => `<div class="order-line"><span>${item.name} × ${item.qty}</span><strong>${item.isFree ? "FREE" : state.money(item.price * item.qty)}</strong></div>`).join("")
        : '<p class="subtle">Cart is empty.</p>'
    }<dl class="spec-list"><dt>Subtotal</dt><dd>${state.money(total.subtotal)}</dd><dt>Shipping</dt><dd>${total.shipping === 0 ? "Free" : state.money(total.shipping)}</dd><dt>Total</dt><dd>${state.money(total.total)}</dd></dl>`;
  }

  function gateCheckout() {
    if (!document.getElementById("checkout-form")) return false;
    const user = state.getUser();
    const mta = storage.getJSON(state.keys.mta, null);
    const error = document.querySelector("[data-checkout-error]");
    if (!user) {
      window.location.href = state.url("/login.html?next=/checkout.html");
      return false;
    }
    if (state.isBlacklisted(user.email)) {
      if (error) error.textContent = "This demo account is on the Refusal-to-Sell list and cannot place orders.";
      document.getElementById("place-order").disabled = true;
      return false;
    }
    if (!mta) {
      window.location.href = state.url("/mta.html?next=/checkout.html");
      return false;
    }
    return true;
  }

  function randomOrderId() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let index = 0; index < 6; index += 1) {
      code += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return `VBSC-${code}`;
  }

  function setupCheckout() {
    const form = document.getElementById("checkout-form");
    if (!form) return;
    renderSummary(document.getElementById("checkout-summary"));
    if (!gateCheckout()) return;

    const terms = document.getElementById("final-terms");
    const placeOrder = document.getElementById("place-order");
    terms?.addEventListener("change", () => {
      placeOrder.disabled = !terms.checked;
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const user = state.getUser();
      const cart = state.getCart();
      if (!cart.length) {
        document.querySelector("[data-checkout-error]").textContent = "Add at least one item before placing an order.";
        return;
      }
      if (!terms.checked || !user) return;

      const formData = new FormData(form);
      const total = totals(cart);
      const id = randomOrderId();
      const order = {
        id,
        createdAt: new Date().toISOString(),
        items: cart,
        subtotal: total.subtotal,
        shipping: total.shipping,
        total: total.total,
        shippingAddress: {
          name: String(formData.get("shipName") || ""),
          address: String(formData.get("shipAddress") || ""),
          city: String(formData.get("shipCity") || ""),
          state: String(formData.get("shipState") || ""),
          zip: String(formData.get("shipZip") || ""),
          phone: String(formData.get("phone") || "")
        },
        paymentMethod: String(formData.get("paymentMethod") || "card"),
        status: "Confirmed - Awaiting Shipment"
      };
      const orders = state.getOrders();
      orders.unshift(order);
      state.setOrders(orders);
      state.agreements.forEach((agreement) => {
        window.VBSC.logConsent(`Checkout agreement accepted: ${agreement.title}`, agreement.clauseRef, "/checkout.html", {
          orderId: id,
          userEmail: user.email
        });
      });
      console.log("[EMAIL]", "Order confirmation email", { to: user.email, order: id });
      console.log("[SMS]", `VBSC: Order ${id} shipped via UPS. Tracking 1ZDEMO. Reply STOP to unsubscribe.`);
      storage.setJSON(state.keys.cart, []);
      window.dispatchEvent(new CustomEvent("vbsc:cart"));
      window.location.href = state.url(`/order-confirmation.html?order=${id}`);
    });
  }

  function setupConfirmation() {
    const container = document.getElementById("confirmation-content");
    if (!container) return;
    const orderId = new URL(window.location.href).searchParams.get("order");
    const order = state.getOrders().find((item) => item.id === orderId);
    if (!order) {
      container.innerHTML = "<p>Order record not found in local demo state.</p>";
      return;
    }
    container.innerHTML = `<article class="info-card"><h2>Order ID: ${order.id}</h2><p>Status: ${order.status}</p><div>${order.items
      .map((item) => `<div class="order-line"><span>${item.name} × ${item.qty}</span><strong>${item.isFree ? "FREE" : state.money(item.price * item.qty)}</strong></div>`)
      .join("")}</div><dl class="spec-list"><dt>Total</dt><dd>${state.money(order.total)}</dd><dt>Ship to</dt><dd>${order.shippingAddress.name}<br>${order.shippingAddress.address}<br>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}</dd></dl></article><article class="info-card"><h2>What happens next</h2><p>Your order will be reviewed by our compliance team within 1 business day. You will receive an email confirming MTA verification and a tracking number once your shipment is dispatched. Discreet packaging - the outer label will not reference Vector Bio Supply Co.</p></article>`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupCheckout();
    setupConfirmation();
  });
  window.addEventListener("vbsc:cart", () => renderSummary(document.getElementById("checkout-summary")));
})();
