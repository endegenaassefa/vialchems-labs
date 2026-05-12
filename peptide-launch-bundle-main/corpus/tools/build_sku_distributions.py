#!/usr/bin/env python3
"""build_sku_distributions.py

Reads 02_claude_code_outputs/pricing_matrix.csv, groups by peptide_canonical,
computes per-mg price distributions, and emits:
  - 02_claude_code_outputs/sku_distributions.md
  - 02_claude_code_outputs/sku_distributions_summary.json

Stdlib only. Reproducible per-mg arithmetic (4dp, banker's rounding).

Per Pillar C schema spec:
  - For peptides with >=3 distinct vendors AND >=1 priced row: full distribution.
  - For peptides with 1-2 vendors: short note section.
  - For peptides with no priced rows: "no pricing captured" note.
  - Outliers via 1.5 * IQR rule.
  - "Price clustering observed" when CV < 0.10 across >=5 priced vendors.
  - Vendor extremes: vendors holding lowest/highest extreme on >=2 peptides.

The vendor_status values (ok / partial / failed / 3) are tracked but a peptide
may still receive a distribution if any priced rows exist regardless of status.
"""

import csv
import json
import statistics
from collections import defaultdict
from datetime import datetime, timezone
from decimal import ROUND_HALF_EVEN, Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "02_claude_code_outputs" / "pricing_matrix.csv"
MD_OUT = ROOT / "02_claude_code_outputs" / "sku_distributions.md"
JSON_OUT = ROOT / "02_claude_code_outputs" / "sku_distributions_summary.json"


def round_4dp(value):
    """Round to 4 decimal places, half-to-even."""
    if value is None:
        return None
    d = Decimal(str(value)).quantize(Decimal("0.0001"), rounding=ROUND_HALF_EVEN)
    return float(d)


def round_2dp(value):
    if value is None:
        return None
    d = Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)
    return float(d)


def to_float(s):
    if s is None:
        return None
    s = s.strip()
    if s == "" or s.lower() == "uncertain":
        return None
    try:
        return float(s)
    except ValueError:
        return None


def percentile(sorted_values, p):
    """Linear-interpolation percentile on a pre-sorted list."""
    n = len(sorted_values)
    if n == 0:
        return None
    if n == 1:
        return sorted_values[0]
    rank = (p / 100.0) * (n - 1)
    lower = int(rank)
    upper = min(lower + 1, n - 1)
    frac = rank - lower
    return sorted_values[lower] + frac * (sorted_values[upper] - sorted_values[lower])


def load_rows():
    with CSV_PATH.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader), reader.fieldnames


def normalize_peptide(name):
    if name is None:
        return ""
    return name.strip()


def is_priced(row):
    pmg = (row.get("per_mg_price_usd") or "").strip()
    return pmg not in ("", "uncertain")


def detect_outliers(values, p25, p75):
    """1.5 * IQR rule. Returns list of (value, kind) tuples."""
    if p25 is None or p75 is None:
        return []
    iqr = p75 - p25
    if iqr <= 0:
        return []
    lower_bound = p25 - 1.5 * iqr
    upper_bound = p75 + 1.5 * iqr
    out = []
    for v in values:
        if v < lower_bound:
            out.append((v, "low"))
        elif v > upper_bound:
            out.append((v, "high"))
    return out


def analyze_peptide(name, rows):
    """Return dict of stats for one peptide group."""
    distinct_vendors = sorted({r["vendor_slug"] for r in rows})
    priced_rows = [r for r in rows if is_priced(r)]
    priced_vendors = sorted({r["vendor_slug"] for r in priced_rows})

    # vendor_status notes
    statuses = defaultdict(int)
    for r in rows:
        statuses[r.get("vendor_status", "")] += 1

    summary = {
        "peptide_canonical": name,
        "vendor_count": len(distinct_vendors),
        "priced_vendor_count": len(priced_vendors),
        "sku_count_total": len(rows),
        "sku_count_priced": len(priced_rows),
        "vendors": distinct_vendors,
        "priced_vendors": priced_vendors,
        "vendor_status_breakdown": dict(statuses),
        "lowest_per_mg": None,
        "p25_per_mg": None,
        "median_per_mg": None,
        "p75_per_mg": None,
        "highest_per_mg": None,
        "iqr_per_mg": None,
        "mean_per_mg": None,
        "stddev_per_mg": None,
        "cv": None,
        "lowest_vendor": None,
        "lowest_sku_id": None,
        "lowest_dose": None,
        "lowest_list_price": None,
        "lowest_observed_at": None,
        "highest_vendor": None,
        "highest_sku_id": None,
        "highest_dose": None,
        "highest_list_price": None,
        "highest_observed_at": None,
        "oos_vendor_count": 0,
        "oos_vendors": [],
        "outliers": [],
        "outlier_count": 0,
        "price_clustering_flag": False,
        "formats": [],
        "variant_breakdown": {},
        "all_per_mg_values": [],
    }

    if not priced_rows:
        return summary

    # Build (per_mg_float, row) tuples sorted by per_mg
    valued = []
    for r in priced_rows:
        v = to_float(r.get("per_mg_price_usd"))
        if v is None or v <= 0:
            continue
        valued.append((v, r))

    if not valued:
        return summary

    valued.sort(key=lambda t: t[0])
    per_mg_values = [t[0] for t in valued]

    summary["all_per_mg_values"] = [round_4dp(v) for v in per_mg_values]
    summary["lowest_per_mg"] = round_4dp(per_mg_values[0])
    summary["highest_per_mg"] = round_4dp(per_mg_values[-1])
    summary["p25_per_mg"] = round_4dp(percentile(per_mg_values, 25))
    summary["median_per_mg"] = round_4dp(percentile(per_mg_values, 50))
    summary["p75_per_mg"] = round_4dp(percentile(per_mg_values, 75))
    if summary["p25_per_mg"] is not None and summary["p75_per_mg"] is not None:
        summary["iqr_per_mg"] = round_4dp(summary["p75_per_mg"] - summary["p25_per_mg"])
    summary["mean_per_mg"] = round_4dp(statistics.fmean(per_mg_values))
    if len(per_mg_values) > 1:
        summary["stddev_per_mg"] = round_4dp(statistics.pstdev(per_mg_values))
    else:
        summary["stddev_per_mg"] = 0.0
    if summary["mean_per_mg"] and summary["mean_per_mg"] > 0 and summary["stddev_per_mg"] is not None:
        summary["cv"] = round_4dp(summary["stddev_per_mg"] / summary["mean_per_mg"])
    else:
        summary["cv"] = None

    # Lowest/highest vendor with sku_id, dose, list_price, observed_at
    lowest_v, lowest_r = valued[0]
    highest_v, highest_r = valued[-1]
    summary["lowest_vendor"] = lowest_r["vendor_slug"]
    summary["lowest_sku_id"] = lowest_r["sku_id"]
    summary["lowest_dose"] = f"{lowest_r.get('dose_value', '')} {lowest_r.get('dose_unit', '')}".strip()
    summary["lowest_list_price"] = to_float(lowest_r.get("list_price_usd"))
    summary["lowest_observed_at"] = lowest_r.get("sale_observed_at") or ""
    summary["highest_vendor"] = highest_r["vendor_slug"]
    summary["highest_sku_id"] = highest_r["sku_id"]
    summary["highest_dose"] = f"{highest_r.get('dose_value', '')} {highest_r.get('dose_unit', '')}".strip()
    summary["highest_list_price"] = to_float(highest_r.get("list_price_usd"))
    summary["highest_observed_at"] = highest_r.get("sale_observed_at") or ""

    # OOS vendors
    oos_vendors = sorted(
        {r["vendor_slug"] for r in rows if (r.get("out_of_stock") or "").strip().lower() == "true"}
    )
    summary["oos_vendor_count"] = len(oos_vendors)
    summary["oos_vendors"] = oos_vendors

    # Outliers
    outliers = detect_outliers(per_mg_values, summary["p25_per_mg"], summary["p75_per_mg"])
    enriched_outliers = []
    for v, kind in outliers:
        # Find a representative row
        for vv, r in valued:
            if abs(vv - v) < 1e-9:
                enriched_outliers.append({
                    "per_mg": round_4dp(v),
                    "kind": kind,
                    "vendor_slug": r["vendor_slug"],
                    "sku_id": r["sku_id"],
                    "dose": f"{r.get('dose_value','')} {r.get('dose_unit','')}".strip(),
                    "list_price_usd": to_float(r.get("list_price_usd")),
                })
                break
    summary["outliers"] = enriched_outliers
    summary["outlier_count"] = len(enriched_outliers)

    # Price clustering: CV < 0.10 across >=5 priced vendors
    if (
        summary["cv"] is not None
        and summary["cv"] < 0.10
        and len(priced_vendors) >= 5
    ):
        summary["price_clustering_flag"] = True

    # Formats observed (across all rows for the peptide, not just priced)
    fmts = sorted({(r.get("format") or "").strip() for r in rows if (r.get("format") or "").strip()})
    summary["formats"] = fmts

    # Variant breakdown
    variant_groups = defaultdict(list)
    for v, r in valued:
        variant = (r.get("peptide_variant") or "").strip()
        if variant == "":
            variant = "(unspecified)"
        variant_groups[variant].append((v, r))

    variant_breakdown = {}
    if len(variant_groups) >= 2:
        # Only include variants with at least 2 priced rows OR where there are 2+ substantive
        # variants (meaning different variant labels each with at least 1 priced row)
        substantive = [(k, vs) for k, vs in variant_groups.items() if len(vs) >= 1]
        if len(substantive) >= 2:
            for vk, vs in variant_groups.items():
                vals = sorted([v for v, _ in vs])
                if not vals:
                    continue
                variant_breakdown[vk] = {
                    "sku_count": len(vals),
                    "vendor_count": len({r["vendor_slug"] for _, r in vs}),
                    "median_per_mg": round_4dp(percentile(vals, 50)),
                    "min_per_mg": round_4dp(vals[0]),
                    "max_per_mg": round_4dp(vals[-1]),
                }
    summary["variant_breakdown"] = variant_breakdown

    return summary


def compute_vendor_extremes(per_peptide_summaries):
    """Aggregate which vendors are lowest/highest across multiple peptides."""
    lowest_count = defaultdict(list)
    highest_count = defaultdict(list)
    for s in per_peptide_summaries:
        if s["sku_count_priced"] == 0:
            continue
        if s["vendor_count"] < 3:
            continue
        if s["lowest_vendor"]:
            lowest_count[s["lowest_vendor"]].append(s["peptide_canonical"])
        if s["highest_vendor"]:
            highest_count[s["highest_vendor"]].append(s["peptide_canonical"])

    aggressive_undercutters = sorted(
        [(v, peps) for v, peps in lowest_count.items() if len(peps) >= 2],
        key=lambda x: -len(x[1]),
    )
    premium_positioners = sorted(
        [(v, peps) for v, peps in highest_count.items() if len(peps) >= 2],
        key=lambda x: -len(x[1]),
    )
    return aggressive_undercutters, premium_positioners


def fmt_money_per_mg(v):
    if v is None:
        return "n/a"
    return f"${v:.4f}"


def fmt_money(v):
    if v is None:
        return "n/a"
    return f"${v:.2f}"


def emit_full_section(s):
    lines = []
    lines.append(f"## {s['peptide_canonical']}")
    lines.append("")
    lines.append(f"**Vendors carrying:** {s['vendor_count']}")
    lines.append(f"**Vendors with full pricing captured:** {s['priced_vendor_count']}")
    lines.append(f"**Total SKU rows:** {s['sku_count_total']} ({s['sku_count_priced']} priced)")
    if s.get("vendor_status_breakdown"):
        statuses = ", ".join(f"{k}={v}" for k, v in sorted(s["vendor_status_breakdown"].items()))
        lines.append(f"**Vendor-status row breakdown:** {statuses}")
    if s.get("formats"):
        lines.append(f"**Formats observed:** {', '.join(s['formats'])}")
    lines.append("")
    lines.append("### Price distribution (per-mg, USD)")
    lines.append("")
    lowest_obs = s.get("lowest_observed_at") or "n/a"
    highest_obs = s.get("highest_observed_at") or "n/a"
    lines.append(
        f"- Lowest: {fmt_money_per_mg(s['lowest_per_mg'])} "
        f"(vendor: `{s['lowest_vendor']}`, sku_id: `{s['lowest_sku_id']}`, "
        f"dose: {s['lowest_dose']}, list: {fmt_money(s['lowest_list_price'])}, "
        f"observed: {lowest_obs or 'n/a'})"
    )
    lines.append(f"- 25th percentile: {fmt_money_per_mg(s['p25_per_mg'])}")
    lines.append(f"- Median: {fmt_money_per_mg(s['median_per_mg'])}")
    lines.append(f"- 75th percentile: {fmt_money_per_mg(s['p75_per_mg'])}")
    lines.append(
        f"- Highest: {fmt_money_per_mg(s['highest_per_mg'])} "
        f"(vendor: `{s['highest_vendor']}`, sku_id: `{s['highest_sku_id']}`, "
        f"dose: {s['highest_dose']}, list: {fmt_money(s['highest_list_price'])}, "
        f"observed: {highest_obs or 'n/a'})"
    )
    lines.append(f"- IQR: {fmt_money_per_mg(s['iqr_per_mg'])}")
    lines.append(
        f"- Mean: {fmt_money_per_mg(s['mean_per_mg'])} | "
        f"Stddev: {fmt_money_per_mg(s['stddev_per_mg'])} | "
        f"CV: {s['cv'] if s['cv'] is not None else 'n/a'}"
    )

    if s["outlier_count"] == 0:
        lines.append("- Outlier flag: no 1.5xIQR outliers detected")
    else:
        lines.append(f"- Outlier flag: {s['outlier_count']} outlier SKU(s) by 1.5xIQR rule:")
        for o in s["outliers"]:
            lines.append(
                f"    - {o['kind']}: {fmt_money_per_mg(o['per_mg'])} "
                f"({o['vendor_slug']} / `{o['sku_id']}`, dose {o['dose']}, "
                f"list {fmt_money(o['list_price_usd'])}) "
                f"[apparent cause: uncertain without further per-vendor inspection]"
            )

    if s["price_clustering_flag"]:
        lines.append(
            "- **Price clustering observed.** CV "
            f"= {s['cv']} across {s['priced_vendor_count']} priced vendors "
            "(<0.10 with >=5 priced vendors). Operator interpretation."
        )

    lines.append("")
    lines.append("### Stockout signal")
    lines.append("")
    if s["oos_vendor_count"] == 0:
        lines.append("No `out_of_stock: true` rows captured for this peptide in the matrix.")
    else:
        lines.append(
            f"{s['oos_vendor_count']} vendor(s) with at least one OOS row: "
            + ", ".join(f"`{v}`" for v in s["oos_vendors"])
        )
    lines.append("")

    lines.append("### Variant pricing comparison")
    lines.append("")
    if not s["variant_breakdown"]:
        lines.append("No substantive variant split captured (single variant or unspecified).")
    else:
        lines.append("| Variant | Priced SKUs | Distinct vendors | Min per-mg | Median per-mg | Max per-mg |")
        lines.append("|---|---|---|---|---|---|")
        for k, v in sorted(
            s["variant_breakdown"].items(), key=lambda kv: -kv[1]["sku_count"]
        ):
            lines.append(
                f"| {k} | {v['sku_count']} | {v['vendor_count']} | "
                f"{fmt_money_per_mg(v['min_per_mg'])} | "
                f"{fmt_money_per_mg(v['median_per_mg'])} | "
                f"{fmt_money_per_mg(v['max_per_mg'])} |"
            )
    lines.append("")

    lines.append("### Notes")
    lines.append("")
    notes = []
    if s["price_clustering_flag"]:
        notes.append(
            "Tight clustering (CV < 0.10, >=5 vendors). Per the schema this is observation, "
            "not accusation."
        )
    if s["outlier_count"] > 0:
        notes.append(
            f"{s['outlier_count']} outlier SKU(s) flagged. Possible drivers without further "
            "investigation: purity claim, lab-testing depth, brand premium, dosing-anomaly. "
            "Marked uncertain."
        )
    if s["oos_vendor_count"] > 0:
        notes.append(f"{s['oos_vendor_count']} vendor(s) showing OOS supply pressure.")
    statuses = s.get("vendor_status_breakdown", {})
    if statuses.get("failed", 0) > 0 or statuses.get("partial", 0) > 0:
        notes.append(
            f"{statuses.get('failed', 0)} `failed` and {statuses.get('partial', 0)} `partial` "
            "vendor-status rows in this group. Distribution stats above use priced rows only."
        )
    if not notes:
        notes.append("No anomalies flagged.")
    for n in notes:
        lines.append(f"- {n}")
    lines.append("")

    return "\n".join(lines)


def emit_limited_section(s):
    lines = []
    lines.append(f"## {s['peptide_canonical']}")
    lines.append("")
    lines.append(
        f"**Limited coverage.** {s['vendor_count']} vendor(s) carrying; "
        f"{s['sku_count_priced']} priced row(s) of {s['sku_count_total']} total. "
        "Below the 3-vendor threshold for full distribution analysis."
    )
    lines.append("")
    if s["vendors"]:
        lines.append("Vendors observed: " + ", ".join(f"`{v}`" for v in s["vendors"]))
    if s["sku_count_priced"] > 0 and s["lowest_per_mg"] is not None:
        lines.append(
            f"Priced range: {fmt_money_per_mg(s['lowest_per_mg'])} to "
            f"{fmt_money_per_mg(s['highest_per_mg'])} per mg "
            f"(median {fmt_money_per_mg(s['median_per_mg'])})."
        )
    lines.append("")
    return "\n".join(lines)


def emit_no_pricing_section(s):
    lines = []
    lines.append(f"## {s['peptide_canonical']}")
    lines.append("")
    lines.append(
        f"**No pricing captured.** {s['vendor_count']} vendor(s) reference this peptide across "
        f"{s['sku_count_total']} row(s) but no priced SKU was extractable "
        "(per_mg_price_usd is empty or uncertain on every row)."
    )
    if s["vendors"]:
        lines.append("")
        lines.append("Vendors observed: " + ", ".join(f"`{v}`" for v in s["vendors"]))
    lines.append("")
    return "\n".join(lines)


def main():
    rows, fieldnames = load_rows()
    total_rows = len(rows)

    # Group by peptide_canonical, skipping uncertain/empty
    groups = defaultdict(list)
    skipped_no_canonical = 0
    for r in rows:
        pep = normalize_peptide(r.get("peptide_canonical"))
        if pep == "" or pep.lower() == "uncertain":
            skipped_no_canonical += 1
            continue
        groups[pep].append(r)

    # Analyze each peptide
    per_peptide = []
    for name in sorted(groups.keys(), key=lambda x: x.lower()):
        s = analyze_peptide(name, groups[name])
        per_peptide.append(s)

    # Categorize
    full = [s for s in per_peptide if s["vendor_count"] >= 3 and s["sku_count_priced"] >= 1]
    limited = [s for s in per_peptide if 1 <= s["vendor_count"] <= 2 and s["sku_count_priced"] >= 1]
    no_priced = [s for s in per_peptide if s["sku_count_priced"] == 0]
    # 3+ vendors but no priced rows (rare): treat as no_priced
    extras_no_priced = [s for s in per_peptide if s["vendor_count"] >= 3 and s["sku_count_priced"] == 0]
    no_priced = sorted(no_priced + extras_no_priced, key=lambda x: x["peptide_canonical"].lower())
    # de-dup just in case
    seen_names = set()
    no_priced_dedup = []
    for s in no_priced:
        if s["peptide_canonical"] not in seen_names:
            no_priced_dedup.append(s)
            seen_names.add(s["peptide_canonical"])
    no_priced = no_priced_dedup

    aggressive_undercutters, premium_positioners = compute_vendor_extremes(full)

    # Build markdown
    distinct_vendors_total = len({r["vendor_slug"] for r in rows})
    priced_rows_total = sum(1 for r in rows if is_priced(r))
    generated_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    md_lines = []
    md_lines.append("# SKU Distributions (per peptide)")
    md_lines.append("")
    md_lines.append(
        "Per-peptide per-mg price distributions across the captured vendor universe. "
        "Generated by `tools/build_sku_distributions.py` from `pricing_matrix.csv`."
    )
    md_lines.append("")
    md_lines.append("## Generation context")
    md_lines.append("")
    md_lines.append(f"- generated_at: {generated_at}")
    md_lines.append(f"- pricing_matrix rows: {total_rows}")
    md_lines.append(f"- distinct vendor_slug values: {distinct_vendors_total}")
    md_lines.append(f"- rows with priced per_mg: {priced_rows_total}")
    md_lines.append(f"- rows with uncertain/empty per_mg: {total_rows - priced_rows_total}")
    md_lines.append(f"- rows skipped (peptide_canonical empty or 'uncertain'): {skipped_no_canonical}")
    md_lines.append(f"- distinct peptide_canonical values analyzed: {len(per_peptide)}")
    md_lines.append(f"- peptides with full distribution (>=3 vendors, >=1 priced): {len(full)}")
    md_lines.append(f"- peptides with limited coverage (1-2 vendors, >=1 priced): {len(limited)}")
    md_lines.append(f"- peptides with no pricing captured: {len(no_priced)}")
    md_lines.append("")

    md_lines.append("## Method notes")
    md_lines.append("")
    md_lines.append("- Per-mg values rounded to 4 decimal places with banker's rounding.")
    md_lines.append("- Percentiles computed via linear interpolation on the sorted distribution.")
    md_lines.append("- IQR = 75th percentile minus 25th percentile.")
    md_lines.append("- Outliers flagged when value < p25 - 1.5xIQR or > p75 + 1.5xIQR.")
    md_lines.append(
        "- 'Price clustering observed' fires when coefficient of variation < 0.10 across >=5 priced vendors."
    )
    md_lines.append(
        "- Rows with `peptide_canonical = uncertain` or empty are excluded from grouping per spec."
    )
    md_lines.append(
        "- Rows with `per_mg_price_usd = uncertain` or empty are excluded from distribution stats "
        "but still counted in vendor coverage."
    )
    md_lines.append(
        "- A peptide is included with full distribution if any priced rows exist regardless of vendor_status; "
        "vendor-status breakdown is reported per section."
    )
    md_lines.append("")

    # Vendor extremes section
    md_lines.append("## Vendor extremes (across peptides)")
    md_lines.append("")
    md_lines.append(
        "Vendors holding the lowest or highest per-mg price in their peptide group "
        "across multiple peptides (>=2)."
    )
    md_lines.append("")
    md_lines.append("### Aggressive undercutters (lowest per-mg, >=2 peptides)")
    md_lines.append("")
    if not aggressive_undercutters:
        md_lines.append("- None.")
    else:
        for vendor, peps in aggressive_undercutters:
            md_lines.append(f"- `{vendor}` ({len(peps)} peptide(s)): {', '.join(peps)}")
    md_lines.append("")
    md_lines.append("### Premium positioners (highest per-mg, >=2 peptides)")
    md_lines.append("")
    if not premium_positioners:
        md_lines.append("- None.")
    else:
        for vendor, peps in premium_positioners:
            md_lines.append(f"- `{vendor}` ({len(peps)} peptide(s)): {', '.join(peps)}")
    md_lines.append("")

    md_lines.append("---")
    md_lines.append("")
    md_lines.append("# Full distributions (>=3 vendors, >=1 priced row)")
    md_lines.append("")
    for s in sorted(full, key=lambda x: x["peptide_canonical"].lower()):
        md_lines.append(emit_full_section(s))

    md_lines.append("---")
    md_lines.append("")
    md_lines.append("# Limited coverage (1-2 vendors)")
    md_lines.append("")
    if not limited:
        md_lines.append("None.")
        md_lines.append("")
    else:
        for s in sorted(limited, key=lambda x: x["peptide_canonical"].lower()):
            md_lines.append(emit_limited_section(s))

    md_lines.append("---")
    md_lines.append("")
    md_lines.append("# No pricing captured")
    md_lines.append("")
    if not no_priced:
        md_lines.append("None.")
        md_lines.append("")
    else:
        for s in sorted(no_priced, key=lambda x: x["peptide_canonical"].lower()):
            md_lines.append(emit_no_pricing_section(s))

    md_lines.append("---")
    md_lines.append("")
    md_lines.append("# Data-quality notes")
    md_lines.append("")
    md_lines.append(
        f"- {total_rows - priced_rows_total} rows ({(total_rows - priced_rows_total) / total_rows:.1%}) "
        "have no usable per-mg price (uncertain or empty). The high uncertain rate reflects vendors "
        "without disclosed per-mg pricing or with non-mg dose units."
    )
    md_lines.append(
        f"- {skipped_no_canonical} rows had peptide_canonical empty or 'uncertain' and were excluded "
        "from grouping per spec."
    )
    failed_total = sum(1 for r in rows if (r.get("vendor_status") or "").strip() == "failed")
    partial_total = sum(1 for r in rows if (r.get("vendor_status") or "").strip() == "partial")
    md_lines.append(
        f"- {failed_total} rows from `failed` vendors and {partial_total} rows from `partial` vendors "
        "are present. The schema permits these to contribute to distributions if they carry priced rows; "
        "per-section breakdowns flag this where it occurs."
    )
    md_lines.append(
        "- The `peptide_canonical = other` bucket is a synthetic catch-all in the matrix and is included "
        "as a separate section (treat its distribution as a heterogeneous mix, not a single peptide market)."
    )
    md_lines.append("")

    MD_OUT.write_text("\n".join(md_lines), encoding="utf-8")

    # Build JSON summary
    summary_payload = {
        "generated_at": generated_at,
        "pricing_matrix_rows": total_rows,
        "distinct_vendors_total": distinct_vendors_total,
        "priced_rows_total": priced_rows_total,
        "rows_skipped_no_canonical": skipped_no_canonical,
        "peptides_total": len(per_peptide),
        "peptides_full_distribution": len(full),
        "peptides_limited_coverage": len(limited),
        "peptides_no_pricing": len(no_priced),
        "aggressive_undercutters": [
            {"vendor_slug": v, "peptides": p} for v, p in aggressive_undercutters
        ],
        "premium_positioners": [
            {"vendor_slug": v, "peptides": p} for v, p in premium_positioners
        ],
        "peptides": [],
    }

    for s in per_peptide:
        # Drop the all_per_mg_values list from JSON (potentially large; not needed downstream)
        entry = {k: v for k, v in s.items() if k != "all_per_mg_values"}
        if s["vendor_count"] >= 3 and s["sku_count_priced"] >= 1:
            entry["category"] = "full"
        elif 1 <= s["vendor_count"] <= 2 and s["sku_count_priced"] >= 1:
            entry["category"] = "limited"
        else:
            entry["category"] = "no_pricing"
        summary_payload["peptides"].append(entry)

    JSON_OUT.write_text(json.dumps(summary_payload, indent=2, default=str), encoding="utf-8")

    # stdout summary
    print(f"Wrote {MD_OUT}")
    print(f"Wrote {JSON_OUT}")
    print(f"  pricing_matrix rows: {total_rows}")
    print(f"  priced rows: {priced_rows_total}")
    print(f"  rows skipped (no canonical): {skipped_no_canonical}")
    print(f"  peptides analyzed: {len(per_peptide)}")
    print(f"  full distributions: {len(full)}")
    print(f"  limited coverage: {len(limited)}")
    print(f"  no pricing captured: {len(no_priced)}")
    print(f"  aggressive undercutters: {len(aggressive_undercutters)}")
    print(f"  premium positioners: {len(premium_positioners)}")


if __name__ == "__main__":
    main()
