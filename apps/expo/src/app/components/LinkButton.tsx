import React from "react";
import type { PressableProps } from "react-native";
import type { ClassInput } from "twrnc";
import PressableThemed from "./PressableThemed";
import tw from "~/utils/tailwind";

type Props = {
  to: To<RootStackParamList>;
  action?: NavigationAction;
  children: JSX.Element | JSX.Element[];
  onPress?: () => void;
  style?: ClassInput;
  beforeNavigation?: () => void;
} & PressableProps;

export default function LinkButton({
  to,
  action,
  children,
  onPress,
  style,
  beforeNavigation,
  disabled,
  accessibilityHint,
  accessibilityLabel,
  accessibilityValue,
}: Props) {
  const { onPress: navigate } = useLinkProps<RootStackParamList>({
    to,
    action,
  });

  return (
    <PressableThemed
      style={tw.style(style)}
      onPress={(e) => {
        onPress?.();
        if (disabled) {
          return;
        }
        beforeNavigation?.();
        navigate(e);
      }}
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={disabled ? { disabled: true } : undefined}
      disabled={disabled}
      accessibilityValue={accessibilityValue}
    >
      {children}
    </PressableThemed>
  );
}
