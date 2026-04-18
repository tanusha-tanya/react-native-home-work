import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = { title: string};

export function TopTitleBar ({ title }: Props){
    return (
        <SafeAreaView edges={["top"]} style={styles.safe}>
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: {
        backgroundColor: "#22272B",
    },
    container: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    title: {
        color: "#FAFAFA",
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 0.2,
    },
})