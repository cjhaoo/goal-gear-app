/**
 * 購買服務測試
 */

import {
  purchaseSmallGear,
  completeSmallGear,
  reversePurchase,
  calculateMediumGearProgress,
  calculateLargeGearProgress,
  calculateMediumGearTotalSeconds,
  calculateLargeGearTotalSeconds,
} from '../services/purchaseService';
import { createLargeGear, createMediumGear, createSmallGear } from '../services/gearService';
import { AppState } from '../types';

let mockState: AppState;
let largeGearId: string;
let mediumGearId: string;
let smallGearId1: string;
let smallGearId2: string;

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
    lastLoadDate: '2026-06-27',
  };

  // 建立測試數據
  let state = mockState;
  let result = createLargeGear(state, 'routine', '讀英文');
  state = result.newState;
  largeGearId = result.largeGearId;

  result = createMediumGear(state, largeGearId, '背單字');
  state = result.newState;
  mediumGearId = result.mediumGearId;

  result = createSmallGear(state, mediumGearId, '背A-C字彙', 1800);
  state = result.newState;
  smallGearId1 = result.smallGearId;

  result = createSmallGear(state, mediumGearId, '背D-F字彙', 1800);
  state = result.newState;
  smallGearId2 = result.smallGearId;

  mockState = state;
});

describe('purchaseService', () => {
  describe('purchaseSmallGear', () => {
    it('should purchase a small gear with available status', () => {
      const { newState, success } = purchaseSmallGear(mockState, smallGearId1);
      expect(success).toBe(true);
      expect(newState.smallGears[smallGearId1].status).toBe('purchased');
      expect(newState.smallGears[smallGearId1].purchasedAt).toBeDefined();
    });

    it('should fail if gear is already purchased', () => {
      const { newState: state1 } = purchaseSmallGear(mockState, smallGearId1);
      const { success } = purchaseSmallGear(state1, smallGearId1);
      expect(success).toBe(false);
    });

    it('should add to daily snapshot', () => {
      const { newState } = purchaseSmallGear(mockState, smallGearId1);
      const today = new Date().toISOString().split('T')[0];
      expect(newState.dailySnapshots[today]).toBeDefined();
      expect(newState.dailySnapshots[today].purchasedGears).toContain(smallGearId1);
      expect(newState.dailySnapshots[today].secondsUsed).toBe(1800);
    });
  });

  describe('completeSmallGear', () => {
    it('should complete a purchased gear', () => {
      const { newState: state1 } = purchaseSmallGear(mockState, smallGearId1);
      const { newState: state2, success } = completeSmallGear(state1, smallGearId1);
      expect(success).toBe(true);
      expect(state2.smallGears[smallGearId1].status).toBe('completed');
      expect(state2.smallGears[smallGearId1].completedAt).toBeDefined();
    });

    it('should fail if gear is not purchased', () => {
      const { success } = completeSmallGear(mockState, smallGearId1);
      expect(success).toBe(false);
    });
  });

  describe('reversePurchase', () => {
    it('should reverse a purchase (without refund)', () => {
      const { newState: state1 } = purchaseSmallGear(mockState, smallGearId1);
      const { newState: state2, success } = reversePurchase(state1, smallGearId1);
      expect(success).toBe(true);
      expect(state2.smallGears[smallGearId1].status).toBe('available');
      expect(state2.smallGears[smallGearId1].purchasedAt).toBeUndefined();
    });

    it('should not refund time', () => {
      const { newState: state1 } = purchaseSmallGear(mockState, smallGearId1);
      const today = new Date().toISOString().split('T')[0];
      expect(state1.dailySnapshots[today].secondsUsed).toBe(1800);

      const { newState: state2 } = reversePurchase(state1, smallGearId1);
      expect(state2.dailySnapshots[today].secondsUsed).toBe(0); // 時間扣除了
    });
  });

  describe('calculateMediumGearProgress', () => {
    it('should calculate progress correctly', () => {
      let state = mockState;
      const { newState: state1 } = purchaseSmallGear(state, smallGearId1);
      const { newState: state2 } = completeSmallGear(state1, smallGearId1);

      const progress = calculateMediumGearProgress(state2, mediumGearId);
      expect(progress).toBe(50); // 1/2 = 50%
    });

    it('should return 0 if medium gear has no small gears', () => {
      const progress = calculateMediumGearProgress(mockState, 'nonexistent');
      expect(progress).toBe(0);
    });
  });

  describe('calculateLargeGearProgress', () => {
    it('should calculate large gear progress', () => {
      let state = mockState;
      const { newState: state1 } = purchaseSmallGear(state, smallGearId1);
      const { newState: state2 } = purchaseSmallGear(state1, smallGearId2);
      const { newState: state3 } = completeSmallGear(state2, smallGearId1);
      const { newState: state4 } = completeSmallGear(state3, smallGearId2);

      const progress = calculateLargeGearProgress(state4, largeGearId);
      expect(progress).toBe(100); // 所有中裝備都完成
    });
  });

  describe('calculateMediumGearTotalSeconds', () => {
    it('should sum all small gear durations', () => {
      const total = calculateMediumGearTotalSeconds(mockState, mediumGearId);
      expect(total).toBe(3600); // 1800 + 1800
    });
  });

  describe('calculateLargeGearTotalSeconds', () => {
    it('should sum all medium gear totals', () => {
      const total = calculateLargeGearTotalSeconds(mockState, largeGearId);
      expect(total).toBe(3600);
    });
  });
});
