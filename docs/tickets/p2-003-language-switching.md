### チケット: P2-003 言語切替UI

#### 背景 / 目的

- **背景**: 現在のアプリには言語切替機能がなく、ユーザーが好みの言語でアプリを使用できない。
- **目的**: 設定画面に言語選択UIを追加し、`useLocalization().changeLocale` を呼び出して `updateCalendarLocale` を適用し、即座にアプリ全体の言語を切り替えられるようにする。

#### スコープ（このチケットでやること）

- 言語切替UIの実装
  - 設定画面に言語選択セクションを追加
  - 利用可能な言語の一覧表示（日本語、英語等）
  - 現在選択中の言語のハイライト表示
  - 言語選択時の即座な反映
- 言語切替機能の実装
  - `useLocalization().changeLocale` の呼び出し
  - `updateCalendarLocale` の適用
  - アプリ全体への言語変更の反映
- 多言語対応の確認
  - タブラベルの言語切替
  - 画面内文言の言語切替
  - カレンダー表記の言語切替
  - 設定画面内の文言切替

#### やらないこと（Out of Scope）

- 通知設定の永続化（P2-001で対応）
- バックアップ/復元機能（P2-002で対応）
- データ全削除機能（P2-004で対応）
- 新しい言語の追加（既存の多言語対応のみ）
- 言語設定の永続化（既存の `useLocalization` に依存）

#### 受入条件（Acceptance Criteria）

- 設定画面に言語選択セクションが表示される
- 利用可能な言語が一覧で表示される
- 現在選択中の言語がハイライトされる
- 言語選択時に即座にアプリ全体の言語が切り替わる
- タブラベルが選択した言語で表示される
- 画面内の文言が選択した言語で表示される
- カレンダーの表記が選択した言語で表示される
- 設定画面内の文言も選択した言語で表示される
- 言語切替後、アプリの再起動なしで変更が反映される

#### 影響/変更ファイル

- **変更**: `app/(tabs)/settings.tsx`（言語選択UI追加）
- **参照**: `utils/localization-context.tsx`（`useLocalization` フック）
- **参照**: `components/calendar-view.tsx`（`updateCalendarLocale` 関数）

#### 依存関係 / ブロッカー

- **依存**: P0-001 DBクライアントの単一インスタンス化（済）
- **依存**: P0-002 ホームDB化（基本的なアプリ動作の確認が前提）
- **依存**: P0-004 カレンダーのDB化（カレンダー表記の言語切替確認）

#### 実装メモ（参考）

##### 利用可能な言語の定義例:

```ts
// constants/languages.ts
export const SUPPORTED_LANGUAGES = [
  {
    code: 'ja',
    name: '日本語',
    nativeName: '日本語',
    flag: '🇯🇵',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'ko',
    name: '한국어',
    nativeName: '한국어',
    flag: '🇰🇷',
  },
] as const;

export type SupportedLanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];
```

##### 言語選択コンポーネントの実装例:

```ts
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalization } from '@/utils/localization-context';
import { SUPPORTED_LANGUAGES, SupportedLanguageCode } from '@/constants/languages';

const LanguageSelector = () => {
  const { locale, changeLocale } = useLocalization();
  const [isChanging, setIsChanging] = useState(false);

  const handleLanguageChange = async (languageCode: SupportedLanguageCode) => {
    if (locale === languageCode || isChanging) return;
    
    setIsChanging(true);
    try {
      await changeLocale(languageCode);
      // 成功時のフィードバック（オプション）
    } catch (error) {
      console.error('Failed to change language:', error);
      // エラー時のフィードバック（オプション）
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <View className="p-4">
      <Text className="text-lg font-semibold mb-4">
        {t('settings.language.title')}
      </Text>
      
      <View className="space-y-2">
        {SUPPORTED_LANGUAGES.map((language) => (
          <TouchableOpacity
            key={language.code}
            className={`flex-row items-center justify-between p-4 rounded-lg border ${
              locale === language.code
                ? 'bg-blue-50 border-blue-200'
                : 'bg-white border-gray-200'
            }`}
            onPress={() => handleLanguageChange(language.code)}
            disabled={isChanging}
          >
            <View className="flex-row items-center space-x-3">
              <Text className="text-2xl">{language.flag}</Text>
              <View>
                <Text className="font-medium">{language.nativeName}</Text>
                {language.name !== language.nativeName && (
                  <Text className="text-sm text-gray-500">{language.name}</Text>
                )}
              </View>
            </View>
            
            {locale === language.code && (
              <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
            )}
            
            {isChanging && locale === language.code && (
              <ActivityIndicator color="#3b82f6" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
```

##### 設定画面への統合例:

```ts
// app/(tabs)/settings.tsx
import { ScrollView, View } from 'react-native';
import { LanguageSelector } from '@/components/language-selector';
import { SettingCard } from '@/components/setting-card';

const SettingsScreen = () => {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4 space-y-4">
        {/* 既存の設定カード */}
        <SettingCard
          title={t('settings.notifications.title')}
          subtitle={t('settings.notifications.subtitle')}
          icon="notifications"
          onPress={() => router.push('/settings/notifications')}
        />
        
        <SettingCard
          title={t('settings.backup.title')}
          subtitle={t('settings.backup.subtitle')}
          icon="cloud-upload"
          onPress={() => router.push('/settings/backup')}
        />
        
        {/* 言語選択セクション */}
        <View className="bg-white rounded-lg shadow-sm">
          <LanguageSelector />
        </View>
        
        {/* その他の設定 */}
      </View>
    </ScrollView>
  );
};
```

##### カレンダーの言語切替対応例:

```ts
// components/calendar-view.tsx
import { useEffect } from 'react';
import { Calendar } from 'react-native-calendars';
import { useLocalization } from '@/utils/localization-context';

const CalendarView = () => {
  const { locale } = useLocalization();
  
  useEffect(() => {
    // カレンダーのロケールを更新
    updateCalendarLocale(locale);
  }, [locale]);

  return (
    <Calendar
      // 既存のprops
      theme={{
        // テーマ設定
      }}
      // ロケール設定は updateCalendarLocale で管理
    />
  );
};
```

##### 多言語対応の確認項目:

```ts
// 確認すべき言語切替箇所
const languageSwitchChecklist = [
  // タブラベル
  'tabs.home',
  'tabs.record', 
  'tabs.settings',
  
  // ホーム画面
  'home.title',
  'home.addTask',
  'home.complete',
  
  // 記録画面
  'records.title',
  'records.currentStreak',
  'records.bestStreak',
  'records.totalRecords',
  
  // 設定画面
  'settings.title',
  'settings.language.title',
  'settings.notifications.title',
  'settings.backup.title',
  
  // カレンダー
  'calendar.monthNames',
  'calendar.dayNames',
  'calendar.today',
];
```

#### リスク / 留意点

- 言語切替時のアプリ状態の保持
- カレンダーコンポーネントの言語切替対応確認
- 動的コンテンツ（DBから取得したデータ）の多言語対応
- 言語切替時のパフォーマンス影響
- 未翻訳文字列のフォールバック処理

#### 見積り

- 言語選択UI実装: 0.5日
- 言語切替機能実装: 0.5日
- 多言語対応確認・調整: 0.5日
- UI統合・動作確認: 0.5日
- **合計: 2日**
