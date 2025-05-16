import type { ConfigContext, ExpoConfig } from "expo/config";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const {
  APP_ENV,
  BETTER_AUTH_URL,
  SENTRY_PUBLIC_DSN,
  SENTRY_PROJECT,
  SENTRY_ORG,
  IOS_BUNDLE_ID,
  ANDROID_PACKAGE_NAME,
  EXPO_OWNER,
} = process.env;

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: `Probable Pitcher${APP_ENV !== "production" ? ` (${APP_ENV})` : ""}`,
    slug: "probable-pitchers",
    scheme: "probablepitcher",
    owner: EXPO_OWNER,
    version: "2.0.0",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    updates: {
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/abd1f73f-1027-4617-a091-abea678a0784",
    },
    newArchEnabled: true,
    runtimeVersion: {
      policy: "sdkVersion",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      bundleIdentifier: `${IOS_BUNDLE_ID}${
        APP_ENV !== "production" ? `.${APP_ENV}` : ""
      }`,
      usesAppleSignIn: true,
      supportsTablet: true,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      icon: {
        light: "./assets/icon-light.png",
        dark: "./assets/icon-dark.png",
      },
    },
    android: {
      package: `${ANDROID_PACKAGE_NAME}${
        APP_ENV !== "production" ? `.${APP_ENV}` : ""
      }`,
      icon: "./assets/icon-light.png",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon-light.png",
        backgroundColor: "#789d7c",
      },
      googleServicesFile: "./google-services.json",
      edgeToEdgeEnabled: true,
    },
    extra: {
      eas: {
        projectId: "abd1f73f-1027-4617-a091-abea678a0784",
      },
      apiBaseUrl: BETTER_AUTH_URL,
      sentryPublicDsn: SENTRY_PUBLIC_DSN,
      appEnv: APP_ENV,
    },
    experiments: {
      tsconfigPaths: true,
      typedRoutes: true,
    },
    plugins: [
      "expo-web-browser",
      "expo-notifications",
      "expo-router",
      "expo-secure-store",
      "expo-apple-authentication",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#789d7c",
          image: "./assets/icon-light.png",
          dark: {
            backgroundColor: "#567259",
            image: "./assets/icon-dark.png",
          },
        },
      ],
      "expo-localization",
      [
        "@sentry/react-native/expo",
        {
          url: "https://sentry.io/",
          project: SENTRY_PROJECT,
          organization: SENTRY_ORG,
        },
      ],
      [
        "expo-asset",
        {
          assets: [
            "./assets/adaptive-icon-light.png",
            "./assets/adaptive-icon-dark.png",
            "./assets/google-signin-neutral.png",
          ],
        },
      ],
    ],
  };
};
