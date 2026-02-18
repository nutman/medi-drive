import { describe, it, expect } from 'vitest';
import { todayISO, tomorrowISO, addOneDay } from './dateDefaults';

describe('todayISO', () => {
  it('returns YYYY-MM-DD format', () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('tomorrowISO', () => {
  it('returns YYYY-MM-DD format', () => {
    expect(tomorrowISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('is one day after today', () => {
    const today = todayISO();
    const tomorrow = tomorrowISO();
    const todayDate = new Date(today);
    const tomorrowDate = new Date(tomorrow);
    const diffDays = (tomorrowDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24);
    expect(diffDays).toBe(1);
  });
});

describe('addOneDay', () => {
  it('returns the next calendar day in YYYY-MM-DD', () => {
    expect(addOneDay('2024-01-15')).toBe('2024-01-16');
    expect(addOneDay('2024-12-31')).toBe('2025-01-01');
  });

  it('returns YYYY-MM-DD format', () => {
    expect(addOneDay('2024-06-01')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
