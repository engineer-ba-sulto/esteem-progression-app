### チケット: P0-002 ホーム画面のDB化（今日のタスク取得/完了/追加）

#### 背景 / 目的

- **背景**: `app/(tabs)/index.tsx` は `mockTasks` に依存しており、アプリ再起動後に状態が保持されない。`TaskFormDialog` もDB未連携。
- **目的**: ホーム画面で「今日のタスク」をDBから取得・表示し、完了トグルや追加が即時反映される永続体験を提供する。

#### スコープ（このチケットでやること）

- `app/(tabs)/index.tsx`
  - `mockTasks` 依存を撤廃し、`db.client` を利用
  - `useLiveQuery` + `db.query.tasks.findFirst` で `currentDate` のタスク取得
  - 完了トグルで `UPDATE tasks SET isCompleted=1, updatedAt=now()`
- `components/task-form-dialog.tsx`
  - 保存アクションで `INSERT INTO tasks` 実行（`db.insert(schema.tasks).values({...})`）

#### やらないこと（Out of Scope）

- カレンダーのDB化（別チケット）
- 統計/実績の動的化、設定系機能

#### 受入条件（Acceptance Criteria）

- アプリ起動時に「今日のタスク」がDBから表示される（存在しない場合はエンプティを表示）
- タスク追加後、ホームに即時反映（手動リロード不要）
- 完了操作後、UI上で完了状態が即時反映され、アプリ再起動後も保持
- 失敗時はコンソールエラーで原因追跡可能（最低限）

#### 影響/変更ファイル

- 変更: `app/(tabs)/index.tsx`
- 変更: `components/task-form-dialog.tsx`
- 参照: `db/client.ts`（P0-001で追加済み前提）

#### 依存関係 / ブロッカー

- 依存: P0-001 DBクライアントの単一インスタンス化

#### 参考資料

- `docs/implementation-plan1.md` の「MVPでやること」> ホーム画面のDB化
- `docs/implementation-plan0.md` の「提案コード断片（参考）」

#### リスク / 留意点

- `useLiveQuery` の購読解除/メモリリークに留意
- 日付のタイムゾーン差異による `currentDate` 算出ズレに留意（`YYYY-MM-DD` 固定推奨）
- 既存UIを最大限温存し、UI変更は最小に留める

#### 見積り

- 1.5日（取得/完了/追加の統合と検証含む）
