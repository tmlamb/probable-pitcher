import Animated from "react-native-reanimated";
import * as AppleAuthentication from "expo-apple-authentication";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { styled } from "nativewind";

export const AnimatedViewStyled = styled(Animated.View) as typeof Animated.View;

export const LinearGradientStyled = styled(
  LinearGradient,
) as typeof LinearGradient;

export const AppleAuthenticationButtonStyled = styled(
  AppleAuthentication.AppleAuthenticationButton,
) as typeof AppleAuthentication.AppleAuthenticationButton;

export const ImageStyled = styled(Image) as typeof Image;
