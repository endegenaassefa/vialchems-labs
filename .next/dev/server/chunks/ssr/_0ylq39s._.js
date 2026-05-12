;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="e901232d-0c54-bbdd-b0e0-b7025952bc69")}catch(e){}}();
module.exports = [
"[project]/lib/age-verification.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/components/age-gate/DnaHelixScene.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DnaHelixScene",
    ()=>DnaHelixScene
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
function prefersReducedMotion() {
    if ("TURBOPACK compile-time truthy", 1) return true;
    //TURBOPACK unreachable
    ;
}
function DnaHelixScene() {
    const hostRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let frame = 0;
        let disposed = false;
        let cleanup = ()=>{};
        async function start() {
            const host = hostRef.current;
            if (!host) return;
            const THREE = await __turbopack_context__.A("[project]/node_modules/three/build/three.module.js [app-ssr] (ecmascript, async loader)");
            if (disposed || !hostRef.current) return;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
            camera.position.set(0, 0, 9);
            const renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true,
                powerPreference: 'low-power'
            });
            renderer.setClearColor(0x000000, 0);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
            host.appendChild(renderer.domElement);
            const group = new THREE.Group();
            scene.add(group);
            const isMobile = window.innerWidth < 640;
            const pointCount = isMobile ? 112 : 176;
            const turns = 4.8;
            const radius = 1.28;
            const height = 7.7;
            const strandA = [];
            const strandB = [];
            const barSegments = [];
            for(let i = 0; i < pointCount; i += 1){
                const t = i / (pointCount - 1);
                const angle = t * Math.PI * 2 * turns;
                const y = (t - 0.5) * height;
                const x1 = Math.cos(angle) * radius;
                const z1 = Math.sin(angle) * radius;
                const x2 = Math.cos(angle + Math.PI) * radius;
                const z2 = Math.sin(angle + Math.PI) * radius;
                strandA.push(x1, y, z1);
                strandB.push(x2, y, z2);
                if (i % 8 === 0) {
                    barSegments.push(x1, y, z1, x2, y, z2);
                }
            }
            const pointGeometry = new THREE.BufferGeometry();
            pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
                ...strandA,
                ...strandB
            ], 3));
            const pointMaterial = new THREE.PointsMaterial({
                color: 0x74c0fc,
                size: isMobile ? 0.045 : 0.04,
                transparent: true,
                opacity: 0.46,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });
            group.add(new THREE.Points(pointGeometry, pointMaterial));
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x4dabf7,
                transparent: true,
                opacity: 0.18,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const makeLine = (points)=>{
                const geometry = new THREE.BufferGeometry();
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
                return new THREE.Line(geometry, lineMaterial);
            };
            group.add(makeLine(strandA));
            group.add(makeLine(strandB));
            const barsGeometry = new THREE.BufferGeometry();
            barsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(barSegments, 3));
            group.add(new THREE.LineSegments(barsGeometry, lineMaterial));
            function resize() {
                if (!hostRef.current) return;
                const rect = hostRef.current.getBoundingClientRect();
                renderer.setSize(rect.width, rect.height, false);
                camera.aspect = rect.width / Math.max(rect.height, 1);
                camera.updateProjectionMatrix();
            }
            resize();
            window.addEventListener('resize', resize);
            const reduceMotion = prefersReducedMotion();
            let previous = performance.now();
            function animate(now) {
                if (disposed) return;
                const delta = Math.min(now - previous, 50) / 1000;
                previous = now;
                if (!reduceMotion) {
                    group.rotation.y += delta * (Math.PI * 2 / 40);
                    group.rotation.x = Math.sin(now / 9000) * 0.06;
                }
                renderer.render(scene, camera);
                frame = window.requestAnimationFrame(animate);
            }
            frame = window.requestAnimationFrame(animate);
            cleanup = ()=>{
                window.cancelAnimationFrame(frame);
                window.removeEventListener('resize', resize);
                pointGeometry.dispose();
                pointMaterial.dispose();
                lineMaterial.dispose();
                barsGeometry.dispose();
                renderer.dispose();
                renderer.domElement.remove();
            };
        }
        start();
        return ()=>{
            disposed = true;
            cleanup();
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: hostRef,
        "aria-hidden": "true",
        className: "pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[70vh] w-[70vh] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 opacity-[0.16] max-sm:h-[50vh] max-sm:w-[50vh]"
    }, void 0, false, {
        fileName: "[project]/components/age-gate/DnaHelixScene.tsx",
        lineNumber: 160,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/age-gate/ParticleFormulaField.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ParticleFormulaField",
    ()=>ParticleFormulaField
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const FORMULAS = [
    'NH₂',
    'OH',
    '—COOH',
    'H₂N—',
    'C₅H₁₁NO₂S',
    'C₁₆H₂₈N₄O₆',
    'CO—NH'
];
function prefersReducedMotion() {
    if ("TURBOPACK compile-time truthy", 1) return true;
    //TURBOPACK unreachable
    ;
}
function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}
function ParticleFormulaField() {
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d', {
            alpha: true
        });
        if (!context) return;
        const ctx = context;
        const surface = canvas;
        let frame = 0;
        let width = 0;
        let height = 0;
        let dpr = 1;
        let particles = [];
        let formulas = [];
        const reduceMotion = prefersReducedMotion();
        const mouse = {
            x: 0,
            y: 0
        };
        function makeParticle() {
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                z: randomBetween(0.35, 1),
                size: randomBetween(1, 3),
                speed: randomBetween(4, 14),
                sway: randomBetween(6, 22),
                phase: randomBetween(0, Math.PI * 2),
                opacity: randomBetween(0.2, 0.7)
            };
        }
        function makeFormula(initial = false) {
            return {
                text: FORMULAS[Math.floor(Math.random() * FORMULAS.length)] ?? 'NH₂',
                x: randomBetween(-40, width + 40),
                y: initial ? randomBetween(0, height) : height + randomBetween(20, 120),
                size: randomBetween(12, width < 640 ? 26 : 40),
                speed: randomBetween(2, 7),
                opacity: randomBetween(0.06, 0.1),
                mono: Math.random() > 0.45
            };
        }
        function resize() {
            const rect = surface.getBoundingClientRect();
            width = Math.max(1, rect.width);
            height = Math.max(1, rect.height);
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            surface.width = Math.floor(width * dpr);
            surface.height = Math.floor(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const particleCount = width < 640 ? 44 : 108;
            const formulaCount = width < 640 ? 8 : 14;
            particles = Array.from({
                length: particleCount
            }, makeParticle);
            formulas = Array.from({
                length: formulaCount
            }, ()=>makeFormula(true));
        }
        function draw(now) {
            ctx.clearRect(0, 0, width, height);
            const parallaxX = mouse.x * 15;
            const parallaxY = mouse.y * 8;
            for (const particle of particles){
                if (!reduceMotion) {
                    particle.y -= particle.speed / 60;
                    if (particle.y < -16) {
                        particle.y = height + 16;
                        particle.x = Math.random() * width;
                    }
                }
                const x = particle.x + Math.sin(now / 2400 + particle.phase) * particle.sway + parallaxX * particle.z;
                const y = particle.y + parallaxY * particle.z;
                const radius = particle.size * particle.z;
                const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 4);
                glow.addColorStop(0, `rgba(116, 192, 252, ${particle.opacity})`);
                glow.addColorStop(1, 'rgba(116, 192, 252, 0)');
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(x, y, radius * 4, 0, Math.PI * 2);
                ctx.fill();
            }
            for (const formula of formulas){
                if (!reduceMotion) {
                    formula.y -= formula.speed / 60;
                    if (formula.y < -60) Object.assign(formula, makeFormula(false));
                }
                ctx.save();
                ctx.globalAlpha = formula.opacity;
                ctx.fillStyle = '#74c0fc';
                ctx.font = `${formula.size}px ${formula.mono ? 'var(--font-mono), ui-monospace, monospace' : 'var(--font-sans), ui-sans-serif, system-ui'}`;
                ctx.translate(formula.x + parallaxX * 0.42, formula.y + parallaxY * 0.35);
                ctx.rotate(Math.sin(now / 7000 + formula.x) * 0.12);
                ctx.fillText(formula.text, 0, 0);
                ctx.restore();
            }
            if (!reduceMotion) {
                frame = window.requestAnimationFrame(draw);
            }
        }
        function onPointerMove(event) {
            mouse.x = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
            mouse.y = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
        }
        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('pointermove', onPointerMove, {
            passive: true
        });
        frame = window.requestAnimationFrame(draw);
        return ()=>{
            window.cancelAnimationFrame(frame);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', onPointerMove);
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef,
        "aria-hidden": "true",
        className: "pointer-events-none absolute inset-0 z-[2] h-full w-full"
    }, void 0, false, {
        fileName: "[project]/components/age-gate/ParticleFormulaField.tsx",
        lineNumber: 173,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/age-gate/useAgeVerification.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearAgeVerification",
    ()=>clearAgeVerification,
    "hasCurrentAgeVerification",
    ()=>hasCurrentAgeVerification,
    "persistAgeVerification",
    ()=>persistAgeVerification,
    "readAgeVerification",
    ()=>readAgeVerification
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$age$2d$verification$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/age-verification.ts [app-ssr] (ecmascript)");
'use client';
;
function secureCookieSuffix() {
    if (typeof location === 'undefined') return '';
    return location.protocol === 'https:' ? '; Secure' : '';
}
function readAgeVerification() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function hasCurrentAgeVerification() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$age$2d$verification$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isAgeVerificationCurrent"])(readAgeVerification());
}
function persistAgeVerification(value = new Date().toISOString()) {
    if (typeof document === 'undefined') return value;
    try {
        window.localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$age$2d$verification$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AGE_VERIFICATION_STORAGE_KEY"], value);
    } catch  {
    /* Storage can fail in private browsing; the cookie remains authoritative. */ }
    document.cookie = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$age$2d$verification$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AGE_VERIFICATION_COOKIE"]}=${encodeURIComponent(value)}; Max-Age=${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$age$2d$verification$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AGE_VERIFICATION_MAX_AGE_SECONDS"]}; Path=/; SameSite=Lax${secureCookieSuffix()}`;
    return value;
}
function clearAgeVerification() {
    if (typeof document === 'undefined') return;
    try {
        window.localStorage.removeItem(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$age$2d$verification$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AGE_VERIFICATION_STORAGE_KEY"]);
    } catch  {
    /* ignore */ }
    document.cookie = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$age$2d$verification$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AGE_VERIFICATION_COOKIE"]}=; Max-Age=0; Path=/; SameSite=Lax${secureCookieSuffix()}`;
}
}),
"[project]/components/age-gate/AgeGateClient.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AgeGateClient",
    ()=>AgeGateClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FlaskConical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/flask-conical.mjs [app-ssr] (ecmascript) <export default as FlaskConical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$age$2d$verification$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/age-verification.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$age$2d$gate$2f$DnaHelixScene$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/age-gate/DnaHelixScene.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$age$2d$gate$2f$ParticleFormulaField$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/age-gate/ParticleFormulaField.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$age$2d$gate$2f$useAgeVerification$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/age-gate/useAgeVerification.ts [app-ssr] (ecmascript)");
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
const HEADLINE = 'RESEARCH-GRADE PEPTIDES';
const HEADLINE_WORDS = (()=>{
    let start = 0;
    return HEADLINE.split(' ').map((word)=>{
        const value = {
            word,
            start
        };
        start += word.length + 1;
        return value;
    });
})();
const REQUIREMENTS = [
    'You are 21 years of age or older',
    'For research purposes only',
    'Not for human consumption',
    'You agree to Terms and Privacy Policy'
];
function AgeGateClient() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [exiting, setExiting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const nextPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$age$2d$verification$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeAgeGateNext"])(searchParams.get('next')), [
        searchParams
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$age$2d$gate$2f$useAgeVerification$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasCurrentAgeVerification"])()) return;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$age$2d$gate$2f$useAgeVerification$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persistAgeVerification"])();
        router.replace(nextPath);
    }, [
        nextPath,
        router
    ]);
    function enterSite() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$age$2d$gate$2f$useAgeVerification$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persistAgeVerification"])();
        setExiting(true);
        window.setTimeout(()=>{
            router.replace(nextPath);
        }, 600);
    }
    function exitSite() {
        const confirmed = window.confirm('You will be redirected away from this site.');
        if (!confirmed) return;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$age$2d$gate$2f$useAgeVerification$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAgeVerification"])();
        window.location.replace(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$age$2d$verification$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AGE_GATE_GOODBYE_URL"]);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        id: "main",
        className: `age-gate-root ${exiting ? 'age-gate-exiting' : ''}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$age$2d$gate$2f$DnaHelixScene$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DnaHelixScene"], {}, void 0, false, {
                fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$age$2d$gate$2f$ParticleFormulaField$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ParticleFormulaField"], {}, void 0, false, {
                fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "age-gate-content",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    "aria-labelledby": "age-gate-title",
                    className: "mx-auto flex w-full max-w-[720px] flex-col items-center text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "age-gate-logo mb-7 inline-flex flex-col items-center gap-3 max-sm:mb-4 max-sm:gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    "aria-hidden": "true",
                                    className: "grid h-12 w-12 place-items-center rounded-full border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.045)] text-[var(--accent-hover)] shadow-[0_0_34px_rgba(77,171,247,0.24)] backdrop-blur-md max-sm:h-10 max-sm:w-10",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FlaskConical$3e$__["FlaskConical"], {
                                        size: 22,
                                        strokeWidth: 1.6
                                    }, void 0, false, {
                                        fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                                        lineNumber: 88,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                                    lineNumber: 84,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-display text-[19px] font-semibold tracking-[0.22em] text-[var(--text-primary)] max-sm:text-[16px]",
                                    children: "vialchemlabs"
                                }, void 0, false, {
                                    fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                                    lineNumber: 90,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                            lineNumber: 83,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            id: "age-gate-title",
                            className: "font-display max-w-[980px] text-[clamp(28px,6vw,62px)] font-semibold leading-[0.98] tracking-[0.08em] text-[var(--text-primary)] max-sm:text-[clamp(23px,6.1vw,40px)] max-sm:tracking-[0.04em]",
                            children: HEADLINE_WORDS.map(({ word, start }, wordIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "inline-block whitespace-nowrap",
                                    children: [
                                        word.split('').map((letter, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "age-gate-letter",
                                                style: {
                                                    animationDelay: `${700 + (start + index) * 30}ms`
                                                },
                                                children: letter
                                            }, `${word}-${index}`, false, {
                                                fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                                                lineNumber: 102,
                                                columnNumber: 19
                                            }, this)),
                                        wordIndex < HEADLINE_WORDS.length - 1 ? '\u00A0' : null
                                    ]
                                }, word, true, {
                                    fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                                    lineNumber: 100,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                            lineNumber: 95,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "age-gate-subtitle mt-4 text-[16px] font-medium tracking-[0.04em] text-[var(--text-secondary)] max-sm:mt-3 max-sm:text-[14px]",
                            children: "For laboratory use only"
                        }, void 0, false, {
                            fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                            lineNumber: 115,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "age-gate-card mt-8 w-full max-w-[560px] px-6 py-6 text-left max-sm:mt-5 max-sm:px-4 max-sm:py-4 sm:px-7",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[15px] leading-[1.65] text-[var(--text-secondary)] max-sm:text-[13px] max-sm:leading-[1.5]",
                                    children: "This site contains products intended exclusively for qualified laboratory research use. Entry requires confirmation of the following conditions."
                                }, void 0, false, {
                                    fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                                    lineNumber: 120,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "mt-5 space-y-3 text-[14px] leading-[1.5] text-[var(--text-secondary)] max-sm:mt-3 max-sm:space-y-2 max-sm:text-[12px]",
                                    children: REQUIREMENTS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "flex gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    "aria-hidden": "true",
                                                    className: "mt-[0.58em] h-1.5 w-1.5 flex-none rounded-full bg-[var(--accent)] shadow-[0_0_12px_rgba(77,171,247,0.65)]"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                                                    lineNumber: 128,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: item
                                                }, void 0, false, {
                                                    fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                                                    lineNumber: 132,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, item, true, {
                                            fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                                            lineNumber: 127,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                                    lineNumber: 125,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                            lineNumber: 119,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-8 flex w-full flex-col items-center justify-center gap-3 max-sm:mt-5 sm:w-auto sm:flex-row",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    "aria-label": "Confirm you are 21 or older and enter the site",
                                    onClick: enterSite,
                                    className: "age-gate-primary min-h-11 w-full rounded-full bg-[linear-gradient(135deg,#1971c2,#4dabf7)] px-9 py-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--text-on-accent)] transition-[transform,box-shadow] duration-200 max-sm:py-3 max-sm:text-[12px] sm:w-auto",
                                    children: "I am 21+ — Enter"
                                }, void 0, false, {
                                    fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                                    lineNumber: 139,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    "aria-label": "You are under 21, exit the site",
                                    onClick: exitSite,
                                    className: "age-gate-secondary min-h-11 w-full rounded-full border border-[rgba(255,255,255,0.20)] bg-transparent px-9 py-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)] transition-colors duration-200 hover:border-[rgba(224,49,49,0.60)] hover:text-[var(--text-primary)] max-sm:py-3 max-sm:text-[12px] sm:w-auto",
                                    children: "I am under 21 — Exit"
                                }, void 0, false, {
                                    fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                                    lineNumber: 147,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                            lineNumber: 138,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                            className: "age-gate-footer mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[12px] text-[var(--text-muted)] max-sm:mt-4 max-sm:text-[11px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        "© ",
                                        new Date().getFullYear(),
                                        " vialchemlabs"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                                    lineNumber: 158,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    "aria-hidden": "true",
                                    children: "·"
                                }, void 0, false, {
                                    fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                                    lineNumber: 159,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/legal/terms",
                                    className: "hover:text-[var(--accent-hover)]",
                                    children: "Terms"
                                }, void 0, false, {
                                    fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                                    lineNumber: 160,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    "aria-hidden": "true",
                                    children: "·"
                                }, void 0, false, {
                                    fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                                    lineNumber: 163,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/legal/privacy",
                                    className: "hover:text-[var(--accent-hover)]",
                                    children: "Privacy"
                                }, void 0, false, {
                                    fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                                    lineNumber: 164,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                            lineNumber: 157,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/age-gate/AgeGateClient.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/age-gate/AgeGateClient.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
}),
];

//# debugId=e901232d-0c54-bbdd-b0e0-b7025952bc69
//# sourceMappingURL=_0ylq39s._.js.map