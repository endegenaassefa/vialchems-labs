"use server";

import { redirect } from "next/navigation";
import {
  buildAuthUrl,
  getAuthEmailRedirectUrl,
  isValidEmail,
  normalizeAuthEmail,
  normalizeAuthText
} from "@/lib/auth-helpers";
import {
  parseCustomerQualificationForm,
  updateCustomerProfileQualification,
  upsertCustomerQualification
} from "@/lib/customer-qualification";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCustomerAccessState, normalizeCustomerNextPath } from "@/lib/customer";

const CUSTOMER_MIN_PASSWORD_LENGTH = 8;

function customerAuthUrl(
  pathname: "/login" | "/signup" | "/qualify",
  params?: { error?: string; status?: string; next?: string }
) {
  return buildAuthUrl(pathname, {
    error: params?.error,
    status: params?.status,
    next: params?.next,
    normalizeNextPath: normalizeCustomerNextPath
  });
}

export async function loginCustomer(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect(customerAuthUrl("/login", { error: "config" }));
  }

  const email = normalizeAuthEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const nextPath = normalizeCustomerNextPath(String(formData.get("next") ?? "/shop"));

  if (!email || !password) {
    redirect(customerAuthUrl("/login", { error: "credentials", next: nextPath }));
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(customerAuthUrl("/login", { error: "auth", next: nextPath }));
  }

  const state = await getCustomerAccessState(supabase);
  if (state.kind === "forbidden") {
    await supabase.auth.signOut();
    redirect(customerAuthUrl("/login", { error: "access", next: nextPath }));
  }

  if (state.kind === "unverified") {
    redirect(customerAuthUrl("/login", { status: "verify", next: nextPath }));
  }

  if (state.kind === "unqualified") {
    redirect(customerAuthUrl("/qualify", { next: nextPath }));
  }

  redirect(nextPath);
}

export async function signupCustomer(formData: FormData) {
  const email = normalizeAuthEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const fullName = normalizeAuthText(formData.get("fullName"));
  const organization = normalizeAuthText(formData.get("organization"));

  if (!isValidEmail(email) || password.length < CUSTOMER_MIN_PASSWORD_LENGTH || !fullName) {
    redirect(customerAuthUrl("/signup", { error: "credentials" }));
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect(customerAuthUrl("/signup", { error: "config" }));
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getAuthEmailRedirectUrl("/auth/callback"),
      data: {
        full_name: fullName,
        organization,
        account_type: "customer"
      }
    }
  });

  if (error) {
    redirect(customerAuthUrl("/signup", { error: "signup" }));
  }

  await supabase.auth.signOut();
  redirect(`/verify?email=${encodeURIComponent(email)}`);
}

export async function signOutCustomer() {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect(customerAuthUrl("/login", { status: "signed_out" }));
}

export async function completeCustomerQualification(formData: FormData) {
  const nextPath = normalizeCustomerNextPath(String(formData.get("next") ?? "/shop"));
  const parsed = parseCustomerQualificationForm(formData);

  if (!parsed.success) {
    redirect(customerAuthUrl("/qualify", { error: "required", next: nextPath }));
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect(customerAuthUrl("/login", { error: "config", next: nextPath }));
  }

  const state = await getCustomerAccessState(supabase);
  if (state.kind === "anonymous") {
    redirect(customerAuthUrl("/login", { next: nextPath }));
  }
  if (state.kind === "unavailable") {
    redirect(customerAuthUrl("/login", { error: "config", next: nextPath }));
  }
  if (state.kind === "unverified") {
    redirect(customerAuthUrl("/login", { error: "verify", next: nextPath }));
  }
  if (state.kind === "forbidden") {
    await supabase.auth.signOut();
    redirect(customerAuthUrl("/login", { error: "access", next: nextPath }));
  }
  if (state.kind === "ready") {
    redirect(nextPath);
  }

  const qualificationError = await upsertCustomerQualification(
    supabase,
    state.user.id,
    parsed.data
  );
  if (qualificationError) {
    redirect(customerAuthUrl("/qualify", { error: "save", next: nextPath }));
  }

  const profileError = await updateCustomerProfileQualification(
    supabase,
    state.user.id,
    parsed.data.institutionName
  );

  if (profileError) {
    redirect(customerAuthUrl("/qualify", { error: "save", next: nextPath }));
  }

  redirect(nextPath);
}
