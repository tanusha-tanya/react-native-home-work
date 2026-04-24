import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { AppText as Text } from "../../../components/ui/AppText";
import { useI18n } from "../../../contexts/I18nContext";
import { COLORS } from "../../../theme/colors";

type StatTile = {
  id: string;
  titleKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: "/statistics/personnel" | "/statistics/equipment" | "/statistics/construction" | "/statistics/overall";
};

const TILES: StatTile[] = [
  {
    id: "personnel",
    titleKey: "stats.tile.personnel",
    icon: "people-outline",
    route: "/statistics/personnel",
  },
  {
    id: "equipment",
    titleKey: "stats.tile.equipment",
    icon: "car-outline",
    route: "/statistics/equipment",
  },
  {
    id: "construction",
    titleKey: "stats.tile.construction",
    icon: "home-outline",
    route: "/statistics/construction",
  },
  {
    id: "overall",
    titleKey: "stats.tile.overall",
    icon: "stats-chart-outline",
    route: "/statistics/overall",
  },
];

export default function StatisticsScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const tiles = useMemo(
    () => TILES.map((tile) => ({ ...tile, title: t(tile.titleKey) })),
    [t]
  );

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: t("stats.root") }} />
      <FlatList
        data={tiles}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
            onPress={() => router.push(item.route)}
          >
            <Ionicons name={item.icon} size={30} color={COLORS.icon} />
            <Text style={styles.tileText}>{item.title}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: 12,
    gap: 12,
  },
  row: {
    gap: 12,
  },
  tile: {
    flex: 1,
    minHeight: 136,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    gap: 10,
  },
  tilePressed: {
    backgroundColor: COLORS.borderSoft,
  },
  tileText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
