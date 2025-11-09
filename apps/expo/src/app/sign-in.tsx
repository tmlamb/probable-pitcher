import type { CodedError } from "expo-modules-core";
import { useEffect, useRef } from "react";
import { AppState, Pressable, Text, useColorScheme, View } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "expo-modules-core";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import BrandModal from "~/components/BrandModal";
import {
  AppleAuthenticationButtonStyled,
  ImageStyled,
} from "~/components/Styled";
import { trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";

export default function SignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // TODO add color scheme toggle to sign-in page
  const colorScheme = useColorScheme();

  const appState = useRef(AppState.currentState);

  const session = authClient.useSession();

  useEffect(() => {
    function checkAuth() {
      if (session.data) {
        router.replace("/");
      }
    }

    checkAuth();

    const listener = AppState.addEventListener("change", (nextAppState) => {
      if (
        /inactive|background/.exec(appState.current) &&
        nextAppState === "active"
      ) {
        checkAuth();
      }
      appState.current = nextAppState;
    });

    return () => {
      listener.remove();
    };
  }, [router, session.data]);

  return (
    <BrandModal>
      <View className="flex grow justify-center gap-4">
        <Text className="text-foreground text-center text-4xl font-semibold sm:text-5xl md:text-6xl">
          Welcome to{"\n"}Probable Pitcher
        </Text>
        <Text className="text-muted text-center text-lg md:text-xl">
          Sign in with one of the options below to start
        </Text>
      </View>
      <View className="flex gap-8">
        <Pressable
          className="flex h-[45px] justify-center rounded-lg border-1 border-gray-200 bg-[#f2f2f2] py-[.65rem] shadow-2xs transition-opacity duration-200 active:opacity-40 dark:active:opacity-60"
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
          <ImageStyled
            alt="Sign in with Google"
            className="h-full"
            contentFit="contain"
            source={{ uri: "google_signin_neutral" }}
          />
        </Pressable>
        {(Platform.OS === "ios" || Platform.OS === "macos") && (
          <AppleAuthenticationButtonStyled
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
            }
            buttonStyle={
              colorScheme === "dark"
                ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
                : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            }
            className="h-[45px] w-full overflow-hidden rounded-lg"
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
        )}
      </View>
    </BrandModal>
  );
}

function isCodedError(
  possibleCodedError: unknown,
): possibleCodedError is CodedError {
  return !!possibleCodedError && !!(possibleCodedError as CodedError).code;
}
