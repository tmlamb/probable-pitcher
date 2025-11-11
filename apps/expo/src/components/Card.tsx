import type { AccessibilityState } from "react-native";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";

const variantClasses = {
  default: "bg-card",
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof variantClasses;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityState?: AccessibilityState;
}

export default function Card({
  children,
  className,
  variant = "default",
  accessible = false,
  accessibilityLabel,
  accessibilityState,
}: CardProps) {
  return (
    <View
      className={twMerge(
        "mx-3 min-h-[45px] flex-row items-center justify-between rounded-lg px-3 py-2.5",
        variantClasses[variant],
        className,
      )}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
    >
      {children}
    </View>
  );
}
