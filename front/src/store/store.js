import { configureStore } from '@reduxjs/toolkit';
import { tempApi } from 'services/tempApi';

export const store = configureStore({
  reducer: {
    [tempApi.reducerPath]: tempApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tempApi.middleware),
});
