/**
 * 應用全局狀態管理
 * 使用 Zustand 管理 AppState
 */

import { create } from 'zustand';
import { AppState } from '../types';
import { saveAppState, loadAppState, initializeAppState } from '../services/storageService';
import { hasCrossedDay, formatDate, getSecondsRemainingToday } from '../services/timeService';
import { executeRoutineAutoPurchase } from '../services/routineService';
import { executeEndOfDayCleanup } from '../services/cleanupService';

interface AppStoreState {
  appState: AppState | null;
  secondsRemaining: number;
  isLoading: boolean;
  error: string | null;

  // 初始化
  initialize: () => Promise<void>;

  // 狀態更新
  updateAppState: (newState: AppState) => Promise<void>;

  // 時間更新（每秒呼叫一次）
  updateSecondsRemaining: () => void;
}

export const useAppStore = create<AppStoreState>((set, get) => ({
  appState: null,
  secondsRemaining: 86400,
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      let state = await loadAppState();

      if (!state) {
        // 第一次啟動，初始化
        state = await initializeAppState();
      } else {
        // 檢測是否跨日
        if (hasCrossedDay(state.lastLoadDate)) {
          // 執行隔日清理
          state = executeEndOfDayCleanup(state);
          // 執行 Routine 自動購買
          state = executeRoutineAutoPurchase(state);
          // 保存更新
          await saveAppState(state);
        }
      }

      set({ appState: state, secondsRemaining: getSecondsRemainingToday() });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to initialize';
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateAppState: async (newState: AppState) => {
    try {
      await saveAppState(newState);
      set({ appState: newState });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update state';
      set({ error: message });
    }
  },

  updateSecondsRemaining: () => {
    set({ secondsRemaining: getSecondsRemainingToday() });
  },
}));
