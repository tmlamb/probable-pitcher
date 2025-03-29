import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TextThemed from "../components/TextThemed";
import { registerForPushNotifications } from "../hooks/use-notifications";
import { router } from "expo-router";
import tw from "~/utils/tailwind";
import Button from "../components/PressableThemed";
import Background from "../components/Background";
import Card from "../components/Card";

export default function DeviceSetup() {
  return (
    <Background>
      <SafeAreaView style={tw`py-6 flex-1 flex justify-end`}>
        <View style={tw`flex gap-4 justify-center grow`}>
          <TextThemed style={tw`text-2xl font-semibold`}>
            Want to get game-day alerts?
          </TextThemed>
          <TextThemed>
            Probable Pitcher notifies you in the morning on days when a pitcher
            you follow is scheduled to start. You'll only get one notification
            per day (unless there is a late schedule change), and you can opt
            out at any time.
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
