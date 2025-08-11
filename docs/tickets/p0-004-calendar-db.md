### チケット: P0-004 カレンダーのDB化（当月表示・マーク生成）

#### 背景 / 目的

- 背景: 現在の `components/calendar-view.tsx` は `mockTasks` に依存し、固定の `current` 日付を使用しているため、DBの実データ/更新が反映されない。
- 目的: 当月のタスクをDBから取得し、完了/未完了に応じたマークを表示。`useLiveQuery` により追加/更新が即時にカレンダーへ反映される体験を提供する。

#### スコープ（このチケットでやること）

- `components/calendar-view.tsx`
  - `mockTasks` 依存を撤廃し、`db/client` + `taskTable` を利用。
  - 当月の期間 `[monthStart, monthEnd]` を算出し、`where(gte(taskTable.date, monthStart) && lte(taskTable.date, monthEnd))` で取得。
  - `useLiveQuery` を用いてDB変更（挿入/更新/削除）が自動反映されるようにする。
  - `markedDates` を生成:
    - すべてのタスク日付にドット表示。
    - `isCompleted` が `true` の日付は緑 `#10B981`、未完了は赤 `#EF4444`。
    - 今日の日付は `selected: true` で強調表示（`selectedColor: #3B82F6`）。
  - `current` は固定値を廃止し、今日（`YYYY-MM-DD`）をベースに当月を表示。
  - 既存のロケール切替（`updateCalendarLocale`）は踏襲し、ヘッダ表示は現行ロジックを再利用。

#### やらないこと（Out of Scope）

- カレンダーから詳細画面への遷移/編集導線の実装（必要なら別チケット）。
- 月跨ぎの先読みや無限読み込み。
- 統計/実績の更新や設定系機能の変更。

#### 受入条件（Acceptance Criteria）

- アプリ起動時、当月のタスクに基づく `markedDates` が表示される。
- 完了/未完了の変更やタスク追加が行われた場合、カレンダーは再読み込みなしで即時に反映される（`useLiveQuery`）。
- 今日の日付が選択状態で強調表示される。
- DBエラー発生時は `console.error` で原因が追跡できる。
- 日付比較は `YYYY-MM-DD` で行い、タイムゾーンでズレない。

#### 影響/変更ファイル

- 変更: `components/calendar-view.tsx`
- 参照: `db/client.ts`, `db/schema.ts`, `utils/localization-context.tsx`

#### 依存関係 / ブロッカー

- 依存: P0-001 DBクライアントの単一インスタンス化（済）
- 依存: P0-002 ホームDB化（基本的なINSERT/UPDATE動作の確認が前提）
- 依存（任意）: P0-003 前日/翌日のDB取得（同一データモデルを参照するため整合が取れていること）

#### 実装メモ（参考）

- 月初/月末の算出例:

  ```ts
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];
  ```

- Drizzle ORM（SQLite）での当月取得例:

  ```ts
  import { gte, lte, and } from "drizzle-orm";
  const list = await db
    .select()
    .from(taskTable)
    .where(and(gte(taskTable.date, monthStart), lte(taskTable.date, monthEnd)));
  ```

- Live Query の導入例（要 `enableChangeListener: true`）:

  ```ts
  import { useLiveQuery } from "drizzle-orm/expo-sqlite";
  const { data: tasks } = useLiveQuery(
    db
      .select()
      .from(taskTable)
      .where(
        and(gte(taskTable.date, monthStart), lte(taskTable.date, monthEnd))
      )
  );
  ```

#### リスク / 留意点

- 当月にタスクが多い場合の描画負荷（必要に応じてメモ化や軽量化）。
- 月切替時のデータ再フェッチと `markedDates` 再生成タイミング。
- `useLiveQuery` の購読解除/再購読によるメモリリーク回避。

#### 見積り

- 0.5〜1.0日（DB取得・マーク生成・動作確認）
