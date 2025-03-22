import React, { useEffect, useState } from "react";
import { Redirect, Stack } from "expo-router";
import { authClient } from "~/utils/auth";
import { ActivityIndicator } from "react-native";
import tw from "~/utils/tailwind";
import * as ExpoNotifications from "expo-notifications";
import { PermissionStatus } from "expo-modules-core";
import useNotifications from "../hooks/use-notifications";
import { variantClasses as backgroundClasses } from "../components/Background";
import { variantClasses as textClasses } from "../components/TextThemed";

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
        style={tw`mt-9 h-[86.48px] text-primary-foreground`}
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
        headerStyle: tw.style(backgroundClasses.default),
        headerTitleStyle: tw.style(textClasses.default),

        //contentStyle: {
        //  backgroundColor: colorScheme == "dark" ? "#09090B" : "#FFFFFF",
        //},
      }}
    >
      <Stack.Screen name="index" options={{ headerTitle: "" }} />
    </Stack>
  );
}
