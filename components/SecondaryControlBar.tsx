import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useI18n } from "../contexts/I18nContext";
import { AppText as Text } from "./ui/AppText";

type SecondaryControlBarProps = {
  dateText: string;
  centerText?: string;
  /** Контент слева от центральной подписи (напр. гамбургер рядом с LIVE) */
  centerAccessory?: ReactNode;
  onPressDownload?: () => void;
  onPressVideo?: () => void;
  onPressCalendar?: () => void;
  showVideoIcon?: boolean;
};

export function SecondaryControlBar({
  dateText: _dateText,
  centerText = "LIVE",
  centerAccessory,
  onPressDownload,
  onPressVideo,
  onPressCalendar,
  showVideoIcon = true,
}: SecondaryControlBarProps) {
  const { t } = useI18n();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const isDatePickerSupported = Platform.OS !== "web";

  const dateText = useMemo(
    () =>
      new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(selectedDate),
    [selectedDate]
  );

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "dismissed") {
      setDatePickerVisible(false);
      return;
    }

    if (date) {
      setSelectedDate(date);
    }
    setDatePickerVisible(false);
  };

  const handleDatePress = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: selectedDate,
        mode: "date",
        design: "material",
        title: t("common.selectDate"),
        positiveButton: {
          label: t("common.done"),
        },
        negativeButton: {
          label: t("common.cancel"),
        },
        onChange: handleDateChange,
      });
      return;
    }

    if (isDatePickerSupported) {
      setDatePickerVisible(true);
      return;
    }

    // Web fallback: browser prompt with ISO date input.
    const isoDefault = selectedDate.toISOString().slice(0, 10);
    const entered = window.prompt("Enter date (YYYY-MM-DD)", isoDefault);
    if (!entered) {
      return;
    }

    const parsed = new Date(`${entered}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      setSelectedDate(parsed);
    }
  };

  const download = useMemo(
    () => ({
      icon: "download-outline" as const,
      onPress: onPressDownload,
    }),
    [onPressDownload]
  );

  const video = useMemo(
    () => ({
      icon: "videocam-outline" as const,
      onPress: onPressVideo,
    }),
    [onPressVideo]
  );

  const calendar = useMemo(
    () => ({
      icon: "calendar-outline" as const,
      onPress: onPressCalendar,
    }),
    [onPressCalendar]
  );

  return (
    <View style={styles.bar}>
     {centerAccessory != null ? (
          <View style={styles.centerAccessory}>{centerAccessory}</View>
        ) : null}
        <Text style={styles.center}>{centerText}</Text>

      <View style={styles.centerWrap}>
        <Text style={styles.date}>{dateText}</Text>        
      </View>

      <View style={styles.actions}>
        {!!download.onPress && (
          <Pressable hitSlop={10} onPress={download.onPress}>
            <Ionicons name={download.icon} size={20} color="#C9D1D9" />
          </Pressable>
        )}

        {showVideoIcon && !!video.onPress && (
          <Pressable hitSlop={10} onPress={video.onPress}>
            <Ionicons name={video.icon} size={20} color="#C9D1D9" />
          </Pressable>
        )}

        {!!calendar.onPress && (
          <Pressable hitSlop={10} onPress={calendar.onPress}>
            <Ionicons name={calendar.icon} size={20} color="#C9D1D9" />
          </Pressable>
        )}

        <Pressable
          hitSlop={10}
          onPress={handleDatePress}
        >
          <Ionicons name="calendar-outline" size={20} color="#C9D1D9" />
        </Pressable>
      </View>

      {isDatePickerVisible && isDatePickerSupported && (
        Platform.OS === "ios" ? (
          <Modal
            transparent
            animationType="slide"
            visible={isDatePickerVisible}
            onRequestClose={() => setDatePickerVisible(false)}
          >
            <View style={styles.modalBackdrop}>
              <View style={styles.modalContent}>
                <Pressable
                  style={styles.modalDone}
                  onPress={() => setDatePickerVisible(false)}
                >
                  <Text style={styles.modalDoneText}>{t("common.done")}</Text>
                </Pressable>
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </View>
            </View>
          </Modal>
        ) : null
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#22272B",
    borderTopWidth: 1,
    borderTopColor: "#C2D2DB",
  },
  date: {
    color: "#AAB6C4",
    fontSize: 13,
    width: 90,
  },
  centerWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  centerAccessory: {
    flexShrink: 0,
  },
  center: {
    color: "#E6EDF3",
    fontSize: 13,
    fontWeight: "700",
    flexShrink: 0,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: 14,
    width: 90,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  modalContent: {
    backgroundColor: "#1B1F23",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 12,
  },
  modalDone: {
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  modalDoneText: {
    color: "#7FB6FF",
    fontSize: 16,
    fontWeight: "600",
  },
});

