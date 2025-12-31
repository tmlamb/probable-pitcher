import type { ConfigContext, ExpoConfig } from "expo/config";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const {
  APP_ENV,
  BETTER_AUTH_URL,
  POSTHOG_API_KEY,
  IOS_BUNDLE_ID,
  ANDROID_PACKAGE_NAME,
  EXPO_OWNER,
  IOS_APP_STORE_ID,
} = process.env;

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: `Probable Pitcher${APP_ENV !== "production" ? ` (${APP_ENV})` : ""}`,
    slug: "probable-pitchers",
    scheme: "probablepitcher",
    owner: EXPO_OWNER,
    version: "2.7.0",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    experiments: {
      tsconfigPaths: true,
      typedRoutes: true,
      reactCanary: true,
      reactCompiler: true,
    },
    updates: {
      fallbackToCacheTimeout: 10000,
      url: "https://u.expo.dev/abd1f73f-1027-4617-a091-abea678a0784",
    },
    newArchEnabled: true,
    runtimeVersion: {
      policy: "appVersion",
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
        UIDesignRequiresCompatibility: true,
      },
      icon: "./assets/probable-ios.icon",
    },
    android: {
      package: `${ANDROID_PACKAGE_NAME}${
        APP_ENV !== "production" ? `.${APP_ENV}` : ""
      }`,
      icon: "./assets/icon_light.png",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive_icon.png",
        backgroundColor: "#a1d995",
      },
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
      softwareKeyboardLayoutMode: "pan",
    },
    androidStatusBar: {
      translucent: false,
    },
    extra: {
      eas: {
        projectId: "abd1f73f-1027-4617-a091-abea678a0784",
      },
      apiBaseUrl: BETTER_AUTH_URL,
      posthogApiKey: POSTHOG_API_KEY,
      iosAppStoreId: IOS_APP_STORE_ID,
      androidPackageName: ANDROID_PACKAGE_NAME,
      appEnv: APP_ENV,
    },
    plugins: [
      "expo-web-browser",
      [
        "expo-notifications",
        {
          icon: "./assets/notification_icon.png",
          color: "#ffffff",
          defaultChannel: "default",
          enableBackgroundRemoteNotifications: false,
        },
      ],
      "expo-router",
      "expo-secure-store",
      "expo-apple-authentication",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#a1d995",
          image: "./assets/adaptive_icon.png",
          dark: {
            backgroundColor: "#a1d995",
            image: "./assets/adaptive_icon.png",
          },
          imageWidth: 200,
        },
      ],
      "expo-localization",
      [
        "expo-asset",
        {
          assets: [
            "./assets/adaptive_icon.png",
            "./assets/brand_icon.png",
            "./assets/google_signin_neutral.png",
          ],
        },
      ],
      "expo-navigation-bar",
    ],
  };
};
