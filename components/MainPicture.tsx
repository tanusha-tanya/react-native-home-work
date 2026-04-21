import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import type { ImageSourcePropType } from "react-native";

type MainPictureProps = {
  source: ImageSourcePropType;
};

export function MainPicture({ source }: MainPictureProps) {
  const { height: windowHeight } = useWindowDimensions();
  const imageHeight = windowHeight * 0.5;

  return (
    <View style={[styles.container, { height: imageHeight }]}>
      <Image source={source} style={styles.image} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#0f141a",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default MainPicture;
