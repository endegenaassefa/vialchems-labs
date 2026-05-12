import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getCustomerAccessState, getCustomerRouteDecision } from "@/lib/customer";
import { getBrowserSupabaseConfig, type SupabaseEnv } from "@/lib/supabase/env";

export async function updateSession(request: NextRequest) {
  const browser = getBrowserSupabaseConfig(process.env as SupabaseEnv);
  if (!browser.configured) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(browser.url!, browser.key!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        response.headers.set("Cache-Control", "private, no-store");
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isOpsPath = pathname === "/ops" || pathname.startsWith("/ops/");
  if (!isOpsPath) {
    const state = await getCustomerAccessState(supabase);
    const decision = getCustomerRouteDecision(pathname, state);
    if (decision.action === "redirect") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = decision.location.split("?")[0] ?? decision.location;
      redirectUrl.search = "";
      const queryIndex = decision.location.indexOf("?");
      if (queryIndex >= 0) {
        redirectUrl.search = decision.location.slice(queryIndex);
      }
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  const isLoginRoute = request.nextUrl.pathname === "/ops/login";
  if (!user && !isLoginRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/ops/login";
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && isLoginRoute) {
    const opsUrl = request.nextUrl.clone();
    opsUrl.pathname = "/ops";
    opsUrl.search = "";
    return NextResponse.redirect(opsUrl);
  }

  return response;
}
