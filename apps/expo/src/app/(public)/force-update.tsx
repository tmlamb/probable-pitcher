import { Platform, Text, View } from "react-native";
import * as Application from "expo-application";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { Redirect } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { usePostHog } from "posthog-react-native";
import semver from "semver";

import BrandModal from "~/components/BrandModal";
import Card from "~/components/Card";
import PressableThemed from "~/components/PressableThemed";
import { trpc } from "~/utils/api";

const { iosAppStoreId, androidPackageName } = Constants.expoConfig?.extra ?? {};

const storeUrl = Platform.select({
  ios: iosAppStoreId ? `https://apps.apple.com/app/${iosAppStoreId}` : null,
  android: androidPackageName
    ? `market://details?id=${androidPackageName}`
    : null,
});

const storeName = Platform.select({
  ios: "App Store",
  android: "Play Store",
});

export default function ForceUpdate() {
  const posthog = usePostHog();
  const versionQuery = useQuery(trpc.meta.version.queryOptions());

  if (versionQuery.isError) {
    throw new Error("Error fetching version metadata for force update", {
      cause: versionQuery.error,
    });
  }

  if (!Application.nativeApplicationVersion) {
    throw new Error("Unable to determine app version for force update");
  }

  if (
    versionQuery.isSuccess &&
    semver.gte(
      Application.nativeApplicationVersion,
      versionQuery.data.minVersion,
    )
  ) {
    return <Redirect href="/" />;
  }

  return (
    <BrandModal>
      <View className="flex grow justify-center gap-4">
        <Text
          maxFontSizeMultiplier={1.25}
          className="text-foreground text-3xl font-semibold sm:text-4xl md:text-5xl"
        >
          App Update Required
        </Text>
        <Text
          maxFontSizeMultiplier={1.5}
          className="text-foreground text-lg md:text-xl"
        >
          A new version of Probable Pitcher is available. To continue using the
          app, please update to the latest version in the {storeName}.
        </Text>
      </View>
      {storeUrl && (
        <PressableThemed
          onPress={() =>
            Linking.openURL(storeUrl).catch((e) => posthog.captureException(e))
          }
          accessibilityLabel={`Open app store to update application`}
        >
          <Card className="bg-secondary mx-0 justify-center">
            <Text
              maxFontSizeMultiplier={2}
              className="text-secondary-foreground text-xl font-bold"
            >
              Open {storeName}
            </Text>
          </Card>
        </PressableThemed>
      )}
    </BrandModal>
  );
}
