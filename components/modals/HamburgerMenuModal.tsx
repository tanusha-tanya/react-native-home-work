import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../theme/colors";

export type HamburgerMenuItem = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type HamburgerMenuModalProps = {
  visible: boolean;
  onClose: () => void;
  items: HamburgerMenuItem[];
  onSelect: (id: string) => void;
};

export function HamburgerMenuModal({
  visible,
  onClose,
  items,
  onSelect,
}: HamburgerMenuModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <SafeAreaView edges={["top", "bottom", "left"]} style={styles.panel}>
          <Text style={styles.title}>Меню</Text>
          {items.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => onSelect(item.id)}
            >
              <Ionicons name={item.icon} size={22} color={COLORS.icon} />
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.iconSubtle} />
            </Pressable>
          ))}
        </SafeAreaView>
        <Pressable style={styles.backdrop} onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
  },
  panel: {
    width: "82%",
    maxWidth: 300,
    backgroundColor: COLORS.surface,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: COLORS.border,
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  rowPressed: {
    backgroundColor: COLORS.borderSoft,
  },
  rowLabel: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay50,
  },
});
