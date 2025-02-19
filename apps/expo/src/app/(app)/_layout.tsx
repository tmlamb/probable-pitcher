import React from "react";
import { Redirect, Stack } from "expo-router";
import { authClient } from "~/utils/auth";
import { ActivityIndicator } from "react-native";
import tw from "~/utils/tailwind";
//import { useAppColorScheme } from "twrnc";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function AppLayout() {
  //const [colorScheme] = useAppColorScheme(tw);
  const { data: session, isPending } = authClient.useSession();

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

  return (
    <Stack
      screenOptions={
        {
          //headerStyle: {
          //  backgroundColor: "#f472b6",
          //},
          //contentStyle: {
          //  backgroundColor: colorScheme == "dark" ? "#09090B" : "#FFFFFF",
          //},
        }
      }
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
