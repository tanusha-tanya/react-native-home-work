import { StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";
import { AppText as Text } from "../ui/AppText";

type CameraFiltersHeaderProps = {
  title: string;
};

export function CameraFiltersHeader({ title }: CameraFiltersHeaderProps) {
  return <Text style={styles.title}>{title}</Text>;
}

const styles = StyleSheet.create({
  title: {
    color: COLORS.textTertiary,
    fontSize: 21,
    fontWeight: "700",
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderHeader,
    marginBottom: 6,
  },
});
