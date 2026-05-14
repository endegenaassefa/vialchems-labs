import { NextRequest, NextResponse } from "next/server";
import {
  AGE_GATE_PATH,
  AGE_VERIFICATION_COOKIE,
  isSignedAgeVerificationCurrent,
} from "@/lib/age-verification";

const PUBLIC_FILE =
  /\.(?:avif|css|gif|ico|jpg|jpeg|js|json|map|mp4|pdf|png|svg|txt|webp|xml)$/i;

const BLOCKED_AI_USER_AGENTS =
  /\b(?:AI2Bot|Amazonbot|anthropic-ai|Applebot-Extended|Bytespider|CCBot|ChatGPT-User|Claude-Web|ClaudeBot|cohere-ai|Diffbot|FacebookBot|Google-Extended|GPTBot|meta-externalagent|MistralAI-User|OAI-SearchBot|omgili|PerplexityBot|Perplexity-User|YouBot)\b/i;

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const userAgent = request.headers.get("user-agent") ?? "";

  if (BLOCKED_AI_USER_AGENTS.test(userAgent)) {
    return new NextResponse("Forbidden", {
      status: 403,
      headers: {
        "X-Robots-Tag": "noai, noimageai, noindex, nofollow",
      },
    });
  }

  if (
    pathname === AGE_GATE_PATH ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const verifiedAt = request.cookies.get(AGE_VERIFICATION_COOKIE)?.value;
  if (await isSignedAgeVerificationCurrent(verifiedAt).catch(() => false)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = AGE_GATE_PATH;
  url.search = "";
  url.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
