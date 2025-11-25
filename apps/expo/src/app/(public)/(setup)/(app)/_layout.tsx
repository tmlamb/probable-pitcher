import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  useColorScheme,
  View,
} from "react-native";
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

  const [layoutKick, setLayoutKick] = useState(false);
  useEffect(() => {
    if (Platform.OS === "android") {
      // Force a re-render/layout update 1 frame after mount
      // to account for the status bar height not being available
      // during the initial render on Android devices.
      //
      // Without this, the header overlaps the status bar on initial load.
      requestAnimationFrame(() => {
        setLayoutKick(true);
      });
    }
  }, []);

  const { pushPermissionStatus, isPending } = useDeviceSetup();

  if (isPending) {
    return (
      <View className="bg-background flex-1">
        <ActivityIndicator
          className={`text-foreground absolute m-auto h-full w-full`}
          size="large"
        />
      </View>
    );
  }

  if (pushPermissionStatus === PermissionStatus.UNDETERMINED) {
    SplashScreen.hide();
    return <Redirect href="/device-setup" />;
  }

  return (
    <View style={{ flex: 1, paddingBottom: layoutKick ? 0 : 0.1 }}>
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
    </View>
  );
}
