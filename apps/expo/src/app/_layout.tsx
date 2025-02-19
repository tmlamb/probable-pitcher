import "@bacons/text-decoder/install";
import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/utils/api";
import "../styles.css";

const { sentryPublicDsn, appEnv } = Constants.expoConfig?.extra ?? {};
if (sentryPublicDsn) {
  Sentry.init({
    dsn: String(sentryPublicDsn),
    debug: appEnv !== "production",

    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: __DEV__,
  });
}

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  return (
    <TRPCProvider>
      <Slot />
      <StatusBar style="light" />
    </TRPCProvider>
  );
}
//<LinearGradient
//  className="h-full"
//  //#D28769, #75a66b
//  colors={["rgb(210, 135, 105)", "rgb(117, 166, 107)"]}
//  end={{ x: 0.25, y: 0.4 }}
//  locations={[0.4, 0.5]}
//>
