/**
 * /signup — server redirect to /register.
 *
 * Spec §3.1 — registration is /register (the multi-section form
 * with full identity / research context / addresses / password /
 * terms). The earlier magic-link-only /signup is replaced; this
 * file stays as a 301 so old bookmarks + the Verify-page CTA
 * continue to land somewhere live.
 */
import { redirect } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-static";

export default function SignupRedirect() {
  redirect("/register");
}
