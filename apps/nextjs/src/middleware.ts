import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@probable/auth";

// The middleware will only run on paths that match this pattern.
export const config = {
  runtime: "nodejs",
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the root path, if you want it public)
     * - /sign-in (the sign-in page)
     * - /terms (the terms of service page)
     * - /privacy (the privacy policy page)
     * - /support (the support page)
     */
    "/((?!api|_next/static|_next/image|images|favicon.ico|sign-in|terms|privacy|support).*)",
  ],
};

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/download") {
    return download(request);
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

async function download(request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent");

  const iosUrl = "https://apps.apple.com/us/app/probable-pitcher/id6443663031";
  const androidUrl =
    "https://play.google.com/store/apps/details?id=com.triplesight.probablepitchers";
  const fallbackUrl = "/";

  // iOS detection
  if (userAgent && /iPad|iPhone|iPod/.test(userAgent)) {
    return NextResponse.redirect(new URL(iosUrl, request.url));
  }

  // Android detection
  if (userAgent && /android/i.test(userAgent)) {
    return NextResponse.redirect(new URL(androidUrl, request.url));
  }

  // Fallback for desktop or other OS
  return NextResponse.redirect(new URL(fallbackUrl, request.url));
}
