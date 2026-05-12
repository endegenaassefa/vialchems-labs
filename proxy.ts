import { NextRequest, NextResponse } from "next/server";
import {
  AGE_GATE_PATH,
  AGE_VERIFICATION_COOKIE,
  isSignedAgeVerificationCurrent,
} from "@/lib/age-verification";

const PUBLIC_FILE =
  /\.(?:avif|css|gif|ico|jpg|jpeg|js|json|map|mp4|pdf|png|svg|txt|webp|xml)$/i;

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

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
