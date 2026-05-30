import { useEffect } from "react";
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

  useEffect(() => {
    if (session.data) {
      posthog.identify(session.data.user.id);
    }
  }, [session.data?.user.id, posthog, session.data]);

  useEffect(() => {
    if (versionQuery.isError) {
      posthog.captureException(
        new Error("Error fetching version metadata for force update", {
          cause: versionQuery.error,
        }),
      );
    }
  }, [posthog, versionQuery.error, versionQuery.isError]);

  // Check for Secure Store access errors due to app being backgrounded
  const sessionErrorMessage = session.error?.message ?? "";
  const isSecureStoreBackgroundError =
    sessionErrorMessage.includes("User interaction is not allowed") ||
    sessionErrorMessage.includes("KeyChainException") ||
    sessionErrorMessage.includes("getValueWithKeySync");

  useEffect(() => {
    if (!session.error || (!isSecureStoreBackgroundError && !session.data)) {
      return;
    }

    posthog.captureException(
      isSecureStoreBackgroundError
        ? session.error
        : new Error("Error refreshing session data", { cause: session.error }),
    );
  }, [isSecureStoreBackgroundError, posthog, session.data, session.error]);

  if (session.error) {
    if (!isSecureStoreBackgroundError && !session.data) {
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

  if (
    versionQuery.data &&
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
