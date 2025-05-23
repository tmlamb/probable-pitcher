import type { ClassInput } from "twrnc";
import React from "react";
import { Dimensions, Keyboard, Platform, View } from "react-native";
import Animated, {
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
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
  const headerHeight = useHeaderHeight();
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
            }),
          );
        }
      }}
    >
      <View
        style={tw.style(
          "mb-1.5 flex w-full flex-row flex-nowrap items-center justify-between",
        )}
      >
        <Animated.View style={searchFilterStyle}>
          <TextInputThemed
            onFocus={() => {
              if (Platform.OS === "android") {
                searchComponentMarginTop.set(() =>
                  withTiming(0, {
                    duration: 200,
                  }),
                );
                navigation.setOptions({
                  headerTransparent: true,
                  header: () => (
                    <View
                      pointerEvents="none"
                      style={tw`bg-transparent opacity-0 h-[${headerHeight}px] w-full`}
                    ></View>
                  ),
                });
              } else {
                navigation.setOptions({
                  headerShown: false,
                });
              }
              searchFilterWidth.set(() => {
                return withTiming(searchComponentWidth - cancelButtonWidth, {
                  duration: 300,
                });
              });
              setShowCancelButton(true);
              onActive();
            }}
            onBlur={() => {
              if (!searchText) {
                if (Platform.OS === "android") {
                  searchComponentMarginTop.set(() =>
                    withTiming(0, {
                      duration: 200,
                    }),
                  );
                  navigation.setOptions({
                    headerTransparent: false,
                    header: undefined,
                  });
                } else {
                  navigation.setOptions({
                    headerShown: true,
                  });
                }
                searchFilterWidth.set(() =>
                  withTiming(searchComponentWidth, {
                    duration: 300,
                  }),
                );
                setShowCancelButton(false);
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
            entering={FadeInRight.duration(200)}
            onLayout={(event) => {
              const roundedWidth = Math.round(event.nativeEvent.layout.width);
              if (cancelButtonWidth !== roundedWidth) {
                setCancelButtonWidth(roundedWidth);
                searchFilterWidth.set(() =>
                  withTiming(searchComponentWidth - roundedWidth, {
                    duration: 400,
                  }),
                );
              }
            }}
          >
            <PressableThemed
              onPress={() => {
                if (Platform.OS === "android") {
                  searchComponentMarginTop.set(() =>
                    withTiming(0, {
                      duration: 200,
                    }),
                  );
                  navigation.setOptions({
                    headerTransparent: false,
                    header: undefined,
                  });
                } else {
                  navigation.setOptions({
                    headerShown: true,
                  });
                }
                searchFilterWidth.set(() =>
                  withTiming(searchComponentWidth, {
                    duration: 300,
                  }),
                );
                onChange(undefined);
                setSearchText(undefined);
                setShowCancelButton(false);
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
