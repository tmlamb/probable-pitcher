import { Platform, UIManager, View } from "react-native";
import Constants from "expo-constants";
import { Slot } from "expo-router";
import * as Sentry from "@sentry/react-native";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "~/utils/api";

import "~/global.css";

const { sentryPublicDsn } = Constants.expoConfig?.extra ?? {};
if (sentryPublicDsn) {
  Sentry.init({
    dsn: String(sentryPublicDsn),

    // TODO uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: __DEV__,
  });
}

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function RootLayout() {
  //TODO Fetch updates in background! https://expo.dev/changelog/sdk-53#improved-background-tasks

  return (
    <View className="bg-background flex-1">
      <QueryClientProvider client={queryClient}>
        <Slot />
      </QueryClientProvider>
    </View>
  );
}
