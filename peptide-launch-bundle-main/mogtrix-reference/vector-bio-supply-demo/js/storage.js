(function () {
  const memory = new Map();
  let available = true;

  try {
    const probe = "__vbsc_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
  } catch {
    available = false;
    document.documentElement.classList.add("storage-fallback");
  }

  function getItem(key) {
    if (!available) return memory.has(key) ? memory.get(key) : null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      available = false;
      return memory.has(key) ? memory.get(key) : null;
    }
  }

  function setItem(key, value) {
    if (!available) {
      memory.set(key, String(value));
      return;
    }
    try {
      window.localStorage.setItem(key, String(value));
    } catch {
      available = false;
      memory.set(key, String(value));
    }
  }

  function removeItem(key) {
    memory.delete(key);
    if (!available) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      available = false;
    }
  }

  function getJSON(key, fallback) {
    const raw = getItem(key);
    if (raw === null || raw === "") return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      setJSON(key, fallback);
      return fallback;
    }
  }

  function setJSON(key, value) {
    setItem(key, JSON.stringify(value));
  }

  window.VBSCStorage = {
    isPersistent: () => available,
    getItem,
    setItem,
    removeItem,
    getJSON,
    setJSON
  };
})();
