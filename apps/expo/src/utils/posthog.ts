import Constants from "expo-constants";
import PostHog from "posthog-react-native";

import { getBaseUrl } from "./base-url";

const { posthogApiKey } = Constants.expoConfig?.extra ?? {};

export const posthog = new PostHog(String(posthogApiKey), {
  host: `${getBaseUrl()}/pt`,
});
