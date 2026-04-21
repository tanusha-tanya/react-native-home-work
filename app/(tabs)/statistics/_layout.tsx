import { Stack } from "expo-router";
import { COLORS } from "../../../theme/colors";

export default function StatisticsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: { fontWeight: "700" },
        contentStyle: { backgroundColor: COLORS.background },
      }}
    />
  );
}
