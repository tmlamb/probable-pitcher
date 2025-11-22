import type {
  KeyboardTypeOptions,
  TextInputChangeEvent,
  TextInputKeyPressEvent,
} from "react-native";
import { Text, TextInput, View } from "react-native";
import { FadeIn, FadeOut } from "react-native-reanimated";
import Feather from "@expo/vector-icons/Feather";
import { twMerge } from "tailwind-merge";

import { AnimatedViewStyled } from "./Styled";

interface TextInputThemedProps {
  onChangeText?: (text: string) => void;
  onChange?: (e: TextInputChangeEvent) => void;
  onBlur?: (e: unknown) => void;
  onFocus?: (e: unknown) => void;
  value?: string;
  className?: string;
  textInputClassName?: string;
  labelClassName?: string;
  label?: string;
  leftIcon?: React.ReactNode;
  leftIconName?: string;
  placeholder?: string;
  maxLength?: number;
  selectTextOnFocus?: boolean;
  clearTextOnFocus?: boolean;
  keyboardType?: KeyboardTypeOptions;
  numeric?: boolean;
  editable?: boolean;
  selection?: { start: number; end?: number };
  onKeyPress?: (e: TextInputKeyPressEvent) => void;
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
  className,
  textInputClassName,
  labelClassName,
  label,
  leftIcon,
  leftIconName,
  placeholder,
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
    <View
      className={twMerge(
        "bg-input relative flex-row items-center justify-between rounded-lg",
        className,
      )}
    >
      <View className="relative ml-2 w-full flex-row items-center justify-between gap-2">
        {(leftIconName && (
          <Text maxFontSizeMultiplier={2} className="text-muted">
            <Feather name="search" size={18} />
          </Text>
        )) ??
          (label && (
            <AnimatedViewStyled
              entering={FadeIn}
              exiting={FadeOut}
              className="absolute"
            >
              <>
                {label && (
                  <Text
                    maxFontSizeMultiplier={2}
                    className={twMerge(
                      "text-muted pl-0 leading-tight tracking-tight",
                      labelClassName,
                    )}
                    accessible={false}
                  >
                    {label}
                  </Text>
                )}
              </>
            </AnimatedViewStyled>
          ))}
        <TextInput
          onChangeText={handleChange}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          value={value ? nbspReplace(value) : value}
          className={twMerge(
            "text-foreground placeholder:text-muted z-20 w-full px-0 py-1.5 text-xl leading-tight tracking-normal",
            textInputClassName,
          )}
          placeholder={placeholder}
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
          maxFontSizeMultiplier={2}
        />
      </View>
    </View>
  );
}
