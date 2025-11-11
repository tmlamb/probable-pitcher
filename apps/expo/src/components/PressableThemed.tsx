import type { PressableProps, View } from "react-native";
import { Pressable } from "react-native";
import { twMerge } from "tailwind-merge";

export const pressableVariant = {
  default: "",
};

type PressableThemedProps = {
  className?: string;
  variant?: keyof typeof pressableVariant;
  ref?: React.Ref<View>;
} & PressableProps;

export default function PressableThemed({
  children,
  className,
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
      className={twMerge(
        "opacity-100 transition-opacity active:opacity-60",
        pressableVariant[variant],
        className,
      )}
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
