import type { CodedError } from "expo-modules-core";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "expo-modules-core";
import { useRouter } from "expo-router";
import * as Sentry from "@sentry/react-native";
import { useQueryClient } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";

import BrandModal from "~/components/BrandModal";
import {
  AppleAuthenticationButtonStyled,
  ImageStyled,
} from "~/components/Styled";
import { trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";

export default function SignIn() {
  const colorScheme = useColorScheme();

  const [signInPending, setSignInPending] = useState(false);
  const [signInError, setSignInError] = useState<Error | null>(null);

  if (signInError) {
    throw signInError;
  }

  const queryClient = useQueryClient();
  const router = useRouter();

  const session = authClient.useSession();

  useEffect(() => {
    if (session.data) {
      if (router.canDismiss()) router.dismissAll();
      router.replace("/");
    }
  }, [router, session.data]);

  return (
    <BrandModal>
      <View className="flex grow justify-center gap-4">
        <Text
          maxFontSizeMultiplier={1.5}
          className="text-foreground text-center text-4xl font-semibold sm:text-5xl md:text-6xl"
        >
          Welcome to{"\n"}Probable Pitcher
        </Text>
        <Text
          maxFontSizeMultiplier={2}
          className="text-muted text-center text-lg md:text-xl"
        >
          Sign in with one of the options below to start
        </Text>
      </View>
      <View className="flex gap-8">
        <Pressable
          className={twMerge(
            "flex h-[45px] justify-center rounded-lg border-1 border-gray-200 bg-[#f2f2f2] py-[.65rem] shadow-2xs transition-opacity duration-200",
            signInPending ? "opacity-20" : "",
          )}
          disabled={signInPending}
          onPress={async () => {
            try {
              setSignInPending(true);
              await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
              });
              queryClient
                .invalidateQueries(trpc.pathFilter())
                .catch(Sentry.captureException);
            } catch (e) {
              setSignInError(
                new Error("Unknown error during Google Sign-In", {
                  cause: e,
                }),
              );
            } finally {
              setSignInPending(false);
            }
          }}
          accessibilityLabel="Sign in with Google"
          accessibilityState={{ busy: signInPending, disabled: signInPending }}
        >
          {signInPending ? (
            <Animated.View entering={FadeIn.duration(500)}>
              <ActivityIndicator className={`text-muted m-auto`} size="small" />
            </Animated.View>
          ) : (
            <ImageStyled
              alt="Sign in with Google"
              className="h-full"
              contentFit="contain"
              source={{ uri: "google_signin_neutral" }}
            />
          )}
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
            className={`h-[45px] w-full overflow-hidden rounded-lg ${signInPending ? "opacity-20" : ""}`}
            accessibilityLabel="Sign in with Apple"
            accessibilityState={{
              busy: signInPending,
              disabled: signInPending,
            }}
            onPress={async () => {
              if (signInPending) return;
              try {
                setSignInPending(true);
                const credential = await AppleAuthentication.signInAsync({
                  requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                  ],
                });

                if (credential.identityToken === null) {
                  throw new Error("Apple Sign-In failed: no identity token");
                }
                const result = await authClient.signIn.social({
                  provider: "apple",
                  idToken: {
                    token: credential.identityToken,
                  },
                  callbackURL: "/",
                });
                if (result.error) {
                  throw new Error("Apple Sign-In failed", {
                    cause: result.error,
                  });
                }
                queryClient
                  .invalidateQueries(trpc.pathFilter())
                  .catch(Sentry.captureException);
              } catch (e: unknown) {
                if (isCodedError(e) && e.code === "ERR_REQUEST_CANCELED") {
                  return null;
                } else if (e instanceof Error) {
                  setSignInError(e);
                } else {
                  setSignInError(
                    new Error("Unknown error during Apple Sign-In", {
                      cause: e,
                    }),
                  );
                }
              } finally {
                setSignInPending(false);
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
