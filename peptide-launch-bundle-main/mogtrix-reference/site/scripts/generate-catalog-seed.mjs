import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  buildCatalogProductsUpsertSql,
  canonicalCatalogProducts
} from "../lib/catalog-seed.ts";

const seedPath = resolve(process.cwd(), "supabase", "seed.sql");
const output = `-- Generated from site/lib/catalog-seed.ts.\n-- Regenerate with: node --experimental-strip-types scripts/generate-catalog-seed.mjs\n${buildCatalogProductsUpsertSql()}\n`;

if (process.argv.includes("--check")) {
  const existing = readFileSync(seedPath, "utf8");

  if (existing !== output) {
    console.error(
      `seed.sql is out of date for ${canonicalCatalogProducts.length} canonical catalog rows.`
    );
    process.exit(1);
  }

  process.exit(0);
}

process.stdout.write(output);
