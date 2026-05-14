import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "peptide-launch-bundle-main/**",
    "next-env.d.ts",
    // Per-developer tooling state — Claude Code worktrees (each carries its
    // own built .next/) and gstack workspace metadata. Never source to lint.
    ".claude/**",
    ".gstack/**",
    // Build output inside nested worktrees the root .next/** glob misses.
    "**/.next/**",
  ]),
]);

export default eslintConfig;
