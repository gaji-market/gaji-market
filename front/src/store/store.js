import { configureStore } from '@reduxjs/toolkit';
import tempSlice from './tempSlice';

import { signUpApi } from 'services/signUpApi';
import { productApi } from 'services/productApi';
import { chatApi } from 'services/chatApi';

export const store = configureStore({
  reducer: {
    temp: tempSlice,
    [signUpApi.reducerPath]: signUpApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      signUpApi.middleware,
      productApi.middleware,
      chatApi.middleware,
    ]),
});
