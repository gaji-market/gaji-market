import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const alarmApi = createApi({
  reducerPath: 'alarmApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/notifi`,
  }),
  tagTypes: ['Message', 'ChatRoom'],
  endpoints: ({ query, mutation }) => ({}),
});

export const {} = alarmApi;
