import { Linking, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";

import { faqs } from "@probable/ui/utils";

import PressableThemed from "~/components/PressableThemed";
import TextThemed from "~/components/TextThemed";
import ViewThemed from "~/components/ViewThemed";

export default function Support() {
  const insets = useSafeAreaInsets();
  return (
    <ViewThemed>
      <ScrollView contentContainerClassName="flex-1 justify-between px-3 pt-6">
        <View>
          <TextThemed className="mb-4 text-lg">
            Frequently Asked Questions
          </TextThemed>
          {faqs.map((faq) => (
            <View key={faq.question} className="mb-4">
              <TextThemed className="text-base font-bold">
                {faq.question}
              </TextThemed>
              <TextThemed variant="muted" className="text-sm">
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
          className={`mb-[${insets.bottom}] flex-row items-center justify-center self-center`}
        >
          <TextThemed variant="muted" className="mr-2">
            <AntDesign name="github" size={16} />
          </TextThemed>
          <TextThemed
            variant="primary"
            className="self-center text-base font-semibold"
          >
            Send Feedback
          </TextThemed>
        </PressableThemed>
      </ScrollView>
    </ViewThemed>
  );
}
