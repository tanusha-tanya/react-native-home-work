import { Stack } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { MonthlyStatsChart } from "../../../components/charts/MonthlyStatsChart";
import { useI18n } from "../../../contexts/I18nContext";
import { COLORS } from "../../../theme/colors";

export default function ConstructionStatisticsScreen() {
  const { t } = useI18n();
  const valuesByDay = [
    1, 1, 2, 2, 3, 2, 4, 3, 5, 4,
    6, 5, 7, 6, 8, 7, 9, 8, 10, 9,
    11, 10, 12, 11, 13, 12, 14, 13, 15, 16,
  ];

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <Stack.Screen options={{ title: t("stats.construction") }} />
      <MonthlyStatsChart title={t("stats.chart.construction")} valuesByDay={valuesByDay} yAxisSuffix="" />
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
