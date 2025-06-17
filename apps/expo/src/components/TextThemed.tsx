import type { AccessibilityRole } from "react-native";
import type { ClassInput } from "twrnc";
import React from "react";
import { Text } from "react-native";

import tw from "~/utils/tailwind";

export const variantClasses = {
  default: "text-slate-950 dark:text-slate-50",
  primary: "text-sky-600 dark:text-sky-300",
  secondary: "text-white",
  accent: "text-green-700 dark:text-green-300",
  muted: "text-slate-500 dark:text-slate-400",
  alert: "text-red-600 dark:text-red-400",
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
