import { ActivityIndicator, View } from "react-native";
import * as Application from "expo-application";
import { Redirect, Slot, SplashScreen } from "expo-router";
import * as Sentry from "@sentry/react-native";
import { useQuery } from "@tanstack/react-query";
import semver from "semver";

import { trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";

export default function SetupLayout() {
  const versionQuery = useQuery(trpc.meta.version.queryOptions());
  const session = authClient.useSession();

  if (versionQuery.isError) {
    throw new Error("Error fetching version metadata for force update", {
      cause: versionQuery.error,
    });
  }

  if (versionQuery.isPending || session.isPending) {
    return (
      <View className="bg-background flex-1">
        <ActivityIndicator
          className={`text-foreground absolute m-auto h-full w-full`}
          size="large"
        />
      </View>
    );
  }

  if (session.error) {
    if (!session.data) {
      throw new Error("Error fetching session data", {
        cause: session.error,
      });
    } else {
      Sentry.captureException(session.error, {
        level: "warning",
      });
    }
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
