# RevenueCat プロダクト設定ガイド

## 概要

このドキュメントは、チケット T5-2-3 の要件に従って、App Store Connect、Google Play Console、RevenueCat でのプロダクト設定手順を説明します。

## 1. App Store Connect での設定

### 1.1 サブスクリプショングループの作成

1. [App Store Connect](https://appstoreconnect.apple.com/) にサインイン
2. 対象アプリ「no-smoking-app」を選択
3. 「App 内課金」セクションに移動
4. 「サブスクリプション」タブを選択
5. 「+」ボタンをクリックして「サブスクリプショングループを作成」を選択

#### プレミアムサブスクリプショングループ

- **グループ名**: プレミアムサブスクリプショングループ
- **参照名**: プレミアムサブスクリプショングループ
- **説明**: プレミアム機能へのアクセスを提供するサブスクリプションプラン

### 1.2 サブスクリプションの作成

作成したサブスクリプショングループ内に、各サブスクリプションを作成します：

#### 週額サブスクリプション

1. サブスクリプショングループ内で「+」ボタンをクリック
2. 「サブスクリプションを作成」を選択

- **参照名**: 週額プレミアムサブスクリプション
- **プロダクト ID**: `com.engineerbasulto.nosmokingapp.weekly`
- **サブスクリプション期間**: 1 週間
- **価格**: 設定に応じて決定

#### 月額サブスクリプション

1. サブスクリプショングループ内で「+」ボタンをクリック
2. 「サブスクリプションを作成」を選択

- **参照名**: 月額プレミアムサブスクリプション
- **プロダクト ID**: `com.engineerbasulto.nosmokingapp.monthly`
- **サブスクリプション期間**: 1 ヶ月
- **価格**: 設定に応じて決定

#### 年額サブスクリプション

1. 同じグループ内で「+」ボタンをクリック
2. 「サブスクリプションを作成」を選択

- **参照名**: 年額プレミアムサブスクリプション
- **プロダクト ID**: `com.engineerbasulto.nosmokingapp.yearly`
- **サブスクリプション期間**: 1 年
- **価格**: 設定に応じて決定

#### トライアル付き年額サブスクリプション

1. 同じグループ内で「+」ボタンをクリック
2. 「サブスクリプションを作成」を選択

- **参照名**: 年額プレミアムサブスクリプション（トライアル付き）
- **プロダクト ID**: `com.engineerbasulto.nosmokingapp.yearly_trial`
- **サブスクリプション期間**: 1 年
- **無料トライアル期間**: 3 日間
- **価格**: 設定に応じて決定

## 2. Google Play Console での設定

### 2.1 サブスクリプションの設定

1. [Google Play Console](https://play.google.com/console/) にサインイン
2. 対象アプリ「no-smoking-app」を選択
3. 「商品」→「サブスクリプション」セクションに移動
4. 「サブスクリプションを作成」をクリック

#### 週額サブスクリプション

- **商品名**: 週額プレミアムサブスクリプション
- **商品 ID**: `com.engineerbasulto.nosmokingapp.weekly`
- **請求期間**: 1 週間
- **価格**: 設定に応じて決定

#### 月額サブスクリプション

- **商品名**: 月額プレミアムサブスクリプション
- **商品 ID**: `com.engineerbasulto.nosmokingapp.monthly`
- **請求期間**: 1 ヶ月
- **価格**: 設定に応じて決定

#### 年額サブスクリプション

- **商品名**: 年額プレミアムサブスクリプション
- **商品 ID**: `com.engineerbasulto.nosmokingapp.yearly`
- **請求期間**: 1 年
- **価格**: 設定に応じて決定

#### トライアル付き年額サブスクリプション

- **商品名**: 年額プレミアムサブスクリプション（トライアル付き）
- **商品 ID**: `com.engineerbasulto.nosmokingapp.yearly_trial`
- **請求期間**: 1 年
- **無料トライアル期間**: 3 日間
- **価格**: 設定に応じて決定

## 3. RevenueCat ダッシュボードでの設定

### 3.1 プロダクトの同期

1. [RevenueCat ダッシュボード](https://app.revenuecat.com/) にサインイン
2. 対象プロジェクトを選択
3. 「Products」メニューに移動
4. 「Add Product」をクリックして各プロダクトを追加

#### 追加するプロダクト

- `com.engineerbasulto.nosmokingapp.weekly`
- `com.engineerbasulto.nosmokingapp.monthly`
- `com.engineerbasulto.nosmokingapp.yearly`
- `com.engineerbasulto.nosmokingapp.yearly_trial`

### 3.2 Entitlements の設定

1. 「Entitlements」メニューに移動
2. 「Add Entitlement」をクリック
3. 以下の設定で Entitlement を作成

#### Premium Access Entitlement

- **Entitlement ID**: `premium`
- **Display Name**: Premium Access
- **Description**: プレミアム機能へのアクセス権

### 3.3 Offerings と Packages の設定

1. 「Offerings」メニューに移動
2. 「Add Offering」をクリック
3. 以下の設定で Offering を作成

#### Default Offering

- **Offering ID**: `default`
- **Display Name**: Premium Plans
- **Description**: 利用可能なプレミアムプラン

#### Packages の追加

1. 作成した Offering を選択
2. 「Add Package」をクリックして各パッケージを追加

##### 週額パッケージ

- **Package ID**: `weekly`
- **Display Name**: Weekly
- **Description**: 週単位でのプレミアム機能アクセス
- **Product**: `com.engineerbasulto.nosmokingapp.weekly`
- **Entitlement**: `premium`

##### 月額パッケージ

- **Package ID**: `monthly`
- **Display Name**: Monthly
- **Description**: 月単位でのプレミアム機能アクセス
- **Product**: `com.engineerbasulto.nosmokingapp.monthly`
- **Entitlement**: `premium`

##### 年額パッケージ

- **Package ID**: `annual`
- **Display Name**: Annual
- **Description**: 年単位でのプレミアム機能アクセス（お得なプラン）
- **Product**: `com.engineerbasulto.nosmokingapp.yearly`
- **Entitlement**: `premium`

##### トライアルパッケージ

- **Package ID**: `trial`
- **Display Name**: Trial
- **Description**: 3 日間無料トライアル付き年額プラン
- **Product**: `com.engineerbasulto.nosmokingapp.yearly_trial`
- **Entitlement**: `premium`

## 4. 設定完了後の確認事項

### 4.1 RevenueCat ダッシュボードでの確認

- [ ] 全てのプロダクトが正しく表示されている
- [ ] Entitlement がプロダクトに紐づいている
- [ ] Offering と Package が正しく構成されている

### 4.2 プロダクト ID の統一性確認

- [ ] App Store Connect と Google Play Console のプロダクト ID が一致している
- [ ] RevenueCat でのマッピングが正しく設定されている

## 5. 次のステップ

設定完了後は、以下のチケットに進みます：

- T5-3-1: 購入情報 Context の作成

## 注意事項

- プロダクト ID はプラットフォーム間で統一するか、RevenueCat 側で正しくマッピングする必要があります
- 価格設定は各プラットフォームのガイドラインに従って設定してください
- サブスクリプションの詳細設定（無料期間、紹介価格など）は必要に応じて追加してください
