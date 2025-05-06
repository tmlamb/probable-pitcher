import type { ClassInput } from "twrnc";
import React from "react";
import { View } from "react-native";
import Animated, { RollInRight, RollOutRight } from "react-native-reanimated";

import tw from "~/utils/tailwind";
import PressableThemed from "./PressableThemed";

interface Props {
  style?: ClassInput;
  first: React.ReactNode;
  second: React.ReactNode;
  accessibilityLabel: string;
}

export default function DoubleConfirm({
  style,
  first,
  second,
  accessibilityLabel,
}: Props) {
  const [toggle, setToggle] = React.useState(false);

  // TODO wrap {second} in another PressableThemed
  return (
    <View style={tw.style("relative", style)}>
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
        <Animated.View
          entering={RollInRight.springify().stiffness(50).damping(6).mass(0.3)}
          exiting={RollOutRight.springify().stiffness(50).damping(6).mass(0.3)}
          style={[
            tw.style("absolute right-2.5 h-full items-center justify-center"),
          ]}
          accessible
          accessibilityLabel={`${accessibilityLabel}`}
          accessibilityRole="button"
        >
          {second}
        </Animated.View>
      )}
    </View>
  );
}
