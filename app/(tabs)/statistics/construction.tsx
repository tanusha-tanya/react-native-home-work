import { Stack } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { MonthlyStatsChart } from "../../../components/charts/MonthlyStatsChart";
import { COLORS } from "../../../theme/colors";

export default function ConstructionStatisticsScreen() {
  const valuesByDay = [
    1, 1, 2, 2, 3, 2, 4, 3, 5, 4,
    6, 5, 7, 6, 8, 7, 9, 8, 10, 9,
    11, 10, 12, 11, 13, 12, 14, 13, 15, 16,
  ];

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <Stack.Screen options={{ title: "Стройплощадка" }} />
      <MonthlyStatsChart title="Стройплощадка по дням месяца" valuesByDay={valuesByDay} yAxisSuffix="" />
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
