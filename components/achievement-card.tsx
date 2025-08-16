import { Text, View } from "react-native";

export default function AchievementCard({
  icon,
  title,
  description,
  achieved = true,
}: {
  icon: string;
  title: string;
  description?: string;
  achieved?: boolean;
}) {
  return (
    <View
      className={`flex flex-row items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200 ${!achieved ? "opacity-60" : ""}`}
    >
      <Text className="text-2xl mr-4">{icon}</Text>
      <View className="flex-1">
        <Text
          className={`font-medium ${achieved ? "text-gray-700" : "text-gray-500"}`}
        >
          {title}
        </Text>
        {description && (
          <Text className="text-xs text-gray-400">{description}</Text>
        )}
      </View>
    </View>
  );
}
