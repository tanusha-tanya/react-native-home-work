import { Modal, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useI18n } from "../contexts/I18nContext";
import { CameraFilterRow } from "./camera-filters/CameraFilterRow";
import { CameraFiltersHeader } from "./camera-filters/CameraFiltersHeader";
import type { CameraFilterItem } from "./camera-filters/types";
import { COLORS } from "../theme/colors";

export type CameraFiltersDrawerProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  items: CameraFilterItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export function CameraFiltersDrawer({
  visible,
  onClose,
  title,
  items,
  selectedIds,
  onToggle,
}: CameraFiltersDrawerProps) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const actualTitle = title ?? t("filters.cameras");

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <SafeAreaView edges={["bottom", "left"]} style={[styles.panel, { paddingTop: insets.top }]}>
          <CameraFiltersHeader title={actualTitle} />
          {items.map((item) => {
            return (
              <CameraFilterRow
                key={item.id}
                item={item}
                checked={selectedIds.includes(item.id)}
                onPress={onToggle}
              />
            );
          })}
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
    maxWidth: 340,
    backgroundColor: COLORS.surfaceAlt,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: COLORS.borderAlt,
    paddingBottom: 14,
  },
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay45,
  },
});
