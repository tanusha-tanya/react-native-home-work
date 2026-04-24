import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";
import { useI18n } from "../../contexts/I18nContext";
import { COLORS } from "../../theme/colors";
import { AppText as Text } from "../ui/AppText";

export type SettingsMenuModalSection = "events" | "mode";

type SettingsMenuModalProps = {
  visible: boolean;
  title: string;
  section: SettingsMenuModalSection;
  onClose: () => void;
  eventsAlertsOnly: boolean;
  onChangeEventsAlertsOnly: (value: boolean) => void;
  eventsSound: boolean;
  onChangeEventsSound: (value: boolean) => void;
  modeNight: boolean;
  onChangeModeNight: (value: boolean) => void;
  modeSaveData: boolean;
  onChangeModeSaveData: (value: boolean) => void;
};

type SettingsMenuRowProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

function SettingsMenuRow({ label, value, onValueChange }: SettingsMenuRowProps) {
  return (
    <View style={styles.settingsRow}>
      <Text style={styles.settingsLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.border, true: COLORS.action }}
        thumbColor={COLORS.thumb}
      />
    </View>
  );
}

export function SettingsMenuModal({
  visible,
  title,
  section,
  onClose,
  eventsAlertsOnly,
  onChangeEventsAlertsOnly,
  eventsSound,
  onChangeEventsSound,
  modeNight,
  onChangeModeNight,
  modeSaveData,
  onChangeModeSaveData,
}: SettingsMenuModalProps) {
  const { t } = useI18n();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Pressable hitSlop={12} onPress={onClose} style={styles.modalClose}>
              <Ionicons name="close" size={22} color={COLORS.textMuted} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {section === "events" ? (
              <>
                <SettingsMenuRow
                  label={t("settings.alertsOnly")}
                  value={eventsAlertsOnly}
                  onValueChange={onChangeEventsAlertsOnly}
                />
                <SettingsMenuRow
                  label={t("settings.sound")}
                  value={eventsSound}
                  onValueChange={onChangeEventsSound}
                />
              </>
            ) : (
              <>
                <SettingsMenuRow
                  label={t("settings.nightMode")}
                  value={modeNight}
                  onValueChange={onChangeModeNight}
                />
                <SettingsMenuRow
                  label={t("settings.saveData")}
                  value={modeSaveData}
                  onValueChange={onChangeModeSaveData}
                />
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay55,
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    maxHeight: "52%",
    overflow: "hidden",
    zIndex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  modalClose: {
    padding: 4,
  },
  modalScroll: {
    maxHeight: 280,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderSoft,
  },
  settingsLabel: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 15,
  },
});
