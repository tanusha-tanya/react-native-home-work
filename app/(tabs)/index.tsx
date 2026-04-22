import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  ListRenderItemInfo,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { EventsList, type EventItem } from "../../components/events/EventsList";
import MainPicture from "../../components/MainPicture";
import { CamerasOverlayStack } from "../../components/modals/CamerasOverlayStack";
import { useCameraMenu } from "../../contexts/CameraMenuContext";
import { COLORS } from "../../theme/colors";
import { CAMERA_EVENTS, EVENT_PICTURE_SOURCES } from "./cameraScreen.events.constants";
import {
  CAMERA_FILTERS,
  DEEPLINK_CAMERAS,
  MENU_TITLES,
  OBJECT_FILTERS,
  SUB_NAV_ITEMS,
  type CameraId,
  type MenuSection,
  type ObjectId,
} from "./cameraScreen.constants";

export default function CamerasScreen() {
  const { camera } = useLocalSearchParams<{ camera?: string | string[] }>();
  const { registerOpenMenu } = useCameraMenu();
  const [selectedCameraId, setSelectedCameraId] = useState<CameraId | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
  const [refreshing, setRefreshing] = useState(false);

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

  const onResetCameraFilter = useCallback(() => {
    setSelectedCameraId(null);
    setSelectedObjectId("people");
    setSelectedIndex(0);
    setCameraFiltersOpen(false);
  }, []);

  const resetAllFilters = useCallback(() => {
    setSelectedCameraId(null);
    setSelectedObjectId("people");
    setSelectedIndex(0);
    setEventsAlertsOnly(false);
    setEventsSound(true);
    setModeNight(false);
    setModeSaveData(false);
    setHamburgerOpen(false);
    setCameraFiltersOpen(false);
    setObjectFiltersOpen(false);
    setMenuOpen(false);
    setMenuSection("cameras");
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    resetAllFilters();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, [resetAllFilters]);

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
    if (selectedCameraId == null) {
      return;
    }
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

  const events: EventItem[] = CAMERA_EVENTS;
  const parseEventDateTime = (value: string) => {
    const [dayMonth, hourMinute] = value.split(" ");
    if (!dayMonth || !hourMinute) {
      return 0;
    }
    const [day, month] = dayMonth.split(".");
    const [hours, minutes] = hourMinute.split(":");
    const parsed = new Date(
      2026,
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
      0
    ).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const sortedEvents = [...events].sort((a, b) => parseEventDateTime(b.dateTime) - parseEventDateTime(a.dateTime));
  const visibleEvents =
    selectedCameraId == null
      ? sortedEvents
      : sortedEvents.filter((eventItem) => eventItem.cameraId === selectedCameraId);

  const activeImages = visibleEvents
    .map((eventItem) => ({ id: `${eventItem.id}-img`, source: EVENT_PICTURE_SOURCES[eventItem.picture] }))
    .filter((item) => !!item.source);
  const hasActiveImages = activeImages.length > 0;
  const safeSelectedIndex = Math.min(selectedIndex, Math.max(activeImages.length - 1, 0));
  const mainSource = hasActiveImages ? activeImages[safeSelectedIndex].source : null;
  const renderThumb = useCallback(
    ({ item, index }: ListRenderItemInfo<{ id: string; source: ImageSourcePropType }>) => {
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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />
        }
      >
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

        <EventsList
          title="События"
          events={visibleEvents}
          alertsOnly={eventsAlertsOnly}
        />
      </ScrollView>

      <CamerasOverlayStack
        hamburgerOpen={hamburgerOpen}
        onCloseHamburger={() => setHamburgerOpen(false)}
        menuItems={SUB_NAV_ITEMS}
        onSelectMenuItem={(id) => onPickMenuSection(id as MenuSection)}
        cameraFiltersOpen={cameraFiltersOpen}
        onCloseCameraFilters={() => setCameraFiltersOpen(false)}
        onResetCameraFilter={onResetCameraFilter}
        cameraFilterItems={CAMERA_FILTERS.map((camera) => ({ id: camera.id, label: camera.label }))}
        selectedCameraFilterId={selectedCameraId}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
