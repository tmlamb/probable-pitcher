import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useQueryClient } from "@tanstack/react-query";
import { useAppColorScheme } from "twrnc";

import Card from "~/components/Card";
import PressableThemed from "~/components/PressableThemed";
import { registerForPushNotifications } from "~/hooks/use-notifications";
import { trpc } from "~/utils/api";
import tw from "~/utils/tailwind";
import Background from "../components/Background";
import TextThemed from "../components/TextThemed";

export default function DeviceSetup() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [colorScheme] = useAppColorScheme(tw);
  const insets = useSafeAreaInsets();

  queryClient
    .prefetchQuery(trpc.subscription.byUserId.queryOptions())
    .catch(console.error);

  return (
    <Animated.View entering={FadeInUp} style={tw`flex-1`}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={
          colorScheme === "dark"
            ? ["#965e32", "#567259", "#789d7c"]
            : ["#c3875b", "#789d7c", "#a6cbb0"]
        }
        locations={[0, 0.4, 1]}
        style={tw`flex-1`}
      >
        <StatusBar style="light" />
        <SafeAreaView style={tw`flex flex-1 justify-end`}>
          {colorScheme === "dark" ? (
            <Image
              alt=""
              style={tw`mx-auto mb-6 aspect-square h-44`}
              source={{
                uri: "adaptive_icon_dark",
              }}
            />
          ) : (
            <Image
              alt=""
              style={tw`mx-auto mb-6 aspect-square h-44`}
              source={{
                uri: "adaptive_icon_light",
              }}
            />
          )}
          <Background
            variant="modal"
            style={tw`h-3/4 rounded-t-3xl px-3 pb-16 -mb-[${insets.bottom}], flex justify-end shadow-2xl`}
          >
            <View style={tw`flex grow justify-center gap-4`}>
              <TextThemed style={tw`text-2xl font-semibold`}>
                Enable game-day alerts
              </TextThemed>
              <TextThemed style={tw`text-base`} variant="muted">
                Probable Pitcher notifies you in the morning on days when a
                pitcher you follow is scheduled to start. You'll only get one
                notification per day, unless there is a late schedule change for
                a pitcher you follow.
              </TextThemed>
              <TextThemed style={tw`text-base`} variant="muted">
                Select <TextThemed style={tw`font-bold`}>“Allow”</TextThemed> on
                the next screen to enable notifications. You can change this
                option later in the application settings.
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
          </Background>
        </SafeAreaView>
      </LinearGradient>
    </Animated.View>
  );
}
