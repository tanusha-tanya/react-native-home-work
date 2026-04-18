import { View, Text, StyleSheet } from "react-native";

export default function StatisticsScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Статистика</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0f141a" },
  text: { color: "#FAFAFA", fontSize: 18, fontWeight: "600" },
});

