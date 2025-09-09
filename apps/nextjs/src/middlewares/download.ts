import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// The middleware will only run on paths that match this pattern.
export const config = {
  runtime: "nodejs",
  matcher: [
    /*
     * Match request paths with value `/download`
     */
    "/download",
  ],
};

export async function middleware(request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent");

  const iosUrl = "https://apps.apple.com/us/app/your-app/id123456789";
  const androidUrl =
    "https://play.google.com/store/apps/details?id=com.your.app";
  const fallbackUrl = "https://probable-pitcher.com/";

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
