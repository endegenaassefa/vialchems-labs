import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { buildAuthUrl } from "@/lib/auth-helpers";
import {
  getCustomerAccessState,
  normalizeCustomerNextPath
} from "@/lib/customer";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const code = url.searchParams.get("code");
  const nextPath = normalizeCustomerNextPath(url.searchParams.get("next"));

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.redirect(
      new URL(buildAuthUrl("/login", { error: "config", next: nextPath }), url)
    );
  }

  let verificationError: { message?: string } | null = null;

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash
    });
    verificationError = error;
  } else if (code && "exchangeCodeForSession" in supabase.auth) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    verificationError = error;
  }

  if (verificationError) {
    return NextResponse.redirect(
      new URL(buildAuthUrl("/login", { error: "verify", next: nextPath }), url)
    );
  }

  const state = await getCustomerAccessState(supabase);

  if (state.kind === "ready") {
    return NextResponse.redirect(new URL(nextPath, url));
  }

  if (state.kind === "unqualified") {
    return NextResponse.redirect(
      new URL(buildAuthUrl("/qualify", { next: nextPath }), url)
    );
  }

  return NextResponse.redirect(
    new URL(buildAuthUrl("/login", { status: "verified", next: nextPath }), url)
  );
}
