import { CameraFiltersDrawer } from "../CameraFiltersDrawer";
import { useI18n } from "../../contexts/I18nContext";
import { HamburgerMenuModal, type HamburgerMenuItem } from "./HamburgerMenuModal";

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
  cameraFilterItems: SimpleFilterItem[];
  selectedCameraFilterIds: string[];
  onToggleCameraFilter: (id: string) => void;

  objectFiltersOpen: boolean;
  onCloseObjectFilters: () => void;
  objectFilterItems: SimpleFilterItem[];
  selectedObjectFilterIds: string[];
  onToggleObjectFilter: (id: string) => void;

};

export function CamerasOverlayStack({
  hamburgerOpen,
  onCloseHamburger,
  menuItems,
  onSelectMenuItem,
  cameraFiltersOpen,
  onCloseCameraFilters,
  cameraFilterItems,
  selectedCameraFilterIds,
  onToggleCameraFilter,
  objectFiltersOpen,
  onCloseObjectFilters,
  objectFilterItems,
  selectedObjectFilterIds,
  onToggleObjectFilter,
}: CamerasOverlayStackProps) {
  const { t } = useI18n();

  return (
    <>
      <CameraFiltersDrawer
        visible={cameraFiltersOpen}
        onClose={onCloseCameraFilters}
        title={t("filters.cameras")}
        items={cameraFilterItems}
        selectedIds={selectedCameraFilterIds}
        onToggle={onToggleCameraFilter}
      />

      <CameraFiltersDrawer
        visible={objectFiltersOpen}
        onClose={onCloseObjectFilters}
        title={t("filters.objects")}
        items={objectFilterItems}
        selectedIds={selectedObjectFilterIds}
        onToggle={onToggleObjectFilter}
      />

      <HamburgerMenuModal
        visible={hamburgerOpen}
        onClose={onCloseHamburger}
        items={menuItems}
        onSelect={onSelectMenuItem}
      />
    </>
  );
}
