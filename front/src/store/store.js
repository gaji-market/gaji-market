import { configureStore } from '@reduxjs/toolkit';

import tempSlice from './tempSlice';
import toastSlice from './toastSlice';
import sessionSlice from './sessionSlice';

import { signUpApi } from 'services/signUpApi';
import { productApi } from 'services/productApi';
import { chatApi } from 'services/chatApi';
import { alarmApi } from 'services/alarmApi';

export const store = configureStore({
  reducer: {
    temp: tempSlice,
    toast: toastSlice,
    session: sessionSlice,
    [signUpApi.reducerPath]: signUpApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [alarmApi.reducerPath]: alarmApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      signUpApi.middleware,
      productApi.middleware,
      chatApi.middleware,
      alarmApi.middleware,
    ]),
});
