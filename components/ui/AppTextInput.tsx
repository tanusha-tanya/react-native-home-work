import { forwardRef } from "react";
import { TextInput as RNTextInput, type TextInputProps } from "react-native";

export const AppTextInput = forwardRef<RNTextInput, TextInputProps>(function AppTextInput(
  { style, ...props },
  ref
) {
  return <RNTextInput ref={ref} {...props} style={[{ fontFamily: "Inter" }, style]} />;
});
