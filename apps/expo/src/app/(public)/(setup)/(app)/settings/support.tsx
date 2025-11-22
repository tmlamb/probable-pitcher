import { Linking, ScrollView, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";

import { faqs } from "@probable/ui/utils";

import PressableThemed from "~/components/PressableThemed";

export default function Support() {
  return (
    <View className="bg-background flex-1 justify-between">
      <ScrollView contentContainerClassName="justify-start px-3 pt-6">
        <Text
          maxFontSizeMultiplier={2}
          className="text-foreground mb-4 text-2xl"
        >
          Frequently Asked Questions
        </Text>
        {faqs.map((faq) => (
          <View key={faq.question} className="mb-4">
            <Text
              maxFontSizeMultiplier={2}
              className="text-foreground text-lg font-bold"
            >
              {faq.question}
            </Text>
            <Text maxFontSizeMultiplier={2} className="text-muted text-base">
              {faq.answer}
            </Text>
          </View>
        ))}
      </ScrollView>
      <PressableThemed
        onPress={() =>
          Linking.openURL("https://github.com/tmlamb/probable-pitcher/issues/")
        }
        accessibilityRole="link"
        accessibilityLabel="Open Application Feedback Page Link In Browser"
        className={`mb-6 flex-row items-center justify-center self-center`}
      >
        <Text maxFontSizeMultiplier={2} className="text-muted mr-2">
          <Feather name="github" size={16} />
        </Text>
        <Text
          maxFontSizeMultiplier={2}
          className="text-primary self-center text-lg font-semibold"
        >
          Send Feedback
        </Text>
      </PressableThemed>
    </View>
  );
}
