import { Linking, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";

import { faqs } from "@probable/ui";

import Background from "~/components/Background";
import PressableThemed from "~/components/PressableThemed";
import TextThemed from "~/components/TextThemed";
import tw from "~/utils/tailwind";

export default function Support() {
  const insets = useSafeAreaInsets();
  return (
    <Background>
      <ScrollView contentContainerStyle={tw`flex-1 justify-between px-3 pt-6`}>
        <View style={tw``}>
          <TextThemed style={tw`mb-4 text-lg`}>
            Frequently Asked Questions
          </TextThemed>
          {faqs.map((faq) => (
            <View key={faq.question} style={tw`mb-4`}>
              <TextThemed style={tw`text-base font-bold`}>
                {faq.question}
              </TextThemed>
              <TextThemed variant="muted" style={tw`text-sm`}>
                {faq.answer}
              </TextThemed>
            </View>
          ))}
        </View>
        <PressableThemed
          onPress={() =>
            Linking.openURL(
              "https://github.com/tmlamb/probable-pitcher/issues/",
            )
          }
          accessibilityRole="link"
          accessibilityLabel="Open Application Feedback Page Link In Browser"
          style={tw`mb-[${insets.bottom}] flex-row items-center justify-center self-center`}
        >
          <TextThemed variant="muted" style={tw`mr-2`}>
            <AntDesign name="github" size={16} />
          </TextThemed>
          <TextThemed
            variant="primary"
            style={tw`self-center text-base font-semibold`}
          >
            Send Feedback
          </TextThemed>
        </PressableThemed>
      </ScrollView>
    </Background>
  );
}
