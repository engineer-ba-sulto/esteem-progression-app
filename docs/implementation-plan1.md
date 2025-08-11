簡潔にMVP最短リリース向けに「タスク機能」に絞った実装計画を選定します。対象は `docs/implementation-plan.md` のタスクから必要最小限のみ。

### 目的

- DBに保存された「今日のタスク」の閲覧・追加・完了ができること
- アプリ再起動後もタスク状態が保持されること

### MVPでやること（厳選）

- 【必須】DBクライアントの単一インスタンス化
  - 追加: `db/client.ts`（計画の提案コード断片をそのまま採用）
  - 効果: 以降のDB操作を全てここに集約し、`useLiveQuery` が使える状態に
- 【必須】ホーム画面のDB化（今日のタスク取得/完了/追加）
  - 変更: `app/(tabs)/index.tsx`
    - `mockTasks` 依存を撤廃
    - `useLiveQuery` + `db.query.tasks` で「今日のタスク」取得
    - 完了トグルで `UPDATE tasks SET isCompleted=1, updatedAt=now()`
  - 変更: `components/task-form-dialog.tsx`
    - 保存時に `db.insert(schema.tasks)` を実行
- 【現状維持（延期）】カレンダーのDB化
  - 変更しない: `components/calendar-view.tsx`（v0.2へ）
- 【現状維持（延期）】統計/実績、通知、バックアップ、言語切替、レコード画面のリネーム
  - 変更しない: `app/(tabs)/recond.tsx` ほか（v0.2以降へ）

### 受入条件（MVP）

- アプリ起動時に「今日のタスク」がDBから表示される（空なら空表示）
- タスク追加後、即ホームに反映（画面リロード不要）
- 完了操作後、UIに即反映（再起動後も保持）
- 異常時（DBエラー）はコンソールで原因が追える

### 影響ファイル

- 追加: `db/client.ts`
- 変更: `app/(tabs)/index.tsx`
- 変更: `components/task-form-dialog.tsx`
- 変更なし: `app/_layout.tsx`（既存のマイグレーション/`addDummyData` 利用）
- 変更なし（延期）: `components/calendar-view.tsx`, `app/(tabs)/recond.tsx`, `constants/record.ts`, `app/settings/*`

### 実装メモ（最短導線）

- `db/client.ts` はドキュメントの提案コードを採用
- `index.tsx` では `useLiveQuery` で `currentDate` のタスク1件/複数件を取得
- 完了ボタンで `UPDATE`、ダイアログ保存で `INSERT`
- 既存UIを最大限流用（UI改修は最小）

### 工数目安

- `db/client.ts`: 0.5日
- ホームDB化（取得/完了/追加）: 1.0日
- 動作確認・微修正: 0.5日
- 合計: 約2.0日

### 次リリースに回す（v0.2候補）

- カレンダーのDB化と当月表示
- 統計/実績の動的化、`recond.tsx` → `record.tsx` リネーム
- 通知/バックアップ/言語切替/データ削除

ステータス: 実装計画をMVP最小構成に絞り込み、対象ファイルと受入条件を確定しました。このまま実装に着手できます。

- 追加: `db/client.ts`
- 変更: `app/(tabs)/index.tsx`, `components/task-form-dialog.tsx`
- 延期: カレンダー/統計/設定系（v0.2以降）
