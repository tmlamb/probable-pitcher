import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// This line tells Next.js which runtime to use.
// export const runtime = "nodejs"; // The default is 'edge'

// The middleware will only run on paths that match this pattern.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the root path, if you want it public)
     * - /signin (the signin page)
     * - /terms (the terms of service page)
     * - /privacy (the privacy policy page)
     * - /support (the support page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|signin|terms|privacy|support).*)",
  ],
};

export function middleware(request: NextRequest) {
  const cookies = getSessionCookie(request, {
    cookiePrefix: "probable-pitcher",
  });

  // 2. If the cookie doesn't exist, redirect to the signin page.
  if (!cookies) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 3. If the cookie exists, allow the request to proceed.
  return NextResponse.next();
}
