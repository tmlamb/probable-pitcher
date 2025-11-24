import { ActivityIndicator, useColorScheme } from "react-native";
import { useNativeVariable } from "react-native-css";
import { PermissionStatus } from "expo-notifications";
import { Redirect, SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import useDeviceSetup from "~/hooks/use-device-setup";

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useNativeVariable("--background") as string;
  const foregroundColor = useNativeVariable("--foreground") as string;
  const primaryColor = useNativeVariable("--primary") as string;

  const { pushPermissionStatus, isPending } = useDeviceSetup();

  if (isPending) {
    return (
      <ActivityIndicator
        className={`text-foreground absolute m-auto h-full w-full`}
        size="large"
      />
    );
  }

  if (pushPermissionStatus === PermissionStatus.UNDETERMINED) {
    SplashScreen.hide();
    return <Redirect href="/device-setup" />;
  }

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack
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
    </>
  );
}
