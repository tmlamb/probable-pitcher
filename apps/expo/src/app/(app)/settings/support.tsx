import { Linking, ScrollView, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";

import { faqs } from "@probable/ui/utils";

import PressableThemed from "~/components/PressableThemed";

export default function Support() {
  return (
    <View className="bg-background flex-1">
      <ScrollView contentContainerClassName="flex-1 justify-between px-3 pt-6">
        <View>
          <Text className="text-foreground mb-4 text-2xl">
            Frequently Asked Questions
          </Text>
          {faqs.map((faq) => (
            <View key={faq.question} className="mb-4">
              <Text className="text-foreground text-lg font-bold">
                {faq.question}
              </Text>
              <Text className="text-muted text-base">{faq.answer}</Text>
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
          className={`mb-6 flex-row items-center justify-center self-center`}
        >
          <Text className="text-muted mr-2">
            <Feather name="github" size={16} />
          </Text>
          <Text className="text-primary self-center text-lg font-semibold">
            Send Feedback
          </Text>
        </PressableThemed>
      </ScrollView>
    </View>
  );
}
