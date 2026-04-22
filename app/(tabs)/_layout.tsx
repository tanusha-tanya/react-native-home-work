import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import { Pressable, View } from "react-native";
import { SecondaryControlBar } from "../../components/SecondaryControlBar";
import { TopTitleBar } from "../../components/TopTitleBar";
import { CameraMenuProvider, useCameraMenu } from "../../contexts/CameraMenuContext";
import { COLORS } from "../../theme/colors";

function TabsChrome() {
  const pathname = usePathname();
  const showHamburger = pathname.endsWith("/(tabs)") || pathname.endsWith("/");
  const { openMenu } = useCameraMenu();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <TopTitleBar title="ВИДЕООБЗОР" />
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
              <Ionicons name="menu" size={22} color={COLORS.textSecondary} />
            </Pressable>
          ) : undefined
        }
      />

      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: COLORS.tabBar, borderTopColor: "transparent" },
            tabBarActiveTintColor: COLORS.textPrimary,
            tabBarInactiveTintColor: COLORS.textMuted,
            tabBarLabelStyle: { fontSize: 14, fontWeight: "600" },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Видео",
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
          <Tabs.Screen
            name="profile"
            options={{
              title: "Профиль",
              tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
            }}
          />
          <Tabs.Screen name="statistics/_layout" options={{ href: null }} />
          <Tabs.Screen name="statistics/personnel" options={{ href: "/statistics/personnel" }} />
          <Tabs.Screen name="statistics/equipment" options={{ href: "/statistics/equipment" }} />
          <Tabs.Screen name="statistics/construction" options={{ href: "/statistics/construction" }} />
          <Tabs.Screen name="statistics/overall" options={{ href: "/statistics/overall" }} />
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
