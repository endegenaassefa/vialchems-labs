"use server";

import { redirect } from "next/navigation";
import {
  getAuthEmailRedirectUrl,
  isValidEmail,
  normalizeAuthEmail,
  normalizeAuthText
} from "@/lib/auth-helpers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  buildOpsAuthUrl,
  getStaffSessionState,
  normalizeOpsNextPath,
  STAFF_AUTH_ERROR,
  STAFF_AUTH_STATUS
} from "@/lib/ops";

const SIGNUP_MIN_PASSWORD_LENGTH = 8;

function isOpsSignupEnabled() {
  return process.env.OPS_SIGNUP_ENABLED === "true";
}

export async function login(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect(buildOpsAuthUrl({ error: STAFF_AUTH_ERROR.config }));
  }

  const email = normalizeAuthEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const nextPath = normalizeOpsNextPath(String(formData.get("next") ?? "/ops"));

  if (!email || !password) {
    redirect(
      buildOpsAuthUrl({
        error: STAFF_AUTH_ERROR.credentials,
        next: nextPath
      })
    );
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(
      buildOpsAuthUrl({
        error: STAFF_AUTH_ERROR.auth,
        next: nextPath
      })
    );
  }

  const session = await getStaffSessionState(supabase);
  if (session.kind === "unavailable") {
    await supabase.auth.signOut();
    redirect(buildOpsAuthUrl({ error: STAFF_AUTH_ERROR.config, next: nextPath }));
  }

  if (session.kind === "anonymous") {
    await supabase.auth.signOut();
    redirect(buildOpsAuthUrl({ error: STAFF_AUTH_ERROR.auth, next: nextPath }));
  }

  if (session.kind === "forbidden") {
    await supabase.auth.signOut();
    redirect(
      buildOpsAuthUrl({
        error:
          session.reason === "missing_profile"
            ? STAFF_AUTH_ERROR.profile
            : STAFF_AUTH_ERROR.inactive,
        next: nextPath
      })
    );
  }

  redirect(nextPath);
}

export async function requestStaffAccess(formData: FormData) {
  if (!isOpsSignupEnabled()) {
    redirect(
      buildOpsAuthUrl({
        mode: "signup",
        error: STAFF_AUTH_ERROR.signupDisabled
      })
    );
  }

  const email = normalizeAuthEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const fullName = normalizeAuthText(formData.get("fullName"));
  const organization = normalizeAuthText(formData.get("organization"));

  if (!isValidEmail(email) || password.length < SIGNUP_MIN_PASSWORD_LENGTH || !fullName) {
    redirect(
      buildOpsAuthUrl({
        mode: "signup",
        error: STAFF_AUTH_ERROR.signupCredentials
      })
    );
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect(
      buildOpsAuthUrl({
        mode: "signup",
        error: STAFF_AUTH_ERROR.config
      })
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getAuthEmailRedirectUrl("/ops/login"),
      data: {
        full_name: fullName,
        organization,
        account_type: "staff"
      }
    }
  });

  if (error) {
    redirect(
      buildOpsAuthUrl({
        mode: "signup",
        error: STAFF_AUTH_ERROR.signup
      })
    );
  }

  await supabase.auth.signOut();
  redirect(
    buildOpsAuthUrl({
      mode: "signup",
      status: STAFF_AUTH_STATUS.signupPending
    })
  );
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/ops/login");
}
