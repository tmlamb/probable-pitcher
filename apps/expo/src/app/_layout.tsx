import { useCallback, useEffect, useRef, useState } from "react";
import { Appearance, AppState } from "react-native";
import Constants from "expo-constants";
import { Slot, useFocusEffect } from "expo-router";
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

    // TODO uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: __DEV__,
  });
}

export default function RootLayout() {
  useDeviceContext(tw);

  const [forceRenderKey, setForceRenderKey] = useState(0);
  const colorScheme = useRef(Appearance.getColorScheme());

  const handleColorSchemeChange = () => {
    const systemColorScheme = Appearance.getColorScheme();
    if (colorScheme.current !== systemColorScheme) {
      setForceRenderKey((v: number) => v + 1);
      colorScheme.current = systemColorScheme;
    }
  };

  useFocusEffect(useCallback(() => handleColorSchemeChange(), []));

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
  }, []);

  //TODO Fetch updates in background! https://expo.dev/changelog/sdk-53#improved-background-tasks

  return (
    <Background
      key={forceRenderKey}
      style={tw.style(
        colorScheme.current === "dark" ? "bg-[#567259]" : "bg-[#789d7c]",
      )}
    >
      <QueryClientProvider client={queryClient}>
        <Slot />
      </QueryClientProvider>
    </Background>
  );
}
