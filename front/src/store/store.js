import { configureStore } from '@reduxjs/toolkit';
import tempSlice from './tempSlice';
import { productApi } from 'services/productApi';

import { signUpApi } from 'services/signUpApi';

export const store = configureStore({
  reducer: {
    temp: tempSlice,
    [signUpApi.reducerPath]: signUpApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(signUpApi.middleware),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productApi.middleware),
});
