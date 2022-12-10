import { configureStore } from '@reduxjs/toolkit';

import tempSlice from './tempSlice';

import { signUpApi } from 'services/signUpApi';

export const store = configureStore({
  reducer: {
    temp: tempSlice,
    [signUpApi.reducerPath]: signUpApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(signUpApi.middleware),
});
