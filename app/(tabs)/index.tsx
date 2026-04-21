import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CamerasOverlayStack } from "../../components/modals/CamerasOverlayStack";
import MainPicture from "../../components/MainPicture";
import { useCameraMenu } from "../../contexts/CameraMenuContext";
import { COLORS } from "../../theme/colors";

type MenuSection = "cameras" | "objects" | "events" | "mode";
type CameraId = "cam-1" | "cam-2" | "cam-3" | "cam-4";

type CameraImageItem = {
  id: string;
  source: ImageSourcePropType;
};
type ObjectId = "people" | "equipment" | "construction";

const SUB_NAV_ITEMS: {
  id: MenuSection;
  label: string;
  icon: "videocam-outline" | "cube-outline" | "calendar-outline" | "settings-outline";
}[] = [
  { id: "cameras", label: "Камеры", icon: "videocam-outline" },
  { id: "objects", label: "Объекты", icon: "cube-outline" },
  { id: "events", label: "События", icon: "calendar-outline" },
  { id: "mode", label: "Режим", icon: "settings-outline" },
];

const MENU_TITLES: Record<MenuSection, string> = {
  cameras: "Камеры",
  objects: "Объекты",
  events: "События",
  mode: "Режим",
};

const CAMERA_FILTERS: { id: CameraId; label: string }[] = [
  { id: "cam-1", label: "Камера 1" },
  { id: "cam-2", label: "Камера 2" },
  { id: "cam-3", label: "Камера 3" },
  { id: "cam-4", label: "Камера 4" },
];
const OBJECT_FILTERS: { id: ObjectId; label: string; cameraId: CameraId }[] = [
  { id: "people", label: "Люди", cameraId: "cam-1" },
  { id: "equipment", label: "Техника", cameraId: "cam-2" },
  { id: "construction", label: "Стройплощадка", cameraId: "cam-3" },
];

const CAMERA_IMAGES: Record<CameraId, CameraImageItem[]> = {
  "cam-1": [
    { id: "people", source: require("../../assets/images/people.png") },
    { id: "people1", source: require("../../assets/images/people1.webp") },
    { id: "people2", source: require("../../assets/images/people2.jpg") },
    { id: "people3", source: require("../../assets/images/people3.jpg") },
  ],
  "cam-2": [
    { id: "car1", source: require("../../assets/images/car1.webp") },
    { id: "car2", source: require("../../assets/images/car2.webp") },
    { id: "car3", source: require("../../assets/images/car3.webp") },
    { id: "car4", source: require("../../assets/images/car4.jpg") },
  ],
  "cam-3": [
    { id: "site1", source: require("../../assets/images/site1.jpg") },
    { id: "site2", source: require("../../assets/images/site2.jpg") },
    { id: "site3", source: require("../../assets/images/site3.jpg") },
    { id: "site4", source: require("../../assets/images/site4.jpg") },
  ],
  "cam-4": [],
};
const DEEPLINK_CAMERAS: CameraId[] = ["cam-1", "cam-2", "cam-3"];

export default function CamerasScreen() {
  const { camera } = useLocalSearchParams<{ camera?: string | string[] }>();
  const { registerOpenMenu } = useCameraMenu();
  const [selectedCameraId, setSelectedCameraId] = useState(CAMERA_FILTERS[0].id);
  const selectedCamera = CAMERA_FILTERS.find((camera) => camera.id === selectedCameraId) ?? CAMERA_FILTERS[0];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeImages = CAMERA_IMAGES[selectedCameraId];
  const hasActiveImages = activeImages.length > 0;
  const safeSelectedIndex = Math.min(selectedIndex, Math.max(activeImages.length - 1, 0));
  const mainSource = hasActiveImages ? activeImages[safeSelectedIndex].source : null;

  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [cameraFiltersOpen, setCameraFiltersOpen] = useState(false);
  const [objectFiltersOpen, setObjectFiltersOpen] = useState(false);
  const [selectedObjectId, setSelectedObjectId] = useState<ObjectId>("people");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuSection, setMenuSection] = useState<MenuSection>("cameras");

  const [eventsAlertsOnly, setEventsAlertsOnly] = useState(false);
  const [eventsSound, setEventsSound] = useState(true);

  const [modeNight, setModeNight] = useState(false);
  const [modeSaveData, setModeSaveData] = useState(false);

  const onPickMenuSection = useCallback((section: MenuSection) => {
    setHamburgerOpen(false);
    if (section === "cameras") {
      requestAnimationFrame(() => setCameraFiltersOpen(true));
      return;
    }
    if (section === "objects") {
      requestAnimationFrame(() => setObjectFiltersOpen(true));
      return;
    }
    setMenuSection(section);
    requestAnimationFrame(() => setMenuOpen(true));
  }, []);

  const onSelectCameraFilter = useCallback((cameraId: string) => {
    const nextCamera = CAMERA_FILTERS.find((camera) => camera.id === cameraId);
    if (!nextCamera) {
      return;
    }
    setSelectedCameraId(nextCamera.id);
    setSelectedIndex(0);
    setCameraFiltersOpen(false);
  }, []);

  const onSelectObjectFilter = useCallback((objectId: string) => {
    const selectedObject = OBJECT_FILTERS.find((item) => item.id === objectId);
    if (!selectedObject) {
      return;
    }
    setSelectedObjectId(selectedObject.id);
    setSelectedCameraId(selectedObject.cameraId);
    setSelectedIndex(0);
    setObjectFiltersOpen(false);
  }, []);

  useEffect(() => {
    const requestedCamera = Array.isArray(camera) ? camera[0] : camera;
    if (!requestedCamera) {
      return;
    }
    const isSupported = DEEPLINK_CAMERAS.includes(requestedCamera as CameraId);
    if (!isSupported || requestedCamera === selectedCameraId) {
      return;
    }
    setSelectedCameraId(requestedCamera as CameraId);
    setSelectedIndex(0);
  }, [camera, selectedCameraId]);

  useEffect(() => {
    const linkedObject = OBJECT_FILTERS.find((item) => item.cameraId === selectedCameraId);
    if (linkedObject) {
      setSelectedObjectId(linkedObject.id);
    }
  }, [selectedCameraId]);

  useFocusEffect(
    useCallback(() => {
      registerOpenMenu(() => setHamburgerOpen(true));
      return () => registerOpenMenu(null);
    }, [registerOpenMenu])
  );

  const renderThumb = useCallback(
    ({ item, index }: ListRenderItemInfo<CameraImageItem>) => {
      const selected = index === safeSelectedIndex;
      return (
        <Pressable
          onPress={() => setSelectedIndex(index)}
          style={[styles.thumbWrap, selected && styles.thumbWrapSelected]}
        >
          <Image source={item.source} style={styles.thumb} resizeMode="cover" />
        </Pressable>
      );
    },
    [safeSelectedIndex]
  );

  return (
    <View style={styles.screen}>
      <View style={styles.mainArea}>
        {mainSource ? (
          <MainPicture source={mainSource} />
        ) : (
          <View style={styles.emptyMain}>
            <Text style={styles.emptyMainText}>Нет данных для отображения</Text>
          </View>
        )}
      </View>

      {hasActiveImages ? (
        <FlatList
          horizontal
          data={activeImages}
          keyExtractor={(item) => item.id}
          renderItem={renderThumb}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stripContent}
          style={styles.strip}
        />
      ) : null}

      <View style={styles.bottomSpacer} />

      <CamerasOverlayStack
        hamburgerOpen={hamburgerOpen}
        onCloseHamburger={() => setHamburgerOpen(false)}
        menuItems={SUB_NAV_ITEMS}
        onSelectMenuItem={(id) => onPickMenuSection(id as MenuSection)}
        cameraFiltersOpen={cameraFiltersOpen}
        onCloseCameraFilters={() => setCameraFiltersOpen(false)}
        cameraFilterItems={CAMERA_FILTERS.map((camera) => ({ id: camera.id, label: camera.label }))}
        selectedCameraFilterId={selectedCamera.id}
        onSelectCameraFilter={onSelectCameraFilter}
        objectFiltersOpen={objectFiltersOpen}
        onCloseObjectFilters={() => setObjectFiltersOpen(false)}
        objectFilterItems={OBJECT_FILTERS.map((item) => ({ id: item.id, label: item.label }))}
        selectedObjectFilterId={selectedObjectId}
        onSelectObjectFilter={onSelectObjectFilter}
        settingsOpen={menuOpen}
        settingsTitle={MENU_TITLES[menuSection]}
        settingsSection={menuSection === "events" ? "events" : "mode"}
        onCloseSettings={() => setMenuOpen(false)}
        eventsAlertsOnly={eventsAlertsOnly}
        onChangeEventsAlertsOnly={setEventsAlertsOnly}
        eventsSound={eventsSound}
        onChangeEventsSound={setEventsSound}
        modeNight={modeNight}
        onChangeModeNight={setModeNight}
        modeSaveData={modeSaveData}
        onChangeModeSaveData={setModeSaveData}
      />
    </View>
  );
}

const THUMB_SIZE = 72;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mainArea: {
    alignSelf: "stretch",
    width: "100%",
  },
  emptyMain: {
    width: "100%",
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyMainText: {
    color: COLORS.textMuted,
    fontSize: 16,
    fontWeight: "600",
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
    borderColor: COLORS.accent,
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
});
