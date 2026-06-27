/**
 * 裝備管理服務測試
 */

import {
  createCategory,
  createLargeGear,
  createMediumGear,
  createSmallGear,
  deleteCategory,
  deleteLargeGear,
  deleteMediumGear,
  deleteSmallGear,
  updateSmallGear,
  updateMediumGear,
  updateLargeGear,
} from '../services/gearService';
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
    lastLoadDate: '2026-06-27',
  };
});

describe('gearService', () => {
  describe('createCategory', () => {
    it('should create a new category', () => {
      const { newState, categoryId } = createCategory(mockState, '讀書');
      expect(newState.categories[categoryId]).toBeDefined();
      expect(newState.categories[categoryId].name).toBe('讀書');
      expect(newState.categories[categoryId].isRoutine).toBe(false);
    });

    it('should not modify original state', () => {
      const originalLength = Object.keys(mockState.categories).length;
      createCategory(mockState, '讀書');
      expect(Object.keys(mockState.categories).length).toBe(originalLength);
    });
  });

  describe('deleteCategory', () => {
    it('should throw error when deleting routine category', () => {
      expect(() => deleteCategory(mockState, 'routine')).toThrow();
    });

    it('should delete a category and its gears', () => {
      const { newState: stateWithCat, categoryId } = createCategory(mockState, '讀書');
      const { newState: stateWithLarge } = createLargeGear(stateWithCat, categoryId, '英文');
      const finalState = deleteCategory(stateWithLarge, categoryId);
      expect(finalState.categories[categoryId]).toBeUndefined();
    });
  });

  describe('createLargeGear', () => {
    it('should create a large gear in a category', () => {
      const { newState, largeGearId } = createLargeGear(mockState, 'routine', '睡眠');
      expect(newState.largeGears[largeGearId]).toBeDefined();
      expect(newState.largeGears[largeGearId].name).toBe('睡眠');
      expect(newState.categories['routine'].largeGears).toContain(largeGearId);
    });
  });

  describe('createMediumGear', () => {
    it('should create a medium gear in a large gear', () => {
      const { newState: state1, largeGearId } = createLargeGear(mockState, 'routine', '睡眠');
      const { newState: state2, mediumGearId } = createMediumGear(state1, largeGearId, '晚上睡眠');
      expect(state2.mediumGears[mediumGearId]).toBeDefined();
      expect(state2.mediumGears[mediumGearId].name).toBe('晚上睡眠');
      expect(state2.largeGears[largeGearId].mediumGears).toContain(mediumGearId);
    });
  });

  describe('createSmallGear', () => {
    it('should create a small gear in a medium gear', () => {
      const { newState: state1, largeGearId } = createLargeGear(mockState, 'routine', '睡眠');
      const { newState: state2, mediumGearId } = createMediumGear(state1, largeGearId, '晚上睡眠');
      const { newState: state3, smallGearId } = createSmallGear(state2, mediumGearId, '躺在床上', 28800);
      expect(state3.smallGears[smallGearId]).toBeDefined();
      expect(state3.smallGears[smallGearId].name).toBe('躺在床上');
      expect(state3.smallGears[smallGearId].durationSeconds).toBe(28800);
      expect(state3.smallGears[smallGearId].status).toBe('available');
    });
  });

  describe('deleteSmallGear', () => {
    it('should delete a small gear and remove it from medium gear', () => {
      const { newState: state1, largeGearId } = createLargeGear(mockState, 'routine', '睡眠');
      const { newState: state2, mediumGearId } = createMediumGear(state1, largeGearId, '晚上睡眠');
      const { newState: state3, smallGearId } = createSmallGear(state2, mediumGearId, '躺在床上', 28800);
      const state4 = deleteSmallGear(state3, smallGearId);
      expect(state4.smallGears[smallGearId]).toBeUndefined();
      expect(state4.mediumGears[mediumGearId].smallGears).not.toContain(smallGearId);
    });
  });

  describe('updateSmallGear', () => {
    it('should update small gear name and duration', () => {
      const { newState: state1, largeGearId } = createLargeGear(mockState, 'routine', '睡眠');
      const { newState: state2, mediumGearId } = createMediumGear(state1, largeGearId, '晚上睡眠');
      const { newState: state3, smallGearId } = createSmallGear(state2, mediumGearId, '躺在床上', 28800);
      const state4 = updateSmallGear(state3, smallGearId, {
        name: '深度睡眠',
        durationSeconds: 32400,
      });
      expect(state4.smallGears[smallGearId].name).toBe('深度睡眠');
      expect(state4.smallGears[smallGearId].durationSeconds).toBe(32400);
    });
  });

  describe('cascading deletes', () => {
    it('should delete all sub-gears when deleting a large gear', () => {
      const { newState: state1, largeGearId } = createLargeGear(mockState, 'routine', '睡眠');
      const { newState: state2, mediumGearId } = createMediumGear(state1, largeGearId, '晚上睡眠');
      const { newState: state3, smallGearId } = createSmallGear(state2, mediumGearId, '躺在床上', 28800);
      const state4 = deleteLargeGear(state3, largeGearId);
      expect(state4.largeGears[largeGearId]).toBeUndefined();
      expect(state4.mediumGears[mediumGearId]).toBeUndefined();
      expect(state4.smallGears[smallGearId]).toBeUndefined();
    });
  });
});
