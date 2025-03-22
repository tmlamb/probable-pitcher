import React from "react";
import type { AccessibilityRole } from "react-native";
import { Text } from "react-native";
import type { ClassInput } from "twrnc";
import tw from "~/utils/tailwind";

export const variantClasses = {
  default: "text-slate-950 dark:text-slate-50",
  primary: "text-sky-700 dark:text-sky-300",
  secondary: "text-white",
  accent: "text-green-700 dark:text-green-300",
  muted: "text-slate-600 dark:text-slate-400",
  alert: "text-red-700 dark:text-red-300",
};

interface TextThemedProps {
  children: React.ReactNode;
  style?: ClassInput;
  variant?: keyof typeof variantClasses;
  numberOfLines?: number;
  accessibilityRole?: AccessibilityRole;
  accessible?: boolean;
}

export default function TextThemed({
  children,
  style,
  variant = "default",
  numberOfLines,
  accessibilityRole,
  accessible = true,
}: TextThemedProps) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={tw.style("text-lg", style, variantClasses[variant])}
      accessibilityRole={accessibilityRole}
      accessible={accessible}
    >
      {children}
    </Text>
  );
}
