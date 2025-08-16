### チケット: P0-001 DBクライアントの単一インスタンス化

#### 背景 / 目的

- **背景**: 現状は画面側から `openDatabaseSync` を個別に呼び出しており、`useLiveQuery` に必要な `enableChangeListener` の設定が分散しやすい。
- **目的**: `drizzle-orm + expo-sqlite` のクライアントを `db/client.ts` に集約し、以後のDB入出力を単一インスタンス経由で統一する。

#### スコープ（このチケットでやること）

- **新規追加**: `db/client.ts`
  - `openDatabaseSync(DATABASE_NAME, { enableChangeListener: true })` を使用
  - `drizzle(expo, { schema })` を初期化
  - `db` と `schema` をエクスポート
- このチケットでは参照差し替え（画面側の実装変更）は行わない。参照差し替えは P0-002 にて対応。

#### やらないこと（Out of Scope）

- 画面のDB化（取得/更新/追加）実装
- カレンダー/統計/通知/バックアップ等の改修

#### 受入条件（Acceptance Criteria）

- `db/client.ts` が存在し、`db` と `schema` をエクスポートしていること
- `openDatabaseSync` に `enableChangeListener: true` が設定されていること
- 依存箇所から `db` をインポート可能な状態でビルドが通ること
- 実装変更はファイル追加のみ（利用側の置換は未実施）

#### 影響/変更ファイル

- 追加: `db/client.ts`
- 参考として利用予定（本チケットでは変更しない）:
  - `app/(tabs)/index.tsx`
  - `components/task-form-dialog.tsx`

#### 依存関係 / ブロッカー

- なし（単独で作成可能）。ただし P0-002 は本ファイルの存在に依存。

#### 参考資料

- `docs/implementation-plan1.md` の「MVPでやること」> DBクライアントの単一インスタンス化
- `docs/implementation-plan0.md` の「提案コード断片（参考）」内 `db/client.ts` 提案

#### リスク / 留意点

- DB名は `DATABASE_NAME` を `app/_layout.tsx` から参照する前提。将来的に環境差異がある場合は定数の単一出所を検討。

#### 見積り

- 0.5日（計画準拠）
