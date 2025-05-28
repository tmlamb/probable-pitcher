import { View } from "react-native";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import Card from "~/components/Card";
import IconModal from "~/components/IconModal";
import PressableThemed from "~/components/PressableThemed";
import { registerForPushNotifications } from "~/hooks/use-notifications";
import { trpc } from "~/utils/api";
import tw from "~/utils/tailwind";
import TextThemed from "../components/TextThemed";

export default function DeviceSetup() {
  const queryClient = useQueryClient();
  const router = useRouter();

  queryClient
    .prefetchQuery(trpc.subscription.byUserId.queryOptions())
    .catch(console.error);

  return (
    <IconModal>
      <View style={tw`flex grow justify-center gap-4`}>
        <TextThemed style={tw`text-2xl font-semibold`}>
          Enable game-day alerts
        </TextThemed>
        <TextThemed style={tw`text-base`} variant="muted">
          Probable Pitcher notifies you in the morning on days when a pitcher
          you follow is scheduled to start. You'll only get one notification per
          day, unless there is a late schedule change for a pitcher you follow.
        </TextThemed>
        <TextThemed style={tw`text-base`} variant="muted">
          Select <TextThemed style={tw`font-bold`}>“Allow”</TextThemed> on the
          next screen to enable notifications. You can change this option later
          in the application settings.
        </TextThemed>
      </View>
      <PressableThemed
        onPress={() =>
          registerForPushNotifications().then(() => router.replace("/"))
        }
        accessibilityLabel={`Configure application's notification permissions`}
      >
        <Card style={tw`mx-0 justify-center`} variant="primary">
          <TextThemed variant="secondary">Continue</TextThemed>
        </Card>
      </PressableThemed>
    </IconModal>
  );
}
