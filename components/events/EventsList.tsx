import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";

export type EventSeverity = "alert" | "info";

export type EventItem = {
  id: string;
  cameraId: string;
  title: string;
  dateTime: string;
  severity: EventSeverity;
  objectId: string;
  count?: number;
  picture: string;
  isWorking?: boolean;
};

type EventsListProps = {
  title?: string;
  events: EventItem[];
  alertsOnly: boolean;
};

export function EventsList({ title = "События", events, alertsOnly }: EventsListProps) {
  const [open, setOpen] = useState(false);
  const filteredEvents = useMemo(
    () => (alertsOnly ? events.filter((eventItem) => eventItem.severity === "alert") : events),
    [alertsOnly, events]
  );

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.bar, pressed && styles.barPressed]}
        onPress={() => setOpen(true)}
      >
        <Text style={styles.barTitle}>{title}</Text>
        <View style={styles.barRight}>
          <Text style={styles.barCount}>{filteredEvents.length}</Text>
          <Ionicons name="chevron-up" size={18} color={COLORS.iconSubtle} />
        </View>
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{title}</Text>
              <Pressable hitSlop={12} onPress={() => setOpen(false)}>
                <Ionicons name="close" size={22} color={COLORS.textMuted} />
              </Pressable>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
              {filteredEvents.length === 0 ? (
                <Text style={styles.emptyText}>Нет событий по выбранным фильтрам</Text>
              ) : (
                filteredEvents.map((eventItem) => (
                  <View key={eventItem.id} style={styles.item}>
                    <View style={styles.itemLeft}>
                      <Ionicons
                        name={
                          eventItem.severity === "alert"
                            ? "warning-outline"
                            : "information-circle-outline"
                        }
                        size={18}
                        color={eventItem.severity === "alert" ? COLORS.actionLight : COLORS.icon}
                      />
                      <Text style={styles.itemTitle}>{eventItem.title}</Text>
                    </View>
                    <Text style={styles.itemTime}>{eventItem.dateTime}</Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    marginTop: 8,
    marginHorizontal: 12,
    marginBottom: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  barPressed: {
    backgroundColor: COLORS.borderSoft,
  },
  barTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  barRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  barCount: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay50,
  },
  sheet: {
    height: "50%",
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  sheetTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 4,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderSoft,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  itemTitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    flexShrink: 1,
  },
  itemTime: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 18,
  },
});
