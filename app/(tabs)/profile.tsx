import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";

export default function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Личный кабинет</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "700",
  },
});
