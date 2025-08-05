import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function SettingCard({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className="flex flex-row items-center p-4 bg-white rounded-lg border border-gray-200"
      onPress={onPress}
    >
      <View className="w-8 h-8 flex items-center justify-center mr-4">
        {icon}
      </View>
      <Text className="flex-1 text-gray-700 font-medium">{label}</Text>
      <Ionicons name="chevron-forward" size={16} />
    </TouchableOpacity>
  );
}
