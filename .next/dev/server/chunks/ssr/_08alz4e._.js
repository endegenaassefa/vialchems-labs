;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="f2ec1011-9d23-29fb-0048-b59a41ef97d8")}catch(e){}}();
module.exports = [
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
"[project]/app/error.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GlobalError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Button.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function GlobalError({ error, reset }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (("TURBOPACK compile-time value", "undefined") !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
            // Sentry instrumentation activates when DSN provided.
            void error;
        }
    }, [
        error
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        id: "main",
        className: "flex-1 flex items-center justify-center px-6 py-24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-xl text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-4",
                    children: "Error 500"
                }, void 0, false, {
                    fileName: "[project]/app/error.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-[clamp(40px,5.6vw,72px)] font-light leading-tight tracking-tight text-[var(--text)] mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "block",
                            children: "Something"
                        }, void 0, false, {
                            fileName: "[project]/app/error.tsx",
                            lineNumber: 28,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-serif-italic block text-[var(--accent-soft)]",
                            children: "went sideways."
                        }, void 0, false, {
                            fileName: "[project]/app/error.tsx",
                            lineNumber: 29,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/error.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-[16px] leading-[1.6] text-[var(--text-muted)] mb-8",
                    children: "A server-side issue interrupted your request. The error has been logged for review. You can retry the request, return to the catalog, or contact support if the issue persists."
                }, void 0, false, {
                    fileName: "[project]/app/error.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this),
                error.digest ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "font-mono text-[12px] text-[var(--text-subtle)] mb-8",
                    children: [
                        "Reference: ",
                        error.digest
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/error.tsx",
                    lineNumber: 36,
                    columnNumber: 11
                }, this) : null,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-3 flex-wrap justify-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "primary",
                            size: "md",
                            onClick: ()=>reset(),
                            children: "Try again"
                        }, void 0, false, {
                            fileName: "[project]/app/error.tsx",
                            lineNumber: 41,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buttonClassNames"])('outline', 'md'),
                            children: "Back to home"
                        }, void 0, false, {
                            fileName: "[project]/app/error.tsx",
                            lineNumber: 44,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/contact",
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buttonClassNames"])('outline', 'md'),
                            children: "Contact support"
                        }, void 0, false, {
                            fileName: "[project]/app/error.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/error.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/error.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/error.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
}),
];

//# debugId=f2ec1011-9d23-29fb-0048-b59a41ef97d8
//# sourceMappingURL=_08alz4e._.js.map