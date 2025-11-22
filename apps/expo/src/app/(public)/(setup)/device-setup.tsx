import { Text, View } from "react-native";
import { useRouter } from "expo-router";

import BrandModal from "~/components/BrandModal";
import Card from "~/components/Card";
import PressableThemed from "~/components/PressableThemed";
import { registerForPushNotifications } from "~/hooks/use-device-setup";

export default function DeviceSetup() {
  const router = useRouter();

  return (
    <BrandModal>
      <View className="flex grow justify-center gap-4">
        <Text
          maxFontSizeMultiplier={1.15}
          className="text-foreground text-3xl font-semibold sm:text-4xl md:text-5xl"
        >
          Enable game day alerts
        </Text>
        <Text
          maxFontSizeMultiplier={1.25}
          className="text-foreground text-lg md:text-xl"
        >
          Probable Pitcher notifies you in the morning on days when a pitcher
          you follow is scheduled to start. You'll only get one notification per
          day, unless there is a late schedule change for a pitcher you follow.
        </Text>
        <Text
          maxFontSizeMultiplier={1.25}
          className="text-foreground text-lg md:text-xl"
        >
          Select <Text className="font-bold">“Allow”</Text> on the next screen
          to enable notifications. You can change this option later in the
          application settings.
        </Text>
      </View>
      <PressableThemed
        onPress={() =>
          registerForPushNotifications().then(() => router.replace("/"))
        }
        accessibilityLabel={`Configure application's notification permissions`}
      >
        <Card className="bg-primary mx-0 justify-center">
          <Text
            maxFontSizeMultiplier={1.5}
            className="text-primary-foreground text-xl font-bold"
          >
            Continue
          </Text>
        </Card>
      </PressableThemed>
    </BrandModal>
  );
}
