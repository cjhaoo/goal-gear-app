import type { SmallGearStatus } from './index';

export interface UiSmallGear {
  id: string;
  name: string;
  durationSeconds: number;
  status: SmallGearStatus;
  mediumGearId: string;
  largeGearId: string;
}

export interface UiMediumGear {
  id: string;
  name: string;
  totalSeconds: number;
  smallGearCount: number;
  progress: number;
}

export interface UiLargeGear {
  id: string;
  name: string;
  totalSeconds: number;
  mediumGearCount: number;
  progress: number;
}

export interface UiCategoryData {
  id: string;
  name: string;
  largeGears: UiLargeGear[];
  mediumGears: UiMediumGear[];
  smallGears: UiSmallGear[];
}

export interface UiCategorySummary {
  id: string;
  name: string;
  largeGearCount: number;
}

export interface UiPurchasedGear {
  id: string;
  name: string;
  status: SmallGearStatus;
}
