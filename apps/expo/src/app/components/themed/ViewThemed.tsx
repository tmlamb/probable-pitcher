import React from "react";
import type { AccessibilityState } from "react-native";
import { View } from "react-native";
import type { ClassInput } from "twrnc";
import tw from "~/utils/tailwind";

const variantClasses = {
  default: "rounded-none",
  rounded: "rounded-xl",
};

interface ViewThemedProps {
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
  accessible,
  accessibilityLabel,
  accessibilityState,
}: ViewThemedProps) {
  return (
    <View
      style={tw.style(
        "bg-background py-1.5 px-3 flex-row items-center justify-between",
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
