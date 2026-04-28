import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import { Pressable, View } from "react-native";
import { SecondaryControlBar } from "../../components/SecondaryControlBar";
import { TopTitleBar } from "../../components/TopTitleBar";
import { CameraMenuProvider, useCameraMenu } from "../../contexts/CameraMenuContext";
import { useI18n } from "../../contexts/I18nContext";
import { COLORS } from "../../theme/colors";

function TabsChrome() {
  const pathname = usePathname();
  const showHamburger = pathname.endsWith("/(tabs)") || pathname.endsWith("/");
  const { openMenu } = useCameraMenu();
  const { t } = useI18n();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <TopTitleBar title={t("common.videoReview")} />
      <SecondaryControlBar
        dateText="03.09.2025"
        centerText={t("common.live")}
        centerAccessory={
          showHamburger ? (
            <Pressable
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={t("common.openMenu")}
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
            animation: "fade",
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: t("tabs.video"),
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="camera-outline" size={size} color={color} />
              ),
              animation: "fade",
            }}
          />
          <Tabs.Screen
            name="statistics"
            options={{
              title: t("tabs.statistics"),
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="stats-chart-outline" size={size} color={color} />
              ),
              animation: "fade",
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: t("tabs.profile"),
              tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
              animation: "fade",
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
