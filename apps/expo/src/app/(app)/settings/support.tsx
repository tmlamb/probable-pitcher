import { Linking, ScrollView, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { faqs } from "@probable/ui";

import Background from "~/components/Background";
import PressableThemed from "~/components/PressableThemed";
import TextThemed from "~/components/TextThemed";
import tw from "~/utils/tailwind";

export default function Support() {
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
              "https://github.com/tmlamb/probable-pitchers/issues/",
            )
          }
          accessibilityRole="link"
          accessibilityLabel="Open Application Feedback Page In Browser"
          style={tw`mb-2 flex-row items-center justify-center self-center py-3`}
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
