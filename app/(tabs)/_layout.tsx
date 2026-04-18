import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import { Pressable } from "react-native";
import { View } from "react-native";
import { SecondaryControlBar } from "../../components/SecondaryControlBar";
import { TopTitleBar } from "../../components/TopTitleBar";
import { CameraMenuProvider, useCameraMenu } from "../../contexts/CameraMenuContext";

function TabsChrome() {
  const pathname = usePathname();
  const showHamburger = !pathname.includes("statistics");
  const { openMenu } = useCameraMenu();

  return (
    <View style={{ flex: 1, backgroundColor: "#0f141a" }}>
      <TopTitleBar title="AI.СТВ КРОНШТАДТ" />
      <SecondaryControlBar
        dateText="03.09.2025"
        centerAccessory={
          showHamburger ? (
            <Pressable
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Открыть меню"
              onPress={openMenu}
              style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1, padding: 4, borderRadius: 8 }]}
            >
              <Ionicons name="menu" size={22} color="#E6EDF3" />
            </Pressable>
          ) : undefined
        }
      />

      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: "#1b232c", borderTopColor: "transparent" },
            tabBarActiveTintColor: "#FAFAFA",
            tabBarInactiveTintColor: "#AAB6C4",
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Камеры",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="camera-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="statistics"
            options={{
              title: "Статистика",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="stats-chart-outline" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <CameraMenuProvider>
      <TabsChrome />
    </CameraMenuProvider>
  );
}
