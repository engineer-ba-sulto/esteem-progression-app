import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function SettingCard({
  icon,
  label,
  onPress,
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      className={`flex flex-row items-center p-4 bg-white rounded-lg border border-gray-200 ${
        disabled ? "opacity-50" : ""
      }`}
      onPress={onPress}
      disabled={disabled}
    >
      <View className="w-8 h-8 flex items-center justify-center mr-4">
        {icon}
      </View>
      <Text
        className={`flex-1 font-medium ${
          disabled ? "text-gray-400" : "text-gray-700"
        }`}
      >
        {label}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={16}
        color={disabled ? "#9CA3AF" : "#374151"}
      />
    </TouchableOpacity>
  );
}
