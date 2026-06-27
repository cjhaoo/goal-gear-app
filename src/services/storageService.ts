/**
 * 本地儲存服務
 * 基於 AsyncStorage，專門用於 AppState 的持久化
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from '../types';

const APP_STATE_KEY = 'GOAL_GEAR_APP_STATE';
const ROUTINE_PRESET_KEY = 'GOAL_GEAR_ROUTINE_PRESET';

/**
 * 保存應用狀態
 */
export async function saveAppState(state: AppState): Promise<void> {
  try {
    await AsyncStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save app state:', error);
    throw error;
  }
}

/**
 * 載入應用狀態
 */
export async function loadAppState(): Promise<AppState | null> {
  try {
    const data = await AsyncStorage.getItem(APP_STATE_KEY);
    if (!data) return null;
    return JSON.parse(data) as AppState;
  } catch (error) {
    console.error('Failed to load app state:', error);
    return null;
  }
}

/**
 * 初始化應用狀態（第一次啟動）
 */
export async function initializeAppState(): Promise<AppState> {
  const initialState: AppState = {
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
    lastLoadDate: new Date().toISOString().split('T')[0],
  };
  await saveAppState(initialState);
  return initialState;
}

/**
 * 清除所有資料（測試用）
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(APP_STATE_KEY);
    await AsyncStorage.removeItem(ROUTINE_PRESET_KEY);
  } catch (error) {
    console.error('Failed to clear data:', error);
    throw error;
  }
}
