import { useBenefits } from "@/constants/benefits";
import { usePlans } from "@/constants/plan";
import { PlanType } from "@/types/plan";
import { useLocalization } from "@/utils/localization-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("yearly");
  const { t } = useLocalization();
  const benefits = useBenefits();
  const plans = usePlans();

  const handleBack = () => {
    router.back();
  };

  const handlePurchase = () => {
    // ここで購入処理を実装
    console.log("購入処理を実行", { selectedPlan });
  };

  const handleRestore = () => {
    // ここで購入復元処理を実装
    console.log("解約処理を実行");
  };

  return (
    <SafeAreaView className="flex flex-col h-full bg-blue-50" edges={["top"]}>
      {/* Header */}
      <View className="p-4 flex-shrink-0 bg-white rounded-3xl shadow-sm h-24 flex flex-row items-center">
        <TouchableOpacity
          onPress={handleBack}
          className="w-10 h-10 flex items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-bold text-gray-800 text-center mr-10">
          {t("subscription.title")}
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 p-4">
        {/* Premium Features Section */}
        <View className="mt-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
            {t("subscription.premiumFeatures")}
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            {t("subscription.premiumDescription")}
          </Text>

          {/* Benefits List */}
          <View className="gap-y-1 mb-8">
            {benefits.map((benefit, index) => (
              <View
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <View className="flex flex-row items-start">
                  <Text className="text-2xl mr-3">{benefit.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-800 mb-1">
                      {benefit.title}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {benefit.description}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Plan Selection */}
          <View className="mb-8">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              {t("subscription.selectPlan")}
            </Text>
            <View className="gap-y-3">
              {plans.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  onPress={() => setSelectedPlan(plan.id)}
                  className={`relative border-2 rounded-lg p-4 bg-white ${
                    selectedPlan === plan.id
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                >
                  {plan.popular && (
                    <View className="absolute -top-2 left-4 bg-blue-500 px-3 py-1 rounded-full">
                      <Text className="text-white text-xs font-semibold">
                        {t("subscription.popular")}
                      </Text>
                    </View>
                  )}
                  <View className="flex flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-800">
                        {plan.title}
                      </Text>
                      <Text className="text-sm text-gray-600 mt-1">
                        {plan.description}
                      </Text>
                    </View>
                    <View className="items-end mr-8">
                      <Text className="text-2xl font-bold text-gray-800">
                        {plan.price}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {plan.period}
                      </Text>
                    </View>
                  </View>
                  <View className="absolute top-4 right-4">
                    <Ionicons
                      name={
                        selectedPlan === plan.id
                          ? "checkmark-circle"
                          : "ellipse-outline"
                      }
                      size={24}
                      color={selectedPlan === plan.id ? "#3b82f6" : "#9ca3af"}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-y-3 mb-6">
            <TouchableOpacity
              onPress={handlePurchase}
              className="bg-blue-500 rounded-lg py-4 px-6"
            >
              <Text className="text-white text-center font-semibold text-lg">
                {t("subscription.purchase")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRestore}
              className="bg-white border border-gray-300 rounded-lg py-4 px-6"
            >
              <Text className="text-gray-700 text-center font-semibold text-lg">
                {t("subscription.cancel")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Terms and Privacy */}
          <View className="mb-6">
            <Text className="text-xs text-gray-500 text-center leading-4">
              {t("subscription.termsAndPrivacy")}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
