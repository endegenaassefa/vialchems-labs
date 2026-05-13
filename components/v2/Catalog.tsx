"use client";

import Fuse from "fuse.js";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  catalogFamilyOrder,
  catalogItems,
  displayPrice,
  skuCode,
} from "./data";
import { Icon } from "./icons";
import { V2Footer, V2Header } from "./Shell";
import { ProductVisual, Reveal } from "./Visuals";

type CatalogSearchRow = {
  item: (typeof catalogItems)[number];
  name: string;
  shortName: string;
  sku: string;
  code: string;
  family: string;
  dose: string;
  description: string;
  marketRange: string;
  constituents: string;
  searchText: string;
  compactText: string;
};

function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function compactSearch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function searchCatalogRows(
  activeQuery: string,
  searchRows: CatalogSearchRow[],
  fuse: Fuse<CatalogSearchRow>,
) {
  if (!activeQuery) return catalogItems;

  const normalizedQuery = normalizeSearch(activeQuery);
  const compactQuery = compactSearch(activeQuery);
  const exactRows = searchRows.filter(
    (row) =>
      row.searchText.includes(normalizedQuery) ||
      (compactQuery.length >= 2 && row.compactText.includes(compactQuery)),
  );
  if (exactRows.length > 0) {
    return exactRows.map((row) => row.item);
  }

  const fuzzyRows = fuse.search(activeQuery).map((result) => result.item);
  const seen = new Set<string>();

  return fuzzyRows
    .filter((row) => {
      if (seen.has(row.item.slug)) return false;
      seen.add(row.item.slug);
      return true;
    })
    .map((row) => row.item);
}

export function V2Catalog() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [families, setFamilies] = useState<Record<string, boolean>>({});
  const [showRestricted, setShowRestricted] = useState(true);
  const [inStock, setInStock] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("Newest");
  const activeQuery = deferredQuery.trim();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q") ?? "";
    const shouldFocus =
      params.get("focus") === "search" || Boolean(initialQuery);
    if (initialQuery || shouldFocus) {
      window.requestAnimationFrame(() => {
        if (initialQuery) setQuery(initialQuery);
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      });
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trimmed = query.trim();
    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }
    params.delete("focus");
    const search = params.toString();
    const nextUrl = `${window.location.pathname}${search ? `?${search}` : ""}`;
    window.history.replaceState(null, "", nextUrl);
  }, [query]);

  const allFamilies = useMemo(() => {
    const available = new Set(catalogItems.map((item) => item.family));
    const ordered = catalogFamilyOrder.filter((family) =>
      available.has(family),
    );
    const extras = [...available].filter(
      (family) =>
        !catalogFamilyOrder.includes(
          family as (typeof catalogFamilyOrder)[number],
        ),
    );
    return [...ordered, ...extras];
  }, []);

  const searchRows = useMemo<CatalogSearchRow[]>(
    () =>
      catalogItems.map((item) => {
        const code = skuCode(item.sku);
        const constituents =
          item.kind === "bundle" ? item.source.constituents.join(" ") : "";
        const searchText = [
          item.name,
          item.shortName,
          item.sku,
          code,
          item.family,
          item.dose,
          item.description,
          item.marketRange,
          constituents,
        ].join(" ");

        return {
          item,
          name: item.name,
          shortName: item.shortName,
          sku: item.sku,
          code,
          family: item.family,
          dose: item.dose,
          description: item.description,
          marketRange: item.marketRange,
          constituents,
          searchText: normalizeSearch(searchText),
          compactText: compactSearch(searchText),
        };
      }),
    [],
  );

  const fuse = useMemo(
    () =>
      new Fuse(searchRows, {
        includeScore: true,
        ignoreLocation: true,
        minMatchCharLength: 1,
        threshold: 0.34,
        keys: [
          { name: "shortName", weight: 0.28 },
          { name: "name", weight: 0.24 },
          { name: "sku", weight: 0.18 },
          { name: "code", weight: 0.16 },
          { name: "family", weight: 0.14 },
          { name: "constituents", weight: 0.1 },
          { name: "dose", weight: 0.08 },
          { name: "description", weight: 0.07 },
          { name: "marketRange", weight: 0.04 },
        ],
      }),
    [searchRows],
  );

  const searched = searchCatalogRows(activeQuery, searchRows, fuse);

  const filtered = useMemo(() => {
    const filteredByControls = searched.filter((item) => {
      const anyFamily = Object.values(families).some(Boolean);
      if (anyFamily && !families[item.family]) return false;
      if (!showRestricted && item.restricted) return false;
      if (inStock && item.stock === 0) return false;
      return true;
    });

    return [...filteredByControls].sort((a, b) => {
      if (sort === "Price ↑") return a.priceCents - b.priceCents;
      if (sort === "Price ↓") return b.priceCents - a.priceCents;
      if (sort === "Mass") return a.dose.localeCompare(b.dose);
      return 0;
    });
  }, [families, inStock, searched, showRestricted, sort]);

  return (
    <>
      <V2Header />
      <main id="main">
        <div className="catalog-hero">
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              · Catalog
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              <div>
                <h1 style={{ fontSize: 36, marginBottom: 8 }}>
                  Research materials
                </h1>
                <p style={{ fontSize: 14, color: "var(--fg-muted)" }}>
                  {filtered.length} of {catalogItems.length} products · all
                  research use only · batch-traceable
                </p>
                <div className="trust-strip" aria-label="Catalog assurances">
                  <span className="trust-chip">
                    <span className="badge-dot" />
                    COA-linked lots
                  </span>
                  <span className="trust-chip">
                    <span className="badge-dot" />
                    Cold-chain packaging
                  </span>
                  <span className="trust-chip">
                    <span className="badge-dot" />
                    RUO documentation
                  </span>
                  <span className="trust-chip">
                    <span className="badge-dot" />
                    Verified dispatch
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ position: "relative", width: 360 }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--fg-muted)",
                    }}
                  >
                    <Icon.search size={14} strokeWidth={1.5} />
                  </span>
                  <input
                    ref={searchInputRef}
                    className="input mono"
                    aria-label="Search catalog"
                    placeholder="Search product, sequence, formula, lot..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        setQuery("");
                        searchInputRef.current?.focus();
                      }
                    }}
                    style={{ paddingLeft: 36, paddingRight: query ? 72 : 12 }}
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        searchInputRef.current?.focus();
                      }}
                      className="btn btn-link"
                      style={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: 11,
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
            {activeQuery && (
              <div
                className="mono"
                aria-live="polite"
                style={{
                  marginTop: 14,
                  fontSize: 11,
                  color: "var(--fg-muted)",
                }}
              >
                {filtered.length} matched for &quot;{activeQuery}&quot;
              </div>
            )}
          </div>
        </div>

        <div className="container catalog-shell">
          <aside
            style={{
              position: "sticky",
              top: 80,
              alignSelf: "start",
              maxHeight: "calc(100vh - 100px)",
              overflowY: "auto",
              paddingRight: 22,
              scrollbarGutter: "stable",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <Icon.filter size={14} strokeWidth={1.5} />
              <span className="eyebrow">Filters</span>
            </div>
            <Filter title="Family">
              {allFamilies.map((family) => (
                <Check
                  key={family}
                  checked={Boolean(families[family])}
                  onChange={() =>
                    setFamilies((state) => ({
                      ...state,
                      [family]: !state[family],
                    }))
                  }
                  label={family}
                  count={
                    catalogItems.filter((item) => item.family === family).length
                  }
                />
              ))}
            </Filter>
            <Filter title="Documentation">
              <Check
                checked
                label="COA available"
                count={catalogItems.length}
              />
              <Check
                checked
                label="SDS available"
                count={catalogItems.length}
              />
              <Check
                checked
                label="Lot traceability"
                count={catalogItems.length}
              />
            </Filter>
            <Filter title="Access">
              <Check
                checked={showRestricted}
                onChange={() => setShowRestricted(!showRestricted)}
                label="Show restricted"
                count={catalogItems.filter((item) => item.restricted).length}
              />
              <Check
                checked={inStock}
                onChange={() => setInStock(!inStock)}
                label="In stock only"
                count={catalogItems.filter((item) => item.stock > 0).length}
              />
            </Filter>
            <Filter title="Mass">
              <Check checked={false} label="< 10 mg" />
              <Check checked={false} label="10-25 mg" />
              <Check checked={false} label="> 25 mg" />
            </Filter>
          </aside>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: "1px solid var(--line)",
              }}
            >
              <div style={{ display: "flex", gap: 8 }}>
                {(["grid", "list"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setView(option)}
                    className="btn btn-ghost btn-sm"
                    style={{
                      borderColor:
                        view === option ? "var(--fg)" : "var(--line)",
                      color: "var(--fg)",
                    }}
                  >
                    {option.toUpperCase()}
                  </button>
                ))}
              </div>
              <select
                className="input mono"
                style={{ width: "auto", padding: "6px 10px", fontSize: 12 }}
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option>Newest</option>
                <option>Price ↑</option>
                <option>Price ↓</option>
                <option>Mass</option>
              </select>
            </div>

            {view === "grid" ? (
              <div className="catalog-grid">
                {filtered.map((item, i) => (
                  <Reveal key={item.slug} delay={i * 24}>
                    <ProductCard item={item} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: "var(--r-md)",
                  background: "var(--bg-elevated)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "56px 1.4fr 1.6fr 100px 110px 100px 100px",
                    padding: "10px 16px",
                    borderBottom: "1px solid var(--line)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    textTransform: "uppercase",
                    color: "var(--fg-muted)",
                  }}
                >
                  <div />
                  <div>Material</div>
                  <div>Documentation · Range</div>
                  <div>Mass</div>
                  <div>Stock</div>
                  <div>Price</div>
                  <div />
                </div>
                {filtered.map((item, i) => (
                  <Link
                    key={item.slug}
                    href={`/products/${item.slug}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "56px 1.4fr 1.6fr 100px 110px 100px 100px",
                      padding: "14px 16px",
                      borderBottom:
                        i < filtered.length - 1
                          ? "1px solid var(--line)"
                          : "none",
                      alignItems: "center",
                      color: "var(--fg)",
                    }}
                  >
                    <div style={{ width: 42, height: 54 }}>
                      <ProductVisual item={item} small />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          marginBottom: 3,
                        }}
                      >
                        {item.shortName}
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <span className="badge badge-ruo">RESEARCH USE</span>
                        {item.restricted && (
                          <span className="badge badge-restricted">R</span>
                        )}
                      </div>
                    </div>
                    <div
                      className="mono"
                      style={{ fontSize: 11, color: "var(--fg-muted)" }}
                    >
                      {skuCode(item.sku)} · {item.family}
                      <br />
                      {item.marketRange}
                    </div>
                    <div className="mono" style={{ fontSize: 12 }}>
                      {item.dose}
                    </div>
                    <div
                      className="mono"
                      style={{
                        fontSize: 11,
                        color: item.stock > 0 ? "var(--ok)" : "var(--fg-muted)",
                      }}
                    >
                      {item.stock > 0 ? `${item.stock} units` : "Backorder"}
                    </div>
                    <div
                      className="mono"
                      style={{ fontSize: 13, fontWeight: 500 }}
                    >
                      {displayPrice(item.priceCents)}
                    </div>
                    <div
                      style={{ textAlign: "right", color: "var(--fg-muted)" }}
                    >
                      <Icon.arrow size={14} strokeWidth={1.5} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <V2Footer />
    </>
  );
}

function ProductCard({ item }: { item: (typeof catalogItems)[number] }) {
  return (
    <Link
      href={`/products/${item.slug}`}
      className="card card-hover product-card"
    >
      <div
        style={{ display: "flex", gap: 5, marginBottom: 10, flexWrap: "wrap" }}
      >
        <span className="badge badge-ruo">RESEARCH USE</span>
        <span className="badge badge-coa">COA</span>
        {item.restricted && (
          <span className="badge badge-restricted">RESTRICTED</span>
        )}
      </div>
      <div className="product-media">
        <ProductVisual item={item} />
      </div>
      <div className="product-title-row">
        <h2 style={{ fontSize: 14 }}>{item.shortName}</h2>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {displayPrice(item.priceCents)}
        </span>
      </div>
      <div className="product-code-line">
        {skuCode(item.sku)} · {item.dose} · {item.family}
      </div>
      <p className="product-card-desc">{item.description}</p>
      <div
        className="product-card-details"
        aria-label={`${item.shortName} details`}
      >
        <span>
          <strong>Class</strong>
          {item.family}
        </span>
        <span>
          <strong>Mass</strong>
          {item.dose}
        </span>
        <span>
          <strong>Docs</strong>
          COA
        </span>
      </div>
      <div className="card-action">
        <span
          style={{ color: item.stock > 0 ? "var(--ok)" : "var(--fg-muted)" }}
        >
          · {item.stock > 0 ? `${item.stock} IN STOCK` : "BACKORDER"}
        </span>
        <span>VIEW LOT →</span>
      </div>
    </Link>
  );
}

function Filter({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        paddingBottom: 20,
        marginBottom: 20,
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="label">{title}</div>
      {children}
    </div>
  );
}

function Check({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange?: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "5px 0",
        cursor: onChange ? "pointer" : "default",
        fontSize: 13,
      }}
    >
      <button
        type="button"
        onClick={onChange}
        aria-pressed={checked}
        style={{
          width: 14,
          height: 14,
          border: `1px solid ${checked ? "var(--fg)" : "var(--line-strong)"}`,
          background: checked ? "var(--fg)" : "transparent",
          borderRadius: 2,
          display: "grid",
          placeItems: "center",
          color: "var(--bg)",
        }}
      >
        {checked && <Icon.check size={10} strokeWidth={2} />}
      </button>
      <span style={{ flex: 1 }}>{label}</span>
      {count !== undefined && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--fg-subtle)",
            marginRight: 8,
          }}
        >
          {count}
        </span>
      )}
    </label>
  );
}
