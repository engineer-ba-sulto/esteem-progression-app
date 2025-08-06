import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

// 日本語の翻訳
const ja = {
  calendar: {
    monthNames: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
    monthNamesShort: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
    dayNames: [
      "日曜日",
      "月曜日",
      "火曜日",
      "水曜日",
      "木曜日",
      "金曜日",
      "土曜日",
    ],
    dayNamesShort: ["日", "月", "火", "水", "木", "金", "土"],
    today: "今日",
    selectedDate: "選択された日付",
  },
  common: {
    save: "保存",
    cancel: "キャンセル",
    delete: "削除",
    edit: "編集",
    add: "追加",
    close: "閉じる",
    confirm: "確認",
    loading: "読み込み中...",
  },
  tabs: {
    home: "ホーム",
    record: "記録",
    settings: "設定",
  },
  days: {
    yesterday: "昨日",
    today: "今日",
    tomorrow: "明日",
  },
  home: {
    readyMessage: "準備はいいですか？",
    motivationMessage:
      "さあ、{{day}}のタスクを決めて、素晴らしい一日を始めましょう。",
    setTaskButton: "{{day}}のタスクを設定",
    congratulations: "達成おめでとうございます！",
    greatDay: "素晴らしい一日でしたね。",
    resetDemo: "デモをリセット",
  },
  profile: {
    name: "田中 太郎",
    email: "taro.tanaka@example.com",
  },
  achievements: {
    title: "実績",
    description: "あなたの進歩を記録",
    unlocked: "解除済み",
    locked: "ロック中",
    currentStreak: "現在の継続日数",
    bestStreak: "最高継続記録",
    totalAchievements: "合計達成数",
    monthlyCalendar: "月間カレンダー",
    streakDays: "日",
    achievementsCount: "個",
    firstStep: "はじめの一歩：最初のタスクを完了",
    fiveDayStreak: "5日連続達成",
    perfectMonth: "パーフェクトマンス：1ヶ月継続",
    tenDayStreak: "10日連続達成",
    hundredTasks: "100タスク達成",
    weeklyMaster: "週間マスター：1週間毎日達成",
  },
  settings: {
    title: "設定",
    language: "言語",
    languageChanged: "言語が変更されました",
    currentLanguage: "現在の言語",
    notifications: "通知",
    privacy: "プライバシー",
    backup: "バックアップ",
    subscription: "サブスクリプション",
    deleteData: "データを削除",
    dataDeletionTitle: "データ削除の確認",
    dataDeletionMessage:
      "すべてのデータを削除しますか？この操作は取り消せません。",
    general: "一般",
    dataManagement: "データ管理",
    support: "サポート",
    helpAndFeedback: "ヘルプとフィードバック",
    logout: "ログアウト",
  },
  tasks: {
    title: "のタスク",
    addTask: "タスクを追加",
    editTask: "タスクを編集",
    deleteTask: "タスクを削除",
    completed: "完了",
    pending: "未完了",
  },
  subscription: {
    title: "サブスクリプション",
    premiumFeatures: "🚀 プレミアム機能",
    premiumDescription: "より快適で充実した体験をお届けします",
    selectPlan: "プランを選択",
    purchase: "購入する",
    cancel: "解約する",
    termsAndPrivacy:
      "購入することで、利用規約とプライバシーポリシーに同意したことになります。サブスクリプションはいつでもキャンセルできます。",
    popular: "おすすめ",
    benefits: {
      noAds: {
        title: "広告なしで利用",
        description: "すべての広告が削除されます",
      },
      reminders: {
        title: "リマインダー機能",
        description: "カスタマイズ可能な通知でタスク管理をサポート",
      },
      backup: {
        title: "無制限バックアップ",
        description: "データの安全なバックアップ",
      },
    },
    plans: {
      monthly: {
        title: "月額プラン",
        description: "月額でプレミアム機能を利用",
        price: "¥300",
        period: "/月",
      },
      yearly: {
        title: "年額プラン",
        description: "¥600お得！月額¥250相当",
        price: "¥3,000",
        period: "/年",
      },
    },
  },
  notifications: {
    title: "通知",
    enableNotifications: "通知を有効にする",
    enableNotificationsDescription:
      "毎日のタスク確認をリマインダーで通知します",
    notificationTime: "通知時刻",
    notificationTimeDescription: "毎日この時刻に通知が送信されます",
    notificationMessage: "通知メッセージ",
    notificationMessageDescription:
      "通知に表示されるメッセージをカスタマイズできます",
    notificationMessagePlaceholder: "通知メッセージを入力してください",
    selectTime: "通知時刻を選択",
    confirm: "確定",
    save: "保存",
    settingsSaved: "通知設定を保存しました",
  },
};

// 英語の翻訳
const en = {
  calendar: {
    monthNames: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    monthNamesShort: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    dayNames: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    today: "Today",
    selectedDate: "Selected Date",
  },
  common: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    close: "Close",
    confirm: "Confirm",
    loading: "Loading...",
  },
  tabs: {
    home: "Home",
    record: "Record",
    settings: "Settings",
  },
  days: {
    yesterday: "Yesterday",
    today: "Today",
    tomorrow: "Tomorrow",
  },
  home: {
    readyMessage: "Are you ready?",
    motivationMessage:
      "Let's set a task for {{day}} and start a wonderful day.",
    setTaskButton: "Set {{day}} Task",
    congratulations: "Congratulations on your achievement!",
    greatDay: "What a great day it was.",
    resetDemo: "Reset Demo",
  },
  profile: {
    name: "Taro Tanaka",
    email: "taro.tanaka@example.com",
  },
  achievements: {
    title: "Achievements",
    description: "Track your progress",
    unlocked: "Unlocked",
    locked: "Locked",
    currentStreak: "Current Streak",
    bestStreak: "Best Streak",
    totalAchievements: "Total",
    monthlyCalendar: "Monthly Calendar",
    streakDays: "days",
    achievementsCount: "",
    firstStep: "First Step: Complete your first task",
    fiveDayStreak: "5-Day Streak",
    perfectMonth: "Perfect Month: 1 month continuous",
    tenDayStreak: "10-Day Streak",
    hundredTasks: "100 Tasks Completed",
    weeklyMaster: "Weekly Master: 1 week daily achievement",
  },
  settings: {
    title: "Settings",
    language: "Language",
    languageChanged: "Language changed",
    currentLanguage: "Current language",
    notifications: "Notifications",
    privacy: "Privacy",
    backup: "Backup",
    subscription: "Subscription",
    deleteData: "Delete Data",
    dataDeletionTitle: "Confirm Data Deletion",
    dataDeletionMessage:
      "Are you sure you want to delete all data? This action cannot be undone.",
    general: "General",
    dataManagement: "Data Management",
    support: "Support",
    helpAndFeedback: "Help & Feedback",
    logout: "Logout",
  },
  tasks: {
    title: " Task",
    addTask: "Add Task",
    editTask: "Edit Task",
    deleteTask: "Delete Task",
    completed: "Completed",
    pending: "Pending",
  },
  subscription: {
    title: "Subscription",
    premiumFeatures: "🚀 Premium Features",
    premiumDescription: "Enjoy a more comfortable and fulfilling experience",
    selectPlan: "Select Plan",
    purchase: "Purchase",
    cancel: "Cancel",
    termsAndPrivacy:
      "By purchasing, you agree to the Terms of Service and Privacy Policy. You can cancel your subscription at any time.",
    popular: "Popular",
    benefits: {
      noAds: {
        title: "Ad-Free Experience",
        description: "All ads will be removed",
      },
      reminders: {
        title: "Reminder Feature",
        description: "Customizable notifications to support task management",
      },
      backup: {
        title: "Unlimited Backup",
        description: "Safe data backup",
      },
    },
    plans: {
      monthly: {
        title: "Monthly Plan",
        description: "Use premium features monthly",
        price: "$2.99",
        period: "/month",
      },
      yearly: {
        title: "Yearly Plan",
        description: "Save $6! Equivalent to $2.50/month",
        price: "$29.99",
        period: "/year",
      },
    },
  },
  notifications: {
    title: "Notifications",
    enableNotifications: "Enable Notifications",
    enableNotificationsDescription: "Receive daily task reminders",
    notificationTime: "Notification Time",
    notificationTimeDescription:
      "Notifications will be sent at this time every day",
    notificationMessage: "Notification Message",
    notificationMessageDescription:
      "You can customize the message displayed in notifications",
    notificationMessagePlaceholder: "Enter notification message",
    selectTime: "Select Time",
    confirm: "Confirm",
    save: "Save",
    settingsSaved: "Notification settings saved",
  },
};

// i18nインスタンスを作成
const i18n = new I18n({
  ja,
  en,
});

// デフォルトロケールを設定
i18n.defaultLocale = "ja";
i18n.locale = Localization.getLocales()[0]?.languageCode || "ja"; // 言語コードのみを取得
i18n.enableFallback = true; // フォールバックを有効化

export default i18n;
export { en, ja };
