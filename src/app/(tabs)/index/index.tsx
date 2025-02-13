import Auth from "@/components/Auth";
import { View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <Auth />
    </View>
  );
}
