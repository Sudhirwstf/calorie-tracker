import { Image, type ImageSource } from "expo-image";
import { StyleSheet } from "react-native";
interface ImageViewerProps {
  source: ImageSource;
}
export default function ImageViewer({ source }: ImageViewerProps) {
  return <Image source={source} style={style.image} />;
}

const style = StyleSheet.create({
  image: { width: 320, height: 440, borderRadius: 18 },
});
