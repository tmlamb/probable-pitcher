import React, { useEffect, useState } from "react";
import { Redirect, Stack } from "expo-router";
import { authClient } from "~/utils/auth";
import { ActivityIndicator } from "react-native";
import tw from "~/utils/tailwind";
import * as ExpoNotifications from "expo-notifications";
import { PermissionStatus } from "expo-modules-core";
import useNotifications from "../../hooks/use-notifications";
import { variantClasses as textClasses } from "../../components/TextThemed";
import { variantClasses as backgroundClasses } from "~/components/Background";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function AppLayout() {
  const { data: session, isPending } = authClient.useSession();

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
      !!session && pushPermissionStatus !== PermissionStatus.UNDETERMINED,
  });

  if (isPending) {
    return (
      <ActivityIndicator
        style={tw.style("mt-9 h-[86.48px]", textClasses.primary)}
        size="large"
      />
    );
  }

  if (!session) {
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
        headerTintColor: tw.style(textClasses.primary).color?.toString(),
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
