import Constants from "expo-constants";
import { Slot } from "expo-router";
import * as Sentry from "@sentry/react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { useDeviceContext } from "twrnc";

import Background from "~/components/Background";
import { queryClient } from "~/utils/api";
import tw from "~/utils/tailwind";

const { sentryPublicDsn, appEnv } = Constants.expoConfig?.extra ?? {};
if (sentryPublicDsn) {
  Sentry.init({
    dsn: String(sentryPublicDsn),
    debug: appEnv !== "production",

    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: __DEV__,
  });
}

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  useDeviceContext(tw);

  //TODO Fetch updates in background! https://expo.dev/changelog/sdk-53#improved-background-tasks

  //if (Platform.OS === "android") {
  // Necessary for localization of date times on Android?
  //require("@formatjs/intl-getcanonicallocales/polyfill").default;
  //require("@formatjs/intl-locale/polyfill").default;
  //require("@formatjs/intl-pluralrules/polyfill").default;
  //require("@formatjs/intl-pluralrules/locale-data/en").default;
  //require("@formatjs/intl-numberformat/polyfill").default;
  //require("@formatjs/intl-numberformat/locale-data/en").default;
  //require("@formatjs/intl-datetimeformat/polyfill").default;
  //require("@formatjs/intl-datetimeformat/locale-data/en").default;
  //require("@formatjs/intl-datetimeformat/add-all-tz").default;
  //}

  return (
    <QueryClientProvider client={queryClient}>
      <Background>
        <Slot />
      </Background>
    </QueryClientProvider>
  );
}
