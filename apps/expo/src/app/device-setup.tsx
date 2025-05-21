import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import { trpc } from "~/utils/api";
import tw from "~/utils/tailwind";
import Background from "../components/Background";
import Card from "../components/Card";
import Button from "../components/PressableThemed";
import TextThemed from "../components/TextThemed";
import { registerForPushNotifications } from "../hooks/use-notifications";

export default function DeviceSetup() {
  const queryClient = useQueryClient();
  const router = useRouter();
  queryClient
    .prefetchQuery(trpc.subscription.byUserId.queryOptions())
    .catch(console.error);
  return (
    <Background>
      <SafeAreaView style={tw`flex flex-1 justify-end py-6`}>
        <View style={tw`flex grow justify-center gap-4 px-3`}>
          <TextThemed style={tw`text-2xl font-semibold`}>
            Want to get game-day alerts?
          </TextThemed>
          <TextThemed>
            Probable Pitcher notifies you in the morning on days when a pitcher
            you follow is scheduled to start. You'll only get one notification
            per day, unless there is a late schedule change for a pitcher you
            follow.
          </TextThemed>
          <TextThemed>
            Select <TextThemed style={tw`font-bold`}>“Allow”</TextThemed> on the
            next screen to enable notifications. You can change this option
            later in the application settings.
          </TextThemed>
        </View>
        <Button
          onPress={() =>
            registerForPushNotifications().then(() => router.replace("/"))
          }
          accessibilityLabel={`Configure application's notification permissions`}
        >
          <Card style={tw`justify-center`} variant="primary">
            <TextThemed variant="secondary">Continue</TextThemed>
          </Card>
        </Button>
      </SafeAreaView>
    </Background>
  );
}
