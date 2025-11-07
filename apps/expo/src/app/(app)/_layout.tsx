import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useNativeVariable } from "react-native-css";
import { PermissionStatus } from "expo-modules-core";
import * as ExpoNotifications from "expo-notifications";
import { Redirect, Stack } from "expo-router";

import { authClient } from "~/utils/auth";
import useNotifications from "../../hooks/use-notifications";

export default function AppLayout() {
  const session = authClient.useSession();

  const [pushPermissionStatus, setPushPermissionStatus] =
    useState<PermissionStatus | null>(null);

  const backgroundColor = useNativeVariable("--background") as string;
  const foregroundColor = useNativeVariable("--foreground") as string;
  const primaryColor = useNativeVariable("--primary") as string;

  useEffect(() => {
    const checkNotificationPermissions = async () => {
      const { status: existingStatus } =
        await ExpoNotifications.getPermissionsAsync();

      return existingStatus;
    };

    checkNotificationPermissions()
      .then((status) => {
        setPushPermissionStatus(status);
      })
      .catch((error) => {
        console.error("Error checking notification permissions", error);
      });
  });

  useNotifications({
    enabled:
      !!session.data &&
      !!pushPermissionStatus &&
      pushPermissionStatus !== PermissionStatus.UNDETERMINED,
  });

  if (session.isPending) {
    return (
      <ActivityIndicator
        className={`text-foreground absolute m-auto h-full w-full`}
        size="large"
      />
    );
  }

  if (!session.data) {
    return <Redirect href="/sign-in" />;
  }

  if (pushPermissionStatus === PermissionStatus.UNDETERMINED) {
    return <Redirect href="/device-setup" />;
  }

  return (
    <Stack
      // TODO: Use colors from theme
      screenOptions={{
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
  );
}
