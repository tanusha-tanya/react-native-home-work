import type { ImageSourcePropType } from "react-native";
import type { EventItem } from "../../components/events/EventsList";

export const CAMERA_EVENTS: EventItem[] = [
  { id: "e1", cameraId: "cam-1", title: "event.motionEntrance", dateTime: "22.04 09:12", severity: "alert", objectId: "people", picture: "people.png" },
  { id: "e2", cameraId: "cam-1", title: "event.workerControlZone", dateTime: "22.04 10:03", severity: "info", objectId: "people", picture: "people1.webp" },
  { id: "e3", cameraId: "cam-1", title: "event.motionEntrance", dateTime: "22.04 11:12", severity: "alert", objectId: "people", picture: "people2.jpg" },
  { id: "e4", cameraId: "cam-1", title: "event.workerControlZone", dateTime: "22.04 11:03", severity: "info", objectId: "people", picture: "people3.jpg" },
  { id: "e5", cameraId: "cam-2", title: "event.equipmentPerimeter", dateTime: "22.04 10:40", severity: "alert", objectId: "equipment", picture: "car.webp" },
  { id: "e6", cameraId: "cam-2", title: "event.loaderCycleDone", dateTime: "22.04 11:18", severity: "info", objectId: "equipment", picture: "car1.webp" },
  { id: "e7", cameraId: "cam-2", title: "event.equipmentPerimeter", dateTime: "22.04 12:40", severity: "alert", objectId: "equipment", picture: "car2.webp" },
  { id: "e8", cameraId: "cam-2", title: "event.loaderCycleDone", dateTime: "22.04 13:18", severity: "info", objectId: "equipment", picture: "car3.jpg" },
  { id: "e9", cameraId: "cam-3", title: "event.helmetNotDetected", dateTime: "22.04 10:05", severity: "alert", objectId: "construction", picture: "site1.jpg" },
  { id: "e10", cameraId: "cam-3", title: "event.noActivity", dateTime: "22.04 11:22", severity: "info", objectId: "construction", picture: "site2.jpg" },
  { id: "e11", cameraId: "cam-3", title: "event.helmetNotDetected", dateTime: "22.04 12:05", severity: "alert", objectId: "construction", picture: "site3.jpg" },
  { id: "e12", cameraId: "cam-3", title: "event.noActivity", dateTime: "22.04 13:22", severity: "info", objectId: "construction", picture: "site4.jpg" },
];

export const EVENT_PICTURE_SOURCES: Record<string, ImageSourcePropType> = {
  "people.png": require("../../assets/images/people.png"),
  "people1.webp": require("../../assets/images/people1.webp"),
  "people2.jpg": require("../../assets/images/people2.jpg"),
  "people3.jpg": require("../../assets/images/people3.jpg"),
  "car.webp": require("../../assets/images/car1.webp"),
  "car1.webp": require("../../assets/images/car1.webp"),
  "car2.webp": require("../../assets/images/car2.webp"),
  "car3.jpg": require("../../assets/images/car3.webp"),
  "site1.jpg": require("../../assets/images/site1.jpg"),
  "site2.jpg": require("../../assets/images/site2.jpg"),
  "site3.jpg": require("../../assets/images/site3.jpg"),
  "site4.jpg": require("../../assets/images/site4.jpg"),
};
