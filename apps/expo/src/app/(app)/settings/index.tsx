import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import * as Application from "expo-application";
import Background from "~/components/Background";
import tw from "~/utils/tailwind";
import { Link } from "expo-router";
import PressableThemed from "~/components/PressableThemed";
import Card from "~/components/Card";
import TextThemed from "~/components/TextThemed";

export default function Settings() {
  return (
    <Background>
      <View style={tw`mt-8 flex-1 justify-between`}>
        <View>
          <Link href="/settings/notifications" asChild>
            <PressableThemed accessibilityLabel="Navigate to notification settings screen">
              <Card style={tw`rounded-b-none border-b-2`}>
                <TextThemed>Notifications</TextThemed>
                <TextThemed variant="muted">
                  <AntDesign name="notification" size={24} />
                </TextThemed>
              </Card>
            </PressableThemed>
          </Link>
          <Link href="/settings/account" asChild>
            <PressableThemed accessibilityLabel="Navigate to account settings screen">
              <Card style={tw`rounded-none border-b-2`}>
                <TextThemed>Account</TextThemed>
                <TextThemed variant="muted">
                  <AntDesign name="user" size={24} />
                </TextThemed>
              </Card>
            </PressableThemed>
          </Link>
          <Link href="/settings/support" asChild>
            <PressableThemed accessibilityLabel="Navigate to support screen">
              <Card style={tw`rounded-t-none`}>
                <TextThemed>Support</TextThemed>
                <TextThemed variant="muted">
                  <AntDesign name="customerservice" size={24} />
                </TextThemed>
              </Card>
            </PressableThemed>
          </Link>
        </View>
        <TextThemed variant="muted" style={tw`self-center text-base pb-5`}>
          Probable Pitcher v{Application.nativeApplicationVersion}b
          {Application.nativeBuildVersion}
        </TextThemed>
      </View>
    </Background>
  );
}
