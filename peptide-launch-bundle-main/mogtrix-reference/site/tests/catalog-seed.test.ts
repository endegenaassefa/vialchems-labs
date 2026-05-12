import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const seedPath = join(process.cwd(), "supabase", "seed.sql");
const migrationsDir = join(process.cwd(), "supabase", "migrations");

describe("catalog seed contract", () => {
  it("seeds the canonical storefront product rows", () => {
    const seed = readFileSync(seedPath, "utf8");
    const migrationName = readdirSync(migrationsDir).find((file) =>
      file.includes("unify_catalog_products")
    );

    expect(seed).toContain("insert into public.products");
    expect(seed).toContain("'bpc-157-5mg'");
    expect(seed).toContain("'mazdutide-10mg'");
    expect(seed).not.toContain("'mtrx-reference-a'");
    expect(migrationName).toBeTruthy();

    const migration = readFileSync(
      join(migrationsDir, migrationName!),
      "utf8"
    );

    expect(migration).toContain("add column if not exists documentation_status");
    expect(migration).toContain("'bpc-157-5mg'");
    expect(migration).toContain("update public.products");
  });
});
