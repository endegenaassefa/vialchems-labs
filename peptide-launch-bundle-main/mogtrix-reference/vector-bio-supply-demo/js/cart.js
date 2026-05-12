(function () {
  const state = window.VBSCState;

  function shippingFor(total) {
    return total >= 250 || total === 0 ? 0 : 9.99;
  }

  function progressText(current, threshold, label) {
    if (current >= threshold) return `${label} unlocked`;
    return `${state.money(threshold - current)} to ${label}`;
  }

  function lineTotal(item) {
    return item.isFree ? "FREE" : state.money(item.price * item.qty);
  }

  function renderCartLines(container, cart) {
    if (!container) return;
    if (!cart.length) {
      container.innerHTML = '<p class="subtle">Your cart is empty.</p>';
      return;
    }
    container.innerHTML = cart
      .map(
        (item) => `<div class="cart-line" data-cart-line="${item.slug}">
          <div><strong>${item.name}</strong><br><span class="subtle">${item.isFree ? "Threshold gift" : `${state.money(item.price)} each`}</span></div>
          <div class="cart-line-controls">
            ${item.isFree ? "" : `<button data-qty-dec="${item.slug}" type="button">−</button><span>${item.qty}</span><button data-qty-inc="${item.slug}" type="button">+</button>`}
            <strong>${lineTotal(item)}</strong>
            <button data-remove-cart="${item.slug}" data-remove-free="${item.isFree}" type="button">Remove</button>
          </div>
        </div>`
      )
      .join("");
  }

  function renderTotals(cart) {
    const subtotal = state.getCartTotal(cart);
    const shipping = shippingFor(subtotal);
    document.querySelectorAll("[data-cart-subtotal]").forEach((node) => (node.textContent = state.money(subtotal)));
    document.querySelectorAll("[data-cart-shipping]").forEach((node) => (node.textContent = shipping === 0 ? "Free" : state.money(shipping)));
    document.querySelectorAll("[data-cart-total]").forEach((node) => (node.textContent = state.money(subtotal + shipping)));
    document.querySelectorAll("[data-free-shipping-text]").forEach((node) => (node.textContent = progressText(subtotal, 250, "free shipping")));
    document.querySelectorAll("[data-free-gift-text]").forEach((node) => (node.textContent = progressText(subtotal, 300, "free Bac Water")));
    document.querySelectorAll("[data-free-shipping-bar]").forEach((node) => (node.style.width = `${Math.min(100, (subtotal / 250) * 100)}%`));
    document.querySelectorAll("[data-free-gift-bar]").forEach((node) => (node.style.width = `${Math.min(100, (subtotal / 300) * 100)}%`));
  }

  function render() {
    const cart = state.getCart();
    document.querySelectorAll("[data-cart-count]").forEach((node) => (node.textContent = String(state.getCartCount())));
    renderCartLines(document.querySelector("[data-cart-drawer-items]"), cart);
    renderCartLines(document.getElementById("cart-page-items"), cart);
    renderTotals(cart);
    const accountLink = document.querySelector("[data-account-link]");
    if (accountLink && state.getUser()) {
      accountLink.textContent = "Account";
      accountLink.href = state.url("/account.html");
    }
  }

  function wireCartActions() {
    document.addEventListener("click", (event) => {
      const add = event.target.closest("[data-add-to-cart]");
      if (add) {
        const slug = add.dataset.addToCart;
        const qtyInput = document.querySelector(`[data-product-qty="${slug}"]`);
        state.addToCart(slug, qtyInput ? Number(qtyInput.value) : 1);
        document.getElementById("cart-drawer")?.classList.add("open");
      }

      const remove = event.target.closest("[data-remove-cart]");
      if (remove) state.removeFromCart(remove.dataset.removeCart, remove.dataset.removeFree === "true");

      const inc = event.target.closest("[data-qty-inc]");
      if (inc) {
        const item = state.getCart().find((entry) => entry.slug === inc.dataset.qtyInc && !entry.isFree);
        if (item) state.updateQty(item.slug, item.qty + 1);
      }

      const dec = event.target.closest("[data-qty-dec]");
      if (dec) {
        const item = state.getCart().find((entry) => entry.slug === dec.dataset.qtyDec && !entry.isFree);
        if (item) state.updateQty(item.slug, Math.max(1, item.qty - 1));
      }

      if (event.target.closest("[data-cart-toggle]")) {
        document.getElementById("cart-drawer")?.classList.add("open");
      }
      if (event.target.closest("[data-cart-close]")) {
        document.getElementById("cart-drawer")?.classList.remove("open");
      }
    });
  }

  window.VBSCCart = {
    render,
    shippingFor
  };

  document.addEventListener("DOMContentLoaded", () => {
    wireCartActions();
    render();
  });
  window.addEventListener("vbsc:cart", render);
})();
