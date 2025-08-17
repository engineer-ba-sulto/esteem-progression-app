### チケット: P1-001 統計（継続/最高継続/合計）の動的算出

#### 背景 / 目的

- **背景**: 現在の `app/(tabs)/recond.tsx` は統計がスタブデータ（固定値）で、DBの実データに基づいた動的な統計表示ができない。
- **目的**: DBの `taskTable` から連続日数・最高継続・合計を動的に計算し、`useLiveQuery` によりDB変更が即座に統計に反映される体験を提供する。

#### スコープ（このチケットでやること）

- `app/(tabs)/recond.tsx` の統計部分を動的化
- DBの `taskTable` から以下の統計を動的に計算:
  - **現在の連続日数**: 今日から過去に向かって連続で `isCompleted=true` の日数をカウント
  - **最高連続日数**: 過去の全期間で最も長い連続達成日数
  - **合計達成数**: `isCompleted=true` のタスク総数
- `StatCard` コンポーネントを使用して統計を表示
- `useLiveQuery` によりDB変更が即座に統計に反映される
- 統計計算のパフォーマンス最適化（メモ化等）

#### やらないこと（Out of Scope）

- 実績ロジックの動的化（P1-002で対応）
- ファイル名の修正（P1-003で対応）
- 通知・バックアップ・言語切替等の設定機能の実装
- エンプティステートの最適化

#### 受入条件（Acceptance Criteria）

- アプリ起動時、DBの実データに基づく統計が表示される
- タスク完了/未完了の変更が行われた場合、統計は再読み込みなしで即時に更新される（`useLiveQuery`）
- 連続日数の計算は日付の欠損・重複にも耐性がある
- 最高連続日数は過去の全期間を考慮して正確に算出される
- 統計計算のパフォーマンスが良好（大量データでも遅延しない）
- DBエラー発生時は `console.error` で原因が追跡できる

#### 影響/変更ファイル

- **変更**: `app/(tabs)/recond.tsx`（統計部分の動的化）
- **参照**: `db/client.ts`, `db/schema.ts`, `components/stat-card.tsx`, `utils/date.ts`

#### 依存関係 / ブロッカー

- **依存**: P0-001 DBクライアントの単一インスタンス化（済）
- **依存**: P0-002 ホームDB化（基本的なINSERT/UPDATE動作の確認が前提）
- **依存**: P0-004 カレンダーのDB化（同一データモデルを参照するため整合が取れていること）

#### 実装メモ（参考）

##### 連続日数の計算例:

```ts
// 現在の連続日数を計算
const calculateCurrentStreak = (tasks: Task[]): number => {
  const today = getTodayISODate();
  let streak = 0;
  let currentDate = today;

  while (true) {
    const task = tasks.find((t) => t.date === currentDate && t.isCompleted);
    if (task) {
      streak++;
      currentDate = subtractDaysFromDate(currentDate, 1);
    } else {
      break;
    }
  }

  return streak;
};
```

##### 最高連続日数の計算例:

```ts
// 最高連続日数を計算
const calculateBestStreak = (tasks: Task[]): number => {
  const completedTasks = tasks.filter((t) => t.isCompleted);
  let bestStreak = 0;
  let currentStreak = 0;

  // 日付順にソート
  const sortedTasks = completedTasks.sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  for (let i = 0; i < sortedTasks.length; i++) {
    if (
      i === 0 ||
      isConsecutiveDay(sortedTasks[i - 1].date, sortedTasks[i].date)
    ) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }
    bestStreak = Math.max(bestStreak, currentStreak);
  }

  return bestStreak;
};
```

##### Live Query の使用例:

```ts
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db, taskTable } from "@/db/client";
import { useMemo } from "react";

const { data: tasks } = useLiveQuery(db.select().from(taskTable));

// 統計の計算（メモ化でパフォーマンス最適化）
const currentStreak = useMemo(
  () => calculateCurrentStreak(tasks || []),
  [tasks]
);

const bestStreak = useMemo(() => calculateBestStreak(tasks || []), [tasks]);

const totalCompleted = useMemo(
  () => tasks?.filter((t) => t.isCompleted).length || 0,
  [tasks]
);
```

##### StatCard の使用例:

```ts
<View className="flex flex-row gap-4">
  <StatCard
    value={currentStreak.toString()}
    unit={t("records.streakDays")}
    label={t("records.currentStreak")}
    color="text-yellow-500"
  />
  <StatCard
    value={bestStreak.toString()}
    unit={t("records.streakDays")}
    label={t("records.bestStreak")}
    color="text-blue-500"
  />
  <StatCard
    value={totalCompleted.toString()}
    unit={t("records.recordsCount")}
    label={t("records.totalRecords")}
    color="text-green-500"
  />
</View>
```

#### リスク / 留意点

- 大量のタスクデータがある場合の統計計算負荷（必要に応じてメモ化や軽量化）
- 日付の欠損がある場合の連続日数計算の正確性
- タイムゾーンの考慮（日本時間での日付判定）
- `useLiveQuery` の購読解除/再購読によるメモリリーク回避

#### 見積り

- 統計算出ロジック実装: 0.5日
- Live Query連携・UI表示: 0.5日
- パフォーマンス最適化・動作確認: 0.5日
- **合計: 1.5日**
