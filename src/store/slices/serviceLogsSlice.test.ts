import { describe, it, expect } from 'vitest';
import serviceLogsReducer, {
  addServiceLog,
  updateServiceLog,
  removeServiceLog,
} from './serviceLogsSlice';

const baseValues = {
  providerId: 'P1',
  serviceOrder: 'SO-1',
  carId: 'C1',
  odometer: 100,
  engineHours: 10,
  startDate: '2024-01-01',
  endDate: '2024-01-02',
  type: 'planned' as const,
  serviceDescription: 'Test',
};

describe('serviceLogsSlice', () => {
  it('has correct initial state', () => {
    expect(serviceLogsReducer(undefined, { type: 'unknown' })).toEqual([]);
  });

  it('addServiceLog appends a log with id and createdAt', () => {
    const state = serviceLogsReducer([], addServiceLog(baseValues));
    expect(state).toHaveLength(1);
    expect(state[0]).toMatchObject(baseValues);
    expect(state[0]).toHaveProperty('id');
    expect(state[0]).toHaveProperty('createdAt');
    expect(typeof state[0].id).toBe('string');
    expect(typeof state[0].createdAt).toBe('number');
  });

  it('updateServiceLog updates existing log by id', () => {
    let state = serviceLogsReducer([], addServiceLog(baseValues));
    const id = state[0].id;
    state = serviceLogsReducer(state, updateServiceLog({ id, serviceOrder: 'SO-2', odometer: 200 }));
    expect(state).toHaveLength(1);
    expect(state[0].serviceOrder).toBe('SO-2');
    expect(state[0].odometer).toBe(200);
    expect(state[0].id).toBe(id);
  });

  it('updateServiceLog does nothing when id not found', () => {
    let state = serviceLogsReducer([], addServiceLog(baseValues));
    const before = state[0];
    state = serviceLogsReducer(state, updateServiceLog({ id: 'nonexistent', serviceOrder: 'X' }));
    expect(state).toHaveLength(1);
    expect(state[0]).toEqual(before);
  });

  it('removeServiceLog removes log by id', () => {
    let state = serviceLogsReducer([], addServiceLog(baseValues));
    const id = state[0].id;
    state = serviceLogsReducer(state, removeServiceLog(id));
    expect(state).toHaveLength(0);
  });

  it('removeServiceLog leaves others intact', () => {
    let state = serviceLogsReducer([], addServiceLog(baseValues));
    state = serviceLogsReducer(state, addServiceLog({ ...baseValues, serviceOrder: 'SO-2' }));
    const idToRemove = state[0].id;
    state = serviceLogsReducer(state, removeServiceLog(idToRemove));
    expect(state).toHaveLength(1);
    expect(state[0].serviceOrder).toBe('SO-2');
  });
});
