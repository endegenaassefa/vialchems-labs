;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="15ecad30-dd02-3669-ec21-4bd1af0490ab")}catch(e){}}();
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
]);

//# debugId=15ecad30-dd02-3669-ec21-4bd1af0490ab
//# sourceMappingURL=_0x0-vdl._.js.map