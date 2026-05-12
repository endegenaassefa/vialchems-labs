;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="a24c8475-bbfa-605b-5791-1cdb48e1f1b4")}catch(e){}}();
module.exports = [
"[project]/lib/content/site.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "siteConfig",
    ()=>siteConfig
]);
/**
 * Site-wide brand and configuration constants.
 *
 * v5 rebrand (2026-05-10): operator spec → vialchemlabs (clinical-minimal
 * light theme, cyan-navy accent, storefront typography, "Research-grade peptides,
 * shipped with the COA." tagline).
 */ const brandDomain = process.env.BRAND_DOMAIN ?? 'vialchemlabs.com';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? `https://${brandDomain}`;
const siteConfig = {
    name: 'vialchemlabs',
    brandStem: 'vialchemlabs',
    domain: brandDomain,
    url: siteUrl,
    description: 'vialchemlabs ships research-grade peptides with the Certificate of Analysis for every vial. For verified laboratories and qualified research organizations only.',
    tagline: 'Research-grade peptides, shipped with the COA.',
    posture: 'A',
    // Public legal identity appears in client-rendered pages, so these must use
    // public env keys to keep SSR and hydration output identical.
    llcName: process.env.NEXT_PUBLIC_LLC_NAME ?? 'vialchemlabs LLC',
    llcJurisdiction: process.env.NEXT_PUBLIC_LLC_JURISDICTION ?? 'Wyoming',
    email: {
        from: process.env.ORDER_EMAIL_FROM ?? `research@${brandDomain}`,
        staff: (process.env.ORDER_STAFF_EMAILS ?? `ops@${brandDomain}`).split(',')
    },
    /* v1.3 — operator override per Iron Law 2.26: previously defaulted to a
   * specific named partner ("Janoshik Analytical"). Operator chose to remove
   * any specific lab affiliation from public UI and present testing as
   * "independent" / "third-party verified" without naming the lab. The
   * generic default below is what renders in copy. The actual contractual
   * partner is operator-side / private. To re-enable a named partner in the
   * future, set LAB_PARTNER_NAME + LAB_PARTNER_PORTAL_URL env vars. */ labPartner: {
        name: process.env.LAB_PARTNER_NAME ?? 'an independent third-party laboratory',
        /** Short form for inline references where the long phrase is awkward. */ shortName: process.env.LAB_PARTNER_SHORT_NAME ?? 'Independent Lab',
        portalUrl: process.env.LAB_PARTNER_PORTAL_URL ?? null
    },
    shipping: {
        pilotUSCents: Number(process.env.PILOT_US_SHIPPING_CENTS ?? 1500),
        freeShippingThresholdCents: Number(process.env.FREE_SHIPPING_THRESHOLD_CENTS ?? 20000)
    }
};
}),
"[project]/lib/cart-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCartHydrated",
    ()=>useCartHydrated,
    "useCartStore",
    ()=>useCartStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
/**
 * Cart store — Zustand client-side store with localStorage persistence.
 *
 * ISSUE-002 fix: cart was wiped on full reload because the store was
 * memory-only. Adding zustand/middleware persist with localStorage so a buyer
 * who closes the tab and comes back finds their cart intact.
 *
 * Hydration safety: persist runs only on the client. Server renders with the
 * empty initial state; client hydrates from localStorage post-mount. The
 * `useCartHydrated()` hook flips to true after rehydrate so consumer
 * components (like CartCount) can avoid SSR/client text mismatch by rendering
 * 0 until hydrated.
 *
 * Phase 9 will swap the localStorage source for Supabase rows once Auth is
 * online; the public API stays the same.
 */ 'use client';
;
;
const useCartStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        lines: [],
        _hasHydrated: false,
        addLine: (line)=>{
            set((state)=>{
                const existing = state.lines.find((l)=>l.sku === line.sku);
                if (existing) {
                    return {
                        lines: state.lines.map((l)=>l.sku === line.sku ? {
                                ...l,
                                qty: Math.min(10, l.qty + (line.qty ?? 1))
                            } : l)
                    };
                }
                return {
                    lines: [
                        ...state.lines,
                        {
                            ...line,
                            qty: Math.min(10, Math.max(1, line.qty ?? 1))
                        }
                    ]
                };
            });
        },
        removeLine: (sku)=>set((state)=>({
                    lines: state.lines.filter((l)=>l.sku !== sku)
                })),
        setQty: (sku, qty)=>set((state)=>({
                    lines: state.lines.map((l)=>l.sku === sku ? {
                            ...l,
                            qty: Math.min(10, Math.max(1, qty))
                        } : l)
                })),
        clear: ()=>set({
                lines: []
            }),
        count: ()=>get().lines.reduce((sum, l)=>sum + l.qty, 0),
        subtotalCents: ()=>get().lines.reduce((sum, l)=>sum + l.unitPriceCents * l.qty, 0),
        setHydrated: (v)=>set({
                _hasHydrated: v
            })
    }), {
    name: 'vialchemlabs:cart',
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>localStorage),
    partialize: (state)=>({
            lines: state.lines
        }),
    onRehydrateStorage: ()=>(state)=>{
            state?.setHydrated(true);
        }
}));
const useCartHydrated = ()=>useCartStore((s)=>s._hasHydrated);
}),
"[project]/components/CartCount.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartCount",
    ()=>CartCount
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cart$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/cart-store.ts [app-ssr] (ecmascript)");
'use client';
;
;
function CartCount() {
    const hydrated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cart$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCartHydrated"])();
    const count = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cart$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCartStore"])((s)=>s.lines.reduce((sum, l)=>sum + l.qty, 0));
    const display = hydrated ? count : 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "font-mono text-[11px] text-[var(--text-muted)] tabular",
        "aria-live": "polite",
        "aria-label": `Items in cart: ${display}`,
        children: display
    }, void 0, false, {
        fileName: "[project]/components/CartCount.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/MobileNavMenu.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MobileNavMenu",
    ()=>MobileNavMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * MobileNavMenu — disclosure-style nav for narrow viewports.
 *
 * Lives in SiteHeader behind `md:hidden` so desktop keeps the inline nav.
 * Closes on Escape, click outside, or any internal Link click. Body scroll
 * locks while open (prevents background scroll on iOS).
 *
 * ISSUE-005 fix: previously SiteHeader hid the desktop nav at md and provided
 * no replacement, so mobile users had no way to reach Shop / Quality / COA /
 * Research / About / FAQ / Contact except via the footer.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.mjs [app-ssr] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-ssr] (ecmascript) <export default as X>");
'use client';
;
;
;
;
;
const subscribe = ()=>()=>{};
const noopSnapshot = ()=>false;
const clientSnapshot = ()=>true;
function MobileNavMenu({ items }) {
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const mounted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, clientSnapshot, noopSnapshot);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!open) return;
        const onKey = (e)=>{
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return ()=>{
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [
        open
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setOpen(true),
                "aria-label": "Open menu",
                "aria-expanded": open,
                "aria-controls": "mobile-nav-drawer",
                className: "md:hidden inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                    size: 18,
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/components/MobileNavMenu.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/MobileNavMenu.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            open && mounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "mobile-nav-drawer",
                role: "dialog",
                "aria-modal": "true",
                "aria-label": "Site navigation",
                className: "md:hidden fixed inset-0 z-50 bg-black/80",
                onClick: (e)=>{
                    if (e.target === e.currentTarget) setOpen(false);
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute right-0 top-0 h-full w-full max-w-sm bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl flex flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between px-6 h-16 border-b border-[var(--border)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]",
                                    children: "Menu"
                                }, void 0, false, {
                                    fileName: "[project]/components/MobileNavMenu.tsx",
                                    lineNumber: 71,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setOpen(false),
                                    "aria-label": "Close menu",
                                    className: "inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 18,
                                        "aria-hidden": "true"
                                    }, void 0, false, {
                                        fileName: "[project]/components/MobileNavMenu.tsx",
                                        lineNumber: 80,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/MobileNavMenu.tsx",
                                    lineNumber: 74,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/MobileNavMenu.tsx",
                            lineNumber: 70,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            className: "flex-1 overflow-y-auto px-6 py-4",
                            "aria-label": "Mobile navigation",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "space-y-1",
                                children: [
                                    items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.href,
                                                onClick: ()=>setOpen(false),
                                                className: "block px-3 py-3 text-[16px] text-[var(--text)] hover:text-[var(--accent)] rounded-[var(--radius-md)] hover:bg-[var(--surface-strong)] transition-colors",
                                                children: item.label
                                            }, void 0, false, {
                                                fileName: "[project]/components/MobileNavMenu.tsx",
                                                lineNumber: 87,
                                                columnNumber: 23
                                            }, this)
                                        }, item.href, false, {
                                            fileName: "[project]/components/MobileNavMenu.tsx",
                                            lineNumber: 86,
                                            columnNumber: 21
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "pt-4 mt-4 border-t border-[var(--border)]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/account",
                                            onClick: ()=>setOpen(false),
                                            className: "block px-3 py-3 font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--text-muted)] hover:text-[var(--accent)] rounded-[var(--radius-md)] hover:bg-[var(--surface-strong)] transition-colors",
                                            children: "Account"
                                        }, void 0, false, {
                                            fileName: "[project]/components/MobileNavMenu.tsx",
                                            lineNumber: 97,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/MobileNavMenu.tsx",
                                        lineNumber: 96,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/MobileNavMenu.tsx",
                                lineNumber: 84,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/MobileNavMenu.tsx",
                            lineNumber: 83,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/MobileNavMenu.tsx",
                    lineNumber: 69,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/MobileNavMenu.tsx",
                lineNumber: 59,
                columnNumber: 11
            }, this), document.body)
        ]
    }, void 0, true);
}
}),
"[project]/lib/auth-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthHydrated",
    ()=>useAuthHydrated,
    "useAuthStore",
    ()=>useAuthStore,
    "useCurrentUser",
    ()=>useCurrentUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
/**
 * Auth store — v1.3 client-side, localStorage-backed user accounts.
 *
 * v4 deferred D2 (Supabase auth) to Phase 10. v1.3 ships a real-feeling
 * account system in the meantime: Zustand + localStorage persist, password
 * hashing via Web Crypto SHA-256 + per-account salt, multi-user-per-device
 * keyed by email. When Supabase wires in (D2 closure), this store becomes a
 * cache for server state — the public API stays the same.
 *
 * Iron Law 2.22 spirit: passwords are hashed (never stored plain), but this
 * is browser-side storage — anyone with the device has access. The honest
 * positioning ("pre-launch · server auth wires before public launch") stays
 * surfaced in the UI so users know.
 */ 'use client';
;
;
function uuid() {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
}
function genSalt() {
    const arr = new Uint8Array(16);
    if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
        crypto.getRandomValues(arr);
    } else {
        for(let i = 0; i < arr.length; i++)arr[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(arr).map((b)=>b.toString(16).padStart(2, '0')).join('');
}
async function hashPassword(password, salt) {
    const data = new TextEncoder().encode(password + salt);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map((b)=>b.toString(16).padStart(2, '0')).join('');
}
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        users: {},
        currentEmail: null,
        _hasHydrated: false,
        setHydrated: (v)=>set({
                _hasHydrated: v
            }),
        signup: async ({ email, password, role, displayName, newsletterOptIn = true })=>{
            const key = normalizeEmail(email);
            if (get().users[key]) {
                throw new Error('An account already exists for this email. Sign in instead.');
            }
            if (password.length < 8) {
                throw new Error('Password must be at least 8 characters.');
            }
            const salt = genSalt();
            const passwordHash = await hashPassword(password, salt);
            const user = {
                id: uuid(),
                email: key,
                role,
                displayName: displayName.trim() || key.split('@')[0],
                passwordHash,
                salt,
                createdAt: new Date().toISOString(),
                qualified: false,
                qualifiedAt: null,
                addresses: [],
                newsletterOptIn
            };
            set((state)=>({
                    users: {
                        ...state.users,
                        [key]: user
                    },
                    currentEmail: key
                }));
            return user;
        },
        login: async ({ email, password })=>{
            const key = normalizeEmail(email);
            const user = get().users[key];
            if (!user) {
                throw new Error('No account found for that email. Create one first.');
            }
            const expected = await hashPassword(password, user.salt);
            if (expected !== user.passwordHash) {
                throw new Error('Wrong password. Try again or reset.');
            }
            set({
                currentEmail: key
            });
            return user;
        },
        logout: ()=>set({
                currentEmail: null
            }),
        getCurrentUser: ()=>{
            const { currentEmail, users } = get();
            if (!currentEmail) return null;
            return users[currentEmail] ?? null;
        },
        markQualified: ()=>{
            const { currentEmail, users } = get();
            if (!currentEmail || !users[currentEmail]) return;
            const updated = {
                ...users[currentEmail],
                qualified: true,
                qualifiedAt: new Date().toISOString()
            };
            set({
                users: {
                    ...users,
                    [currentEmail]: updated
                }
            });
        },
        addAddress: (address)=>{
            const newAddr = {
                ...address,
                id: uuid()
            };
            const { currentEmail, users } = get();
            if (!currentEmail || !users[currentEmail]) return newAddr;
            const updated = {
                ...users[currentEmail],
                addresses: [
                    ...users[currentEmail].addresses,
                    newAddr
                ]
            };
            set({
                users: {
                    ...users,
                    [currentEmail]: updated
                }
            });
            return newAddr;
        },
        setNewsletterOptIn: (v)=>{
            const { currentEmail, users } = get();
            if (!currentEmail || !users[currentEmail]) return;
            const updated = {
                ...users[currentEmail],
                newsletterOptIn: v
            };
            set({
                users: {
                    ...users,
                    [currentEmail]: updated
                }
            });
        },
        setDisplayName: (name)=>{
            const { currentEmail, users } = get();
            if (!currentEmail || !users[currentEmail]) return;
            const updated = {
                ...users[currentEmail],
                displayName: name.trim()
            };
            set({
                users: {
                    ...users,
                    [currentEmail]: updated
                }
            });
        }
    }), {
    name: 'vialchemlabs:auth',
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>localStorage),
    partialize: (state)=>({
            users: state.users,
            currentEmail: state.currentEmail
        }),
    onRehydrateStorage: ()=>(state)=>{
            state?.setHydrated(true);
        }
}));
const useAuthHydrated = ()=>useAuthStore((s)=>s._hasHydrated);
const useCurrentUser = ()=>useAuthStore((s)=>s.currentEmail ? s.users[s.currentEmail] ?? null : null);
}),
"[project]/components/AuthHeaderLink.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthHeaderLink",
    ()=>AuthHeaderLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * AuthHeaderLink — small client island for the SiteHeader auth area.
 *
 * Renders "Sign in" when signed out, or the user's display name when signed
 * in (linking to /account). Hydration-safe via useAuthHydrated() — the
 * server-rendered fallback is the "Sign in" state, which matches the most
 * common case for first-load.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-store.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function AuthHeaderLink() {
    const hydrated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthHydrated"])();
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCurrentUser"])();
    // Pre-hydration: render the "Sign in" fallback so SSR + first paint match.
    if (!hydrated || !user) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            href: "/login",
            className: "hidden md:inline-flex items-center font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)] hover:text-[var(--text-muted)] transition-colors px-3 py-2",
            children: "Sign in"
        }, void 0, false, {
            fileName: "[project]/components/AuthHeaderLink.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        href: "/account",
        className: "hidden md:inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] hover:text-[var(--accent-soft)] transition-colors px-3 py-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                className: "h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
            }, void 0, false, {
                fileName: "[project]/components/AuthHeaderLink.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: user.displayName
            }, void 0, false, {
                fileName: "[project]/components/AuthHeaderLink.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AuthHeaderLink.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ThemeToggle.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeToggle",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.mjs [app-ssr] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.mjs [app-ssr] (ecmascript) <export default as Sun>");
/**
 * ThemeToggle — flips `data-theme` on <html> and persists choice.
 *
 * v5: dark is the default; light is opt-in via [data-theme="light"] on <html>.
 * Tiny client island; lives in the header right cluster. No hydration flicker
 * because the inline script in `<head>` (set in app/layout.tsx) sets the
 * attribute before React mounts.
 */ 'use client';
;
;
;
function readInitialTheme() {
    if ("TURBOPACK compile-time truthy", 1) return 'dark';
    //TURBOPACK unreachable
    ;
}
function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try {
        localStorage.setItem('vc-theme', theme);
        window.dispatchEvent(new Event('vc-theme-change'));
    } catch  {
    /* ignore storage errors (private mode etc.) */ }
}
function subscribeTheme(callback) {
    window.addEventListener('storage', callback);
    window.addEventListener('vc-theme-change', callback);
    return ()=>{
        window.removeEventListener('storage', callback);
        window.removeEventListener('vc-theme-change', callback);
    };
}
function readServerTheme() {
    return 'dark';
}
function ThemeToggle() {
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribeTheme, readInitialTheme, readServerTheme);
    function toggle() {
        const next = theme === 'light' ? 'dark' : 'light';
        applyTheme(next);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: toggle,
        "aria-label": `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`,
        title: `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`,
        className: "inline-flex items-center justify-center h-9 w-9 rounded-[var(--radius-md)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-colors duration-[var(--dur-short)]",
        children: theme === 'light' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
            size: 15,
            strokeWidth: 1.75,
            "aria-hidden": "true"
        }, void 0, false, {
            fileName: "[project]/components/ThemeToggle.tsx",
            lineNumber: 70,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
            size: 15,
            strokeWidth: 1.75,
            "aria-hidden": "true"
        }, void 0, false, {
            fileName: "[project]/components/ThemeToggle.tsx",
            lineNumber: 72,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ThemeToggle.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/SiteHeader.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SiteHeader",
    ()=>SiteHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$site$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/content/site.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CartCount$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CartCount.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MobileNavMenu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/MobileNavMenu.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AuthHeaderLink$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AuthHeaderLink.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ThemeToggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ThemeToggle.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
// v5 rebrand — nav rewritten per brand spec §6:
//   Shop Peptides · Verify a Vial · Get Verified · My Lab
const NAV = [
    {
        href: '/shop',
        label: 'Shop Peptides'
    },
    {
        href: '/coa',
        label: 'Verify a Vial'
    },
    {
        href: '/verify',
        label: 'Get Verified'
    },
    {
        href: '/account',
        label: 'My Lab'
    }
];
function SiteHeader() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md sticky top-0 z-20",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-6xl px-6 h-16 flex items-center justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: "/",
                    className: "group inline-flex items-baseline leading-none",
                    "aria-label": `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$site$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["siteConfig"].name} home`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[18px] font-medium tracking-tight text-[var(--text)]",
                        children: "vialchemlabs"
                    }, void 0, false, {
                        fileName: "[project]/components/SiteHeader.tsx",
                        lineNumber: 27,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/SiteHeader.tsx",
                    lineNumber: 21,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "hidden md:flex items-center gap-1",
                    "aria-label": "Primary",
                    children: NAV.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: item.href,
                            className: "px-3 py-2 text-[14px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-[var(--dur-short)] rounded-[var(--radius-md)]",
                            children: item.label
                        }, item.href, false, {
                            fileName: "[project]/components/SiteHeader.tsx",
                            lineNumber: 34,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/SiteHeader.tsx",
                    lineNumber: 32,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ThemeToggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeToggle"], {}, void 0, false, {
                            fileName: "[project]/components/SiteHeader.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AuthHeaderLink$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthHeaderLink"], {}, void 0, false, {
                            fileName: "[project]/components/SiteHeader.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/verify",
                            className: "hidden md:inline-flex items-center px-3 h-9 rounded-[var(--radius-md)] bg-[var(--accent)] text-[var(--text-on-accent)] text-[13px] font-medium hover:bg-[var(--accent-deep)] transition-colors duration-[var(--dur-short)]",
                            children: "Get Verified"
                        }, void 0, false, {
                            fileName: "[project]/components/SiteHeader.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/cart",
                            className: "inline-flex items-center gap-2 px-3 h-9 rounded-[var(--radius-md)] border border-[var(--border)] hover:border-[var(--accent)] text-[13px] transition-colors duration-[var(--dur-short)]",
                            "aria-label": "Cart",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Cart"
                                }, void 0, false, {
                                    fileName: "[project]/components/SiteHeader.tsx",
                                    lineNumber: 58,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CartCount$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CartCount"], {}, void 0, false, {
                                    fileName: "[project]/components/SiteHeader.tsx",
                                    lineNumber: 59,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/SiteHeader.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MobileNavMenu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MobileNavMenu"], {
                            items: NAV
                        }, void 0, false, {
                            fileName: "[project]/components/SiteHeader.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/SiteHeader.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/SiteHeader.tsx",
            lineNumber: 20,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/SiteHeader.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
/**
 * Class-name composition utility.
 *
 * Combines `clsx` (conditional class lists) with `tailwind-merge` (deduplicates
 * Tailwind utilities so later overrides win). Use everywhere a component
 * accepts an external `className` prop.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/components/ui/Button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Button — Posture A clean clinical primitive.
 *
 * Variants: primary, outline, ghost, data
 * Sizes:    sm, md, lg
 *
 * Iron Law: focus-visible rings come from globals.css (2px solid accent + 2px
 * offset). We do not override that here — it is global and contractual.
 *
 * Touch target: `sm` size is intentionally 32px high for desktop-only contexts
 * (filter chips, table-row actions). On mobile primary actions, prefer `md`+.
 */ __turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonClassNames",
    ()=>buttonClassNames
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
const baseClasses = [
    // layout
    'inline-flex items-center justify-center gap-2',
    'rounded-[10px]',
    // typography
    'font-medium',
    'whitespace-nowrap',
    // motion (premium-out, 200ms — Appendix V.2)
    'transition-[transform,background-color,border-color,color,box-shadow]',
    'duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
    // active scale (80ms micro)
    'active:scale-[0.98] active:duration-[80ms]',
    // disabled
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'
].join(' ');
const variantClasses = {
    primary: [
        'bg-[var(--accent)] text-[var(--text-on-accent)]',
        'border border-[var(--accent)]',
        // Phase 2 v4 — additive shadow elevation per Phase 1 token system
        'shadow-[var(--shadow-sm)]',
        'hover:bg-[var(--accent-deep)] hover:border-[var(--accent-deep)]',
        'hover:-translate-y-px hover:shadow-[var(--shadow-md)]',
        // Phase 2 v4 — pressed state uses deeper teal (Iron Law 2.26 compliant)
        'active:bg-[var(--accent-deep)] active:border-[var(--accent-deep)]'
    ].join(' '),
    outline: [
        'bg-transparent text-[var(--text)]',
        'border border-[var(--border-strong)]',
        'hover:border-[var(--accent)] hover:text-[var(--accent)]',
        'hover:-translate-y-px'
    ].join(' '),
    ghost: [
        'bg-transparent text-[var(--text-muted)]',
        'hover:text-[var(--accent)] hover:bg-[var(--surface)]'
    ].join(' '),
    data: [
        'font-mono uppercase tracking-[0.12em]',
        'bg-[var(--surface-strong)] text-[var(--text)]',
        'border border-[var(--border)]',
        'hover:border-[var(--accent)] hover:text-[var(--accent)]'
    ].join(' '),
    // Phase 2 v4 — success variant for transactional confirmations.
    // Uses --accent-soft (lighter teal) to read as "ok / confirmed" within
    // Posture A; not a green-out (Iron Law 2.26 — no acid green).
    success: [
        'bg-[var(--accent-soft)] text-[var(--text-on-accent)]',
        'border border-[var(--accent-soft)]',
        'shadow-[var(--shadow-sm)]',
        'hover:bg-[var(--accent-glow)] hover:border-[var(--accent-glow)]',
        'hover:-translate-y-px hover:shadow-[var(--shadow-md)]'
    ].join(' '),
    // Phase 2 v4 — danger variant for destructive transactional surfaces
    // (cancel-order, refund-request — Phase 5 Dialog flows).
    danger: [
        'bg-[var(--pill-error)] text-[var(--text-on-accent)]',
        'border border-[var(--pill-error)]',
        'shadow-[var(--shadow-sm)]',
        'hover:opacity-90',
        'hover:-translate-y-px hover:shadow-[var(--shadow-md)]'
    ].join(' ')
};
const sizeClasses = {
    sm: 'h-8 px-3 text-[14px]',
    md: 'h-10 px-4 text-[16px]',
    lg: 'h-12 px-6 text-[18px]'
};
function buttonClassNames(variant = 'primary', size = 'md', extra) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(baseClasses, variantClasses[variant], sizeClasses[size], extra);
}
function Button({ variant = 'primary', size = 'md', className, type, ref, ...rest }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ref: ref,
        // Default to type="button" to avoid accidental form submits — opt-in to
        // submit explicitly via the `type` prop.
        type: type ?? 'button',
        className: buttonClassNames(variant, size, className),
        ...rest
    }, void 0, false, {
        fileName: "[project]/components/ui/Button.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/NewsletterForm.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NewsletterForm",
    ()=>NewsletterForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Button.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function NewsletterForm() {
    const reduced = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [errorMsg, setErrorMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    async function onSubmit(e) {
        e.preventDefault();
        if (state === 'submitting' || state === 'success') return;
        const form = e.currentTarget;
        const data = new FormData(form);
        const email = String(data.get('email') ?? '').trim();
        if (!email) return;
        setState('submitting');
        setErrorMsg(null);
        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email
                })
            });
            if (res.ok || res.status === 303 || res.status === 0) {
                setState('success');
            } else {
                setState('error');
                setErrorMsg('We could not subscribe that email. Please check the address and try again.');
            }
        } catch  {
            setState('error');
            setErrorMsg('Network error. Please try again.');
        }
    }
    // Variants — collapse the form row vertically when success fires.
    const collapseDuration = reduced ? 0 : 0.32;
    const fadeDuration = reduced ? 0 : 0.4;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                initial: false,
                mode: "wait",
                children: state !== 'success' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].form, {
                    action: "/api/newsletter/subscribe",
                    method: "POST",
                    onSubmit: onSubmit,
                    className: "flex gap-2 max-w-sm",
                    initial: false,
                    exit: {
                        opacity: 0,
                        height: 0,
                        transition: {
                            duration: collapseDuration
                        }
                    },
                    style: {
                        overflow: 'hidden'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "email",
                            name: "email",
                            required: true,
                            "aria-label": "Email address for newsletter",
                            placeholder: "research@example.com",
                            disabled: state === 'submitting',
                            className: "flex-1 h-10 px-3 rounded-[var(--radius-md)] bg-[var(--surface-strong)] border border-[var(--border)] text-[14px] focus:border-[var(--accent)] focus:outline-none"
                        }, void 0, false, {
                            fileName: "[project]/components/NewsletterForm.tsx",
                            lineNumber: 81,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            type: "submit",
                            variant: "primary",
                            size: "md",
                            disabled: state === 'submitting',
                            children: state === 'submitting' ? 'Subscribing…' : 'Subscribe'
                        }, void 0, false, {
                            fileName: "[project]/components/NewsletterForm.tsx",
                            lineNumber: 90,
                            columnNumber: 13
                        }, this)
                    ]
                }, "form", true, {
                    fileName: "[project]/components/NewsletterForm.tsx",
                    lineNumber: 67,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].p, {
                    role: "status",
                    "aria-live": "polite",
                    initial: {
                        opacity: 0,
                        y: 4
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    transition: {
                        duration: fadeDuration
                    },
                    className: "font-mono text-[13px] text-[var(--accent)] py-2",
                    children: "Subscribed. Check your inbox for the welcome email and 15% off promo code."
                }, "success", false, {
                    fileName: "[project]/components/NewsletterForm.tsx",
                    lineNumber: 100,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/NewsletterForm.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            errorMsg ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                role: "alert",
                className: "font-mono text-[12px] text-[var(--pill-error)] mt-2",
                children: errorMsg
            }, void 0, false, {
                fileName: "[project]/components/NewsletterForm.tsx",
                lineNumber: 116,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/NewsletterForm.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/SiteFooter.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SiteFooter",
    ()=>SiteFooter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$site$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/content/site.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$NewsletterForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/NewsletterForm.tsx [app-ssr] (ecmascript)");
;
;
;
;
function SiteFooter() {
    const year = new Date().getFullYear();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "mt-auto border-t border-[var(--border)] bg-[var(--bg)]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-6xl px-6 py-14",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-10 flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-2 px-3 h-7 rounded-[var(--radius-pill)] border border-[var(--border)] bg-[var(--surface)] font-mono text-[11px] uppercase tracking-[0.05em] text-[var(--text-muted)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": "true",
                                className: "h-1.5 w-1.5 rounded-full bg-[var(--accent-hi)]"
                            }, void 0, false, {
                                fileName: "[project]/components/SiteFooter.tsx",
                                lineNumber: 17,
                                columnNumber: 13
                            }, this),
                            "Research use only · For verified laboratories"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SiteFooter.tsx",
                        lineNumber: 16,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/SiteFooter.tsx",
                    lineNumber: 15,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-10 md:grid-cols-5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "md:col-span-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[18px] font-medium tracking-tight text-[var(--text)] mb-2",
                                    children: "vialchemlabs"
                                }, void 0, false, {
                                    fileName: "[project]/components/SiteFooter.tsx",
                                    lineNumber: 23,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[14px] text-[var(--text-muted)] max-w-sm mb-5 leading-relaxed",
                                    children: [
                                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$site$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["siteConfig"].tagline,
                                        " For verified laboratories and qualified research organizations only."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/SiteFooter.tsx",
                                    lineNumber: 26,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$NewsletterForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NewsletterForm"], {}, void 0, false, {
                                    fileName: "[project]/components/SiteFooter.tsx",
                                    lineNumber: 30,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-mono text-[11px] uppercase tracking-[0.05em] text-[var(--text-subtle)] mt-2",
                                    children: "Research updates. No marketing fluff."
                                }, void 0, false, {
                                    fileName: "[project]/components/SiteFooter.tsx",
                                    lineNumber: 31,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/SiteFooter.tsx",
                            lineNumber: 22,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3",
                                    children: "Shop"
                                }, void 0, false, {
                                    fileName: "[project]/components/SiteFooter.tsx",
                                    lineNumber: 37,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-2 text-[14px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/shop",
                                                className: "text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors",
                                                children: "All Products"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SiteFooter.tsx",
                                                lineNumber: 42,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/SiteFooter.tsx",
                                            lineNumber: 41,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/products/recovery-stack",
                                                className: "text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors",
                                                children: "Recovery Stack"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SiteFooter.tsx",
                                                lineNumber: 47,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/SiteFooter.tsx",
                                            lineNumber: 46,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/coa",
                                                className: "text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors",
                                                children: "Certificate of Analysis"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SiteFooter.tsx",
                                                lineNumber: 52,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/SiteFooter.tsx",
                                            lineNumber: 51,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/test-reports",
                                                className: "text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors",
                                                children: "Lab Partner"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SiteFooter.tsx",
                                                lineNumber: 57,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/SiteFooter.tsx",
                                            lineNumber: 56,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/SiteFooter.tsx",
                                    lineNumber: 40,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/SiteFooter.tsx",
                            lineNumber: 36,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3",
                                    children: "Customer Service"
                                }, void 0, false, {
                                    fileName: "[project]/components/SiteFooter.tsx",
                                    lineNumber: 65,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-2 text-[14px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/contact",
                                                className: "text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors",
                                                children: "Contact"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SiteFooter.tsx",
                                                lineNumber: 69,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/SiteFooter.tsx",
                                            lineNumber: 69,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/faq",
                                                className: "text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors",
                                                children: "FAQ"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SiteFooter.tsx",
                                                lineNumber: 70,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/SiteFooter.tsx",
                                            lineNumber: 70,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/account",
                                                className: "text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors",
                                                children: "Account"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SiteFooter.tsx",
                                                lineNumber: 71,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/SiteFooter.tsx",
                                            lineNumber: 71,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/affiliate",
                                                className: "text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors",
                                                children: "Affiliate Program"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SiteFooter.tsx",
                                                lineNumber: 72,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/SiteFooter.tsx",
                                            lineNumber: 72,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/SiteFooter.tsx",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/SiteFooter.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3",
                                    children: "Legal"
                                }, void 0, false, {
                                    fileName: "[project]/components/SiteFooter.tsx",
                                    lineNumber: 77,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-2 text-[14px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/legal/terms",
                                                className: "text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors",
                                                children: "Terms"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SiteFooter.tsx",
                                                lineNumber: 81,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/SiteFooter.tsx",
                                            lineNumber: 81,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/legal/privacy",
                                                className: "text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors",
                                                children: "Privacy"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SiteFooter.tsx",
                                                lineNumber: 82,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/SiteFooter.tsx",
                                            lineNumber: 82,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/legal/refunds",
                                                className: "text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors",
                                                children: "Refunds"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SiteFooter.tsx",
                                                lineNumber: 83,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/SiteFooter.tsx",
                                            lineNumber: 83,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/legal/shipping",
                                                className: "text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors",
                                                children: "Shipping"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SiteFooter.tsx",
                                                lineNumber: 84,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/SiteFooter.tsx",
                                            lineNumber: 84,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/legal/cookies",
                                                className: "text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors",
                                                children: "Cookies"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SiteFooter.tsx",
                                                lineNumber: 85,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/SiteFooter.tsx",
                                            lineNumber: 85,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/SiteFooter.tsx",
                                    lineNumber: 80,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/SiteFooter.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/SiteFooter.tsx",
                    lineNumber: 21,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-12 pt-8 border-t border-[var(--border)] space-y-3 text-[13px] text-[var(--text-subtle)] leading-relaxed",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "All products are sold for research, laboratory, or analytical purposes only, and are not for human consumption."
                        }, void 0, false, {
                            fileName: "[project]/components/SiteFooter.tsx",
                            lineNumber: 92,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "The statements made within this website have not been evaluated by the U.S. Food and Drug Administration. The statements and the products of this company are not intended to diagnose, treat, cure or prevent any disease."
                        }, void 0, false, {
                            fileName: "[project]/components/SiteFooter.tsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$site$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["siteConfig"].name,
                                " is a chemical supplier. ",
                                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$site$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["siteConfig"].name,
                                " is not a compounding pharmacy or chemical compounding facility as defined under 503A of the Federal Food, Drug, and Cosmetic Act. ",
                                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$site$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["siteConfig"].name,
                                " is not an outsourcing facility as defined under 503B of the Federal Food, Drug, and Cosmetic Act."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/SiteFooter.tsx",
                            lineNumber: 101,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/SiteFooter.tsx",
                    lineNumber: 91,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-8 text-[12px] text-[var(--text-subtle)] flex justify-between flex-wrap gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                "© ",
                                year,
                                " ",
                                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$site$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["siteConfig"].llcName,
                                ", ",
                                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$site$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["siteConfig"].llcJurisdiction,
                                ". All rights reserved."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/SiteFooter.tsx",
                            lineNumber: 110,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-mono",
                            children: "vialchemlabs"
                        }, void 0, false, {
                            fileName: "[project]/components/SiteFooter.tsx",
                            lineNumber: 111,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/SiteFooter.tsx",
                    lineNumber: 109,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/SiteFooter.tsx",
            lineNumber: 13,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/SiteFooter.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/Pill.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Pill — short status / metadata badge.
 *
 * Used for: VERIFIED, RUO ONLY, SHIPS US, IN STOCK, ALLOCATED, EXPIRED.
 *
 * A11y rule (Iron Law): color is never the sole indicator. Every pill
 * carries a text label. Variant only adjusts color; never removes text.
 *
 * Phase 2 v4 — `kind` prop extends Pill into a Badge surface (per super-
 * prompt §8 PHASE 2 step 13: "extend Pill with kind: 'status' | 'category'
 * | 'tag' prop"). Default kind="status" preserves the existing v3.0
 * color-mix tinted bg. kind="category" uses --surface (lower visual
 * weight; for catalog category labels). kind="tag" uses --surface-muted
 * with --text-muted (for inline data tags like SKU codes).
 */ __turbopack_context__.s([
    "Pill",
    ()=>Pill
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
// Status kind — existing v3.0 visual: text + border tinted with the
// variant color, ~12% bg fill via color-mix.
const statusVariantClasses = {
    accent: 'text-[var(--pill-accent)] border-[color:color-mix(in_srgb,var(--pill-accent)_40%,transparent)] bg-[color:color-mix(in_srgb,var(--pill-accent)_12%,transparent)]',
    info: 'text-[var(--pill-info)] border-[color:color-mix(in_srgb,var(--pill-info)_40%,transparent)] bg-[color:color-mix(in_srgb,var(--pill-info)_12%,transparent)]',
    electric: 'text-[var(--pill-electric)] border-[color:color-mix(in_srgb,var(--pill-electric)_40%,transparent)] bg-[color:color-mix(in_srgb,var(--pill-electric)_12%,transparent)]',
    error: 'text-[var(--pill-error)] border-[color:color-mix(in_srgb,var(--pill-error)_40%,transparent)] bg-[color:color-mix(in_srgb,var(--pill-error)_12%,transparent)]'
};
// Category kind — surface bg with variant text color (lower visual weight
// than status; used for catalog category tags).
const categoryVariantClasses = {
    accent: 'text-[var(--pill-accent)] border-[var(--border)] bg-[var(--surface)]',
    info: 'text-[var(--pill-info)] border-[var(--border)] bg-[var(--surface)]',
    electric: 'text-[var(--pill-electric)] border-[var(--border)] bg-[var(--surface)]',
    error: 'text-[var(--pill-error)] border-[var(--border)] bg-[var(--surface)]'
};
// Tag kind — muted bg + muted text. Variant only tints the border so the
// tag reads as low-importance (inline SKU codes, dose readouts in tables).
const tagVariantClasses = {
    accent: 'text-[var(--text-muted)] border-[color:color-mix(in_srgb,var(--pill-accent)_30%,transparent)] bg-[var(--surface-muted)]',
    info: 'text-[var(--text-muted)] border-[color:color-mix(in_srgb,var(--pill-info)_30%,transparent)] bg-[var(--surface-muted)]',
    electric: 'text-[var(--text-muted)] border-[color:color-mix(in_srgb,var(--pill-electric)_30%,transparent)] bg-[var(--surface-muted)]',
    error: 'text-[var(--text-muted)] border-[color:color-mix(in_srgb,var(--pill-error)_30%,transparent)] bg-[var(--surface-muted)]'
};
const kindClassMap = {
    status: statusVariantClasses,
    category: categoryVariantClasses,
    tag: tagVariantClasses
};
function Pill({ variant, kind = 'status', className, children, ref, ...rest }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('inline-flex items-center justify-center', 'h-[var(--pill-h)] px-2', 'border rounded-full', 'font-mono uppercase tracking-[0.12em]', 'text-[11px] leading-none', 'whitespace-nowrap', kindClassMap[kind][variant], className),
        ...rest,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ui/Pill.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/Input.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * Input — text input field.
 *
 * Visual: surface-strong bg, 1px border, 10px radius. Focus ring comes from
 * globals.css `*:focus-visible` (2px solid accent + 2px offset).
 *
 * A11y:
 *  - When `error` is set, render an error message paired via aria-describedby
 *    and toggle aria-invalid="true". Error region is role="alert" so AT
 *    announces it on appearance.
 *  - Pair with a <FieldLabel htmlFor={id}> upstream for full association.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
function Input({ id, error, className, ref, 'aria-describedby': ariaDescribedByProp, ...rest }) {
    const reactId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    const inputId = id ?? `input-${reactId}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [
        ariaDescribedByProp,
        errorId
    ].filter(Boolean).join(' ') || undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: ref,
                id: inputId,
                "aria-invalid": error ? 'true' : 'false',
                "aria-describedby": describedBy,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('w-full', 'bg-[var(--surface-strong)]', 'text-[var(--text)]', 'placeholder:text-[var(--text-subtle)]', 'border border-[var(--border)]', 'rounded-[10px]', 'h-10 px-3', 'text-[16px]', 'transition-[colors,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]', 'hover:border-[var(--border-strong)]', // Phase 2 v4 — inset shadow on focus for depth perception
                // (complements global *:focus-visible 2px outline; Apple Dev Docs feel).
                'focus:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.32)]', 'disabled:opacity-50 disabled:cursor-not-allowed', error ? 'border-[var(--pill-error)] hover:border-[var(--pill-error)]' : '', className),
                ...rest
            }, void 0, false, {
                fileName: "[project]/components/ui/Input.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: errorId,
                role: "alert",
                className: "mt-1 text-[12px] font-mono text-[var(--pill-error)]",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/ui/Input.tsx",
                lineNumber: 65,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true);
}
}),
"[project]/components/ui/Card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Card — surface container.
 *
 * Default: `--surface` bg, 1px border, 14px radius.
 * Interactive: hover accent border + 1px translate-y lift (premium-out 200ms).
 *
 * Polymorphic via `as`: 'div' (default) | 'article' | 'section'. Use 'article'
 * for catalog tiles (each peptide card is a self-contained unit) and 'section'
 * for grouping regions inside a larger flow.
 */ __turbopack_context__.s([
    "Card",
    ()=>Card
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
// Phase 2 v4 — Card surface backgrounds vary by variant.
// `elevated` swaps to --surface-elevated for a one-step-brighter floor that
// reads as a raised plinth against the page bg + atmospheric gradient.
const surfaceClasses = {
    default: 'bg-[var(--surface)]',
    interactive: 'bg-[var(--surface)]',
    elevated: 'bg-[var(--surface-elevated)]'
};
const variantClasses = {
    // Phase 2 v4 — additive shadow on default for subtle separation from page bg.
    default: 'shadow-[var(--shadow-sm)]',
    interactive: [
        'cursor-pointer',
        'transition-[transform,border-color,box-shadow]',
        'duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
        // Phase 2 v4 — resting shadow + lift to --shadow-md on hover
        'shadow-[var(--shadow-sm)]',
        'hover:border-[var(--accent)]',
        'hover:-translate-y-px hover:shadow-[var(--shadow-md)]'
    ].join(' '),
    // Phase 2 v4 — `elevated` variant for raised surfaces (PDP price strip,
    // Recovery Stack CTA card, account-dashboard tiles). Static raised plinth
    // — does NOT also hover-translate (would be visually busy per Iron Law 2.18).
    elevated: 'shadow-[var(--shadow-lg)]'
};
function Card({ variant = 'default', as = 'div', className, children, ref, ...rest }) {
    const Component = as;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(surfaceClasses[variant], 'border border-[var(--border)]', 'rounded-[14px]', variantClasses[variant], className),
        ...rest,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ui/Card.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/EmptyState.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * EmptyState — standardized empty-state pattern.
 *
 * Centered icon + headline + body + CTA. Used for cart-empty,
 * orders-empty, addresses-empty, COA-no-results, shop-no-results
 * (super-prompt §7.3).
 *
 * Heading is <h2> (assumes the page has an h1 already; Phase 8 a11y lift
 * verifies heading hierarchy across pages).
 */ __turbopack_context__.s([
    "EmptyState",
    ()=>EmptyState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
function EmptyState({ title, description, icon, action, className, ref, ...rest }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex flex-col items-center justify-center text-center', 'gap-4 py-16 px-6', className),
        ...rest,
        children: [
            icon ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-[var(--text-subtle)]",
                "aria-hidden": true,
                children: icon
            }, void 0, false, {
                fileName: "[project]/components/ui/EmptyState.tsx",
                lineNumber: 42,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-[24px] font-medium text-[var(--text)] leading-tight",
                children: title
            }, void 0, false, {
                fileName: "[project]/components/ui/EmptyState.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            description ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "max-w-md text-[15px] leading-[1.6] text-[var(--text-muted)]",
                children: description
            }, void 0, false, {
                fileName: "[project]/components/ui/EmptyState.tsx",
                lineNumber: 50,
                columnNumber: 9
            }, this) : null,
            action ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2",
                children: action
            }, void 0, false, {
                fileName: "[project]/components/ui/EmptyState.tsx",
                lineNumber: 54,
                columnNumber: 17
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/EmptyState.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/content/products.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Catalog seed metadata.
 *
 * v1.3 — catalog expanded from 7 → 16 SKUs + 1 → 3 bundles per operator
 * direction (more density à la peer reference catalogs). The 9 added SKUs
 * are deliberately compliance-safe per Iron Law 2.7 + 2.14: no GLP-1 class,
 * no Tirzepatide / Semaglutide / Retatrutide / Tesamorelin, no
 * bacteriostatic water, no SS-31, no PT-141. Each addition is a research
 * peptide with established in vitro / animal-model literature and no
 * FDA-approved drug analog in the US that would invite enforcement
 * comparison. Iron Law 2.11: canonical names only, no obfuscated codes.
 *
 * SCANNER_OK: reviewed-and-cso-passed (PROTECTED PATH — Iron Law 2.5/2.19).
 * Each new shortDescription audited against assertMarketingCopySafe in
 * lib/compliance.ts; verified by tests/unit/catalog-safety.test.ts which
 * iterates the full products array.
 */ __turbopack_context__.s([
    "bundles",
    ()=>bundles,
    "formatPerMg",
    ()=>formatPerMg,
    "formatPrice",
    ()=>formatPrice,
    "getBundleBySlug",
    ()=>getBundleBySlug,
    "getProductBySlug",
    ()=>getProductBySlug,
    "getProductsByCategory",
    ()=>getProductsByCategory,
    "productCategories",
    ()=>productCategories,
    "products",
    ()=>products
]);
const products = [
    {
        slug: 'bpc-157-10mg',
        sku: 'BPC-157-10MG',
        name: 'BPC-157, 10mg vial',
        shortName: 'BPC-157',
        dose: '10mg',
        format: 'vial',
        listPriceCents: 5400,
        perMgCents: 540,
        category: 'recovery',
        role: 'loss-leader',
        position: '10% below market median',
        shortDescription: 'Synthetic 15-amino-acid peptide fragment isolated from bovine gastric juice. Subject of in-vitro and animal-model research on tissue-protective signaling.'
    },
    {
        slug: 'tb-500-5mg',
        sku: 'TB-500-5MG',
        name: 'TB-500, 5mg vial',
        shortName: 'TB-500',
        dose: '5mg',
        format: 'vial',
        listPriceCents: 3400,
        perMgCents: 680,
        category: 'recovery',
        role: 'loss-leader',
        position: '5% below market median',
        shortDescription: 'Synthetic 17-amino-acid C-terminal actin-binding fragment of thymosin beta-4. Studied in animal-model and in-vitro research on tissue repair and angiogenesis.'
    },
    {
        slug: 'ghk-cu-50mg',
        sku: 'GHK-CU-50MG',
        name: 'GHK-Cu, 50mg vial',
        shortName: 'GHK-Cu',
        dose: '50mg',
        format: 'vial',
        listPriceCents: 3400,
        perMgCents: 68,
        category: 'cosmetic-pathway',
        role: 'loss-leader',
        position: '9% below market median',
        shortDescription: 'Bioactive tripeptide (Gly-His-Lys) complexed with copper. Studied in cell-culture research on fibroblast function and collagen metabolism.'
    },
    {
        slug: 'ipamorelin-10mg',
        sku: 'IPAMORELIN-10MG',
        name: 'Ipamorelin, 10mg vial',
        shortName: 'Ipamorelin',
        dose: '10mg',
        format: 'vial',
        listPriceCents: 5000,
        perMgCents: 500,
        category: 'gh-axis',
        role: 'volume-driver',
        position: 'just below 25th percentile',
        shortDescription: 'Selective pentapeptide growth-hormone-releasing peptide agonist. Studied in animal-model research on isolated GH-axis activation.'
    },
    {
        slug: 'cjc-1295-no-dac-5mg',
        sku: 'CJC-1295-NO-DAC-5MG',
        name: 'CJC-1295 (no DAC), 5mg vial',
        shortName: 'CJC-1295 (no DAC)',
        dose: '5mg',
        format: 'vial',
        listPriceCents: 2500,
        perMgCents: 500,
        category: 'gh-axis',
        role: 'volume-driver',
        position: 'just below 25th percentile',
        shortDescription: 'Synthetic 30-amino-acid GHRH agonist without Drug Affinity Complex. Research tool for acute pulsatile-secretion paradigm investigation.'
    },
    {
        slug: 'mots-c-10mg',
        sku: 'MOTS-C-10MG',
        name: 'MOTS-c, 10mg vial',
        shortName: 'MOTS-c',
        dose: '10mg',
        format: 'vial',
        listPriceCents: 4800,
        perMgCents: 480,
        category: 'metabolic',
        role: 'catalog-filler',
        position: 'market median',
        shortDescription: 'Mitochondrial-derived 16-amino-acid peptide encoded within the mitochondrial genome. Studied in cell-culture and animal-model metabolic research.'
    },
    {
        slug: 'selank-10mg',
        sku: 'SELANK-10MG',
        name: 'Selank, 10mg vial',
        shortName: 'Selank',
        dose: '10mg',
        format: 'vial',
        listPriceCents: 4800,
        perMgCents: 480,
        category: 'nootropic',
        role: 'catalog-filler',
        position: 'just below median',
        shortDescription: 'Synthetic heptapeptide derived from tuftsin. Studied in cell-culture and animal-model research on immune-cell activation and neuroprotection.'
    },
    /* ===== v1.3 catalog expansion (9 new SKUs) ===== */ {
        slug: 'sermorelin-2mg',
        sku: 'SERMORELIN-2MG',
        name: 'Sermorelin, 2mg vial',
        shortName: 'Sermorelin',
        dose: '2mg',
        format: 'vial',
        listPriceCents: 3000,
        perMgCents: 1500,
        category: 'gh-axis',
        role: 'volume-driver',
        position: 'just below market median',
        shortDescription: 'Synthetic 29-amino-acid analog of growth-hormone-releasing hormone (GHRH 1-29). Research tool for somatotroph activation studies in cell culture and animal models.'
    },
    {
        slug: 'ghrp-2-5mg',
        sku: 'GHRP-2-5MG',
        name: 'GHRP-2, 5mg vial',
        shortName: 'GHRP-2',
        dose: '5mg',
        format: 'vial',
        listPriceCents: 2500,
        perMgCents: 500,
        category: 'gh-axis',
        role: 'volume-driver',
        position: 'just below 25th percentile',
        shortDescription: 'Synthetic hexapeptide growth-hormone-releasing-peptide. Studied in pituitary cell-culture research and animal-model investigations of the GH-secretagogue receptor pathway.'
    },
    {
        slug: 'ghrp-6-5mg',
        sku: 'GHRP-6-5MG',
        name: 'GHRP-6, 5mg vial',
        shortName: 'GHRP-6',
        dose: '5mg',
        format: 'vial',
        listPriceCents: 2500,
        perMgCents: 500,
        category: 'gh-axis',
        role: 'volume-driver',
        position: 'just below 25th percentile',
        shortDescription: 'Synthetic hexapeptide GH secretagogue with a binding profile distinct from GHRP-2. Research tool for ghrelin-receptor pathway investigation in animal-model studies.'
    },
    {
        slug: 'hexarelin-2mg',
        sku: 'HEXARELIN-2MG',
        name: 'Hexarelin, 2mg vial',
        shortName: 'Hexarelin',
        dose: '2mg',
        format: 'vial',
        listPriceCents: 3000,
        perMgCents: 1500,
        category: 'gh-axis',
        role: 'catalog-filler',
        position: 'market median',
        shortDescription: 'Synthetic six-amino-acid growth-hormone-releasing peptide. Studied in cell-culture research on GHS-receptor binding and in animal-model investigations of cardiac-tissue signaling.'
    },
    {
        slug: 'semax-30mg',
        sku: 'SEMAX-30MG',
        name: 'Semax, 30mg vial',
        shortName: 'Semax',
        dose: '30mg',
        format: 'vial',
        listPriceCents: 6000,
        perMgCents: 200,
        category: 'nootropic',
        role: 'volume-driver',
        position: 'just below market median',
        shortDescription: 'Synthetic heptapeptide derived from ACTH (4-10). Subject of Russian-published research literature on neuropeptide signaling and cognitive-paradigm investigation in animal models.'
    },
    {
        slug: 'epitalon-50mg',
        sku: 'EPITALON-50MG',
        name: 'Epitalon, 50mg vial',
        shortName: 'Epitalon',
        dose: '50mg',
        format: 'vial',
        listPriceCents: 6000,
        perMgCents: 120,
        category: 'metabolic',
        role: 'catalog-filler',
        position: 'market median',
        shortDescription: 'Synthetic tetrapeptide (Ala-Glu-Asp-Gly) of the Khavinson bioregulator class. Studied in cell-culture research on telomere-related cellular signaling and in animal-model longevity paradigms.'
    },
    {
        slug: 'thymosin-alpha-1-5mg',
        sku: 'THYMOSIN-ALPHA-1-5MG',
        name: 'Thymosin Alpha-1, 5mg vial',
        shortName: 'Thymosin α-1',
        dose: '5mg',
        format: 'vial',
        listPriceCents: 7500,
        perMgCents: 1500,
        category: 'immune',
        role: 'catalog-filler',
        position: 'market median',
        shortDescription: 'Synthetic 28-amino-acid peptide identical to the naturally occurring thymic peptide. Studied in cell-culture and animal-model research on immune-cell signaling and lymphocyte differentiation.'
    },
    {
        slug: 'dsip-5mg',
        sku: 'DSIP-5MG',
        name: 'DSIP, 5mg vial',
        shortName: 'DSIP',
        dose: '5mg',
        format: 'vial',
        listPriceCents: 4500,
        perMgCents: 900,
        category: 'nootropic',
        role: 'catalog-filler',
        position: 'just below market median',
        shortDescription: 'Delta Sleep-Inducing Peptide, a nine-amino-acid neuropeptide. Studied in animal-model research on circadian-rhythm signaling and central-nervous-system pathway investigation.'
    },
    {
        slug: 'kpv-5mg',
        sku: 'KPV-5MG',
        name: 'KPV, 5mg vial',
        shortName: 'KPV',
        dose: '5mg',
        format: 'vial',
        listPriceCents: 4500,
        perMgCents: 900,
        category: 'recovery',
        role: 'catalog-filler',
        position: 'just below market median',
        shortDescription: 'Synthetic tripeptide (Lys-Pro-Val) corresponding to the C-terminal sequence of alpha-MSH. Studied in cell-culture research on inflammatory pathway signaling.'
    }
];
const bundles = [
    {
        slug: 'recovery-stack',
        sku: 'BUNDLE-RECOVERY-STACK',
        name: 'Recovery Stack',
        constituents: [
            'BPC-157-10MG',
            'TB-500-5MG'
        ],
        listPriceCents: 7700,
        effectiveDiscountPct: 12.5,
        description: 'Pairs the gastric-protective peptide BPC-157 with the actin-binding TB-500 fragment. The recovery-pathway research bundle most-attested across the vendor universe (298 of 3388 SKU rows).'
    },
    /* ===== v1.3 bundle expansion ===== */ {
        slug: 'gh-pulsatile-stack',
        sku: 'BUNDLE-GH-PULSATILE-STACK',
        name: 'GH Pulsatile Stack',
        constituents: [
            'CJC-1295-NO-DAC-5MG',
            'IPAMORELIN-10MG'
        ],
        listPriceCents: 7000,
        effectiveDiscountPct: 6.7,
        description: 'Pairs the GHRH agonist CJC-1295 (no DAC) with the selective GHRP Ipamorelin. The most-attested research stack for GH-axis pulsatile-secretion paradigm investigation in animal models.'
    },
    {
        slug: 'khavinson-stack',
        sku: 'BUNDLE-KHAVINSON-STACK',
        name: 'Khavinson Bioregulator Stack',
        constituents: [
            'EPITALON-50MG',
            'THYMOSIN-ALPHA-1-5MG'
        ],
        listPriceCents: 12500,
        effectiveDiscountPct: 7.4,
        description: 'Pairs Epitalon (Khavinson tetrapeptide) with Thymosin Alpha-1 (thymic peptide). Bundle for cell-culture and animal-model research on bioregulator-class peptide signaling.'
    }
];
const productCategories = [
    {
        id: 'recovery',
        label: 'Recovery'
    },
    {
        id: 'gh-axis',
        label: 'GH-Axis'
    },
    {
        id: 'cosmetic-pathway',
        label: 'Cosmetic Pathway'
    },
    {
        id: 'metabolic',
        label: 'Metabolic'
    },
    {
        id: 'nootropic',
        label: 'Nootropic'
    },
    {
        id: 'immune',
        label: 'Immune'
    }
];
function getProductBySlug(slug) {
    return products.find((p)=>p.slug === slug);
}
function getBundleBySlug(slug) {
    return bundles.find((b)=>b.slug === slug);
}
function getProductsByCategory(category) {
    return products.filter((p)=>p.category === category);
}
function formatPrice(cents) {
    return `$${(cents / 100).toFixed(2)}`;
}
function formatPerMg(cents) {
    return `$${(cents / 100).toFixed(2)}/mg`;
}
}),
"[project]/lib/content/coa.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "coaRecords",
    ()=>coaRecords,
    "getCoa",
    ()=>getCoa
]);
/**
 * COA (Certificate of Analysis) library — placeholder index.
 *
 * Each opening SKU has one placeholder COA so the route table is in shape
 * before real PDFs land. The PDFs themselves do not exist yet; the COA detail
 * page links to /coa/<peptide>-<batch>.pdf with a clearly-labeled
 * "EXAMPLE COA — REPLACE BEFORE LAUNCH" notice (Iron Law 2.10: zero-edit
 * deployable means routes exist; placeholder content is explicitly flagged).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/content/products.ts [app-ssr] (ecmascript)");
;
const PLACEHOLDER_BATCH = 'BATCH-2026-PLACEHOLDER';
const PLACEHOLDER_DATE = '2026-04-15';
const coaRecords = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["products"].map((p)=>({
        peptide: p.slug,
        peptideName: p.name,
        batch: PLACEHOLDER_BATCH,
        testDate: PLACEHOLDER_DATE,
        lab: 'Independent Lab',
        hplcPurityPct: 99.1,
        sterilityResult: 'PASS',
        endotoxinEU_per_mg: '< 0.5 EU/mg',
        pdfPath: `/coa/${p.slug}-${PLACEHOLDER_BATCH}.pdf`
    }));
function getCoa(peptide, batch) {
    return coaRecords.find((r)=>r.peptide === peptide && r.batch === batch);
}
}),
"[project]/app/coa/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CoaIndexPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * COA library index. Renders all 7 placeholder COAs in a searchable
 * batch-lot table. Search is client-side Fuse.js over peptide name + batch
 * + lab.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SiteHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/SiteHeader.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SiteFooter$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/SiteFooter.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Pill$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Pill.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$EmptyState$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/EmptyState.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$coa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/content/coa.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
function CoaIndexPage() {
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const fuse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$coa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["coaRecords"], {
            keys: [
                'peptideName',
                'batch',
                'lab'
            ],
            threshold: 0.3,
            ignoreLocation: true
        }), []);
    const filtered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!query.trim()) return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$coa$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["coaRecords"];
        return fuse.search(query).map((r)=>r.item);
    }, [
        query,
        fuse
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SiteHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SiteHeader"], {}, void 0, false, {
                fileName: "[project]/app/coa/page.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                id: "main",
                className: "flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "border-b border-[var(--border)]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-auto max-w-5xl px-6 py-32 md:py-40",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-10",
                                    children: "C E R T I F I C A T E S · O F · A N A L Y S I S"
                                }, void 0, false, {
                                    fileName: "[project]/app/coa/page.tsx",
                                    lineNumber: 48,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-[clamp(40px,5.6vw,72px)] font-light leading-[1.05] tracking-tight text-[var(--text)] mb-10 max-w-3xl",
                                    children: "The number on the vial resolves to a published certificate."
                                }, void 0, false, {
                                    fileName: "[project]/app/coa/page.tsx",
                                    lineNumber: 51,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-px bg-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden grid-cols-1 md:grid-cols-3 mb-8",
                                    children: [
                                        {
                                            method: 'HPLC',
                                            caption: 'Reverse-phase, area-percent at 220nm',
                                            value: '99.1%',
                                            unit: 'avg purity'
                                        },
                                        {
                                            method: 'USP <71>',
                                            caption: 'Broth-based growth assay, 14-day incubation',
                                            value: 'PASS',
                                            unit: 'sterility'
                                        },
                                        {
                                            method: 'LAL',
                                            caption: 'Limulus Amebocyte Lysate gel-clot',
                                            value: '0.05',
                                            unit: 'EU/mg'
                                        }
                                    ].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-[var(--surface)] px-6 py-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)] mb-3",
                                                    children: t.method
                                                }, void 0, false, {
                                                    fileName: "[project]/app/coa/page.tsx",
                                                    lineNumber: 76,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-mono tabular text-[28px] text-[var(--text)] leading-none mb-2",
                                                    children: t.value
                                                }, void 0, false, {
                                                    fileName: "[project]/app/coa/page.tsx",
                                                    lineNumber: 79,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-subtle)] mb-3",
                                                    children: t.unit
                                                }, void 0, false, {
                                                    fileName: "[project]/app/coa/page.tsx",
                                                    lineNumber: 82,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[12px] text-[var(--text-muted)] leading-[1.5]",
                                                    children: t.caption
                                                }, void 0, false, {
                                                    fileName: "[project]/app/coa/page.tsx",
                                                    lineNumber: 85,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, t.method, true, {
                                            fileName: "[project]/app/coa/page.tsx",
                                            lineNumber: 75,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/coa/page.tsx",
                                    lineNumber: 54,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]",
                                    children: "Independent third-party laboratory · HPLC + USP <71> + LAL"
                                }, void 0, false, {
                                    fileName: "[project]/app/coa/page.tsx",
                                    lineNumber: 91,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/coa/page.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/coa/page.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-auto max-w-5xl px-6 py-12",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-8 max-w-md",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "coa-search",
                                            className: "block font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-2",
                                            children: "Search"
                                        }, void 0, false, {
                                            fileName: "[project]/app/coa/page.tsx",
                                            lineNumber: 100,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "coa-search",
                                            type: "search",
                                            value: query,
                                            onChange: (e)=>setQuery(e.target.value),
                                            placeholder: "BPC-157, BATCH-2026, lab…",
                                            "aria-controls": "coa-table"
                                        }, void 0, false, {
                                            fileName: "[project]/app/coa/page.tsx",
                                            lineNumber: 106,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/coa/page.tsx",
                                    lineNumber: 99,
                                    columnNumber: 13
                                }, this),
                                filtered.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$EmptyState$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EmptyState"], {
                                    title: "No matching certificates",
                                    description: `No COAs match "${query}". Try a peptide name (BPC-157), batch ID, or laboratory name.`,
                                    action: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "md",
                                        onClick: ()=>setQuery(''),
                                        children: "Clear search"
                                    }, void 0, false, {
                                        fileName: "[project]/app/coa/page.tsx",
                                        lineNumber: 121,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/coa/page.tsx",
                                    lineNumber: 117,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                    variant: "elevated",
                                    id: "coa-table",
                                    className: "overflow-x-auto p-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                        className: "w-full text-left text-[14px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                className: "border-b border-[var(--border)]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: "font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-4 py-3 font-normal",
                                                            children: "Peptide"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/coa/page.tsx",
                                                            lineNumber: 131,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-4 py-3 font-normal",
                                                            children: "Batch"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/coa/page.tsx",
                                                            lineNumber: 132,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-4 py-3 font-normal",
                                                            children: "Test date"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/coa/page.tsx",
                                                            lineNumber: 133,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-4 py-3 font-normal",
                                                            children: "Laboratory"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/coa/page.tsx",
                                                            lineNumber: 134,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-4 py-3 font-normal",
                                                            children: "HPLC purity"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/coa/page.tsx",
                                                            lineNumber: 135,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-4 py-3 font-normal",
                                                            children: "Status"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/coa/page.tsx",
                                                            lineNumber: 136,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-4 py-3 font-normal sr-only",
                                                            children: "Action"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/coa/page.tsx",
                                                            lineNumber: 137,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/coa/page.tsx",
                                                    lineNumber: 130,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/coa/page.tsx",
                                                lineNumber: 129,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                className: "divide-y divide-[var(--border)]",
                                                children: filtered.map((r, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        "data-stagger-row": "",
                                                        style: {
                                                            animationDelay: `${idx * 40}ms`
                                                        },
                                                        className: "hover:bg-[var(--surface-strong)] transition-colors duration-[var(--dur-short)]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-4 py-4 text-[var(--text)]",
                                                                children: r.peptideName
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/coa/page.tsx",
                                                                lineNumber: 148,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-4 py-4 font-mono text-[var(--text-muted)]",
                                                                children: r.batch
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/coa/page.tsx",
                                                                lineNumber: 151,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-4 py-4 font-mono text-[var(--text-muted)]",
                                                                children: r.testDate
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/coa/page.tsx",
                                                                lineNumber: 154,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-4 py-4 text-[var(--text-muted)]",
                                                                children: r.lab
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/coa/page.tsx",
                                                                lineNumber: 157,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-4 py-4 font-mono tabular text-[var(--text)]",
                                                                children: [
                                                                    r.hplcPurityPct.toFixed(1),
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/coa/page.tsx",
                                                                lineNumber: 160,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-4 py-4",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Pill$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Pill"], {
                                                                    variant: "accent",
                                                                    children: "Verified"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/coa/page.tsx",
                                                                    lineNumber: 164,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/coa/page.tsx",
                                                                lineNumber: 163,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-4 py-4 text-right",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                    href: `/coa/${r.peptide}/${r.batch}`,
                                                                    className: "font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--accent)] hover:text-[var(--accent-soft)]",
                                                                    children: "View →"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/coa/page.tsx",
                                                                    lineNumber: 167,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/coa/page.tsx",
                                                                lineNumber: 166,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, `${r.peptide}-${r.batch}`, true, {
                                                        fileName: "[project]/app/coa/page.tsx",
                                                        lineNumber: 142,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/coa/page.tsx",
                                                lineNumber: 140,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/coa/page.tsx",
                                        lineNumber: 128,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/coa/page.tsx",
                                    lineNumber: 127,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/coa/page.tsx",
                            lineNumber: 98,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/coa/page.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/coa/page.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SiteFooter$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SiteFooter"], {}, void 0, false, {
                fileName: "[project]/app/coa/page.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
];

//# debugId=a24c8475-bbfa-605b-5791-1cdb48e1f1b4
//# sourceMappingURL=_0febeg6._.js.map