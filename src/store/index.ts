import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, type PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import draftsReducer from './slices/draftsSlice';
import serviceLogsReducer from './slices/serviceLogsSlice';

const rootReducer = combineReducers({
  drafts: draftsReducer,
  serviceLogs: serviceLogsReducer,
});

type RootState = ReturnType<typeof rootReducer>;

const persistConfig: PersistConfig<RootState> = {
  key: 'medidrive-root',
  storage,
  whitelist: ['drafts', 'serviceLogs'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: { ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'] } }),
});

export const persistor = persistStore(store, {
  onError: (err) => {
    console.error('redux-persist failed:', err);
  },
});
export type { RootState };
export type AppDispatch = typeof store.dispatch;
