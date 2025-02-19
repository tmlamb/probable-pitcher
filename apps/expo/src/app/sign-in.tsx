import * as AppleAuthentication from "expo-apple-authentication";
import { router } from "expo-router";
import { Pressable, View, Image } from "react-native";
import type { CodedError } from "expo-modules-core";
import { LinearGradient } from "expo-linear-gradient";
import { signIn } from "~/utils/auth";
import { useAppColorScheme } from "twrnc";
import tw from "~/utils/tailwind";

//<Image
//  alt=""
//  className="h-3/5 max-w-20 aspect-square mx-auto"
//  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
//  source={require("../../assets/adaptive-icon.png")}
//  resizeMode="contain"
///>
export default function SignIn() {
  const [colorScheme] = useAppColorScheme(tw);

  return (
    <View style={tw`flex-1 flex justify-end`}>
      <LinearGradient
        //#D28769, #75a66b
        style={tw`h-full w-full top-0 absolute z-10`}
        colors={["rgb(210, 135, 105)", "rgb(117, 166, 107)"]}
        end={{ x: 0.25, y: 0.4 }}
        locations={[0.3, 0.5]}
      />
      <View
        style={tw`h-3/5 z-20 flex justify-center gap-8 bg-primary px-4 rounded-t-3xl`}
      >
        <Pressable
          style={tw`active:opacity-10 h-[44px] flex justify-center rounded-md bg-[#f2f2f2]`}
          onPress={async () => {
            await signIn.social({
              provider: "google",
              callbackURL: "/",
            });
            router.replace("/");
          }}
        >
          <View style={tw`bg-transparent w-full h-1/2 my-auto`}>
            <Image
              alt="Sign in with Google"
              style={tw`max-h-full w-full`}
              resizeMode="contain"
              //source="google-signin-neutral.png"
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
              source={require("../../assets/google-signin-neutral.png")}
            />
          </View>
        </Pressable>

        <View
          style={tw`mx-auto w-full h-[44px] active:opacity-10 rounded-md overflow-hidden`}
        >
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
            }
            buttonStyle={
              colorScheme === "dark"
                ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
                : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            }
            cornerRadius={1}
            //className="mx-auto mt-9 w-[200px] h-[43.24px] active:opacity-10"
            style={{ height: 44 }} // You must choose default size
            onPress={async () => {
              try {
                const credential = await AppleAuthentication.signInAsync({
                  requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                  ],
                });

                if (credential.identityToken === null) {
                  console.log("null identity token");
                  return null;
                }
                await signIn.social({
                  provider: "apple",
                  idToken: {
                    token: credential.identityToken, // Apple ID Token,
                    //nonce: // Nonce (optional)
                    //accessToken: // Access Token (optional)
                  },
                });
                //console.log("CREDENTIAL", credential);
                // signed in
                router.replace("/");
              } catch (e: unknown) {
                console.log("OTHER ERROR", e);
                if (isCodedError(e) && e.code === "ERR_REQUEST_CANCELED") {
                  console.log("CANCELED");
                  return null;
                } else {
                  console.log("OTHER ERROR", e);
                }
              }
            }}
          />
        </View>
      </View>
    </View>
  );
}

function isCodedError(
  possibleCodedError: unknown,
): possibleCodedError is CodedError {
  return !!possibleCodedError && !!(possibleCodedError as CodedError).code;
}
