import posthog from "posthog-js";

import { env } from "./env";

console.log("PostHog API Key:", env.NEXT_PUBLIC_POSTHOG_API_KEY);

if (env.NEXT_PUBLIC_POSTHOG_API_KEY) {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_API_KEY, {
    api_host: "/pt",
    defaults: "2025-11-30",
  });
}
