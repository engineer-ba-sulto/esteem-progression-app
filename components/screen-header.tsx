import React from "react";
import { Text, View } from "react-native";

interface TabHeaderProps {
  title: string;
  subtitle?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  className?: string;
}

export default function TabHeader({
  title,
  subtitle,
  leftComponent,
  rightComponent,
  className = "",
}: TabHeaderProps) {
  return (
    <View
      className={`p-4 flex-shrink-0 bg-white rounded-3xl shadow-sm h-24 ${className}`}
    >
      <View className="flex-row items-center justify-between h-full">
        {/* Left Component */}
        <View className="flex-1 items-start justify-center">
          {leftComponent}
        </View>

        {/* Center Content */}
        <View>
          <Text className="text-2xl font-bold text-center text-gray-800">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-gray-500 text-sm text-center mt-1">
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right Component */}
        <View className="flex-1 items-end justify-center">
          {rightComponent}
        </View>
      </View>
    </View>
  );
}
