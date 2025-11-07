import { useState } from "react";
import { Dimensions, Keyboard, Platform, Text, View } from "react-native";
import Animated, {
  FadeInRight,
  FadeOutRight,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import PressableThemed from "./PressableThemed";
import TextInputThemed from "./TextInputThemed";

interface Props {
  onChange: (text?: string) => void;
  onActive: () => void;
  onCancel: () => void;
}

export default function SearchInput({ onChange, onActive, onCancel }: Props) {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState<string>();
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [searchComponentWidth, setSearchComponentWidth] = useState<number>(
    Dimensions.get("window").width,
  );
  const [cancelButtonWidth, setCancelButtonWidth] = useState<number>(0);
  const searchFilterWidth = useSharedValue(searchComponentWidth - 24);
  const searchFilterStyle = useAnimatedStyle(
    () => ({
      width: searchFilterWidth.value,
    }),
    [],
  );

  return (
    <Animated.View
      layout={LinearTransition}
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
      <View className="mb-1.5 flex w-full flex-row flex-nowrap items-center justify-between">
        <Animated.View style={searchFilterStyle}>
          <TextInputThemed
            onFocus={() => {
              if (Platform.OS !== "android") {
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
                if (Platform.OS !== "android") {
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
            className="bg-card"
            leftIcon={
              <>
                <Text className="text-muted absolute ml-2">
                  <AntDesign name="search" size={18} />
                </Text>
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
            exiting={FadeOutRight.duration(150)}
            onLayout={(event) => {
              const roundedWidth = Math.round(event.nativeEvent.layout.width);
              if (cancelButtonWidth !== roundedWidth) {
                setCancelButtonWidth(roundedWidth);
                searchFilterWidth.set(() =>
                  withTiming(searchComponentWidth - roundedWidth, {
                    duration: 100,
                  }),
                );
              }
            }}
          >
            <PressableThemed
              onPress={() => {
                if (Platform.OS !== "android") {
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
              <Text className="text-primary pl-3 text-lg font-bold tracking-tight">
                Done
              </Text>
            </PressableThemed>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}
