import { expect, type Page, test } from "@playwright/test";

async function gotoReady(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
}

test("home and protected catalog routes respect the current customer gate", async ({ page, isMobile }) => {
  await gotoReady(page, "/");
  const authGateLink = page.getByRole("link", { name: /sign in for full access/i });

  if (await authGateLink.count()) {
    if (isMobile) {
      await authGateLink.tap();
    } else {
      await authGateLink.click();
    }
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();

    await gotoReady(page, "/checkout");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    return;
  }

  const demoEntryLink = page.getByRole("link", { name: /browse catalog preview/i });
  if (await demoEntryLink.count()) {
    if (isMobile) {
      await demoEntryLink.tap();
    } else {
      await demoEntryLink.click();
    }
  } else {
    await gotoReady(page, "/shop");
  }
  await expect(page).toHaveURL(/\/shop/);
  await gotoReady(page, "/products/bpc-157-5mg");
  if (page.url().includes("/login")) {
    await expect(page.getByRole("heading", { name: /sign in to mogtrix/i })).toBeVisible();
    return;
  }

  const addToCartButton = page.getByRole("button", { name: /add to cart/i });
  if (await addToCartButton.count()) {
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();
    await page.getByRole("link", { name: /open cart/i }).click();
    await page.getByRole("link", { name: /continue to checkout/i }).click();
    await expect(page.getByRole("heading", { name: /shipping and payment/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /order review/i })).toBeVisible();
    return;
  }

  await expect(page.getByText(/Sign in for pricing|Finish your account setup|This account is not currently approved/i)).toBeVisible();
});

test("mobile renders the catalog proof visuals", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile-only check");
  await gotoReady(page, "/");
  await expect(page.getByText("Current catalog proof")).toBeVisible();
  await expect(page.getByText("BPC-157 5mg")).toBeVisible();
});

test("staff footer entry opens noindexed ops access with pending signup", async ({ page }) => {
  await gotoReady(page, "/legal");
  await page.getByRole("link", { name: "Staff", exact: true }).click();

  await expect(page).toHaveURL(/\/ops\/login/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();

  await gotoReady(page, "/ops/login?mode=signup");
  await expect(page.getByRole("heading", { name: "Request access" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Request staff access" })).toBeVisible();
});
