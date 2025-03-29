import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Linking, View } from "react-native";
import Background from "~/components/Background";
import tw from "~/utils/tailwind";
import { Link } from "expo-router";
import PressableThemed from "~/components/PressableThemed";
import Card from "~/components/Card";
import TextThemed from "~/components/TextThemed";

export const Settings = () => {
  console.log("settings index!");
  return (
    <Background>
      <View style={tw`flex-1 justify-between`}>
        <View>
          <Link href="./notifications" asChild>
            <PressableThemed accessibilityLabel="Navigate to notification settings screen">
              <Card style={tw`rounded-b-none border-b-2`}>
                <TextThemed>Notifications</TextThemed>
                <TextThemed variant="muted">
                  <AntDesign name="notification" size={24} />
                </TextThemed>
              </Card>
            </PressableThemed>
          </Link>
          <Link href="./account" asChild>
            <PressableThemed accessibilityLabel="Navigate to account settings screen">
              <Card style={tw`rounded-none border-b-2`}>
                <TextThemed>Account</TextThemed>
                <TextThemed variant="muted">
                  <AntDesign name="user" size={24} />
                </TextThemed>
              </Card>
            </PressableThemed>
          </Link>
          <Link href="./support" asChild>
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
        <PressableThemed
          onPress={() =>
            Linking.openURL(
              "https://github.com/tmlamb/probable-pitchers/issues",
            )
          }
          accessibilityRole="link"
          accessibilityLabel="Open Application Feedback Page In Browser"
          style={tw`flex-row justify-center items-center self-center py-2`}
        >
          <TextThemed variant="muted" style={tw`mr-2`}>
            <AntDesign name="github" size={16} />
          </TextThemed>
          <TextThemed variant="primary" style={tw`self-center`}>
            Feedback?
          </TextThemed>
        </PressableThemed>
      </View>
    </Background>
  );
};
