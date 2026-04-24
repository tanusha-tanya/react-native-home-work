import { Stack } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { MonthlyStatsChart } from "../../../components/charts/MonthlyStatsChart";
import { useI18n } from "../../../contexts/I18nContext";
import { COLORS } from "../../../theme/colors";

export default function PersonnelStatisticsScreen() {
  const { t } = useI18n();
  const valuesByDay = [
    6, 8, 7, 9, 11, 10, 12, 13, 14, 12,
    15, 14, 13, 16, 18, 17, 16, 19, 20, 18,
    17, 19, 21, 22, 20, 23, 24, 22, 21, 25,
  ];

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <Stack.Screen options={{ title: t("stats.personnel") }} />
      <MonthlyStatsChart title={t("stats.chart.personnel")} valuesByDay={valuesByDay} yAxisSuffix="" />
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
