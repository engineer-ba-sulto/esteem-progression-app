import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Fireworks } from "./Fireworks";

export const FireworksExample: React.FC = () => {
  const [showFireworks, setShowFireworks] = useState(false);

  const handleStartFireworks = () => {
    setShowFireworks(true);
  };

  const handleAnimationEnd = () => {
    setShowFireworks(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>花火アニメーション</Text>
      <Text style={styles.description}>
        達成感やお祝いの演出に使用できる美しい花火アニメーションです。
        ハプティックフィードバック付きで、モバイルデバイスに最適化されています。
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleStartFireworks}
        disabled={showFireworks}
      >
        <Text style={styles.buttonText}>
          {showFireworks ? "花火中..." : "花火を打ち上げる"}
        </Text>
      </TouchableOpacity>

      {showFireworks && <Fireworks onAnimationEnd={handleAnimationEnd} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1a1a1a",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: "#1a1a1a",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
