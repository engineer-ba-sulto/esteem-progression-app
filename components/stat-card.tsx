import { Text, View } from "react-native";

export default function StatCard({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <View className="flex-1 p-4 rounded-xl bg-white shadow-sm border border-gray-200 flex flex-col items-center justify-center">
      <Text className={`text-3xl font-bold ${color}`}>{value}</Text>
      <Text className="text-sm text-gray-500 mt-1 text-center">{label}</Text>
    </View>
  );
}
