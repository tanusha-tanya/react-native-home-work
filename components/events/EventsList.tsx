import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Modal, Platform, Pressable, StyleSheet, Vibration, View } from "react-native";
import { useI18n } from "../../contexts/I18nContext";
import { COLORS } from "../../theme/colors";
import { AppText as Text } from "../ui/AppText";

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
  selectedEventId?: string | null;
  onSelectEvent?: (eventId: string) => void;
};

export function EventsList({
  title,
  events,
  alertsOnly,
  selectedEventId,
  onSelectEvent,
}: EventsListProps) {
  const { t } = useI18n();
  const actualTitle = title ?? t("common.events");
  const [open, setOpen] = useState(false);
  const listRef = useRef<FlatList<EventItem>>(null);
  const lastHapticAtRef = useRef(0);
  const lastVisibleEventIdRef = useRef<string | null>(null);
  const filteredEvents = useMemo(
    () => (alertsOnly ? events.filter((eventItem) => eventItem.severity === "alert") : events),
    [alertsOnly, events]
  );
  const selectedIndex = useMemo(
    () => filteredEvents.findIndex((eventItem) => eventItem.id === selectedEventId),
    [filteredEvents, selectedEventId]
  );

  const triggerScrollHaptic = useCallback(() => {
    if (Platform.OS === "web") {
      return;
    }
    const now = Date.now();
    if (now - lastHapticAtRef.current < 90) {
      return;
    }
    lastHapticAtRef.current = now;

    if (Platform.OS === "android") {
      Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Segment_Frequent_Tick).catch(() =>
        Haptics.selectionAsync().catch(() => undefined)
      );
      Vibration.vibrate(6);
      return;
    }

    Haptics.selectionAsync().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!open || selectedIndex < 0) {
      return;
    }

    const timer = setTimeout(() => {
      listRef.current?.scrollToIndex({
        index: selectedIndex,
        animated: false,
        viewPosition: 0.5,
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [open, selectedIndex]);

  const triggerPressHaptic = useCallback(() => {
    if (Platform.OS === "web") {
      return;
    }
    if (Platform.OS === "android") {
      Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm).catch(() =>
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined)
      );
      Vibration.vibrate(12);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
  }, []);

  const viewabilityConfigRef = useRef({ viewAreaCoveragePercentThreshold: 60 });
  const onViewableItemsChangedRef = useRef(({ viewableItems }: { viewableItems: Array<{ item?: EventItem }> }) => {
    const firstVisible = viewableItems[0]?.item?.id ?? null;
    if (!firstVisible || firstVisible === lastVisibleEventIdRef.current) {
      return;
    }
    lastVisibleEventIdRef.current = firstVisible;
    triggerScrollHaptic();
  });

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.bar, pressed && styles.barPressed]}
        onPress={() => {
          triggerPressHaptic();
          setOpen(true);
        }}
      >
        <Text style={styles.barTitle}>{actualTitle}</Text>
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
              <Text style={styles.sheetTitle}>{actualTitle}</Text>
              <Pressable hitSlop={12} onPress={() => setOpen(false)}>
                <Ionicons name="close" size={22} color={COLORS.textMuted} />
              </Pressable>
            </View>

            <FlatList
              ref={listRef}
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              data={filteredEvents}
              keyExtractor={(item) => item.id}
              onScrollBeginDrag={triggerScrollHaptic}
              onViewableItemsChanged={onViewableItemsChangedRef.current}
              viewabilityConfig={viewabilityConfigRef.current}
              onScrollToIndexFailed={(info) => {
                listRef.current?.scrollToOffset({
                  offset: info.averageItemLength * info.index,
                  animated: false,
                });
                setTimeout(() => {
                  listRef.current?.scrollToIndex({
                    index: info.index,
                    animated: false,
                    viewPosition: 0.5,
                  });
                }, 50);
              }}
              renderItem={({ item: eventItem }) => (
                <Pressable
                  key={eventItem.id}
                  style={({ pressed }) => [
                    styles.item,
                    eventItem.id === selectedEventId && styles.itemSelected,
                    pressed && styles.itemPressed,
                  ]}
                  onPress={() => {
                    triggerPressHaptic();
                    onSelectEvent?.(eventItem.id);
                    setOpen(false);
                  }}
                >
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
                </Pressable>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>{t("events.empty")}</Text>}
            />
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
  itemPressed: {
    opacity: 0.9,
  },
  itemSelected: {
    backgroundColor: COLORS.borderSoft,
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
