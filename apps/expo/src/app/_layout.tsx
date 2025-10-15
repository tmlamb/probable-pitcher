import { useCallback, useEffect, useRef, useState } from "react";
import { Appearance, AppState, Platform, UIManager } from "react-native";
import Constants from "expo-constants";
import { Slot, useFocusEffect } from "expo-router";
import * as Sentry from "@sentry/react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { useDeviceContext } from "twrnc";

import Background from "~/components/Background";
import { queryClient } from "~/utils/api";
import { authClient } from "~/utils/auth";
import tw from "~/utils/tailwind";

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
  useDeviceContext(tw);

  const session = authClient.useSession();

  const [forceRenderKey, setForceRenderKey] = useState(0);
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  const handleColorSchemeChange = useCallback(() => {
    const systemColorScheme = Appearance.getColorScheme();
    if (colorScheme !== systemColorScheme) {
      setForceRenderKey((v: number) => v + 1);
      setColorScheme(systemColorScheme);
    }
  }, [colorScheme]);

  useFocusEffect(() => handleColorSchemeChange());

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const listener = AppState.addEventListener("change", (nextAppState) => {
      if (
        /inactive|background/.exec(appState.current) &&
        nextAppState === "active"
      ) {
        handleColorSchemeChange();
      }
      appState.current = nextAppState;
    });
    return () => {
      listener.remove();
    };
  }, [handleColorSchemeChange]);

  //TODO Fetch updates in background! https://expo.dev/changelog/sdk-53#improved-background-tasks

  return (
    <Background
      key={forceRenderKey}
      style={tw.style(
        !session.data
          ? colorScheme === "dark"
            ? "bg-[#567259]"
            : "bg-[#789d7c]"
          : null,
      )}
    >
      <QueryClientProvider client={queryClient}>
        <Slot />
      </QueryClientProvider>
    </Background>
  );
}
