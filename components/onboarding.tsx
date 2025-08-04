import { onboardingSlides as slides } from "@/constants/onboarding-slide";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // NOTE: In a real app, this would navigate to the main app screen.
      console.log("Onboarding complete!");
    }
  };

  const { icon, title, description } = slides[currentSlide];

  return (
    <View className="flex-1 bg-white">
      <View
        className="flex-1 justify-center items-center p-8"
        key={slides[currentSlide].id}
      >
        <Text className="text-8xl mb-8">{icon}</Text>
        <Text className="text-3xl font-bold mb-4 text-center text-gray-800">
          {title}
        </Text>
        <Text className="text-gray-600 text-center max-w-sm">
          {description}
        </Text>
      </View>

      <View className="p-8">
        {/* Dots indicator */}
        <View className="flex-row justify-center items-center mb-8">
          {slides.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentSlide(index)}
              className={`h-2 rounded-full mx-1 ${
                currentSlide === index ? "w-6 bg-blue-500" : "w-2 bg-blue-200"
              }`}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          className="w-full py-4 bg-blue-600 rounded-xl items-center"
          onPress={handleNext}
        >
          <Text className="text-white font-bold text-center">
            {currentSlide === slides.length - 1 ? "始める" : "次へ"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
