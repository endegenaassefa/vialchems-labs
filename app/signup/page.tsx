/**
 * Signup — Phase 5 stub.
 *
 * Phase 8 wires this to Supabase auth (email + password or magic link).
 * Buyer qualification (research role, jurisdiction acknowledgment, RUO commit)
 * will live on a follow-up onboarding page after first sign-in.
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
  title: 'Create account',
};

export default function SignupPage() {
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
              Create your account
            </h1>

            <Card className="p-6">
              <form className="space-y-4">
                <div>
                  <FieldLabel htmlFor="signup-email" required>
                    Email
                  </FieldLabel>
                  <div className="mt-2">
                    <Input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel htmlFor="signup-password" required>
                    Password
                  </FieldLabel>
                  <div className="mt-2">
                    <Input
                      id="signup-password"
                      type="password"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Create account
                </Button>
                <p className="text-center font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                  Phase 5 stub · Supabase auth wiring in Phase 8
                </p>
              </form>
            </Card>

            <p className="mt-6 text-[14px] text-[var(--text-muted)] text-center">
              Already have an account?{' '}
              <Link href="/login" className="text-[var(--accent)] hover:text-[var(--accent-soft)]">
                Sign in →
              </Link>
            </p>
            <p className="mt-6 text-[12px] text-[var(--text-subtle)] leading-[1.55]">
              By creating an account, you agree to our{' '}
              <Link href="/legal/terms" className="text-[var(--text-muted)] underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/legal/privacy" className="text-[var(--text-muted)] underline">
                Privacy Policy
              </Link>
              . You confirm you are 21+ and will use any products purchased solely
              for laboratory research in non-clinical settings.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
