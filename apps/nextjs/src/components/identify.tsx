"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

import { authClient } from "~/auth/client";

export function IdentifyUser() {
  const session = authClient.useSession();
  useEffect(() => {
    if (session.data?.user.id) {
      posthog.identify(session.data.user.id);
    }
  }, [session.data?.user.id, session.data?.user.email]);

  return null;
}
