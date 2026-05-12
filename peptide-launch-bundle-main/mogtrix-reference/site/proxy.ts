import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/ops/:path*",
    "/shop/:path*",
    "/products/:path*",
    "/cart/:path*",
    "/request/:path*",
    "/checkout/:path*",
    "/account/:path*",
    "/login",
    "/signup",
    "/qualify"
  ]
};
