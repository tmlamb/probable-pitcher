import { useEffect } from "react";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { usePostHog } from "posthog-react-native";

export default function PublicLayout() {
  const posthog = usePostHog();

  useEffect(() => {
    SplashScreen.preventAutoHideAsync().catch((e) =>
      posthog.captureException(e),
    );
    SplashScreen.setOptions({ fade: true, duration: 400 });
  }, [posthog]);

  return <Slot />;
}
