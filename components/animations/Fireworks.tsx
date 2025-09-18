import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import type { FireworkInstance, Particle, Rocket } from "../../types/animation";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const PARTICLE_COUNT = 30; // Reduced for better performance on mobile
const BURST_COUNT = 5; // Reduced for better performance
const WREATH_RADIUS = 80; // Adjusted for mobile screen
const COLORS = [
  "#FFD700",
  "#FF4500",
  "#ADFF2F",
  "#00BFFF",
  "#BA55D3",
  "#FF1493",
  "#FFFFFF",
];
const ROCKET_TRAVEL_TIME_MS = 600;

// --- React Native Sound Effects ---

const playLaunchSound = () => {
  // Use haptic feedback instead of audio for launch
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

const playExplosionSound = () => {
  // Use haptic feedback for explosion
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
};

const createWreathBurst = (
  burstIndex: number,
  baseDelay: number
): Particle[] => {
  const particles: Particle[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = (i / PARTICLE_COUNT) * 360 + (Math.random() - 0.5) * 10;
    const radius = WREATH_RADIUS + (Math.random() - 0.5) * 30;

    const tx = Math.cos(angle * (Math.PI / 180)) * radius;
    const ty = Math.sin(angle * (Math.PI / 180)) * radius;

    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const particleDelay = baseDelay + Math.random() * 200;

    particles.push({
      id: `p-${burstIndex}-${i}`,
      tx,
      ty,
      size: Math.random() * 4 + 3,
      color,
      animationDelay: `${particleDelay}ms`,
    });
  }
  return particles;
};

// Animated Rocket Component
const AnimatedRocket: React.FC<{
  rocket: Rocket;
  onLaunchComplete: () => void;
}> = ({ rocket, onLaunchComplete }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    const delay = parseInt(rocket.animationDelay.replace("ms", ""));

    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(1, { duration: ROCKET_TRAVEL_TIME_MS - 200 }),
        withTiming(0, { duration: 100 })
      )
    );

    translateY.value = withDelay(
      delay,
      withTiming(-screenHeight * 0.3, {
        duration: ROCKET_TRAVEL_TIME_MS,
        easing: Easing.out(Easing.quad),
      })
    );

    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0.8, { duration: ROCKET_TRAVEL_TIME_MS - 400 }),
        withTiming(0, { duration: 200 })
      )
    );

    // Trigger launch sound
    setTimeout(() => {
      runOnJS(playLaunchSound)();
    }, delay);

    // Trigger explosion sound and callback
    setTimeout(() => {
      runOnJS(playExplosionSound)();
      runOnJS(onLaunchComplete)();
    }, delay + ROCKET_TRAVEL_TIME_MS);
  }, [rocket.animationDelay, onLaunchComplete, opacity, translateY, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: (rocket.x / 100) * screenWidth,
          top: (rocket.y / 100) * screenHeight,
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: "#FFD700",
          shadowColor: "#FFD700",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 8,
          elevation: 8,
        },
        animatedStyle,
      ]}
    />
  );
};

// Animated Particle Component
const AnimatedParticle: React.FC<{
  particle: Particle;
  startX: number;
  startY: number;
}> = ({ particle, startX, startY }) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    const delay = parseInt(particle.animationDelay.replace("ms", ""));

    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(1, { duration: 1500 }),
        withTiming(0, { duration: 500 })
      )
    );

    translateX.value = withDelay(
      delay,
      withTiming(particle.tx, {
        duration: 2000,
        easing: Easing.out(Easing.quad),
      })
    );

    translateY.value = withDelay(
      delay,
      withTiming(particle.ty, {
        duration: 2000,
        easing: Easing.out(Easing.quad),
      })
    );

    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(1, { duration: 1500 }),
        withTiming(0, { duration: 500 })
      )
    );
  }, [
    particle.animationDelay,
    particle.tx,
    particle.ty,
    opacity,
    translateX,
    translateY,
    scale,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: startX,
          top: startY,
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 2,
          backgroundColor: particle.color,
          shadowColor: particle.color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 5,
          elevation: 5,
        },
        animatedStyle,
      ]}
    />
  );
};

interface FireworksProps {
  onAnimationEnd: () => void;
}

export const Fireworks: React.FC<FireworksProps> = ({ onAnimationEnd }) => {
  const [fireworks, setFireworks] = useState<FireworkInstance[]>([]);
  const animationEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    const instances: FireworkInstance[] = [];
    let maxDelay = 0;

    for (let i = 0; i < BURST_COUNT; i++) {
      const burstX = Math.random() * 80 + 10;
      const burstY = Math.random() * 50 + 15;
      const launchDelay = i * 150 + Math.random() * 50; // 遅延を大幅に短縮

      const rocket: Rocket = {
        id: `r-${i}`,
        x: burstX,
        y: burstY,
        animationDelay: `${launchDelay}ms`,
      };

      const particleBaseDelay = launchDelay + ROCKET_TRAVEL_TIME_MS;
      const particles = createWreathBurst(i, particleBaseDelay);

      instances.push({ rocket, particles, x: burstX, y: burstY });

      if (particleBaseDelay > maxDelay) {
        maxDelay = particleBaseDelay;
      }
    }
    setFireworks(instances);

    // Set up animation end timer
    animationEndTimerRef.current = setTimeout(() => {
      onAnimationEnd();
    }, maxDelay + 3000); // Wait for the last firework to finish

    return () => {
      if (animationEndTimerRef.current) {
        clearTimeout(animationEndTimerRef.current);
      }
    };
  }, [onAnimationEnd]);

  const handleRocketComplete = useCallback((rocketId: string) => {
    // Rocket completion tracking can be added here if needed
    console.log(`Rocket ${rocketId} completed`);
  }, []);

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: screenWidth,
        height: screenHeight,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      {fireworks.map(({ rocket, particles, x, y }) => (
        <React.Fragment key={rocket.id}>
          {/* Animated Rocket */}
          <AnimatedRocket
            rocket={rocket}
            onLaunchComplete={() => handleRocketComplete(rocket.id)}
          />
          {/* Animated Particles */}
          {particles.map((particle) => (
            <AnimatedParticle
              key={particle.id}
              particle={particle}
              startX={(x / 100) * screenWidth}
              startY={(y / 100) * screenHeight}
            />
          ))}
        </React.Fragment>
      ))}
    </View>
  );
};
