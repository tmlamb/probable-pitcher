import PostHog from "posthog-react-native";

import { getBaseUrl } from "./base-url";

const { posthogApiKey } = Constants.expoConfig?.extra ?? {};

export const posthog = new PostHog(posthogApiKey, {
  host: `${getBaseUrl()}/pt`,
});
