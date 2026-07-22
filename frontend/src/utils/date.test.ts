import { describe, it, expect, vi, afterEach } from 'vitest';
import { isOverdue, todayISO } from './date';

describe('isOverdue', () => {
  afterEach(() => vi.useRealTimers());

  it('returns true for a past due date with status Pending', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-22T10:00:00'));
    expect(isOverdue('2026-07-20', 'Pending')).toBe(true);
  });

  it('returns true for a past due date with status In Progress', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-22T10:00:00'));
    expect(isOverdue('2026-07-01', 'In Progress')).toBe(true);
  });

  it('returns false for a completed task even if the due date has passed', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-22T10:00:00'));
    expect(isOverdue('2026-07-01', 'Completed')).toBe(false);
  });

  it('returns false when the due date is today', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-22T23:00:00'));
    expect(isOverdue('2026-07-22', 'Pending')).toBe(false);
  });

  it('returns false for a future due date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-22T10:00:00'));
    expect(isOverdue('2026-08-01', 'Pending')).toBe(false);
  });
});

describe('todayISO', () => {
  it('returns the current date in YYYY-MM-DD format', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-22T15:30:00Z'));
    expect(todayISO()).toBe('2026-07-22');
    vi.useRealTimers();
  });
});
