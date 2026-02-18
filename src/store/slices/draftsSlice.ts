import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ServiceLogDraft, ServiceLogFormValues } from '../../types/serviceLog';

function generateId(): string {
  return crypto.randomUUID?.() ?? `draft-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface DraftsState {
  items: ServiceLogDraft[];
  currentDraftId: string | null;
  saving: boolean;
  lastSavedAt: number | null;
}

const initialState: DraftsState = {
  items: [],
  currentDraftId: null,
  saving: false,
  lastSavedAt: null,
};

const draftsSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    setSaving(state, action: PayloadAction<boolean>) {
      state.saving = action.payload;
    },
    setLastSavedAt(state, action: PayloadAction<number | null>) {
      state.lastSavedAt = action.payload;
    },
    addOrUpdateDraft(state, action: PayloadAction<ServiceLogFormValues & { id?: string }>) {
      const now = Date.now();
      const { id, ...values } = action.payload;
      if (id && state.items.some((d) => d.id === id)) {
        const idx = state.items.findIndex((d) => d.id === id);
        state.items[idx] = { ...state.items[idx], ...values, id, updatedAt: now };
      } else {
        const newId = id ?? generateId();
        state.items.push({ ...values, id: newId, updatedAt: now });
        state.currentDraftId = newId;
      }
      state.lastSavedAt = now;
      state.saving = false;
    },
    removeDraft(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.items = state.items.filter((d) => d.id !== id);
      if (state.currentDraftId === id) state.currentDraftId = null;
    },
    clearAllDrafts(state) {
      state.items = [];
      state.currentDraftId = null;
      state.lastSavedAt = null;
    },
    setCurrentDraftId(state, action: PayloadAction<string | null>) {
      state.currentDraftId = action.payload;
    },
  },
});

export const {
  setSaving,
  setLastSavedAt,
  addOrUpdateDraft,
  removeDraft,
  clearAllDrafts,
  setCurrentDraftId,
} = draftsSlice.actions;
export default draftsSlice.reducer;
