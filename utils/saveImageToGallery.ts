import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";
export default async function saveImageToGallery(cacheUri: string) {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission Required", "Please allow access to the media library.");
    return;
  }
  try {
    const fileName = cacheUri.split("/").pop() ?? "";
    const newUri = fileName ? FileSystem.documentDirectory + fileName : cacheUri;

    await FileSystem.moveAsync({
      from: cacheUri,
      to: newUri,
    });

    const asset = await MediaLibrary.createAssetAsync(newUri);
    await MediaLibrary.createAlbumAsync("MyApp", asset, false);
  } catch (error) {
    Alert.alert("Error", "Failed to save the file.");
  }
}
