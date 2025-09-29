"use client";

import { useEffect } from "react";
import { redirect, RedirectType } from "next/navigation";

import { androidPlayStoreUrl, iosAppStoreUrl } from "./links";

const fallbackUrl = "/";

export default function Download() {
  const userAgent = typeof window !== "undefined" && window.navigator.userAgent;
  const isIOS = userAgent && /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = userAgent && /android/i.test(userAgent);

  useEffect(() => {
    // iOS detection
    if (isIOS) {
      window.open(iosAppStoreUrl, "_blank");
    }

    // Android detection
    else if (isAndroid) {
      window.open(androidPlayStoreUrl, "_blank");
    }

    // Fallback for desktop or other OS
    else {
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
