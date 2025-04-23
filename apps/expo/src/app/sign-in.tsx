import React from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import { useAssets } from "expo-asset";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import type { CodedError } from "expo-modules-core";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useAppColorScheme } from "twrnc";
import { authClient } from "~/utils/auth";
import tw from "~/utils/tailwind";
import TextThemed from "../components/TextThemed";
import Background from "../components/Background";
import { StatusBar } from "expo-status-bar";
// @ts-ignore
import googleSignInNeutral from "../../assets/google-signin-neutral.png";

export default function SignIn() {
  const [assets] = useAssets([
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("../../assets/adaptive-icon.png"),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("../../assets/google-signin-neutral.png"),
  ]);

  const insets = useSafeAreaInsets();
  // TODO add color scheme toggle to sign-in page
  const [colorScheme] = useAppColorScheme(tw);

  return (
    <LinearGradient
      style={tw`flex-1`}
      //#D28769, #75a66b
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      colors={[tw.color("bg-yellow-700")!, tw.color("bg-green-700")!]}
      end={{ x: 0.25, y: 0.4 }}
      locations={[0.35, 0.45]}
    >
      <StatusBar style="light" />
      <SafeAreaView style={tw`flex-1 flex justify-end`}>
        <Image
          alt=""
          style={tw`mb-6 h-44 aspect-square mx-auto`}
          source={assets?.[0]}
        />
        <Background
          variant="modal"
          style={tw`pb-16 px-3 rounded-t-3xl h-3/4 -mb-[${insets.bottom}], shadow-2xl flex gap-8 justify-end`}
        >
          <View style={tw`flex gap-4 justify-center grow`}>
            <TextThemed style={tw`text-4xl font-semibold text-center px-8`}>
              Welcome to Probable Pitcher
            </TextThemed>
            <TextThemed
              style={tw`text-center text-base text-muted-foreground`}
              variant="muted"
            >
              Sign in with an identity provider to get started.
            </TextThemed>
          </View>
          <View style={tw`flex gap-8`}>
            <Pressable
              style={tw`active:opacity-10 h-[44px] flex justify-center rounded-xl bg-[#f2f2f2] shadow-sm`}
              onPress={async () => {
                try {
                  await authClient.signIn.social({
                    provider: "google",
                    callbackURL: "/",
                  });
                  router.replace("/");
                } catch (e: unknown) {
                  console.error("Unexpected error during Google sign-in", e);
                }
              }}
            >
              <Image
                alt="Sign in with Google"
                style={tw`h-1/2`}
                contentFit="contain"
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                source={googleSignInNeutral}
              />
            </Pressable>
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
              }
              buttonStyle={
                colorScheme === "dark"
                  ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
                  : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              style={tw`mx-auto h-[44px] w-full active:opacity-10 rounded-xl overflow-hidden`}
              onPress={async () => {
                try {
                  const credential = await AppleAuthentication.signInAsync({
                    requestedScopes: [
                      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                      AppleAuthentication.AppleAuthenticationScope.EMAIL,
                    ],
                  });

                  if (credential.identityToken === null) {
                    console.error("null identity token");
                    return null;
                  }
                  await authClient.signIn.social({
                    provider: "apple",
                    idToken: {
                      token: credential.identityToken, // Apple ID Token,
                      //nonce: // Nonce (optional)
                      //accessToken: // Access Token (optional)
                    },
                  });
                  router.replace("/");
                } catch (e: unknown) {
                  if (isCodedError(e) && e.code === "ERR_REQUEST_CANCELED") {
                    return null;
                  } else {
                    console.error("Unexpected error during Apple sign-in", e);
                  }
                }
              }}
            />
          </View>
        </Background>
      </SafeAreaView>
    </LinearGradient>
  );
}

function isCodedError(
  possibleCodedError: unknown,
): possibleCodedError is CodedError {
  return !!possibleCodedError && !!(possibleCodedError as CodedError).code;
}
