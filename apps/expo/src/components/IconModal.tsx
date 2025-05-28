import Animated, { FadeInUp } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useAppColorScheme } from "twrnc";

import tw from "~/utils/tailwind";
import Background from "./Background";

interface IconModalProps {
  children: React.ReactNode;
}

export default function IconModal({ children }: IconModalProps) {
  const [colorScheme] = useAppColorScheme(tw);
  const insets = useSafeAreaInsets();
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
            {children}
          </Background>
        </SafeAreaView>
      </LinearGradient>
    </Animated.View>
  );
}
