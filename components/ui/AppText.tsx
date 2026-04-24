import { forwardRef } from "react";
import { Text as RNText, type TextProps } from "react-native";

export const AppText = forwardRef<RNText, TextProps>(function AppText({ style, ...props }, ref) {
  return <RNText ref={ref} {...props} style={[{ fontFamily: "Inter" }, style]} />;
});
