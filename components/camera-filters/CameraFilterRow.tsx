import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";
import { AppText as Text } from "../ui/AppText";
import type { CameraFilterItem } from "./types";

type CameraFilterRowProps = {
  item: CameraFilterItem;
  checked: boolean;
  onPress: (id: string) => void;
};

export function CameraFilterRow({ item, checked, onPress }: CameraFilterRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={() => onPress(item.id)}
    >
      <Ionicons
        name={checked ? "checkbox-outline" : "square-outline"}
        size={20}
        color={checked ? COLORS.actionLight : COLORS.iconDisabled}
      />
      <Text style={styles.rowText}>{item.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowPressed: {
    backgroundColor: COLORS.rowPressed,
  },
  rowText: {
    color: COLORS.textQuaternary,
    fontSize: 14,
    fontWeight: "500",
  },
});
