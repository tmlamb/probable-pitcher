import type { PressableProps, View } from "react-native";
import type { ClassInput } from "twrnc";
import React from "react";
import { Pressable } from "react-native";

import tw from "~/utils/tailwind";

export const variantClasses = {
  default: "",
};

type PressableThemedProps = {
  style?: ClassInput;
  variant?: keyof typeof variantClasses;
  ref?: React.Ref<View>;
} & PressableProps;

export default function PressableThemed({
  children,
  style,
  variant = "default",
  onPress,
  disabled,
  accessibilityHint,
  accessibilityLabel,
  accessibilityRole,
  accessibilityState,
  accessibilityValue,
  ref,
}: PressableThemedProps) {
  return (
    <Pressable
      ref={ref}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) =>
        tw.style(
          pressed ? "opacity-60" : "opacity-100",
          style,
          variantClasses[variant],
        )
      }
      accessibilityRole={accessibilityRole ?? "button"}
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={
        accessibilityState ?? (disabled ? { disabled: true } : undefined)
      }
      accessibilityValue={accessibilityValue}
    >
      {children}
    </Pressable>
  );
}
