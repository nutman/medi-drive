import { describe, it, expect } from 'vitest';
import draftsReducer, {
  addOrUpdateDraft,
  removeDraft,
  clearAllDrafts,
  setCurrentDraftId,
  setSaving,
  setLastSavedAt,
} from './draftsSlice';

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

describe('draftsSlice', () => {
  const initialState = {
    items: [],
    currentDraftId: null,
    saving: false,
    lastSavedAt: null,
  };

  it('has correct initial state', () => {
    expect(draftsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('addOrUpdateDraft adds a new draft when no id', () => {
    const state = draftsReducer(initialState, addOrUpdateDraft(baseValues));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject(baseValues);
    expect(state.items[0]).toHaveProperty('id');
    expect(state.items[0]).toHaveProperty('updatedAt');
    expect(state.currentDraftId).toBe(state.items[0].id);
    expect(state.saving).toBe(false);
  });

  it('addOrUpdateDraft updates existing draft when id matches', () => {
    let state = draftsReducer(initialState, addOrUpdateDraft(baseValues));
    const id = state.items[0].id;
    state = draftsReducer(state, addOrUpdateDraft({ ...baseValues, id, serviceOrder: 'SO-2' }));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].serviceOrder).toBe('SO-2');
    expect(state.items[0].id).toBe(id);
  });

  it('removeDraft removes draft and clears currentDraftId if selected', () => {
    let state = draftsReducer(initialState, addOrUpdateDraft(baseValues));
    const id = state.items[0].id;
    state = draftsReducer(state, removeDraft(id));
    expect(state.items).toHaveLength(0);
    expect(state.currentDraftId).toBeNull();
  });

  it('clearAllDrafts resets state', () => {
    let state = draftsReducer(initialState, addOrUpdateDraft(baseValues));
    state = draftsReducer(state, clearAllDrafts());
    expect(state.items).toHaveLength(0);
    expect(state.currentDraftId).toBeNull();
    expect(state.lastSavedAt).toBeNull();
  });

  it('setCurrentDraftId updates currentDraftId', () => {
    const state = draftsReducer(initialState, setCurrentDraftId('some-id'));
    expect(state.currentDraftId).toBe('some-id');
  });

  it('setSaving updates saving flag', () => {
    const state = draftsReducer(initialState, setSaving(true));
    expect(state.saving).toBe(true);
  });

  it('setLastSavedAt updates lastSavedAt', () => {
    const state = draftsReducer(initialState, setLastSavedAt(12345));
    expect(state.lastSavedAt).toBe(12345);
  });
});
