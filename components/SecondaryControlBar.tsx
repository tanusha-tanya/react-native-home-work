import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useMemo } from "react";
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
  dateText,
  centerText = "LIVE",
  centerAccessory,
  onPressDownload,
  onPressVideo,
  onPressCalendar,
  showVideoIcon = true,
}: SecondaryControlBarProps) {
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
      <Text style={styles.date}>{dateText}</Text>

      <View style={styles.centerWrap}>
        {centerAccessory != null ? (
          <View style={styles.centerAccessory}>{centerAccessory}</View>
        ) : null}
        <Text style={styles.center}>{centerText}</Text>
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
      </View>
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
});

