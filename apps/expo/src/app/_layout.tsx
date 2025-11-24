import {
  AppState,
  PixelRatio,
  Platform,
  Text,
  UIManager,
  View,
} from "react-native";
import Constants from "expo-constants";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
import * as Sentry from "@sentry/react-native";
import { focusManager, QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "~/utils/api";

import "~/global.css";

import { useEffect, useRef } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Card from "~/components/Card";
import PressableThemed from "~/components/PressableThemed";

const { sentryPublicDsn } = Constants.expoConfig?.extra ?? {};
if (sentryPublicDsn) {
  Sentry.init({
    dsn: String(sentryPublicDsn),

    // TODO uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: __DEV__,
  });
}

// if (Platform.OS === "android") {
//   if (UIManager.setLayoutAnimationEnabledExperimental) {
//     UIManager.setLayoutAnimationEnabledExperimental(true);
//   }
// }

SplashScreen.preventAutoHideAsync().catch(Sentry.captureException);
SplashScreen.setOptions({ fade: true, duration: 400 });

export default function RootLayout() {
  //TODO: Fetch updates in background! https://expo.dev/changelog/sdk-53#improved-background-tasks

  useEffect(() => {
    const listener = AppState.addEventListener("change", (status) => {
      if (status === "active") {
        // Manage react-query focus state based on app state. Allows triggering refetches on app foregrounding.
        focusManager.setFocused(true);

        // Reload the JS bundle if the font scale has changed, to avoid layout issues.
        const newFontScale = PixelRatio.getFontScale();
        if (newFontScale !== currentFontScale.current) {
          currentFontScale.current = newFontScale;
          Updates.reloadAsync().catch(Sentry.captureException);
        }
      }
    });
    return () => {
      listener.remove();
    };
  }, []);

  const currentFontScale = useRef(PixelRatio.getFontScale());

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Slot />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  useEffect(() => {
    SplashScreen.hide();

    Sentry.captureException(error);

    const listener = AppState.addEventListener("change", () => {
      Updates.reloadAsync().catch(Sentry.captureException);
    });
    return () => {
      listener.remove();
    };
  }, [error]);

  return (
    <View className="bg-background flex flex-1 justify-end gap-8 px-4 pb-16">
      <View className="flex grow justify-center gap-4">
        <Text
          maxFontSizeMultiplier={1.5}
          className="text-foreground text-3xl font-semibold sm:text-4xl md:text-5xl"
        >
          Something Went Wrong
        </Text>
        <Text
          maxFontSizeMultiplier={2}
          className="text-foreground text-lg md:text-xl"
        >
          We're currently experiencing technical difficulties. Please try again
          later.
        </Text>
      </View>
      <PressableThemed
        onPress={() => Updates.reloadAsync().catch(Sentry.captureException)}
        accessibilityLabel={`Reload application`}
      >
        <Card className="bg-destructive mx-0 justify-center">
          <Text
            maxFontSizeMultiplier={2.5}
            className="text-destructive-foreground text-xl font-bold"
          >
            Reload
          </Text>
        </Card>
      </PressableThemed>
    </View>
  );
}
