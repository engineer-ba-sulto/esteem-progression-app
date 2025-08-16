import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export default function ArrowButton({
  onPress,
  disabled,
  iconName,
}: {
  onPress: () => void;
  disabled: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className="p-2 rounded-full disabled:opacity-30"
      >
        <Ionicons name={iconName} size={24} />
      </TouchableOpacity>
    </View>
  );
}
