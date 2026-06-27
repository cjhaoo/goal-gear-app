/**
 * 時間相關服務
 * 核心：實時倒數，每日86400秒，隔日重置
 */

const SECONDS_PER_DAY = 86400;

/**
 * 獲取當前時間戳（毫秒）
 */
export function getCurrentTimestamp(): number {
  return Date.now();
}

/**
 * 獲取當日開始時間戳（00:00:00）
 */
export function getTodayStartTimestamp(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

/**
 * 獲取當日結束時間戳（23:59:59.999）
 */
export function getTodayEndTimestamp(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - 1;
}

/**
 * 將日期轉換為 YYYY-MM-DD 字符串
 */
export function formatDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

/**
 * 獲取當日已流逝的秒數
 * 例如：當前 10:30:45，則已流逝 37845 秒
 */
export function getSecondsElapsedToday(): number {
  const now = getCurrentTimestamp();
  const todayStart = getTodayStartTimestamp();
  return Math.floor((now - todayStart) / 1000);
}

/**
 * 獲取當日剩餘的秒數（即當前可用的時間幣）
 * 例如：當前 10:30:45，則剩餘 48555 秒
 */
export function getSecondsRemainingToday(): number {
  const elapsed = getSecondsElapsedToday();
  return Math.max(0, SECONDS_PER_DAY - elapsed);
}

/**
 * 檢測是否跨日（用於 App 啟動時檢測）
 * @param lastKnownDate 上次已知的日期 (YYYY-MM-DD)
 * @returns true 表示已跨日
 */
export function hasCrossedDay(lastKnownDate: string): boolean {
  const today = formatDate();
  return today !== lastKnownDate;
}

/**
 * 格式化秒數為人類可讀格式
 * @param seconds 秒數
 * @returns 格式化字符串
 */
export function formatSeconds(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}秒`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}分${seconds % 60}秒`;
  }
  const hours = Math.floor(minutes / 60);
  return `${hours}小時${minutes % 60}分`;
}

/**
 * 格式化秒數為「小時:分」格式（中大裝備用）
 * @param seconds 秒數
 * @returns 格式化字符串 e.g. "5小時30分"
 */
export function formatSecondsToTimeString(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours === 0) {
    return `${minutes}分`;
  }
  return `${hours}小時${minutes}分`;
}

/**
 * 格式化秒數為「天:小時」格式（大裝備用）
 * @param seconds 秒數
 * @returns 格式化字符串 e.g. "3天5小時"
 */
export function formatSecondsToDayString(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  if (days === 0) {
    return formatSecondsToTimeString(seconds);
  }
  return `${days}天${hours}小時`;
}
