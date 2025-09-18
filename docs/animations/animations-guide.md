# 汎用アニメーションコンポーネント実装ガイド

## 1. はじめに

このドキュメントは、React Native (Expo) アプリケーションにおける達成・祝福アニメーションの実装方法を解説します。
タスク完了時などのポジティブなフィードバックをユーザーに与えることで、エンゲージメントを高めることを目的とします。

ここで紹介するコンポーネントは、`react-native-reanimated` と `react-native-svg` を活用し、宣言的かつパフォーマンスに優れた方法で実装されています。各コンポーネントは汎用的に設計されており、様々なシーンで再利用可能です。

## 2. 前提条件・ライブラリのインストール

アニメーションの実装には、以下のライブラリが必要です。プロジェクトにインストールされていない場合は、以下のコマンドを実行してください。

```bash
# react-native-reanimated は既にインストール済みです
# npx expo install react-native-reanimated

# SVGベースのアニメーション（チェックマークなど）で使用します
npx expo install react-native-svg

# ハプティックフィードバック（振動）で使用します
npx expo install expo-haptics
```

## 3. アニメーションコンポーネント実装例

以下に、8つのアニメーションの実装例をコードと共に示します。
これらのコンポーネントは、`components/animations/` ディレクトリにそれぞれファイルを作成して実装することを想定しています。

---

### ① パーティクル爆発アニメーション (`ParticleExplosion.tsx`)

ボタンなどを中心に、カラフルな紙吹雪が飛び散るようなエフェクトです。

```typescript
// components/animations/ParticleExplosion.tsx
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const PARTICLE_COUNT = 20;
const DURATION = 2000;
const COLORS = ["#FFD700", "#FF6347", "#ADFF2F", "#1E90FF", "#BA55D3"];

const Particle = ({ index, onAnimationComplete }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    const delay = Math.random() * DURATION * 0.5;

    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 100, easing: Easing.linear })
    );
    scale.value = withDelay(
      delay,
      withTiming(1, { duration: DURATION, easing: Easing.out(Easing.quad) })
    );

    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * 150 + 50;

    translateX.value = withDelay(
      delay,
      withTiming(radius * Math.cos(angle), { duration: DURATION, easing: Easing.out(Easing.quad) })
    );
    translateY.value = withDelay(
      delay,
      withTiming(radius * Math.sin(angle), { duration: DURATION, easing: Easing.out(Easing.quad) })
    );

    opacity.value = withDelay(
      delay + DURATION * 0.7,
      withTiming(0, { duration: DURATION * 0.3, easing: Easing.in(Easing.quad) }, (finished) => {
        if (index === PARTICLE_COUNT - 1 && finished) {
          runOnJS(onAnimationComplete)();
        }
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        { backgroundColor: COLORS[index % COLORS.length] },
        animatedStyle,
      ]}
    />
  );
};

export const ParticleExplosion = ({ onAnimationFinish }) => {
  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <Particle key={i} index={i} onAnimationComplete={onAnimationFinish} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  particle: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
```

---

### ② チェックマーク描画アニメーション (`CheckmarkAnimation.tsx`)

大きなチェックマークが一筆書きで描画されるアニメーションです。

```typescript
// components/animations/CheckmarkAnimation.tsx
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const CHECK_PATH = "M15 45 L35 65 L75 25";
const STROKE_COLOR = "#10B981";
const STROKE_WIDTH = 8;
const DURATION = 800;

export const CheckmarkAnimation = ({ onAnimationFinish }) => {
  const progress = useSharedValue(0);
  const pathLength = 100; // Approximate length for this path

  useEffect(() => {
    progress.value = withTiming(1, { duration: DURATION, easing: Easing.out(Easing.quad) }, (finished) => {
      if (finished) {
        runOnJS(onAnimationFinish)();
      }
    });
  }, []);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: pathLength * (1 - progress.value),
    };
  });

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width="100" height="100" viewBox="0 0 100 100">
        <AnimatedPath
          d={CHECK_PATH}
          stroke={STROKE_COLOR}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={pathLength}
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});
```

---

### ③ スケール+回転+フェードコンポーネント (`AnimatedWrapper.tsx`)

子要素をラップし、表示される際にアニメーションさせます。

```typescript
// components/animations/AnimatedWrapper.tsx
import React, { useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

type AnimatedWrapperProps = {
  children: React.ReactNode;
  visible: boolean;
  onAnimationFinish?: () => void;
  style?: ViewStyle;
};

export const AnimatedWrapper = ({ children, visible, onAnimationFinish, style }: AnimatedWrapperProps) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const rotate = useSharedValue("-15deg");

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 500 });
      scale.value = withSpring(1, { damping: 12, stiffness: 100 });
      rotate.value = withSpring("0deg", { damping: 12, stiffness: 100 }, (finished) => {
        if (finished && onAnimationFinish) {
          runOnJS(onAnimationFinish)();
        }
      });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }, { rotate: rotate.value }],
    };
  });

  if (!visible) return null;

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};

```

---

### ④ バウンス+グロー効果 (`BounceGlow.tsx`)

子要素がバウンスしながら表示され、背後に光彩が広がります。

```typescript
// components/animations/BounceGlow.tsx
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

type BounceGlowProps = {
  children: React.ReactNode;
  onAnimationFinish?: () => void;
};

export const BounceGlow = ({ children, onAnimationFinish }: BounceGlowProps) => {
  const scale = useSharedValue(0.3);
  const shadowOpacity = useSharedValue(0);
  const shadowRadius = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 120 }, (finished) => {
       if (finished && onAnimationFinish) {
          runOnJS(onAnimationFinish)();
        }
    });
    shadowOpacity.value = withTiming(0.5, { duration: 800 });
    shadowRadius.value = withTiming(40, { duration: 800 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      shadowColor: "#3B82F6",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: shadowOpacity.value,
      shadowRadius: shadowRadius.value,
    };
  });

  return <Animated.View style={[styles.container, animatedStyle]}>{children}</Animated.View>;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

---

### ⑤ プログレスバーアニメーション (`ProgressBarAnimation.tsx`)

プログレスバーが0%から100%まで満たされるアニメーションです。

```typescript
// components/animations/ProgressBarAnimation.tsx
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const DURATION = 1500;

export const ProgressBarAnimation = ({ onAnimationFinish }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: DURATION, easing: Easing.out(Easing.cubic) }, (finished) => {
      if (finished) {
        runOnJS(onAnimationFinish)();
      }
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View style={[styles.bar, animatedStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  track: {
    width: '80%',
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
  },
  bar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 5,
  },
});
```

---

### ⑥ 3D回転カードアニメーション (`FlipCard.tsx`)

カードがY軸を中心に回転して裏面を見せるようなアニメーションです。

```typescript
// components/animations/FlipCard.tsx
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from "react-native-reanimated";

type FlipCardProps = {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  onAnimationFinish?: () => void;
};

export const FlipCard = ({ frontContent, backContent, onAnimationFinish }: FlipCardProps) => {
  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = withTiming(180, { duration: 1000 }, (finished) => {
      if (finished) {
        runOnJS(onAnimationFinish)();
      }
    });
  }, []);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotate.value, [0, 180], [0, 180], Extrapolate.CLAMP);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden",
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotate.value, [0, 180], [180, 360], Extrapolate.CLAMP);
    return {
      ...StyleSheet.absoluteFillObject,
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden",
    };
  });

  return (
    <View>
      <Animated.View style={frontAnimatedStyle}>{frontContent}</Animated.View>
      <Animated.View style={backAnimatedStyle}>{backContent}</Animated.View>
    </View>
  );
};
```

---

### ⑦ 波紋効果アニメーション (`RippleEffect.tsx`)

ボタンなどを中心に、波紋が広がるエフェクトです。

```typescript
// components/animations/RippleEffect.tsx
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const RIPPLE_COUNT = 3;
const DURATION = 1500;

const Ripple = ({ index, onAnimationComplete }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const delay = index * 400;
    scale.value = withDelay(delay, withTiming(1, { duration: DURATION }));
    opacity.value = withDelay(delay, withTiming(0, { duration: DURATION, easing: Easing.out(Easing.quad) }, (finished) => {
      if (index === RIPPLE_COUNT - 1 && finished) {
        runOnJS(onAnimationComplete)();
      }
    }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return <Animated.View style={[styles.ripple, animatedStyle]} />;
};

export const RippleEffect = ({ onAnimationFinish }) => {
  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: RIPPLE_COUNT }).map((_, i) => (
        <Ripple key={i} index={i} onAnimationComplete={onAnimationFinish} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  ripple: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
});
```

---

### ⑧ 花火アニメーション (`Fireworks.tsx`)

カラフルな花火が打ち上がるアニメーションです。パーティクル爆発の応用です。

```typescript
// components/animations/Fireworks.tsx
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const PARTICLE_COUNT = 30;
const DURATION = 2500;
const COLORS = ["#FFD700", "#FF6347", "#ADFF2F", "#1E90FF", "#BA55D3"];

const FireworkParticle = ({ index, onAnimationComplete }) => {
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    const angle = (index / PARTICLE_COUNT) * 2 * Math.PI;
    const radius = 120;

    // 打ち上げ
    translateY.value = withTiming(-100, { duration: 500, easing: Easing.out(Easing.quad) });

    // 爆発
    translateX.value = withDelay(
      500,
      withTiming(radius * Math.cos(angle), { duration: DURATION - 500, easing: Easing.out(Easing.circle) })
    );
    // 重力を考慮した落下
    translateY.value = withDelay(
      500,
      withTiming(translateY.value + radius * Math.sin(angle) + 100, { duration: DURATION - 500, easing: Easing.out(Easing.quad) })
    );

    opacity.value = withDelay(
      DURATION - 500,
      withTiming(0, { duration: 500 }, (finished) => {
         if (index === PARTICLE_COUNT - 1 && finished) {
          runOnJS(onAnimationComplete)();
        }
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        { backgroundColor: COLORS[index % COLORS.length] },
        animatedStyle,
      ]}
    />
  );
};


export const Fireworks = ({ onAnimationFinish }) => {
    return (
        <View style={styles.container} pointerEvents="none">
            {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
                <FireworkParticle key={i} index={i} onAnimationComplete={onAnimationFinish} />
            ))}
        </View>
    );
};


const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  particle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
```

## 4. 使用方法

これらのアニメーションコンポーネントを、タスク完了画面 (`app/(tabs)/index.tsx`) で使用する例を示します。

1.  **Stateの定義**: アニメーションを表示するかどうかを管理するStateを定義します。

    ```typescript
    // app/(tabs)/index.tsx
    import { useState } from "react";
    import { ParticleExplosion } from "@/components/animations/ParticleExplosion"; // 例
    // ... other imports

    export default function HomeScreen() {
      // ... existing states
      const [showCompletionAnimation, setShowCompletionAnimation] =
        useState(false);
      // ...
    }
    ```

2.  **`handleComplete` 関数の変更**: タスク完了処理が成功した後に、Stateを更新してアニメーションをトリガーします。ハプティックフィードバックも追加します。

    ```typescript
    // app/(tabs)/index.tsx
    import * as Haptics from "expo-haptics";

    // ... inside HomeScreen component
    const handleComplete = async () => {
      if (!task) return;
      try {
        await db
          .update(taskTable)
          .set({ isCompleted: true, updatedAt: new Date().toISOString() })
          .where(eq(taskTable.id, task.id));

        // --- Animation Trigger ---
        setShowCompletionAnimation(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // -------------------------
      } catch (error) {
        console.error("UPDATE_TASK_FAILED", error);
      }
    };
    ```

3.  **JSXへのコンポーネントの追加**: 完了状態のUIに重ねてアニメーションコンポーネントを配置します。

    ```typescript
    // app/(tabs)/index.tsx

    // ... inside return (...)
    {task && task.isCompleted ? (
      <View className="text-center flex-1 flex-col items-center justify-center">
        <Text className="text-7xl text-center mb-6">🎉</Text>
        <Text className="text-3xl font-bold text-gray-900 text-center">
          {t("home.congratulations")}
        </Text>
        <Text className="text-gray-600 mt-2 text-center">
          {t("home.greatDay")}
        </Text>
        {/* ... */}

        {/* --- Animation Component --- */}
        {showCompletionAnimation && (
          <ParticleExplosion
            onAnimationFinish={() => setShowCompletionAnimation(false)}
          />
        )}
        {/* ------------------------- */}
      </View>
    ) : (
      // ...
    )}
    ```

`onAnimationFinish` コールバックでアニメーション用のStateを `false` に戻すことで、次回以降もアニメーションが再生されるようにしています。

## 5. 実装時の考慮点

- **パフォーマンス**: `react-native-reanimated` はUIスレッドでアニメーションを実行するため、基本的に高パフォーマンスです。しかし、パーティクルの数を過剰に増やすとパフォーマンスに影響が出る可能性があります。
- **ユーザビリティ**: アニメーションが長すぎるとユーザー体験を損なう可能性があります。1〜3秒程度に収めるのが理想的です。
- **アクセシビリティ**: 将来的に、OSの「視差効果を減らす」設定を尊重し、アニメーションを無効化するオプションを提供することが望ましいです。
- **一貫性**: アプリのデザインガイドラインに沿った色や形を選ぶことで、統一感のある体験を提供できます。
- **ハプティックフィードバック**: `expo-haptics` を使うことで、アニメーションに触覚的なフィードバックを加え、達成感をさらに高めることができます。
