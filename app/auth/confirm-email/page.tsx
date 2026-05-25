/**
 * GET /auth/confirm-email — server component landing for the
 * registration HMAC token (spec §3.2).
 *
 * Flow:
 *   1. Parse + verify the token (purpose='confirm-email').
 *   2. Mark Supabase auth user as email-confirmed.
 *   3. Flip the customer_profiles row from
 *      pending_email_verification → active (email_confirmed_at=now()).
 *   4. Render a "Your email is verified — sign in" panel with a
 *      single CTA → /login?confirmed=1&next=/account?welcome=1.
 *      We intentionally do NOT auto-establish the session here:
 *      the email token lives in their inbox and the link works
 *      cross-device. If the click lands in a different browser
 *      than the one they registered in, the safest UX is to ask
 *      them to sign in.
 *
 * On failure (missing/expired/tampered/wrong-purpose token) we
 * render a generic "this link is invalid or expired" panel that
 * offers Resend confirmation + Sign in. We intentionally do NOT
 * surface why it failed — would leak token state.
 */
import Link from "next/link";
import { headers } from "next/headers";
import { processConfirmation } from "@/lib/auth/account-server";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { buttonClassNames } from "@/components/ui/Button";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  // Touch the headers to mark this page as truly dynamic so Next
  // doesn't try to prerender the success/failure variants.
  await headers();
  const params = await searchParams;
  const result = await processConfirmation(params.token);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-16">
        <Card>
          {result.ok ? (
            <div className="flex flex-col gap-4 p-6 text-center">
              <Pill variant="electric">Verified</Pill>
              <h1 className="text-2xl font-semibold">Your email is confirmed</h1>
              <p className="text-sm text-slate-600">
                {result.email
                  ? `We've activated the account for ${result.email}.`
                  : "Your account is now active."}{" "}
                Sign in to land on your dashboard.
              </p>
              <Link
                href={`/login?confirmed=1&next=${encodeURIComponent("/account?welcome=1")}`}
                className={buttonClassNames("primary", "md")}
              >
                Sign in
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4 p-6 text-center">
              <Pill variant="error">Link unavailable</Pill>
              <h1 className="text-2xl font-semibold">
                This link can&rsquo;t be used
              </h1>
              <p className="text-sm text-slate-600">
                It may have expired (links are valid for 24 hours) or already
                been used. You can request a fresh confirmation link from the
                sign-in page, or sign in if your account is already active.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Link
                  href="/login"
                  className={buttonClassNames("primary", "md")}
                >
                  Sign in
                </Link>
                <Link
                  href="/login?action=resend"
                  className={buttonClassNames("ghost", "md")}
                >
                  Resend confirmation
                </Link>
              </div>
            </div>
          )}
        </Card>
      </main>
      <SiteFooter />
    </>
  );
}
