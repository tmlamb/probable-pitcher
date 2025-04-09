import type { ConfigContext, ExpoConfig } from "expo/config";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const {
  APP_ENV,
  EXPO_BETTER_AUTH_URL,
  SENTRY_PUBLIC_DSN,
  SENTRY_PROJECT,
  SENTRY_ORG,
} = process.env;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: `Probable Pitcher${APP_ENV !== "production" ? ` (${APP_ENV})` : ""}`,
  slug: "probable-pitchers",
  scheme: "probablepitcher",
  owner: "tmlamb",
  version: "2.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/abd1f73f-1027-4617-a091-abea678a0784",
  },
  runtimeVersion: {
    policy: "sdkVersion",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: `com.triplesight.probablepitchers${
      APP_ENV !== "production" ? `.${APP_ENV}` : ""
    }`,
    usesAppleSignIn: true,
    supportsTablet: true,
  },
  android: {
    package: `com.probablepitcher${
      APP_ENV !== "production" ? `.${APP_ENV}` : ""
    }`,

    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    googleServicesFile: "./google-services.json",
  },
  extra: {
    eas: {
      projectId: "abd1f73f-1027-4617-a091-abea678a0784",
    },
    apiBaseUrl: EXPO_BETTER_AUTH_URL,
    sentryPublicDsn: SENTRY_PUBLIC_DSN,
    appEnv: APP_ENV,
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-apple-authentication",
    "expo-localization",
    [
      "@sentry/react-native/expo",
      {
        url: "https://sentry.io/",
        project: "probable-pitchers",
        organization: "tom-lamb",
      },
    ],
    [
      "expo-asset",
      {
        assets: [
          "./assets/adaptive-icon.png",
          "./assets/google-signin-neutral.png",
        ],
      },
    ],
  ],
});
