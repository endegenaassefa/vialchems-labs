;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="4281690e-3a98-9308-394a-775cf986022d")}catch(e){}}();
module.exports = [
"[project]/lib/content/site.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/app/opengraph-image.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "alt",
    ()=>alt,
    "contentType",
    ()=>contentType,
    "default",
    ()=>Image,
    "size",
    ()=>size
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
/**
 * Phase 9 (v4) — default OpenGraph image, served at /opengraph-image.
 *
 * Posture A: charcoal bg + teal accent rule + IBM Plex-style wordmark
 * fallback (system font; next/og rasterizes a static SVG-equivalent).
 * No external font fetches — keeps image generation fast and
 * deterministic so build time stays predictable.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$og$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/og.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/content/site.ts [app-rsc] (ecmascript)");
;
;
;
const alt = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["siteConfig"].name} — ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["siteConfig"].tagline}`;
const size = {
    width: 1200,
    height: 630
};
const contentType = 'image/png';
function Image() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$og$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ImageResponse"](/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: '100%',
            height: '100%',
            background: '#0a0e0f',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px 72px',
            color: 'rgba(255,255,255,0.92)',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    fontSize: '20px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#3dd4c8'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '12px',
                            height: '12px',
                            background: '#3dd4c8'
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/opengraph-image.tsx",
                        lineNumber: 43,
                        columnNumber: 11
                    }, this),
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["siteConfig"].name
                ]
            }, void 0, true, {
                fileName: "[project]/app/opengraph-image.tsx",
                lineNumber: 32,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '88px',
                            fontWeight: 300,
                            lineHeight: 1.04,
                            letterSpacing: '-0.01em',
                            maxWidth: '900px'
                        },
                        children: "Counted, weighed,"
                    }, void 0, false, {
                        fileName: "[project]/app/opengraph-image.tsx",
                        lineNumber: 54,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '88px',
                            fontWeight: 300,
                            fontStyle: 'italic',
                            lineHeight: 1.04,
                            letterSpacing: '-0.01em',
                            color: '#5eebdf'
                        },
                        children: "verified."
                    }, void 0, false, {
                        fileName: "[project]/app/opengraph-image.tsx",
                        lineNumber: 65,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/opengraph-image.tsx",
                lineNumber: 53,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '18px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.62)',
                    fontFamily: 'ui-monospace, Menlo, monospace'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Independent third-party COA"
                    }, void 0, false, {
                        fileName: "[project]/app/opengraph-image.tsx",
                        lineNumber: 90,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Research use only"
                    }, void 0, false, {
                        fileName: "[project]/app/opengraph-image.tsx",
                        lineNumber: 91,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/opengraph-image.tsx",
                lineNumber: 79,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/opengraph-image.tsx",
        lineNumber: 19,
        columnNumber: 7
    }, this), {
        ...size
    });
}
}),
"[project]/app/opengraph-image--metadata.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$opengraph$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/opengraph-image.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$lib$2f$metadata$2f$get$2d$metadata$2d$route$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/lib/metadata/get-metadata-route.js [app-rsc] (ecmascript)");
;
;
const imageModule = {
    alt: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$opengraph$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["alt"],
    contentType: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$opengraph$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["contentType"],
    size: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$opengraph$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["size"]
};
async function __TURBOPACK__default__export__(props) {
    const { __metadata_id__: _, ...params } = await props.params;
    const imageUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$lib$2f$metadata$2f$get$2d$metadata$2d$route$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fillMetadataSegment"])("/", params, "opengraph-image", false);
    function getImageMetadata(imageMetadata, idParam) {
        const data = {
            alt: imageMetadata.alt,
            type: imageMetadata.contentType || 'image/png',
            url: imageUrl + (idParam ? '/' + idParam : '') + '?' + "7caf038cd2d1bf4f"
        };
        const { size } = imageMetadata;
        if (size) {
            data.width = size.width;
            data.height = size.height;
        }
        return data;
    }
    return [
        getImageMetadata(imageModule, '')
    ];
}
}),
"[project]/app/opengraph-image--metadata.js [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/opengraph-image--metadata.js [app-rsc] (ecmascript)"));
}),
];

//# debugId=4281690e-3a98-9308-394a-775cf986022d
//# sourceMappingURL=_02--iqk._.js.map