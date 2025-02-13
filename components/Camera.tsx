import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture, CameraMode } from "expo-camera";
import { useState, useRef } from "react";
import { Text, View } from "react-native";
import ButtonWithIcon from "./ButtonWithIcon";
import { Image } from "expo-image";
import saveImageToGallery from "@/utils/saveImageToGallery";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraMode, setCameraMode] = useState<CameraMode>("picture");
  const [permission, requestPermission] = useCameraPermissions();
  const [pic, setPic] = useState<CameraCapturedPicture | undefined>(undefined);
  const cameraRef = useRef<CameraView>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (!permission?.granted) await requestPermission();
        if (!isCameraActive) setIsCameraActive(true);
      })();
      return () => {
        setIsCameraActive(false);
      };
    }, [])
  );

  if (!permission) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View className="flex flex-col justify-center">
        <Text>You need to grant camera permissions to use camera</Text>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  function toggleCameraMode() {
    setCameraMode((current) => (current === "picture" ? "video" : "picture"));
  }

  function takePicture() {
    if (cameraRef.current) {
      cameraRef.current.takePictureAsync().then((data) => {
        setPic(data);
        data?.uri && saveImageToGallery(data.uri);
      });
    }
  }
  return (
    <View style={{ height: "100%", width: "100%" }}>
      {isCameraActive && (
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing={facing}
          autofocus="off"
          flash="auto"
          zoom={0}
          key={isCameraActive ? "active" : "in-active"}
        />
      )}
      <View className="flex flex-row justify-evenly items-center px-5">
        <ButtonWithIcon name="flip-camera-android" onPress={toggleCameraFacing} />
        <ButtonWithIcon name="camera" onPress={takePicture} />
        <ButtonWithIcon name={cameraMode === "picture" ? "photo-camera" : "videocam"} onPress={toggleCameraMode} />
        <Image source={pic?.uri} style={{ width: 40, height: 40 }} />
      </View>
    </View>
  );
}
