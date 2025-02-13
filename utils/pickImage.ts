import { launchImageLibraryAsync } from "expo-image-picker";

export default async function pickImage() {
  const result = await launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    quality: 1,
  });
  if (!result.canceled) {
    return result.assets[0].uri;
  } else {
    return null;
  }
}
