import { ActivityIndicator, View } from "react-native";
import * as Application from "expo-application";
import { Redirect, Slot, SplashScreen } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { usePostHog } from "posthog-react-native";
import semver from "semver";

import { trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";

export default function SetupLayout() {
  const versionQuery = useQuery(trpc.meta.version.queryOptions());
  const session = authClient.useSession();
  const posthog = usePostHog();

  if (versionQuery.isError) {
    throw new Error("Error fetching version metadata for force update", {
      cause: versionQuery.error,
    });
  }

  // Check for Secure Store access errors due to app being backgrounded
  let isSecureStoreBackgroundError = false;

  if (session.error) {
    const errorMessage = session.error.message || String(session.error);
    isSecureStoreBackgroundError =
      errorMessage.includes("User interaction is not allowed") ||
      errorMessage.includes("KeyChainException") ||
      errorMessage.includes("getValueWithKeySync");

    if (isSecureStoreBackgroundError) {
      posthog.captureException(session.error);
    } else {
      throw new Error("Error fetching session data", { cause: session.error });
    }
  }

  if (
    versionQuery.isPending ||
    session.isPending ||
    isSecureStoreBackgroundError
  ) {
    return (
      <View className="bg-background flex-1">
        <ActivityIndicator
          className={`text-foreground absolute m-auto h-full w-full`}
          size="large"
        />
      </View>
    );
  }

  if (session.data) {
    posthog.identify(session.data.user.id);
  }

  if (
    Application.nativeApplicationVersion &&
    semver.lt(
      Application.nativeApplicationVersion,
      versionQuery.data.minVersion,
    )
  ) {
    SplashScreen.hide();
    return <Redirect href="/force-update" />;
  }

  // TODO: Try new Protected routes: https://docs.expo.dev/router/advanced/protected/
  if (!session.data) {
    SplashScreen.hide();
    return <Redirect href="/sign-in" />;
  }

  return <Slot />;
}
