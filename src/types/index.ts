/**
 * 核心資料型別定義
 */

// 小裝備狀態
export type SmallGearStatus = 'available' | 'purchased' | 'completed';

// 小裝備
export interface SmallGear {
  id: string; // UUID
  name: string;
  durationSeconds: number; // 預估所需秒數（每日花費秒數）
  status: SmallGearStatus;
  purchasedAt?: number; // 購買時的 timestamp
  completedAt?: number; // 完成時的 timestamp
  belongsToMedium: string; // 所屬中裝備 ID
}

// 中裝備
export interface MediumGear {
  id: string;
  name: string;
  smallGears: string[]; // 小裝備 ID 陣列
  belongsToLarge: string; // 所屬大裝備 ID
}

// 大裝備
export interface LargeGear {
  id: string;
  name: string;
  mediumGears: string[]; // 中裝備 ID 陣列
  belongsToCategory: string; // 所屬分類 ID
}

// 分類
export interface Category {
  id: string;
  name: string; // "routine" 或用戶定義名稱
  isRoutine: boolean; // 是否為預設 Routine 分類
  largeGears: string[]; // 大裝備 ID 陣列
}

// 日期快照（每日的時間購買記錄）
export interface DailySnapshot {
  date: string; // YYYY-MM-DD
  totalSecondsAvailable: number; // 該日 86400
  secondsUsed: number; // 該日已使用的秒數
  purchasedGears: string[]; // 該日購買的小裝備 ID
}

// 應用狀態
export interface AppState {
  categories: Record<string, Category>;
  largeGears: Record<string, LargeGear>;
  mediumGears: Record<string, MediumGear>;
  smallGears: Record<string, SmallGear>;
  dailySnapshots: Record<string, DailySnapshot>; // key: YYYY-MM-DD
  lastLoadDate: string; // 最後一次載入日期，用於檢測跨日
}

// Routine 自動預設
export interface RoutineAutoPreset {
  mediumGearId: string;
  smallGearIds: string[];
}
