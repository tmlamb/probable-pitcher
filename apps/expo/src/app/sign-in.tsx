import type { CodedError } from "expo-modules-core";
import React, { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as AppleAuthentication from "expo-apple-authentication";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useQueryClient } from "@tanstack/react-query";
import { useAppColorScheme } from "twrnc";

import { trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";
import tw from "~/utils/tailwind";
import Background from "../components/Background";
import TextThemed from "../components/TextThemed";

export default function SignIn() {
  const queryClient = useQueryClient();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session) {
      router.replace("/");
    }
  }, [isPending, session]);

  const insets = useSafeAreaInsets();
  // TODO add color scheme toggle to sign-in page
  const [colorScheme] = useAppColorScheme(tw);

  return (
    <Animated.View entering={FadeInUp} style={tw`flex-1`}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={
          colorScheme === "dark"
            ? ["#965e32", "#567259", "#789d7c"]
            : ["#c3875b", "#789d7c", "#a6cbb0"]
        }
        locations={[0, 0.4, 1]}
        style={tw`flex-1`}
      >
        <StatusBar style="light" />
        <SafeAreaView style={tw`flex flex-1 justify-end`}>
          {colorScheme === "dark" ? (
            <Image
              alt=""
              style={tw`mx-auto mb-6 aspect-square h-44`}
              source={{
                uri: "adaptive_icon_dark",
              }}
            />
          ) : (
            <Image
              alt=""
              style={tw`mx-auto mb-6 aspect-square h-44`}
              source={{
                uri: "adaptive_icon_light",
              }}
            />
          )}
          <Background
            variant="modal"
            style={tw`h-3/4 rounded-t-3xl px-3 pb-16 -mb-[${insets.bottom}], flex justify-end gap-8 shadow-2xl`}
          >
            <View style={tw`flex grow justify-center gap-4`}>
              <TextThemed style={tw`px-8 text-center text-4xl font-semibold`}>
                Welcome to Probable Pitcher
              </TextThemed>
              <TextThemed style={tw`text-center text-base`} variant="muted">
                Sign in with one of the options below to start
              </TextThemed>
            </View>
            <View style={tw`flex gap-8`}>
              <Pressable
                style={tw`flex h-[44px] justify-center rounded-xl bg-[#f2f2f2] shadow-sm active:opacity-10`}
                onPress={async () => {
                  try {
                    await authClient.signIn.social({
                      provider: "google",
                      callbackURL: "/",
                    });
                    queryClient
                      .invalidateQueries(trpc.pathFilter())
                      .catch(console.error);
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
                  source={{ uri: "google_signin_neutral" }}
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
                style={tw`mx-auto h-[44px] w-full overflow-hidden rounded-xl active:opacity-10`}
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
                        token: credential.identityToken,
                      },
                    });
                    queryClient
                      .invalidateQueries(trpc.pathFilter())
                      .catch(console.error);
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
    </Animated.View>
  );
}

function isCodedError(
  possibleCodedError: unknown,
): possibleCodedError is CodedError {
  return !!possibleCodedError && !!(possibleCodedError as CodedError).code;
}
