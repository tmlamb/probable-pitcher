import React from "react";
import type { AccessibilityState } from "react-native";
import { View } from "react-native";
import type { ClassInput } from "twrnc";
import tw from "~/utils/tailwind";

const variantClasses = {
  default:
    "bg-slate-100 border-slate-200 dark:bg-slate-900 dark:border-slate-800",
  primary: "bg-sky-600",
};
//py-1.5 px-3 flex-row items-center justify-between
interface CardProps {
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
}: CardProps) {
  return (
    <View
      style={tw.style(
        "px-4 py-2 flex-row items-center justify-between rounded-xl",
        style,
        variantClasses[variant],
      )}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
    >
      {children}
    </View>
  );
}
