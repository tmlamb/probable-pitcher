import { AntDesign } from "@expo/vector-icons";
import { Linking, ScrollView, View } from "react-native";
import Background from "~/components/Background";
import TextThemed from "~/components/TextThemed";
import tw from "~/utils/tailwind";
import { faqs } from "@probable/ui";
import PressableThemed from "~/components/PressableThemed";

export default function Support() {
  return (
    <Background>
      <ScrollView contentContainerStyle={tw`justify-between px-3 pt-6 flex-1`}>
        <View style={tw``}>
          <TextThemed style={tw`text-lg mb-4`}>
            Frequently Asked Questions
          </TextThemed>
          {faqs.map((faq) => (
            <View key={faq.question} style={tw`mb-4`}>
              <TextThemed style={tw`font-bold text-base`}>
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
          style={tw`flex-row justify-center items-center self-center py-3 mb-2`}
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
