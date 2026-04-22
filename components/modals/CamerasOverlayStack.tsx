import { CameraFiltersDrawer } from "../CameraFiltersDrawer";
import { HamburgerMenuModal, type HamburgerMenuItem } from "./HamburgerMenuModal";
import { SettingsMenuModal, type SettingsMenuModalSection } from "./SettingsMenuModal";

type SimpleFilterItem = {
  id: string;
  label: string;
};

type CamerasOverlayStackProps = {
  hamburgerOpen: boolean;
  onCloseHamburger: () => void;
  menuItems: HamburgerMenuItem[];
  onSelectMenuItem: (id: string) => void;

  cameraFiltersOpen: boolean;
  onCloseCameraFilters: () => void;
  onResetCameraFilter: () => void;
  cameraFilterItems: SimpleFilterItem[];
  selectedCameraFilterId: string | null;
  onSelectCameraFilter: (id: string) => void;

  objectFiltersOpen: boolean;
  onCloseObjectFilters: () => void;
  objectFilterItems: SimpleFilterItem[];
  selectedObjectFilterId: string;
  onSelectObjectFilter: (id: string) => void;

  settingsOpen: boolean;
  settingsTitle: string;
  settingsSection: SettingsMenuModalSection;
  onCloseSettings: () => void;
  eventsAlertsOnly: boolean;
  onChangeEventsAlertsOnly: (value: boolean) => void;
  eventsSound: boolean;
  onChangeEventsSound: (value: boolean) => void;
  modeNight: boolean;
  onChangeModeNight: (value: boolean) => void;
  modeSaveData: boolean;
  onChangeModeSaveData: (value: boolean) => void;
};

export function CamerasOverlayStack({
  hamburgerOpen,
  onCloseHamburger,
  menuItems,
  onSelectMenuItem,
  cameraFiltersOpen,
  onCloseCameraFilters,
  onResetCameraFilter,
  cameraFilterItems,
  selectedCameraFilterId,
  onSelectCameraFilter,
  objectFiltersOpen,
  onCloseObjectFilters,
  objectFilterItems,
  selectedObjectFilterId,
  onSelectObjectFilter,
  settingsOpen,
  settingsTitle,
  settingsSection,
  onCloseSettings,
  eventsAlertsOnly,
  onChangeEventsAlertsOnly,
  eventsSound,
  onChangeEventsSound,
  modeNight,
  onChangeModeNight,
  modeSaveData,
  onChangeModeSaveData,
}: CamerasOverlayStackProps) {
  return (
    <>
      <CameraFiltersDrawer
        visible={cameraFiltersOpen}
        onClose={onCloseCameraFilters}
        title="КАМЕРЫ"
        items={cameraFilterItems}
        selectedId={selectedCameraFilterId}
        onSelect={onSelectCameraFilter}
        onResetFilter={onResetCameraFilter}
      />

      <CameraFiltersDrawer
        visible={objectFiltersOpen}
        onClose={onCloseObjectFilters}
        title="ОБЪЕКТЫ"
        items={objectFilterItems}
        selectedId={selectedObjectFilterId}
        onSelect={onSelectObjectFilter}
      />

      <HamburgerMenuModal
        visible={hamburgerOpen}
        onClose={onCloseHamburger}
        items={menuItems}
        onSelect={onSelectMenuItem}
      />

      <SettingsMenuModal
        visible={settingsOpen}
        title={settingsTitle}
        section={settingsSection}
        onClose={onCloseSettings}
        eventsAlertsOnly={eventsAlertsOnly}
        onChangeEventsAlertsOnly={onChangeEventsAlertsOnly}
        eventsSound={eventsSound}
        onChangeEventsSound={onChangeEventsSound}
        modeNight={modeNight}
        onChangeModeNight={onChangeModeNight}
        modeSaveData={modeSaveData}
        onChangeModeSaveData={onChangeModeSaveData}
      />
    </>
  );
}
