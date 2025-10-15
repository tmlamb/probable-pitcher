import type { AccessibilityState } from "react-native";
import type { ClassInput } from "twrnc";
import { View } from "react-native";

import tw from "~/utils/tailwind";

export const variantClasses = {
  default: "bg-slate-50 dark:bg-slate-950",
  modal: "bg-white dark:bg-black",
};

interface BackgroundProps {
  children: React.ReactNode;
  style?: ClassInput;
  variant?: keyof typeof variantClasses;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityState?: AccessibilityState;
}

export default function Background({
  children,
  style,
  variant = "default",
  accessible = false,
  accessibilityLabel,
  accessibilityState,
}: BackgroundProps) {
  return (
    <View
      style={tw.style("flex-1", style, variantClasses[variant])}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
    >
      {children}
    </View>
  );
}
