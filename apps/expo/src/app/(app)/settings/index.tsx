import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Application from "expo-application";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

import Card from "~/components/Card";
import PressableThemed from "~/components/PressableThemed";

// TODO add color theme toggle to settings screen
export default function Settings() {
  const insets = useSafeAreaInsets();
  return (
    <View className="bg-background flex-1">
      <View className="mt-8 flex-1 justify-between">
        <View>
          <Link href="/settings/notifications" asChild>
            <PressableThemed accessibilityLabel="Navigate to notification settings screen">
              <Card className="border-border rounded-b-none border-b-2">
                <Text className="text-foreground text-xl">Notifications</Text>
                <Text className="text-muted">
                  <AntDesign name="notification" size={22} />
                </Text>
              </Card>
            </PressableThemed>
          </Link>
          <Link href="/settings/account" asChild>
            <PressableThemed accessibilityLabel="Navigate to account settings screen">
              <Card className="border-border rounded-none border-b-2">
                <Text className="text-foreground text-xl">Account</Text>
                <Text className="text-muted">
                  <AntDesign name="user" size={22} />
                </Text>
              </Card>
            </PressableThemed>
          </Link>
          <Link href="/settings/support" asChild>
            <PressableThemed accessibilityLabel="Navigate to support screen">
              <Card className="rounded-t-none">
                <Text className="text-foreground text-xl">Support</Text>
                <Text className="text-muted">
                  <AntDesign name="customer-service" size={22} />
                </Text>
              </Card>
            </PressableThemed>
          </Link>
        </View>
        <Text className={`text-muted mb-4 self-center text-base`}>
          Probable Pitcher v{Application.nativeApplicationVersion}b
          {Application.nativeBuildVersion}
        </Text>
      </View>
    </View>
  );
}
