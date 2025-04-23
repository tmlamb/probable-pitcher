import React from "react";
import { View } from "react-native";
import Animated, { RollInRight, RollOutRight } from "react-native-reanimated";
import type { ClassInput } from "twrnc";
import tw from "~/utils/tailwind";
import Button from "./PressableThemed";

interface Props {
  style?: ClassInput;
  first: JSX.Element;
  second: JSX.Element;
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
      <Button
        onPress={() => {
          setToggle(!toggle);
        }}
        accessibilityLabel={`${
          toggle ? "Conceal" : "Reveal"
        } button to ${accessibilityLabel}`}
      >
        {first}
      </Button>
      {toggle && (
        <Animated.View
          entering={RollInRight.springify().stiffness(50).damping(6).mass(0.3)}
          exiting={RollOutRight.springify().stiffness(50).damping(6).mass(0.3)}
          style={[
            tw.style("absolute items-center justify-center h-full right-2.5"),
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
