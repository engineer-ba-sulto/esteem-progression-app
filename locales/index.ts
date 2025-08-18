import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import { LocaleConfig } from "react-native-calendars";

// カレンダーのロケール設定
export const initializeCalendarLocale = (locale: string) => {
  const monthNames =
    locale === "en"
      ? [
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
        ]
      : [
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
        ];

  const monthNamesShort =
    locale === "en"
      ? [
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
        ]
      : [
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
        ];

  const dayNames =
    locale === "en"
      ? [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ]
      : ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];

  const dayNamesShort =
    locale === "en"
      ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      : ["日", "月", "火", "水", "木", "金", "土"];

  LocaleConfig.locales[locale] = {
    monthNames,
    monthNamesShort,
    dayNames,
    dayNamesShort,
    today: locale === "en" ? "Today" : "今日",
  };

  LocaleConfig.defaultLocale = locale;
  // console.log(`カレンダーのロケールが初期化されました: ${locale}`);
};

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
    update: "更新",
    error: "エラー",
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
    resetDemo: "完了をリセット",
  },
  profile: {
    name: "田中 太郎",
    email: "taro.tanaka@example.com",
  },
  records: {
    title: "記録",
    description: "あなたの進歩を記録",
    unlocked: "解除済み",
    locked: "ロック中",
    currentStreak: "現在の継続日数",
    bestStreak: "最高継続記録",
    totalRecords: "合計達成数",
    monthlyCalendar: "月間カレンダー",
    streakDays: "日",
    recordsCount: "個",
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
    policy: "ポリシー",
    backup: "バックアップ",
    subscription: "サブスクリプション",
    deleteData: "データを削除",
    dataDeletionTitle: "データ削除の確認",
    dataDeletionMessage:
      "すべてのデータを削除しますか？この操作は取り消せません。",
    dataDeletionWarning: "⚠️ 注意：この操作は取り消せません",
    dataDeletionDetails:
      "削除されるデータ：\n• すべてのタスク履歴\n• 完了・未完了の記録\n• カスタム設定",
    dataDeletionSuccess: "データが正常に削除されました",
    dataDeletionError: "データ削除中にエラーが発生しました",
    dataDeletionConfirm: "削除を実行",
    dataDeletionCancel: "キャンセル",
    dataStats: "データ統計",
    totalTasks: "総タスク数",
    completedTasks: "完了タスク数",
    pendingTasks: "未完了タスク数",
    databaseError: "データベースエラーが発生しました",
    statsError: "統計情報の取得に失敗しました",
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
    taskDetails: "タスク詳細",
    noTaskForDate: "この日付にはタスクがありません",
    completed: "完了",
    pending: "未完了",
    contentLabel: "タスク内容",
    contentPlaceholder: "例：朝のランニング",
    summaryLabel: "メモ（任意）",
    summaryPlaceholder: "補足や目標など",
    deleteConfirmTitle: "タスクを削除",
    deleteConfirmMessage:
      "このタスクを削除しますか？この操作は取り消せません。",
    deleteError: "タスクの削除に失敗しました",
    status: {
      completed: "完了",
      pending: "未完了",
    },
    errors: {
      required: "必須です",
      maxContent: "{{count}}文字以内で入力してください",
      maxSummary: "{{count}}文字以内で入力してください",
    },
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
  backup: {
    title: "バックアップ",
    createBackup: "データをバックアップ",
    createBackupDescription: "設定とタスク履歴を安全に保存できます",
    createBackupButton: "バックアップ作成",
    restoreBackup: "バックアップから復元",
    restoreBackupDescription: "以前のデータを復元できます",
    selectFileButton: "ファイルを選択",
    lastBackup: "最終バックアップ:",
    createBackupAlert: "バックアップ作成",
    createBackupMessage: "データのバックアップを作成しますか？",
    restoreBackupAlert: "バックアップ復元",
    restoreBackupMessage:
      "バックアップファイルを選択して復元しますか？\n\n注意: 現在のデータは上書きされます",
    backupCompleted: "完了",
    backupCreatedMessage: "バックアップが正常に作成されました",
    backupRestoredMessage: "バックアップが正常に復元されました",
    notes: "注意事項",
    notesDescription:
      "• バックアップには設定とタスク履歴が含まれます\n• 復元時は現在のデータが上書きされます\n• 定期的なバックアップを推奨します",
  },
  policy: {
    title: "ポリシー",
    privacyPolicy: "プライバシーポリシー",
    termsOfService: "利用規約",
    businessRegistration: "特定商取引法などに基づく表示",
    privacyProtection: "プライバシーの保護",
    privacyDescription:
      "私たちはあなたのプライバシーを大切にしています。収集されたデータは暗号化され、安全に保管されます。詳細についてはプライバシーポリシーをご確認ください。",
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
    update: "Update",
    error: "Error",
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
    resetDemo: "Reset Completed",
  },
  profile: {
    name: "Taro Tanaka",
    email: "taro.tanaka@example.com",
  },
  records: {
    title: "Records",
    description: "Track your progress",
    unlocked: "Unlocked",
    locked: "Locked",
    currentStreak: "Current Streak",
    bestStreak: "Best Streak",
    totalRecords: "Total",
    monthlyCalendar: "Monthly Calendar",
    streakDays: "days",
    recordsCount: "",
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
    policy: "Policy",
    backup: "Backup",
    subscription: "Subscription",
    deleteData: "Delete Data",
    dataDeletionTitle: "Confirm Data Deletion",
    dataDeletionMessage:
      "Are you sure you want to delete all data? This action cannot be undone.",
    dataDeletionWarning: "⚠️ Warning: This action cannot be undone",
    dataDeletionDetails:
      "Data to be deleted:\n• All task history\n• Completed/Pending records\n• Custom settings",
    dataDeletionSuccess: "Data deleted successfully",
    dataDeletionError: "Error deleting data",
    dataDeletionConfirm: "Execute Deletion",
    dataDeletionCancel: "Cancel",
    dataStats: "Data Statistics",
    totalTasks: "Total Tasks",
    completedTasks: "Completed Tasks",
    pendingTasks: "Pending Tasks",
    databaseError: "Database error occurred",
    statsError: "Failed to retrieve statistics",
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
    taskDetails: "Task Details",
    noTaskForDate: "No task for this date",
    completed: "Completed",
    pending: "Pending",
    contentLabel: "Task Content",
    contentPlaceholder: "e.g. Morning run",
    summaryLabel: "Memo (optional)",
    summaryPlaceholder: "Additional notes or goals",
    deleteConfirmTitle: "Delete Task",
    deleteConfirmMessage:
      "Are you sure you want to delete this task? This action cannot be undone.",
    deleteError: "Failed to delete task",
    status: {
      completed: "Completed",
      pending: "Pending",
    },
    errors: {
      required: "This field is required",
      maxContent: "Please enter within {{count}} characters",
      maxSummary: "Please enter within {{count}} characters",
    },
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
  backup: {
    title: "Backup",
    createBackup: "Backup Data",
    createBackupDescription: "Safely save your settings and task history",
    createBackupButton: "Create Backup",
    restoreBackup: "Restore from Backup",
    restoreBackupDescription: "Restore previous data",
    selectFileButton: "Select File",
    lastBackup: "Last Backup:",
    createBackupAlert: "Create Backup",
    createBackupMessage: "Do you want to create a backup of your data?",
    restoreBackupAlert: "Restore Backup",
    restoreBackupMessage:
      "Select a backup file to restore?\n\nNote: Current data will be overwritten",
    backupCompleted: "Completed",
    backupCreatedMessage: "Backup created successfully",
    backupRestoredMessage: "Backup restored successfully",
    notes: "Notes",
    notesDescription:
      "• Backup includes settings and task history\n• Current data will be overwritten during restore\n• Regular backups are recommended",
  },
  policy: {
    title: "Policy",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    businessRegistration: "Business Registration Information",
    privacyProtection: "Privacy Protection",
    privacyDescription:
      "We value your privacy. Collected data is encrypted and stored securely. Please check the privacy policy for details.",
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
