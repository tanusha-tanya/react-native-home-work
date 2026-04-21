import { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { COLORS } from "../../theme/colors";

type MonthlyStatsChartProps = {
  title: string;
  valuesByDay: number[];
  lineColor?: string;
  yAxisSuffix?: string;
};

function createDayLabels(length: number) {
  return Array.from({ length }, (_, idx) => {
    const day = idx + 1;
    return day === 1 || day % 5 === 0 ? String(day) : "";
  });
}

export function MonthlyStatsChart({
  title,
  valuesByDay,
  lineColor = COLORS.accent,
  yAxisSuffix = "",
}: MonthlyStatsChartProps) {
  const chartWidth = Math.max(Dimensions.get("window").width - 40, 260);

  const data = useMemo(
    () => ({
      labels: createDayLabels(valuesByDay.length),
      datasets: [{ data: valuesByDay, color: () => lineColor, strokeWidth: 2 }],
    }),
    [lineColor, valuesByDay]
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={data}
        width={chartWidth}
        height={220}
        yAxisSuffix={yAxisSuffix}
        withDots
        withShadow={false}
        withInnerLines
        fromZero
        chartConfig={{
          backgroundGradientFrom: COLORS.surface,
          backgroundGradientTo: COLORS.surface,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(230, 237, 243, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(170, 182, 196, ${opacity})`,
          propsForBackgroundLines: { stroke: COLORS.borderSoft, strokeWidth: 1 },
          propsForLabels: { fontSize: 11 },
        }}
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 10,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    paddingHorizontal: 6,
  },
  chart: {
    borderRadius: 12,
  },
});
