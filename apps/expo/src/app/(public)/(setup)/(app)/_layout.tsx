import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useNativeVariable } from "react-native-css";
import { PermissionStatus } from "expo-notifications";
import { Redirect, SplashScreen, Stack } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import useDeviceSetup from "~/hooks/use-device-setup";
import { trpc } from "~/utils/api";

export default function AppLayout() {
  const backgroundColor = useNativeVariable("--background") as string;
  const foregroundColor = useNativeVariable("--foreground") as string;
  const primaryColor = useNativeVariable("--primary") as string;

  const deviceSetup = useDeviceSetup();

  const subscriptionQuery = useQuery(trpc.subscription.byUserId.queryOptions());

  useEffect(() => {
    if (subscriptionQuery.isFetched) {
      SplashScreen.hide();
    }
  }, [subscriptionQuery.isFetched]);

  if (deviceSetup.isPending || subscriptionQuery.isPending) {
    return (
      <View className="bg-background flex-1">
        <ActivityIndicator
          className={`text-foreground absolute m-auto h-full w-full`}
          size="large"
        />
      </View>
    );
  }

  if (deviceSetup.pushPermissionStatus === PermissionStatus.UNDETERMINED) {
    SplashScreen.hide();
    return <Redirect href="/device-setup" />;
  }

  if (subscriptionQuery.isError) {
    throw new Error("Error fetching subscriptions", {
      cause: subscriptionQuery.error,
    });
  }

  return (
    <View className="bg-background flex-1">
      <Stack
        screenOptions={{
          animation: "ios_from_right",
          headerTitleStyle: {
            color: foregroundColor,
          },
          headerTransparent: false,
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          headerShadowVisible: false,
          headerTintColor: primaryColor,
        }}
      >
        <Stack.Screen name="index" options={{ headerTitle: "" }} />
        <Stack.Screen
          name="settings/index"
          options={{ headerTitle: "Settings", headerBackTitle: "Back" }}
        />
        <Stack.Screen
          name="settings/notifications"
          options={{ headerTitle: "Notifications" }}
        />
        <Stack.Screen
          name="settings/account"
          options={{ headerTitle: "Account" }}
        />
        <Stack.Screen
          name="settings/support"
          options={{ headerTitle: "Support" }}
        />
      </Stack>
    </View>
  );
}
