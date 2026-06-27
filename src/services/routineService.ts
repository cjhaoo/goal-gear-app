/**
 * Routine 自動購買邏輯
 * 每天 00:00 時，自動購買 Routine 分類下所有中裝備的所有小裝備
 */

import { AppState } from '../types';
import { purchaseSmallGear } from './purchaseService';

/**
 * 執行 Routine 自動購買
 * 在 App 啟動時檢測到跨日時呼叫此函數
 * @param state 應用狀態
 * @returns 自動購買後的新應用狀態
 */
export function executeRoutineAutoPurchase(state: AppState): AppState {
  const routineCategory = state.categories['routine'];
  if (!routineCategory) return state;

  let newState = state;

  // 遍歷 Routine 下的所有大裝備
  routineCategory.largeGears.forEach((largeGearId) => {
    const largeGear = state.largeGears[largeGearId];
    if (!largeGear) return;

    // 遍歷每個中裝備
    largeGear.mediumGears.forEach((mediumGearId) => {
      const mediumGear = state.mediumGears[mediumGearId];
      if (!mediumGear) return;

      // 遍歷每個小裝備並購買
      mediumGear.smallGears.forEach((smallGearId) => {
        const { newState: updatedState, success } = purchaseSmallGear(
          newState,
          smallGearId
        );
        if (success) {
          newState = updatedState;
        }
      });
    });
  });

  return newState;
}

/**
 * 獲取 Routine 分類下所有的小裝備 ID
 */
export function getRoutineSmallGearIds(state: AppState): string[] {
  const routineCategory = state.categories['routine'];
  if (!routineCategory) return [];

  const smallGearIds: string[] = [];

  routineCategory.largeGears.forEach((largeGearId) => {
    const largeGear = state.largeGears[largeGearId];
    if (!largeGear) return;

    largeGear.mediumGears.forEach((mediumGearId) => {
      const mediumGear = state.mediumGears[mediumGearId];
      if (!mediumGear) return;

      smallGearIds.push(...mediumGear.smallGears);
    });
  });

  return smallGearIds;
}
