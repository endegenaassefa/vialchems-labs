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
    "next-env.d.ts",
    // v5 Phase 7 additions: test/coverage/wordpress preview stack
    "coverage/**",
    ".lighthouseci/**",
    "playwright-report/**",
    "test-results/**",
    "wordpress/**",
  ]),
]);

export default eslintConfig;
