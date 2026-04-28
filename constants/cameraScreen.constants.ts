export type MenuSection = "cameras" | "objects";
export type CameraId = "cam-1" | "cam-2" | "cam-3" | "cam-4";
export type ObjectId = "people" | "equipment" | "construction";

export const SUB_NAV_ITEMS: {
  id: MenuSection;
  labelKey: string;
  icon: "videocam-outline" | "cube-outline";
}[] = [
  { id: "cameras", labelKey: "menu.cameras", icon: "videocam-outline" },
  { id: "objects", labelKey: "menu.objects", icon: "cube-outline" },
];

export const CAMERA_FILTERS: { id: CameraId; labelKey: string }[] = [
  { id: "cam-1", labelKey: "camera.cam1" },
  { id: "cam-2", labelKey: "camera.cam2" },
  { id: "cam-3", labelKey: "camera.cam3" },
  { id: "cam-4", labelKey: "camera.cam4" },
];

export const OBJECT_FILTERS: { id: ObjectId; labelKey: string; cameraId: CameraId }[] = [
  { id: "people", labelKey: "objects.people", cameraId: "cam-1" },
  { id: "equipment", labelKey: "objects.equipment", cameraId: "cam-2" },
  { id: "construction", labelKey: "objects.construction", cameraId: "cam-3" },
];

export const DEEPLINK_CAMERAS: CameraId[] = ["cam-1", "cam-2", "cam-3"];
