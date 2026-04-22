export type MenuSection = "cameras" | "objects" | "events" | "mode";
export type CameraId = "cam-1" | "cam-2" | "cam-3" | "cam-4";
export type ObjectId = "people" | "equipment" | "construction";

export const SUB_NAV_ITEMS: {
  id: MenuSection;
  label: string;
  icon: "videocam-outline" | "cube-outline" | "calendar-outline" | "settings-outline";
}[] = [
  { id: "cameras", label: "Камеры", icon: "videocam-outline" },
  { id: "objects", label: "Объекты", icon: "cube-outline" },
  { id: "events", label: "События", icon: "calendar-outline" },
  { id: "mode", label: "Режим", icon: "settings-outline" },
];

export const MENU_TITLES: Record<MenuSection, string> = {
  cameras: "Камеры",
  objects: "Объекты",
  events: "События",
  mode: "Режим",
};

export const CAMERA_FILTERS: { id: CameraId; label: string }[] = [
  { id: "cam-1", label: "Камера 1" },
  { id: "cam-2", label: "Камера 2" },
  { id: "cam-3", label: "Камера 3" },
  { id: "cam-4", label: "Камера 4" },
];

export const OBJECT_FILTERS: { id: ObjectId; label: string; cameraId: CameraId }[] = [
  { id: "people", label: "Люди", cameraId: "cam-1" },
  { id: "equipment", label: "Техника", cameraId: "cam-2" },
  { id: "construction", label: "Стройплощадка", cameraId: "cam-3" },
];

export const DEEPLINK_CAMERAS: CameraId[] = ["cam-1", "cam-2", "cam-3"];
