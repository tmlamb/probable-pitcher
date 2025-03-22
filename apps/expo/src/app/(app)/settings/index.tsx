import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Linking, View } from "react-native";
import LinkButton from "../components/LinkButton";
import Background from "~/app/components/Background";
import tw from "~/utils/tailwind";

export const Settings = () => {
  return (
    <Background>
      <View style={tw`flex-1 justify-between`}>
        <View>
          <LinkButton
            to={{ screen: "Notifications" }}
            accessibilityLabel="Navigate to notification settings screen"
          >
            <ThemedView style={tw`rounded-t-xl border-b-2`}>
              <PrimaryText>Notifications</PrimaryText>
              <SecondaryText>
                <AntDesign name="notification" size={24} />
              </SecondaryText>
            </ThemedView>
          </LinkButton>
          <LinkButton
            to={{ screen: "Account" }}
            accessibilityLabel="Navigate to account settings screen"
          >
            <ThemedView style={tw`border-b-2`}>
              <PrimaryText>Account</PrimaryText>
              <SecondaryText>
                <AntDesign name="user" size={24} />
              </SecondaryText>
            </ThemedView>
          </LinkButton>
          <LinkButton
            to={{ screen: "Support" }}
            accessibilityLabel="Navigate to support screen"
          >
            <ThemedView style={tw`rounded-b-xl`}>
              <PrimaryText>Support</PrimaryText>
              <SecondaryText>
                <AntDesign name="customerservice" size={24} />
              </SecondaryText>
            </ThemedView>
          </LinkButton>
        </View>
        <ButtonContainer
          onPress={() =>
            Linking.openURL(
              "https://github.com/tmlamb/probable-pitchers/issues",
            )
          }
          accessibilityRole="link"
          accessibilityLabel="Open Application Feedback Page In Browser"
          style={tw`flex-row justify-center items-center self-center py-2`}
        >
          <SecondaryText style={tw`mr-2`}>
            <AntDesign name="github" size={16} />
          </SecondaryText>
          <SpecialText style={tw`self-center`}>Feedback?</SpecialText>
        </ButtonContainer>
      </View>
    </Background>
  );
};
