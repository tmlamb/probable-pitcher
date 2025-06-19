import type {
  ColorValue,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TextInputKeyPressEventData,
  ViewStyle,
} from "react-native";
import type { ClassInput } from "twrnc";
import React from "react";
import { TextInput } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import tw from "~/utils/tailwind";
import Card from "./Card";
import TextThemed, { variantClasses } from "./TextThemed";

interface TextInputThemedProps {
  onChangeText?: (text: string) => void;
  onChange?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
  onBlur?: (e: unknown) => void;
  onFocus?: (e: unknown) => void;
  value?: string;
  style?: ViewStyle;
  textInputStyle?: ClassInput;
  labelStyle?: ClassInput;
  label?: string;
  leftIcon?: React.ReactNode;
  placeholder?: string;
  placeholderTextColor?: ColorValue;
  maxLength?: number;
  selectTextOnFocus?: boolean;
  clearTextOnFocus?: boolean;
  keyboardType?: KeyboardTypeOptions;
  numeric?: boolean;
  editable?: boolean;
  selection?: { start: number; end?: number };
  onKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
  accessibilityLabel?: string;
  testID?: string;
}

// When text in an input is right justifed, any trailing whitespace in the field gets treated
// as space to be removed so that the text is right aligned. This causes spaces to be ignored
// visually until a non-whitespace character is entered. &nbsp; (\u00a0) does not behave this
// way, so swapping them in for the input's value fixes the issue.
const nbspReplace = (str: string) => str.replace(/\u0020/g, "\u00a0");
const spaceReplace = (str: string) => str.replace(/\u00a0/g, "\u0020");

// Prevents non-numeric values in numeric fields and trims leading zeros.
const numericReplace = (str: string) =>
  str.replace(/[^0-9|\\.]/g, "").replace(/^0+/g, "");

export default function TextInputThemed({
  onChangeText,
  onChange,
  onBlur,
  onFocus,
  value,
  style,
  textInputStyle,
  labelStyle,
  label,
  leftIcon,
  placeholder,
  placeholderTextColor,
  maxLength,
  selectTextOnFocus = false,
  clearTextOnFocus = false,
  keyboardType = "default",
  numeric = false,
  editable = true,
  selection,
  onKeyPress,
  accessibilityLabel,
  testID,
}: TextInputThemedProps) {
  const handleChange = (text: string) => {
    const normalizedText = spaceReplace(numeric ? numericReplace(text) : text);
    onChangeText?.(normalizedText);
  };

  return (
    <Card style={tw.style("relative mx-0 p-0", style)}>
      <Card style={tw.style("relative mx-0 w-full flex-row p-0")}>
        {leftIcon ??
          (label && (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={tw`absolute`}
            >
              <>
                {label && (
                  <TextThemed
                    variant="muted"
                    style={tw.style(
                      "pl-0 text-lg leading-tight tracking-tight",
                      labelStyle,
                    )}
                    accessible={false}
                  >
                    {label}
                  </TextThemed>
                )}
              </>
            </Animated.View>
          ))}
        <TextInput
          onChangeText={handleChange}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          value={value ? nbspReplace(value) : value}
          style={tw.style(
            variantClasses.default,
            "z-20 w-full py-1.5 pl-8 pr-0 text-lg leading-tight tracking-normal",
            textInputStyle,
          )}
          placeholder={placeholder}
          placeholderTextColor={
            placeholderTextColor ?? tw.color(variantClasses.muted)
          }
          maxLength={maxLength}
          keyboardType={keyboardType}
          textAlign={"left"}
          textAlignVertical="center"
          selectTextOnFocus={selectTextOnFocus}
          clearTextOnFocus={clearTextOnFocus}
          editable={editable}
          selection={selection}
          onKeyPress={onKeyPress}
          multiline
          numberOfLines={1}
          scrollEnabled={false}
          submitBehavior="blurAndSubmit"
          accessibilityLabel={accessibilityLabel ?? label}
          testID={testID}
          allowFontScaling={false}
        />
      </Card>
    </Card>
  );
}
