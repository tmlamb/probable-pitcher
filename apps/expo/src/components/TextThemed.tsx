import type { AccessibilityRole } from "react-native";
import { Text } from "react-native";
import { twMerge } from "tailwind-merge";

export const textVariants = {
  default: "text-foreground",
  primary: "text-primary",
  secondary: "text-secondary-foreground",
  accent: "text-accent",
  muted: "text-muted-foreground",
  alert: "text-destructive",
};

interface TextThemedProps {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof textVariants;
  numberOfLines?: number;
  accessibilityRole?: AccessibilityRole;
  accessible?: boolean;
}

export default function TextThemed({
  children,
  className,
  variant = "default",
  numberOfLines,
  accessibilityRole,
  accessible = true,
}: TextThemedProps) {
  return (
    <Text
      maxFontSizeMultiplier={1}
      numberOfLines={numberOfLines}
      className={twMerge("text-lg", textVariants[variant], className)}
      accessibilityRole={accessibilityRole}
      accessible={accessible}
    >
      {children}
    </Text>
  );
}
