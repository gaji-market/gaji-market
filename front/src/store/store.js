import { configureStore } from '@reduxjs/toolkit';

import tempSlice from './tempSlice';

import { tempApi } from 'services/tempApi';

export const store = configureStore({
  reducer: {
    temp: tempSlice,
    [tempApi.reducerPath]: tempApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tempApi.middleware),
});
