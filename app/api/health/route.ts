import { NextResponse } from 'next/server';

/**
 * Health check endpoint per SUPER_PROMPT_v3 Phase 3 + Phase 14.
 *
 * Used by Vercel canary, /api/health monitor, and /land-and-deploy verification.
 * Returns minimal information; does NOT expose internals.
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'vialchems-labs',
    time: new Date().toISOString(),
  });
}
