/**
 * 購買與完成邏輯服務
 * 負責小裝備的購買、完成、撤銷、進度計算等
 */

import { AppState, SmallGear, DailySnapshot } from '../types';
import { formatDate, getSecondsRemainingToday } from './timeService';

/**
 * 購買小裝備
 * @param state 應用狀態
 * @param smallGearId 小裝備 ID
 * @returns 新的應用狀態和購買結果
 */
export function purchaseSmallGear(
  state: AppState,
  smallGearId: string
): { newState: AppState; success: boolean; reason?: string } {
  const smallGear = state.smallGears[smallGearId];
  if (!smallGear) {
    return { newState: state, success: false, reason: 'Small gear not found' };
  }

  if (smallGear.status !== 'available') {
    return {
      newState: state,
      success: false,
      reason: 'Small gear is not available',
    };
  }

  // 檢查時間是否足夠
  const remaining = getSecondsRemainingToday();
  if (remaining < smallGear.durationSeconds) {
    return {
      newState: state,
      success: false,
      reason: 'Not enough time remaining today',
    };
  }

  const today = formatDate();
  const currentSnapshot = state.dailySnapshots[today] || {
    date: today,
    totalSecondsAvailable: 86400,
    secondsUsed: 0,
    purchasedGears: [],
  };

  // 更新小裝備狀態
  const updatedSmallGear: SmallGear = {
    ...smallGear,
    status: 'purchased',
    purchasedAt: Date.now(),
  };

  // 更新日快照
  const updatedSnapshot: DailySnapshot = {
    ...currentSnapshot,
    secondsUsed: currentSnapshot.secondsUsed + smallGear.durationSeconds,
    purchasedGears: [...currentSnapshot.purchasedGears, smallGearId],
  };

  return {
    newState: {
      ...state,
      smallGears: {
        ...state.smallGears,
        [smallGearId]: updatedSmallGear,
      },
      dailySnapshots: {
        ...state.dailySnapshots,
        [today]: updatedSnapshot,
      },
    },
    success: true,
  };
}

/**
 * 完成小裝備
 * 按下 complete 按鈕時呼叫此函數
 * @param state 應用狀態
 * @param smallGearId 小裝備 ID
 * @returns 新的應用狀態和完成結果
 */
export function completeSmallGear(
  state: AppState,
  smallGearId: string
): { newState: AppState; success: boolean; reason?: string } {
  const smallGear = state.smallGears[smallGearId];
  if (!smallGear) {
    return { newState: state, success: false, reason: 'Small gear not found' };
  }

  if (smallGear.status !== 'purchased') {
    return {
      newState: state,
      success: false,
      reason: 'Small gear has not been purchased',
    };
  }

  // 更新小裝備狀態
  const updatedSmallGear: SmallGear = {
    ...smallGear,
    status: 'completed',
    completedAt: Date.now(),
  };

  // 計算中大裝備的進度
  let newState = {
    ...state,
    smallGears: {
      ...state.smallGears,
      [smallGearId]: updatedSmallGear,
    },
  };

  // 級聯更新進度（目前不在 state 存儲，由前端計算）
  newState = cascadeUpdateProgress(newState, smallGearId);

  return { newState, success: true };
}

/**
 * 級聯更新進度（小裝備完成 → 中裝備 → 大裝備）
 */
function cascadeUpdateProgress(state: AppState, smallGearId: string): AppState {
  const smallGear = state.smallGears[smallGearId];
  if (!smallGear) return state;

  // 目前進度由前端計算，此函數預留以備將來需要
  return state;
}

/**
 * 撤銷購買（未完成前可退）
 */
export function reversePurchase(
  state: AppState,
  smallGearId: string
): { newState: AppState; success: boolean; reason?: string } {
  const smallGear = state.smallGears[smallGearId];
  if (!smallGear) {
    return { newState: state, success: false, reason: 'Small gear not found' };
  }

  if (smallGear.status !== 'purchased') {
    return {
      newState: state,
      success: false,
      reason: 'Small gear is not purchased',
    };
  }

  const today = formatDate();
  const currentSnapshot = state.dailySnapshots[today];

  if (!currentSnapshot) {
    return {
      newState: state,
      success: false,
      reason: 'No daily snapshot found',
    };
  }

  // 更新小裝備狀態
  const updatedSmallGear: SmallGear = {
    ...smallGear,
    status: 'available',
    purchasedAt: undefined,
  };

  // 更新日快照（注意：不退錢，秒數不返還）
  const updatedSnapshot: DailySnapshot = {
    ...currentSnapshot,
    secondsUsed: Math.max(
      0,
      currentSnapshot.secondsUsed - smallGear.durationSeconds
    ),
    purchasedGears: currentSnapshot.purchasedGears.filter(
      (id) => id !== smallGearId
    ),
  };

  return {
    newState: {
      ...state,
      smallGears: {
        ...state.smallGears,
        [smallGearId]: updatedSmallGear,
      },
      dailySnapshots: {
        ...state.dailySnapshots,
        [today]: updatedSnapshot,
      },
    },
    success: true,
  };
}

/**
 * 計算中裝備的完成度（%）
 */
export function calculateMediumGearProgress(
  state: AppState,
  mediumGearId: string
): number {
  const mediumGear = state.mediumGears[mediumGearId];
  if (!mediumGear || mediumGear.smallGears.length === 0) return 0;

  const completed = mediumGear.smallGears.filter(
    (smallId) => state.smallGears[smallId]?.status === 'completed'
  ).length;

  return Math.round((completed / mediumGear.smallGears.length) * 100);
}

/**
 * 計算大裝備的完成度（%）
 */
export function calculateLargeGearProgress(
  state: AppState,
  largeGearId: string
): number {
  const largeGear = state.largeGears[largeGearId];
  if (!largeGear || largeGear.mediumGears.length === 0) return 0;

  const completed = largeGear.mediumGears.filter((mediumId) => {
    const mediumGear = state.mediumGears[mediumId];
    if (!mediumGear) return false;
    return (
      mediumGear.smallGears.length > 0 &&
      mediumGear.smallGears.every(
        (smallId) => state.smallGears[smallId]?.status === 'completed'
      )
    );
  }).length;

  return Math.round((completed / largeGear.mediumGears.length) * 100);
}

/**
 * 計算中裝備的總秒數
 */
export function calculateMediumGearTotalSeconds(
  state: AppState,
  mediumGearId: string
): number {
  const mediumGear = state.mediumGears[mediumGearId];
  if (!mediumGear) return 0;

  return mediumGear.smallGears.reduce((sum, smallId) => {
    return sum + (state.smallGears[smallId]?.durationSeconds || 0);
  }, 0);
}

/**
 * 計算大裝備的總秒數
 */
export function calculateLargeGearTotalSeconds(
  state: AppState,
  largeGearId: string
): number {
  const largeGear = state.largeGears[largeGearId];
  if (!largeGear) return 0;

  return largeGear.mediumGears.reduce((sum, mediumId) => {
    return sum + calculateMediumGearTotalSeconds(state, mediumId);
  }, 0);
}
