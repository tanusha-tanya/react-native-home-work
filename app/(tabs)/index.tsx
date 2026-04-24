import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  ListRenderItemInfo,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  Platform,
  Vibration,
} from "react-native";
import { EventsList, type EventItem } from "../../components/events/EventsList";
import MainPicture from "../../components/MainPicture";
import { CamerasOverlayStack } from "../../components/modals/CamerasOverlayStack";
import { AppText as Text } from "../../components/ui/AppText";
import { useCameraMenu } from "../../contexts/CameraMenuContext";
import { useI18n } from "../../contexts/I18nContext";
import { COLORS } from "../../theme/colors";
import { CAMERA_EVENTS, EVENT_PICTURE_SOURCES } from "./cameraScreen.events.constants";
import {
  CAMERA_FILTERS,
  DEEPLINK_CAMERAS,
  OBJECT_FILTERS,
  SUB_NAV_ITEMS,
  type CameraId,
  type MenuSection,
  type ObjectId,
} from "./cameraScreen.constants";

export default function CamerasScreen() {
  const { camera } = useLocalSearchParams<{ camera?: string | string[] }>();
  const { registerOpenMenu } = useCameraMenu();
  const scrollRef = useRef<ScrollView>(null);
  const thumbsListRef = useRef<FlatList<{ id: string; eventId: string; source: ImageSourcePropType }>>(null);
  const lastGalleryHapticAtRef = useRef(0);
  const lastGalleryVisibleIdRef = useRef<string | null>(null);
  const [selectedCameraIds, setSelectedCameraIds] = useState<CameraId[]>(CAMERA_FILTERS.map((camera) => camera.id));
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [cameraFiltersOpen, setCameraFiltersOpen] = useState(false);
  const [objectFiltersOpen, setObjectFiltersOpen] = useState(false);
  const [selectedObjectIds, setSelectedObjectIds] = useState<ObjectId[]>(OBJECT_FILTERS.map((item) => item.id));
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useI18n();

  const onPickMenuSection = useCallback((section: MenuSection) => {
    setHamburgerOpen(false);
    if (section === "cameras") {
      requestAnimationFrame(() => setCameraFiltersOpen(true));
      return;
    }
    requestAnimationFrame(() => setObjectFiltersOpen(true));
  }, []);

  const onToggleCameraFilter = useCallback((cameraId: string) => {
    const nextCamera = CAMERA_FILTERS.find((camera) => camera.id === cameraId);
    if (!nextCamera) return;

    setSelectedCameraIds((prev) =>
      prev.includes(nextCamera.id) ? prev.filter((id) => id !== nextCamera.id) : [...prev, nextCamera.id]
    );
    setSelectedEventId(null);
  }, []);

  const resetAllFilters = useCallback(() => {
    setSelectedCameraIds(CAMERA_FILTERS.map((camera) => camera.id));
    setSelectedObjectIds(OBJECT_FILTERS.map((item) => item.id));
    setSelectedEventId(null);
    setHamburgerOpen(false);
    setCameraFiltersOpen(false);
    setObjectFiltersOpen(false);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    resetAllFilters();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, [resetAllFilters]);

  const onToggleObjectFilter = useCallback((objectId: string) => {
    const selectedObject = OBJECT_FILTERS.find((item) => item.id === objectId);
    if (!selectedObject) {
      return;
    }
    setSelectedObjectIds((prev) =>
      prev.includes(selectedObject.id)
        ? prev.filter((id) => id !== selectedObject.id)
        : [...prev, selectedObject.id]
    );
    setSelectedEventId(null);
  }, []);

  useEffect(() => {
    const requestedCamera = Array.isArray(camera) ? camera[0] : camera;
    if (!requestedCamera) {
      return;
    }
    const isSupported = DEEPLINK_CAMERAS.includes(requestedCamera as CameraId);
    if (!isSupported) {
      return;
    }
    setSelectedCameraIds([requestedCamera as CameraId]);
    setSelectedEventId(null);
  }, [camera]);

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
  const visibleEvents = sortedEvents.filter(
    (eventItem) =>
      selectedCameraIds.includes(eventItem.cameraId as CameraId) &&
      selectedObjectIds.includes(eventItem.objectId as ObjectId)
  );

  useEffect(() => {
    if (visibleEvents.length === 0) {
      setSelectedEventId(null);
      return;
    }
    const exists = selectedEventId != null && visibleEvents.some((eventItem) => eventItem.id === selectedEventId);
    if (!exists) {
      setSelectedEventId(visibleEvents[0].id);
    }
  }, [visibleEvents, selectedEventId]);

  const activeImages = visibleEvents
    .map((eventItem) => ({
      id: `${eventItem.id}-img`,
      eventId: eventItem.id,
      source: EVENT_PICTURE_SOURCES[eventItem.picture],
    }))
    .filter((item) => !!item.source);
  const selectedImage = activeImages.find((image) => image.eventId === selectedEventId) ?? null;
  const hasActiveImages = activeImages.length > 0;
  const mainSource = selectedImage?.source ?? null;

  useEffect(() => {
    if (!selectedEventId || activeImages.length === 0) {
      return;
    }

    const selectedThumbIndex = activeImages.findIndex((image) => image.eventId === selectedEventId);
    if (selectedThumbIndex < 0) {
      return;
    }

    const timer = setTimeout(() => {
      thumbsListRef.current?.scrollToIndex({
        index: selectedThumbIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [activeImages, selectedEventId]);

  const scrollToMainPicture = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, []);
  const onSelectEvent = useCallback(
    (eventId: string) => {
      if (Platform.OS === "android") {
        Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm).catch(() =>
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined)
        );
        Vibration.vibrate(12);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
      }
      setSelectedEventId(eventId);
      requestAnimationFrame(scrollToMainPicture);
    },
    [scrollToMainPicture]
  );
  const triggerGalleryHaptic = useCallback(() => {
    const now = Date.now();
    if (now - lastGalleryHapticAtRef.current < 90) {
      return;
    }
    lastGalleryHapticAtRef.current = now;
    if (Platform.OS === "android") {
      Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Segment_Frequent_Tick).catch(() =>
        Haptics.selectionAsync().catch(() => undefined)
      );
      Vibration.vibrate(6);
      return;
    }
    Haptics.selectionAsync().catch(() => undefined);
  }, []);
  const galleryViewabilityConfigRef = useRef({ viewAreaCoveragePercentThreshold: 60 });
  const onGalleryViewableItemsChangedRef = useRef(
    ({
      viewableItems,
    }: {
      viewableItems: Array<{ item?: { id: string; eventId: string; source: ImageSourcePropType } }>;
    }) => {
      const firstVisible = viewableItems[0]?.item?.id ?? null;
      if (!firstVisible || firstVisible === lastGalleryVisibleIdRef.current) {
        return;
      }
      lastGalleryVisibleIdRef.current = firstVisible;
      triggerGalleryHaptic();
    }
  );
  const renderThumb = useCallback(
    ({ item }: ListRenderItemInfo<{ id: string; eventId: string; source: ImageSourcePropType }>) => {
      const selected = item.eventId === selectedEventId;
      return (
        <Pressable
          onPress={() => onSelectEvent(item.eventId)}
          style={[styles.thumbWrap, selected && styles.thumbWrapSelected]}
        >
          <Image source={item.source} style={styles.thumb} resizeMode="cover" />
        </Pressable>
      );
    },
    [onSelectEvent, selectedEventId]
  );

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
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
              <Text style={styles.emptyMainText}>{t("common.noData")}</Text>
            </View>
          )}
        </View>

        {hasActiveImages ? (
          <FlatList
            ref={thumbsListRef}
            horizontal
            data={activeImages}
            keyExtractor={(item) => item.id}
            renderItem={renderThumb}
            onScrollBeginDrag={triggerGalleryHaptic}
            onViewableItemsChanged={onGalleryViewableItemsChangedRef.current}
            viewabilityConfig={galleryViewabilityConfigRef.current}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stripContent}
            style={styles.strip}
            onScrollToIndexFailed={(info) => {
              thumbsListRef.current?.scrollToOffset({
                offset: info.averageItemLength * info.index,
                animated: false,
              });
              setTimeout(() => {
                thumbsListRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                  viewPosition: 0.5,
                });
              }, 50);
            }}
          />
        ) : null}

        <EventsList
          title={t("common.events")}
          events={visibleEvents.map((eventItem) => ({ ...eventItem, title: t(eventItem.title) }))}
          alertsOnly={false}
          selectedEventId={selectedEventId}
          onSelectEvent={onSelectEvent}
        />
      </ScrollView>

      <CamerasOverlayStack
        hamburgerOpen={hamburgerOpen}
        onCloseHamburger={() => setHamburgerOpen(false)}
        menuItems={SUB_NAV_ITEMS.map((item) => ({ ...item, label: t(item.labelKey) }))}
        onSelectMenuItem={(id) => onPickMenuSection(id as MenuSection)}
        cameraFiltersOpen={cameraFiltersOpen}
        onCloseCameraFilters={() => setCameraFiltersOpen(false)}
        cameraFilterItems={CAMERA_FILTERS.map((camera) => ({ id: camera.id, label: t(camera.labelKey) }))}
        selectedCameraFilterIds={selectedCameraIds}
        onToggleCameraFilter={onToggleCameraFilter}
        objectFiltersOpen={objectFiltersOpen}
        onCloseObjectFilters={() => setObjectFiltersOpen(false)}
        objectFilterItems={OBJECT_FILTERS.map((item) => ({ id: item.id, label: t(item.labelKey) }))}
        selectedObjectFilterIds={selectedObjectIds}
        onToggleObjectFilter={onToggleObjectFilter}
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
