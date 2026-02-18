import { describe, it, expect } from 'vitest';
import { getDefaultFormValues } from './formDefaults';

describe('getDefaultFormValues', () => {
  it('returns an object with all required service log form fields', () => {
    const defaults = getDefaultFormValues();
    expect(defaults).toHaveProperty('providerId', '');
    expect(defaults).toHaveProperty('serviceOrder', '');
    expect(defaults).toHaveProperty('carId', '');
    expect(defaults).toHaveProperty('odometer', 0);
    expect(defaults).toHaveProperty('engineHours', 0);
    expect(defaults).toHaveProperty('startDate');
    expect(defaults).toHaveProperty('endDate');
    expect(defaults).toHaveProperty('type', 'planned');
    expect(defaults).toHaveProperty('serviceDescription', '');
  });

  it('returns dates in YYYY-MM-DD format', () => {
    const defaults = getDefaultFormValues();
    expect(defaults.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(defaults.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
