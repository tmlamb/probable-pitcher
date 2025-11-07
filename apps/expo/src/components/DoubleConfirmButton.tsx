import React from "react";
import { View } from "react-native";
import Animated, { RollInRight, RollOutRight } from "react-native-reanimated";
import { twMerge } from "tailwind-merge";

import PressableThemed from "./PressableThemed";
import { AnimatedViewStyled } from "./Styled";

interface Props {
  className?: string;
  first: React.ReactNode;
  second: React.ReactNode;
  accessibilityLabel: string;
}

export default function DoubleConfirm({
  className,
  first,
  second,
  accessibilityLabel,
}: Props) {
  const [toggle, setToggle] = React.useState(false);

  return (
    <View className={twMerge("relative", className)}>
      <PressableThemed
        onPress={() => {
          setToggle(!toggle);
        }}
        accessibilityLabel={`${
          toggle ? "Conceal" : "Reveal"
        } button to ${accessibilityLabel}`}
      >
        {first}
      </PressableThemed>
      {toggle && (
        <AnimatedViewStyled
          entering={RollInRight.springify().stiffness(50).damping(6).mass(0.3)}
          exiting={RollOutRight.springify().stiffness(50).damping(6).mass(0.3)}
          className="absolute right-2.5 h-full items-center justify-center"
          accessible
          accessibilityLabel={`${accessibilityLabel}`}
          accessibilityRole="button"
        >
          {second}
        </AnimatedViewStyled>
      )}
    </View>
  );
}
