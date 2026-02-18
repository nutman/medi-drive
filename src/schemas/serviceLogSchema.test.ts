import { describe, it, expect } from 'vitest';
import { serviceLogSchema } from './serviceLogSchema';

const validValues = {
  providerId: 'P1',
  serviceOrder: 'SO-001',
  carId: 'C1',
  odometer: 1000,
  engineHours: 50,
  startDate: '2024-01-01',
  endDate: '2024-01-02',
  type: 'planned' as const,
  serviceDescription: 'Oil change',
};

describe('serviceLogSchema', () => {
  it('accepts valid payload', async () => {
    await expect(serviceLogSchema.validate(validValues)).resolves.toEqual(validValues);
  });

  it('rejects missing required fields', async () => {
    await expect(serviceLogSchema.validate({})).rejects.toThrow();
    await expect(serviceLogSchema.validate({ ...validValues, providerId: '' })).rejects.toThrow();
    await expect(serviceLogSchema.validate({ ...validValues, serviceOrder: '' })).rejects.toThrow();
  });

  it('rejects invalid type', async () => {
    await expect(
      serviceLogSchema.validate({ ...validValues, type: 'invalid' })
    ).rejects.toThrow();
  });

  it('rejects end date before start date', async () => {
    await expect(
      serviceLogSchema.validate({
        ...validValues,
        startDate: '2024-01-10',
        endDate: '2024-01-05',
      })
    ).rejects.toThrow(/end date/i);
  });

  it('accepts end date equal to start date', async () => {
    const same = { ...validValues, startDate: '2024-01-01', endDate: '2024-01-01' };
    await expect(serviceLogSchema.validate(same)).resolves.toBeDefined();
  });

  it('rejects negative odometer', async () => {
    await expect(
      serviceLogSchema.validate({ ...validValues, odometer: -1 })
    ).rejects.toThrow();
  });

  it('rejects invalid date format', async () => {
    await expect(
      serviceLogSchema.validate({ ...validValues, startDate: '01/01/2024' })
    ).rejects.toThrow();
  });
});
