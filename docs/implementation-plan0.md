## 実装タスク計画（esteem-progression-app）

### 目的

- モック/スタブ依存の画面をデータベース連携に置き換え、日常利用に耐える体験へ拡張する。
- 記録/統計の動的化、通知・バックアップなど運用機能の実装。

### 現状の要点

- DB: `drizzle-orm + expo-sqlite`。`tasks` テーブル定義あり（`db/schema.ts`）。
- 起動時: マイグレーション成功時に `addDummyData` 実行（`app/_layout.tsx`）。
- 画面:
  - `app/(tabs)/index.tsx` は `mockTasks` 依存（DB未連携）。
  - `components/calendar-view.tsx` も `mockTasks` 依存。
  - `app/(tabs)/recond.tsx` は統計/実績がスタブ。
- 設定: 通知/バックアップ/サブスクはUIのみのスタブ。

---

### 優先度P0（最優先）: タスク機能のDB統合

- [ ] **DBクライアントの単一インスタンス化**
  - **内容**: `db/client.ts` を新規作成し、`drizzle` と `schema` を集約。`enableChangeListener: true` で `useLiveQuery` を活用。
  - **変更**: 新規 `db/client.ts`。参照元から `openDatabaseSync` 直呼びを排除し、`db/client.ts` に統一。

- [ ] **ホーム画面のDB化（取得/完了/追加）**
  - **内容**:
    - 当日・前日・翌日のタスク取得を `db.query.tasks` + `useLiveQuery` で。
    - 「完了」ボタンで `UPDATE tasks SET isCompleted=1, updatedAt=now()`。
    - `TaskFormDialog` の保存で `INSERT` 実行。
  - **変更**: `app/(tabs)/index.tsx`, `components/task-form-dialog.tsx`
  - **受入条件**:
    - タスク追加後、即時にホームに反映。
    - 完了操作でカンファティUIに遷移し、リセットなしでもDB状態が保持。

- [ ] **カレンダーのDB化**
  - **内容**: `components/calendar-view.tsx` で全タスクをDBから取得し `markedDates` を生成。`current` は固定日付を廃止し当月を表示。
  - **変更**: `components/calendar-view.tsx`
  - **受入条件**:
    - 完了済みを緑ドット、未完了を赤ドットで表示。
    - ロケール変更でヘッダーの月表示が切替。

---

### 優先度P1（高）: 記録/統計の動的化

- [ ] **統計（継続/最高継続/合計）の算出**
  - **内容**: DBの `isCompleted` と `date` から連続日数・最高継続・合計を計算して表示。
  - **変更**: `app/(tabs)/recond.tsx`（後述のファイル名変更含む）
  - **受入条件**:
    - 実データに応じた値を表示し、日付の欠損・重複にも耐性。

- [ ] **実績ロジックの動的化**
  - **内容**: `constants/record.ts` のスタブをやめ、継続日や達成数に応じた「達成/未達」を判定。
  - **変更**: `constants/record.ts`
  - **受入条件**:
    - 例: 5連続達成で「5日連続達成」が自動で解除済みに。

- [ ] **ファイル名の修正**
  - **内容**: `recond.tsx` → `record.tsx` にリネームし、タブ参照を更新。
  - **変更**: `app/(tabs)/recond.tsx`, `app/(tabs)/_layout.tsx`

---

### 優先度P2（中）: 設定/運用機能の実装

- [ ] **通知設定の永続化 + ローカル通知**
  - **内容**:
    - 設定値を `AsyncStorage` もしくは `settings` テーブルに保存。
    - `expo-notifications` で毎日指定時刻の繰り返し通知をスケジュール/キャンセル。
  - **変更**: `app/settings/notifications.tsx`, `package.json`（依存追加の可能性）
  - **受入条件**:
    - 設定保存→アプリ再起動後も反映。通知のON/OFFと時刻変更が有効。

- [ ] **バックアップ/復元**
  - **内容**:
    - DBファイル（`DATABASE_NAME`）のエクスポート/インポートを `expo-file-system` で実装。
    - `expo-document-picker` で復元元を選択。
  - **変更**: `app/settings/backup.tsx`
  - **受入条件**:
    - バックアップ作成→復元で同一状態に戻せる。失敗時にユーザ通知。

- [ ] **言語切替UI**
  - **内容**: 設定画面に言語選択追加。`useLocalization().changeLocale` を呼び出し、`updateCalendarLocale` を適用。
  - **変更**: `app/settings/index` 相当（存在する場合）、または `app/(tabs)/settings.tsx`
  - **受入条件**:
    - 切替直後にタブラベル/画面内文言/カレンダー表記が更新。

- [ ] **データ全削除**
  - **内容**: 確認ダイアログ→ `DELETE FROM tasks` 実行。
  - **変更**: `app/(tabs)/settings.tsx` など

---

### 優先度P3（後回し）: 体験強化/運用

- [ ] **サブスク実装**
  - **内容**: `RevenueCat` または `expo-in-app-purchases` 組み込み。購入/復元/解約。`AdBanner` の非表示制御。
  - **変更**: `app/settings/subscription.tsx`, `components/adbanner.tsx`

- [ ] **エンプティステート最適化**
  - **内容**: タスク未設定日の提案/ショートカット。履歴/無限スクロール検討。

- [ ] **エラー処理/UX**
  - **内容**: DB操作失敗時のトースト、フォーム境界ケース、タイムゾーン安全な日付管理（`YYYY-MM-DD` 固定）。

- [ ] **モジュール化/テスト**
  - **内容**: `hooks/useTasks.ts`（`getTaskByDate`, `listTasks`, `createTask`, `toggleComplete`）。ユニット/E2Eの最小実装。

---

### 提案コード断片（参考）

```ts
// db/client.ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";
import { DATABASE_NAME } from "@/app/_layout";

const expo = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });
export const db = drizzle(expo, { schema });
export { schema };
```

```ts
// 取得例（ホーム）
import { db, schema } from "@/db/client";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";

const { data: task } = useLiveQuery(
  db.query.tasks.findFirst({ where: eq(schema.tasks.date, currentDate) })
);
```

```ts
// 完了トグル
await db
  .update(schema.tasks)
  .set({ isCompleted: true, updatedAt: new Date().toISOString() })
  .where(eq(schema.tasks.id, task.id));
```

```ts
// 追加（ダイアログ）
await db.insert(schema.tasks).values({
  date,
  content: values.content,
  summary: values.summary,
  isCompleted: false,
});
```

---

### 変更予定ファイル一覧

- `app/(tabs)/index.tsx`（DB化）
- `components/task-form-dialog.tsx`（INSERT）
- `components/calendar-view.tsx`（DB化・当月表示）
- `app/(tabs)/recond.tsx` → `record.tsx`（統計動的化 + 参照修正）
- `constants/record.ts`（実績の動的判定）
- `app/settings/notifications.tsx`（永続化 + `expo-notifications`）
- `app/settings/backup.tsx`（エクスポート/インポート）
- `app/(tabs)/_layout.tsx`（`record` への参照更新）
- 追加: `db/client.ts`, 追加の `hooks/useTasks.ts`（任意）

---

### オープン課題

- 通知のタイムゾーン/サマータイム対応はどうするか。
- 設定を `AsyncStorage` と `DB` のどちらに置くか（バックアップ対象範囲に依存）。
- 実績の閾値仕様（例: 継続日数のカウント定義、時刻締め切り）。

---

### マイルストーン

- M1（P0完了）: DB統合のホーム/カレンダー/追加/完了が動作
- M2（P1完了）: 記録/統計/実績が実データ連動
- M3（P2完了）: 通知/バックアップ/言語切替/データ削除
- M4（P3一部）: サブスク導入、UX強化
  追加分を末尾に追記してください。
