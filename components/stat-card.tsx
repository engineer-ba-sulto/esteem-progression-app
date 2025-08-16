import { Text, View } from "react-native";

export default function StatCard({
  value,
  unit,
  label,
  color,
}: {
  value: string;
  unit: string;
  label: string;
  color: string;
}) {
  return (
    <View className="flex-1 p-4 rounded-xl bg-white shadow-sm border border-gray-200 flex flex-col items-center justify-center">
      <View className="flex flex-row items-baseline">
        <Text className={`text-3xl font-bold ${color}`}>{value}</Text>
        <Text className={`text-lg font-bold ${color} ml-1`}>{unit}</Text>
      </View>
      <Text className="text-sm text-gray-500 mt-1 text-center">{label}</Text>
    </View>
  );
}
