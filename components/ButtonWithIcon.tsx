import { Pressable, StyleSheet, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { ViewStyle } from "react-native";

interface ButtonProps {
  onPress: () => void;
  color?: string;
  name: keyof typeof MaterialIcons.glyphMap;
  label?: string;
  style?: ViewStyle;
  className?: string;
}

export default function ButtonWithIcon({ label, onPress, color, name, className, style }: ButtonProps) {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      className={`${className} p-2 items-center justify-center`}
      style={{ transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }] }}
    >
      <MaterialIcons name={name} size={38} color={color} />
      {label && <Text className="text-xl font-normal">{label}</Text>}
    </Pressable>
  );
}
