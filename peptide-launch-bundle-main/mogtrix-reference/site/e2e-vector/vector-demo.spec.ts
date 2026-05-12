import { expect, test, type Page } from "@playwright/test";

const pages = [
  "/about.html",
  "/account.html",
  "/affiliate.html",
  "/blog/index.html",
  "/blog/peptide-storage-best-practices.html",
  "/blog/understanding-purity-testing.html",
  "/cart.html",
  "/checkout.html",
  "/coa.html",
  "/contact.html",
  "/faq.html",
  "/index.html",
  "/login.html",
  "/mta.html",
  "/order-confirmation.html",
  "/privacy.html",
  "/products/bacteriostatic-water-30ml.html",
  "/products/bpc-157-5mg.html",
  "/products/cagrilintide-5mg.html",
  "/products/retatrutide-10mg.html",
  "/products/semaglutide-5mg.html",
  "/products/tirzepatide-10mg.html",
  "/refund-policy.html",
  "/register.html",
  "/shipping-and-returns.html",
  "/shop.html",
  "/terms.html",
  "/testing.html"
];

async function seedGate(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("vbsc_cookie_consent", "essential");
    window.localStorage.setItem("vbsc_age_confirmed", new Date().toISOString());
  });
}

async function drawSignature(page: Page, selector: string) {
  const canvas = page.locator(selector);
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  if (!box) throw new Error(`Signature canvas ${selector} not visible`);
  const startX = box.x + Math.min(24, box.width * 0.18);
  const startY = box.y + Math.min(24, box.height * 0.2);
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.28);
  await page.mouse.move(box.x + box.width * 0.58, box.y + box.height * 0.52);
  await page.mouse.up();
}

async function createDemoUser(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "vbsc_user",
      JSON.stringify({
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@example.test",
        hashedPassword: window.btoa("research123salt"),
        industry: "Biotech",
        credential: "PhD",
        signatureDataUrl: "data:image/png;base64,demo",
        registeredAt: new Date().toISOString()
      })
    );
  });
}

test("first visit requires cookie banner and age gate before page access", async ({
  page
}) => {
  await page.goto("/index.html");

  await expect(page.locator("#cookie-banner")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Premium Research Material" })).not.toBeVisible();

  await page.getByRole("button", { name: "Essential Only" }).click();
  await expect(page.locator("#age-gate")).toBeVisible();
  await page.getByLabel("Are you 21 years of age or older?").check();
  await page
    .getByLabel("Are you a qualified researcher operating in a controlled laboratory environment?")
    .check();
  await page.getByRole("button", { name: "Confirm access" }).click();

  await expect(page.getByRole("heading", { name: "Premium Research Material" })).toBeVisible();
  const logLength = await page.evaluate(
    () => JSON.parse(window.localStorage.getItem("vbsc_consent_log") || "[]").length
  );
  expect(logLength).toBeGreaterThanOrEqual(2);
});

test("all pages render without browser errors and keep local navigation", async ({
  page
}) => {
  await seedGate(page);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  for (const target of pages) {
    await page.goto(target);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator(".site-header")).toBeVisible();
    await expect(page.locator(".site-footer")).toBeVisible();
  }

  expect(errors).toEqual([]);
});

test("registration stages reveal progressively and account shows consent record", async ({
  page
}) => {
  await seedGate(page);
  await page.goto("/register.html");

  await page.getByLabel("First name").fill("Ada");
  await page.getByLabel("Last name").fill("Lovelace");
  await page.getByLabel("Email").fill("ada@example.test");
  await page.getByLabel("Password", { exact: true }).fill("research123");
  await page.getByLabel("Confirm password").fill("mismatch");
  await expect(page.locator('[data-stage="2"]')).toBeHidden();

  await page.getByLabel("Confirm password").fill("research123");
  await expect(page.locator('[data-stage="2"]')).toBeVisible();
  await page.locator('select[name="industry"]').selectOption("Biotech");
  await expect(page.locator('[data-stage="3"]')).toBeVisible();
  await page.locator('select[name="credential"]').selectOption("PhD");
  await expect(page.locator('[data-stage="4"]')).toBeVisible();
  await page.getByLabel(/I, Ada Lovelace/).check();
  await expect(page.locator('[data-stage="5"]')).toBeVisible();
  await expect(page.getByRole("button", { name: "Create Account" })).toBeDisabled();

  await drawSignature(page, "#sig-pad");
  await expect(page.getByRole("button", { name: "Create Account" })).toBeEnabled();
  await page.getByRole("button", { name: "Create Account" }).click();

  await expect(page).toHaveURL(/account\.html\?welcome=1/);
  await expect(page.getByText("Ada Lovelace")).toBeVisible();
  await expect(page.getByText("Bundled attestation accepted")).toBeVisible();
});

test("cart thresholds add free gift and checkout writes 17 agreement records", async ({
  page
}) => {
  await seedGate(page);
  await createDemoUser(page);

  await page.goto("/products/retatrutide-10mg.html");
  await page.getByLabel("Quantity").fill("3");
  await page.getByRole("button", { name: "Add to Cart" }).first().click();
  await page.goto("/cart.html");
  await expect(page.locator("#cart-page-items").getByText("Bacteriostatic Water 30mL")).toBeVisible();
  await expect(page.locator(".cart-layout").getByText("free shipping unlocked")).toBeVisible();
  await expect(page.locator("[data-cart-shipping]")).toHaveText("Free");

  await page.goto("/checkout.html");
  await expect(page).toHaveURL(/mta\.html\?next=\/checkout\.html/);
  await page.getByLabel(/By typing my full legal name/).fill("Ada Lovelace");
  await drawSignature(page, "#mta-sig-pad");
  await page.getByRole("button", { name: "Sign and Return" }).click();
  await expect(page).toHaveURL(/checkout\.html/);

  await page.getByLabel("Full name").fill("Ada Lovelace");
  await page.getByLabel("Address").fill("30 N Gould St Ste R");
  await page.getByLabel("City").fill("Sheridan");
  await page.getByLabel("ZIP").fill("82801");
  await page.getByLabel("Phone").fill("3075550194");
  await expect(page.getByRole("button", { name: "Place Order" })).toBeDisabled();
  await page.getByLabel(/I confirm I have read and agree/).check();
  await expect(page.getByRole("button", { name: "Place Order" })).toBeEnabled();
  await page.getByPlaceholder("Card number (visual only)").fill("4111111111111111");
  await page.getByRole("button", { name: "Place Order" }).click();

  await expect(page).toHaveURL(/order-confirmation\.html\?order=VBSC-/);
  await expect(page.getByText("Audit Trail Available.")).toBeVisible();
  const stored = await page.evaluate(() => ({
    orders: window.localStorage.getItem("vbsc_orders") || "",
    log: JSON.parse(window.localStorage.getItem("vbsc_consent_log") || "[]")
  }));
  expect(stored.orders).not.toContain("4111111111111111");
  expect(stored.log.filter((entry: { orderId?: string }) => entry.orderId).length).toBe(17);

  await page.getByRole("link", { name: "View Your Consent Record" }).click();
  await expect(page).toHaveURL(/account\.html#consent-record/);
  await expect(page.getByText("tos-chargeback-fee")).toBeVisible();
});

test("contact blacklist blocks later registration for the same email", async ({
  page
}) => {
  await seedGate(page);
  await page.goto("/contact.html");

  await page.getByLabel("Name").fill("Ada Lovelace");
  await page.getByLabel("Email").fill("blocked@example.test");
  await page.getByLabel("Message").fill("Can you provide dosage guidance?");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByRole("heading", { name: "Refusal to Provide Guidelines." })).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page).toHaveURL(/faq\.html#dosing-question/);

  await page.goto("/register.html");
  await page.getByLabel("First name").fill("Blocked");
  await page.getByLabel("Last name").fill("Researcher");
  await page.getByLabel("Email").fill("blocked@example.test");
  await page.getByLabel("Password", { exact: true }).fill("research123");
  await page.getByLabel("Confirm password").fill("research123");
  await page.locator('select[name="industry"]').selectOption("Biotech");
  await page.locator('select[name="credential"]').selectOption("PhD");
  await page.getByLabel(/I, Blocked Researcher/).check();
  await drawSignature(page, "#sig-pad");
  await page.getByRole("button", { name: "Create Account" }).click();
  await expect(page.getByText("We are unable to process your registration at this time.")).toBeVisible();
});

test("responsive viewports do not create horizontal overflow", async ({ page }) => {
  await seedGate(page);
  for (const viewport of [
    { width: 360, height: 780 },
    { width: 768, height: 900 },
    { width: 1280, height: 900 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/index.html");
    await expect(page.getByRole("heading", { name: "Premium Research Material" })).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(2);
  }
});
