/**
 * 隔日清理邏輯
 * 每天 00:00 時或 App 啟動時檢測到跨日，執行以下清理：
 * 1. 已完成的小裝備超過 24h 後自動從"已有"欄刪除
 * 2. 未完成的小裝備返還到購買欄（不退錢）
 */

import { AppState } from '../types';
import { formatDate } from './timeService';

/**
 * 執行隔日清理
 * @param state 應用狀態
 * @returns 清理後的應用狀態
 */
export function executeEndOfDayCleanup(state: AppState): AppState {
  let newState = state;
  const yesterday = calculateYesterdayDate();

  // 遍歷所有小裝備
  Object.entries(state.smallGears).forEach(([smallGearId, smallGear]) => {
    if (smallGear.status === 'completed' && smallGear.completedAt) {
      // 檢查完成時間是否超過 24 小時
      const completedDate = formatDate(new Date(smallGear.completedAt));
      if (completedDate === yesterday) {
        // 超過 24 小時，從已有欄刪除（重置為 available）
        newState = {
          ...newState,
          smallGears: {
            ...newState.smallGears,
            [smallGearId]: {
              ...smallGear,
              status: 'available',
              completedAt: undefined,
              purchasedAt: undefined,
            },
          },
        };
      }
    }
  });

  // 清理未完成的小裝備（返還到購買欄）
  newState = cleanupUncompletedGears(newState);

  // 重置 lastLoadDate
  newState = {
    ...newState,
    lastLoadDate: formatDate(),
  };

  return newState;
}

/**
 * 計算昨天的日期
 */
function calculateYesterdayDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDate(yesterday);
}

/**
 * 清理未完成的小裝備（返還到購買欄）
 * 注意：這不退錢，只改變狀態
 */
export function cleanupUncompletedGears(state: AppState): AppState {
  let newState = state;

  Object.entries(state.smallGears).forEach(([smallGearId, smallGear]) => {
    if (smallGear.status === 'purchased') {
      // 未完成的已購買小裝備返還
      newState = {
        ...newState,
        smallGears: {
          ...newState.smallGears,
          [smallGearId]: {
            ...smallGear,
            status: 'available',
            purchasedAt: undefined,
          },
        },
      };
    }
  });

  return newState;
}
