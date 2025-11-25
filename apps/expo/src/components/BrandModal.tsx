import { View } from "react-native";
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
  const insets = useSafeAreaInsets();

  return (
    <AnimatedViewStyled entering={FadeInDown} className="flex-1">
      <LinearGradientStyled
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={["#c5ffb8", "#a1d995", "#41922d"]}
        locations={[0, 0.15, 0.4]}
        className="flex-1"
      >
        <StatusBar style="dark" backgroundColor="transparent" />
        <View className="flex flex-1 justify-end">
          <View className="flex h-1/3 items-center justify-center">
            <View style={{ paddingTop: insets.top, height: "100%" }}>
              <ImageStyled
                alt=""
                className="my-auto aspect-square h-11/12"
                source={{
                  uri: "brand_icon",
                }}
              />
            </View>
          </View>
          <View className="bg-background flex h-2/3 justify-end gap-8 rounded-t-3xl px-4 pb-16 shadow-2xl">
            {children}
          </View>
        </View>
      </LinearGradientStyled>
    </AnimatedViewStyled>
  );
}
