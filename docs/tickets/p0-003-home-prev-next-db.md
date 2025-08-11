### チケット: P0-003 前日/翌日のタスク取得（ホーム3日間ウィンドウのDB連携）

#### 背景 / 目的

- 背景: P0-002 では「今日のタスク」をDBから取得・完了・追加できるようにしたが、UIでは前日/翌日へ移動できる一方で、DB取得は前日/翌日を対象としていない。
- 目的: ホーム画面で「昨日/今日/明日」の3日間ウィンドウに対して、DBからの取得・即時反映を行い、UI挙動とデータ取得を一致させる。

#### スコープ（このチケットでやること）

- `app/(tabs)/index.tsx`
  - 初期ロードを「昨日/今日/明日」の3日間に限定した取得へ変更。
    - Drizzle ORM の `inArray` を用いて `WHERE date IN (yesterday, today, tomorrow)` を実装。
  - `getTaskForDate(date)` は「メモリ上の3日分配列から当該日付の1件を引く」シンプルなロジックへ。
  - 完了トグル後はUIへ即時反映（P0-002の方針踏襲）。
  - 必要に応じ、追加直後（ダイアログ保存）の当該日付が3日間内であればリストへ即時反映。

- `components/task-form-dialog.tsx`
  - 追加機能はP0-002のまま維持。
  - 保存後、対象日付が3日間ウィンドウに含まれる場合はホーム画面のリストへ反映されること（UI側でハンドリング）。

#### やらないこと（Out of Scope）

- 3日間を超える任意期間のフェッチや無限スクロール。
- カレンダー画面（`components/calendar-view.tsx`）のDB連携。
- 統計/実績の動的化、設定系機能の変更。

#### 受入条件（Acceptance Criteria）

- アプリ起動時に「昨日/今日/明日」の3日間に該当するタスクのみDBから取得される。
- 前日/翌日ボタンで移動した際、該当日のタスクが即時に表示される（該当なしならエンプティ状態）。
- 追加/完了の操作後、同ウィンドウ内であればホーム画面に即時反映される。
- DBエラー時は `console.error` で原因追跡可能。
- 日付は `YYYY-MM-DD` で比較し、タイムゾーン差異によるズレがない（`toISOString().split("T")[0]` の方針を踏襲）。

#### 影響/変更ファイル

- 変更: `app/(tabs)/index.tsx`
- 参照: `db/client.ts`, `db/schema.ts`, `components/task-form-dialog.tsx`

#### 依存関係 / ブロッカー

- 依存: P0-001 DBクライアント（単一インスタンス）
- 依存: P0-002 ホーム画面のDB化（今日のタスク取得/完了/追加）

#### 実装メモ（参考）

- Drizzle ORM（SQLite）での3日間取得の例:

  ```ts
  import { inArray } from "drizzle-orm";
  import { tasks } from "@/db/schema";

  const list = await db
    .select()
    .from(tasks)
    .where(inArray(tasks.date, [yesterdayStr, todayStr, tomorrowStr]));
  ```

- 完了更新の例:

  ```ts
  import { eq } from "drizzle-orm";

  await db
    .update(tasks)
    .set({ isCompleted: true, updatedAt: new Date().toISOString() })
    .where(eq(tasks.id, targetId));
  ```

#### リスク / 留意点

- タイムゾーンの差異で日付がズレないよう `YYYY-MM-DD` 形式で統一。
- `expo-sqlite` の `enableChangeListener: true` は既に設定済み。必要に応じて購読のクリーンアップに留意。
- 既存UIの変更は最小限に留める（テキスト/レイアウトの変更はしない）。

#### 見積り

- 0.5日（クエリ導入・UI反映・動作確認）
