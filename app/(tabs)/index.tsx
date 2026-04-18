import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import type { ImageSourcePropType } from "react-native";
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MainPicture from "../../components/MainPicture";
import { useCameraMenu } from "../../contexts/CameraMenuContext";

type MenuSection = "objects" | "events" | "mode";

const SUB_NAV_ITEMS: { id: MenuSection; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "objects", label: "Объекты", icon: "cube-outline" },
  { id: "events", label: "События", icon: "calendar-outline" },
  { id: "mode", label: "Режим", icon: "settings-outline" },
];

const MENU_TITLES: Record<MenuSection, string> = {
  objects: "Объекты",
  events: "События",
  mode: "Режим",
};

const CAROUSEL_ITEMS: { id: string; source: ImageSourcePropType }[] = [
  { id: "people", source: require("../../assets/images/people.png") },
  { id: "people1", source: require("../../assets/images/people1.webp") },
  { id: "people2", source: require("../../assets/images/people2.jpg") },
  { id: "people3", source: require("../../assets/images/people3.jpg") },
];

export default function CamerasScreen() {
  const { registerOpenMenu } = useCameraMenu();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainSource = CAROUSEL_ITEMS[selectedIndex].source;

  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuSection, setMenuSection] = useState<MenuSection>("objects");

  const [objectsGroupByZone, setObjectsGroupByZone] = useState(true);
  const [objectsShowOffline, setObjectsShowOffline] = useState(false);

  const [eventsAlertsOnly, setEventsAlertsOnly] = useState(false);
  const [eventsSound, setEventsSound] = useState(true);

  const [modeNight, setModeNight] = useState(false);
  const [modeSaveData, setModeSaveData] = useState(false);

  const onPickMenuSection = useCallback((section: MenuSection) => {
    setHamburgerOpen(false);
    setMenuSection(section);
    requestAnimationFrame(() => setMenuOpen(true));
  }, []);

  useFocusEffect(
    useCallback(() => {
      registerOpenMenu(() => setHamburgerOpen(true));
      return () => registerOpenMenu(null);
    }, [registerOpenMenu])
  );

  const renderThumb = useCallback(
    ({ item, index }: ListRenderItemInfo<(typeof CAROUSEL_ITEMS)[number]>) => {
      const selected = index === selectedIndex;
      return (
        <Pressable
          onPress={() => setSelectedIndex(index)}
          style={[styles.thumbWrap, selected && styles.thumbWrapSelected]}
        >
          <Image source={item.source} style={styles.thumb} resizeMode="cover" />
        </Pressable>
      );
    },
    [selectedIndex]
  );

  return (
    <View style={styles.screen}>
      <View style={styles.mainArea}>
        <MainPicture source={mainSource} />
      </View>

      <FlatList
        horizontal
        data={CAROUSEL_ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={renderThumb}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stripContent}
        style={styles.strip}
      />

      <View style={styles.bottomSpacer} />

      <Modal
        visible={hamburgerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setHamburgerOpen(false)}
      >
        <View style={styles.drawerRoot}>
          <SafeAreaView edges={["top", "bottom", "left"]} style={styles.drawerPanel}>
            <Text style={styles.drawerTitle}>Меню</Text>
            {SUB_NAV_ITEMS.map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [
                  styles.drawerRow,
                  pressed && styles.drawerRowPressed,
                ]}
                onPress={() => onPickMenuSection(item.id)}
              >
                <Ionicons name={item.icon} size={22} color="#C9D1D9" />
                <Text style={styles.drawerRowLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color="#6e7681" />
              </Pressable>
            ))}
          </SafeAreaView>
          <Pressable style={styles.drawerBackdrop} onPress={() => setHamburgerOpen(false)} />
        </View>
      </Modal>

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <View style={styles.modalRoot}>
          <Pressable style={styles.modalBackdrop} onPress={() => setMenuOpen(false)} />
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{MENU_TITLES[menuSection]}</Text>
              <Pressable hitSlop={12} onPress={() => setMenuOpen(false)} style={styles.modalClose}>
                <Ionicons name="close" size={22} color="#AAB6C4" />
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {menuSection === "objects" && (
                <>
                  <SettingsRow
                    label="Группировать по зонам"
                    value={objectsGroupByZone}
                    onValueChange={setObjectsGroupByZone}
                  />
                  <SettingsRow
                    label="Показывать офлайн"
                    value={objectsShowOffline}
                    onValueChange={setObjectsShowOffline}
                  />
                </>
              )}
              {menuSection === "events" && (
                <>
                  <SettingsRow
                    label="Только тревоги"
                    value={eventsAlertsOnly}
                    onValueChange={setEventsAlertsOnly}
                  />
                  <SettingsRow
                    label="Звук уведомлений"
                    value={eventsSound}
                    onValueChange={setEventsSound}
                  />
                </>
              )}
              {menuSection === "mode" && (
                <>
                  <SettingsRow
                    label="Ночной режим"
                    value={modeNight}
                    onValueChange={setModeNight}
                  />
                  <SettingsRow
                    label="Экономия трафика"
                    value={modeSaveData}
                    onValueChange={setModeSaveData}
                  />
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function SettingsRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.settingsRow}>
      <Text style={styles.settingsLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#3d4550", true: "#1f6feb" }}
        thumbColor="#f0f6fc"
      />
    </View>
  );
}

const THUMB_SIZE = 72;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0f141a",
  },
  drawerRoot: {
    flex: 1,
    flexDirection: "row",
  },
  drawerPanel: {
    width: "82%",
    maxWidth: 300,
    backgroundColor: "#22272B",
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "#3d4550",
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  drawerTitle: {
    color: "#FAFAFA",
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#3d4550",
    marginBottom: 8,
  },
  drawerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  drawerRowPressed: {
    backgroundColor: "#2d3844",
  },
  drawerRowLabel: {
    flex: 1,
    color: "#E6EDF3",
    fontSize: 16,
    fontWeight: "600",
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  mainArea: {
    alignSelf: "stretch",
    width: "100%",
  },
  strip: {
    flexGrow: 0,
    alignSelf: "stretch",
    width: "100%",
  },
  stripContent: {
    paddingTop: 0,
    paddingBottom: 12,
    paddingHorizontal: 12,
    gap: 10,
    alignItems: "center",
  },
  bottomSpacer: {
    flex: 1,
  },
  thumbWrap: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbWrapSelected: {
    borderColor: "#58a6ff",
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  modalRoot: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
  modalCard: {
    backgroundColor: "#22272B",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#3d4550",
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
    borderBottomColor: "#3d4550",
  },
  modalTitle: {
    color: "#FAFAFA",
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
    borderBottomColor: "#2d3844",
  },
  settingsLabel: {
    flex: 1,
    color: "#E6EDF3",
    fontSize: 15,
  },
});
