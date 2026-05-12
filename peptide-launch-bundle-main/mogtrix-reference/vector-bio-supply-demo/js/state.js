(function () {
  const storage = window.VBSCStorage;
  const data = window.VBSC_DATA || { products: [], agreements: [] };

  const keys = {
    cart: "vbsc_cart",
    user: "vbsc_user",
    consentLog: "vbsc_consent_log",
    orders: "vbsc_orders",
    blacklist: "vbsc_blacklist",
    age: "vbsc_age_confirmed",
    cookie: "vbsc_cookie_consent",
    mta: "vbsc_mta_signed",
    newsletter: "vbsc_newsletter",
    browsewrap: "vbsc_browsewrap_seen"
  };

  function productBySlug(slug) {
    return data.products.find((product) => product.slug === slug) || null;
  }

  function normalizeCart(cart) {
    if (!Array.isArray(cart)) return [];
    return cart
      .filter((item) => item && item.slug && Number(item.qty) > 0)
      .map((item) => {
        const product = productBySlug(item.slug);
        return {
          slug: item.slug,
          name: item.name || product?.name || item.slug,
          price: item.isFree ? 0 : Number(item.price ?? product?.price ?? 0),
          qty: Math.max(1, Number(item.qty) || 1),
          isFree: Boolean(item.isFree)
        };
      });
  }

  function getCartRaw() {
    return normalizeCart(storage.getJSON(keys.cart, []));
  }

  function subtotal(cart = getCartRaw()) {
    return cart.reduce((sum, item) => sum + (item.isFree ? 0 : item.price * item.qty), 0);
  }

  function withFreeGift(cart) {
    const withoutGift = normalizeCart(cart).filter((item) => !(item.slug === "bacteriostatic-water-30ml" && item.isFree));
    if (subtotal(withoutGift) >= 300) {
      withoutGift.push({
        slug: "bacteriostatic-water-30ml",
        name: "Bacteriostatic Water 30mL",
        price: 0,
        qty: 1,
        isFree: true
      });
    }
    return withoutGift;
  }

  function setCart(cart) {
    storage.setJSON(keys.cart, withFreeGift(cart));
    window.dispatchEvent(new CustomEvent("vbsc:cart"));
  }

  function addToCart(slug, qty = 1) {
    const product = productBySlug(slug);
    if (!product) return;
    const cart = getCartRaw();
    const existing = cart.find((item) => item.slug === slug && !item.isFree);
    if (existing) {
      existing.qty += Math.max(1, Number(qty) || 1);
    } else {
      cart.push({
        slug: product.slug,
        name: product.name,
        price: product.price,
        qty: Math.max(1, Number(qty) || 1),
        isFree: false
      });
    }
    setCart(cart);
  }

  function updateQty(slug, qty) {
    const cart = getCartRaw();
    const item = cart.find((entry) => entry.slug === slug && !entry.isFree);
    if (!item) return;
    item.qty = Math.max(1, Number(qty) || 1);
    setCart(cart);
  }

  function removeFromCart(slug, includeFree = false) {
    setCart(getCartRaw().filter((item) => item.slug !== slug || (!includeFree && item.isFree)));
  }

  function getCartCount() {
    return getCartRaw().reduce((sum, item) => sum + (item.isFree ? 0 : item.qty), 0);
  }

  function getUser() {
    return storage.getJSON(keys.user, null);
  }

  function setUser(user) {
    storage.setJSON(keys.user, user);
  }

  function getOrders() {
    const orders = storage.getJSON(keys.orders, []);
    return Array.isArray(orders) ? orders : [];
  }

  function setOrders(orders) {
    storage.setJSON(keys.orders, Array.isArray(orders) ? orders : []);
  }

  function getConsentLog() {
    const log = storage.getJSON(keys.consentLog, []);
    return Array.isArray(log) ? log : [];
  }

  function setConsentLog(log) {
    storage.setJSON(keys.consentLog, Array.isArray(log) ? log : []);
  }

  function getBlacklist() {
    const list = storage.getJSON(keys.blacklist, []);
    return Array.isArray(list) ? list.map((item) => String(item).toLowerCase()) : [];
  }

  function addBlacklist(email) {
    const normalized = String(email || "").trim().toLowerCase();
    if (!normalized) return;
    const list = new Set(getBlacklist());
    list.add(normalized);
    storage.setJSON(keys.blacklist, [...list]);
  }

  function isBlacklisted(email) {
    return getBlacklist().includes(String(email || "").trim().toLowerCase());
  }

  function money(value) {
    return `$${Number(value || 0).toFixed(2)}`;
  }

  function basePath() {
    return document.documentElement.dataset.base || ".";
  }

  function url(target) {
    if (/^(https?:|mailto:|tel:|#)/.test(target)) return target;
    const base = basePath();
    const clean = String(target).replace(/^\//, "");
    return base === "." ? clean : `${base}/${clean}`;
  }

  window.VBSCState = {
    keys,
    products: data.products,
    agreements: data.agreements,
    productBySlug,
    getCart: getCartRaw,
    setCart,
    addToCart,
    updateQty,
    removeFromCart,
    getCartTotal: subtotal,
    getCartCount,
    getUser,
    setUser,
    getOrders,
    setOrders,
    getConsentLog,
    setConsentLog,
    getBlacklist,
    addBlacklist,
    isBlacklisted,
    money,
    url
  };
})();
