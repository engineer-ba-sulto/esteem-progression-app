### チケット: P1-003 ファイル名の修正（recond.tsx → record.tsx）

#### 背景 / 目的

- **背景**: 現在の `app/(tabs)/recond.tsx` はファイル名が誤字（`recond` は `record` の誤り）で、適切な命名規則に従っていない。
- **目的**: ファイル名を `recond.tsx` → `record.tsx` に修正し、タブナビゲーションの参照も更新して、適切な命名規則に統一する。

#### スコープ（このチケットでやること）

- `app/(tabs)/recond.tsx` → `record.tsx` にリネーム
- `app/(tabs)/_layout.tsx` のタブ参照を更新
- 関連するインポート文の修正
- ビルドエラーの確認と修正
- タブナビゲーションの動作確認

#### やらないこと（Out of Scope）

- 統計の動的算出（P1-001で対応）
- 実績ロジックの動的化（P1-002で対応）
- ファイル内容の機能追加・変更
- UI/UXの改善
- 通知・バックアップ・言語切替等の設定機能の実装

#### 受入条件（Acceptance Criteria）

- `recond.tsx` → `record.tsx` へのリネームが完了
- タブナビゲーションが正常に動作する
- ビルドエラーが発生しない
- アプリの起動・動作に問題がない
- ファイル名が適切な命名規則に従っている

#### 影響/変更ファイル

- **変更**: `app/(tabs)/recond.tsx` → `record.tsx`（リネーム）
- **変更**: `app/(tabs)/_layout.tsx`（タブ参照の更新）
- **確認**: 関連するインポート文の修正

#### 依存関係 / ブロッカー

- **依存**: P0-001 DBクライアントの単一インスタンス化（済）
- **依存**: P0-002 ホームDB化（基本的な動作確認が前提）
- **依存**: P0-004 カレンダーのDB化（同一データモデルを参照するため整合が取れていること）

#### 実装メモ（参考）

##### ファイルリネームの手順:
```bash
# 1. ファイルのリネーム
mv app/\(tabs\)/recond.tsx app/\(tabs\)/record.tsx

# 2. タブレイアウトの更新
# app/(tabs)/_layout.tsx の参照を修正
```

##### タブレイアウトの更新例:
```ts
// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="record" // recond → record に修正
        options={{
          title: "Record",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
    </Tabs>
  );
}
```

##### インポート文の確認:
```ts
// 他のファイルで recond.tsx をインポートしている箇所がないか確認
// 例: もし他のファイルでインポートしている場合は修正が必要
// import RecordScreen from "@/app/(tabs)/recond"; // 古い参照
// import RecordScreen from "@/app/(tabs)/record"; // 新しい参照
```

##### 動作確認の項目:
1. アプリのビルドが成功する
2. タブナビゲーションが正常に動作する
3. Record画面にアクセスできる
4. 他の画面との遷移が正常に動作する
5. アプリの起動・終了が正常に動作する

#### リスク / 留意点

- ファイルリネーム時の依存関係の漏れ
- タブナビゲーションの参照エラー
- ビルドエラーの発生
- 他のファイルからの参照がある場合の修正漏れ

#### 見積り

- ファイルリネーム・参照更新: 0.2日
- ビルド確認・動作確認: 0.3日
- **合計: 0.5日**
