/**
 * 裝備管理服務
 * 負責建立、編輯、刪除、級聯更新裝備的業務邏輯
 */

import { v4 as uuidv4 } from 'uuid';
import {
  AppState,
  Category,
  LargeGear,
  MediumGear,
  SmallGear,
} from '../types';

/**
 * 建立新的分類
 */
export function createCategory(
  state: AppState,
  name: string
): { newState: AppState; categoryId: string } {
  const categoryId = uuidv4();
  const newCategory: Category = {
    id: categoryId,
    name,
    isRoutine: false,
    largeGears: [],
  };

  return {
    newState: {
      ...state,
      categories: {
        ...state.categories,
        [categoryId]: newCategory,
      },
    },
    categoryId,
  };
}

/**
 * 刪除分類（以及其下的所有裝備）
 */
export function deleteCategory(
  state: AppState,
  categoryId: string
): AppState {
  if (categoryId === 'routine') {
    throw new Error('Cannot delete Routine category');
  }

  const category = state.categories[categoryId];
  if (!category) return state;

  // 遞迴刪除所有大中小裝備
  let newState = state;
  category.largeGears.forEach((largeId) => {
    newState = deleteLargeGear(newState, largeId);
  });

  // 刪除分類
  const { [categoryId]: _, ...remainingCategories } = state.categories;
  return {
    ...newState,
    categories: remainingCategories,
  };
}

/**
 * 建立新的大裝備
 */
export function createLargeGear(
  state: AppState,
  categoryId: string,
  name: string
): { newState: AppState; largeGearId: string } {
  const largeGearId = uuidv4();
  const newLargeGear: LargeGear = {
    id: largeGearId,
    name,
    mediumGears: [],
    belongsToCategory: categoryId,
  };

  const category = state.categories[categoryId];
  if (!category) {
    throw new Error(`Category ${categoryId} not found`);
  }

  return {
    newState: {
      ...state,
      largeGears: {
        ...state.largeGears,
        [largeGearId]: newLargeGear,
      },
      categories: {
        ...state.categories,
        [categoryId]: {
          ...category,
          largeGears: [...category.largeGears, largeGearId],
        },
      },
    },
    largeGearId,
  };
}

/**
 * 刪除大裝備（以及其下的所有中小裝備）
 */
export function deleteLargeGear(state: AppState, largeGearId: string): AppState {
  const largeGear = state.largeGears[largeGearId];
  if (!largeGear) return state;

  // 遞迴刪除所有中小裝備
  let newState = state;
  largeGear.mediumGears.forEach((mediumId) => {
    newState = deleteMediumGear(newState, mediumId);
  });

  // 從分類中移除
  const category = state.categories[largeGear.belongsToCategory];
  const updatedCategory = {
    ...category,
    largeGears: category.largeGears.filter((id) => id !== largeGearId),
  };

  // 刪除大裝備
  const { [largeGearId]: _, ...remainingLargeGears } = newState.largeGears;
  return {
    ...newState,
    largeGears: remainingLargeGears,
    categories: {
      ...newState.categories,
      [largeGear.belongsToCategory]: updatedCategory,
    },
  };
}

/**
 * 建立新的中裝備
 */
export function createMediumGear(
  state: AppState,
  largeGearId: string,
  name: string
): { newState: AppState; mediumGearId: string } {
  const mediumGearId = uuidv4();
  const newMediumGear: MediumGear = {
    id: mediumGearId,
    name,
    smallGears: [],
    belongsToLarge: largeGearId,
  };

  const largeGear = state.largeGears[largeGearId];
  if (!largeGear) {
    throw new Error(`Large gear ${largeGearId} not found`);
  }

  return {
    newState: {
      ...state,
      mediumGears: {
        ...state.mediumGears,
        [mediumGearId]: newMediumGear,
      },
      largeGears: {
        ...state.largeGears,
        [largeGearId]: {
          ...largeGear,
          mediumGears: [...largeGear.mediumGears, mediumGearId],
        },
      },
    },
    mediumGearId,
  };
}

/**
 * 刪除中裝備（以及其下的所有小裝備）
 */
export function deleteMediumGear(state: AppState, mediumGearId: string): AppState {
  const mediumGear = state.mediumGears[mediumGearId];
  if (!mediumGear) return state;

  // 刪除所有小裝備
  let newState = state;
  mediumGear.smallGears.forEach((smallId) => {
    newState = deleteSmallGear(newState, smallId);
  });

  // 從大裝備中移除
  const largeGear = state.largeGears[mediumGear.belongsToLarge];
  const updatedLargeGear = {
    ...largeGear,
    mediumGears: largeGear.mediumGears.filter((id) => id !== mediumGearId),
  };

  // 刪除中裝備
  const { [mediumGearId]: _, ...remainingMediumGears } = newState.mediumGears;
  return {
    ...newState,
    mediumGears: remainingMediumGears,
    largeGears: {
      ...newState.largeGears,
      [mediumGear.belongsToLarge]: updatedLargeGear,
    },
  };
}

/**
 * 建立新的小裝備
 */
export function createSmallGear(
  state: AppState,
  mediumGearId: string,
  name: string,
  durationSeconds: number
): { newState: AppState; smallGearId: string } {
  const smallGearId = uuidv4();
  const newSmallGear: SmallGear = {
    id: smallGearId,
    name,
    durationSeconds,
    status: 'available',
    belongsToMedium: mediumGearId,
  };

  const mediumGear = state.mediumGears[mediumGearId];
  if (!mediumGear) {
    throw new Error(`Medium gear ${mediumGearId} not found`);
  }

  return {
    newState: {
      ...state,
      smallGears: {
        ...state.smallGears,
        [smallGearId]: newSmallGear,
      },
      mediumGears: {
        ...state.mediumGears,
        [mediumGearId]: {
          ...mediumGear,
          smallGears: [...mediumGear.smallGears, smallGearId],
        },
      },
    },
    smallGearId,
  };
}

/**
 * 刪除小裝備
 */
export function deleteSmallGear(state: AppState, smallGearId: string): AppState {
  const smallGear = state.smallGears[smallGearId];
  if (!smallGear) return state;

  // 從中裝備中移除
  const mediumGear = state.mediumGears[smallGear.belongsToMedium];
  const updatedMediumGear = {
    ...mediumGear,
    smallGears: mediumGear.smallGears.filter((id) => id !== smallGearId),
  };

  // 刪除小裝備
  const { [smallGearId]: _, ...remainingSmallGears } = state.smallGears;
  return {
    ...state,
    smallGears: remainingSmallGears,
    mediumGears: {
      ...state.mediumGears,
      [smallGear.belongsToMedium]: updatedMediumGear,
    },
  };
}

/**
 * 編輯小裝備名稱或時間
 */
export function updateSmallGear(
  state: AppState,
  smallGearId: string,
  updates: Partial<Pick<SmallGear, 'name' | 'durationSeconds'>>
): AppState {
  const smallGear = state.smallGears[smallGearId];
  if (!smallGear) return state;

  return {
    ...state,
    smallGears: {
      ...state.smallGears,
      [smallGearId]: {
        ...smallGear,
        ...updates,
      },
    },
  };
}

/**
 * 編輯中裝備名稱
 */
export function updateMediumGear(
  state: AppState,
  mediumGearId: string,
  name: string
): AppState {
  const mediumGear = state.mediumGears[mediumGearId];
  if (!mediumGear) return state;

  return {
    ...state,
    mediumGears: {
      ...state.mediumGears,
      [mediumGearId]: {
        ...mediumGear,
        name,
      },
    },
  };
}

/**
 * 編輯大裝備名稱
 */
export function updateLargeGear(
  state: AppState,
  largeGearId: string,
  name: string
): AppState {
  const largeGear = state.largeGears[largeGearId];
  if (!largeGear) return state;

  return {
    ...state,
    largeGears: {
      ...state.largeGears,
      [largeGearId]: {
        ...largeGear,
        name,
      },
    },
  };
}
