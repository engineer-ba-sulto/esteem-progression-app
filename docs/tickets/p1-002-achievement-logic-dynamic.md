### チケット: P1-002 実績ロジックの動的化

#### 背景 / 目的

- **背景**: 現在の `constants/record.ts` は固定値（スタブ）を使用しており、DBの実データに基づいた動的な実績判定ができない。
- **目的**: 実データに基づいた実績判定ロジックを実装し、継続日数や達成数に応じて実績の達成状態を動的に判定・表示する。

#### スコープ（このチケットでやること）

- `constants/record.ts` のスタブを撤廃
- 実データに基づいた実績判定ロジックを実装:
  - **初回達成**: 初回タスク完了時
  - **5日連続達成**: 連続5日間のタスク完了
  - **10日連続達成**: 連続10日間のタスク完了
  - **月間完璧**: 1ヶ月間毎日タスク完了
  - **100タスク達成**: 合計100回のタスク完了
  - **週間マスター**: 1週間連続でタスク完了
- 実績の達成状態を動的に判定し表示
- `AchievementCard` コンポーネントとの連携
- `useLiveQuery` によりDB変更が即座に実績に反映される

#### やらないこと（Out of Scope）

- 統計の動的算出（P1-001で対応）
- ファイル名の修正（P1-003で対応）
- 新しい実績の追加
- 実績のUI/UX改善
- 通知・バックアップ・言語切替等の設定機能の実装

#### 受入条件（Acceptance Criteria）

- 実績の達成状態が実データに基づいて動的に判定される
- 例: 5日連続達成で「5日連続達成」が自動で解除済みになる
- 新規達成時に実績が即座に更新される（`useLiveQuery`）
- 実績の解除条件が明確で一貫性がある
- 日付の欠損・重複にも耐性がある判定ロジック
- DBエラー発生時は `console.error` で原因が追跡できる

#### 影響/変更ファイル

- **変更**: `constants/record.ts`（実績の動的判定ロジック）
- **変更**: `app/(tabs)/recond.tsx`（実績表示部分の動的化）
- **参照**: `db/client.ts`, `db/schema.ts`, `components/achievement-card.tsx`, `utils/date.ts`

#### 依存関係 / ブロッカー

- **依存**: P0-001 DBクライアントの単一インスタンス化（済）
- **依存**: P0-002 ホームDB化（基本的なINSERT/UPDATE動作の確認が前提）
- **依存**: P1-001 統計の動的算出（統計計算ロジックの再利用）

#### 実装メモ（参考）

##### 実績判定の例:

```ts
// 実績の動的判定
const checkAchievements = (tasks: Task[]): Record<string, boolean> => {
  const completedTasks = tasks.filter((t) => t.isCompleted);
  const currentStreak = calculateCurrentStreak(tasks);
  const totalCompleted = completedTasks.length;

  return {
    "first-step": completedTasks.length > 0,
    "five-day-streak": currentStreak >= 5,
    "ten-day-streak": currentStreak >= 10,
    "perfect-month": checkPerfectMonth(tasks),
    "hundred-tasks": totalCompleted >= 100,
    "weekly-master": checkWeeklyMaster(tasks),
  };
};
```

##### 月間完璧の判定例:

```ts
// 月間完璧の判定
const checkPerfectMonth = (tasks: Task[]): boolean => {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const monthStartStr = getJapaneseISODate(monthStart);
  const monthEndStr = getJapaneseISODate(monthEnd);

  const monthTasks = tasks.filter(
    (t) => t.date >= monthStartStr && t.date <= monthEndStr && t.isCompleted
  );

  // 月の日数を計算
  const daysInMonth = monthEnd.getDate();

  return monthTasks.length === daysInMonth;
};
```

##### 週間マスターの判定例:

```ts
// 週間マスターの判定（過去7日間）
const checkWeeklyMaster = (tasks: Task[]): boolean => {
  const today = getTodayISODate();
  const weekAgo = subtractDaysFromDate(today, 6);

  const weekTasks = tasks.filter(
    (t) => t.date >= weekAgo && t.date <= today && t.isCompleted
  );

  // 7日間連続でタスク完了しているかチェック
  const completedDates = weekTasks.map((t) => t.date);
  const expectedDates = [];

  for (let i = 0; i < 7; i++) {
    expectedDates.push(subtractDaysFromDate(today, 6 - i));
  }

  return expectedDates.every((date) => completedDates.includes(date));
};
```

##### 動的実績の使用例:

```ts
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db, taskTable } from "@/db/client";
import { useMemo } from "react";

const { data: tasks } = useLiveQuery(db.select().from(taskTable));

// 実績の動的判定（メモ化でパフォーマンス最適化）
const achievements = useMemo(() => checkAchievements(tasks || []), [tasks]);

// 実績データの生成
const records = useMemo(() => {
  const { t } = useLocalization();
  return [
    {
      id: "first-step",
      icon: "🚀",
      title: t("records.firstStep"),
      achieved: achievements["first-step"],
    },
    {
      id: "five-day-streak",
      icon: "🔥",
      title: t("records.fiveDayStreak"),
      achieved: achievements["five-day-streak"],
    },
    // ... 他の実績
  ];
}, [achievements]);
```

##### AchievementCard の使用例:

```ts
<View>
  {records.map((record) => (
    <AchievementCard
      key={record.id}
      icon={record.icon}
      title={record.title}
      achieved={record.achieved}
    />
  ))}
</View>
```

#### リスク / 留意点

- 大量のタスクデータがある場合の実績判定負荷（必要に応じてメモ化や軽量化）
- 日付の欠損がある場合の連続日数計算の正確性
- タイムゾーンの考慮（日本時間での日付判定）
- 実績判定ロジックの複雑性（条件の明確化が必要）

#### 見積り

- 実績判定ロジック実装: 0.5日
- Live Query連携・UI表示: 0.5日
- パフォーマンス最適化・動作確認: 0.5日
- **合計: 1.5日**
