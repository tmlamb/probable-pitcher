import { useColorScheme, View } from "react-native";
import { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import {
  AnimatedViewStyled,
  ImageStyled,
  LinearGradientStyled,
} from "./Styled";

interface BrandModalProps {
  children: React.ReactNode;
}

export default function BrandModal({ children }: BrandModalProps) {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <AnimatedViewStyled entering={FadeInDown} className="flex-1">
      <LinearGradientStyled
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={
          colorScheme === "dark"
            ? ["#b16a00", "#41922d", "#a1d995"]
            : ["#f1bd7e", "#a1d995", "#c5ffb8"]
        }
        locations={[0, 0.4, 1]}
        className="flex-1"
      >
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <View className="flex flex-1 justify-end">
          <View className="flex h-1/3 items-center justify-center">
            <View style={{ paddingTop: insets.top, height: "100%" }}>
              <ImageStyled
                alt=""
                className="my-auto aspect-square h-10/12"
                source={{
                  uri:
                    colorScheme === "dark"
                      ? "adaptive_icon_dark"
                      : "adaptive_icon_light",
                }}
              />
            </View>
          </View>
          <View className="bg-popover flex h-2/3 justify-end gap-8 rounded-t-3xl px-4 pb-16 shadow-2xl">
            {children}
          </View>
        </View>
      </LinearGradientStyled>
    </AnimatedViewStyled>
  );
}
