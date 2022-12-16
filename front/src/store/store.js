import { configureStore } from '@reduxjs/toolkit';
import tempSlice from './tempSlice';

import { signUpApi } from 'services/signUpApi';
import { productApi } from 'services/productApi';

export const store = configureStore({
  reducer: {
    temp: tempSlice,
    [signUpApi.reducerPath]: signUpApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([signUpApi.middleware, productApi.middleware]),
});
