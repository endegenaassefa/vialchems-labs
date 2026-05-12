import type { Metadata } from "next";

import { AdminLoginForm } from "@/components/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Login"
};

function safeRedirect(next?: string) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/admin";
  }

  return next;
}

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = safeRedirect(params?.next);

  return (
    <section className="section">
      <div className="container form-layout">
        <article className="info-card">
          <h1>Admin review</h1>
          <p>
            Production should use Supabase Auth and an admin profile role. The
            passcode path exists so local development and design review can test
            the protected route without a configured Supabase project.
          </p>
        </article>
        <AdminLoginForm redirectTo={redirectTo} />
      </div>
    </section>
  );
}
