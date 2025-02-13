import { Link, Stack } from "expo-router";
import React from "react";

import { Text, View } from "@/components/Themed";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center p-20">
        <Text className="text-3xl font-bold">This screen doesn't exist.</Text>

        <Link href="/" className="mt-10 py-10">
          <Text className="text-sm text-blue-600">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
