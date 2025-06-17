import type { CodedError } from "expo-modules-core";
import { useEffect, useRef } from "react";
import { AppState, Pressable, View } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { Image } from "expo-image";
import { Platform } from "expo-modules-core";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAppColorScheme } from "twrnc";

import IconModal from "~/components/IconModal";
import { trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";
import tw from "~/utils/tailwind";
import TextThemed from "../components/TextThemed";

export default function SignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // TODO add color scheme toggle to sign-in page
  const [colorScheme] = useAppColorScheme(tw);

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
  });

  return (
    <IconModal>
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
                fetchOptions: {
                  onSuccess: () => {
                    router.replace("/");
                  },
                },
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
        {(Platform.OS === "ios" || Platform.OS === "macos") && (
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
        )}
      </View>
    </IconModal>
  );
}

function isCodedError(
  possibleCodedError: unknown,
): possibleCodedError is CodedError {
  return !!possibleCodedError && !!(possibleCodedError as CodedError).code;
}
