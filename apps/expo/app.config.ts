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
    //TODO Light/dark icons? https://github.com/t3-oss/create-t3-turbo/commit/aba3d2225c56658c6186e81af1ac3849f21c8eed#diff-a2420547ef7506d96953bbf6e1c0fc6a7d771120fdf1b7eeb2a30fc91118ca5fR14-R19
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
    },
    android: {
      package: `${ANDROID_PACKAGE_NAME}${
        APP_ENV !== "production" ? `.${APP_ENV}` : ""
      }`,

      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
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
            "./assets/adaptive-icon.png",
            "./assets/google-signin-neutral.png",
          ],
        },
      ],
      //TODO expo splash screen? https://github.com/t3-oss/create-t3-turbo/commit/aba3d2225c56658c6186e81af1ac3849f21c8eed#diff-a2420547ef7506d96953bbf6e1c0fc6a7d771120fdf1b7eeb2a30fc91118ca5fR14-R19
    ],
  };
};
