import { ActivityIndicator, View } from "react-native";
import * as Application from "expo-application";
import { Redirect, Slot, SplashScreen } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import semver from "semver";

import { trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";

export default function SetupLayout() {
  const versionQuery = useQuery(trpc.meta.version.queryOptions());
  const session = authClient.useSession();

  if (versionQuery.isError) {
    throw new Error(
      `Error fetching min version for force update: ${JSON.stringify(
        versionQuery.error,
      )}`,
    );
  }

  if (session.error) {
    throw new Error(
      `Error fetching session data : ${JSON.stringify(session.error)}`,
    );
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

  if (!session.data) {
    SplashScreen.hide();
    return <Redirect href="/sign-in" />;
  }

  return <Slot />;
}
