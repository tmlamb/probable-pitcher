import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import BrandModal from "~/components/BrandModal";
import Card from "~/components/Card";
import PressableThemed from "~/components/PressableThemed";
import { registerForPushNotifications } from "~/hooks/use-notifications";
import { trpc } from "~/utils/api";

export default function DeviceSetup() {
  const queryClient = useQueryClient();
  const router = useRouter();

  queryClient
    .prefetchQuery(trpc.subscription.byUserId.queryOptions())
    .catch(console.error);

  return (
    <BrandModal>
      <View className="flex grow justify-center gap-4">
        <Text className="text-foreground text-3xl font-semibold sm:text-4xl md:text-5xl">
          Enable game day alerts
        </Text>
        <Text className="text-foreground text-lg md:text-xl">
          Probable Pitcher notifies you in the morning on days when a pitcher
          you follow is scheduled to start. You'll only get one notification per
          day, unless there is a late schedule change for a pitcher you follow.
        </Text>
        <Text className="text-foreground text-lg md:text-xl">
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
          <Text className="text-primary-foreground text-xl font-bold">
            Continue
          </Text>
        </Card>
      </PressableThemed>
    </BrandModal>
  );
}
