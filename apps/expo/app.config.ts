import type { ConfigContext, ExpoConfig } from "expo/config";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const { APP_ENV, NEXTAUTH_URL, SENTRY_PUBLIC_DSN } = process.env;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: `Probable Pitcher${APP_ENV !== "production" ? ` (${APP_ENV})` : ""}`,
  slug: "probable-pitcher",
  scheme: "com.probablepitcher",
  owner: "tmlamb",
  version: "2.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#fff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: `com.probablepitcher${
      APP_ENV !== "production" ? `.${APP_ENV}` : ""
    }`,

    supportsTablet: true,
  },
  android: {
    package: `com.probablepitcher${
      APP_ENV !== "production" ? `.${APP_ENV}` : ""
    }`,

    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#fff",
    },
    googleServicesFile: "./google-services.json",
  },
  extra: {
    eas: {
      projectId: "abd1f73f-1027-4617-a091-abea678a0784",
    },
    apiBaseUrl: NEXTAUTH_URL,
    nextAuthUrl: NEXTAUTH_URL,
    sentryPublicDsn: SENTRY_PUBLIC_DSN,
    appEnv: APP_ENV,
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: ["expo-router", "sentry-expo", "expo-localization"],
});
