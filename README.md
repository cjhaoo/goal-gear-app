# 🎮 Goal Gear App

用時間管理你的人生目標。像購買遊戲裝備一樣，用"我有"換"我想要"。

## 🎯 核心概念

- **時間貨幣**：86400秒/天（24小時），從午夜倒數
- **三層裝備**：小裝備（日常行動）→ 中裝備（中期目標）→ 大裝備（終極目標）
- **Routine分類**：預設分類，每天自動購買（睡覺、運動等必做事項）
- **購買≠完成**：購買表示"今天計畫做"，complete按鈕表示"確實做完"

## 🏗️ 專案結構

```
src/
├── types/              # TypeScript 型別定義
├── services/           # 核心業務邏輯
│   ├── timeService.ts              # 實時倒數計算
│   ├── storageService.ts           # AsyncStorage 持久化
│   ├── gearService.ts              # 裝備建立/編輯/刪除
│   ├── purchaseService.ts          # 購買/完成邏輯
│   ├── routineService.ts           # Routine 自動購買
│   └── cleanupService.ts           # 隔日清理
├── store/              # 全局狀態管理（Zustand）
├── components/         # React 組件（待開發）
├── screens/           # 頁面（待開發）
└── app.tsx            # 入口點（待開發）
```

## 📋 核心功能

### ✅ 已實現

- 時間倒數系統（實時更新，App 關閉也算）
- 跨日檢測與自動清理
- Routine 自動購買（每天 00:00）
- 三層裝備管理與級聯更新
- 購買與完成分離
- 本地存儲持久化
- 完整的 TypeScript 型別系統

### 🚧 待開發

- UI 層（分類選擇、三列展示、倒數顯示）
- 購買按鈕與 complete 按鈕
- 推薦排序算法 UI
- 新增裝備流程 UI

## 🚀 快速開始

### 安裝依賴

```bash
npm install
```

### 運行（Web 測試版本）

```bash
npm run web
```

### 運行（手機版本）

```bash
# iOS
npm run ios

# Android
npm run android
```

### 執行測試

```bash
npm test
```

## 📊 關鍵業務規則

1. **時間倒數**：每秒 -1，閉 App 也算
2. **時間不退款**：購買後未完成，隔天返還但不退秒數
3. **小裝備可重複購買**：同一個小裝備可多日購買
4. **隔日清理**：
   - 已完成小裝備：24h 後自動刪除
   - 未完成小裝備：返還到購買欄
   - Routine 小裝備：隔天重新自動購買
5. **Routine 優先**：每天 00:00 最優先購買
6. **排序規則**：完成度高→低
7. **推薦算法**：規則式（未完成 → 中裝備完成度 → 價格）

## 🔧 API 使用範例

### 初始化應用

```typescript
import { useAppStore } from '@/store/appStore';

const App = () => {
  const { appState, initialize, secondsRemaining } = useAppStore();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <div>
      <p>時間剩餘: {secondsRemaining}秒</p>
    </div>
  );
};
```

### 建立新分類

```typescript
import { createCategory } from '@/services/gearService';

const { newState, categoryId } = createCategory(appState, '讀書');
await updateAppState(newState);
```

### 購買小裝備

```typescript
import { purchaseSmallGear } from '@/services/purchaseService';

const { newState, success } = purchaseSmallGear(appState, smallGearId);
if (success) {
  await updateAppState(newState);
}
```

### 完成小裝備

```typescript
import { completeSmallGear } from '@/services/purchaseService';

const { newState, success } = completeSmallGear(appState, smallGearId);
if (success) {
  await updateAppState(newState);
}
```

## 📐 數據結構

詳見 `src/types/index.ts`

```typescript
type SmallGearStatus = 'available' | 'purchased' | 'completed';

interface AppState {
  categories: Record<string, Category>;
  largeGears: Record<string, LargeGear>;
  mediumGears: Record<string, MediumGear>;
  smallGears: Record<string, SmallGear>;
  dailySnapshots: Record<string, DailySnapshot>;
  lastLoadDate: string;
}
```

## 🧪 測試

核心業務邏輯已包含單元測試。執行：

```bash
npm test
```

## 🔮 下一步

1. 實現 UI 層（React Native 組件）
2. 集成 Firebase/Supabase 雲端同步
3. 打包成 iOS/Android App
4. 添加推送通知功能
5. 社交分享與對標功能

## 📝 許可證

MIT
