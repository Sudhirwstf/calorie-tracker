import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

interface ButtonProps {
  label?: string;
  onPress: () => void;
  className?: string;
  children?: ReactNode;
}

/**
 * A generic button component which wraps a `Pressable` and applies CSS styles.
 * @param label - The button's label text.
 * @param className - The CSS class name to apply to the wrapping `View`.
 * @param onPress - The function to call when the button is pressed.
 * @param children - The optional child content to display instead of the `label`.
 */
export default function Button({ label, className, onPress, children }: ButtonProps) {
  return (
    <Pressable onPress={onPress} className={className}>
      {label && <Text className="font-semibold text-2xl">{label}</Text>}
      {!label && children}
    </Pressable>
  );
}
