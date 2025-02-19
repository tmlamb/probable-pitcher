import React from "react";
import type { AccessibilityRole } from "react-native";
import { Text } from "react-native";
import type { ClassInput } from "twrnc";
import tw from "~/utils/tailwind";

export const variantClasses = {
  default: "text-foreground",
  primary: "text-primary-foreground",
  secondary: "text-secondary-foreground",
  accent: "text-accent-foreground",
  muted: "text-muted-foreground",
  alert: "text-destructive-foreground",
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
  accessible,
}: TextThemedProps) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={tw.style(style, variantClasses[variant])}
      accessibilityRole={accessibilityRole}
      accessible={accessible}
    >
      {children}
    </Text>
  );
}
