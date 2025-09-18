# AnimationManager 使用例

## 概要

`AnimationManager` は、8つの異なるアニメーションを統一されたAPIで使用できるコンポーネントです。`type` プロパティを変更するだけで、簡単にアニメーションを切り替えることができます。

## 基本的な使用方法

### 1. インポート

```typescript
import { AnimationManager, type AnimationType } from "@/components/animations";
```

### 2. 基本的な使用例

```typescript
import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { AnimationManager } from '@/components/animations';

export default function ExampleScreen() {
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState<AnimationType>('particle-explosion');

  const handleAnimationFinish = () => {
    setShowAnimation(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={() => setShowAnimation(true)}
        style={{ padding: 20, backgroundColor: '#3B82F6', borderRadius: 10 }}
      >
        <Text style={{ color: 'white' }}>アニメーション開始</Text>
      </TouchableOpacity>

      <AnimationManager
        type={animationType}
        visible={showAnimation}
        onAnimationFinish={handleAnimationFinish}
      />
    </View>
  );
}
```

## 各アニメーションタイプの使用例

### 1. パーティクル爆発アニメーション

```typescript
<AnimationManager
  type="particle-explosion"
  visible={showAnimation}
  onAnimationFinish={() => setShowAnimation(false)}
/>
```

### 2. チェックマーク描画アニメーション

```typescript
<AnimationManager
  type="checkmark"
  visible={showCheckmark}
  onAnimationFinish={() => setShowCheckmark(false)}
/>
```

### 3. スケール+回転+フェードアニメーション

```typescript
<AnimationManager
  type="scale-rotate-fade"
  visible={showCard}
  onAnimationFinish={() => setShowCard(false)}
>
  <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
    <Text>アニメーション付きカード</Text>
  </View>
</AnimationManager>
```

### 4. バウンス+グロー効果

```typescript
<AnimationManager
  type="bounce-glow"
  visible={showBounce}
  onAnimationFinish={() => setShowBounce(false)}
>
  <View style={{ padding: 20, backgroundColor: '#10B981', borderRadius: 10 }}>
    <Text style={{ color: 'white' }}>バウンス効果付きコンテンツ</Text>
  </View>
</AnimationManager>
```

### 5. プログレスバーアニメーション

```typescript
<AnimationManager
  type="progress-bar"
  visible={showProgress}
  onAnimationFinish={() => setShowProgress(false)}
/>
```

### 6. 3D回転カードアニメーション

```typescript
<AnimationManager
  type="flip-card"
  visible={showFlip}
  onAnimationFinish={() => setShowFlip(false)}
  frontContent={
    <View style={{ padding: 20, backgroundColor: '#3B82F6', borderRadius: 10 }}>
      <Text style={{ color: 'white' }}>フロント面</Text>
    </View>
  }
  backContent={
    <View style={{ padding: 20, backgroundColor: '#10B981', borderRadius: 10 }}>
      <Text style={{ color: 'white' }}>バック面</Text>
    </View>
  }
/>
```

### 7. 波紋効果アニメーション

```typescript
<AnimationManager
  type="ripple"
  visible={showRipple}
  onAnimationFinish={() => setShowRipple(false)}
/>
```

### 8. 花火アニメーション

```typescript
<AnimationManager
  type="fireworks"
  visible={showFireworks}
  onAnimationFinish={() => setShowFireworks(false)}
/>
```

## タスク完了画面での実装例

```typescript
// app/(tabs)/index.tsx
import React, { useState } from 'react';
import { AnimationManager, type AnimationType } from '@/components/animations';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const [animationType, setAnimationType] = useState<AnimationType>('particle-explosion');

  const handleComplete = async () => {
    if (!task) return;
    try {
      await db
        .update(taskTable)
        .set({ isCompleted: true, updatedAt: new Date().toISOString() })
        .where(eq(taskTable.id, task.id));

      // アニメーション開始
      setShowCompletionAnimation(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    } catch (error) {
      console.error("UPDATE_TASK_FAILED", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 既存のUI */}
      {task && task.isCompleted ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 48, marginBottom: 20 }}>🎉</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
            おめでとうございます！
          </Text>
          <Text style={{ color: '#666' }}>素晴らしい一日でした</Text>

          {/* アニメーション */}
          <AnimationManager
            type={animationType}
            visible={showCompletionAnimation}
            onAnimationFinish={() => setShowCompletionAnimation(false)}
          />
        </View>
      ) : (
        // タスク表示UI
        <TouchableOpacity onPress={handleComplete}>
          <Text>タスク完了</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
```

## アニメーションタイプの動的切り替え

```typescript
const animationTypes: AnimationType[] = [
  'particle-explosion',
  'checkmark',
  'bounce-glow',
  'fireworks'
];

const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);

const switchAnimation = () => {
  setCurrentAnimationIndex((prev) => (prev + 1) % animationTypes.length);
};

<AnimationManager
  type={animationTypes[currentAnimationIndex]}
  visible={showAnimation}
  onAnimationFinish={() => setShowAnimation(false)}
/>
```

## 注意事項

1. **パフォーマンス**: パーティクル系のアニメーション（`particle-explosion`, `fireworks`）は、パーティクル数が多いとパフォーマンスに影響する可能性があります。

2. **children プロパティ**: `scale-rotate-fade` と `bounce-glow` は `children` プロパティが必要です。

3. **flip-card の特別なプロパティ**: `flip-card` は `frontContent` と `backContent` プロパティが必要です。

4. **アニメーション完了**: すべてのアニメーションは `onAnimationFinish` コールバックで完了を通知します。Stateをリセットするために使用してください。

5. **pointerEvents**: アニメーション中は `pointerEvents="none"` が設定されているため、ユーザーの操作を妨げません。
