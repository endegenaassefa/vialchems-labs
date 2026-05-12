import { NextResponse } from "next/server";

import { siteConfig } from "@/lib/content/site";
import {
  hasSupabasePublicEnv,
  hasSupabaseServiceEnv
} from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "mogtrix-labs-site",
      domain: siteConfig.domain,
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "local",
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? "local",
      checks: {
        supabasePublicConfigured: hasSupabasePublicEnv(),
        supabaseServiceConfigured: hasSupabaseServiceEnv()
      },
      timestamp: new Date().toISOString()
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
