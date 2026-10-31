import { describe, expect, it } from 'vitest';
import { formatDate, getStatusDisplayName, getUrgencyDisplayName } from './taskUtils';

describe('taskUtils', () => {
  describe('formatDate', () => {
    it('returns empty string when date is null or undefined', () => {
      expect(formatDate(null)).toBe('');
    });

    it('formats a valid date correctly', () => {
      const date = new Date('2025-12-25T00:00:00Z');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Dec 25, 2025/);
    });
  });

  describe('getStatusDisplayName', () => {
    it('returns proper display names for statuses', () => {
      expect(getStatusDisplayName('todo')).toBe('Todo');
      expect(getStatusDisplayName('in-progress')).toBe('In Progress');
      expect(getStatusDisplayName('done')).toBe('Done');
      expect(getStatusDisplayName('cancelled')).toBe('Cancelled');
    });
  });

  describe('getUrgencyDisplayName', () => {
    it('returns proper display names for urgency levels', () => {
      expect(getUrgencyDisplayName('low')).toBe('Low');
      expect(getUrgencyDisplayName('medium')).toBe('Medium');
      expect(getUrgencyDisplayName('high')).toBe('High');
      expect(getUrgencyDisplayName('critical')).toBe('Critical');
    });
  });
});
