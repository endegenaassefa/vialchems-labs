import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migrationsDir = join(process.cwd(), "supabase", "migrations");
const provisioningDocPath = join(process.cwd(), "scripts", "provision-supabase.md");

describe("Supabase provisioning guide", () => {
  it("lists every committed migration file in the manual provisioning steps", () => {
    const migrationFiles = readdirSync(migrationsDir)
      .filter((name) => name.endsWith(".sql"))
      .sort();
    const guide = readFileSync(provisioningDocPath, "utf8");

    for (const migrationFile of migrationFiles) {
      expect(guide).toContain(`\`${migrationFile}\``);
    }
  });
});
