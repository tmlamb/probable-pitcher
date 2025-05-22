import type { ClassInput } from "twrnc";
import React from "react";
import { Dimensions, Keyboard, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import tw from "~/utils/tailwind";
import PressableThemed from "./PressableThemed";
import TextInputThemed from "./TextInputThemed";
import TextThemed from "./TextThemed";

interface Props {
  onChange: (text?: string) => void;
  onActive: () => void;
  onCancel: () => void;
  style?: ClassInput;
}

export default function SearchInput({
  onChange,
  onActive,
  onCancel,
  style,
}: Props) {
  const navigation = useNavigation();
  const [searchText, setSearchText] = React.useState<string>();
  const [showCancelButton, setShowCancelButton] = React.useState(false);
  const [searchComponentWidth, setSearchComponentWidth] =
    React.useState<number>(Dimensions.get("window").width);
  const [cancelButtonWidth, setCancelButtonWidth] = React.useState<number>(0);
  const searchFilterWidth = useSharedValue(searchComponentWidth - 24);
  const searchFilterStyle = useAnimatedStyle(
    () => ({
      width: searchFilterWidth.value,
    }),
    [],
  );

  const searchComponentMarginTop = useSharedValue(0);
  const searchComponentStyle = useAnimatedStyle(
    () => ({
      marginTop: searchComponentMarginTop.value,
    }),
    [],
  );

  return (
    <Animated.View
      style={tw.style(style, searchComponentStyle)}
      onLayout={(event) => {
        const roundedWidth = Math.round(event.nativeEvent.layout.width);
        if (roundedWidth !== searchComponentWidth) {
          setSearchComponentWidth(roundedWidth);
          searchFilterWidth.set(() =>
            withTiming(roundedWidth - (searchText ? cancelButtonWidth : 0), {
              duration: 400,
              easing: Easing.inOut(Easing.ease),
            }),
          );
        }
      }}
    >
      <View
        style={tw`mb-1.5 flex w-full flex-row flex-nowrap items-center justify-between`}
      >
        <Animated.View style={searchFilterStyle}>
          <TextInputThemed
            onFocus={() => {
              searchFilterWidth.set(() => {
                return withTiming(searchComponentWidth - cancelButtonWidth, {
                  duration: 300,
                  easing: Easing.inOut(Easing.ease),
                });
              });
              searchComponentMarginTop.set(() =>
                withTiming(0, {
                  duration: 200,
                  easing: Easing.inOut(Easing.ease),
                }),
              );
              setShowCancelButton(true);
              navigation.setOptions({
                headerShown: false,
              });
              onActive();
            }}
            onBlur={() => {
              if (!searchText) {
                searchFilterWidth.set(() =>
                  withTiming(searchComponentWidth, {
                    duration: 200,
                    easing: Easing.inOut(Easing.ease),
                  }),
                );
                searchComponentMarginTop.set(() =>
                  withTiming(0, {
                    duration: 400,
                    easing: Easing.inOut(Easing.ease),
                  }),
                );
                setShowCancelButton(false);
                navigation.setOptions({
                  headerShown: true,
                });
                onCancel();
              }
            }}
            onChangeText={(text) => {
              onChange(text);
              setSearchText(text);
            }}
            value={searchText ?? ""}
            style={tw.style("rounded-xl")}
            leftIcon={
              <>
                <TextThemed variant="muted" style={tw`absolute ml-2`}>
                  <AntDesign name="search1" size={18} />
                </TextThemed>
              </>
            }
            placeholder="Search"
            accessibilityLabel="Filter list of pitchers by name"
          />
        </Animated.View>
        {showCancelButton && (
          <Animated.View
            key="cancelbutton"
            entering={FadeIn.duration(200)
              .delay(200)
              .easing(Easing.inOut(Easing.ease))}
            onLayout={(event) => {
              const roundedWidth = Math.round(event.nativeEvent.layout.width);
              if (cancelButtonWidth !== roundedWidth) {
                setCancelButtonWidth(roundedWidth);
                searchFilterWidth.set(() =>
                  withTiming(searchComponentWidth - roundedWidth, {
                    duration: 400,
                    easing: Easing.inOut(Easing.ease),
                  }),
                );
              }
            }}
          >
            <PressableThemed
              onPress={() => {
                searchFilterWidth.set(() =>
                  withTiming(searchComponentWidth, {
                    duration: 200,
                    easing: Easing.inOut(Easing.ease),
                  }),
                );
                searchComponentMarginTop.set(() =>
                  withTiming(0, {
                    duration: 200,
                    easing: Easing.inOut(Easing.ease),
                  }),
                );
                onChange(undefined);
                setSearchText(undefined);
                setShowCancelButton(false);
                navigation.setOptions({
                  headerShown: true,
                });
                onCancel();
                Keyboard.dismiss();
              }}
              accessibilityLabel="Clear search filter"
            >
              <TextThemed
                variant="primary"
                style={tw`pl-3 text-lg font-bold tracking-tight`}
              >
                Done
              </TextThemed>
            </PressableThemed>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}
