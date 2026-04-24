import { Stack } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { MonthlyStatsChart } from "../../../components/charts/MonthlyStatsChart";
import { useI18n } from "../../../contexts/I18nContext";
import { COLORS } from "../../../theme/colors";

export default function OverallStatisticsScreen() {
  const { t } = useI18n();
  const valuesByDay = [
    9, 12, 13, 14, 19, 18, 21, 23, 27, 23,
    29, 27, 29, 32, 34, 33, 36, 37, 42, 38,
    38, 41, 46, 45, 44, 49, 51, 47, 51, 57,
  ];

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <Stack.Screen options={{ title: t("stats.overall") }} />
      <MonthlyStatsChart title={t("stats.chart.overall")} valuesByDay={valuesByDay} yAxisSuffix="" />
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
