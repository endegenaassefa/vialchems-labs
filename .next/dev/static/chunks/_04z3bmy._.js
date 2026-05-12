;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="617129c3-0ddb-a8cc-b0cf-3de461990311")}catch(e){}}();
(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/cart-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCartHydrated",
    ()=>useCartHydrated,
    "useCartStore",
    ()=>useCartStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
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
const useCartStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
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
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>localStorage),
    partialize: (state)=>({
            lines: state.lines
        }),
    onRehydrateStorage: ()=>(state)=>{
            state?.setHydrated(true);
        }
}));
const useCartHydrated = ()=>{
    _s();
    return useCartStore({
        "useCartHydrated.useCartStore": (s)=>s._hasHydrated
    }["useCartHydrated.useCartStore"]);
};
_s(useCartHydrated, "vOk2FmEg3LLE63xy3j4NxLHG1vQ=", false, function() {
    return [
        useCartStore
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/CartCount.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartCount",
    ()=>CartCount
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/cart-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function CartCount() {
    _s();
    const hydrated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartHydrated"])();
    const count = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"])({
        "CartCount.useCartStore[count]": (s)=>s.lines.reduce({
                "CartCount.useCartStore[count]": (sum, l)=>sum + l.qty
            }["CartCount.useCartStore[count]"], 0)
    }["CartCount.useCartStore[count]"]);
    const display = hydrated ? count : 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
_s(CartCount, "n5S0R4rdA8K/ibfJfxJQo+9KDGg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartHydrated"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"]
    ];
});
_c = CartCount;
var _c;
__turbopack_context__.k.register(_c, "CartCount");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/MobileNavMenu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MobileNavMenu",
    ()=>MobileNavMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.mjs [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const subscribe = ()=>()=>{};
const noopSnapshot = ()=>false;
const clientSnapshot = ()=>true;
function MobileNavMenu({ items }) {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const mounted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, clientSnapshot, noopSnapshot);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MobileNavMenu.useEffect": ()=>{
            if (!open) return;
            const onKey = {
                "MobileNavMenu.useEffect.onKey": (e)=>{
                    if (e.key === 'Escape') setOpen(false);
                }
            }["MobileNavMenu.useEffect.onKey"];
            document.addEventListener('keydown', onKey);
            document.body.style.overflow = 'hidden';
            return ({
                "MobileNavMenu.useEffect": ()=>{
                    document.removeEventListener('keydown', onKey);
                    document.body.style.overflow = '';
                }
            })["MobileNavMenu.useEffect"];
        }
    }["MobileNavMenu.useEffect"], [
        open
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setOpen(true),
                "aria-label": "Open menu",
                "aria-expanded": open,
                "aria-controls": "mobile-nav-drawer",
                className: "md:hidden inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
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
            open && mounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "mobile-nav-drawer",
                role: "dialog",
                "aria-modal": "true",
                "aria-label": "Site navigation",
                className: "md:hidden fixed inset-0 z-50 bg-black/80",
                onClick: (e)=>{
                    if (e.target === e.currentTarget) setOpen(false);
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute right-0 top-0 h-full w-full max-w-sm bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl flex flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between px-6 h-16 border-b border-[var(--border)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]",
                                    children: "Menu"
                                }, void 0, false, {
                                    fileName: "[project]/components/MobileNavMenu.tsx",
                                    lineNumber: 71,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setOpen(false),
                                    "aria-label": "Close menu",
                                    className: "inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            className: "flex-1 overflow-y-auto px-6 py-4",
                            "aria-label": "Mobile navigation",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "space-y-1",
                                children: [
                                    items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "pt-4 mt-4 border-t border-[var(--border)]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
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
_s(MobileNavMenu, "4i7Bq3NQg2Sqg8LM5c/RBo+VEtw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
_c = MobileNavMenu;
var _c;
__turbopack_context__.k.register(_c, "MobileNavMenu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/auth-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthHydrated",
    ()=>useAuthHydrated,
    "useAuthStore",
    ()=>useAuthStore,
    "useCurrentUser",
    ()=>useCurrentUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
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
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
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
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>localStorage),
    partialize: (state)=>({
            users: state.users,
            currentEmail: state.currentEmail
        }),
    onRehydrateStorage: ()=>(state)=>{
            state?.setHydrated(true);
        }
}));
const useAuthHydrated = ()=>{
    _s();
    return useAuthStore({
        "useAuthHydrated.useAuthStore": (s)=>s._hasHydrated
    }["useAuthHydrated.useAuthStore"]);
};
_s(useAuthHydrated, "BSK3XewfuZPixDP8tbzcobpulFc=", false, function() {
    return [
        useAuthStore
    ];
});
const useCurrentUser = ()=>{
    _s1();
    return useAuthStore({
        "useCurrentUser.useAuthStore": (s)=>s.currentEmail ? s.users[s.currentEmail] ?? null : null
    }["useCurrentUser.useAuthStore"]);
};
_s1(useCurrentUser, "BSK3XewfuZPixDP8tbzcobpulFc=", false, function() {
    return [
        useAuthStore
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/AuthHeaderLink.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthHeaderLink",
    ()=>AuthHeaderLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * AuthHeaderLink — small client island for the SiteHeader auth area.
 *
 * Renders "Sign in" when signed out, or the user's display name when signed
 * in (linking to /account). Hydration-safe via useAuthHydrated() — the
 * server-rendered fallback is the "Sign in" state, which matches the most
 * common case for first-load.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function AuthHeaderLink() {
    _s();
    const hydrated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthHydrated"])();
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentUser"])();
    // Pre-hydration: render the "Sign in" fallback so SSR + first paint match.
    if (!hydrated || !user) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/login",
            className: "hidden md:inline-flex items-center font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)] hover:text-[var(--text-muted)] transition-colors px-3 py-2",
            children: "Sign in"
        }, void 0, false, {
            fileName: "[project]/components/AuthHeaderLink.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: "/account",
        className: "hidden md:inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] hover:text-[var(--accent-soft)] transition-colors px-3 py-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                className: "h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
            }, void 0, false, {
                fileName: "[project]/components/AuthHeaderLink.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
_s(AuthHeaderLink, "82JnzYUnjK6gKc5roIyty3UUq0E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthHydrated"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentUser"]
    ];
});
_c = AuthHeaderLink;
var _c;
__turbopack_context__.k.register(_c, "AuthHeaderLink");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ThemeToggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeToggle",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.mjs [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.mjs [app-client] (ecmascript) <export default as Sun>");
;
var _s = __turbopack_context__.k.signature();
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
function readInitialTheme() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const stored = localStorage.getItem('vc-theme');
        return stored === 'dark' || stored === 'light' ? stored : 'dark';
    } catch  {
        return 'dark';
    }
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
    _s();
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribeTheme, readInitialTheme, readServerTheme);
    function toggle() {
        const next = theme === 'light' ? 'dark' : 'light';
        applyTheme(next);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: toggle,
        "aria-label": `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`,
        title: `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`,
        className: "inline-flex items-center justify-center h-9 w-9 rounded-[var(--radius-md)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-colors duration-[var(--dur-short)]",
        children: theme === 'light' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
            size: 15,
            strokeWidth: 1.75,
            "aria-hidden": "true"
        }, void 0, false, {
            fileName: "[project]/components/ThemeToggle.tsx",
            lineNumber: 70,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
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
_s(ThemeToggle, "HbqBb6oWjpQSXathj5kEm7mskTM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
_c = ThemeToggle;
var _c;
__turbopack_context__.k.register(_c, "ThemeToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/Button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(baseClasses, variantClasses[variant], sizeClasses[size], extra);
}
function Button({ variant = 'primary', size = 'md', className, type, ref, ...rest }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
_c = Button;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/NewsletterForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NewsletterForm",
    ()=>NewsletterForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function NewsletterForm() {
    _s();
    const reduced = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [errorMsg, setErrorMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                initial: false,
                mode: "wait",
                children: state !== 'success' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].form, {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
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
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].p, {
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
            errorMsg ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
_s(NewsletterForm, "V2PMqQE3q1udsRxn/FNbngJ1bpk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"]
    ];
});
_c = NewsletterForm;
var _c;
__turbopack_context__.k.register(_c, "NewsletterForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/Card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(surfaceClasses[variant], 'border border-[var(--border)]', 'rounded-[14px]', variantClasses[variant], className),
        ...rest,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ui/Card.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
_c = Card;
var _c;
__turbopack_context__.k.register(_c, "Card");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/Pill.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex items-center justify-center', 'h-[var(--pill-h)] px-2', 'border rounded-full', 'font-mono uppercase tracking-[0.12em]', 'text-[11px] leading-none', 'whitespace-nowrap', kindClassMap[kind][variant], className),
        ...rest,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ui/Pill.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
_c = Pill;
var _c;
__turbopack_context__.k.register(_c, "Pill");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/Input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
function Input({ id, error, className, ref, 'aria-describedby': ariaDescribedByProp, ...rest }) {
    _s();
    const reactId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const inputId = id ?? `input-${reactId}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [
        ariaDescribedByProp,
        errorId
    ].filter(Boolean).join(' ') || undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: ref,
                id: inputId,
                "aria-invalid": error ? 'true' : 'false',
                "aria-describedby": describedBy,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-full', 'bg-[var(--surface-strong)]', 'text-[var(--text)]', 'placeholder:text-[var(--text-subtle)]', 'border border-[var(--border)]', 'rounded-[10px]', 'h-10 px-3', 'text-[16px]', 'transition-[colors,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]', 'hover:border-[var(--border-strong)]', // Phase 2 v4 — inset shadow on focus for depth perception
                // (complements global *:focus-visible 2px outline; Apple Dev Docs feel).
                'focus:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.32)]', 'disabled:opacity-50 disabled:cursor-not-allowed', error ? 'border-[var(--pill-error)] hover:border-[var(--pill-error)]' : '', className),
                ...rest
            }, void 0, false, {
                fileName: "[project]/components/ui/Input.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
_s(Input, "moCDPYxMUFmOsS7qNHNbUIv3mBU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c = Input;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/FieldLabel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * FieldLabel — uppercase Plex Mono label for form fields.
 *
 * Visual: 11px / mono / uppercase / 0.12em tracking / muted text color.
 * A11y:
 *  - Renders a real `<label>` element (so click-to-focus works).
 *  - Required marker is visual-only (`aria-hidden`); the `required` attribute
 *    on the input itself is the source of truth for assistive tech.
 *  - Pair with an Input that has a matching `id`.
 */ __turbopack_context__.s([
    "FieldLabel",
    ()=>FieldLabel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function FieldLabel({ required = false, className, children, ref, ...rest }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex items-center gap-1', 'font-mono uppercase', 'text-[11px] tracking-[0.12em]', 'text-[var(--text-muted)]', className),
        ...rest,
        children: [
            children,
            required ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                className: "text-[var(--accent)]",
                children: "*"
            }, void 0, false, {
                fileName: "[project]/components/ui/FieldLabel.tsx",
                lineNumber: 42,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/FieldLabel.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_c = FieldLabel;
var _c;
__turbopack_context__.k.register(_c, "FieldLabel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/content/product-images.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getProductStudioImage",
    ()=>getProductStudioImage
]);
const productStudioImages = {
    'bpc-157-10mg': {
        src: '/product-shots/bpc-157-10mg.png',
        alt: 'vialchemlabs BPC-157 10mg research vial'
    },
    'tb-500-5mg': {
        src: '/product-shots/tb-500-5mg.png',
        alt: 'vialchemlabs TB-500 5mg research vial'
    },
    'ghk-cu-50mg': {
        src: '/product-shots/ghk-cu-50mg.png',
        alt: 'vialchemlabs GHK-Cu 50mg research vial'
    },
    'ipamorelin-10mg': {
        src: '/product-shots/ipamorelin-10mg.png',
        alt: 'vialchemlabs Ipamorelin 10mg research vial'
    },
    'cjc-1295-no-dac-5mg': {
        src: '/product-shots/cjc-1295-no-dac-5mg.png',
        alt: 'vialchemlabs CJC-1295 (no DAC) 5mg research vial'
    },
    'mots-c-10mg': {
        src: '/product-shots/mots-c-10mg.png',
        alt: 'vialchemlabs MOTS-c 10mg research vial'
    },
    'selank-10mg': {
        src: '/product-shots/selank-10mg.png',
        alt: 'vialchemlabs Selank 10mg research vial'
    },
    'sermorelin-2mg': {
        src: '/product-shots/sermorelin-2mg.png',
        alt: 'vialchemlabs Sermorelin 2mg research vial'
    },
    'ghrp-2-5mg': {
        src: '/product-shots/ghrp-2-5mg.png',
        alt: 'vialchemlabs GHRP-2 5mg research vial'
    },
    'ghrp-6-5mg': {
        src: '/product-shots/ghrp-6-5mg.png',
        alt: 'vialchemlabs GHRP-6 5mg research vial'
    },
    'hexarelin-2mg': {
        src: '/product-shots/hexarelin-2mg.png',
        alt: 'vialchemlabs Hexarelin 2mg research vial'
    },
    'semax-30mg': {
        src: '/product-shots/semax-30mg.png',
        alt: 'vialchemlabs Semax 30mg research vial'
    },
    'epitalon-50mg': {
        src: '/product-shots/epitalon-50mg.png',
        alt: 'vialchemlabs Epitalon 50mg research vial'
    },
    'thymosin-alpha-1-5mg': {
        src: '/product-shots/thymosin-alpha-1-5mg.png',
        alt: 'vialchemlabs Thymosin alpha-1 5mg research vial'
    },
    'dsip-5mg': {
        src: '/product-shots/dsip-5mg.png',
        alt: 'vialchemlabs DSIP 5mg research vial'
    },
    'kpv-5mg': {
        src: '/product-shots/kpv-5mg.png',
        alt: 'vialchemlabs KPV 5mg research vial'
    }
};
function getProductStudioImage(slug) {
    return productStudioImages[slug];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/content/products.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/VialProductPhoto.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * VialProductPhoto — static product-photo style vial.
 *
 * Built to replace the synthetic/rotated 3D vial in PDP hero surfaces with a
 * straight-on black studio composition: matte cap, metallic crimp, glass body,
 * visible lyophilized powder, black label, and floor reflection. The label is
 * original vialchemlabs artwork; no competitor raster asset is used.
 */ __turbopack_context__.s([
    "VialProductPhoto",
    ()=>VialProductPhoto
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/content/products.ts [app-client] (ecmascript)");
;
;
;
const allowedCompounds = new Set([
    ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["products"].map((p)=>p.shortName.toLowerCase()),
    ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bundles"].map((b)=>b.name.toLowerCase())
]);
function assertCompoundAllowed(compound) {
    const normalized = compound.trim().toLowerCase();
    if (!allowedCompounds.has(normalized)) {
        throw new Error(`Compound "${compound}" is not in the vialchemlabs catalog.`);
    }
}
function MoleculeMark() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 92 110",
        className: "h-full w-full",
        "aria-hidden": "true",
        focusable: "false",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                fill: "none",
                stroke: "currentColor",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "5",
                opacity: "0.88",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M35 32 56 20l21 12v25L56 69 35 57Z"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M35 57 18 70v23"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M77 57 92 70"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M56 20V4"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M19 21 35 32"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M56 69v23"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M21 91h23"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M74 86h18"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M8 16h22"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/VialProductPhoto.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                fill: "currentColor",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "56",
                        cy: "4",
                        r: "7"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "19",
                        cy: "21",
                        r: "7"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "18",
                        cy: "93",
                        r: "8"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "74",
                        cy: "86",
                        r: "7"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "92",
                        cy: "70",
                        r: "6"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/VialProductPhoto.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/VialProductPhoto.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c = MoleculeMark;
function VialProductPhoto({ compound, dose, batch = '2026-01', purityLabel = '99%+ PURITY', className, style, ...rest }) {
    assertCompoundAllowed(compound);
    const compactCompound = compound.length > 12;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative isolate flex min-h-[520px] w-full items-center justify-center overflow-hidden bg-[#030303]', className),
        "aria-label": `vialchemlabs ${compound} ${dose} batch ${batch} vial product photo`,
        ...rest,
        style: {
            '--vial-photo-text-primary': '#f5f5f0',
            '--vial-photo-text-secondary': '#e9e9e3',
            ...style
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-hidden": "true",
                className: "absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.08),transparent_34%),linear-gradient(180deg,#000_0%,#030303_55%,#080808_100%)]"
            }, void 0, false, {
                fileName: "[project]/components/ui/VialProductPhoto.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-hidden": "true",
                className: "absolute bottom-[7%] h-[13%] w-[47%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.34)_0%,rgba(255,255,255,0.13)_28%,rgba(255,255,255,0.04)_52%,transparent_75%)] blur-[1px]"
            }, void 0, false, {
                fileName: "[project]/components/ui/VialProductPhoto.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-hidden": "true",
                className: "absolute bottom-[8.5%] h-[16%] w-[31%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.9),rgba(0,0,0,0.08)_70%,transparent_76%)]"
            }, void 0, false, {
                fileName: "[project]/components/ui/VialProductPhoto.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative h-[84%] min-h-[360px] max-h-[570px] w-[min(50%,265px)] min-w-[190px] max-w-[265px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-[2%] right-[2%] top-0 h-[13.5%] rounded-[9px_9px_14px_14px] border border-white/10 bg-[linear-gradient(180deg,#222_0%,#050505_38%,#191919_70%,#030303_100%)] shadow-[inset_0_2px_7px_rgba(255,255,255,0.2),inset_0_-8px_16px_rgba(0,0,0,0.92),0_10px_25px_rgba(0,0,0,0.75)]"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-[9%] right-[9%] top-[3.5%] h-[2.2%] rounded-full bg-white/20 blur-[1px]"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-[5%] right-[5%] top-[10.7%] h-[10.2%] rounded-[4px_4px_14px_14px] border border-white/20 bg-[linear-gradient(90deg,#1a1a1a_0%,#d7d7d4_18%,#fff_34%,#6d6d6b_52%,#dadad8_72%,#171717_100%)] shadow-[inset_0_8px_14px_rgba(255,255,255,0.3),inset_0_-11px_16px_rgba(0,0,0,0.62),0_8px_16px_rgba(0,0,0,0.72)]"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-[24%] right-[24%] top-[18.8%] h-[10.5%] border-x border-white/30 bg-[linear-gradient(90deg,rgba(255,255,255,0.05),rgba(255,255,255,0.88)_35%,rgba(255,255,255,0.22)_58%,rgba(255,255,255,0.05))]"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-[18%] right-[18%] top-[27.2%] h-[3.2%] rounded-full border border-white/20 bg-[linear-gradient(90deg,rgba(255,255,255,0.08),rgba(255,255,255,0.74),rgba(255,255,255,0.08))]"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-[3%] left-[8%] right-[8%] top-[25.5%] overflow-hidden rounded-[22px_22px_12px_12px] border border-white/28 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.68)_14%,rgba(255,255,255,0.08)_25%,rgba(255,255,255,0.03)_55%,rgba(255,255,255,0.52)_78%,rgba(255,255,255,0.07)_100%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18),inset_12px_0_24px_rgba(255,255,255,0.10),inset_-12px_0_22px_rgba(0,0,0,0.5),0_18px_36px_rgba(0,0,0,0.88)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-x-[7%] top-[5%] h-[18%] rounded-[45%] bg-[radial-gradient(ellipse_at_center,#f7f5ed_0%,#d8d3c8_42%,rgba(255,255,255,0.35)_65%,transparent_76%)] shadow-[0_5px_9px_rgba(255,255,255,0.26)]"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/VialProductPhoto.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-x-[6%] bottom-[9%] h-[18%] rounded-[40%] bg-[radial-gradient(ellipse_at_center,#f8f5ed_0%,#e2ded2_48%,rgba(255,255,255,0.35)_68%,transparent_78%)]"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/VialProductPhoto.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute left-[8%] top-[3%] h-[92%] w-[10%] rounded-full bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.66)_18%,rgba(255,255,255,0.24)_70%,transparent)] blur-[1px]"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/VialProductPhoto.tsx",
                                lineNumber: 128,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute right-[10%] top-[8%] h-[88%] w-[7%] rounded-full bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.38)_22%,rgba(255,255,255,0.13)_70%,transparent)] blur-[1px]"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/VialProductPhoto.tsx",
                                lineNumber: 129,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute left-[6%] right-[6%] top-[27%] h-[49%] overflow-hidden rounded-[10px] border border-white/74 bg-[linear-gradient(90deg,#020202_0%,#151515_14%,#070707_50%,#151515_86%,#020202_100%)] px-[7%] py-[5%] text-[var(--vial-photo-text-primary)] shadow-[inset_14px_0_18px_rgba(255,255,255,0.08),inset_-16px_0_20px_rgba(0,0,0,0.72),inset_0_0_0_1px_rgba(255,255,255,0.12),0_0_18px_rgba(0,0,0,0.72)] before:absolute before:inset-x-[5%] before:top-[3%] before:h-[6%] before:rounded-[50%] before:bg-white/12 after:absolute after:inset-x-[4%] after:bottom-[3%] after:h-[7%] after:rounded-[50%] after:bg-black/45",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative z-10 mb-[7%] whitespace-nowrap text-center font-mono text-[clamp(8px,0.86vw,12px)] font-semibold uppercase tracking-[0.18em] text-[var(--vial-photo-text-primary)]",
                                        children: "VIALCHEMLABS"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                                        lineNumber: 133,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative z-10 grid grid-cols-[0.82fr_1.18fr] items-center gap-[7%]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-[var(--vial-photo-text-secondary)]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MoleculeMark, {}, void 0, false, {
                                                    fileName: "[project]/components/ui/VialProductPhoto.tsx",
                                                    lineNumber: 138,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/ui/VialProductPhoto.tsx",
                                                lineNumber: 137,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-left",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mb-[9%] font-semibold tracking-[0] text-[var(--vial-photo-text-primary)]', compactCompound ? 'text-[clamp(10px,1.08vw,15px)] leading-[1.04]' : 'whitespace-nowrap text-[clamp(14px,1.48vw,20px)] leading-none'),
                                                        children: compound
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                                                        lineNumber: 141,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "whitespace-nowrap font-mono text-[clamp(6px,0.76vw,8px)] font-bold uppercase leading-[1.38] tracking-[0.01em] text-[var(--vial-photo-text-primary)]",
                                                        children: purityLabel
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                                                        lineNumber: 151,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "whitespace-nowrap font-mono text-[clamp(6px,0.76vw,8px)] font-bold uppercase leading-[1.38] tracking-[0.01em] text-[var(--vial-photo-text-primary)]",
                                                        children: "Lyophilized powder"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                                                        lineNumber: 154,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "whitespace-nowrap font-mono text-[clamp(6px,0.76vw,8px)] font-bold uppercase leading-[1.38] tracking-[0.01em] text-[var(--vial-photo-text-primary)]",
                                                        children: "Store at 2-8°C"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                                                        lineNumber: 157,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ui/VialProductPhoto.tsx",
                                                lineNumber: 140,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                                        lineNumber: 136,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative z-10 mt-[5%] border-t border-white/45 pt-[3%] text-center font-mono text-[clamp(6px,0.68vw,8px)] font-semibold uppercase tracking-[0.02em] text-[var(--vial-photo-text-primary)]",
                                        children: "For laboratory research only"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                                        lineNumber: 162,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative z-10 mt-[3%] flex items-center justify-center gap-[7%]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "h-px w-[28%] bg-white/72"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ui/VialProductPhoto.tsx",
                                                lineNumber: 166,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "whitespace-nowrap font-mono text-[clamp(12px,1.28vw,18px)] font-bold leading-none text-[var(--vial-photo-text-primary)]",
                                                children: dose.toUpperCase()
                                            }, void 0, false, {
                                                fileName: "[project]/components/ui/VialProductPhoto.tsx",
                                                lineNumber: 167,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "h-px w-[28%] bg-white/72"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ui/VialProductPhoto.tsx",
                                                lineNumber: 170,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                                        lineNumber: 165,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ui/VialProductPhoto.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-x-[4%] bottom-[1.5%] h-[6%] rounded-[50%] bg-[linear-gradient(180deg,rgba(255,255,255,0.58),rgba(255,255,255,0.06)_40%,rgba(0,0,0,0.68))]"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/VialProductPhoto.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/VialProductPhoto.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/VialProductPhoto.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/VialProductPhoto.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_c1 = VialProductPhoto;
var _c, _c1;
__turbopack_context__.k.register(_c, "MoleculeMark");
__turbopack_context__.k.register(_c1, "VialProductPhoto");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/ProductStudioVisual.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductStudioVisual",
    ()=>ProductStudioVisual
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$product$2d$images$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/content/product-images.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$VialProductPhoto$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/VialProductPhoto.tsx [app-client] (ecmascript)");
;
;
;
;
;
function ProductStudioVisual({ product, batch = '2026-01', priority = false, sizes = '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw', className, imageClassName, fallbackClassName }) {
    const studioImage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$product$2d$images$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProductStudioImage"])(product.slug);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative isolate overflow-hidden bg-black', 'before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_42%,rgba(34,211,238,0.14),transparent_46%)]', className),
        children: studioImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            src: studioImage.src,
            alt: studioImage.alt,
            fill: true,
            priority: priority,
            sizes: sizes,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative z-10 object-cover transition-[transform,filter] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]', 'group-hover/product:scale-[1.035] group-hover/product:-translate-y-0.5 group-hover/product:saturate-[1.08] group-hover/product:contrast-[1.06]', imageClassName)
        }, void 0, false, {
            fileName: "[project]/components/ui/ProductStudioVisual.tsx",
            lineNumber: 44,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$VialProductPhoto$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VialProductPhoto"], {
            compound: product.shortName,
            dose: product.dose,
            batch: batch,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('absolute inset-0 z-10 h-full min-h-0', fallbackClassName)
        }, void 0, false, {
            fileName: "[project]/components/ui/ProductStudioVisual.tsx",
            lineNumber: 57,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/ProductStudioVisual.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c = ProductStudioVisual;
var _c;
__turbopack_context__.k.register(_c, "ProductStudioVisual");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/content/bundle-images.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getBundleStudioImage",
    ()=>getBundleStudioImage
]);
const bundleStudioImages = {
    'recovery-stack': {
        src: '/bundle-shots/recovery-stack.png',
        alt: 'vialchemlabs Recovery Stack research bundle'
    },
    'gh-pulsatile-stack': {
        src: '/bundle-shots/gh-pulsatile-stack.png',
        alt: 'vialchemlabs GH Pulsatile Stack research bundle'
    },
    'khavinson-stack': {
        src: '/bundle-shots/khavinson-stack.png',
        alt: 'vialchemlabs Khavinson Bioregulator Stack research bundle'
    }
};
function getBundleStudioImage(slug) {
    return bundleStudioImages[slug];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/BundleStudioVisual.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BundleStudioVisual",
    ()=>BundleStudioVisual
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$bundle$2d$images$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/content/bundle-images.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
function BundleStudioVisual({ bundle, priority = false, sizes = '(min-width: 768px) 35vw, 100vw', className, imageClassName }) {
    const image = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$bundle$2d$images$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBundleStudioImage"])(bundle.slug);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative isolate overflow-hidden bg-black', 'before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_58%,rgba(34,211,238,0.14),transparent_48%)]', className),
        children: image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            src: image.src,
            alt: image.alt,
            fill: true,
            priority: priority,
            sizes: sizes,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative z-10 object-cover transition-[transform,filter] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]', 'group-hover/product:scale-[1.025] group-hover/product:saturate-[1.08] group-hover/product:contrast-[1.06]', imageClassName)
        }, void 0, false, {
            fileName: "[project]/components/ui/BundleStudioVisual.tsx",
            lineNumber: 32,
            columnNumber: 9
        }, this) : null
    }, void 0, false, {
        fileName: "[project]/components/ui/BundleStudioVisual.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_c = BundleStudioVisual;
var _c;
__turbopack_context__.k.register(_c, "BundleStudioVisual");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/EmptyState.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function EmptyState({ title, description, icon, action, className, ref, ...rest }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex flex-col items-center justify-center text-center', 'gap-4 py-16 px-6', className),
        ...rest,
        children: [
            icon ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-[var(--text-subtle)]",
                "aria-hidden": true,
                children: icon
            }, void 0, false, {
                fileName: "[project]/components/ui/EmptyState.tsx",
                lineNumber: 42,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-[24px] font-medium text-[var(--text)] leading-tight",
                children: title
            }, void 0, false, {
                fileName: "[project]/components/ui/EmptyState.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            description ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "max-w-md text-[15px] leading-[1.6] text-[var(--text-muted)]",
                children: description
            }, void 0, false, {
                fileName: "[project]/components/ui/EmptyState.tsx",
                lineNumber: 50,
                columnNumber: 9
            }, this) : null,
            action ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
_c = EmptyState;
var _c;
__turbopack_context__.k.register(_c, "EmptyState");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/StaggerReveal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StaggerReveal",
    ()=>StaggerReveal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const containerVariants = (stagger)=>({
        hidden: {},
        show: {
            transition: {
                staggerChildren: stagger,
                delayChildren: 0
            }
        }
    });
const itemVariants = (duration, initialY)=>({
        hidden: {
            opacity: 0,
            y: initialY
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration,
                ease: [
                    0.16,
                    1,
                    0.3,
                    1
                ]
            }
        }
    });
const subscribeHydration = ()=>()=>{};
const getHydratedSnapshot = ()=>true;
const getServerHydrationSnapshot = ()=>false;
function resolveMotionTag(tag) {
    const t = typeof tag === 'string' ? tag : 'div';
    switch(t){
        case 'span':
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span;
        case 'ul':
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].ul;
        case 'ol':
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].ol;
        case 'li':
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].li;
        case 'tbody':
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].tbody;
        case 'tr':
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].tr;
        case 'div':
        default:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div;
    }
}
function StaggerReveal({ as = 'div', itemAs = 'div', children, className, stagger = 0.07, duration = 0.32, initialY = 8, 'data-testid': testId }) {
    _s();
    const reduced = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    const hydrated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribeHydration, getHydratedSnapshot, getServerHydrationSnapshot);
    const Tag = as;
    const ItemTag = itemAs;
    if (!hydrated || reduced) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tag, {
            className: className,
            "data-stagger-reveal": "",
            "data-testid": testId,
            children: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].map(children, (child, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ItemTag, {
                    children: child
                }, getKey(child, index), false, {
                    fileName: "[project]/components/ui/StaggerReveal.tsx",
                    lineNumber: 133,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/components/ui/StaggerReveal.tsx",
            lineNumber: 127,
            columnNumber: 7
        }, this);
    }
    // resolveMotionTag returns a stable, module-level motion proxy
    // (motion.div, motion.ul, motion.tbody, etc.) — no per-render component
    // creation despite what the linter heuristic suggests.
    const MotionTag = resolveMotionTag(Tag);
    const MotionItem = resolveMotionTag(ItemTag);
    return /* eslint-disable react-hooks/static-components */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MotionTag, {
        className: className,
        "data-stagger-reveal": "",
        "data-testid": testId,
        variants: containerVariants(stagger),
        initial: "hidden",
        whileInView: "show",
        viewport: {
            once: true,
            amount: 'some'
        },
        children: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].map(children, (child, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MotionItem, {
                variants: itemVariants(duration, initialY),
                children: child
            }, getKey(child, index), false, {
                fileName: "[project]/components/ui/StaggerReveal.tsx",
                lineNumber: 157,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/ui/StaggerReveal.tsx",
        lineNumber: 147,
        columnNumber: 5
    }, this);
}
_s(StaggerReveal, "zjsO3y8vU0JYdOuuBlA+9h53ucA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
_c = StaggerReveal;
function getKey(child, fallback) {
    if (/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"])(child)) {
        const k = child.key;
        if (k !== null && k !== undefined) return k;
    }
    return fallback;
}
var _c;
__turbopack_context__.k.register(_c, "StaggerReveal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/RecoveryStackSheen.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RecoveryStackSheen",
    ()=>RecoveryStackSheen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
/**
 * Phase 7 (v4) — sheen sweep on Recovery Stack CTA.
 *
 * Renders a subtle teal-tinted gradient that sweeps left → right across the
 * parent container exactly once per session. Per Iron Law 2.18, the sheen
 * is hard-disabled when prefers-reduced-motion: reduce.
 *
 * Anchor: place inside a `position: relative` container; this overlay is
 * absolutely positioned and pointer-events:none so it never interferes with
 * the underlying CTA click target.
 *
 * Session flag: `vc-recovery-sheen-played`. The component sets it on mount
 * and reads it from sessionStorage; on subsequent visits the sheen renders
 * nothing.
 */ const SESSION_KEY = 'vc-recovery-sheen-played';
const DURATION_MS = 1400;
function RecoveryStackSheen() {
    _s();
    const reduced = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    const [render, setRender] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RecoveryStackSheen.useEffect": ()=>{
            if (reduced) return;
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            try {
                if (sessionStorage.getItem(SESSION_KEY) === '1') return;
                sessionStorage.setItem(SESSION_KEY, '1');
            } catch  {
                // sessionStorage may throw in private mode; degrade silently
                return;
            }
            // Client-only: the sheen is gated by sessionStorage which is unavailable
            // during SSR, so the render → effect → setState cycle is the correct
            // shape here.
            /* eslint-disable react-hooks/set-state-in-effect */ setRender(true);
            const id = window.setTimeout({
                "RecoveryStackSheen.useEffect.id": ()=>{
                    setRender(false);
                }
            }["RecoveryStackSheen.useEffect.id"], DURATION_MS);
            /* eslint-enable react-hooks/set-state-in-effect */ return ({
                "RecoveryStackSheen.useEffect": ()=>window.clearTimeout(id)
            })["RecoveryStackSheen.useEffect"];
        }
    }["RecoveryStackSheen.useEffect"], [
        reduced
    ]);
    if (!render) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        "data-recovery-sheen": "",
        "aria-hidden": "true",
        className: "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "absolute top-0 left-0 h-full w-[40%] [animation:recovery-sheen_1400ms_var(--ease-premium-out)_both]",
            style: {
                background: 'linear-gradient(115deg, transparent 0%, rgba(125,241,232,0) 30%, rgba(125,241,232,0.18) 50%, rgba(125,241,232,0) 70%, transparent 100%)'
            }
        }, void 0, false, {
            fileName: "[project]/components/ui/RecoveryStackSheen.tsx",
            lineNumber: 59,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/RecoveryStackSheen.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_s(RecoveryStackSheen, "QQ7hZu09yZLwC1TyYaY7QuQVEhk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"]
    ];
});
_c = RecoveryStackSheen;
var _c;
__turbopack_context__.k.register(_c, "RecoveryStackSheen");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/shop/ShopCatalog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ShopCatalog",
    ()=>ShopCatalog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Pill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Pill.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$FieldLabel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/FieldLabel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ProductStudioVisual$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/ProductStudioVisual.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$BundleStudioVisual$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/BundleStudioVisual.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/EmptyState.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$StaggerReveal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/StaggerReveal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$RecoveryStackSheen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/RecoveryStackSheen.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/cart-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/content/products.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
/**
 * ShopCatalog — client island for /shop page.
 *
 * Owns: search query, category filter set, in-stock toggle, sort selection.
 * Renders the Recovery Stack bundle as a separate accent card at the top,
 * then the filtered SKU grid below.
 *
 * Search uses Fuse.js across name + sku + category label (fuzzy threshold 0.4).
 *
 * v4 design overhaul: removed the placebo "In stock only" toggle (it was a
 * `list.filter(() => true)` no-op until real inventory lands in Phase 9).
 * Re-introduce when product.inStock is wired to real data; until then, do not
 * render UI for state we cannot honor. Iron Law spirit: do not fake controls.
 */ 'use client';
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
;
;
;
const SORT_OPTIONS = [
    {
        value: 'newest',
        label: 'Newest'
    },
    {
        value: 'price-asc',
        label: 'Price: low → high'
    },
    {
        value: 'price-desc',
        label: 'Price: high → low'
    },
    {
        value: 'name-asc',
        label: 'Name: A → Z'
    }
];
function ShopCatalog() {
    _s();
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [activeCategories, setActiveCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [sortKey, setSortKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('newest');
    const fuse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShopCatalog.useMemo[fuse]": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["products"], {
                keys: [
                    'name',
                    'sku',
                    'category',
                    'shortName'
                ],
                threshold: 0.4,
                ignoreLocation: true
            })
    }["ShopCatalog.useMemo[fuse]"], []);
    const visible = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShopCatalog.useMemo[visible]": ()=>{
            let list = query.trim().length > 0 ? fuse.search(query).map({
                "ShopCatalog.useMemo[visible]": (r)=>r.item
            }["ShopCatalog.useMemo[visible]"]) : [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["products"]
            ];
            if (activeCategories.size > 0) {
                list = list.filter({
                    "ShopCatalog.useMemo[visible]": (p)=>activeCategories.has(p.category)
                }["ShopCatalog.useMemo[visible]"]);
            }
            // v4: in-stock filter removed (was placebo; inventory not yet wired)
            switch(sortKey){
                case 'price-asc':
                    list = [
                        ...list
                    ].sort({
                        "ShopCatalog.useMemo[visible]": (a, b)=>a.listPriceCents - b.listPriceCents
                    }["ShopCatalog.useMemo[visible]"]);
                    break;
                case 'price-desc':
                    list = [
                        ...list
                    ].sort({
                        "ShopCatalog.useMemo[visible]": (a, b)=>b.listPriceCents - a.listPriceCents
                    }["ShopCatalog.useMemo[visible]"]);
                    break;
                case 'name-asc':
                    list = [
                        ...list
                    ].sort({
                        "ShopCatalog.useMemo[visible]": (a, b)=>a.shortName.localeCompare(b.shortName)
                    }["ShopCatalog.useMemo[visible]"]);
                    break;
                case 'newest':
                default:
                    break;
            }
            return list;
        }
    }["ShopCatalog.useMemo[visible]"], [
        query,
        activeCategories,
        sortKey,
        fuse
    ]);
    // ISSUE-008 fix: hide the Recovery Stack bundle when an active query / filter
    // doesn't match its name OR any of its constituent SKUs. Without this the
    // empty-results state still rendered the bundle on top.
    const visibleBundles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShopCatalog.useMemo[visibleBundles]": ()=>{
            const filtersActive = query.trim().length > 0 || activeCategories.size > 0;
            if (!filtersActive) return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bundles"];
            const visibleSkus = new Set(visible.map({
                "ShopCatalog.useMemo[visibleBundles]": (p)=>p.sku
            }["ShopCatalog.useMemo[visibleBundles]"]));
            const q = query.trim().toLowerCase();
            return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bundles"].filter({
                "ShopCatalog.useMemo[visibleBundles]": (b)=>{
                    const nameMatch = q.length > 0 && b.name.toLowerCase().includes(q);
                    const constituentMatch = b.constituents.some({
                        "ShopCatalog.useMemo[visibleBundles].constituentMatch": (sku)=>visibleSkus.has(sku)
                    }["ShopCatalog.useMemo[visibleBundles].constituentMatch"]);
                    // When ONLY the category filter is active (no text query), keep the
                    // bundle if any constituent is in the visible list.
                    if (q.length === 0) return constituentMatch;
                    return nameMatch || constituentMatch;
                }
            }["ShopCatalog.useMemo[visibleBundles]"]);
        }
    }["ShopCatalog.useMemo[visibleBundles]"], [
        query,
        activeCategories,
        visible
    ]);
    function toggleCategory(cat) {
        setActiveCategories((prev)=>{
            const next = new Set(prev);
            if (next.has(cat)) next.delete(cat);
            else next.add(cat);
            return next;
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-6xl px-6 py-12",
            children: [
                visibleBundles.map((bundle)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        as: "article",
                        variant: "interactive",
                        className: "group/product relative mb-12 grid gap-6 overflow-hidden p-4 md:grid-cols-[minmax(280px,360px)_1fr_auto] md:items-center md:p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$RecoveryStackSheen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RecoveryStackSheen"], {}, void 0, false, {
                                fileName: "[project]/app/shop/ShopCatalog.tsx",
                                lineNumber: 135,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `/products/${bundle.slug}`,
                                className: "block",
                                "aria-label": `View ${bundle.name}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$BundleStudioVisual$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BundleStudioVisual"], {
                                    bundle: bundle,
                                    className: "aspect-[4/3] rounded-[8px] border border-[color:color-mix(in_srgb,var(--accent)_16%,transparent)]",
                                    sizes: "(min-width: 768px) 360px, calc(100vw - 48px)"
                                }, void 0, false, {
                                    fileName: "[project]/app/shop/ShopCatalog.tsx",
                                    lineNumber: 141,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/shop/ShopCatalog.tsx",
                                lineNumber: 136,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Pill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Pill"], {
                                        variant: "accent",
                                        className: "mb-2",
                                        children: "Bundle"
                                    }, void 0, false, {
                                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                                        lineNumber: 148,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-[24px] md:text-[28px] font-medium tracking-tight text-[var(--text)] mb-1",
                                        children: bundle.name
                                    }, void 0, false, {
                                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                                        lineNumber: 151,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[14px] text-[var(--text-muted)] max-w-xl leading-relaxed",
                                        children: bundle.description
                                    }, void 0, false, {
                                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                                        lineNumber: 154,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/shop/ShopCatalog.tsx",
                                lineNumber: 147,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-start gap-2 md:items-end shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-baseline gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono tabular text-[24px] font-semibold text-[var(--text)]",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(bundle.listPriceCents)
                                            }, void 0, false, {
                                                fileName: "[project]/app/shop/ShopCatalog.tsx",
                                                lineNumber: 160,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono text-[12px] text-[var(--text-subtle)]",
                                                children: [
                                                    bundle.effectiveDiscountPct,
                                                    "% off"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/shop/ShopCatalog.tsx",
                                                lineNumber: 163,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                                        lineNumber: 159,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/products/${bundle.slug}`,
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buttonClassNames"])('outline', 'md'),
                                        children: "View bundle"
                                    }, void 0, false, {
                                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                                        lineNumber: 167,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/shop/ShopCatalog.tsx",
                                lineNumber: 158,
                                columnNumber: 13
                            }, this)
                        ]
                    }, bundle.slug, true, {
                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                        lineNumber: 129,
                        columnNumber: 11
                    }, this)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-5 md:grid-cols-[minmax(0,1.35fr)_minmax(0,2fr)_180px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$FieldLabel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldLabel"], {
                                        htmlFor: "catalog-search",
                                        children: "Search"
                                    }, void 0, false, {
                                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                                        lineNumber: 181,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "catalog-search",
                                            placeholder: "Peptide name or SKU",
                                            value: query,
                                            onChange: (e)=>setQuery(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/app/shop/ShopCatalog.tsx",
                                            lineNumber: 183,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                                        lineNumber: 182,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/shop/ShopCatalog.tsx",
                                lineNumber: 180,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$FieldLabel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldLabel"], {
                                        children: "Category"
                                    }, void 0, false, {
                                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                                        lineNumber: 193,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 flex flex-wrap gap-2",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productCategories"].map((cat)=>{
                                            const active = activeCategories.has(cat.id);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>toggleCategory(cat.id),
                                                "aria-pressed": active,
                                                className: [
                                                    'inline-flex items-center h-8 px-3 rounded-[var(--radius-full)]',
                                                    'font-mono uppercase tracking-[0.12em] text-[11px]',
                                                    'transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
                                                    active ? 'bg-[color:color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--accent)] border border-[var(--accent)]' : 'bg-[var(--surface-strong)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--border-strong)]'
                                                ].join(' '),
                                                children: cat.label
                                            }, cat.id, false, {
                                                fileName: "[project]/app/shop/ShopCatalog.tsx",
                                                lineNumber: 198,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                                        lineNumber: 194,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/shop/ShopCatalog.tsx",
                                lineNumber: 192,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$FieldLabel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldLabel"], {
                                        htmlFor: "catalog-sort",
                                        children: "Sort"
                                    }, void 0, false, {
                                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                                        lineNumber: 220,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            id: "catalog-sort",
                                            value: sortKey,
                                            onChange: (e)=>setSortKey(e.target.value),
                                            className: "w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-strong)] text-[14px] text-[var(--text)]",
                                            children: SORT_OPTIONS.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: opt.value,
                                                    children: opt.label
                                                }, opt.value, false, {
                                                    fileName: "[project]/app/shop/ShopCatalog.tsx",
                                                    lineNumber: 229,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/shop/ShopCatalog.tsx",
                                            lineNumber: 222,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                                        lineNumber: 221,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/shop/ShopCatalog.tsx",
                                lineNumber: 219,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                        lineNumber: 179,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/shop/ShopCatalog.tsx",
                    lineNumber: 178,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 flex items-center gap-3",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-subtle)]",
                        children: [
                            visible.length,
                            " / ",
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["products"].length,
                            " shown"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                        lineNumber: 241,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/shop/ShopCatalog.tsx",
                    lineNumber: 240,
                    columnNumber: 9
                }, this),
                visible.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyState"], {
                    title: "No matching peptides",
                    description: "No products match the current search query and category filters. Try clearing one or both.",
                    action: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        size: "md",
                        onClick: ()=>{
                            setQuery('');
                            setActiveCategories(new Set());
                        },
                        children: "Clear all filters"
                    }, void 0, false, {
                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                        lineNumber: 252,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/shop/ShopCatalog.tsx",
                    lineNumber: 248,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$StaggerReveal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StaggerReveal"], {
                    as: "ul",
                    itemAs: "li",
                    className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                    children: visible.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductTile, {
                            product: product
                        }, product.slug, false, {
                            fileName: "[project]/app/shop/ShopCatalog.tsx",
                            lineNumber: 271,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/shop/ShopCatalog.tsx",
                    lineNumber: 265,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/shop/ShopCatalog.tsx",
            lineNumber: 126,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/shop/ShopCatalog.tsx",
        lineNumber: 125,
        columnNumber: 5
    }, this);
}
_s(ShopCatalog, "7dU3zXNs5C6E4g8UGAEMuyggShs=");
_c = ShopCatalog;
function ProductTile({ product }) {
    _s1();
    const addLine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"])({
        "ProductTile.useCartStore[addLine]": (s)=>s.addLine
    }["ProductTile.useCartStore[addLine]"]);
    const categoryLabel = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productCategories"].find((c)=>c.id === product.category)?.label ?? product.category;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        as: "article",
        variant: "interactive",
        className: "group/product h-full overflow-hidden p-0 flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: `/products/${product.slug}`,
                className: "block p-3 pb-0",
                "aria-label": `View ${product.name}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-3 flex flex-wrap gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Pill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Pill"], {
                                variant: "electric",
                                className: "h-5 px-1.5 text-[9px]",
                                children: "RUO"
                            }, void 0, false, {
                                fileName: "[project]/app/shop/ShopCatalog.tsx",
                                lineNumber: 297,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Pill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Pill"], {
                                variant: "accent",
                                className: "h-5 px-1.5 text-[9px]",
                                children: "COA"
                            }, void 0, false, {
                                fileName: "[project]/app/shop/ShopCatalog.tsx",
                                lineNumber: 300,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Pill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Pill"], {
                                variant: "info",
                                kind: "tag",
                                className: "h-5 px-1.5 text-[9px]",
                                children: categoryLabel
                            }, void 0, false, {
                                fileName: "[project]/app/shop/ShopCatalog.tsx",
                                lineNumber: 303,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                        lineNumber: 296,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ProductStudioVisual$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProductStudioVisual"], {
                        product: product,
                        className: "mb-4 aspect-[4/5] rounded-[8px] border border-[color:color-mix(in_srgb,var(--accent)_16%,transparent)]",
                        fallbackClassName: "scale-[0.92]"
                    }, void 0, false, {
                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                        lineNumber: 307,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-baseline justify-between gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-[18px] font-semibold leading-tight text-[var(--text)] group-hover/product:text-[var(--accent-soft)] transition-colors",
                                        children: product.shortName
                                    }, void 0, false, {
                                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                                        lineNumber: 314,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-mono tabular text-[16px] font-semibold text-[var(--text)]",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(product.listPriceCents)
                                    }, void 0, false, {
                                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                                        lineNumber: 317,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/shop/ShopCatalog.tsx",
                                lineNumber: 313,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-subtle)]",
                                children: [
                                    product.sku,
                                    " · ",
                                    product.dose,
                                    " · ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPerMg"])(product.perMgCents)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/shop/ShopCatalog.tsx",
                                lineNumber: 321,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                        lineNumber: 312,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/shop/ShopCatalog.tsx",
                lineNumber: 291,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "px-4 pt-3 text-[13px] leading-[1.55] text-[var(--text-muted)] flex-1",
                children: product.shortDescription
            }, void 0, false, {
                fileName: "[project]/app/shop/ShopCatalog.tsx",
                lineNumber: 327,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 flex items-center justify-between gap-3 border-t border-[var(--border)] px-4 py-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent)]",
                        children: "In stock"
                    }, void 0, false, {
                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                        lineNumber: 332,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "primary",
                        size: "sm",
                        onClick: ()=>addLine({
                                sku: product.sku,
                                slug: product.slug,
                                name: product.name,
                                unitPriceCents: product.listPriceCents
                            }),
                        children: "Add to cart"
                    }, void 0, false, {
                        fileName: "[project]/app/shop/ShopCatalog.tsx",
                        lineNumber: 335,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/shop/ShopCatalog.tsx",
                lineNumber: 331,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/shop/ShopCatalog.tsx",
        lineNumber: 286,
        columnNumber: 5
    }, this);
}
_s1(ProductTile, "8X9RJ+wDFtuZdoduc5kGlsibijw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cart$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"]
    ];
});
_c1 = ProductTile;
var _c, _c1;
__turbopack_context__.k.register(_c, "ShopCatalog");
__turbopack_context__.k.register(_c1, "ProductTile");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# debugId=617129c3-0ddb-a8cc-b0cf-3de461990311
//# sourceMappingURL=_04z3bmy._.js.map