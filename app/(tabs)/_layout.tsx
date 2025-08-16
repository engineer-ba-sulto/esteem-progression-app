import { useLocalization } from "@/utils/localization-context";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";

export default function TabsLayout() {
  const { t, locale } = useLocalization();
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // 言語変更を監視して再レンダリングを強制
  useEffect(() => {
    setUpdateTrigger((prev) => prev + 1);
  }, [locale]);

  return (
    <Tabs
      key={`tabs-${updateTrigger}`} // キーを変更して強制的に再レンダリング
      screenOptions={{
        tabBarActiveTintColor: "#2196F3",
        tabBarInactiveTintColor: "#9E9E9E",
        tabBarLabelStyle: {
          fontSize: 14,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recond"
        options={{
          title: t("tabs.record"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabs.settings"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
          href: null, // タブを非表示にする
        }}
      />
    </Tabs>
  );
}
