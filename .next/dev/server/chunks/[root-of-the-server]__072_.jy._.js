;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="7be8eb74-6fd3-aea1-f2a2-af94074aca76")}catch(e){}}();
module.exports = [
"[externals]/next/dist/build/adapter/setup-node-env.external.js [external] (next/dist/build/adapter/setup-node-env.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/build/adapter/setup-node-env.external.js", () => require("next/dist/build/adapter/setup-node-env.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/memory-cache.external.js [external] (next/dist/server/lib/incremental-cache/memory-cache.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/memory-cache.external.js", () => require("next/dist/server/lib/incremental-cache/memory-cache.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/shared-cache-controls.external.js [external] (next/dist/server/lib/incremental-cache/shared-cache-controls.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/shared-cache-controls.external.js", () => require("next/dist/server/lib/incremental-cache/shared-cache-controls.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/lib/age-verification.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AGE_GATE_GOODBYE_URL",
    ()=>AGE_GATE_GOODBYE_URL,
    "AGE_GATE_PATH",
    ()=>AGE_GATE_PATH,
    "AGE_VERIFICATION_COOKIE",
    ()=>AGE_VERIFICATION_COOKIE,
    "AGE_VERIFICATION_DAYS",
    ()=>AGE_VERIFICATION_DAYS,
    "AGE_VERIFICATION_MAX_AGE_SECONDS",
    ()=>AGE_VERIFICATION_MAX_AGE_SECONDS,
    "AGE_VERIFICATION_STORAGE_KEY",
    ()=>AGE_VERIFICATION_STORAGE_KEY,
    "isAgeVerificationCurrent",
    ()=>isAgeVerificationCurrent,
    "normalizeAgeGateNext",
    ()=>normalizeAgeGateNext
]);
const AGE_VERIFICATION_STORAGE_KEY = 'vcl_age_verified';
const AGE_VERIFICATION_COOKIE = 'vcl_age_verified';
const AGE_VERIFICATION_DAYS = 30;
const AGE_VERIFICATION_MAX_AGE_SECONDS = AGE_VERIFICATION_DAYS * 24 * 60 * 60;
const AGE_GATE_PATH = '/age-gate';
const AGE_GATE_GOODBYE_URL = 'https://www.google.com';
function isAgeVerificationCurrent(value) {
    if (!value) return false;
    const verifiedAt = Date.parse(value);
    if (!Number.isFinite(verifiedAt)) return false;
    const expiresAt = verifiedAt + AGE_VERIFICATION_MAX_AGE_SECONDS * 1000;
    return expiresAt > Date.now();
}
function normalizeAgeGateNext(value) {
    if (!value || !value.startsWith('/') || value.startsWith('//')) return '/';
    if (value.startsWith(AGE_GATE_PATH)) return '/';
    return value;
}
}),
"[project]/proxy.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "proxy",
    ()=>proxy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$age$2d$verification$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/age-verification.ts [middleware] (ecmascript)");
;
;
const PUBLIC_FILE = /\.(?:avif|css|gif|ico|jpg|jpeg|js|json|map|mp4|pdf|png|svg|txt|webp|xml)$/i;
function proxy(request) {
    const { pathname, search } = request.nextUrl;
    if (pathname === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$age$2d$verification$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["AGE_GATE_PATH"] || pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/favicon.ico' || PUBLIC_FILE.test(pathname)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    const verifiedAt = request.cookies.get(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$age$2d$verification$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["AGE_VERIFICATION_COOKIE"])?.value;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$age$2d$verification$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["isAgeVerificationCurrent"])(verifiedAt)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    const url = request.nextUrl.clone();
    url.pathname = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$age$2d$verification$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["AGE_GATE_PATH"];
    url.search = '';
    url.searchParams.set('next', `${pathname}${search}`);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
}
const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)'
    ]
};
}),
];

//# debugId=7be8eb74-6fd3-aea1-f2a2-af94074aca76
//# sourceMappingURL=%5Broot-of-the-server%5D__072_.jy._.js.map