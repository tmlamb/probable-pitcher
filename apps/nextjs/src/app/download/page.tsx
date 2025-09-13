"use client";

import { useEffect } from "react";
import { redirect, RedirectType } from "next/navigation";

const iosUrl = "https://apps.apple.com/us/app/probable-pitcher/id6443663031";
const androidUrl =
  "https://play.google.com/store/apps/details?id=com.triplesight.probablepitchers";
const fallbackUrl = "/";

export default function Download() {
  const userAgent = typeof window !== "undefined" && window.navigator.userAgent;
  const isIOS = userAgent && /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = userAgent && /android/i.test(userAgent);

  useEffect(() => {
    // iOS detection
    if (isIOS) {
      // return NextResponse.redirect(new URL(iosUrl, request.url));
      redirect(iosUrl, RedirectType.replace);
    }

    // Android detection
    else if (isAndroid) {
      // return NextResponse.redirect(new URL(androidUrl, request.url));
      redirect(androidUrl, RedirectType.replace);
    }

    // Fallback for desktop or other OS
    else {
      // return NextResponse.redirect(new URL(fallbackUrl, request.url));
      redirect(fallbackUrl, RedirectType.replace);
    }
  }, [isAndroid, isIOS]);
  return (
    <main className="container mx-auto flex min-h-screen max-w-7xl flex-col items-start justify-start space-y-4 px-3 py-8 sm:px-8">
      {isIOS && <iframe src="probablepitcher://" width="0" height="0"></iframe>}
      <div className="flex max-w-prose flex-col space-y-4">
        <p className="font-bold">Redirecting you to the correct app store...</p>
      </div>
    </main>
  );
}
