import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Application from "expo-application";
import { Link } from "expo-router";
import * as Updates from "expo-updates";
import Feather from "@expo/vector-icons/Feather";

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
              <Card className="border-border rounded-b-none border-b-1">
                <Text
                  maxFontSizeMultiplier={2.5}
                  className="text-foreground text-xl"
                >
                  Notifications
                </Text>
                <Text maxFontSizeMultiplier={2.5} className="text-muted">
                  <Feather name="bell" size={22} />
                </Text>
              </Card>
            </PressableThemed>
          </Link>
          <Link href="/settings/account" asChild>
            <PressableThemed accessibilityLabel="Navigate to account settings screen">
              <Card className="border-border rounded-none border-b-1">
                <Text
                  maxFontSizeMultiplier={2.5}
                  className="text-foreground text-xl"
                >
                  Account
                </Text>
                <Text maxFontSizeMultiplier={2.5} className="text-muted">
                  <Feather name="user" size={22} />
                </Text>
              </Card>
            </PressableThemed>
          </Link>
          <Link href="/settings/support" asChild>
            <PressableThemed accessibilityLabel="Navigate to support screen">
              <Card className="rounded-t-none">
                <Text
                  maxFontSizeMultiplier={2.5}
                  className="text-foreground text-xl"
                >
                  Support
                </Text>
                <Text maxFontSizeMultiplier={2.5} className="text-muted">
                  <Feather name="help-circle" size={22} />
                </Text>
              </Card>
            </PressableThemed>
          </Link>
        </View>
        <View
          style={{
            marginBottom: insets.bottom,
          }}
        >
          <Text
            maxFontSizeMultiplier={1.5}
            className={`text-muted self-center p-1 text-base`}
          >
            Probable Pitcher v{Application.nativeApplicationVersion}b
            {Application.nativeBuildVersion}
            {Updates.updateId ? `.${Updates.updateId.slice(0, 3)}` : ""}
          </Text>
        </View>
      </View>
    </View>
  );
}
