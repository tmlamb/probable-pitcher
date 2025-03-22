import React from "react";
import type { AccessibilityState } from "react-native";
import { View } from "react-native";
import type { ClassInput } from "twrnc";
import tw from "~/utils/tailwind";

export const variantClasses = {
  default: "bg-slate-50 dark:bg-slate-950 flex-1 px-3",
  modal: "bg-white dark:bg-black flex-1 px-3",
};
//py-1.5 px-3 flex-row items-center justify-between
interface BackgroundProps {
  children: React.ReactNode;
  style?: ClassInput;
  variant?: keyof typeof variantClasses;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityState?: AccessibilityState;
}

export default function ThemedView({
  children,
  style,
  variant = "default",
  accessible = false,
  accessibilityLabel,
  accessibilityState,
}: BackgroundProps) {
  return (
    <View
      style={tw.style("", style, variantClasses[variant])}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
    >
      {children}
    </View>
  );
}
