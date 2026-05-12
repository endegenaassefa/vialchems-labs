;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="cf07e455-fe83-4cf0-bd3b-586fff39e209")}catch(e){}}();
module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/consent-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Phase 10.6 (v4) — D14 cookie consent state.
 *
 * Iron Law 2.23 contract:
 *   - "necessary" category always on (auth + cart + CSRF cookies)
 *   - other categories opt-in by default (analytics + marketing + functional)
 *   - GPC signal honored (auto opt-out)
 *   - persisted via first-party cookie `vc-consent`
 *   - serialized as JSON (small + auditable)
 *
 * Iron Law 2.5 / 2.19: this file joins the protected paths list as
 * regulatory-artifact storage.
 */ __turbopack_context__.s([
    "CONSENT_CATEGORIES",
    ()=>CONSENT_CATEGORIES,
    "CONSENT_COOKIE",
    ()=>CONSENT_COOKIE,
    "STRICTLY_NECESSARY_CATEGORIES",
    ()=>STRICTLY_NECESSARY_CATEGORIES,
    "acceptAll",
    ()=>acceptAll,
    "applyGPCDefaults",
    ()=>applyGPCDefaults,
    "consentEnabled",
    ()=>consentEnabled,
    "customize",
    ()=>customize,
    "defaultConsent",
    ()=>defaultConsent,
    "detectGPC",
    ()=>detectGPC,
    "parseConsent",
    ()=>parseConsent,
    "rejectAll",
    ()=>rejectAll,
    "serializeConsent",
    ()=>serializeConsent
]);
const CONSENT_COOKIE = 'vc-consent';
const CONSENT_CATEGORIES = [
    'necessary',
    'functional',
    'analytics',
    'marketing'
];
const STRICTLY_NECESSARY_CATEGORIES = [
    'necessary'
];
const CURRENT_VERSION = 1;
function defaultConsent() {
    return {
        version: CURRENT_VERSION,
        decidedAt: null,
        categories: {
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false
        }
    };
}
function isStrictlyNecessary(cat) {
    return STRICTLY_NECESSARY_CATEGORIES.includes(cat);
}
function serializeConsent(state) {
    return JSON.stringify(state);
}
function parseConsent(raw) {
    if (!raw) return defaultConsent();
    try {
        const parsed = JSON.parse(raw);
        const fallback = defaultConsent();
        const categories = {
            necessary: true,
            functional: Boolean(parsed.categories?.functional),
            analytics: Boolean(parsed.categories?.analytics),
            marketing: Boolean(parsed.categories?.marketing)
        };
        return {
            version: typeof parsed.version === 'number' ? parsed.version : fallback.version,
            decidedAt: typeof parsed.decidedAt === 'string' ? parsed.decidedAt : null,
            categories
        };
    } catch  {
        return defaultConsent();
    }
}
function consentEnabled(state, category) {
    if (isStrictlyNecessary(category)) return true;
    return state.categories[category] === true;
}
function detectGPC(nav) {
    if (!nav) return false;
    return Boolean(nav.globalPrivacyControl);
}
function applyGPCDefaults(state) {
    return {
        ...state,
        decidedAt: new Date().toISOString(),
        categories: {
            necessary: true,
            functional: state.categories.functional,
            analytics: false,
            marketing: false
        }
    };
}
function acceptAll() {
    return {
        version: CURRENT_VERSION,
        decidedAt: new Date().toISOString(),
        categories: {
            necessary: true,
            functional: true,
            analytics: true,
            marketing: true
        }
    };
}
function rejectAll() {
    return {
        version: CURRENT_VERSION,
        decidedAt: new Date().toISOString(),
        categories: {
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false
        }
    };
}
function customize(input) {
    return {
        version: CURRENT_VERSION,
        decidedAt: new Date().toISOString(),
        categories: {
            necessary: true,
            functional: Boolean(input.functional),
            analytics: Boolean(input.analytics),
            marketing: Boolean(input.marketing)
        }
    };
}
}),
"[project]/components/CookieConsent.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CookieConsent",
    ()=>CookieConsent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * Phase 10.6 (v4) — D14 cookie consent banner.
 *
 * Self-hosted default per Iron Law 2.23. Renders nothing until the
 * client mounts (cookie can't be read on the server in a streaming
 * RSC), then either:
 *   - exits silently if the user already decided (decidedAt set),
 *   - exits silently after auto-applying GPC defaults if navigator
 *     reports globalPrivacyControl=true,
 *   - else shows the banner.
 *
 * Three primary actions: Accept all / Customize / Reject all. Customize
 * opens an in-place panel (no Dialog primitive — bottom-anchored bar
 * stays visible to keep cookie context intact) with one toggle per
 * non-necessary category.
 *
 * Iron Law 2.5 / 2.19: integration code joins the protected paths list
 * as regulatory artifact.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$consent$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/consent-store.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const COOKIE_MAX_AGE_DAYS = 365;
function readCookie(name) {
    if (typeof document === 'undefined') return null;
    const target = `${name}=`;
    for (const part of document.cookie.split(';')){
        const trimmed = part.trim();
        if (trimmed.startsWith(target)) {
            return decodeURIComponent(trimmed.slice(target.length));
        }
    }
    return null;
}
function writeCookie(name, value) {
    if (typeof document === 'undefined') return;
    const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
    const secure = typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}
function CookieConsent() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$consent$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultConsent"])());
    const [customizing, setCustomizing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Client-only: cookie + navigator are unavailable during SSR, so the
        // mounted/state flip in this effect is the correct shape (Iron Law
        // 2.23 — banner must reflect the user's actual decision, not a
        // pre-decided server snapshot). Disable the linter heuristic on the
        // setState calls here for the same reason as RecoveryStackSheen.
        /* eslint-disable react-hooks/set-state-in-effect */ setMounted(true);
        const raw = readCookie(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$consent$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONSENT_COOKIE"]);
        let next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$consent$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseConsent"])(raw);
        if (next.decidedAt === null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$consent$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["detectGPC"])(navigator)) {
            next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$consent$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyGPCDefaults"])(next);
            writeCookie(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$consent$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONSENT_COOKIE"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$consent$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serializeConsent"])(next));
        }
        setState(next);
    /* eslint-enable react-hooks/set-state-in-effect */ }, []);
    function commit(next) {
        setState(next);
        writeCookie(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$consent$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONSENT_COOKIE"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$consent$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serializeConsent"])(next));
        setCustomizing(false);
    }
    if (!mounted) return null;
    if (pathname === '/age-gate') return null;
    if (state.decidedAt) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "region",
        "aria-label": "Cookie consent",
        className: "fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border-strong)] bg-[var(--surface-elevated)]/95 backdrop-blur-md shadow-[var(--shadow-xl)]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto max-w-6xl px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-[14px] leading-[1.55] text-[var(--text-muted)] max-w-3xl",
                        children: [
                            "We use strictly-necessary cookies for cart, checkout, and security. Optional categories (analytics, functional, marketing) are off by default and only enabled if you accept. See our",
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "/legal/cookies",
                                className: "text-[var(--accent)] hover:text-[var(--accent-soft)] underline underline-offset-2",
                                children: "Cookie Policy"
                            }, void 0, false, {
                                fileName: "[project]/components/CookieConsent.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this),
                            "."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CookieConsent.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>commit((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$consent$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rejectAll"])()),
                                className: "font-mono text-[12px] uppercase tracking-[0.14em] px-4 h-10 border border-[var(--border-strong)] rounded-[var(--radius-md)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-colors",
                                children: "Reject all"
                            }, void 0, false, {
                                fileName: "[project]/components/CookieConsent.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setCustomizing((c)=>!c),
                                className: "font-mono text-[12px] uppercase tracking-[0.14em] px-4 h-10 border border-[var(--border-strong)] rounded-[var(--radius-md)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-colors",
                                "aria-expanded": customizing,
                                "aria-controls": "cookie-consent-customize",
                                children: "Customize"
                            }, void 0, false, {
                                fileName: "[project]/components/CookieConsent.tsx",
                                lineNumber: 123,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>commit((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$consent$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["acceptAll"])()),
                                className: "font-mono text-[12px] uppercase tracking-[0.14em] px-4 h-10 bg-[var(--accent)] text-[var(--text-on-accent)] rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors",
                                children: "Accept all"
                            }, void 0, false, {
                                fileName: "[project]/components/CookieConsent.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CookieConsent.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/CookieConsent.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            customizing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CustomizePanel, {
                onCommit: commit
            }, void 0, false, {
                fileName: "[project]/components/CookieConsent.tsx",
                lineNumber: 141,
                columnNumber: 22
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/CookieConsent.tsx",
        lineNumber: 97,
        columnNumber: 5
    }, this);
}
function CustomizePanel({ onCommit }) {
    const [functional, setFunctional] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [analytics, setAnalytics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [marketing, setMarketing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        id: "cookie-consent-customize",
        className: "border-t border-[var(--border-strong)]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto max-w-6xl px-6 py-5 grid gap-3 md:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ConsentRow, {
                        label: "Strictly necessary",
                        description: "Auth, cart, checkout, CSRF. Always on — required to operate the site.",
                        locked: true,
                        checked: true
                    }, void 0, false, {
                        fileName: "[project]/components/CookieConsent.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ConsentRow, {
                        label: "Functional",
                        description: "Remember preferences (theme, last-used filters).",
                        checked: functional,
                        onChange: setFunctional
                    }, void 0, false, {
                        fileName: "[project]/components/CookieConsent.tsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ConsentRow, {
                        label: "Analytics",
                        description: "Aggregated usage telemetry — page-views, error rates. No marketing trackers.",
                        checked: analytics,
                        onChange: setAnalytics
                    }, void 0, false, {
                        fileName: "[project]/components/CookieConsent.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ConsentRow, {
                        label: "Marketing",
                        description: "Off by default. vialchemlabs runs no third-party advertising trackers Day-1.",
                        checked: marketing,
                        onChange: setMarketing
                    }, void 0, false, {
                        fileName: "[project]/components/CookieConsent.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/CookieConsent.tsx",
                lineNumber: 160,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto max-w-6xl px-6 pb-5 flex justify-end",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: ()=>onCommit((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$consent$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customize"])({
                            functional,
                            analytics,
                            marketing
                        })),
                    className: "font-mono text-[12px] uppercase tracking-[0.14em] px-4 h-10 bg-[var(--accent)] text-[var(--text-on-accent)] rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors",
                    children: "Save preferences"
                }, void 0, false, {
                    fileName: "[project]/components/CookieConsent.tsx",
                    lineNumber: 187,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/CookieConsent.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/CookieConsent.tsx",
        lineNumber: 156,
        columnNumber: 5
    }, this);
}
function ConsentRow({ label, description, locked, checked, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "flex items-start gap-4 text-[14px] leading-[1.5]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "checkbox",
                className: "mt-1 h-4 w-4 accent-[var(--accent)]",
                checked: checked,
                disabled: locked,
                onChange: (e)=>onChange?.(e.target.checked),
                "aria-disabled": locked || undefined
            }, void 0, false, {
                fileName: "[project]/components/CookieConsent.tsx",
                lineNumber: 216,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium text-[var(--text)]",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/components/CookieConsent.tsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "block text-[13px] text-[var(--text-muted)]",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/components/CookieConsent.tsx",
                        lineNumber: 226,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/CookieConsent.tsx",
                lineNumber: 224,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/CookieConsent.tsx",
        lineNumber: 215,
        columnNumber: 5
    }, this);
}
}),
];

//# debugId=cf07e455-fe83-4cf0-bd3b-586fff39e209
//# sourceMappingURL=%5Broot-of-the-server%5D__13gl31i._.js.map