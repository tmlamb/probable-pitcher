import type { AccessibilityState } from "react-native";
import { View } from "react-native";

// import Animated from "react-native-reanimated";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { LinearGradient } from "expo-linear-gradient";
// import { styled } from "nativewind";

export const viewVariants = {
  default: "bg-background",
  modal: "bg-secondary",
};

interface ViewThemedProps {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof viewVariants;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityState?: AccessibilityState;
}

export default function ViewThemed({
  children,
  className,
  variant = "default",
  accessible = false,
  accessibilityLabel,
  accessibilityState,
}: ViewThemedProps) {
  return (
    <View
      className={`flex-1 ${viewVariants[variant]} ${className}`}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
    >
      {children}
    </View>
  );
}

// export const AnimatedViewStyled = styled(Animated.View) as typeof Animated.View;
// export const SafeAreaViewStyled = styled(SafeAreaView) as typeof SafeAreaView;
// export const LinearGradientStyled = styled(
//   LinearGradient,
// ) as typeof LinearGradient;
