import type { AccessibilityState } from "react-native";
import type { ClassInput } from "twrnc";
import { View } from "react-native";

import tw from "~/utils/tailwind";

const variantClasses = {
  default:
    "bg-slate-200 border-slate-300 dark:bg-slate-800 dark:border-slate-600",
  primary: "bg-sky-600",
};

interface CardProps {
  children: React.ReactNode;
  style?: ClassInput;
  variant?: keyof typeof variantClasses;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityState?: AccessibilityState;
}

export default function Card({
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
        style,
        "mx-3 flex-row items-center justify-between rounded-xl px-3 py-2",
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
