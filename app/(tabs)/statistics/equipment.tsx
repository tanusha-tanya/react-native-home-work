import { Stack } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { MonthlyStatsChart } from "../../../components/charts/MonthlyStatsChart";
import { useI18n } from "../../../contexts/I18nContext";
import { COLORS } from "../../../theme/colors";

export default function EquipmentStatisticsScreen() {
  const { t } = useI18n();
  const valuesByDay = [
    2, 3, 4, 3, 5, 6, 5, 7, 8, 7,
    6, 8, 9, 10, 8, 9, 11, 10, 12, 11,
    10, 12, 13, 12, 11, 14, 13, 12, 15, 16,
  ];

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <Stack.Screen options={{ title: t("stats.equipment") }} />
      <MonthlyStatsChart title={t("stats.chart.equipment")} valuesByDay={valuesByDay} yAxisSuffix="" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 12,
    gap: 12,
  },
});
