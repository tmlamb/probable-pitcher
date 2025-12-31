import { useEffect } from "react";
import { Slot, useGlobalSearchParams, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { usePostHog } from "posthog-react-native";

export default function PublicLayout() {
  const posthog = usePostHog();

  const pathname = usePathname();
  const params = useGlobalSearchParams();

  useEffect(() => {
    posthog.screen(pathname, params).catch((e) => posthog.captureException(e));
  }, [pathname, params, posthog]);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync().catch((e) =>
      posthog.captureException(e),
    );
    SplashScreen.setOptions({ fade: true, duration: 400 });
  }, [posthog]);

  return <Slot />;
}
