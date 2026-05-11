'use client';

/**
 * Sign in — v1.3 real localStorage-backed login.
 *
 * Verifies email + password against the lib/auth-store.ts user map. On
 * success, sets currentEmail and routes to /account. Multi-user-per-device.
 *
 * v4 D2 deferral closes when Supabase auth wires in Phase 10; this page
 * won't need to change because the useAuthStore.login() API stays the same.
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
      router.push('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.');
      setSubmitting(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section>
          <div className="mx-auto max-w-md px-6 py-32 md:py-40">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-6">
              S I G N · I N
            </p>
            <h1 className="text-[clamp(36px,5vw,56px)] font-light tracking-tight leading-[1.05] text-[var(--text)] mb-6">
              <span className="block">Welcome</span>
              <span className="font-serif-italic block text-[var(--accent-soft)]">
                back.
              </span>
            </h1>
            <p className="text-[15px] leading-[1.6] text-[var(--text-muted)] mb-8">
              Pick up where you left off — qualification status, saved addresses, and order history.
            </p>

            <Card variant="elevated" className="p-6">
              <form onSubmit={onSubmit} className="space-y-5" noValidate>
                <div>
                  <FieldLabel htmlFor="login-email" required>
                    Email
                  </FieldLabel>
                  <div className="mt-2">
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {error ? (
                  <div
                    role="alert"
                    className="rounded-[var(--radius-md)] border border-[var(--pill-error)] px-4 py-3 text-[13px] text-[var(--pill-error)]"
                  >
                    {error}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? 'Signing in…' : 'Sign in'}
                </Button>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <Pill variant="info">Pre-launch</Pill>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                    Server auth wires before public launch
                  </span>
                </div>
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
