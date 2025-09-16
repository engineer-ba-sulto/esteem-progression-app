import * as FileSystem from "expo-file-system";

const SQLITE_DIR = `${FileSystem.documentDirectory}SQLite/`;

export async function migrateDbFileName(oldNames: string[], newName: string) {
  const newPath = `${SQLITE_DIR}${newName}`;
  const newInfo = await FileSystem.getInfoAsync(newPath);
  if (newInfo.exists && !newInfo.isDirectory) return; // 既に新DBあり

  for (const oldName of oldNames) {
    const oldPath = `${SQLITE_DIR}${oldName}`;
    const oldInfo = await FileSystem.getInfoAsync(oldPath);
    if (!oldInfo.exists || oldInfo.isDirectory) continue;

    // コピーしてから旧を削除（安全）
    await FileSystem.copyAsync({ from: oldPath, to: newPath });
    await FileSystem.deleteAsync(oldPath);
    return;
  }
}
