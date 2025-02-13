import { CameraView, useCameraPermissions, BarcodeScanningResult, BarcodeType } from "expo-camera";
import { useRef, useState } from "react";
import { Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
interface BarCodeScannerProps {
  barcodeType: BarcodeType;
  handleBarcodeScanned: (data: BarcodeScanningResult) => void;
}
export default function BarCodeScanner({ barcodeType, handleBarcodeScanned }: BarCodeScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
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

  return (
    <View style={{ height: "100%", width: "100%" }}>
      {isCameraActive && (
        <CameraView
          key={isCameraActive ? "active" : "in-active"}
          ref={cameraRef}
          barcodeScannerSettings={{
            barcodeTypes: [barcodeType],
          }}
          onBarcodeScanned={handleBarcodeScanned}
          style={{ flex: 1 }}
          flash="auto"
          zoom={0}
        />
      )}
    </View>
  );
}
