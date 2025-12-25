import { useEffect, useState } from "react";
import { ActivityIndicator, AppState, View } from "react-native";
import * as Application from "expo-application";
import { Redirect, Slot, SplashScreen } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import semver from "semver";

import { trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";

export default function SetupLayout() {
  const versionQuery = useQuery(trpc.meta.version.queryOptions());
  const session = authClient.useSession();

  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const listener = AppState.addEventListener("change", (nextAppState) => {
      setAppState(nextAppState);
    });

    return () => {
      listener.remove();
    };
  }, []);

  if (versionQuery.isError) {
    throw new Error("Error fetching version metadata for force update", {
      cause: versionQuery.error,
    });
  }

  if (versionQuery.isPending || session.isPending || appState !== "active") {
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
    throw new Error("Error fetching session data", { cause: session.error });
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
