/**
 * 時間服務測試
 */

import {
  formatDate,
  formatSeconds,
  formatSecondsToTimeString,
  formatSecondsToDayString,
  getSecondsElapsedToday,
  getSecondsRemainingToday,
  hasCrossedDay,
  getTodayStartTimestamp,
  getTodayEndTimestamp,
} from '../services/timeService';

describe('timeService', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2026-06-27');
      expect(formatDate(date)).toBe('2026-06-27');
    });

    it('should use today if no date provided', () => {
      const result = formatDate();
      expect(result).toMatch(/\d{4}-\d{2}-\d{2}/);
    });
  });

  describe('formatSeconds', () => {
    it('should format seconds correctly', () => {
      expect(formatSeconds(45)).toBe('45秒');
      expect(formatSeconds(120)).toBe('2分0秒');
      expect(formatSeconds(3661)).toBe('1小時1分');
    });
  });

  describe('formatSecondsToTimeString', () => {
    it('should format to hour:minute', () => {
      expect(formatSecondsToTimeString(3600)).toBe('1小時0分');
      expect(formatSecondsToTimeString(5400)).toBe('1小時30分');
      expect(formatSecondsToTimeString(1800)).toBe('30分');
    });
  });

  describe('formatSecondsToDayString', () => {
    it('should format to day:hour', () => {
      expect(formatSecondsToDayString(86400)).toBe('1天0小時');
      expect(formatSecondsToDayString(172800)).toBe('2天0小時');
      expect(formatSecondsToDayString(90000)).toBe('1天1小時');
    });

    it('should fall back to time string for less than 1 day', () => {
      expect(formatSecondsToDayString(3600)).toBe('1小時0分');
    });
  });

  describe('hasCrossedDay', () => {
    it('should return true if day has changed', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      expect(hasCrossedDay(yesterdayStr)).toBe(true);
    });

    it('should return false if same day', () => {
      const today = formatDate();
      expect(hasCrossedDay(today)).toBe(false);
    });
  });

  describe('getTodayStartTimestamp', () => {
    it('should return midnight timestamp', () => {
      const start = getTodayStartTimestamp();
      const date = new Date(start);
      expect(date.getHours()).toBe(0);
      expect(date.getMinutes()).toBe(0);
      expect(date.getSeconds()).toBe(0);
    });
  });

  describe('getTodayEndTimestamp', () => {
    it('should return end of day timestamp', () => {
      const end = getTodayEndTimestamp();
      const date = new Date(end);
      expect(date.getHours()).toBe(23);
      expect(date.getMinutes()).toBe(59);
    });
  });

  describe('getSecondsElapsedToday and getSecondsRemainingToday', () => {
    it('elapsed + remaining should equal 86400', () => {
      const elapsed = getSecondsElapsedToday();
      const remaining = getSecondsRemainingToday();
      expect(elapsed + remaining).toBe(86400);
    });

    it('remaining should be non-negative', () => {
      const remaining = getSecondsRemainingToday();
      expect(remaining).toBeGreaterThanOrEqual(0);
      expect(remaining).toBeLessThanOrEqual(86400);
    });
  });
});
