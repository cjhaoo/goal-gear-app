import { useMemo, useState } from 'react';
import type { UiCategoryData, UiCategorySummary, UiPurchasedGear } from '@/types/ui';

interface MockUiData {
  categories: UiCategoryData[];
  purchasedToday: UiPurchasedGear[];
}

interface UseMockDataResult {
  categories: UiCategorySummary[];
  selectedCategoryId: string;
  selectedCategory: UiCategoryData;
  setSelectedCategoryId: (categoryId: string) => void;
  purchasedToday: UiPurchasedGear[];
}

export const createMockUiData = (): MockUiData => {
  const routineCategory: UiCategoryData = {
    id: 'routine',
    name: 'Routine',
    largeGears: [
      {
        id: 'large-sleep',
        name: '睡眠',
        totalSeconds: 28800,
        mediumGearCount: 1,
        progress: 1,
      },
    ],
    mediumGears: [
      {
        id: 'medium-night-sleep',
        name: '夜間睡眠',
        totalSeconds: 28800,
        smallGearCount: 1,
        progress: 1,
      },
    ],
    smallGears: [
      {
        id: 'small-bed',
        name: '躺在床上',
        durationSeconds: 28800,
        status: 'completed',
        mediumGearId: 'medium-night-sleep',
        largeGearId: 'large-sleep',
      },
    ],
  };

  const studyCategory: UiCategoryData = {
    id: 'study',
    name: '讀書',
    largeGears: [
      {
        id: 'large-english',
        name: '英文學習',
        totalSeconds: 3600,
        mediumGearCount: 1,
        progress: 0.5,
      },
    ],
    mediumGears: [
      {
        id: 'medium-vocabulary',
        name: '背單字',
        totalSeconds: 3600,
        smallGearCount: 2,
        progress: 0.5,
      },
    ],
    smallGears: [
      {
        id: 'small-ac',
        name: 'A-C字彙',
        durationSeconds: 1800,
        status: 'purchased',
        mediumGearId: 'medium-vocabulary',
        largeGearId: 'large-english',
      },
      {
        id: 'small-df',
        name: 'D-F字彙',
        durationSeconds: 1800,
        status: 'available',
        mediumGearId: 'medium-vocabulary',
        largeGearId: 'large-english',
      },
    ],
  };

  return {
    categories: [routineCategory, studyCategory],
    purchasedToday: [
      { id: 'small-bed', name: '躺在床上', status: 'completed' },
      { id: 'small-ac', name: 'A-C字彙', status: 'purchased' },
    ],
  };
};

export const useMockData = (): UseMockDataResult => {
  const mockData = useMemo(() => createMockUiData(), []);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(mockData.categories[0].id);

  const categories = useMemo<UiCategorySummary[]>(
    () =>
      mockData.categories.map((category) => ({
        id: category.id,
        name: category.name,
        largeGearCount: category.largeGears.length,
      })),
    [mockData.categories],
  );

  const selectedCategory =
    mockData.categories.find((category) => category.id === selectedCategoryId) ?? mockData.categories[0];

  return {
    categories,
    selectedCategoryId,
    selectedCategory,
    setSelectedCategoryId,
    purchasedToday: mockData.purchasedToday,
  };
};
