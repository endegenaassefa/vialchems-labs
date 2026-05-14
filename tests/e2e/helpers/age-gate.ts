import { expect, type Page } from "@playwright/test";
import {
  AGE_VERIFICATION_COOKIE,
  AGE_VERIFICATION_MAX_AGE_SECONDS,
  signAgeVerification,
} from "../../../lib/age-verification";

export async function passAgeGate(page: Page): Promise<void> {
  const verifiedAt = new Date().toISOString();
  const port = process.env.PLAYWRIGHT_PORT ?? "3200";
  const url = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;

  await page.context().addCookies([
    {
      name: AGE_VERIFICATION_COOKIE,
      value: await signAgeVerification(verifiedAt),
      url,
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      expires: Math.floor(Date.now() / 1000) + AGE_VERIFICATION_MAX_AGE_SECONDS,
    },
  ]);
  expect(await page.context().cookies(url)).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: AGE_VERIFICATION_COOKIE }),
    ]),
  );
}
