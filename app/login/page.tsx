/**
 * Login — Phase 5 stub.
 *
 * Form renders email + password inputs, but submit is a no-op until Supabase
 * auth ports in Phase 8 (deferred from Phase 3 per dispatch). Magic-link flow
 * will replace password by default once the SSR client lands.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Card } from '@/components/ui/Card';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section>
          <div className="mx-auto max-w-md px-6 py-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-3">
              Account
            </p>
            <h1 className="text-[32px] font-light tracking-tight text-[var(--text)] mb-6">
              Sign in
            </h1>

            <Card className="p-6">
              <form className="space-y-4">
                <div>
                  <FieldLabel htmlFor="login-email" required>
                    Email
                  </FieldLabel>
                  <div className="mt-2">
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel htmlFor="login-password" required>
                    Password
                  </FieldLabel>
                  <div className="mt-2">
                    <Input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Sign in
                </Button>
                <p className="text-center font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                  Phase 5 stub · Supabase auth wiring in Phase 8
                </p>
              </form>
            </Card>

            <p className="mt-6 text-[14px] text-[var(--text-muted)] text-center">
              No account yet?{' '}
              <Link href="/signup" className="text-[var(--accent)] hover:text-[var(--accent-soft)]">
                Create one →
              </Link>
            </p>
            <p className="mt-2 text-[14px] text-[var(--text-muted)] text-center">
              <Link href="/contact" className="text-[var(--text-muted)] hover:text-[var(--accent)]">
                Trouble signing in?
              </Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
