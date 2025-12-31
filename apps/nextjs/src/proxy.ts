import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "~/auth/server";

// The proxy will only run on paths that match this pattern.
export const config = {
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
     * - /download (the download redirect page)
     * - /pt (PostHog endpoint)
     */
    "/((?!api|_next/static|_next/image|images|favicon.ico|sign-in|terms|privacy|support|download|pt).*)",
  ],
};

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}
