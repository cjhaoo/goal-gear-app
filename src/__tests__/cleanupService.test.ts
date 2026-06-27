/**
 * 隔日清理服務測試
 */

import { executeEndOfDayCleanup } from '../services/cleanupService';
import { createLargeGear, createMediumGear, createSmallGear } from '../services/gearService';
import { purchaseSmallGear, completeSmallGear } from '../services/purchaseService';
import { AppState } from '../types';

let mockState: AppState;

beforeEach(() => {
  mockState = {
    categories: {
      routine: {
        id: 'routine',
        name: 'Routine',
        isRoutine: true,
        largeGears: [],
      },
    },
    largeGears: {},
    mediumGears: {},
    smallGears: {},
    dailySnapshots: {},
    lastLoadDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // 昨天
  };
});

describe('cleanupService', () => {
  describe('executeEndOfDayCleanup', () => {
    it('should reset completed gears that are older than 24 hours', () => {
      let state = mockState;
      const { newState: state1, largeGearId } = createLargeGear(state, 'routine', '學習');
      const { newState: state2, mediumGearId } = createMediumGear(state1, largeGearId, '讀書');
      const { newState: state3, smallGearId } = createSmallGear(state2, mediumGearId, '讀第1章', 3600);
      const { newState: state4 } = purchaseSmallGear(state3, smallGearId);
      const { newState: state5 } = completeSmallGear(state4, smallGearId);

      // 模擬小裝備在昨天完成
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      state5.smallGears[smallGearId].completedAt = yesterday.getTime();

      const cleanedState = executeEndOfDayCleanup(state5);

      // 應該重置為 available
      expect(cleanedState.smallGears[smallGearId].status).toBe('available');
      expect(cleanedState.smallGears[smallGearId].completedAt).toBeUndefined();
    });

    it('should reset purchased but uncompleted gears', () => {
      let state = mockState;
      const { newState: state1, largeGearId } = createLargeGear(state, 'routine', '學習');
      const { newState: state2, mediumGearId } = createMediumGear(state1, largeGearId, '讀書');
      const { newState: state3, smallGearId } = createSmallGear(state2, mediumGearId, '讀第1章', 3600);
      const { newState: state4 } = purchaseSmallGear(state3, smallGearId);

      expect(state4.smallGears[smallGearId].status).toBe('purchased');

      const cleanedState = executeEndOfDayCleanup(state4);

      // 應該返還到 available
      expect(cleanedState.smallGears[smallGearId].status).toBe('available');
      expect(cleanedState.smallGears[smallGearId].purchasedAt).toBeUndefined();
    });

    it('should update lastLoadDate', () => {
      const today = new Date().toISOString().split('T')[0];
      const cleanedState = executeEndOfDayCleanup(mockState);
      expect(cleanedState.lastLoadDate).toBe(today);
    });
  });
});
