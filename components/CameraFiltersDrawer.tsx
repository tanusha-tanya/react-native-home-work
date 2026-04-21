import { Modal, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraFilterRow } from "./camera-filters/CameraFilterRow";
import { CameraFiltersHeader } from "./camera-filters/CameraFiltersHeader";
import type { CameraFilterItem } from "./camera-filters/types";
import { COLORS } from "../theme/colors";

export type CameraFiltersDrawerProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  items: CameraFilterItem[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function CameraFiltersDrawer({
  visible,
  onClose,
  title = "КАМЕРЫ",
  items,
  selectedId,
  onSelect,
}: CameraFiltersDrawerProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <SafeAreaView edges={["top", "bottom", "left"]} style={styles.panel}>
          <CameraFiltersHeader title={title} />
          {items.map((item) => {
            return <CameraFilterRow key={item.id} item={item} selected={item.id === selectedId} onPress={onSelect} />;
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
