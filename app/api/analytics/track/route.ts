/**
 * D4 — Server-side analytics proxy route
 * (Section 6 super-prompt 2026-05-22).
 *
 * Lets a client component or server-side caller fire a Plausible event
 * that needs to be attributed to a specific URL or carry server-known
 * props (totals, provider, etc.) without exposing the Plausible call
 * surface to arbitrary client code.
 *
 * Always returns 200 (or 4xx for malformed bodies) — analytics
 * failures never bubble into a user-visible code path. The actual
 * tracking outcome is captured via trackServerEvent's logged shape.
 */
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { trackServerEvent } from "@/lib/analytics/server-track";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  event: z.string().trim().min(1).max(80),
  props: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .optional(),
  url: z.string().url().optional(),
});

export async function POST(request: NextRequest) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_json" },
      { status: 400 },
    );
  }
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, code: "invalid_body" },
      { status: 400 },
    );
  }
  const visitorIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined;
  const userAgent = request.headers.get("user-agent") ?? undefined;
  await trackServerEvent({ ...parsed.data, visitorIp, userAgent });
  return NextResponse.json({ ok: true }, { status: 200 });
}
