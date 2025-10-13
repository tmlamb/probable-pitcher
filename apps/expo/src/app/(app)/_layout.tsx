import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { PermissionStatus } from "expo-modules-core";
import * as ExpoNotifications from "expo-notifications";
import { Redirect, Stack } from "expo-router";

import { variantClasses as backgroundClasses } from "~/components/Background";
import { authClient } from "~/utils/auth";
import tw from "~/utils/tailwind";
import { variantClasses as textClasses } from "../../components/TextThemed";
import useNotifications from "../../hooks/use-notifications";

export default function AppLayout() {
  const session = authClient.useSession();

  const [pushPermissionStatus, setPushPermissionStatus] =
    useState<PermissionStatus | null>(null);

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
        style={tw.style("absolute m-auto h-full w-full")}
        size="large"
        color={tw.style(textClasses.default).color as string}
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
      screenOptions={{
        headerTitleStyle: tw.style(textClasses.default),
        headerTransparent: false,
        headerStyle: tw.style(backgroundClasses.default),
        headerShadowVisible: false,
        headerTintColor: String(tw.style(textClasses.primary).color as string),
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
