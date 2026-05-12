import { expect, type Page, test } from "@playwright/test";

async function submitAdminLogin(page: Page) {
  const response = await page.request.post("/api/admin/login", {
    data: { passcode: "mogtrix-demo-admin" }
  });
  expect(response.ok()).toBe(true);
}

async function gotoReady(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
}

test("homepage presents the discovery-first catalog preview", async ({
  page
}) => {
  await gotoReady(page, "/");

  await expect(
    page.getByRole("heading", { name: "Private catalog. No runaround." })
  ).toBeVisible();
  await expect(
    page.getByText(
      "Sign in to view availability, batch records, and order status.",
      { exact: true }
    )
  ).toBeVisible();
  await expect(page.getByText("BPC-157 5mg").first()).toBeVisible();
  await gotoReady(page, "/shop");
  await expect(page).toHaveURL(/\/shop$/);
  await expect(
    page.getByRole("heading", { name: /Research products|Catalog/i })
  ).toBeVisible();
  await expect(page.getByText("Mazdutide 10mg")).toBeVisible();
  await gotoReady(page, "/products/bpc-157-5mg");
  await expect(page).toHaveURL(/\/products\/bpc-157-5mg$/);
  await expect(page.getByRole("heading", { name: "BPC-157 5mg" })).toBeVisible();
  await expect(page.getByText(/Research product details/i)).toBeVisible();
  await expect(page.getByText(/Sign in for pricing|Your price|Temporarily unavailable/i)).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Open COA Library/i }).first()
  ).toBeVisible();
});

test("verification lookup covers found and missing states", async ({ page }) => {
  await page.goto("/coa");

  await page.getByLabel("Batch code").fill("mgx-bpc-2604");
  await page.getByRole("button", { name: /Search/i }).click();
  await expect(page.getByRole("heading", { name: "MGX-BPC-2604" })).toBeVisible();

  await page.getByLabel("Batch code").fill("MGX-NOPE-0000");
  await page.getByRole("button", { name: /Search/i }).click();
  await expect(page.getByText(/No public verification record/i)).toBeVisible();
});

test("checkout requires auth or shows the live checkout shell", async ({ page }) => {
  await page.goto("/checkout");

  if (page.url().includes("/login")) {
    await expect(page.getByRole("heading", { name: /^sign in$/i })).toBeVisible();
    return;
  }

  const emptyCartHeading = page.getByRole("heading", { name: /your cart is empty/i });
  if (await emptyCartHeading.count()) {
    await expect(emptyCartHeading).toBeVisible();
    return;
  }

  await expect(page.getByRole("heading", { name: /shipping and payment/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /your cart is empty|order review/i })).toBeVisible();
});

test("admin route is protected until login", async ({ page }) => {
  await page.goto("/admin");

  await expect(page).toHaveURL(/\/admin\/login$/);
  await submitAdminLogin(page);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Access requests" })).toBeVisible();
});

test("private catalog is protected and opens after login", async ({ page }) => {
  await page.goto("/catalog");

  await expect(page).toHaveURL(/\/admin\/login/);
  await submitAdminLogin(page);
  await page.goto("/catalog");
  await expect(page).toHaveURL(/\/catalog$/);
  await expect(
    page.getByRole("heading", { name: "Canonical catalog review" })
  ).toBeVisible();
  await expect(
    page.getByText(/Catalog review data is unavailable right now.|Visible in qualified shop|Hidden from qualified shop/i)
      .first()
  ).toBeVisible();
});

test("admin catalog uses the canonical metadata review surface", async ({
  page
}) => {
  await page.goto("/admin/login");
  await submitAdminLogin(page);
  await page.goto("/admin");

  await expect(
    page.getByRole("heading", { name: "Catalog controls" })
  ).toBeVisible();
  await expect(
    page.getByText(/Catalog review data is unavailable right now.|Save metadata|Visible in qualified storefront/i)
      .first()
  ).toBeVisible();
});

test("health endpoint reports deploy readiness", async ({ request }) => {
  const response = await request.get("/api/health");
  const body = await response.json();

  expect(response.ok()).toBe(true);
  expect(body).toMatchObject({
    ok: true,
    service: "mogtrix-labs-site",
    domain: "mogtrix.bio"
  });
  expect(body.checks).toEqual(
    expect.objectContaining({
      supabasePublicConfigured: expect.any(Boolean),
      supabaseServiceConfigured: expect.any(Boolean)
    })
  );
});
