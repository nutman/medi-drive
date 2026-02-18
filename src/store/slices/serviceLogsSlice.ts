import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ServiceLog, ServiceLogFormValues } from '../../types/serviceLog';
import { generateId } from '../../utils/id';

const serviceLogsSlice = createSlice({
  name: 'serviceLogs',
  initialState: [] as ServiceLog[],
  reducers: {
    addServiceLog(state, action: PayloadAction<ServiceLogFormValues>) {
      state.push({
        ...action.payload,
        id: generateId('log'),
        createdAt: Date.now(),
      });
    },
    updateServiceLog(
      state,
      action: PayloadAction<{ id: string } & Partial<ServiceLogFormValues>>
    ) {
      const { id, ...updates } = action.payload;
      const idx = state.findIndex((log) => log.id === id);
      if (idx !== -1) {
        state[idx] = { ...state[idx], ...updates };
      }
    },
    removeServiceLog(state, action: PayloadAction<string>) {
      return state.filter((log) => log.id !== action.payload);
    },
  },
});

export const { addServiceLog, updateServiceLog, removeServiceLog } = serviceLogsSlice.actions;
export default serviceLogsSlice.reducer;
