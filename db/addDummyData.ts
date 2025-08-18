import { db } from "@/db/client";
import { taskTable } from "@/db/schema";

export default async function addDummyData() {
  // 既存データを確認
  const existingCount = await db.select().from(taskTable);
  console.log(`既存のタスク数: ${existingCount.length}`);

  // 既存データがある場合は削除
  if (existingCount.length > 0) {
    console.log("既存データを削除してダミーデータを登録します");
    await db.delete(taskTable);
  }

  // 今日の日付を取得（2025年8月）
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // 過去の日付を計算（2025年8月）
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);
  const twoDaysAgoStr = twoDaysAgo.toISOString().split("T")[0];

  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(today.getDate() - 3);
  const threeDaysAgoStr = threeDaysAgo.toISOString().split("T")[0];

  const fourDaysAgo = new Date(today);
  fourDaysAgo.setDate(today.getDate() - 4);
  const fourDaysAgoStr = fourDaysAgo.toISOString().split("T")[0];

  const fiveDaysAgo = new Date(today);
  fiveDaysAgo.setDate(today.getDate() - 5);
  const fiveDaysAgoStr = fiveDaysAgo.toISOString().split("T")[0];

  const sixDaysAgo = new Date(today);
  sixDaysAgo.setDate(today.getDate() - 6);
  const sixDaysAgoStr = sixDaysAgo.toISOString().split("T")[0];

  console.log("ダミーデータを登録中...");
  console.log(`今日の日付: ${todayStr}`);

  await db.insert(taskTable).values([
    // 現在の連続達成（7日連続）
    {
      date: todayStr,
      content: "今日のタスクを完了する",
      isCompleted: true,
    },
    {
      date: yesterdayStr,
      content: "昨日のタスクを完了する",
      isCompleted: true,
    },
    {
      date: twoDaysAgoStr,
      content: "2日前のタスクを完了する",
      isCompleted: true,
    },
    {
      date: threeDaysAgoStr,
      content: "3日前のタスクを完了する",
      isCompleted: true,
    },
    {
      date: fourDaysAgoStr,
      content: "4日前のタスクを完了する",
      isCompleted: true,
    },
    {
      date: fiveDaysAgoStr,
      content: "5日前のタスクを完了する",
      isCompleted: true,
    },
    {
      date: sixDaysAgoStr,
      content: "6日前のタスクを完了する",
      isCompleted: true,
    },

    // 過去の連続達成（10日連続）- 2025年7月
    {
      date: "2025-07-01",
      content: "7月の目標を設定する",
      isCompleted: true,
    },
    {
      date: "2025-07-02",
      content: "運動習慣を始める",
      isCompleted: true,
    },
    {
      date: "2025-07-03",
      content: "読書を開始する",
      isCompleted: true,
    },
    {
      date: "2025-07-04",
      content: "プログラミング学習",
      isCompleted: true,
    },
    {
      date: "2025-07-05",
      content: "料理の練習",
      isCompleted: true,
    },
    {
      date: "2025-07-06",
      content: "散歩に行く",
      isCompleted: true,
    },
    {
      date: "2025-07-07",
      content: "日記を書く",
      isCompleted: true,
    },
    {
      date: "2025-07-08",
      content: "瞑想を実践する",
      isCompleted: true,
    },
    {
      date: "2025-07-09",
      content: "新しい言語を学ぶ",
      isCompleted: true,
    },
    {
      date: "2025-07-10",
      content: "絵を描く",
      isCompleted: true,
    },

    // 月間完璧テスト用（2025年8月のデータ）
    {
      date: "2025-08-01",
      content: "8月の目標を設定",
      isCompleted: true,
    },
    {
      date: "2025-08-02",
      content: "夏休みの計画を立てる",
      isCompleted: true,
    },
    {
      date: "2025-08-03",
      content: "海に行く準備",
      isCompleted: true,
    },
    {
      date: "2025-08-04",
      content: "BBQの準備",
      isCompleted: true,
    },
    {
      date: "2025-08-05",
      content: "花火大会に行く",
      isCompleted: true,
    },
    {
      date: "2025-08-06",
      content: "夏祭りに参加",
      isCompleted: true,
    },
    {
      date: "2025-08-07",
      content: "家族との時間",
      isCompleted: true,
    },
    {
      date: "2025-08-08",
      content: "友人との集まり",
      isCompleted: true,
    },
    {
      date: "2025-08-09",
      content: "趣味の時間",
      isCompleted: true,
    },
    {
      date: "2025-08-10",
      content: "自己啓発",
      isCompleted: true,
    },

    // 100タスク達成テスト用（2025年6月のデータ）
    {
      date: "2025-06-01",
      content: "6月の目標設定",
      isCompleted: true,
    },
    {
      date: "2025-06-02",
      content: "梅雨の散歩",
      isCompleted: true,
    },
    {
      date: "2025-06-03",
      content: "紫陽花を見に行く",
      isCompleted: true,
    },
    {
      date: "2025-06-04",
      content: "読書の時間",
      isCompleted: true,
    },
    {
      date: "2025-06-05",
      content: "料理の練習",
      isCompleted: true,
    },
    {
      date: "2025-06-06",
      content: "運動習慣",
      isCompleted: true,
    },
    {
      date: "2025-06-07",
      content: "瞑想実践",
      isCompleted: true,
    },
    {
      date: "2025-06-08",
      content: "日記を書く",
      isCompleted: true,
    },
    {
      date: "2025-06-09",
      content: "新しい趣味を始める",
      isCompleted: true,
    },
    {
      date: "2025-06-10",
      content: "友人との交流",
      isCompleted: true,
    },

    // 未完了のタスク（2025年8月の現実的なデータ）
    {
      date: "2025-08-15",
      content: "未完了のタスク1",
      isCompleted: false,
    },
    {
      date: "2025-08-20",
      content: "未完了のタスク2",
      isCompleted: false,
    },
    {
      date: "2025-08-25",
      content: "未完了のタスク3",
      isCompleted: false,
    },
  ]);

  // 登録後の確認
  const finalCount = await db.select().from(taskTable);
  console.log(
    `ダミーデータ登録完了: ${finalCount.length}件のタスクが登録されました`
  );
}
