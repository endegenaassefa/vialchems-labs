/**
 * Iron Law 2.28 — canonical-domain regression lock.
 *
 * v5 Phase 1 closure. Audit C1/C11/H14/H29 were RESOLVED by `f164f60f Switch
 * production domain to vialchemlabs.net` (162 source-tree references → 0).
 * This test locks the resolved state so future regressions surface at the
 * unit-test layer rather than only at preflight or in production.
 *
 * Canonical domain per docs/DECISIONS/locked_override_2026-05-20.md:
 *   vialchemlabs.net
 *
 * Legacy / dead domains that must not appear in source:
 *   - vialchemlabs.com   (DNS does not resolve as of 2026-05-20)
 *   - vialchems.labs     (DNS does not resolve)
 *   - vialchemslabs.net  (typo variant)
 *   - vialchemslabs.com  (typo variant)
 *
 * Allowed-mention paths (audit trail, historical record):
 *   - docs/audit/         (audit reports describing historical state)
 *   - docs/DECISIONS/     (LOCKED_OVERRIDE docs describing transitions)
 *   - docs/superpowers/   (super-prompt corpus)
 *   - docs/checkpoints/   (phase checkpoints can reference historical anchor state)
 *   - CHANGELOG.md        (historical version notes)
 *   - audit/ test-reports/ (untracked sub-agent scratch — exempt)
 */
import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";
import path from "node:path";

const repoRoot = path.resolve(__dirname, "../../..");

const LEGACY_DOMAINS = [
  "vialchemlabs.com",
  "vialchems.labs",
  "vialchemslabs.net",
  "vialchemslabs.com",
] as const;

const CANONICAL_DOMAIN = "vialchemlabs.net";

/**
 * grep the source-tree for a needle, excluding allowed paths. Returns the
 * trimmed grep output (empty string = no hits).
 */
function grepSourceTreeExcludingAllowed(needle: string): string {
  try {
    const output = execSync(
      [
        "grep",
        "-rIn",
        "--include='*.ts'",
        "--include='*.tsx'",
        "--include='*.js'",
        "--include='*.jsx'",
        "--include='*.mjs'",
        "--include='*.cjs'",
        "--include='*.json'",
        "--include='*.txt'",
        "--include='*.html'",
        "--include='*.css'",
        "--include='*.scss'",
        "--include='*.sql'",
        "--include='*.yml'",
        "--include='*.yaml'",
        "--include='*.example'",
        "--exclude-dir='node_modules'",
        "--exclude-dir='.next'",
        "--exclude-dir='.git'",
        "--exclude-dir='.vercel'",
        "--exclude-dir='dist'",
        "--exclude-dir='build'",
        "--exclude-dir='coverage'",
        "--exclude-dir='.lighthouseci'",
        "--exclude-dir='playwright-report'",
        "--exclude-dir='test-results'",
        "--exclude-dir='audit'",
        "--exclude-dir='test-reports'",
        `"${needle}"`,
        ".",
      ].join(" "),
      {
        cwd: repoRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    );
    return output
      .split("\n")
      .filter((line) => {
        if (!line) return false;
        // Filter out lockfiles + the test file itself (which lists the legacy domains)
        if (line.includes("package-lock.json")) return false;
        if (line.includes("pnpm-lock.yaml")) return false;
        if (line.includes("yarn.lock")) return false;
        if (line.includes("tests/unit/site/canonical-domain.test.ts"))
          return false;
        if (line.includes("scripts/check-canonical-domain.sh")) return false;
        if (line.includes("scripts/check-dns-resolution.sh")) return false;
        return true;
      })
      .join("\n")
      .trim();
  } catch (err) {
    // grep returns exit 1 if no matches found — treat as empty result.
    const e = err as { status?: number; stdout?: Buffer | string };
    if (e?.status === 1) return "";
    throw err;
  }
}

describe("Iron Law 2.28 — canonical domain enforcement", () => {
  it("the canonical domain is the v5 LOCKED value vialchemlabs.net", () => {
    expect(CANONICAL_DOMAIN).toBe("vialchemlabs.net");
  });

  for (const legacy of LEGACY_DOMAINS) {
    it(`source-tree contains zero references to legacy domain '${legacy}'`, () => {
      const hits = grepSourceTreeExcludingAllowed(legacy);
      expect(
        hits,
        `Iron Law 2.28 violation: legacy domain '${legacy}' found in source-tree.\n` +
          `Allowed only in docs/audit/, docs/DECISIONS/, docs/superpowers/, docs/checkpoints/, CHANGELOG.md.\n\n` +
          `Hits:\n${hits}`,
      ).toBe("");
    });
  }

  it("public/robots.txt Sitemap line references the canonical domain", () => {
    const robotsTxt = execSync("cat public/robots.txt", {
      cwd: repoRoot,
      encoding: "utf8",
    });
    expect(robotsTxt).toMatch(
      new RegExp(`Sitemap:\\s+https://${CANONICAL_DOMAIN}/sitemap\\.xml`),
    );
  });

  it(".env.example BRAND_DOMAIN default is the canonical domain", () => {
    const envExample = execSync("cat .env.example", {
      cwd: repoRoot,
      encoding: "utf8",
    });
    expect(envExample).toMatch(
      new RegExp(
        `^BRAND_DOMAIN=${CANONICAL_DOMAIN.replace(/\./g, "\\.")}`,
        "m",
      ),
    );
  });
});
