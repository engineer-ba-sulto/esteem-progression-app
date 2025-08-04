import { Day } from "@/types/day";
import { Todo } from "@/types/todo";

// Mock data for the three days
export const mockTasks: Record<Day, Todo | null> = {
  yesterday: {
    id: 0,
    text: "古いデザインをアーカイブ",
    completed: true,
    description: "プロジェクトのクリーンアップ。",
  },
  today: {
    id: 1,
    text: "UIデザインのレビュー",
    completed: false,
    description:
      "Figmaの最新デザイン案を確認し、開発チームへのフィードバックをまとめる。",
  },
  tomorrow: null,
};
